
import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { StackedBarChartParameters } from '../models/stackedBarChartParameters.model';
import { DistrictPatientService } from '../services/district-patient.service';
import { TalukaMainMenuComponent } from '../Taluka/taluka-main-menu/taluka-main-menu.component'

const moment = _rollupMoment || _moment; _moment;

/* For Date picker year */

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Enum - Granularity option
export enum Granualirity {
  ANNUAL = 0,
  MONTHWISE = 1,
  QUATERWISE = 2
}

// Enum - Normalize option 
export enum Normalise {
  NO = 1,
  YES = 2
}

// Enum - Sorting option for chart 
export enum SortOption {
  RANKWISE = 0,
  ALPHABETICALLY = 1
}

@Component({
  selector: 'app-district-main-menu',
  templateUrl: './district-main-menu.component.html',
  styleUrls: ['./district-main-menu.component.css'],
  entryComponents: [TalukaMainMenuComponent],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DistrictMainMenuComponent implements AfterViewInit, OnInit {
  @ViewChild(TalukaMainMenuComponent, { static: false }) TalukaMainMenuRef: TalukaMainMenuComponent;

  private talukaPanelState = false;
  private talukaView: boolean = true;
  private year: number = 2018;
  private quarterData: any = null;
  private monthlyData: any = null;
  private annualData: any = null;
  public quarterChoosen: number = 1;
  private monthChoosen: number = 1;
  private months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  public monthName = "January";
  public displayMonthData = false;
  public displayQuarterData = false;
  public granularChoosen: number = 0; // Granualirity : 0: Annual , 1 : Month , 2: Quarter
  public parameterName: string;
  private chartParameters: StackedBarChartParameters;
  private actualData: any;
  private dataURL: any;
  public data: any;
  public xColumnName = "District";
  private parameterNumber: any;
  private checkedNormalize: boolean = false;
  private columns: string[] = ["Alcohol Cases", "Suicide Cases", "SMD Cases", "CMD Cases", "Psychiatric Disorder Cases", "O1 Cases", "O2 Cases", "O3 Cases", "O4 Cases", "O5 Cases"];
  private toggleOptions_Sort: string[] = ["Rank", "District"];
  private toggleValue_Sort: string;
  private toggleOptions_Granularity: string[] = ["Annual", "Month", "Quarter"];
  private sortColumn: string;
  private chartLoaded = true;
  private selectDistrict: string = "";

  constructor(private http: HttpClient, private barChartService: DistrictPatientService) {
  }

  ngOnInit() {
    this.barChartService.onDoubleClick.subscribe((d) => {
      this.selectDistrict = d;
      if (this.talukaPanelState)
        this.TalukaMainMenuRef.updateYearDataFromServer(this.year, this.selectDistrict);
      this.talukaPanelState = true;
    });

  }

  ngAfterViewInit() {
    this.toggleValue_Sort = this.toggleOptions_Sort[SortOption.RANKWISE];
    this.setSortColumnName();

    this.granularChoosen = Granualirity.ANNUAL;

    this.dataURL = {
      Annual: "getDataAllDistrictAnnually",
      Quarter: "getDataAllDistrictQuarterly",
      Monthly: "getDataAllDistrictMonthly"
    };

    this.chartParameters = {
      xLabel: this.xColumnName,
      yLabel: "Cases",
      threshold: 2000,
      columnNames: this.columns
    };

    this.parameterNumber = 1// newDataReq.parameterNumber;
    this.barChartService.updateParameters(this.chartParameters);
    this.chartLoaded = true;

    this.getYearDataFromServer(this.year);
  }

  getYearDataFromServer(year: number) {
    let postData = {
      year: year
    };

    this.http.post<any>("http://localhost:3000/" + this.dataURL['Annual'], postData)
      .subscribe(responseData => {
        this.annualData = responseData;
        this.http.post<any>("http://localhost:3000/" + this.dataURL['Monthly'], postData)
          .subscribe(responseData => {
            this.monthlyData = responseData;
            this.http.post<any>("http://localhost:3000/" + this.dataURL['Quarter'], postData)
              .subscribe(responseData => {
                this.quarterData = responseData;
                this.updateData();
                this.sendDataToChart();

              });
          });
      });
  }

  /* *********************************************************************************************************************
   * Class functions
   *
   * ********************************************************************************************************************/

  // Update the data as per granualarity
  updateData() {
    switch (this.granularChoosen) {
      case Granualirity.ANNUAL: {
        this.data = this.annualData;
        break;
      }
      case Granualirity.MONTHWISE: {
        this.data = (this.monthlyData[this.monthChoosen] == null) ? [] : this.monthlyData[this.monthChoosen];
        break;
      }
      case Granualirity.QUATERWISE: {
        this.granularChoosen = Granualirity.QUATERWISE;
        this.data = (this.quarterData[this.quarterChoosen] == null) ? [] : this.quarterData[this.quarterChoosen];
        break;
      }
    }
    this.actualData = JSON.parse(JSON.stringify(this.data));
  }

  sendDataToChart() {
    this.normalizeData();
    let sendingData = {
      year: this.year,
      granular: this.granularChoosen,
      choosenValue: (this.granularChoosen == Granualirity.ANNUAL) ? this.year : (this.granularChoosen == Granualirity.MONTHWISE) ? this.monthChoosen : this.quarterChoosen,
      sortColumn: this.sortColumn,
      normalise: this.checkedNormalize,
      data: this.data,
      parameterNumber: this.parameterNumber,
      parameterValue: "Karnataka"
    }
    this.barChartService.updateChartData(sendingData);
  }

  normalizeData() {
    this.data = JSON.parse(JSON.stringify(this.actualData));
    if (this.checkedNormalize) {
      let wrtColumn = "Population";
      this.data.forEach((d) => {
        for (let col of this.columns) {
          d[col] = Number(((d[col] / d[wrtColumn]) * 100).toFixed(2));
        }
      });
    }
  }

  setSortColumnName() {
    switch (this.toggleValue_Sort) {
      case this.toggleOptions_Sort[SortOption.ALPHABETICALLY]: {
        this.sortColumn = this.xColumnName;
        break;
      }
      case this.toggleOptions_Sort[SortOption.RANKWISE]: {
        this.sortColumn = "Total";
        break;
      }
    }
  }

  /* *********************************************************************************************************************
   * Setting the inputs from user (on events -  handler)
   *
   * ********************************************************************************************************************/

  onMonthChange(event: any) {
    this.monthChoosen = event.value;
    this.monthName = this.months[this.monthChoosen - 1];
    this.updateData();
    this.sendDataToChart();
  }

  onQuarterChange(event: any) {
    this.quarterChoosen = event.value;
    this.updateData();
    this.sendDataToChart();
  }

  onToggleChange_Sort(toggleValue: string) {
    this.toggleValue_Sort = toggleValue;
    this.setSortColumnName();
    this.sendDataToChart();
  }

  onToggleChange_Granularity(toggleValue: number) {
    this.granularChoosen = toggleValue;

    this.quarterChoosen = 1;
    this.monthChoosen = 1;
    this.monthName = "January";
    this.updateData();
    this.sendDataToChart();
  }

  public yearObj = new FormControl(moment());
  choosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    //this.radioPresent=!this.radioPresent;
    const ctrlValue = this.yearObj.value;
    ctrlValue.year(normalizedYear.year());
    this.yearObj.setValue(ctrlValue);
    datepicker.close();
    this.year = normalizedYear.year();
    this.annualData = [];
    this.monthlyData = [];
    this.quarterData = [];
    this.getYearDataFromServer(this.year);
  }

  onNormaliseChange() {
    this.sendDataToChart();
  }

  onPanelExpand() {
    //this.talukaView = !this.talukaView;
  }
}





