import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Title } from "@angular/platform-browser";
import * as d3 from 'd3';
import d3Tip from "d3-tip";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StackedBarChartComponent implements OnInit {
  // Input Parameter
  @Input() private chartService: any;

  // Chart Variables
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  private margin = { top: 50, left: 100, bottom: 30, right: 60 };
  private svg: any;
  private width: number;
  private height: number;
  private xAxis: any;
  private yAxis: any;
  private yLabel: any;
  private xLabel: any;
  private g: any;
  private z: any;
  private x: any;
  private y: any;
  private tooltip: any;
  private rects: any;
  private speed: number = 500;
  private xLabelName: string;
  private yLabelName: string;
  private xColumn: string;
  private dataType:string;

  // Request Variables
  private normalize: boolean;
  private data: Array<any> = [];
  private keys: string[];
  private currkeys: string[];

  // Other Variables
  private columns = new Map<string, boolean>();
  private sortColumn: string;
  private parameterValue: string;

  // Output Parameter
  @Output() public chartLoaded: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.chartService.getParameterListener().subscribe((newParameter) => {
      this.xLabelName = newParameter.xLabel;
      this.yLabelName = newParameter.yLabel;
      this.xColumn = newParameter.xColumn
      this.dataType = newParameter.dataType;
      this.keys = newParameter.keys;
      this.createChart();
    });

    this.chartService.getDataListener().subscribe((newData) => {
      this.currkeys = newData.currkeys;
      this.data = newData.data;
      this.normalize = newData.normalise;
      this.updateChart();
    });
  }

  // Set up the chart
  createChart() {
    // Chart parameters
    let element = this.chartContainer.nativeElement;

    //d3.select(this.xColumn).remove();
    //d3.select(element)
    //.append(this.xColumn);
    d3.select("#" + this.xColumn +this.dataType+ "sbc").remove();

    this.svg = d3.select(element)
      .append('svg')
      .attr("id", this.xColumn + this.dataType+"sbc")
      .attr('width', element.offsetWidth + 300)
      .attr('height', element.offsetHeight + 60);

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.g = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // X Axis
    this.xAxis = this.svg.append("g")
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .attr("class", "x-axis");

    // Y Axis  
    this.yAxis = this.svg.append("g")
      .attr("transform", `translate(${this.margin.left - 5},0)`)
      .attr("class", "y-axis");

    // X Label
    this.xLabel = this.g.append("text")
      .attr("y", this.height + this.margin.bottom) // - this.margin.bottom/2)
      .attr("x", (this.width - this.margin.left - this.margin.right) / 2)
      .attr("font-size", "18px")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .text(this.xLabelName);

    // Y label 
    this.yLabel = this.g.append("text")
      .attr("x", (-this.height + this.margin.bottom + this.margin.top) / 2)
      .attr("y", -this.margin.left / 1.2)
      .attr("font-size", "18px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .text(this.yLabelName);

    // set the colors 
    this.z = d3.scaleOrdinal([...d3.schemeSet2, ...d3.schemePaired]);
    this.z.domain(this.keys);
  }

  // Update the chart
  updateChart() {
    /*svg.append("rect")
    .attr("x", this.width+15)
    .attr("width", this.width-this.margin.right)
    .attr("height", this.height/2)
    .attr("y",0)
    .attr("fill", "Gray")
    .style("opacity", 0.1);*/

    // Set Legend  
    this.svg.selectAll(".legend").remove();
    let legend = this.svg.selectAll(".legend")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .data(this.keys.slice())
      .enter().append("g")
      .attr("class", "legend")
      .style("opacity", (d) => this.currkeys.includes(d) ? 1 : 0.2)
      .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; })
      .attr("cursor", "pointer")
      .on('click', (d) => {
        //d3.select(this).style("opacity", !this.currkeys.includes(d) ? 1 : 0.2);
        this.chartService.onLegendClick.emit(d);
      });

    legend.append("rect")
      .attr("x", this.width - 65)
      .attr("width", 18)
      .attr("height", 15)
      .attr("y", 3.5)
      .attr("fill", this.z);

    legend.append("text")
      .attr("x", this.width - 35)
      .attr("y", 11.5)
      .attr("dy", ".35em")
      .attr("font-size", "15px")
      .attr("text-anchor", "start")
      .text(function (d) { return d; });


    /* tooptip */
    const tip = d3Tip();
    tip.attr("class", "d3-tip")
      .offset([-10, 0])
      .html((data) => {
        let keys = [...this.currkeys];

        let ret = "<div style='text-align: center;'><strong>" + data[this.xColumn] + "</strong></div><br>";
        ret += "<table style='width:200px;font-size: 17px;'><tbody>";
        for (let key of keys.reverse()) {
          ret += "<tr style='color:" + this.z(key) + ";'><td>" + key + " </td><td style='text-align:right; padding-left:15px;'> " + data[key].toLocaleString() + "</td></tr>"
        }
        ret += "</tbody></table>";
        return ret;
      });

    this.svg.call(tip);

    // Set X & Y domains
    let xDomain = this.data.map(d => d[this.xColumn]);
    let yDomain = [0, d3.max(this.data, d => (d.Total == 0) ? 0.1 : d.Total)];

    // Set x scale
    this.x = d3.scaleBand()
      .range([this.margin.left, this.width - this.margin.right])
      .paddingInner(0.3)
      .align(0.1);

    // Set y scale
    this.y = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.top])

    this.x.domain(xDomain)
    this.y.domain(yDomain).nice();

    // Plot bars
    let group = this.svg.selectAll("g.layer")
      .data(d3.stack().keys(this.currkeys)(this.data))
      .attr("fill", d => this.z(d.key));

    group.exit().remove();

    group.enter().append("g")
      .classed("layer", true)
      .attr("fill", d => this.z(d.key));

    let bars = this.svg.selectAll("g.layer").selectAll("rect")
      .data(function (d) { return d; });

    bars.exit().remove();

    bars.enter().append("rect")
      .attr("width", this.x.bandwidth())
      .merge(bars)
      .attr("x", d => this.x(d.data[this.xColumn]))
      .attr('y', d => this.y(0))
      .attr('height', 0)
      .on("mouseover", function (d) { tip.show(tipFunction(d), this); })
      .on("mouseout", function (d) { tip.hide(d, this); })
      //.on("mousemove", function (d) { tip.show(tipFunction(d), this); })
      .on("dblclick", (d) => {
        this.chartService.onDoubleClick.emit(d.data[this.xColumn]);
        //location.href = "#TalukaPanel";  
        //document.getElementById("TalukaPanel").scrollIntoView()
      })
      .transition().duration(this.speed)
      .attr("y", d => this.y(d[1]))
      .attr("height", d => this.y(d[0]) - this.y(d[1]))
      .attr("cursor", "pointer");

    let tipFunction = (d) => {
      return d.data;
    }

    // Update Y Axis
    this.svg.selectAll(".y-axis").transition().duration(this.speed)
      .call(d3.axisLeft(this.y)
        //.tickSize(-width+margin.left-margin.right)
        .ticks(10))
      .attr("font-size", "14px")
      ;


    //d3.axisLeft(y).tickSize(-width+margin.left-margin.right).ticks(10);
    /*      function make_y_gridlines() {
            return d3.axisLeft(y)
              .ticks(5)
          }
          svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
              .tickSize(-width)
            )*/

    // Update X Axis 
    this.svg.selectAll(".x-axis").transition().duration(this.speed)
      .call(d3.axisBottom(this.x).tickSizeOuter(0)).selectAll("text")
      .attr("y", "3")
      .attr("x", "-5")
      .attr("font-size", "14px")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-55)");

    // Text above each bar  
    let text = this.svg.selectAll(".text")
      .data(this.data, d => d[this.xColumn]);

    text.exit().remove();

    text.enter().append("text")
      .attr("class", "text")
      .attr("text-anchor", "middle")
      .attr("transform", function (d) { return "rotate(-0)" })
      .attr("font-size", "14px")
      .attr("fill", "#787878")
      .merge(text)
      .transition().duration(this.speed)
      .attr("transform", (d) => {
        return ("translate(" + this.x(d[this.xColumn]) + "," + this.y(d.Total) + ")rotate(-90)")
      })
      .attr("y", this.x.bandwidth() / 2 + 3)
      .attr("x", 30)
      .text(d => (this.normalize) ? d.Total + " %" : d.Total.toLocaleString());



  }
}

