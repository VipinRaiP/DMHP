import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-group-pie-chart',
  templateUrl: './group-pie-chart.component.html',
  styleUrls: ['./group-pie-chart.component.css']
})
export class GroupPieChartComponent implements OnInit {
  // Input Parameter
  @Input() private chartService: any;

  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  @ViewChild('chartLabel', { static: true }) private chartContainerLabel: ElementRef;
  private margin = { top: 20, left: 20, bottom: 20, right: 20 };
  private thickness: number;
  private svg: any;
  private svgLabel: any;
  private keys: string[];
  private xColumn: string;
  private width: number;
  private height: number;
  private radius: number;
  private data: any;
  private currkeys: string[];
  private total: any;
  private g1: any;
  private g2: any;
  private g3: any;
  private z: any;
  private color: string[];
  constructor() { }

  ngOnInit() {
    this.chartService.getParameterListener().subscribe((newParameter) => {
      this.xColumn = newParameter.xColumn
      this.keys = newParameter.keys;
      this.data = newParameter.data;
      this.color = newParameter.color;
      this.createChart();
    });

    this.chartService.getDataListener().subscribe((newData) => {
      this.currkeys = newData.currkeys;
      this.total = newData.total;
      this.updateChart();
    });
  }

  createChart() {
    let element1 = this.chartContainer.nativeElement;

    d3.select("#" + this.xColumn + this.chartService.name() + "gpc").remove();
    this.svg = d3.select(element1)
      .append('svg')
      .attr("id", this.xColumn + this.chartService.name() + "gpc")
      .attr('width', element1.offsetWidth)// +200+ this.margin.left + this.margin.right)
      .attr('height', element1.offsetHeight)
      .attr('preserveAspectRatio', "xMinYMax meet");


    let element2 = this.chartContainerLabel.nativeElement;
    d3.select("#" + this.xColumn + this.chartService.name() + "gpcl").remove();
    this.svgLabel = d3.select(element2)
      .append('svg')
      .attr("id", this.xColumn + this.chartService.name() + "gpcl")
      .attr('width', 300)// +200+ this.margin.left + this.margin.right)
      .attr('height', element2.offsetHeight)
      .attr('preserveAspectRatio', "xMinYMax meet")


    this.width = Math.min(element1.offsetHeight, element1.offsetWidth)//element.offsetWidth / 3 //- this.margin.left - this.margin.right;
    this.height = Math.min(element1.offsetHeight, element1.offsetWidth)//element.offsetHeight / 3// - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;
    this.thickness = this.radius / 3;

    this.g1 = this.svg.append('g')
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
    this.g2 = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    this.g3 = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left + 30}, ${this.margin.top})`)

    this.z = d3.scaleOrdinal()
      .domain(this.keys)
      .range(d3.quantize(t => d3[this.color[1]](t * 0.8 + 0.1), this.keys.length).reverse());

    this.g1.append("text")
      .attr("class", "name-text")
      .attr('text-anchor', 'middle')
      .attr("font-size", "1em")
      .attr('dy', '-1.2em')
      .attr("font-weight", "bold");

    this.g1.append("text")
      .attr("class", "value-text")
      .attr('text-anchor', 'middle')
      .attr("font-size", "3em")
      .attr('dy', '0.6em');
  }

  updateChart() {
    // Set Legend  
    this.svgLabel.selectAll(".legend").remove();
    let legend = this.svgLabel.selectAll(".legend")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .data(this.keys.slice())
      .enter().append("g")
      .attr("class", "legend")
      .style("opacity", (d) => this.currkeys.includes(d) ? 1 : 0.2)
      .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; })
      .attr("cursor", "pointer")
      .on("mouseenter", (d) => {
        this.g1.select(".name-text")
          .style("fill", this.color[0])
          .text(d);

        this.g1.select(".value-text")
          .style("fill", this.color[0])
          .text(this.data[d].toLocaleString())
      })
      .on("mouseout", (d) => {
        this.g1.select(".name-text")
          .style("fill", "black")
          .text("Total " + this.xColumn);

        this.g1.select(".value-text")
          .style("fill", "black")
          .text(this.total.toLocaleString())
      })
      .on('click', (d) => {
        //d3.select(this).style("opacity", !this.currkeys.includes(d) ? 1 : 0.2);
        this.chartService.onLegendClick.emit(d);
      });

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 15)
      .attr("y", 3.5)
      .attr("fill", this.z);

    legend.append("text")
      .attr("x", 25)
      .attr("y", 11.5)
      .attr("dy", ".35em")
      .attr("font-size", "12")
      .attr("text-anchor", "start")
      .text(function (d) { return d; });

    let pie = d3.pie()
      .sort(null)
      .value((d) => d.value.value);

    let arc = d3.arc()
      .innerRadius(this.radius - this.thickness)
      .outerRadius(this.radius);


    let data = this.currkeys.map((key) => {
      return {
        label: key,
        value: this.data[key]
      }
    });

    /* ------- PIE SLICES -------*/
    this.g1.selectAll(".slice").remove()
    let slice = this.g1.selectAll("path.slice")
      .data(pie(d3.entries(data)))
      .enter().append("g")
      .style("cursor", "pointer")
      .on("mouseenter", (d) => {
        this.g1.select(".name-text")
          .style("fill", this.color[0])
          .text(d.data.value.label);

        this.g1.select(".value-text")
          .style("fill", this.color[0])
          .text(d.data.value.value.toLocaleString())
      })
      .on("mouseout", (d) => {
        this.g1.select(".name-text")
          .style("fill", "black")
          .text("Total " + this.xColumn);

        this.g1.select(".value-text")
          .style("fill", "black")
          .text(this.total.toLocaleString())
      })
      .append("path")
      .style("fill", (d) => this.z(d.data.value.label))
      .attr("class", "slice")
      .transition().duration(1000)
      .attr('d', arc)
      ;

    //.attr("stroke", "black")
    //.style("stroke-width", "0.1px")  
    this.g1.select(".name-text")
      .text("Total " + this.xColumn);

    this.g1.select(".value-text")
      .text(this.total.toLocaleString());
  }
}
