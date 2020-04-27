import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multi-line-menu',
  templateUrl: './multi-line-menu.component.html',
  styleUrls: ['./multi-line-menu.component.css']
})
export class MultiLineMenuComponent implements OnInit {
  @Input() private menuService: any;
  private xColumn: string;
  private year: number;
  private checkedCumulative : boolean;

  constructor() { }

  ngOnInit() {
    //this.year = this.menuService.getYear();
    //this.xColumn = this.menuService.getxColumn();
    this.checkedCumulative = this.menuService.getCumulative();
  }

  onCumulativeChange() {
    this.menuService.setCumulative(this.checkedCumulative);
  }

}
