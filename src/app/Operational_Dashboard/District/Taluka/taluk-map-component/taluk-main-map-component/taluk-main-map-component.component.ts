import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DistrictMapService } from 'src/app/Operational_Dashboard/District/services/district-map.service';
import { Title } from '@angular/platform-browser';

import * as d3 from 'd3';
import * as topojson from 'topojson';
@Component({
  selector: 'app-taluk-main-map-component',
  templateUrl: './taluk-main-map-component.component.html',
  styleUrls: ['./taluk-main-map-component.component.css']
})
export class TalukMainMapComponentComponent implements OnInit {

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
  private width: number;
  private height: number;
  private jsondata:any;
  private svg:any;


  private districtname:String;
  @ViewChild('map', { static: true }) private chartContainer: ElementRef;

  constructor(private httpClient:HttpClient,private mapService : DistrictMapService,
    private titleService:Title) { }


  ngOnInit() {

    this.mapService.onDistrictClicked.subscribe(
      (d) =>
      {
        //alert(d);
        let s = d.split(" ");
        if(s.length>1)
        {
          this.districtname = s[0]+"_"+s[1];
        }
        else
        {
          this.districtname = d;
        }
        //alert(this.districtname);

        let topojsonPath = "assets/"+this.districtname+".topojson";

        this.httpClient.get(topojsonPath).subscribe(data =>{
          console.log("TALUK JSON");
          console.log(data);
          this.jsondata = data;
          this.createMap();
          //this.createMap(this.mapdata);
        })


      }
    );

    
      
    
  }

  createMap()
  {

    // console.log("MAP DATA FROM SERVICE");
    // console.log(mapdata);

    //  this.formattedData = mapdata.reduce((acc, cur) => ({ ...acc, [cur.District]: cur["Total Cases"] }), {});

    //   let formattedDataTempCopy = this.formattedData;

    // console.log("FORMATTED DATA");
    // console.log(this.formattedData);
    
    // var maxVal = 0;
    // for(var v of mapdata)
    // {
    //     if(v["Total Cases"] > maxVal)
    //     {
    //       maxVal = v["Total Cases"];
    //     }
    // }

    // console.log("MAX VALUE" + maxVal);


    let element = this.chartContainer.nativeElement;

    
    d3.select('#the_SVG_ID_Taluk').remove();

     this.svg = d3.select(element)
      .append('svg')
      .attr("id","the_SVG_ID_Taluk")
      .attr('width',element.offsetWidth )//500)
      .attr('height',550)//element.offsetHeight)
      //.attr('viewBox',"0 0 480 450")
      .attr('preserveAspectRatio',"xMinYMax meet")
      .append('g')
      //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    this.width = element.offsetWidth - this.margin.left - this.margin.right;   //800
    this.height = element.offsetWidth - this.margin.top - this.margin.bottom; //400
    
    let ds = this.districtname;

    let state = topojson.feature(this.jsondata,this.jsondata.objects[""+ds]);

    const projection = d3.geoMercator();
    projection.fitExtent(
      [
        [10, 5],
        [element.offsetWidth,element.offsetHeight],   // [500,450]
      ],
      state
    );


    const path = d3.geoPath(projection);
    let tempColor ="";


    this.svg.selectAll(".taluk")
    .data(state.features)
    .enter()
    .append("path")
    .attr("class","taluk")
    .attr("d",path)
    // .attr("fill",(d) =>
    // {
    //   console.log(this.formattedData[d.properties.district]+" "+d.properties.district);
    //   var n = this.formattedData[d.properties.district] || 0 ;

    //   const color =
    //         n === 0
    //           ? '#ffffff'
    //           : d3.interpolateReds(
    //               (0.8 * n) / (maxVal || 0.001)
    //             );

    //             tempColor = color;
    //       return color;
    //   //console.log(d.properties.district);
    //   //return "#cccccc";
    // })
    .attr("stroke","#333333")
    .attr("stroke-width","1")
    .attr("fill","grey")
    // .on('mouseover', function(d) {
     
    //   //scope of "this" here is to svg element so we can not call "regionSelected" directly
    //   // when used function(d) scope of "this" is to current svg element
    //   // when used (d)=> { } scope of "this" is same as angular "this"
    //   fu(d.properties.district);

    //   d3.select(this).transition()
    //        .duration('50')
    //        .attr('fill', "grey")
    //   //d3.select(this).style("fill","#cccccc");
    //   //abc(d.properties.district);
    //   //this.regionSelected(d.properties.district);
    // })
    // .on('mouseout', function(d){
    //   // d3.select(this).transition()
    //   //      .duration('50')
    //   //      .attr('stroke', '#333333')
    //   // d3.select(this).classed('selected',false)
    //   //this.regionSelected(null);

    //   var n = formattedDataTempCopy[d.properties.district] || 0 ;

    //   const color =
    //         n === 0
    //           ? '#ffffff'
    //           : d3.interpolateReds(
    //               (0.8 * n) / (maxVal || 0.001)
    //             );

    //   //d3.select(this).style("fill",color);
                
    //   d3.select(this).transition()
    //        .duration('50')
    //        .attr('fill', color)


    //   //console.log(this);
    //   });

      //  let fu = (d) =>
      // {
      //     //console.log(this);
      //     this.regionSelected(d);
   
      // }



  }

}
