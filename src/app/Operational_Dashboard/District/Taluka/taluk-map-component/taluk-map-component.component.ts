import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-taluk-map-component',
  templateUrl: './taluk-map-component.component.html',
  styleUrls: ['./taluk-map-component.component.css']
})
export class TalukMapComponentComponent implements OnInit {

  @Input()
  private barChartService; 
  
  constructor() { }

  ngOnInit() {
  }

}
