import { Component, OnInit } from '@angular/core';
import { DistrictMapService } from '../../services/district-map.service';

@Component({
  selector: 'app-district-map-data-component',
  templateUrl: './district-map-data-component.component.html',
  styleUrls: ['./district-map-data-component.component.css']
})
export class DistrictMapDataComponentComponent implements OnInit {
  private district: string;
  private total_cases:number;


  constructor(private mapService : DistrictMapService) { }

  ngOnInit() {
    this.mapService.onDistrictSelected.subscribe(
      (emitData) => {
        
        // console.log("Map details: Data Received")
        // console.log(emitData);
        this.district = emitData.district;
        this.total_cases = emitData.total_cases;

      }
    )
  }

}
