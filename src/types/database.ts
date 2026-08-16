import type { Database } from "@/integrations/supabase/types";

export type Tables = Database["public"]["Tables"];
export type Enums = Database["public"]["Enums"];

export type Profile = Tables["profiles"]["Row"];
export type CarePartner = Tables["care_partners"]["Row"];
export type CareTask = Tables["care_tasks"]["Row"];
export type Availability = Tables["availability"]["Row"];
export type Booking = Tables["bookings"]["Row"];
export type Review = Tables["reviews"]["Row"];
export type TrainingRecord = Tables["training_records"]["Row"];
export type VerificationRecord = Tables["verification_records"]["Row"];
export type Complaint = Tables["complaints"]["Row"];
export type Notification = Tables["notifications"]["Row"];
export type PlatformSettings = Tables["platform_settings"]["Row"];

export type AppRole = Enums["app_role"];
export type ApprovalStatus = Enums["approval_status"];
export type VerificationStatus = Enums["verification_status"];
export type TrainingStatus = Enums["training_status"];
export type BookingStatus = Enums["booking_status"];
export type ComplaintStatus = Enums["complaint_status"];
export type RecordStatus = Enums["record_status"];

/** A Care Partner joined with her public profile. */
export type CarePartnerWithProfile = CarePartner & {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "city"> | null;
};

/** A booking joined with both sides, as used across the dashboards. */
export type BookingDetail = Booking & {
  care_partners:
    | (Pick<CarePartner, "id" | "profile_id"> & {
        profiles: Pick<Profile, "full_name" | "phone" | "avatar_url"> | null;
      })
    | null;
  profiles: Pick<Profile, "full_name" | "phone" | "avatar_url"> | null;
};

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "accepted",
  "rejected",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

/** Statuses a customer is still allowed to cancel from. */
export const CANCELLABLE_STATUSES: BookingStatus[] = ["pending", "accepted", "confirmed"];
