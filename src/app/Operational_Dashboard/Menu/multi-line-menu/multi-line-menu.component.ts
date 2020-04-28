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
  private checkedCumulative: boolean;
  private tableData: any;
  private keys: string[];
  private yearTotal: number[];
  private monthTotal: number[];
  private diff: number[];
  private bool: boolean = false;
  private months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  constructor() { }

  ngOnInit() {
    this.bool = false;
    //this.year = this.menuService.getYear();
    //this.xColumn = this.menuService.getxColumn();
    this.checkedCumulative = this.menuService.getCumulative();
    this.menuService.getTableData().subscribe((d) => {
      this.tableData = d.tableData;
      this.keys = d.keys;
      this.yearTotal = [];
      this.monthTotal = [];
      this.diff = [];
      let d1=this.tableData[this.tableData.length - 1];
      let d2=this.tableData[this.tableData.length - 2];
      let d3=this.tableData[this.tableData.length - 3];
      for (let k1 of this.keys) {
        this.yearTotal.push(d1[k1]);
        let t1 = d1[k1]-d2[k1];
        this.monthTotal.push(t1);
        let t2 = d2[k1]-d3[k1];
        this.diff.push(t1-t2);
      }
      this.bool = true;

    });
  }

  onCumulativeChange() {
    this.menuService.setCumulative(this.checkedCumulative);
  }

}
