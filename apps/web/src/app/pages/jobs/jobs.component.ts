import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApiService } from "../../core/api.service";
import { Job } from "../../core/models";
@Component({
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `<div class="page-title">
      <div>
        <h1>Vacantes</h1>
        <p>Vacantes importadas y registradas manualmente.</p>
      </div>
      <button class="primary" (click)="toggleForm()">Nueva vacante</button>
    </div>
    @if (show()) {
      <form class="card form-grid" [formGroup]="form" (ngSubmit)="save()">
        <label>Cargo<input formControlName="title" /></label
        ><label>Empresa<input formControlName="company" /></label
        ><label>Ubicación<input formControlName="location" /></label
        ><label>URL<input formControlName="url" /></label
        ><label
          >Salario mínimo<input
            type="number"
            formControlName="salaryMin" /></label
        ><label
          >Salario máximo<input
            type="number"
            formControlName="salaryMax" /></label
        ><label class="wide"
          >Descripción<textarea formControlName="description"></textarea></label
        ><label class="check wide"
          ><input type="checkbox" formControlName="remote" /> Trabajo
          remoto</label
        >
        <div class="actions wide">
          <button class="ghost" type="button" (click)="show.set(false)">
            Cancelar</button
          ><button class="primary" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    }
    <div class="jobs">
      @for (j of jobs(); track j.id) {
        <article class="card job">
          <div class="job-top">
            <span class="source">{{ j.source }}</span>
            @if (j.remote) {
              <span class="remote">Remoto</span>
            }
          </div>
          <h2>{{ j.title }}</h2>
          <strong>{{ j.company }}</strong>
          <p>{{ j.location || "Sin ubicación" }}</p>
          @if (j.salaryMin || j.salaryMax) {
            <p class="salary">
              {{ j.salaryMin || 0 | currency: "USD" : "symbol" : "1.0-0" }} –
              {{ j.salaryMax || 0 | currency: "USD" : "symbol" : "1.0-0" }}
            </p>
          }
          <p class="description">{{ j.description || "Sin descripción" }}</p>
          <div class="actions">
            <button class="primary" (click)="track(j.id)">
              Guardar postulación
            </button>
            @if (j.url) {
              <a class="ghost" [href]="j.url" target="_blank">Abrir oferta</a>
            }
            <button class="danger-text" (click)="remove(j.id)">Eliminar</button>
          </div>
        </article>
      } @empty {
        <div class="card empty">
          No hay vacantes. Registra una o ejecuta la sincronización.
        </div>
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  jobs = signal<Job[]>([]);
  show = signal(false);
  form = this.fb.nonNullable.group({
    title: ["", Validators.required],
    company: ["", Validators.required],
    location: [""],
    remote: [true],
    salaryMin: [0],
    salaryMax: [0],
    description: [""],
    url: [""],
  });
  toggleForm() {
    this.show.update((v) => !v);
  }
  constructor() {
    this.load();
  }
  load() {
    this.api.jobs().subscribe((x) => this.jobs.set(x));
  }
  save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload = this.form.getRawValue();

  console.log("Vacante enviada:", payload);

  this.api.createJob(payload).subscribe({
    next: (job) => {
      console.log("Vacante creada:", job);

      this.form.reset({
        title: "",
        company: "",
        location: "",
        remote: true,
        salaryMin: 0,
        salaryMax: 0,
        description: "",
        url: "",
      });

      this.show.set(false);
      this.load();
    },
    error: (error) => {
      console.error("Error creando la vacante:", error);

      alert(
        error?.error?.message ||
          `No se pudo crear la vacante. Error ${error.status}`,
      );
    },
  });
}
  track(id: number) {
    this.api
      .createApplication(id)
      .subscribe(() => alert("Vacante añadida al seguimiento."));
  }
  remove(id: number) {
    if (confirm("¿Eliminar vacante?"))
      this.api.deleteJob(id).subscribe(() => this.load());
  }
}
