import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { LineChartService } from '../Cards/services/line-chart.service';
import { ExpenseCountDistrictService } from '../Services/expense-count-district.service';
import { PatientCountDistrictService } from '../Services/patient-count-district.service';

@Component({
  selector: 'app-operational-home',
  templateUrl: './operational-home.component.html',
  styleUrls: ['./operational-home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OperationalHomeComponent implements OnInit {
  public lineChartLoaded = false;
  public chartData;

  constructor(private lineChartService:LineChartService,private districtExpenseService: ExpenseCountDistrictService,   private districtService: PatientCountDistrictService) { }

  ngOnInit() {
    this.lineChartService.getChartDataListener().subscribe((d)=>{
      this.chartData = d;
      this.lineChartLoaded = true;
    })
  }

  onLineChartClose(){
    this.lineChartLoaded = false;
  }




}
