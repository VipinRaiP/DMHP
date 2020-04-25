
import { Component, AfterViewInit, OnInit, ViewChild, Input } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PatientCountDistrictService } from '../../Services/patient-count-district.service'
import { TalukaMainMenuComponent } from '../Taluka/taluka-main-menu/taluka-main-menu.component'
import { Normalise } from '../../Services/patient-count.service';
import { Title } from "@angular/platform-browser";

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
   private districtName: string = "";

  //  @Input()
  //  private districtService: PatientCountDistrictService;
  constructor(private http: HttpClient, private titleService: Title,private districtService: PatientCountDistrictService) {
  }

  ngOnInit() {
    this.titleService.setTitle("District | Cases");
    this.districtService.initialize();
  
    //this.columns = this.districtService.getKeys();
    this.districtService.onDoubleClick.subscribe((districtName) => {
      this.districtName = districtName;
      //console.log(" this.districtName", this.districtName);
      if (this.talukaPanelState)
       this.TalukaMainMenuRef.onDistrictSelect(this.districtName);
      this.talukaPanelState = true;
      setTimeout(() => location.href = "#TalukaPanel", 200);
    });
  }

  ngAfterViewInit() {
    this.districtService.updateParameter();
    let postData = {
      year: this.districtService.getYear()
    }
    this.districtService.getYearDataFromServer(postData);
  }

  onPanelExpand() {
    //this.talukaView = !this.talukaView;
  }

}





