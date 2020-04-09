
import { BarChartDistrictParameters } from '../models/district-barChartParameters.model';
import { Subject } from 'rxjs';
import { DistrictDataReq } from '../models/district-dataReq.model';
import { Injectable } from '@angular/core';

@Injectable()
export class DistrictPatientService{
    private parameters:BarChartDistrictParameters;
    private parametersUpdated = new Subject<BarChartDistrictParameters>();
    private dataReq:DistrictDataReq;
    private dataReqUpdated = new Subject<DistrictDataReq>();

    private chartData:any;
    private chartDataUpdated = new Subject<any>();

    getParametersUpdateListener(){
        return this.parametersUpdated.asObservable();
    }

    getParameters(){
        return this.parameters;
    }

    updateParameters(newParameters:BarChartDistrictParameters){
        console.log("called")
        this.parameters = newParameters;
        this.parametersUpdated.next(this.parameters);
    }

    /* Listner for data requesting */

    getDataReqListener(){
        return this.dataReqUpdated.asObservable();
    }

    getDataReq(){
        return this.dataReq;
    }

    createDataReq(newDataReq:DistrictDataReq){
        console.log("Data req created in service.... ")
        this.dataReq = newDataReq;
        console.log(this.dataReq);
        this.dataReqUpdated.next(this.dataReq);
    }

    /* Chart Data Listener */

    getChartDataListener(){
        return this.chartDataUpdated.asObservable();
    }

    getChartData(){
        return this.chartData;
    }

    updateChartData(newData:any){
        console.log("Update recived");
        console.log(newData);
        this.chartData = newData;
        this.chartDataUpdated.next(this.chartData);
    }

}