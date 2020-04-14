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
  private district_name:String;

  constructor(private mapService : DistrictMapService) { }
  

  ngOnInit() {

    this.mapService.onDistrictClicked.subscribe(
      (d)=>{
          this.district_name = d;
      }
    );

  }

}
