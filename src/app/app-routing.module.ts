import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationalHomeComponent } from './Operational_Dashboard/operational-home-component/operational-home.component';
import { NavBarTopComponent } from './nav-bar-top/nav-bar-top.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {path:"home/:year/:sideNavOption",component: NavBarTopComponent,canActivate: [AuthGuard]},
  {path:"",component:LoginComponent},
  {path:"login",component:LoginComponent},
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})  
export class AppRoutingModule { }
