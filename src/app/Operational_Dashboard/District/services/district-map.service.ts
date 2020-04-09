import { EventEmitter } from '@angular/core';

export class DistrictMapService {
    onDistrictSelected = new EventEmitter<any>();
    onYearChanged = new EventEmitter<number>();
}