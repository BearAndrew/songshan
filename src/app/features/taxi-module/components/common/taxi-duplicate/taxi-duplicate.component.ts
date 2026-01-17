import { Component, Input } from '@angular/core';
import { TaxiInfo } from '../../../../../models/taxi.model';
import { ApiService } from '../../../../../core/services/api-service.service';
import { TaxiService } from '../../../service/taxi.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-taxi-duplicate',
  imports: [],
  templateUrl: './taxi-duplicate.component.html',
  styleUrl: './taxi-duplicate.component.scss',
})
export class TaxiDuplicateComponent {
  @Input() taxiInfoList: TaxiInfo[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private taxiService: TaxiService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEdit(taxiInfo: TaxiInfo): void {
    this.taxiService.clickEdit(taxiInfo);
  }

  onDelete(plate: string) {
    this.apiService
      .deleteTaxi(plate)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const index = this.taxiInfoList.findIndex(
          (taxi) => taxi.regPlate === plate
        );

        if (index !== -1) {
          this.taxiInfoList.splice(index, 1);
        }

        this.taxiService.afterDelete();
      });
  }
}
