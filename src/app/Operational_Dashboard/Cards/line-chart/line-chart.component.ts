import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { LineChartService } from '../services/line-chart.service';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {

  @ViewChild('bigChart', { static: true }) private bigChartContainer: ElementRef;
  @ViewChild('smallChart', { static: true }) private smallChartContainer: ElementRef;
  @Input()
  public data: any;
  @Input()
  public id: string;
  //@Input()
  public needAxis = true;

  private totalCases: number = 0;

  private yScaleLine: any;

  private width: number;
  private height: number;
  private g: any;
  private svg: any;
  private margin: any = { top: 25, right: 20, bottom: 30, left: 5 };
  private xAxis: any;
  private yAxis: any;
  private xScale: any;
  private yScale: any; false
  private yLabel: any;
  private xLabel: any;
  private path: any;
  private line;

  public loadChart = true;
  @Output()
  public close: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private lineChartService: LineChartService) { }

  ngOnInit() {
    //if(this.id==="smallChart")
    // this.createChart(this.smallChartContainer);
    //else
    console.log("Card Line chart Loaded")
    console.log(this.data);
    this.loadChart = false;
    this.createChart(this.bigChartContainer);
    this.updateData(this.data);
    this.lineChartService.getChartDataListener().subscribe((d) => {
      console.log("Card Line Chart: Data received");
      console.log(d);
      /*if(!this.loadChart){
        this.loadChart = true;
        this.createChart(this.bigChartContainer);  
      }
      else  
        this.loadChart = true;*/
      this.updateData(d);
    })

  }

  createChart(chartContainer) {
    let element = chartContainer.nativeElement;

    this.svg = d3.select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    //console.log(this.height);

    // chart plot area
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    // set x scale
    //this.xScale = d3.scaleBand()
    // .range([0, this.width]);


    // set y scale
    //this.yScale = d3.scaleLinear()
    //.rangeRound([this.height, 0]);

    //create axis

    //    if(this.needAxis==true){
    this.xAxis = this.g.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(50, ${this.height})`)

    this.yAxis = this.g.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(50,0)`)
    //    }                      

    this.path = this.g.append("path")
      .attr("transform", "translate(0,0)")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px");

  }

  updateData(data) {
    console.log("Card: ");
    console.log(data);

    let xValue = "Month";
    let yValue = "Total Cases";

    var t = function () { return d3.transition().duration(1000); }

    //let xDomain = d3.extent(this.data, d => +d[xValue]);
    let yDomain = [0, d3.max(data, d => +d[yValue])];
    let xDomain = [0, d3.max(data, d => +d[xValue])];


    this.xScale = d3.scaleBand().range([0, this.width]).domain(xDomain);
    this.yScale = d3.scaleLinear().range([this.height, 0]).domain(yDomain)

    //this.yScaleLine = d3.scaleLinear()
    //.range([this.height, 0]); // output 

    //this.yScaleLine.domain(yDomain);

    // if (this.needAxis == true) {
    this.xAxis.transition().call(d3.axisBottom(this.xScale));

    this.yAxis.transition().call(d3.axisLeft(this.yScale));
    //}
    let prev = null;
    this.line = d3.area()
      .x(d => +this.xScale(+d[xValue]))
      .y0(d => +this.yScale(0))
      .y1(d => {
        prev = +this.yScale(+d[yValue]);
        return +this.yScale(+d[yValue])
      })


    // Update our line path
    this.g.select(".line")
      .transition(t)
      .attr("fill", "#cce5df")
      .attr("d", this.line(data));




     // Old 

     /*

    var line = d3.line()
      .x(d => this.xScale(d["Month"]) + (this.xScale.bandwidth() / 2)) // set the x values for the line generator
      .y(d => this.yScale(d["Total Cases"])) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line
    console.log(line);

    this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 4);
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);; // 11. Calls the line generator

    this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5); // 11. Calls the line generator

     */
    
     


  }

  onClose() {
    //this.loadChart = false;
    this.close.emit();
  }


}
