import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-nav-bar-top',
  templateUrl: './nav-bar-top.component.html',
  styleUrls: ['./nav-bar-top.component.css']
})
export class NavBarTopComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

  Capture() {

    //let element = document.querySelector("#"+"this.dataType");
    // let element :string = "#"+"this.dataType";
    html2canvas(document.body).then(function (canvas) {
      // Convert the canvas to blob
      canvas.toBlob(function (blob) {
        // To download directly on browser default 'downloads' location
        let link = document.createElement("a");
        link.download = "image.png";
        link.href = URL.createObjectURL(blob);
        link.click();

        // To save manually somewhere in file explorer
        //FileSaver.saveAs(blob, 'image.png');

      }, 'image/png');
    });
  }
}
