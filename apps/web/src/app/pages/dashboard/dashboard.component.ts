import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { ApiService } from "../../core/api.service";
import { Dashboard, Preference } from "../../core/models";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
@Component({
  imports: [ReactiveFormsModule],
  template: `<div class="page-title">
      <div>
        <h1>Dashboard</h1>
        <p>Control de tu búsqueda laboral.</p>
      </div>
      <button class="primary" (click)="sync()" [disabled]="syncing()">
        {{ syncing() ? "Sincronizando..." : "Buscar vacantes ahora" }}
      </button>
    </div>
    @if (message()) {
      <div class="notice">{{ message() }}</div>
    }
    @if (data(); as d) {
      <div class="metrics">
        <article class="card">
          <span>Vacantes</span><strong>{{ d.jobs }}</strong>
        </article>
        <article class="card">
          <span>Postulaciones</span><strong>{{ d.applications }}</strong>
        </article>
        <article class="card accent">
          <span>Entrevistas</span><strong>{{ d.interviews }}</strong>
        </article>
        <article class="card success">
          <span>Ofertas</span><strong>{{ d.offers }}</strong>
        </article>
      </div>
    }
    <form class="card search-form" [formGroup]="form" (ngSubmit)="save()">
      <div>
        <h2>Búsqueda automática</h2>
        <p>DanJobs sincroniza diariamente a las 7:00 a. m.</p>
      </div>
      <label
        >Palabras clave<input
          formControlName="keywords"
          placeholder="Angular NestJS" /></label
      ><label
        >País<select formControlName="country">
          <option value="co">Colombia</option>
          <option value="es">España</option>
          <option value="us">Estados Unidos</option>
          <option value="gb">Reino Unido</option>
        </select></label
      ><label>Ubicación<input formControlName="location" /></label
      ><label class="check"
        ><input type="checkbox" formControlName="remoteOnly" /> Solo trabajo
        remoto</label
      ><button class="primary" [disabled]="form.invalid">
        Guardar automatización
      </button>
    </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  data = signal<Dashboard | null>(null);
  syncing = signal(false);
  message = signal("");
  form = this.fb.nonNullable.group({
    keywords: ["Angular", [Validators.required]],
    country: ["co", Validators.required],
    location: ["Colombia"],
    remoteOnly: [true],
    lastSyncAt: [""],
  });
  constructor() {
    this.load();
    this.api
      .preference()
      .subscribe((p) =>
        this.form.patchValue({ ...p, lastSyncAt: p.lastSyncAt ?? "" }),
      );
  }
  load() {
    this.api.dashboard().subscribe((d) => this.data.set(d));
  }
  save() {
    this.api
      .savePreference(this.form.getRawValue())
      .subscribe(() => this.message.set("Automatización guardada."));
  }
  sync() {
    this.syncing.set(true);
    this.api.sync().subscribe({
      next: (r) => {
        this.message.set(`${r.imported} vacantes nuevas importadas.`);
        this.syncing.set(false);
        this.load();
      },
      error: () => {
        this.message.set("Revisa las credenciales de Adzuna en el backend.");
        this.syncing.set(false);
      },
    });
  }
}
