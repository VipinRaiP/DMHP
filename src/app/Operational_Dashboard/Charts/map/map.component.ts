import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import d3Tip from "d3-tip";
import * as _ from "lodash";

import * as topojson from 'topojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {
  // Input Parameter
  @Input() private mapService: any;

  private mapName: string;
  private mapdata: any;
  private normalize: boolean;
  private mapDirPath: string;
  private fileExt: string;

  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  private svg: any;
  private width: number;
  private height: number;
  private jsondata: any;
  private formattedData: any = null;
  private xColumn: string;
  @ViewChild('map', { static: true }) private chartContainer: ElementRef;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.mapService.getMapParameterListener().subscribe((newParameter) => {
      this.mapName = newParameter.mapName;
      this.mapDirPath = newParameter.mapDirPath;
      this.fileExt = newParameter.fileExt;
      this.xColumn = newParameter.xColumn;
      this.getMap();
      //this.mapService.onDistrictChanged.emit(this.mapName);

    });

    this.mapService.getDataListener().subscribe((newData) => {
      this.mapdata = newData.data;
      this.normalize = newData.normalise;
      this.createMap();
    });

  }

  getMap() {
    this.http.get(this.mapDirPath + this.mapName + this.fileExt).subscribe(responseData => {
      this.mapName = this.mapName.replace(" ", "_");
      this.jsondata = responseData;
    })
  }

  createMap() {
    let formattedDataTempCopy = null;
    this.formattedData = {};
    if (this.mapdata != null) {
      //for (let d of mapdata){
      //.append({District : d.District, DistrictId : d.DistrictId, Total: d.Total});


      //}
      let groupWiseData = _.groupBy(this.mapdata, this.xColumn);

      this.formattedData = this.mapdata.reduce((acc, cur) => ({ ...acc, [cur[this.xColumn]]: groupWiseData[cur[this.xColumn]][0] }), {});

      formattedDataTempCopy = this.formattedData;


      var maxVal = 0;
      for (var v of this.mapdata) {
        if (v["Total"] > maxVal) {
          maxVal = v["Total"];
        }
      }
    }
    //console.log("MAX VALUE" + maxVal);


    let element = this.chartContainer.nativeElement;

    d3.select("#" + this.xColumn).remove();
    this.width = element.offsetWidth - this.margin.left - this.margin.right;   //800
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom; //400

    this.svg = d3.select(element)
      .append('svg')
      .attr("id", this.xColumn)
      .attr('width', this.width + 50)//500)
      .attr('height', this.height + 60)//element.offsetHeight)
      //.attr('viewBox',"0 0 480 450")
      .attr('preserveAspectRatio', "xMinYMax meet")
      .append('g')
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);



    let state = topojson.feature(this.jsondata, this.jsondata.objects[this.mapName]);

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
    tip.attr("class", "d3-tip")
      .offset([-10, 0])
      .html(d => {
        let keys = Object.keys(formattedDataTempCopy[d.properties.NAME_3]);
        let values = Object.values(formattedDataTempCopy[d.properties.NAME_3]);
        let ret = "";

        for (var i = 0; i < keys.length; i++) {
          ret += keys[i] + " : " + values[i] + "<br>"
        }

        return (
          //`<div style="width:300px;height:10px;opacity:10px;border:15px solid green;padding:50px;margin:20px;background-color:white"` +
          //`<strong>Frequency:</strong> <span style="color:red">` + d.properties.district+","+formattedDataTempCopy[d.properties.district]["Total"] + "</span>"
          //+ "</div>"
          ret
        )
      });

    this.svg.call(tip);

    let xColumn = this.xColumn;
    this.svg.selectAll(".country")
      .data(state.features)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", path)

      .attr("fill", (d) => {
        //console.log(this.formattedData[d.properties[this.xColumn]]+" "+d.properties[this.xColumn]);

        if (formattedDataTempCopy[d.properties.NAME_3] != null) {
          var n = formattedDataTempCopy[d.properties.NAME_3]["Total"]  || 0;

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
        //console.log(d.properties[this.xColumn]);
        //return "#cccccc";
      })
      .attr("stroke", "#333333")
      .attr("stroke-width", "1")
      .on('mouseover', function (d) {

        //scope of "this" here is to svg element so we can not call "regionSelected" directly
        // when used function(d) scope of "this" is to current svg element
        // when used (d)=> { } scope of "this" is same as angular "this"
        fu(d.properties.NAME_3);

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

        if (formattedDataTempCopy[d.properties.NAME_3] != null) {
          var n = formattedDataTempCopy[d.properties.NAME_3]["Total"]  || 0;

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

        console.log("Clicked",d.properties.NAME_3);
        //alert(d.properties);
        //this.mapService.onDistrictClicked.emit(d.properties.district);
        this.mapService.onDoubleClick.emit(d.properties.NAME_3);
        //location.href = "#TalukaPanel";  
      });

    let fu = (d) => {
      //console.log(this);
      this.regionHovered(d);

    }

  }

  regionHovered(data) {
    // console.log("HOVERED");
    // console.log(data);

    var total_cases = this.formattedData[data]["Total"];

    let emitData = {
      data: data,
      total_cases: total_cases.toLocaleString()
      // yColumnName : this.chartParameters.yColumnName,
      // parameterNumber : this.parameterNumber,
      // year: this.year
    }
    this.mapService.onRegionHover.emit(emitData);

  }
}
