create extension if not exists "pgcrypto";
create extension if not exists "btree_gist";

do $$ begin
  create type public.app_role as enum ('customer', 'care_partner', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.approval_status as enum ('not_submitted', 'pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.verification_status as enum ('pending', 'in_review', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.training_status as enum ('not_started', 'in_progress', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.booking_status as enum
    ('pending','accepted','rejected','confirmed','in_progress','completed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.complaint_status as enum ('open','investigating','resolved','dismissed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.record_status as enum ('pending','in_progress','completed','failed');
exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  email       text not null default '',
  phone       text,
  role        public.app_role not null default 'customer',
  avatar_url  text,
  city        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists profiles_role_idx on public.profiles(role);

create table if not exists public.user_roles (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role    public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
create index if not exists user_roles_user_idx on public.user_roles(user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin');
$$;

create or replace function public.guard_profile_role()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.has_role(auth.uid(), 'admin') then
    new.role := old.role;
  end if;
  return new;
end $$;

create table if not exists public.platform_settings (
  id                  int primary key default 1 check (id = 1),
  default_hourly_rate numeric(10,2) not null default 250.00 check (default_hourly_rate > 0),
  currency            text not null default 'INR',
  min_duration_hours  int not null default 1 check (min_duration_hours > 0),
  max_duration_hours  int not null default 12 check (max_duration_hours > 0),
  updated_at          timestamptz not null default now()
);

create table if not exists public.care_tasks (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text not null default '',
  category    text not null default 'general',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists care_tasks_active_idx on public.care_tasks(is_active);

create table if not exists public.care_partners (
  id                  uuid primary key default gen_random_uuid(),
  profile_id          uuid not null unique references public.profiles(id) on delete cascade,
  bio                 text not null default '',
  experience_years    int not null default 0 check (experience_years >= 0),
  languages           text not null default 'Hindi, English',
  service_area        text not null default '',
  hourly_rate         numeric(10,2) not null default 250.00 check (hourly_rate > 0),
  approval_status     public.approval_status not null default 'not_submitted',
  verification_status public.verification_status not null default 'pending',
  training_status     public.training_status not null default 'not_started',
  admin_notes         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists care_partners_approval_idx on public.care_partners(approval_status);
create index if not exists care_partners_profile_idx on public.care_partners(profile_id);

create table if not exists public.care_partner_tasks (
  care_partner_id uuid not null references public.care_partners(id) on delete cascade,
  care_task_id    uuid not null references public.care_tasks(id) on delete cascade,
  primary key (care_partner_id, care_task_id)
);

create table if not exists public.availability (
  id              uuid primary key default gen_random_uuid(),
  care_partner_id uuid not null references public.care_partners(id) on delete cascade,
  date            date not null,
  start_time      time not null,
  end_time        time not null,
  is_available    boolean not null default true,
  created_at      timestamptz not null default now(),
  check (end_time > start_time),
  unique (care_partner_id, date, start_time, end_time)
);
create index if not exists availability_partner_date_idx on public.availability(care_partner_id, date);

create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  customer_id     uuid not null references public.profiles(id) on delete cascade,
  care_partner_id uuid not null references public.care_partners(id) on delete restrict,
  date            date not null,
  start_time      time not null,
  end_time        time not null,
  duration_hours  numeric(4,2) not null check (duration_hours > 0),
  hourly_rate     numeric(10,2) not null check (hourly_rate > 0),
  total_amount    numeric(10,2) not null check (total_amount >= 0),
  address         text not null,
  instructions    text,
  status          public.booking_status not null default 'pending',
  terms_accepted  boolean not null default false check (terms_accepted = true),
  cancelled_by    uuid references public.profiles(id) on delete set null,
  cancel_reason   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (end_time > start_time),
  slot tstzrange generated always as
    (tstzrange((date + start_time) at time zone 'UTC', (date + end_time) at time zone 'UTC', '[)')) stored
);
create index if not exists bookings_customer_idx on public.bookings(customer_id);
create index if not exists bookings_partner_idx on public.bookings(care_partner_id);
create index if not exists bookings_date_idx on public.bookings(date);
create index if not exists bookings_status_idx on public.bookings(status);

do $$ begin
  alter table public.bookings
    add constraint bookings_no_double_booking
    exclude using gist (
      care_partner_id with =,
      slot with &&
    ) where (status in ('pending','accepted','confirmed','in_progress'));
exception when duplicate_object then null; end $$;

create table if not exists public.reviews (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null unique references public.bookings(id) on delete cascade,
  customer_id     uuid not null references public.profiles(id) on delete cascade,
  care_partner_id uuid not null references public.care_partners(id) on delete cascade,
  rating          int not null check (rating between 1 and 5),
  comment         text,
  created_at      timestamptz not null default now()
);
create index if not exists reviews_partner_idx on public.reviews(care_partner_id);

create table if not exists public.training_records (
  id              uuid primary key default gen_random_uuid(),
  care_partner_id uuid not null references public.care_partners(id) on delete cascade,
  training_name   text not null,
  status          public.record_status not null default 'pending',
  notes           text,
  completed_at    timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists training_partner_idx on public.training_records(care_partner_id);

create table if not exists public.verification_records (
  id                uuid primary key default gen_random_uuid(),
  care_partner_id   uuid not null references public.care_partners(id) on delete cascade,
  verification_type text not null,
  status            public.record_status not null default 'pending',
  notes             text,
  verified_at       timestamptz,
  created_at        timestamptz not null default now()
);
create index if not exists verification_partner_idx on public.verification_records(care_partner_id);

create table if not exists public.complaints (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid references public.bookings(id) on delete set null,
  reported_by  uuid not null references public.profiles(id) on delete cascade,
  against_user uuid references public.profiles(id) on delete set null,
  description  text not null,
  status       public.complaint_status not null default 'open',
  resolution   text,
  created_at   timestamptz not null default now()
);
create index if not exists complaints_status_idx on public.complaints(status);

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  title      text not null,
  message    text not null default '',
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, is_read);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role before update on public.profiles
  for each row execute function public.guard_profile_role();

drop trigger if exists care_partners_set_updated_at on public.care_partners;
create trigger care_partners_set_updated_at before update on public.care_partners
  for each row execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested text := coalesce(new.raw_user_meta_data ->> 'role', 'customer');
  final_role public.app_role;
begin
  if requested = 'care_partner' then
    final_role := 'care_partner';
  else
    final_role := 'customer';
  end if;

  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'phone',
    final_role
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, final_role)
  on conflict do nothing;

  if final_role = 'care_partner' then
    insert into public.care_partners (profile_id, hourly_rate)
    values (new.id, coalesce((select default_hourly_rate from public.platform_settings where id = 1), 250.00))
    on conflict (profile_id) do nothing;
  end if;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.notify_booking_change()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  partner_profile uuid;
begin
  select profile_id into partner_profile from public.care_partners where id = new.care_partner_id;

  if tg_op = 'INSERT' then
    insert into public.notifications (user_id, title, message, link)
    values (partner_profile, 'New booking request',
            'You have a new booking request for ' || new.date || '.', '/partner/bookings');
    insert into public.notifications (user_id, title, message, link)
    values (new.customer_id, 'Booking requested',
            'Your booking for ' || new.date || ' was sent to your Care Partner.', '/bookings');
  elsif new.status is distinct from old.status then
    insert into public.notifications (user_id, title, message, link)
    values (new.customer_id, 'Booking ' || new.status,
            'Your booking on ' || new.date || ' is now ' || new.status || '.', '/bookings');
    insert into public.notifications (user_id, title, message, link)
    values (partner_profile, 'Booking ' || new.status,
            'Booking on ' || new.date || ' is now ' || new.status || '.', '/partner/bookings');
  end if;
  return new;
end $$;

drop trigger if exists bookings_notify on public.bookings;
create trigger bookings_notify after insert or update on public.bookings
  for each row execute function public.notify_booking_change();

create or replace function public.validate_booking()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  cp record;
begin
  select * into cp from public.care_partners where id = new.care_partner_id;
  if cp is null then
    raise exception 'Care Partner not found';
  end if;
  if tg_op = 'INSERT' and cp.approval_status <> 'approved' then
    raise exception 'This Care Partner is not approved for bookings yet';
  end if;
  if tg_op = 'INSERT' then
    new.hourly_rate := cp.hourly_rate;
    new.duration_hours := round(extract(epoch from (new.end_time - new.start_time))::numeric / 3600.0, 2);
    new.total_amount := round(new.hourly_rate * new.duration_hours, 2);
  end if;
  return new;
end $$;

drop trigger if exists bookings_validate on public.bookings;
create trigger bookings_validate before insert or update on public.bookings
  for each row execute function public.validate_booking();

create or replace function public.guard_care_partner_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(auth.uid(), 'admin') then
    if new.approval_status is distinct from old.approval_status
       and not (old.approval_status in ('not_submitted','rejected') and new.approval_status = 'pending') then
      new.approval_status := old.approval_status;
    end if;
    new.verification_status := old.verification_status;
    new.training_status     := old.training_status;
    new.hourly_rate         := old.hourly_rate;
  end if;
  return new;
end $$;

drop trigger if exists care_partners_guard_status on public.care_partners;
create trigger care_partners_guard_status before update on public.care_partners
  for each row execute function public.guard_care_partner_status();

grant select on public.care_tasks to anon, authenticated;
grant select on public.platform_settings to anon, authenticated;
grant select on public.care_partners to anon, authenticated;
grant select on public.care_partner_tasks to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant select on public.availability to anon, authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.care_partners to authenticated;
grant select, insert, update, delete on public.care_partner_tasks to authenticated;
grant select, insert, update, delete on public.availability to authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.reviews to authenticated;
grant select, insert, update, delete on public.complaints to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.care_tasks to authenticated;
grant select, insert, update, delete on public.training_records to authenticated;
grant select, insert, update, delete on public.verification_records to authenticated;
grant select, update on public.platform_settings to authenticated;
grant select on public.user_roles to authenticated;
grant all on all tables in schema public to service_role;

alter table public.profiles              enable row level security;
alter table public.user_roles            enable row level security;
alter table public.platform_settings     enable row level security;
alter table public.care_tasks            enable row level security;
alter table public.care_partners         enable row level security;
alter table public.care_partner_tasks    enable row level security;
alter table public.availability          enable row level security;
alter table public.bookings              enable row level security;
alter table public.reviews               enable row level security;
alter table public.training_records      enable row level security;
alter table public.verification_records  enable row level security;
alter table public.complaints            enable row level security;
alter table public.notifications         enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin()
         or exists (select 1 from public.care_partners cp
                    where cp.profile_id = profiles.id and cp.approval_status = 'approved')
         or exists (select 1 from public.bookings b
                    join public.care_partners cp on cp.id = b.care_partner_id
                    where (b.customer_id = profiles.id and cp.profile_id = auth.uid())
                       or (cp.profile_id = profiles.id and b.customer_id = auth.uid())));

drop policy if exists profiles_select_public_partners on public.profiles;
create policy profiles_select_public_partners on public.profiles for select to anon
  using (exists (select 1 from public.care_partners cp
                 where cp.profile_id = profiles.id and cp.approval_status = 'approved'));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert to authenticated
  with check (id = auth.uid());

drop policy if exists user_roles_select on public.user_roles;
create policy user_roles_select on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists settings_read on public.platform_settings;
create policy settings_read on public.platform_settings for select to anon, authenticated using (true);
drop policy if exists settings_admin_write on public.platform_settings;
create policy settings_admin_write on public.platform_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists tasks_read on public.care_tasks;
create policy tasks_read on public.care_tasks for select to anon, authenticated using (true);
drop policy if exists tasks_admin_all on public.care_tasks;
create policy tasks_admin_all on public.care_tasks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists partners_read on public.care_partners;
create policy partners_read on public.care_partners for select to anon, authenticated
  using (approval_status = 'approved' or profile_id = auth.uid() or public.is_admin());
drop policy if exists partners_insert_own on public.care_partners;
create policy partners_insert_own on public.care_partners for insert to authenticated
  with check (profile_id = auth.uid());
drop policy if exists partners_update_own on public.care_partners;
create policy partners_update_own on public.care_partners for update to authenticated
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

drop policy if exists cpt_read on public.care_partner_tasks;
create policy cpt_read on public.care_partner_tasks for select to anon, authenticated using (true);
drop policy if exists cpt_write_own on public.care_partner_tasks;
create policy cpt_write_own on public.care_partner_tasks for all to authenticated
  using (exists (select 1 from public.care_partners cp
                 where cp.id = care_partner_id and (cp.profile_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.care_partners cp
                 where cp.id = care_partner_id and (cp.profile_id = auth.uid() or public.is_admin())));

drop policy if exists availability_read on public.availability;
create policy availability_read on public.availability for select to anon, authenticated using (true);
drop policy if exists availability_write_own on public.availability;
create policy availability_write_own on public.availability for all to authenticated
  using (exists (select 1 from public.care_partners cp
                 where cp.id = care_partner_id and (cp.profile_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.care_partners cp
                 where cp.id = care_partner_id and (cp.profile_id = auth.uid() or public.is_admin())));

drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings for select to authenticated
  using (customer_id = auth.uid() or public.is_admin()
         or exists (select 1 from public.care_partners cp
                    where cp.id = care_partner_id and cp.profile_id = auth.uid()));
drop policy if exists bookings_insert_customer on public.bookings;
create policy bookings_insert_customer on public.bookings for insert to authenticated
  with check (customer_id = auth.uid() and terms_accepted = true);
drop policy if exists bookings_update on public.bookings;
create policy bookings_update on public.bookings for update to authenticated
  using (customer_id = auth.uid() or public.is_admin()
         or exists (select 1 from public.care_partners cp
                    where cp.id = care_partner_id and cp.profile_id = auth.uid()))
  with check (customer_id = auth.uid() or public.is_admin()
         or exists (select 1 from public.care_partners cp
                    where cp.id = care_partner_id and cp.profile_id = auth.uid()));

drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select to anon, authenticated using (true);
drop policy if exists reviews_insert_customer on public.reviews;
create policy reviews_insert_customer on public.reviews for insert to authenticated
  with check (customer_id = auth.uid()
              and exists (select 1 from public.bookings b
                          where b.id = booking_id and b.customer_id = auth.uid()
                            and b.status = 'completed'));
drop policy if exists reviews_admin_delete on public.reviews;
create policy reviews_admin_delete on public.reviews for delete to authenticated
  using (public.is_admin());

drop policy if exists training_read on public.training_records;
create policy training_read on public.training_records for select to authenticated
  using (public.is_admin() or exists (select 1 from public.care_partners cp
         where cp.id = care_partner_id and cp.profile_id = auth.uid()));
drop policy if exists training_admin_write on public.training_records;
create policy training_admin_write on public.training_records for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists verification_read on public.verification_records;
create policy verification_read on public.verification_records for select to authenticated
  using (public.is_admin() or exists (select 1 from public.care_partners cp
         where cp.id = care_partner_id and cp.profile_id = auth.uid()));
drop policy if exists verification_admin_write on public.verification_records;
create policy verification_admin_write on public.verification_records for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists complaints_read on public.complaints;
create policy complaints_read on public.complaints for select to authenticated
  using (reported_by = auth.uid() or public.is_admin());
drop policy if exists complaints_insert on public.complaints;
create policy complaints_insert on public.complaints for insert to authenticated
  with check (reported_by = auth.uid());
drop policy if exists complaints_admin_update on public.complaints;
create policy complaints_admin_update on public.complaints for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists notifications_read on public.notifications;
create policy notifications_read on public.notifications for select to authenticated
  using (user_id = auth.uid());
drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists notifications_delete_own on public.notifications;
create policy notifications_delete_own on public.notifications for delete to authenticated
  using (user_id = auth.uid());

insert into public.platform_settings (id, default_hourly_rate, currency, min_duration_hours, max_duration_hours)
values (1, 250.00, 'INR', 1, 12)
on conflict (id) do nothing;

insert into public.care_tasks (name, description, category) values
  ('Simple Cooking',            'Everyday home-style meals prepared in your kitchen.',                    'household'),
  ('Tea & Snacks',              'Fresh tea, coffee and light snacks whenever you need them.',             'household'),
  ('Light Household Help',      'Tidying up, dishes and light day-to-day household support.',             'household'),
  ('Folding Clothes',           'Sorting, folding and putting away laundry.',                             'household'),
  ('Nearby Errands',            'Short local errands such as small grocery or pharmacy pickups.',         'errands'),
  ('Preparing Hot Water',       'Hot water for drinking, bathing or a warm compress.',                    'comfort'),
  ('Gentle Comfort Massage',    'Gentle, comfort-oriented hand or leg massage. Strictly non-medical.',    'comfort'),
  ('Companionship',             'Someone to sit with you, talk to you and simply be there.',              'companionship'),
  ('Other Reasonable Non-Medical Support', 'Any other reasonable, safe, non-medical help within the booked time.', 'general')
on conflict (name) do nothing;