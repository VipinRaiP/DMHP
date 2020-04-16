import { Component, OnInit} from '@angular/core';
import { LineChartService } from '../Cards/services/line-chart.service';

@Component({
  selector: 'app-operational-home',
  templateUrl: './operational-home.component.html',
  styleUrls: ['./operational-home.component.css'],
})
export class OperationalHomeComponent implements OnInit {
  public lineChartLoaded = false;
  public chartData;

  constructor(private lineChartService:LineChartService) { }

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
