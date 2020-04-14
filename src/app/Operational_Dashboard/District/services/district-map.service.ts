import { EventEmitter } from '@angular/core';

export class DistrictMapService {
    onDistrictSelected = new EventEmitter<any>(); //hover
    onYearChanged = new EventEmitter<number>();
    onDistrictClicked = new EventEmitter<any>();
}