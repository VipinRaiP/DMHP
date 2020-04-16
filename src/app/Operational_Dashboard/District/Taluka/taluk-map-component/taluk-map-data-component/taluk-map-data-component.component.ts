import { Component, OnInit, Input } from '@angular/core';
import { DistrictMapService } from 'src/app/Operational_Dashboard/District/services/district-map.service';
import { StringifyOptions } from 'querystring';

@Component({
  selector: 'app-taluk-map-data-component',
  templateUrl: './taluk-map-data-component.component.html',
  styleUrls: ['./taluk-map-data-component.component.css']
})
export class TalukMapDataComponentComponent implements OnInit {

  @Input()
  private district_name:string;

  private taluka_name:string;
  private total_cases:number;
  constructor(private mapService : DistrictMapService) { }
  

  ngOnInit() {

    this.mapService.onDistrictChanged.subscribe(
      (d)=>{
          this.district_name = d;
      }
    );

    this.mapService.onTalukaSelected.subscribe(
      (d)=>{
          this.taluka_name = d.taluka;
          this.total_cases = d.total_cases;
      }
    )

  }

}
