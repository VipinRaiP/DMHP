import { EventEmitter } from '@angular/core';

export class DistrictMapService {
    onDistrictSelected = new EventEmitter<any>(); //hover
    onYearChanged = new EventEmitter<number>();
    onDistrictClicked = new EventEmitter<any>();
    onTalukaSelected = new EventEmitter<any>(); //hover
    onDistrictChanged = new EventEmitter<any>(); //to change the district name in taluka component
}