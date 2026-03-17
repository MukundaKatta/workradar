export const ApplicationStatus = {
  INTERESTED: "interested",
  APPLYING: "applying",
  APPLIED: "applied",
  SCREENING: "screening",
  PHONE_SCREEN: "phone_screen",
  TECHNICAL: "technical",
  ONSITE: "onsite",
  OFFER: "offer",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  GHOSTED: "ghosted",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

/** Ordered pipeline stages for display */
export const APPLICATION_PIPELINE: ApplicationStatus[] = [
  ApplicationStatus.INTERESTED,
  ApplicationStatus.APPLYING,
  ApplicationStatus.APPLIED,
  ApplicationStatus.SCREENING,
  ApplicationStatus.PHONE_SCREEN,
  ApplicationStatus.TECHNICAL,
  ApplicationStatus.ONSITE,
  ApplicationStatus.OFFER,
  ApplicationStatus.ACCEPTED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
  ApplicationStatus.GHOSTED,
];

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  company_id: string;
  status: ApplicationStatus;
  applied_at?: string;
  response_at?: string;
  next_step?: string;
  next_step_date?: string;
  salary_offered?: number;
  notes: string;
  resume_id?: string;
  cover_letter_url?: string;
  referral_contact?: string;
  timeline: ApplicationTimelineEntry[];
  created_at: string;
  updated_at: string;
}

export interface ApplicationTimelineEntry {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
}
