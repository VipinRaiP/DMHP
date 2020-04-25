import { Component, OnInit, Input } from '@angular/core';
import { ExpenseCountDistrictService } from '../../Services/expense-count-district.service';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-district-expense-main-menu',
  templateUrl: './district-expense-main-menu.component.html',
  styleUrls: ['./district-expense-main-menu.component.css']
})
export class DistrictExpenseMainMenuComponent implements OnInit {

  // @Input()
  // private districtExpenseService: ExpenseCountDistrictService;
  constructor(private http: HttpClient,private titleService: Title,private districtExpenseService: ExpenseCountDistrictService ) { }

  ngOnInit() {

    this.titleService.setTitle("District | Expense");
    console.log("EXPENSE COMPONENT");
    this.districtExpenseService.initialize();
  }

  ngAfterViewInit() {
    this.districtExpenseService.updateParameter();
    let postData = {
      year: this.districtExpenseService.getYear()
    }
    this.districtExpenseService.getYearDataFromServer(postData);
  }

}
