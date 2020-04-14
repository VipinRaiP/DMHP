import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BarChartDistrictParameters } from '../models/district-barChartParameters.model';
import { DistrictDataReq } from '../models/district-dataReq.model';
import { DistrictPatientService } from '../services/district-patient.service';
import {TalukaMenuComponent} from '../Taluka/taluka-menu/taluka-menu.component';

@Component({
  selector: 'app-district-patient-menu-component',
  templateUrl: './district-patient-menu-component.component.html',
  styleUrls: ['./district-patient-menu-component.component.css'],
  entryComponents: [TalukaMenuComponent]
})
export class DistrictPatientMenuComponentComponent implements OnInit {
  @ViewChild(TalukaMenuComponent ,{static : false}) TalukaMenuComponentRef: TalukaMenuComponent;
  private selectDistrictId: number = 1;
  talukaView: boolean = false;

  mapView: boolean = false;


  @Input()
  private parameterNumber: number = 1;
  private params = Array(3);
  private parameterType;
  private chartLoaded= false;
  constructor(private barChartService: DistrictPatientService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.selectDistrictId=1;
    this.talukaView = false;

    console.log("All dist chart menu loaded")
    let newDataReq: DistrictDataReq = {
      onSubmit: true,
      granular: 1,
      choosenValue: 2017,
      year: 2017,
      parameterNumber: 1
    }
    this.barChartService.createDataReq(newDataReq);
  }

  mapToggle() {
    this.mapView = !this.mapView;
    console.log("MAP TOGGLE " + this.mapView);
  }

  onSubmit(form: NgForm) {
    console.log("Form submitted");
    let parameters: BarChartDistrictParameters;
    this.parameterNumber = (form.value.parameter == "") ? 1 : form.value.parameter;
    console.log("Choosen value : " + this.parameterType);
    let newDataReq: DistrictDataReq = {
      onSubmit: true,
      granular: 1,
      choosenValue: 2017,
      year: 2017,
      parameterNumber: this.parameterNumber
    }
    this.barChartService.createDataReq(newDataReq);
  }

  loadComponent() {
    this.talukaView = !this.talukaView;
  }

  onChartLoaded(){
    this.chartLoaded = true;
  }

  ngOnDestroy() {
  }



}
