import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { AuthService } from "../core/auth.service";
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `<div class="app">
    <aside>
      <a class="brand" routerLink="/">Dan<span>Jobs</span></a>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a
        ><a routerLink="/jobs" routerLinkActive="active">Vacantes</a
        ><a routerLink="/applications" routerLinkActive="active"
          >Postulaciones</a
        >
      </nav>
      <button class="ghost logout" (click)="logout()">Cerrar sesión</button>
    </aside>
    <main>
      <header>
        <span>Automatización de búsqueda laboral</span
        ><strong>{{ auth.user()?.name }}</strong>
      </header>
      <section class="content"><router-outlet /></section>
    </main>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  logout() {
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }
}
