import { Routes } from "@angular/router";
import { authGuard } from "./core/auth.guard";
export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./layout/shell.component").then((m) => m.ShellComponent),
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./pages/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: "jobs",
        loadComponent: () =>
          import("./pages/jobs/jobs.component").then((m) => m.JobsComponent),
      },
      {
        path: "applications",
        loadComponent: () =>
          import("./pages/applications/applications.component").then(
            (m) => m.ApplicationsComponent,
          ),
      },
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
    ],
  },
  { path: "**", redirectTo: "" },
];
