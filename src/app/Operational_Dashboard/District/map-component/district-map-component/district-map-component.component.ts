import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  selector: 'app-district-map-component',
  templateUrl: './district-map-component.component.html',
  styleUrls: ['./district-map-component.component.css']
})
export class DistrictMapComponentComponent implements OnInit {

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private width: number;
  private height: number;
  private data:any;
  private svg:any;
  @ViewChild('map', { static: true }) private chartContainer: ElementRef;

 
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get("assets/karnataka.json").subscribe(data =>{
      console.log("KARNATAKA JSON");
      console.log(data);
      this.data = data;
      this.createMap();
    })
    //
  }

  createMap()
  {
    let element = this.chartContainer.nativeElement;

     this.svg = d3.select(element)
      .append('svg')
      .attr('width',element.offsetWidth )//500)//element.offsetWidth)
      .attr('height',550)//element.offsetHeight)// 500)//element.offsetHeight)
      //.attr('viewBox',"0 0 480 450")
      .attr('preserveAspectRatio',"xMinYMax meet")
      .append('g')
      //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    this.width = element.offsetWidth - this.margin.left - this.margin.right;   //800
    this.height = element.offsetWidth - this.margin.top - this.margin.bottom; //400

    // d3.queue()
    //   .defer(d3.json,"karnataka.json")
    //   .await(ready);
  //   d3.json(".karnataka.json").then( function(json) {
  //    console.log(json);
  // });
    
    // console.log(this.data);

    let state = topojson.feature(this.data,this.data.objects["karnataka_district"]);
    // console.log("STATE JSON");
    // console.log(state);
    const projection = d3.geoMercator();
    projection.fitExtent(
      [
        [10, 5],
        [element.offsetWidth,element.offsetHeight],   // [500,450]
      ],
      state
    );

    // .translate([this.width/2 , this.height/2])
    // .scale(100);

    const path = d3.geoPath(projection);

    this.svg.selectAll(".country")
    .data(state.features)
    .enter()
    .append("path")
    .attr("class","country")
    .attr("d",path)
    .attr("fill","#cccccc")
    .attr("stroke","#333333")
    .attr("stroke-width","0.5");

  }

}
