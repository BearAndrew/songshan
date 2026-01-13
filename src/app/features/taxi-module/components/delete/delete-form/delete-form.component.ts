import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../../../core/services/api-service.service';
import { TaxiService } from '../../../service/taxi.service';
import { SearchTaxiData } from '../../../service/taxi.interface';
import { fakeData } from './fake-data';

@Component({
  selector: 'app-delete-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './delete-form.component.html',
  styleUrl: './delete-form.component.scss',
})
export class DeleteFormComponent {
  form!: FormGroup;
  searchRegPlate: string = '';
  searchSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private taxiService: TaxiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      regPlate: ['', Validators.required],
      driverNo: [''],
    });
  }

  onSearch() {
    // this.searchRegPlate = this.form.value.regPlate;
    // const searchTaxiData: SearchTaxiData = {
    //   searchRegPlate: this.searchRegPlate,
    //   taxiInfoList: fakeData.map((item) => ({
    //     ...item,
    //   })),
    // };
    // console.log(this.searchRegPlate)
    // this.taxiService.afterSearchTaxi(searchTaxiData);
    // return;

    this.apiService.searchTaxi(this.form.value.regPlate).subscribe((res) => {
      this.searchRegPlate = this.form.value.regPlate;
      const searchTaxiData: SearchTaxiData = {
        searchRegPlate: this.form.value.regPlate,
        taxiInfoList: res.map((item) => ({
          ...item,
        })),
      };
      if (res.length == 1) {
        this.searchSuccess = true;
        this.form.controls['driverNo'].setValue(
          searchTaxiData.taxiInfoList[0].driverNo
        );
      }
      this.taxiService.afterSearchTaxi(searchTaxiData);
    });
  }

  onDelete() {
    this.apiService.deleteTaxi(this.searchRegPlate).subscribe(() => {
      this.taxiService.afterDelete();
    });
  }
}
