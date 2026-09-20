import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/auth.service";
@Component({
  imports: [ReactiveFormsModule],
  template: `<div class="auth">
    <form class="card auth-card" [formGroup]="form" (ngSubmit)="submit()">
      <div class="logo">Dan<span>Jobs</span></div>
      <h1>{{ isRegister() ? "Crear cuenta" : "Iniciar sesión" }}</h1>
      <p>Organiza y automatiza tu búsqueda laboral.</p>
      @if (isRegister()) {
        <label>Nombre<input formControlName="name" /></label>
      }
      <label>Correo<input formControlName="email" type="email" /></label
      ><label
        >Contraseña<input formControlName="password" type="password"
      /></label>
      @if (error()) {
        <div class="error">{{ error() }}</div>
      }
      <button class="primary" [disabled]="form.invalid || loading()">
        {{
          loading()
            ? "Procesando..."
            : isRegister()
              ? "Registrarme"
              : "Ingresar"
        }}</button
      ><button class="link" type="button" (click)="toggle()">
        {{ isRegister() ? "Ya tengo cuenta" : "Crear cuenta" }}
      </button>
    </form>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  isRegister = signal(false);
  loading = signal(false);
  error = signal("");
  form = this.fb.nonNullable.group({
    name: [""],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });
  toggle() {
    this.isRegister.update((v) => !v);
  }
  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const v = this.form.getRawValue();
    (this.isRegister() ? this.auth.register(v) : this.auth.login(v)).subscribe({
      next: () => this.router.navigateByUrl("/dashboard"),
      error: (e) => {
        this.error.set(e.error?.message ?? "No se pudo completar");
        this.loading.set(false);
      },
    });
  }
}
