import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OperationalHomeComponent } from './Operational_Dashboard/operational-home-component/operational-home.component';

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
import { TalukaPatientService } from './Operational_Dashboard/District/services/taluka-patient.service';
import {MatButtonModule} from '@angular/material/button';
import { LineChartComponent } from './Operational_Dashboard/Cards/line-chart/line-chart.component';
import { LineChartService } from './Operational_Dashboard/Cards/services/line-chart.service';

import { TalukMapComponentComponent } from './Operational_Dashboard/District/Taluka/taluk-map-component/taluk-map-component.component';
import { TalukMainMapComponentComponent } from './Operational_Dashboard/District/Taluka/taluk-map-component/taluk-main-map-component/taluk-main-map-component.component';
import { TalukMapDataComponentComponent } from './Operational_Dashboard/District/Taluka/taluk-map-component/taluk-map-data-component/taluk-map-data-component.component';
import { StackedBarChartComponent } from './Operational_Dashboard/Charts/stacked-bar-chart/stacked-bar-chart.component';
import { DistrictMainMenuComponent } from './Operational_Dashboard/District/district-main-menu/district-main-menu.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { TalukaMainMenuComponent } from './Operational_Dashboard/District/Taluka/taluka-main-menu/taluka-main-menu.component';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    OperationalHomeComponent,
   // DistrictMapComponentComponent,
    //DistrictMapDetailsComponent,
    //DistrictMapDialogComponent,
    MapComponentComponent,
    DistrictMapDataComponentComponent,
    DistrictMapComponentComponent,
    CardComponent,
    LineChartComponent,
    TalukMapComponentComponent,
    TalukMainMapComponentComponent,
    TalukMapDataComponentComponent,
    StackedBarChartComponent,
    DistrictMainMenuComponent,
    TalukaMainMenuComponent
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
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule
  ],
  entryComponents:[
   // DistrictMapDialogComponent
   //LineChartDialog
  ],
  providers: [
    DistrictPatientService,
    DistrictMapService,
    TalukaPatientService,
    LineChartService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
