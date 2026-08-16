# Sakhi Care Connect

Build a complete, functional full-stack MVP for my startup "सखी (Sakhi)".

IMPORTANT:

Do NOT create only a landing page or visual prototype. Build the actual working application with Supabase backend, database, authentication, role-based access, booking system, dashboards, SQL files and security.

LANGUAGE:

The entire website must be in ENGLISH.

Use Hindi ONLY for the brand name "सखी".

All navigation, buttons, headings, forms, dashboards and policies must be English.

BRAND:

सखी (Sakhi)

Tagline:

"When you're away from home, you still deserve to be cared for."

==================================================

CORE BUSINESS MODEL

==================================================

Sakhi is a women-to-women care and support platform.

A customer does NOT book individual services.

She books ONE trained female Care Partner for a specific amount of TIME.

Example:

A customer books a Sakhi for 3 hours. During those 3 hours, she can request reasonable supported tasks such as:

- Simple cooking

- Tea/snacks

- Light household help

- Folding clothes

- Nearby errands

- Preparing hot water

- Gentle comfort-oriented hand/leg massage

- Companionship

- Other reasonable non-medical support

These are NOT separate products, bookings or prices.

The customer pays for the Care Partner's TIME.

ONE BOOKING = ONE CARE PARTNER + TIME + FLEXIBLE SUPPORT.

==================================================

TECH STACK

==================================================

React + TypeScript + Vite

Tailwind CSS + shadcn/ui

Supabase PostgreSQL

Supabase Authentication

Supabase Storage where needed

Supabase Project URL: https://lszywstpbwngrcsaxckl.supabase.co

SUPABASE_PUBLISHABLE_KEY: sb_publishable_LLQRlmI3T3j8rDDucWF0UQ_xcoada8G

Never expose service_role or secret keys.

==================================================

CREATE ACTUAL FILES

==================================================

Create these files in the project:

.env.example

README.md

src/lib/supabase.ts

src/types/database.ts

supabase/schema.sql

supabase/seed.sql

These must contain real working code/SQL, NOT placeholders or descriptions.

==================================================

DATABASE

==================================================

Create PostgreSQL tables:

profiles

care_partners

care_tasks

availability

bookings

reviews

training_records

verification_records

complaints

notifications

Use UUIDs, foreign keys, constraints, timestamps and indexes.

profiles:

id, full_name, email, phone, role, avatar_url, created_at, updated_at

roles:

customer | care_partner | admin

care_partners:

id, profile_id, bio, hourly_rate, approval_status, verification_status, training_status

care_tasks:

id, name, description, category, is_active, created_at

availability:

id, care_partner_id, date, start_time, end_time, is_available

bookings:

id, customer_id, care_partner_id, date, start_time, end_time,

duration_hours, hourly_rate, total_amount, address,

instructions, status, terms_accepted, created_at, updated_at

reviews:

id, booking_id, customer_id, care_partner_id, rating, comment, created_at

training_records:

id, care_partner_id, training_name, status, completed_at

verification_records:

id, care_partner_id, verification_type, status, verified_at

complaints:

id, booking_id, reported_by, against_user, description, status, created_at

notifications:

id, user_id, title, message, is_read, created_at

==================================================

SQL

==================================================

supabase/schema.sql MUST contain:

- All tables

- Relationships

- Foreign keys

- Constraints

- Indexes

- Required functions/triggers

- Row Level Security

- RLS policies

- Double-booking protection

supabase/seed.sql MUST insert initial care tasks:

Simple Cooking

Tea & Snacks

Light Household Help

Folding Clothes

Nearby Errands

Preparing Hot Water

Gentle Comfort Massage

Companionship

Other Reasonable Non-Medical Support

These tasks are informational capabilities, NOT separately bookable services.

==================================================

AUTHENTICATION

==================================================

Implement REAL Supabase Auth:

- Signup

- Login

- Logout

- Forgot/reset password

- Persistent sessions

- Protected routes

Signup:

Full Name

Email

Password

Phone

Account Type: Customer / Care Partner

Admin must NEVER be selectable during signup.

Automatically create a profile after signup.

Use role-based route protection.

==================================================

CUSTOMER

==================================================

Customer can:

- Manage profile

- Browse approved Care Partners

- View Care Partner profile and supported tasks

- See availability

- Select date

- Select start time

- Select duration

- Select Care Partner

- Enter address

- Add instructions

- See hourly price and total

- Accept Terms

- Confirm ONE booking

- View bookings

- Cancel eligible bookings

- Receive notifications

- Review completed bookings

Booking status:

pending

accepted

rejected

confirmed

in_progress

completed

cancelled

Prevent double bookings.

==================================================

CARE PARTNER

==================================================

Care Partner can:

- Submit application

- Create profile

- Select supported tasks

- Set availability

- View training status

- View verification status

- Receive booking requests after approval

- Accept/reject bookings

- Mark bookings completed

- View earnings

- View reviews

Only APPROVED Care Partners can receive bookings.

==================================================

ADMIN

==================================================

Create a protected Admin Dashboard.

Admin can:

- View users

- Approve/reject Care Partners

- Manage verification

- Manage training

- Manage care tasks

- Set/change hourly pricing

- View/manage bookings

- View reviews

- Manage complaints

- View basic statistics

Users cannot make themselves admin.

Include a secure method in README for creating the first admin.

==================================================

PRICING

==================================================

Pricing is TIME-BASED.

Do NOT create separate prices for massage, cooking, cleaning, etc.

Admin controls hourly rate.

Booking calculates:

hourly_rate × duration_hours = total_amount

Show total before confirmation.

==================================================

SAFETY + POLICIES

==================================================

Create pages:

Safety & Trust

Terms & Conditions

Privacy Policy

Cancellation & Refund Policy

Sakhi provides NON-MEDICAL support.

Care Partners cannot:

- Diagnose illnesses

- Prescribe medicines

- Provide medical treatment

- Perform medical procedures

- Provide sexual/intimate services

- Perform dangerous/illegal tasks

- Perform unsafe/heavy work outside training

Massage must only be described as gentle comfort-oriented massage.

Care Partners can refuse unsafe or inappropriate tasks.

Before booking, require:

"I agree to Sakhi's Terms & Conditions, Safety Rules and Cancellation Policy."

Store this acceptance with the booking.

==================================================

PAGES

==================================================

Public:

Home

How It Works

What We Offer

Safety & Trust

Become a Care Partner

About

FAQ

Terms & Conditions

Privacy Policy

Cancellation Policy

Login

Signup

Customer:

Dashboard

Book Care

Bookings

Booking Details

Profile

Notifications

Care Partner:

Dashboard

Application

Bookings

Availability

Training

Profile

Earnings

Admin:

Dashboard

Users

Care Partners

Applications

Tasks

Pricing

Bookings

Reviews

Complaints

Training

Verification

==================================================

DESIGN

==================================================

Modern, warm, trustworthy and affordable-premium.

Hero:

सखी

Sakhi

"When you're away from home, you still deserve to be cared for."

Buttons:

Book Care

Become a Care Partner

Include:

Problem

How It Works

Care Tasks

Why Sakhi

Safety & Trust

Become a Care Partner

FAQ

Footer

Do not make it look like:

- Hospital

- Dating app

- Maid-service website

- Period-product website

Make it fully responsive.

==================================================

IMAGES

==================================================

DO NOT generate AI images.

Use image placeholders/components.

Create:

public/images/

Use placeholders for:

hero

care-partner

cooking

companionship

safety

Images must be easy to replace later in VS Code.

Do not put important text inside images.

Do not use copyrighted internet images.

Document image filenames in README.md.

==================================================

SECURITY

==================================================

Enable RLS on all relevant tables.

Customers can access only their own private data/bookings.

Care Partners can access only their own profile, availability and assigned bookings.

Admins can manage platform data.

Protect all private routes.

Never expose secret/service_role keys.

==================================================

README

==================================================

README.md must explain:

1. Supabase setup

2. Environment variables

3. Running schema.sql

4. Running seed.sql

5. Supabase Auth configuration

6. Roles

7. Creating first admin

8. Image replacement

9. Local development

10. Deployment

==================================================

FINAL REQUIREMENT

==================================================

Implement the actual functionality, not mock UI.

Use Supabase data, not localStorage/mock data for core features.

Before finishing, check and fix:

- TypeScript errors

- Build errors

- Broken routes

- Broken buttons

- Authentication errors

- Database errors

- RLS errors

- Booking/double-booking issues

The result must be a working full-stack MVP that can connect to the provided Supabase project.

Do not leave core features as "Coming Soon".

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1a154bd2-c88b-4451-99b2-c86ac19350fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
