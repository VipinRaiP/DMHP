import { Component, OnInit} from '@angular/core';
import { LineChartService } from '../Cards/services/line-chart.service';
import { ExpenseCountDistrictService } from '../Services/expense-count-district.service';
import { PatientCountDistrictService } from '../Services/patient-count-district.service';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-operational-home',
  templateUrl: './operational-home.component.html',
  styleUrls: ['./operational-home.component.css'],
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

  Capture(){
    
    //let element = document.querySelector("#"+"this.dataType");
    // let element :string = "#"+"this.dataType";
  html2canvas(document.body).then(function(canvas) {
      // Convert the canvas to blob
      canvas.toBlob(function(blob){
          // To download directly on browser default 'downloads' location
          let link = document.createElement("a");
          link.download = "image.png";
          link.href = URL.createObjectURL(blob);
          link.click();

          // To save manually somewhere in file explorer
          //FileSaver.saveAs(blob, 'image.png');

      },'image/png');
  });
  }


}
