import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as d3 from 'd3';
import * as topojson from 'topojson';
import { DistrictMapService } from '../../services/district-map.service';
import { Title } from '@angular/platform-browser';
import { StackedBarChartParameters } from '../../models/stackedBarChartParameters.model';
import d3Tip from "d3-tip";
import * as _ from "lodash";

@Component({
  selector: 'app-district-map-component',
  templateUrl: './district-map-component.component.html',
  styleUrls: ['./district-map-component.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DistrictMapComponentComponent implements AfterViewInit {

  @Input()
  private barChartService;
  public chartParameters: StackedBarChartParameters;
  private mapdata: any = null;
  private parameterNumber: number;
  private year: number;
  private formattedData: any = null;

  private margin: any = { top: 50, bottom: 30, left: 20, right: 20 };
  private width: number;
  private height: number;
  private jsondata: any;
  private svg: any;

  @ViewChild('map', { static: true }) private chartContainer: ElementRef;



  constructor(private httpClient: HttpClient, private mapService: DistrictMapService,
    private titleService: Title) { }

  ngAfterViewInit() {

    console.log("DISTRICT MAP COMPONENT LOADED");

    this.httpClient.get("assets/karnataka.json").subscribe(data => {
      // console.log("KARNATAKA JSON");
      // console.log(data);
      this.jsondata = data;
      this.createMap(this.mapdata);
    })

    this.chartParameters = this.barChartService.getParameters();

    this.barChartService.getParametersUpdateListener().subscribe((newParameter) => {
      console.log(" All dist map  : parameter received");
      console.log(newParameter);
      this.chartParameters = newParameter;
      //this.titleService.setTitle(this.chartParameters.yLabel);
    })

    this.barChartService.getDataListener().subscribe((newData) => {
      console.log(" All Dist map: Data update received");
      //alert("Map");
      console.log(newData);
      this.mapdata = newData.data;
      //this.year = newData.year;
      //this.parameterNumber = newData.parameterNumber;
      //this.granular = newData.granular;
      //localStorage.setItem("granular_allDist",newData.granular+"");
      //this.choosenValue = newData.choosenValue;
      //if (this.granular == 2)
      //  this.monthName = this.months[this.choosenValue-1];
      //this.updateMapColors(this.mapdata);
      //this.updateMap(this.mapdata);
      this.createMap(this.mapdata);
    })

    // this.httpClient.get("assets/karnataka.json").subscribe(data =>{
    //   console.log("KARNATAKA JSON");
    //   console.log(data);
    //   this.jsondata = data;
    //   this.createMap();
    // })
    //
  }
  // updateMap(mapdata:any)
  // {
  //   console.log("MAP DATA FROM SERVICE");
  //   console.log(mapdata);

  //   this.svg.selectAll(".country")
  //   .attr("fill","#cccccc")
  //   .attr("stroke","#333333")
  //   .attr("stroke-width","0.5");

  // }

  createMap(mapdata: any) {

    // console.log("MAP DATA FROM SERVICE");
    // console.log(mapdata);

    
    
    let formattedDataTempCopy = null;
    this.formattedData = {};
    if (mapdata != null) {
      //for (let d of mapdata){
      //.append({District : d.District, DistrictId : d.DistrictId, Total: d.Total});


      //}
      console.log("DITRICT MAP DATA");
      console.log(mapdata)

      console.log("DISTRICTWISE DATA");
    
      let districtWiseData = _.groupBy(mapdata,'District');
      console.log(districtWiseData);

      //this.formattedData = mapdata.reduce((acc, cur) => ({ ...acc, [cur.District]: cur["Total"] }), {});
      this.formattedData = mapdata.reduce((acc, cur) => ({ ...acc, [cur.District]: districtWiseData[cur.District][0] }), {});
      formattedDataTempCopy = this.formattedData;

      console.log("FORMATTED DATA");
      console.log(this.formattedData);
      //console.log(temp);

      var maxVal = 0;
      for (var v of mapdata) {
        if (v["Total"] > maxVal) {
          maxVal = v["Total"];
        }
      }
    }
    //console.log("MAX VALUE" + maxVal);


    let element = this.chartContainer.nativeElement;


    d3.select('#the_SVG_ID').remove();

    this.svg = d3.select(element)
      .append('svg')
      .attr("id", "the_SVG_ID")
      .attr('width', element.offsetWidth)//500)
      .attr('height', 500)//element.offsetHeight)
      //.attr('viewBox',"0 0 480 450")
      .attr('preserveAspectRatio', "xMinYMax meet")
      .append('g')
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    this.width = element.offsetWidth - this.margin.left - this.margin.right;   //800
    this.height = element.offsetWidth - this.margin.top - this.margin.bottom; //400

    let state = topojson.feature(this.jsondata, this.jsondata.objects["karnataka_district"]);

    const projection = d3.geoMercator();
    projection.fitExtent(
      [
        [10, 5],
        [element.offsetWidth, element.offsetHeight],   // [500,450]
      ],
      state
    );


    const path = d3.geoPath(projection);
    let tempColor = "";

    /* tooptip */
    const tip = d3Tip();   
    tip
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(d => {
        console.log(d);
        let keys = Object.keys(formattedDataTempCopy[d.properties.district]);
        let values = Object.values(formattedDataTempCopy[d.properties.district]);
        let ret = "";

        for(var i=0;i<keys.length;i++){
          ret += keys[i] +" : " +values[i]+ "<br>"
        }

        return (
          //`<div style="width:300px;height:10px;opacity:10px;border:15px solid green;padding:50px;margin:20px;background-color:white"` +
          //`<strong>Frequency:</strong> <span style="color:red">` + d.properties.district+","+formattedDataTempCopy[d.properties.district]["Total"] + "</span>"
           //+ "</div>"
          ret
        )
      })

    this.svg.call(tip);
    
  
    this.svg.selectAll(".country")
      .data(state.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)
      .attr("fill", (d) => {
        //console.log(this.formattedData[d.properties.district]+" "+d.properties.district);

        if (this.formattedData[d.properties.district] != null) {
          var n = this.formattedData[d.properties.district]["Total"] || 0;

          const color =
            n === 0
              ? '#ffffff'
              : d3.interpolateReds(
                (0.8 * n) / (maxVal || 0.009)
              );

          tempColor = color;
          return color;

        }
        else {
          return "white";
        }
        //console.log(d.properties.district);
        //return "#cccccc";
      })
      .attr("stroke", "#333333")
      .attr("stroke-width", "1")
      .on('mouseover', function (d) {

        //scope of "this" here is to svg element so we can not call "regionSelected" directly
        // when used function(d) scope of "this" is to current svg element
        // when used (d)=> { } scope of "this" is same as angular "this"
        fu(d.properties.district);

        d3.select(this).transition()
          .duration('50')
          .attr('fill', "grey")

        tip.show(d,this);
        //d3.select(this).style("fill","#cccccc");
        //abc(d.properties.district);
        //this.regionSelected(d.properties.district);
      })
      .on('mouseout', function (d) {
        // d3.select(this).transition()
        //      .duration('50')
        //      .attr('stroke', '#333333')
        // d3.select(this).classed('selected',false)
        //this.regionSelected(null);
        tip.hide(d,this);
        if (formattedDataTempCopy != null) {
          var n = formattedDataTempCopy[d.properties.district]["Total"] || 0;

          const color =
            n === 0
              ? '#ffffff'
              : d3.interpolateReds(
                (0.8 * n) / (maxVal || 0.001)
              );

          //d3.select(this).style("fill",color);

          d3.select(this).transition()
            .duration('50')
            .attr('fill', color)

        }
        else {
          d3.select(this).transition()
            .duration('50')
            .attr('fill', "white")
        }

        //console.log(this);
      })
      .on('dblclick', (d) => {

        //console.log("Clicked");
        //alert(d.properties);
        //this.mapService.onDistrictClicked.emit(d.properties.district);
        this.barChartService.onDoubleClick.emit(d.properties.district);
        //location.href = "#TalukaPanel";  
      });


    let fu = (d) => {
      //console.log(this);
      this.regionSelected(d);

    }
  }//CM

  regionSelected(data) {
    // console.log("HOVERED");
    // console.log(data);

    var total_cases = this.formattedData[data]["Total"];

    let emitData = {
      district: data,
      total_cases: total_cases.toLocaleString()
      // yColumnName : this.chartParameters.yColumnName,
      // parameterNumber : this.parameterNumber,
      // year: this.year
    }
    this.mapService.onDistrictSelected.emit(emitData);

  }

}
