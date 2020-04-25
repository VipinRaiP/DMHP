import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OperationalHomeComponent } from './Operational_Dashboard/operational-home-component/operational-home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatRadioModule, MatSlideToggleModule, MatSliderModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { DistrictMapComponentComponent } from './Operational_Dashboard/District/district-map-component/district-map-component.component';
//import { DistrictMapDetailsComponent, DistrictMapDialogComponent } from './Operational_Dashboard/District/district-map-component/district-map-details/district-map-details.component';

import { CardComponent } from './Operational_Dashboard/Cards/card/card.component';
import {MatButtonModule} from '@angular/material/button';
import { LineChartComponent } from './Operational_Dashboard/Cards/line-chart/line-chart.component';
import { LineChartService } from './Operational_Dashboard/Cards/services/line-chart.service';

import { StackedBarChartComponent } from './Operational_Dashboard/Charts/stacked-bar-chart/stacked-bar-chart.component';
import { DistrictMainMenuComponent } from './Operational_Dashboard/District/district-main-menu/district-main-menu.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MapComponent } from './Operational_Dashboard/Charts/map/map.component';

import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { TalukaMainMenuComponent } from './Operational_Dashboard/District/Taluka/taluka-main-menu/taluka-main-menu.component';
import {MatSelectModule} from '@angular/material/select';

import { PatientCountService } from './Operational_Dashboard/Services/patient-count.service';
import { PatientCountDistrictService } from './Operational_Dashboard/Services/patient-count-district.service';
import { PatienCountTalukaService } from './Operational_Dashboard/Services/patient-count-taluka.service';
import { MenuComponent } from './Operational_Dashboard/Menu/menu/menu.component';
import { MapInfoComponent } from './Operational_Dashboard/Menu/map-info/map-info.component';
import { MultiLineChartComponent } from './Operational_Dashboard/Charts/multi-line-chart/multi-line-chart.component';
import { DistrictExpenseMainMenuComponent } from './Operational_Dashboard/District/district-expense-main-menu/district-expense-main-menu.component';
import { ExpenseCountDistrictService } from './Operational_Dashboard/Services/expense-count-district.service';


@NgModule({
  declarations: [
    AppComponent,
    OperationalHomeComponent,
   // DistrictMapComponentComponent,
    //DistrictMapDetailsComponent,
    //DistrictMapDialogComponent,

    CardComponent,
    LineChartComponent,

    StackedBarChartComponent,
    DistrictMainMenuComponent,
    TalukaMainMenuComponent,
    MapComponent,
    MenuComponent,
    MapInfoComponent,
    MultiLineChartComponent,
    DistrictExpenseMainMenuComponent
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
    LineChartService,
    PatientCountService,
    PatientCountDistrictService,
    PatienCountTalukaService,
    ExpenseCountDistrictService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
