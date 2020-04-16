import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BarChartDistrictParameters } from '../../models/district-barChartParameters.model';
import { DistrictDataReq } from '../../models/district-dataReq.model';
import { TalukaPatientService } from '../../services/taluka-patient.service';
import { HttpClient } from '@angular/common/http';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-taluka-menu',
  templateUrl: './taluka-menu.component.html',
  styleUrls: ['./taluka-menu.component.css']
})
export class TalukaMenuComponent implements OnInit, OnDestroy {
  mapView: boolean = false;

  @Input() private districtId: number;
  private parameterNumber: number = 1;
  private params = Array(3);
  private parameterType;
  private chartLoaded = false;
  private newDataReq: DistrictDataReq;
  private districtData: any;

  constructor(private barChartService: TalukaPatientService, private router: Router, private route: ActivatedRoute, private http: HttpClient) { }


    ngOnInit() {
    console.log("[taluka-menu.component] : Init DistrictId " + this.districtId)
    this.getDistrictData();
    this.newDataReq = {
      onSubmit: true,
      granular: 1,
      choosenValue: 2017,
      year: 2017,
      parameterNumber: 1,
      districtId: this.districtId,
      districtName: "Bagalkote" //added
    }
    console.log("Data request to be created::::")
    console.log(this.newDataReq);
    this.barChartService.createDataReq(this.newDataReq);
  }

  mapToggle() {
    this.mapView = !this.mapView;
    console.log("MAP TOGGLE " + this.mapView);
  }

  setDistrictId(districtId: number) {
    this.districtId = districtId;
    this.newDataReq.districtId = this.districtId;
    this.newDataReq.districtName= this.getDistrictName(districtId);
    this.barChartService.createDataReq(this.newDataReq);
  }

  getDistrictName(districtId: number)
  {
    for(var dist of this.districtData)
    {
        if(dist.DistrictId == districtId)
        {
            return dist.District;
        }
    }
  }

  onSubmit(form: NgForm) {
    let parameters: BarChartDistrictParameters;
    this.parameterNumber = (form.value.parameter == "") ? 1 : form.value.parameter;
    console.log("[taluka-menu.component] : Choosen value : " + this.parameterType);
    this.newDataReq.parameterNumber = this.parameterNumber;
    this.setDistrictId(this.districtId);
  }

  getDistrictData() {
    this.http.get("http://localhost:3000/getDistrictData").subscribe((responseData) => {
      console.log("Per dist Menu: District names recieved");
      console.log(responseData);
      this.districtData = responseData;
      this.districtId = 1;
    })
  }

  onSelected(val: any) {
    
    this.setDistrictId(this.districtId);
  }

  onChartLoaded() {
    this.chartLoaded = true;
  }

  ngOnDestroy() {
  }

}
