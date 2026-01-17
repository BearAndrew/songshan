import { TaxiService } from './service/taxi.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CreateFormComponent } from './components/create/create-form/create-form.component';
import { UpdateFormComponent } from './components/update/update-form/update-form.component';
import { DeleteFormComponent } from './components/delete/delete-form/delete-form.component';
import { ReadFormComponent } from './components/read/read-form/read-form.component';
import { CreateDisplayComponent } from './components/create/create-display/create-display.component';
import { UpdateDisplayComponent } from './components/update/update-display/update-display.component';
import { DeleteDisplayComponent } from './components/delete/delete-display/delete-display.component';
import { ReadDisplayComponent } from './components/read/read-display/read-display.component';
import { ApiService } from '../../core/services/api-service.service';
import { TaxiInfo, TaxiStat } from '../../models/taxi.model';
import { Subject, takeUntil } from 'rxjs';

export type TabType = 'create' | 'read' | 'update' | 'delete';

@Component({
  selector: 'app-taxi-module',
  imports: [
    CommonModule,
    CreateFormComponent,
    UpdateFormComponent,
    DeleteFormComponent,
    ReadFormComponent,
    CreateDisplayComponent,
    UpdateDisplayComponent,
    DeleteDisplayComponent,
    ReadDisplayComponent,
  ],
  templateUrl: './taxi-module.component.html',
  styleUrl: './taxi-module.component.scss',
})
export class TaxiModuleComponent {
  activeTab: TabType = 'create';
  taxiStat?: TaxiStat;
  editTaxiInfo!: TaxiInfo;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private taxiService: TaxiService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.apiService
      .getTaxiStat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.taxiStat = res;
      });

    this.taxiService.editSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.activeTab = res.activeTab as TabType;
        this.editTaxiInfo = res.taxiInfo;
      });
  }

  setTab(tab: TabType): void {
    this.activeTab = tab;
  }
}
