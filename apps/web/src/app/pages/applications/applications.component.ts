import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiService } from "../../core/api.service";
import { ApplicationStatus, JobApplication } from "../../core/models";
@Component({
  imports: [FormsModule, DatePipe],
  template: `<div class="page-title">
      <div>
        <h1>Postulaciones</h1>
        <p>Actualiza cada etapa de tu proceso.</p>
      </div>
    </div>
    <div class="board">
      @for (column of columns; track column.status) {
        <section>
          <h3>
            {{ column.label }} <span>{{ byStatus(column.status).length }}</span>
          </h3>
          @for (a of byStatus(column.status); track a.id) {
            <article class="card application">
              <strong>{{ a.title }}</strong>
              <p>{{ a.company }}</p>
              <select [ngModel]="a.status" (ngModelChange)="update(a, $event)">
                @for (option of columns; track option.status) {
                  <option [value]="option.status">{{ option.label }}</option>
                }</select
              ><textarea
                [ngModel]="a.notes"
                (ngModelChange)="a.notes = $event"
                placeholder="Notas"
              ></textarea
              ><button class="ghost" (click)="saveNotes(a)">
                Guardar notas</button
              ><small>Actualizado {{ a.updatedAt | date: "dd/MM/yyyy" }}</small>
            </article>
          } @empty {
            <div class="column-empty">Sin registros</div>
          }
        </section>
      }
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsComponent {
  private api = inject(ApiService);
  apps = signal<JobApplication[]>([]);
  columns: { status: ApplicationStatus; label: string }[] = [
    { status: "SAVED", label: "Guardadas" },
    { status: "APPLIED", label: "Aplicadas" },
    { status: "INTERVIEW", label: "Entrevista" },
    { status: "OFFER", label: "Oferta" },
    { status: "REJECTED", label: "Rechazada" },
  ];
  constructor() {
    this.load();
  }
  load() {
    this.api.applications().subscribe((x) => this.apps.set(x));
  }
  byStatus(s: ApplicationStatus) {
    return this.apps().filter((x) => x.status === s);
  }
  update(a: JobApplication, status: ApplicationStatus) {
    this.api
      .updateApplication(a.id, status, a.notes ?? "")
      .subscribe(() => this.load());
  }
  saveNotes(a: JobApplication) {
    this.api
      .updateApplication(a.id, a.status, a.notes ?? "")
      .subscribe(() => this.load());
  }
}
