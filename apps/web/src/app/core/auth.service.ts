import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { tap } from "rxjs";
import { environment } from "../../environments/environment";
interface Response {
  accessToken: string;
  user: { id: number; name: string; email: string };
}
@Injectable({ providedIn: "root" })
export class AuthService {
  private h = inject(HttpClient);
  user = signal<Response["user"] | null>(
    JSON.parse(localStorage.getItem("user") ?? "null"),
  );
  login(x: { email: string; password: string }) {
    return this.h
      .post<Response>(`${environment.apiUrl}/auth/login`, x)
      .pipe(tap((r) => this.save(r)));
  }
  register(x: { name: string; email: string; password: string }) {
    return this.h
      .post<Response>(`${environment.apiUrl}/auth/register`, x)
      .pipe(tap((r) => this.save(r)));
  }
  private save(r: Response) {
    localStorage.setItem("token", r.accessToken);
    localStorage.setItem("user", JSON.stringify(r.user));
    this.user.set(r.user);
  }
  token() {
    return localStorage.getItem("token");
  }
  logout() {
    localStorage.clear();
    this.user.set(null);
  }
}
