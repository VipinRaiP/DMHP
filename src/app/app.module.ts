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
    CardComponent
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
    MatDialogModule
  ],
  entryComponents:[
   // DistrictMapDialogComponent
  ],
  providers: [
    DistrictPatientService,
    DistrictMapService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
