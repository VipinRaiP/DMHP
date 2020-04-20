import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DistrictMapService } from 'src/app/Operational_Dashboard/District/services/district-map.service';
import { Title } from '@angular/platform-browser';

import * as d3 from 'd3';
import * as topojson from 'topojson';
import { TalukaPatientService } from '../../../services/taluka-patient.service';
import { StackedBarChartParameters } from '../../../models/stackedBarChartParameters.model';
@Component({
  selector: 'app-taluk-main-map-component',
  templateUrl: './taluk-main-map-component.component.html',
  styleUrls: ['./taluk-main-map-component.component.css']
})
export class TalukMainMapComponentComponent implements AfterViewInit {

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private width: number;
  private height: number;
  private jsondata: any;
  private svg: any;



  private districtname: String;
  @ViewChild('map', { static: true }) private chartContainer: ElementRef;


  private mapdata: Array<any> = [];

  private chartParameters: StackedBarChartParameters;

  private year: number;
  private quarterData: any;
  private monthlyData: any;
  private annualData: any;
  private quarterChoosen: number = 1;
  private monthChoosen: number = 1;
  private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  private monthName = "Jan";
  private displayMonthData = false;
  private displayQuarterData = false;
  private granularChoosen: number = 1; // Granualirity : 1: Annual , 2 : Month , 3: Quarter
  private dataURL: any;
  choosenValue: any;
  granular: number;
  private formattedData: any = null;


  @Input()
  private barChartService;

  constructor(private httpClient: HttpClient, private mapService: DistrictMapService,
    private titleService: Title) { }


  ngAfterViewInit() {

    this.districtname = "Bagalkote";
    this.httpClient.get("assets/Bagalkote.topojson").subscribe(data => {
      // console.log("TALUK JSON");
      // console.log(data);
      this.jsondata = data;
      this.createMap(this.mapdata);
      //this.createMap(this.mapdata);
    })

    console.log("TALUKA MAP INIT");

    this.barChartService.getParametersUpdateListener().subscribe((newParameter) => {
      console.log("[bar-chart-taluka-MAP] : Parameter Received");
      console.log(newParameter);
      this.chartParameters = newParameter;
      //this.titleService.setTitle(this.chartParameters.yLabel);
    })

    this.barChartService.getDataListener().subscribe((newData) => {
      console.log("[bar-chart-taluka-MAP] : Data-Update received");
      console.log(newData);
      console.log("[bar-chart-taluka-MAP] : Data-Update received");
      this.mapdata = newData.data;
      //this.year = newData.year;
      //this.granular = newData.granular;

      //localStorage.setItem("granular_allDist", newData.granular + "");
      //this.choosenValue = newData.choosenValue;
      // if (this.granular == 2)
      //  this.monthName = this.months[this.choosenValue - 1];
      //alert(this.mapdata);

      if(this.districtname!=newData.parameterValue)
        this.updateMap(newData.parameterValue);
      else
        this.createMap(this.mapdata);
      //this.createMap(this.mapdata);
      //this.updateChart();
    })

   

    /*this.mapService.onDistrictClicked.subscribe(
      (d) => {
        //alert(d);
        let s = d.split(" ");
        if (s.length > 1) {
          this.districtname = s[0] + "_" + s[1];
        }
        else {
          this.districtname = d;
        }
        //alert(this.districtname);

        let topojsonPath = "assets/" + this.districtname + ".topojson";

        this.httpClient.get(topojsonPath).subscribe(data => {
          console.log("TALUK JSON");
          console.log(data);
          this.jsondata = data;
          this.mapService.onDistrictChanged.emit(d);
          this.createMap(this.mapdata);
          //this.createMap(this.mapdata);
        })
      });*/



    // this.httpClient.get("assets/Bellary.topojson").subscribe(data =>{
    //   console.log("TALUK JSON");
    //   console.log(data);
    //   this.jsondata = data;
    //   this.districtname = "Bellary";
    //   this.createMap(this.mapdata);
    // });


  }


  updateMap(d) {
    let s = d.split(" ");
    if (s.length > 1) {
      this.districtname = s[0] + "_" + s[1];
    }
    else {
      this.districtname = d;
    }
    //alert(this.districtname);
    
    let topojsonPath = "assets/" + this.districtname + ".topojson";
    //alert(this.districtname +"    "+ topojsonPath);

    this.httpClient.get(topojsonPath).subscribe(data => {
      console.log("TALUK JSON");
      console.log(data);
      this.jsondata = data;
      this.mapService.onDistrictChanged.emit(d);
      this.createMap(this.mapdata);
      //this.createMap(this.mapdata);
    })
  }

  createMap(mapdata) {

    console.log("MAP DATA FROM SERVICE");
    console.log(mapdata);

    let formattedDataTempCopy = null;
    this.formattedData = null;
    if (mapdata.length != 0) {
      //let caseString = Object.keys(mapdata[0])[Object.keys(mapdata[0]).length-1]; //consindering the last column of data received for number of cases

      //console.log(caseString);

      //this.formattedData = mapdata.reduce((acc, cur) => ({ ...acc, [cur.Taluka]: cur[caseString] }), {});
      this.formattedData = mapdata.reduce((acc, cur) => ({ ...acc, [cur.Taluka]: cur["Total"] }), {});

      formattedDataTempCopy = this.formattedData;

      console.log("FORMATTED DATA");
      console.log(this.formattedData);

      var maxVal = 0;
      for (var v of mapdata) {
        if (v["Total"] > maxVal) {
          maxVal = v["Total"];
        }
      }

      console.log("MAX VALUE" + maxVal);

    }
    let element = this.chartContainer.nativeElement;


    d3.select('#the_SVG_ID_Taluk').remove();

    this.svg = d3.select(element)
      .append('svg')
      .attr("id", "the_SVG_ID_Taluk")
      .attr('width', element.offsetWidth)//500)
      .attr('height', 500)//element.offsetHeight)
      //.attr('viewBox',"0 0 480 450")
      .attr('preserveAspectRatio', "xMinYMax meet")
      .append('g')
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    this.width = element.offsetWidth - this.margin.left - this.margin.right;   //800
    this.height = element.offsetWidth - this.margin.top - this.margin.bottom; //400

    let ds = this.districtname;

    let state = topojson.feature(this.jsondata, this.jsondata.objects["" + ds]);

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


    this.svg.selectAll(".taluk")
      .data(state.features)
      .enter()
      .append("path")
      .attr("class", "taluk")
      .attr("d", path)
      .attr("fill", (d) => {
        //console.log(this.formattedData[d.properties.NAME_3]+" "+d.properties.NAME_3);
        if (this.formattedData != null) {
          var n = this.formattedData[d.properties.NAME_3] || 0;

          // console.log(n);
          const color =
            n == 0
              ? '#ffffff'
              : d3.interpolateReds(
                (0.8 * n) / (maxVal || 0.001)
              );

          tempColor = color;
          return color;

        }
        else {
          return "white";
        }
        //console.log(d.properties.NAME_3);
        //return "#cccccc";
      })
      .attr("stroke", "#333333")
      .attr("stroke-width", "1")
      //.attr("fill", "grey")
      .on('mouseover', function (d) {

        //scope of "this" here is to svg element so we can not call "regionSelected" directly
        // when used function(d) scope of "this" is to current svg element
        // when used (d)=> { } scope of "this" is same as angular "this"
        fu(d.properties.NAME_3);
        //console.log(d.properties.NAME_3);
        d3.select(this).transition()
          .duration('50')
          .attr('fill', "grey")
        //d3.select(this).style("fill","#cccccc");
        //abc(d.properties.district);
        //this.regionSelected(d.properties.district);
      })
      .on('mouseout', function (d) {

        //d3.select(this).style("fill","grey");

        // d3.select(this).transition()
        //   .duration('50')
        //   .attr('fill', "grey")

        if (formattedDataTempCopy != null) {
          var n = formattedDataTempCopy[d.properties.NAME_3] || 0;

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
      });

    let fu = (d) => {
      //console.log(this);
      this.talukaSelected(d);

    }

  }

  talukaSelected(data) {
    // console.log("HOVERED");
    // console.log(data);

    var total_cases = this.formattedData[data];

    let emitData = {
      taluka: data,
      total_cases: total_cases

    }
    this.mapService.onTalukaSelected.emit(emitData);

  }

}
