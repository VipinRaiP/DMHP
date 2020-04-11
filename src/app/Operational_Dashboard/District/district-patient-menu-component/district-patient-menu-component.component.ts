import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BarChartDistrictParameters } from '../models/district-barChartParameters.model';
import { DistrictDataReq } from '../models/district-dataReq.model';
import { DistrictPatientService } from '../services/district-patient.service';

@Component({
  selector: 'app-district-patient-menu-component',
  templateUrl: './district-patient-menu-component.component.html',
  styleUrls: ['./district-patient-menu-component.component.css']
})
export class DistrictPatientMenuComponentComponent implements OnInit {
  mapView: boolean = false;


  @Input()
  private parameterNumber: number = 1;
  private params = Array(3);
  private parameterType;

  constructor(private barChartService: DistrictPatientService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
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

  ngOnDestroy() {
  }


}
