import { Component, OnInit, ViewChild, Input, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { LineChartService } from '../services/line-chart.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {

  @ViewChild('smallChart', { static: true }) private chartContainer: ElementRef;
  @Input() CardName: String;
  @Input() color: string;
  //  @Input() data: any;
  private totalCases: number = 0;
  private year: number = 2019;
  private margin: any = { top: 50, right: 0, bottom: 0, left: 0 };
  private width: number;
  private height: number;
  private g: any;
  private x: any;
  private y: any;
  private yScaleLine: any;
  yLabel: any;
  xLabel: any;
  private svg: any;

  expenseData: any;

  private xAxis;
  private yAxis;

  public chartData;
  public loadChart = false;


  constructor(private http: HttpClient, private lineChartService: LineChartService) { }

  ngOnInit() {
    this.getData();

  }

  getData() {

    if (this.CardName == "Alcohol Cases") {

      this.http.get<any>("http://18.219.25.120:3000/getAlcoholCasesCurrentYear")
        .subscribe(responseData => {
          this.chartData = responseData;
          this.createChart();
          this.createLineChart(responseData);
        })
    }
    else if (this.CardName == "SMD Cases") {
      this.http.get<any>("http://18.219.25.120:3000/getSMDCasesCurrentYear")
        .subscribe(responseData => {
          this.chartData = responseData;
          this.createChart();
          this.createLineChart(responseData);

        })
    }
    else if (this.CardName == "CMD Cases") {
      this.http.get<any>("http://18.219.25.120:3000/getCMDCasesCurrentYear")
        .subscribe(responseData => {
          this.chartData = responseData;
          this.createChart();
          this.createLineChart(responseData);

        })
    }
    else if (this.CardName == "Suicide Cases") {
      this.http.get<any>("http://18.219.25.120:3000/getSuicideCasesCurrentYear")
        .subscribe(responseData => {
          this.chartData = responseData;
          this.createChart();
          this.createLineChart(responseData);
        })
    }
  }

  createChart() {
    // create the svg
    let element = this.chartContainer.nativeElement;

    this.svg = d3.select(element)
      .append('svg')
      //.attr('width', 400)
      //.attr('height', 130);
      .attr('width', element.offsetWidth+40)
      .attr('height', element.offsetHeight-40)
      .style("cursor", "pointer");
      
    this.width = element.offsetWidth - this.margin.left - this.margin.right+40;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    //console.log(this.height);

    // chart plot area
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left-20}, ${this.margin.top})`);


    // set x scale
    this.x = d3.scaleBand()
      .range([0, this.width]);


    // set y scale
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

    /* this.xAxis = this.g.append('g')
       .attr('class', 'x axis')
       .attr('transform', `translate(50, ${this.height})`)
 
     this.yAxis = this.g.append('g')
       .attr('class', 'axis axis-y')
       .attr('transform', `translate(50,0)`) */
  }

  createLineChart(data) {
    console.log("Card: ");
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      this.totalCases += (+data[i]["Total Cases"])
    }
    console.log("Card: " + this.totalCases);
    //let yDomain = [0, d3.max(data, d => d["total"])];
    //let xDomain = data.map(function(d) { return d.district; });

    let yDomain = [0, d3.max(data, d => d["Total Cases"])];
    let xDomain = data.map(function (d) { return d["Month"]; });

    this.x.domain(xDomain).padding(0.3);
    this.y.domain(yDomain).nice();


    this.yScaleLine = d3.scaleLinear()
      .range([this.height, 0]); // output 

    this.yScaleLine.domain(yDomain);

    /*  this.xAxis.transition().call(d3.axisBottom(this.x));
      this.yAxis.transition().call(d3.axisLeft(this.y));*/

    var line = d3.line()
      .x(d => this.x(d["Month"]) + (this.x.bandwidth() / 2)) // set the x values for the line generator
      .y(d => this.y(d["Total Cases"])) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line
    console.log(line);

    /*this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "lines") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 4);
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);; // 11. Calls the line generator
    */


    // define the area
    var area = d3.area()
      .x(d => this.x(d["Month"]) + (this.x.bandwidth() / 2)) // set the x values for the line generator
      .y0(this.height-this.margin.bottom)
      .y1(d => this.y(d["Total Cases"])) // set the y values for the line generator 
      .curve(d3.curveMonotoneX)

    this.g.append("path")
      .data([data])
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", this.color)
      .style("opacity", 0.25)


    this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "lines") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", this.color)
      .style("opacity", 0.7)

      .attr("stroke-width", 3); // 11. Calls the line generator
  }

  onClickLoadChart() {
    //this.loadChart = true;
    //this.lineChartService.updateChartData(this.chartData);
  }

  @HostListener("click") onClick() {
    console.log("User Click using Host Listener");
    this.lineChartService.updateChartData({
      caseName: this.CardName,
      data: this.chartData,
      color: this.color
    });
  }

}