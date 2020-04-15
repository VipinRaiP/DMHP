import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OperationalHomeComponent } from './Operational_Dashboard/operational-home-component/operational-home.component';

import { DistrictBarChartComponentComponent } from './Operational_Dashboard/District/district-bar-chart-component/district-bar-chart-component.component';
import { DistrictGranularComponentComponent } from './Operational_Dashboard/District/district-granular-component/district-granular-component.component';
import { DistrictPatientMenuComponentComponent } from './Operational_Dashboard/District/district-patient-menu-component/district-patient-menu-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatRadioModule, MatSlideToggleModule, MatSliderModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DistrictPatientService } from './Operational_Dashboard/District/services/district-patient.service';
import { HttpClientModule } from '@angular/common/http';
//import { DistrictMapComponentComponent } from './Operational_Dashboard/District/district-map-component/district-map-component.component';
//import { DistrictMapDetailsComponent, DistrictMapDialogComponent } from './Operational_Dashboard/District/district-map-component/district-map-details/district-map-details.component';
import { DistrictMapService } from './Operational_Dashboard/District/services/district-map.service';
import { MapComponentComponent } from './Operational_Dashboard/District/map-component/map-component.component';
import { DistrictMapDataComponentComponent } from './Operational_Dashboard/District/map-component/district-map-data-component/district-map-data-component.component';
import { DistrictMapComponentComponent } from './Operational_Dashboard/District/map-component/district-map-component/district-map-component.component';

import { CardComponent } from './Operational_Dashboard/Cards/card/card.component';
import { TalukaBarChartComponent } from './Operational_Dashboard/District/Taluka/taluka-bar-chart/taluka-bar-chart.component';
import { TalukaGranularComponent } from './Operational_Dashboard/District/Taluka/taluka-granular/taluka-granular.component';
import { TalukaMenuComponent } from './Operational_Dashboard/District/Taluka/taluka-menu/taluka-menu.component';
import { TalukaPatientService } from './Operational_Dashboard/District/services/taluka-patient.service';
import {MatButtonModule} from '@angular/material/button';
import { LineChartComponent } from './Operational_Dashboard/Cards/line-chart/line-chart.component';
import { LineChartService } from './Operational_Dashboard/Cards/services/line-chart.service';



@NgModule({
  declarations: [
    AppComponent,
    OperationalHomeComponent,
    DistrictBarChartComponentComponent,
    DistrictGranularComponentComponent,
    DistrictPatientMenuComponentComponent,
   // DistrictMapComponentComponent,
    //DistrictMapDetailsComponent,
    //DistrictMapDialogComponent,
    MapComponentComponent,
    DistrictMapDataComponentComponent,
    DistrictMapComponentComponent,
    CardComponent,
    TalukaBarChartComponent,
    TalukaGranularComponent,
    TalukaMenuComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule, 
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents:[
   // DistrictMapDialogComponent
   //LineChartDialog
  ],
  providers: [
    DistrictPatientService,
    DistrictMapService,
    TalukaPatientService,
    LineChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
