import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PatientCountService } from './patient-count.service'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientCountTalukaService extends PatientCountService {
  private districtId: number;
  private districtName: string;
  private districts = new Map<string, number>();
  private districtNames = new Subject<any[]>();

  constructor(http: HttpClient) {
    super(http);
  }

  name() {
    return "PatientCountTalukaService";
  }

  getSortOptions() {
    return ["Rank", this.getxColumn()]
  }
  
  initialize() {
    super.initialize();

    let dataURL = {
      annual: "getAllDataTalukaAnnually",
      monthly: "getAllDataTalukaMonthly",
      quarterly: "getAllDataTalukaQuarterly"
    };
    this.setDataURL(dataURL);

    let keys = ["Alcohol Cases", "Suicide Cases", "SMD Cases", "CMD Cases", "Psychiatric Disorder Cases", "O1 Cases", "O2 Cases", "O3 Cases", "O4 Cases", "O5 Cases"];
    this.setKeys(keys);
    this.districtName = "";
    this.setLabels("Taluka", "Cases");
    this.setxColumn("Taluka");
    this.setDataType("PatientT");
    this.setYear(2018);
    this.setNormalizeDisabled(true);
  }

  start() {
    this.http.get("http://localhost:" + this.getPort() + "/getDistrictData").subscribe((responseData) => {
      this.createMap(responseData);
      this.setDistrictParameter(this.districtName);
      this.districtNames.next(Array.from(this.districts.keys()));
    });
  }

  getDistrictNames() {
    return this.districtNames.asObservable();
  }

  createMap(districtData: any) {
    for (let d of districtData) {
      this.districts.set(d.District, d.DistrictId);
    }
  }

  setDistrictParameter(districtName: string) {
    this.districtName = districtName;
    if (this.districtName == "")
      this.districtName = this.districts.keys().next(0).value;
    this.districtId = this.districts.get(this.districtName);
    super.setMapParameter("assets/", this.districtName, ".topojson");
    this.updateParameter();
    let postData = {
      year: this.getYear(),
      districtId: this.districtId
    }
    this.getYearDataFromServer(postData);
  }

  setDistrictName(districtName: string) {
    this.districtName = districtName;
  }

  getDistrictName() {
    return this.districtName;
  }

}
