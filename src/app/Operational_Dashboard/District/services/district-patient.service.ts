
import { StackedBarChartParameters } from '../models/stackedBarChartParameters.model';
import { Subject } from 'rxjs';
import { DistrictDataReq } from '../models/district-dataReq.model';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class DistrictPatientService {
    public onDoubleClick = new EventEmitter<any>();

    private parameters: StackedBarChartParameters;
    private parametersUpdated = new Subject<StackedBarChartParameters>();

    private dataReq: DistrictDataReq;
    private dataReqUpdated = new Subject<DistrictDataReq>();

    private chartData: any;
    private chartDataUpdated = new Subject<any>();

    private data: any;
    private dataUpdated = new Subject<any>();

    getParametersUpdateListener() {
        return this.parametersUpdated.asObservable();
    }

    getParameters() {
        return this.parameters;
    }

    updateParameters(newParameters: StackedBarChartParameters) {
        console.log("called")
        console.log(newParameters);
        this.parameters = newParameters;
        this.parametersUpdated.next(this.parameters);
    }

    /* Listner for data requesting */

    getDataReqListener() {
        return this.dataReqUpdated.asObservable();
    }

    getDataReq() {
        return this.dataReq;
    }

    createDataReq(newDataReq: DistrictDataReq) {
        console.log("Data req created in service.... ")
        this.dataReq = newDataReq;
        console.log(this.dataReq);
        this.dataReqUpdated.next(this.dataReq);
    }

    /* Chart Data Listener */

    getChartDataListener() {
        return this.chartDataUpdated.asObservable();
    }

    getChartData() {
        return this.chartData;
    }

    updateChartData(newData: any) {
        console.log("Update recived");
        console.log(newData);
        this.chartData = newData;
        this.chartDataUpdated.next(this.chartData);
    };
    /* Data Listener */

    getDataListener() {
        return this.dataUpdated.asObservable();
    }

    getData() {
        return this.data;
    }

    updateData(newData: any) {
        console.log("Update recived");
        console.log(newData);
        this.data = newData;
        this.dataUpdated.next(this.data);
    }
}