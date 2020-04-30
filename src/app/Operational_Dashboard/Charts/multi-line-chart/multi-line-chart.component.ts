import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-multi-line-chart',
  templateUrl: './multi-line-chart.component.html',
  styleUrls: ['./multi-line-chart.component.css']
})
export class MultiLineChartComponent implements OnInit {
  // Input Parameter
  @Input() private chartService: any;

  // Chart Variables
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  private data;
  private width;
  private height;
  private margin = { top: 50, left: 100, bottom: 30, right: 60 };

  private svg: any;
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
  private speed: number = 250;
  private xLabelName: string;
  private yLabelName: string;
  private xColumn: string;
  private keys: string[];
  private currkeys: string[];

  constructor() { }

  ngOnInit() {
    this.chartService.getParameterListener().subscribe((newParameter) => {
      this.xLabelName = newParameter.xLabel;
      this.yLabelName = newParameter.yLabel;
      this.xColumn = newParameter.xColumn
      this.keys = newParameter.keys;
      this.createChart();
    });

    this.chartService.getDataListener().subscribe((newData) => {
      this.currkeys = newData.currkeys;
      this.data = newData.data;
      this.updateChart();
    });
  }


  createChart() {
    let element = this.chartContainer.nativeElement;
    d3.select("#" + this.xColumn + "mlc").remove();

    this.svg = d3.select(element)
      .append('svg')
      .attr("id", this.xColumn + "mlc")
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
      .attr("transform", `translate(${this.margin.left - 10},0)`)
      .attr("class", "y-axis");

    // X Label
    this.xLabel = this.g.append("text")
      .attr("y", this.height - this.margin.bottom / 2) // - this.margin.bottom/2)
      .attr("x", (this.width - this.margin.left - this.margin.right) / 2)
      .attr("font-size", "18px")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .text(this.xLabelName);

    // Y label 
    this.yLabel = this.g.append("text")
      .attr("x", (-this.height + this.margin.bottom + this.margin.top) / 2)
      .attr("y", -this.margin.left / 1.2 )
      .attr("font-size", "18px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .text(this.yLabelName);

    // set the colors 
    this.z = d3.scaleOrdinal([...d3.schemeSet2, ...d3.schemePaired, ...d3.schemeTableau10]);
    this.z.domain(this.keys);
  }

  updateChart() {
    var width = this.width;
    //var margin = 50;
    var duration = 250;
    var lineOpacity = "1";
    var otherLinesOpacityHover = "0.1";

    var circleOpacity = '1';
    var circleOpacityOnLineHover = "0.1"
    var circleRadius = 6;
    var circleRadiusHover = 10;

    this.svg.selectAll(".legend").remove();

    /* Format Data */
    let parseTime = d3.timeParse("%m")
    let data = this.keys.map((id) => {
      return {
        id: id,
        display: this.currkeys.includes(id) ? true : false,
        values: this.data.map((d) => {
          return {
            id: id,
            date: parseTime(d[this.xColumn]),
            dataValue: +d[id]
          };
        })
      };
    });

    let legend = this.svg.selectAll(".legend").append("div")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .data(data)
      .enter().append("g")
      .attr("class", "legend")
      .style("opacity", (d) => d.display ? 1 : 0.2)
      .attr("transform", function (d, i) { return "translate(30," + i * 21 + ")"; })
      .attr("cursor", "pointer")
      .on('click', (d) => {
        //d3.select(this).style("opacity", !this.currkeys.includes(d) ? 1 : 0.2);
        if (d.display) hoverExit(d);
        this.chartService.onLegendClick.emit(d.id);
      })
      .on("mouseenter", (d) => { if (d.display) hover(d.values) })
      .on("mouseout", (d) => { if (d.display) hoverExit(d.values) });

    legend.append("rect")
      .attr("x", this.width - this.margin.right)
      .attr("width", 18)
      .attr("height", 15)
      .attr("y", 3.5)
      .attr("fill", (d) => this.z(d.id));

    legend.append("text")
      .attr("x", this.width - this.margin.right + 25)
      .attr("y", 11.5)
      .attr("dy", ".35em")
      .style("background-color", "red")

      .attr("font-size", "15px")
      .attr("text-anchor", "start")
      .text(function (d) { return d.id; });

    data = this.currkeys.map((id) => {
      return {
        id: id,
        display: this.currkeys.includes(id) ? true : false,
        values: this.data.map((d) => {
          return {
            id: id,
            date: parseTime(d[this.xColumn]),
            dataValue: +d[id]
          };
        })
      };
    });

    // Set X & Y domains
    let xDomain = data.length != 0 ? d3.extent(data[0].values, d => d.date) : 0;
    let yDomain = [0, d3.max(data, function (c) {
      return d3.max(c.values, function (d) { return d.dataValue + 4; });
    })];

    /* Scale */
    this.x = d3.scaleTime()
      .range([this.margin.left, this.width - this.margin.right])
    //.paddingInner(0.3)
    //.align(0.1);

    this.y = d3.scaleLinear()
      .rangeRound([this.height - this.margin.bottom, this.margin.top])

    this.x.domain(xDomain)
    this.y.domain(yDomain).nice();

    // Update Y Axis
    this.svg.selectAll(".y-axis").transition().duration(this.speed)
      .call(d3.axisLeft(this.y)
        //.tickSize(-width+margin.left-margin.right)
        .ticks(10))
      .attr("font-size", "15px")

    // Update X Axis 
    this.svg.selectAll(".x-axis").transition().duration(this.speed)
      .call(d3.axisBottom(this.x).tickSizeOuter(0)).selectAll("text")
      .attr("font-size", "15px")
      .attr("text-anchor", "middle")
      .attr("y", 20);

    /* Add line into SVG */
    let line = d3.line()
      .x(d => this.x(d.date))
      .y(d => this.y(d.dataValue))
      .curve(d3.curveMonotoneX);

    //lines.exit().remove();     
    this.svg.select(".lines").remove();
    let lines = this.svg.append('g')
      .attr('class', 'lines')
      .style("fill", " none")

    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .append('path')
      .attr('class', 'line')
      .attr("id", (d) => d.id.split(' ').join(""))
      .attr('d', d => line(d.values))
      .style('stroke', (d) => this.z(d.id))
      .style("stroke-width", "4px")
      .style('opacity', lineOpacity)
      .on("mouseenter", (d) => hover(d.values))
      .on("mouseout", (d) => hoverExit(d.values))
      .transition().duration(this.speed + 500);


    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(data).enter()
      .append("g")
      .style("fill", (d) => this.z(d.id))
      .attr("id", (d) => d.id.split(' ').join("") + "c")
      .selectAll("circle")
      .data(d => d.values).enter()

      .append("g")
      .attr("class", "circle")
      .on("mouseenter", (d) => { hoverLine(d.id); hoverTittleText(d.id); })
      .on("mouseout", (d) => { hoverLineExit(); hoverTittleTextExit(); })
      .append("circle")
      .attr("cx", d => this.x(d.date))
      .attr("cy", d => this.y(d.dataValue))
      .attr("r", circleRadius)
      .style('opacity', circleOpacity)
    //.on("mouseenter", (d) => hover(d.name))
    //.on("mouseout", (d) => hoverExit(d.name))

    let hover = (data) => {
      hoverLine(data[0].id);
      hoverTittleText(data[0].id);
      hoverTextValue(data);
    }

    let hoverExit = (d) => {
      hoverLineExit();
      hoverTittleTextExit();
      hoverTextValueExit();
    }

    let hoverLine = (id) => {
      d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);

      d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);

      d3.select("#" + id.split(' ').join(""))
        .style('opacity', lineOpacity)
        .style("cursor", "pointer");
    }

    let hoverLineExit = () => {
      d3.selectAll(".line")
        .style('opacity', lineOpacity)
        .style("cursor", "none");

      d3.selectAll('.circle')
        .style('opacity', circleOpacity);
    }

    let hoverTittleText = (id) => {
      this.svg.select(".title-text").remove();
      this.svg.append("text")
        .attr("class", "title-text")
        .style("fill", this.z(id))
        .text(id)
        .attr("text-anchor", "middle")
        .attr("x", (this.margin.left / 2 + this.width) / 2)
        .attr("y", (this.margin.top) / 2)
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("font-family", "sans-serif");
    }

    let hoverTittleTextExit = () => {
      this.svg.select(".title-text").remove();
    }


    let hoverTextValue = (data) => {
      this.svg.select(".text-value").remove();

      let textInfo = this.svg.append('g')
        .attr('class', 'text-value')

      textInfo.selectAll("textCircle-group")
        .data(data).enter()
        .append("circle")
        .style("fill", (d) => this.z(d.id))
        .attr("cx", d => this.x(d.date))
        .attr("cy", d => this.y(d.dataValue))
        .transition().duration(duration)
        .attr("r", circleRadiusHover)
        .style('opacity', circleOpacity)

      textInfo.selectAll("text-group")
        .data(data).enter()
        .append("text")
        .style("fill", () => "#787878")
        .style("cursor", "pointer")
        .text(d => d.dataValue.toLocaleString())
        .attr("x", d => this.x(d.date))
        .attr("y", d => this.y(d.dataValue) - 25)
        .style("color", "red")
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
    }

    let hoverTextValueExit = () => {
      this.svg.select(".text-value").remove();
    }
  }
}
