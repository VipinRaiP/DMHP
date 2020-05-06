import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export abstract class LineService {
  abstract name(): string;

  public onLegendClick = new EventEmitter<any>();

  private keys: string[];
  private currkeys: string[];
  private columnMap = new Map<string, boolean>();
  private year: number;
  private dataURL: {
    monthly: string
  };
  private data: {
    monthlyData: any
    monthlyDataCummulative: any;
  };
  private currData: any;
  private newData = new Subject<any>();
  private parameter = new Subject<any>();
  private tableData = new Subject<any>();
  private xLabel: string;
  private yLabel: string;
  private xColumn: string;
  private cumulative: boolean;
  private port: number;

  constructor(protected http: HttpClient) {
    this.initialize();
    this.port = 3000;
    this.onLegendClick.subscribe((d) => {
      this.columnMap.set(d, !this.columnMap.get(d));
      this.updateData();
    });
  }

  initialize() {
    this.year = 2018;
    this.cumulative = false;
  }

  getYearDataFromServer(postData: { year: number, districtId?: number }) {
    this.http.post<any>(environment.backendIP + this.port + "/" + this.dataURL['monthly'], postData)
      .subscribe(resMonthlyData => {
        resMonthlyData = JSON.parse(JSON.stringify(resMonthlyData));
        this.data = {
          monthlyData: resMonthlyData,
          monthlyDataCummulative: this.calculateTotal(resMonthlyData)
        }
        this.tableData.next({ keys: this.keys, tableData: this.data.monthlyDataCummulative });
        this.updateData();
      });
  }

  calculateTotal(resMonthlyData) {
    if (resMonthlyData.length == 0)
      return [];

    let tmp = { ...resMonthlyData[0] };
    for (let k of this.keys)
      tmp[k] = 0;

    let monthlyDataCummulative = [];
    resMonthlyData.forEach(d => {
      let b = { ...d };
      for (let k of this.keys) {
        tmp[k] += d[k];
        b[k] = tmp[k];
      }
      monthlyDataCummulative.push(b);
    });

    return monthlyDataCummulative;
  }

  keysUpdate() {
    this.currkeys = []
    for (let [colName, colbool] of this.columnMap) {
      if (colbool)
        this.currkeys.push(colName);
    }
  }

  updateData() {
    this.currData = this.cumulative ? this.data.monthlyDataCummulative : this.data.monthlyData;
    this.keysUpdate();
    let newData = {
      currkeys: this.currkeys,
      data: this.currData
    }
    console.log("Data", this, newData);

    this.newData.next(newData);
  }

  updateParameter() {
    let parameter = {
      xLabel: this.xLabel,
      yLabel: this.yLabel,
      xColumn: this.xColumn,
      keys: this.keys
    };
    console.log("parameter", this, parameter);

    this.parameter.next(parameter);
  }

  getDataListener() {
    return this.newData.asObservable();
  }

  getParameterListener() {
    return this.parameter.asObservable();
  }

  getTableData() {
    return this.tableData.asObservable();
  }

  getCumulative() {
    return this.cumulative;
  }

  setDataURL(dataURL: { monthly: string }) {
    this.dataURL = dataURL;
  }

  setxColumn(xColumn: string) {
    this.xColumn = xColumn;
  }

  setLabels(xLabel: string, yLabel: string) {
    this.xLabel = xLabel;
    this.yLabel = yLabel;
  }

  setYear(year: number) {
    this.year = year;
  }

  setKeys(keys: string[]) {
    this.keys = keys;
    this.columnMap = new Map<string, boolean>();
    for (let key of this.keys.reverse()) {
      this.columnMap.set(key, true);
    }
    this.keys.reverse();
  }

  setCumulative(cumulative: boolean) {
    this.cumulative = cumulative;
    this.updateData();
  }

}
