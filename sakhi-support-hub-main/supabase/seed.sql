-- Sakhi seed data.
-- Care tasks are informational capabilities included in a Care Partner's
-- time — they are NOT separately bookable or separately priced services.

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
