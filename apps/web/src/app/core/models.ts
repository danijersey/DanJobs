export interface Job {
  id: number;
  title: string;
  company: string;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  url?: string;
  source: string;
  publishedAt?: string;
}
export type ApplicationStatus =
  "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
export interface JobApplication {
  id: number;
  jobId: number;
  title: string;
  company: string;
  status: ApplicationStatus;
  notes?: string;
  appliedAt?: string;
  updatedAt: string;
}
export interface Dashboard {
  jobs: number;
  applications: number;
  interviews: number;
  offers: number;
  rejected: number;
}
export interface Preference {
  keywords: string;
  country: string;
  location: string;
  remoteOnly: boolean;
  lastSyncAt?: string;
}
