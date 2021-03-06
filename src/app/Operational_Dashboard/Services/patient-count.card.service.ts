import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class PatientCountCardService {

    private year;
    private cardName;
    private cardData:any;
    private cardDataObservable = {
        "Alcohol Cases": new Subject<any>(),
        "SMD Cases"    : new Subject<any>(),
        "CMD Cases"    : new Subject<any>(),
        "Suicide Cases" : new Subject<any>(),
    }
    
    constructor(private http: HttpClient) {

    }

    initialise(request){
        this.year = request.year;
        this.cardName = request.cardName;
        this.getData(request);
    }

    getDataListener(cardName){
        return this.cardDataObservable[cardName].asObservable();
    }

    getData(request) {
        let postData = { year: request.year };
        if (request.cardName == "Alcohol Cases") {

            this.http.post<any>(environment.backendIP + "3000/getAlcoholCasesPerYear", postData)
                .subscribe(responseData => {
                    this.cardData=responseData;
                    this.cardDataObservable[request.cardName].next(responseData);        
                })
        }
        else if (request.cardName == "SMD Cases") {
            this.http.post<any>(environment.backendIP + "3000/getSMDCasesPerYear", postData)
                .subscribe(responseData => {
                    this.cardData=responseData;
                    this.cardDataObservable[request.cardName].next(responseData);        
                })
        }
        else if (request.cardName == "CMD Cases") {
            this.http.post<any>(environment.backendIP + "3000/getCMDCasesPerYear", postData)
                .subscribe(responseData => {
                    this.cardData=responseData;
                    this.cardDataObservable[request.cardName].next(responseData);        
                })
        }
        else if (request.cardName == "Suicide Cases") {
            this.http.post<any>(environment.backendIP + "3000/getSuicideCasesPerYear", postData)
                .subscribe(responseData => {
                    this.cardData=responseData;
                    this.cardDataObservable[request.cardName].next(responseData);        
                })
        }
    }


}