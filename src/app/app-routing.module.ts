import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationalHomeComponent } from './Operational_Dashboard/operational-home-component/operational-home.component';


const routes: Routes = [
  {path:"operational",component:OperationalHomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
