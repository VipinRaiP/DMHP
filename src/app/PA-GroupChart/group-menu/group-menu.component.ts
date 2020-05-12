import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GroupedBarChartService } from "../Service/grouped-bar-chart.service"
import { GroupedLineChartService } from "../Service/grouped-line-chart.service"
import { GroupedPieChartCasesService } from '../Service/grouped-pie-chart-cases.service';
import { GroupedPieChartExpenseService } from '../Service/grouped-pie-chart-expense.service';
import { GroupedPieChartTainingService } from '../Service/grouped-pie-chart-training.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-menu',
  templateUrl: './group-menu.component.html',
  styleUrls: ['./group-menu.component.css']
})
export class GroupMenuComponent implements OnInit, AfterViewInit {
  private toggleOptions_Sort: string[];
  private toggleValue_Sort: string;
  private checkedCumulative: boolean;
  private year;
  constructor(private route:ActivatedRoute,
    private menuBarService: GroupedBarChartService,
    private menuLineService: GroupedLineChartService,
    private pieChartCasesService: GroupedPieChartCasesService,
    private pieChartExpenseService: GroupedPieChartExpenseService,
    private pieChartTrainingService: GroupedPieChartTainingService) {
    
  }

  ngOnInit() {
    console.log("GROUP MENU : ");
    this.year = this.route.snapshot.params['year'];
    console.log(this.year);
    this.menuBarService.initialize();
    this.toggleValue_Sort = this.menuBarService.getSortOption();
    this.toggleOptions_Sort = this.menuBarService.getSortOptions();
    
    this.menuLineService.initialize();
    this.checkedCumulative = this.menuLineService.getCumulative();
  }

  ngAfterViewInit() {
    this.menuBarService.setYear(this.year);
    this.menuBarService.updateParameter();
    this.menuBarService.getYearDataFromServer({ year: this.year });
    
    this.menuLineService.setYear(this.year);
    this.menuLineService.updateParameter();
    this.menuLineService.getYearDataFromServer({ year: this.year });
  }

  onToggleChange_Sort(toggleValue: string) {
    this.menuBarService.setSortOption(toggleValue);
    this.toggleValue_Sort = toggleValue;
  }

  onCumulativeChange() {
    this.menuLineService.setCumulative(this.checkedCumulative);
  }

  onYearChange(year:number){
    console.log("NAVBAR : Year changed");
    console.log(year);
    let routeURL = "/home/performance/"+year;
    window.location.href = routeURL;
  }
}
