import { Component, OnInit, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { LineChartService } from '../Cards/services/line-chart.service';
import { ExpenseCountDistrictService } from '../Services/expense-count-district.service';
import { PatientCountDistrictService } from '../Services/patient-count-district.service';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-operational-home',
  templateUrl: './operational-home.component.html',
  styleUrls: ['./operational-home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class OperationalHomeComponent implements OnInit, AfterViewInit {
  public lineChartLoaded = false;
  public chartData;

  public sideNavOption: number;

  opened: boolean;
  mode = new FormControl('over');
  constructor(private districtExpenseService: ExpenseCountDistrictService,   private districtService: PatientCountDistrictService) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.sideNavOption=1;

  }
  onLineChartClose(){
    this.lineChartLoaded = false;
  }

  onSideNavClick(val: number){
    this.sideNavOption = val;
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
