import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Title } from "@angular/platform-browser";
import * as d3 from 'd3';


@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.css']
})
export class StackedBarChartComponent implements OnInit {
  // Input Parameter
  @Input() private barChartService: any;

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

  // Request Variables
  private normalize: boolean;
  private data: Array<any> = [];
  private keys: string[];

  // Other Variables
  private columns = new Map<string, boolean>();
  private sortColumn: string;
  private parameterValue: string;

  // Output Parameter
  @Output() public chartLoaded: EventEmitter<any> = new EventEmitter();

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.barChartService.getParametersUpdateListener().subscribe((newParameter) => {
      this.xLabelName = newParameter.xLabel;
      this.yLabelName = newParameter.yLabel;
      this.titleService.setTitle(this.xLabelName + " | " + this.yLabelName);

      this.keys = newParameter.columnNames;
      this.createChart();

      // Set initially all columns visible
      for (let cn of this.keys.reverse()) {
        this.columns.set(cn, true);
      }

    });

    this.barChartService.getChartDataListener().subscribe((newData) => {
      this.data = newData.data;
      this.normalize = newData.normalise;
      this.sortColumn = newData.sortColumn;
      this.parameterValue = newData.parameterValue;
      this.updateChart();
    });

    //this.chartLoaded.emit();
  }

  // Set up the chart
  createChart() {
    // Chart parameters
    let element = this.chartContainer.nativeElement;
    this.svg = d3.select(element)
      .append('svg')
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

    // Prep the tooltip bits, initial display is hidden
    this.tooltip = this.svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");

    this.tooltip.append("rect")
      .attr("width", 30)
      .attr("height", 20)
      .attr("fill", "white")
      .attr("opacity", 0.5);

    this.tooltip.append("text")
      .attr("x", 15)
      .attr("dy", "1.2em")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");
    //const yAxisGrid = d3.axisLeft(this.y).tickSize(-this.width).ticks(10);
  }

  // Update the chart
  updateChart() {
    // Declaring local variables
    let keys = []       // Coloumn Names 
    let columns = this.columns;
    let x = this.x;
    let y = this.y;
    let z = this.z;
    let data = this.data;
    let height = this.height;
    let width = this.width;
    let margin = this.margin;
    let svg = this.svg;
    let tooltip = this.tooltip;
    let speed = this.speed;
    let legend = svg.selectAll(".legend").remove();
    let normalise = this.normalize;
    let sortColumn = this.sortColumn;
    let barChartService = this.barChartService;
    let xLabelName = this.xLabelName;
    let parameterValue = this.parameterValue;
    update();

    /*svg.append("rect")
    .attr("x", this.width+15)
    .attr("width", this.width-this.margin.right)
    .attr("height", this.height/2)
    .attr("y",0)
    .attr("fill", "Gray")
    .style("opacity", 0.1);*/

    // Set Legend  
    legend = svg.selectAll(".legend")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .data(this.keys.slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .style("opacity", (d) => this.columns.get(d) ? 1 : 0.2)
      .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; })
      .attr("cursor", "pointer")
      .on('click', function (d) {
        columns.set(d, !columns.get(d));
        d3.select(this).style("opacity", columns.get(d) ? 1 : 0.2);
        resetVariables();
        update();
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
    // Function will reset local variables
    function resetVariables() {
      keys = [];
    }

    // tooltips
    /*
    var div =  svg.selectAll(".tooltip").enter().append('div')
      .attr('class', 'tooltip')
      .style('display', 'none')
      //.attr("width", 18)
      //.attr("height", 15)
      .html('<strong>Frequency:</strong>');*/

    // Function will update chart 
    function update() {
      // Get only selected Coloumns
      for (let [cn, cb] of columns) {
        if (cb)
          keys.push(cn);
      }

      // Get total of selected Columns
      for (let d1 of data) {
        let tempTotal = 0;
        for (let cn of keys) {
          tempTotal += d1[cn];
        }
        d1.Total = Number(tempTotal.toFixed(2));
      }

      barChartService.updateData({
        data: data,
        parameterValue: parameterValue
      });

      // Sort data acocording to particular column
      data.sort(function (a, b) {
        return a[sortColumn] < b[sortColumn] ? -1 : a[sortColumn] > b[sortColumn] ? 1 : 0;
      })

      // Set X & Y domains
      let xDomain = data.map(d => d[xLabelName]);
      let yDomain = [0, d3.max(data, d => (d.Total == 0) ? 100 : d.Total)];

      // Set x scale
      x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .paddingInner(0.3)
        .align(0.1);

      // Set y scale
      y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])

      x.domain(xDomain)
      y.domain(yDomain).nice();

      // Plot bars
      let group = svg.selectAll("g.layer")
        .data(d3.stack().keys(keys)(data))
        .attr("fill", d => z(d.key));

      group.exit().remove();

      group.enter().append("g")
        .classed("layer", true)
        .attr("fill", d => z(d.key));

      let bars = svg.selectAll("g.layer").selectAll("rect")
        .data(function (d) { return d; });

      bars.exit().remove();

      bars.enter().append("rect")
        .attr("width", x.bandwidth())
        .merge(bars)
        .attr("x", d => x(d.data[xLabelName]))
        .attr('y', d => y(0))
        .attr('height', 0).on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)
        .on("dblclick", function (d) {
          console.log(d.data[xLabelName]);
          barChartService.onDoubleClick.emit(d.data[xLabelName]);

        })
        .transition().duration(speed)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("cursor", "pointer");



      function mouseover() {
        //div.style('display', 'inline');
      }
      function mousemove() {
        // var d = d3.select(this).data()[0]
        /*console.log((d3.event.pageX - 34), (d3.event.pageY - 12));
        div.html('<strong>Frequency:</strong>')
          .style('left', (100 - 34) + 'px')
          .style('top', (100 - 12) + 'px');*/
      }
      function mouseout() {
        //div.style('display', 'none');
      }



      // Update Y Axis
      svg.selectAll(".y-axis").transition().duration(speed)
        .call(d3.axisLeft(y)
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
      svg.selectAll(".x-axis").transition().duration(speed)
        .call(d3.axisBottom(x).tickSizeOuter(0)).selectAll("text")
        .attr("y", "3")
        .attr("x", "-5")
        .attr("font-size", "14px")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-55)");

      // Text above each bar  
      let text = svg.selectAll(".text")
        .data(data, d => d[xLabelName]);

      text.exit().remove();

      text.enter().append("text")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) { return "rotate(-0)" })
        .attr("font-size", "14px")
        .attr("fill", "#787878")
        .merge(text)
        .transition().duration(speed)
        .attr("transform", function (d, i) {
          return ("translate(" + x(d[xLabelName]) + "," + y(d.Total) + ")rotate(-90)")
        })
        .attr("y", x.bandwidth() / 2 + 3)
        .attr("x", 30)
        .text(d => (normalise) ? d.Total + " %" : d.Total.toLocaleString());
    }


  }
}


