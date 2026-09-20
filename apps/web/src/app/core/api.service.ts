import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import {
  ApplicationStatus,
  Dashboard,
  Job,
  JobApplication,
  Preference,
} from "./models";
@Injectable({ providedIn: "root" })
export class ApiService {
  private h = inject(HttpClient);
  private u = environment.apiUrl;
  dashboard() {
    return this.h.get<Dashboard>(`${this.u}/dashboard`);
  }
  jobs() {
    return this.h.get<Job[]>(`${this.u}/jobs`);
  }
  createJob(x: Omit<Job, "id" | "source" | "publishedAt">) {
    return this.h.post<Job>(`${this.u}/jobs`, x);
  }
  deleteJob(id: number) {
    return this.h.delete(`${this.u}/jobs/${id}`);
  }
  applications() {
    return this.h.get<JobApplication[]>(`${this.u}/applications`);
  }
  createApplication(jobId: number) {
    return this.h.post<JobApplication>(`${this.u}/applications`, {
      jobId,
      notes: "",
    });
  }
  updateApplication(id: number, status: ApplicationStatus, notes: string) {
    return this.h.patch<JobApplication>(`${this.u}/applications/${id}`, {
      status,
      notes,
    });
  }
  preference() {
    return this.h.get<Preference>(`${this.u}/integration/preference`);
  }
  savePreference(x: Preference) {
    return this.h.put<Preference>(`${this.u}/integration/preference`, x);
  }
  sync() {
    return this.h.post<{ imported: number }>(`${this.u}/integration/sync`, {});
  }
}
