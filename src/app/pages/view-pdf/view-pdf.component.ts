import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.css']
})
export class ViewPdfComponent implements OnInit {
  pdfSrc:any; FilePath:any; RouterLink:any;
  constructor(private _router: Router){}
  
    ngOnInit(): void {
      this.pdfSrc="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
      this.FilePath=localStorage.getItem("PdfURL");
      this.RouterLink=localStorage.getItem("RouterPath");
      if(this.FilePath!=null&& this.FilePath!="")
      {
        this.pdfSrc=this.FilePath;
      }
    }
    Back()
    {
      this._router.navigate([this.RouterLink]);
    }
  }
