import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})
export class MapComponentComponent implements OnInit {

  @Input()
  private barChartService;
  
  constructor() { }

  ngOnInit() {
  }

}
