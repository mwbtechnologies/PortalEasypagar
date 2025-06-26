import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { Subject } from 'rxjs/internal/Subject';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-monthwise',
  templateUrl: './monthwise.component.html',
  styleUrls: ['./monthwise.component.css']
})
export class MonthwiseComponent {

  @Input()
  DetailedData:any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  UserName:any
  maxBreaks:number = 0
  breakHeaders: any[] = [];
//common table
actionOptions: any
displayColumns: any
displayedColumns: any
employeeLoading:any=undefined;
editdata: any
editableColumns: any = []
topHeaders: any = []
headerColors: any = []
smallHeaders: any = []
ReportTitles: any = {}
selectedRows: any = []
commonTableOptions: any = {}
tableDataColors: any = {}
showReportWise: boolean = false
BreakData:any[]=[];
tmp:any[]=[];

@ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
//ends here
  constructor(private spinnerService: NgxSpinnerService,
    private _route: Router, private _commonservice: HttpCommonService, private globalToastService: ToastrService, private _httpClient: HttpClient
    , private pdfExportService: PdfExportService) {

      this.dtExportButtonOptions = {
        dom: 'Bfrtip',
        buttons: [
          'copy',
          'print',
          'excel',
          'csv'
        ]
      };
      
        this.dtOptions = {
          pagingType: 'full_numbers',
           pageLength: 10
       };

        //common table
    this.actionOptions = [
    ];

    this.displayColumns = {
      "Break":"BREAK",
      "BreakIn":"BREAK IN",
      "BreakOut":"BREAK OUT",
      "Duration":"DURATION"
    },


    this.displayedColumns= [
      "Break",
      "BreakIn",
      "BreakOut",
      "Duration"
    ]

    this.editableColumns = {
      // NetSalary: {
      //   filters: {IsPayslipExist:false},
      // },
    }

    this.topHeaders = [
      // {
      //   id:"blank1",
      //   name:"",
      //   colspan:2
      // }
    ]

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    this.tableDataColors = {

    }
    //ends here

  }

  ngOnInit(): void {
    console.log(this.DetailedData,"data of particular emp");
    this.UserName = this.DetailedData.EmployeeName;
    this.getBreakData()
    this.calculateMaxBreaks()
  }
  calculateMaxBreaks() {
   this.breakHeaders = this.DetailedData.Breaks;
                       }

  getBreakData(){
    this.employeeLoading = true
    this.BreakData = this.DetailedData.BreaksDetails;
    this.employeeLoading = false
  }
  handleDuration(duration: string): string {
    const [time] = duration.split('.'); 
    return time;
  }

    //common table
    actionEmitter(data: any) {
      // if (data.action.name == "editColumn") {
      //   this.editColumn(data.row);
      // }
    }
    downloadReport(){
      let selectedColumns = this.displayedColumns
      this.commonTableChild.downloadReport(selectedColumns)
     }
    // ShowShiftDetails(row:any){
    // }
    //ends here

  // exportexcel() {
  //   let columns = ["Break","BreakIn","BreakOut","Duration"]
  //   let fileName = 'Employee Break.xlsx'
  // let data = this.BreakData.map((item: any) => {
  //     const rowData: any[] = [];
  //     for (let column of columns) {
  //       rowData.push(item[column]);
  //     }
  //     return rowData;
  //   });
  //   data.unshift(columns);
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Employee Break');
  //   XLSX.writeFile(wb, fileName);
  // }

  // exportPDF() {
  //   let columns = ["Break","BreakIn","BreakOut","Duration"]
  //   const header = ''
  //   const title = 'Employee Break'
  //   let data = this.BreakData.map((item: any) => {
  //     const rowData: any[] = [];
  //     for (let column of columns) {
  //        rowData.push(item[column]);
  //     }
  //     return rowData;
  //   });
  //   console.log(data, "data");

  //   this.pdfExportService.generatePDF(header, title, columns, data);
  // }
  exportPDF() {

   
    let columns = [
      "Date",
      "Break-Time",
      "Taken-Time",
      "Extra-Time,",
    ]
    const header = ''
    const title = 'Monthly Break Report'
    let rows: any[] = this.BreakData.map((item: any) => {
      const rowData: any[] = [
          item.Date,
          item.BreakActualTime,
          item.BreakTakenTime,
          item.ExtraTime,
      ];
      if (item.BreakDetails && item.BreakDetails.length > 0) {
        item.BreakDetails.forEach((bd: any) => {
          bd.Details.forEach((breakDetail:any)=>{
            const breakInfo = [
                'Break: ' + breakDetail.Break,
                'In: ' + (breakDetail.BreakIn ? new Date(breakDetail.BreakIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Out: ' + (breakDetail.BreakOut ? new Date(breakDetail.BreakOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Break Time: ' + (breakDetail.BreakDuration),
                'Taken Time: ' + (breakDetail.TakenDuration),
                'Extra Time: ' + (breakDetail.CalculatedDuration),
            ].join('\n');

            rowData.push(breakInfo);
          })
        });
    } else {
        rowData.push('No breaks');
    }

    return rowData;
});

// Adding extra break headers if needed
// for (let i = 1; i <= this.breakHeaders.length; i++) {
//     columns.push(`Break ${i}`);
// }
    
    this.pdfExportService.generatePDF(header, title, columns, rows);
  }
  exportexcel(){
    let columns = [
      "Date",
      "Break-Time",
      "Break-Time",
      "Extra-Time,",
    ]
    let fileName = 'Monthly Break Report.xlsx'
    let rows: any[] = this.BreakData.map((item: any) => {
      const rowData: any[] = [
        item.Date,
        item.BreakActualTime,
        item.BreakTakenTime,
        item.ExtraTime,
      ];
      if (item.BreakDetails && item.BreakDetails.length > 0) {
        item.BreakDetails.forEach((bd: any) => {
          bd.Details.forEach((breakDetail:any)=>{
            const breakInfo = [
                'Break: ' + breakDetail.Break,
                'In: ' + (breakDetail.BreakIn ? new Date(breakDetail.BreakIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Out: ' + (breakDetail.BreakOut ? new Date(breakDetail.BreakOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
                'Break Time: ' + (breakDetail.BreakDuration),
                'Taken Time: ' + (breakDetail.TakenDuration),
                'Extra Time: ' + (breakDetail.CalculatedDuration),
            ].join('\n');

            rowData.push(breakInfo);
          })
        });
    } else {
        rowData.push('No breaks');
    }

    return rowData;
});

// Adding extra break headers if needed
for (let i = 1; i <= this.breakHeaders.length; i++) {
    columns.push(`Break ${i}`);
}
      rows.unshift(columns);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'OT List');
    XLSX.writeFile(wb, fileName);
  }

  DownloadPDF() {
    this.spinnerService.show();
    this.tmp=[];
    this.tmp.push(this.DetailedData);
    const json = {
      "List": this.tmp,
      "Breaks": this.breakHeaders,
    }
    this._commonservice.ApiUsingPost("Breaks/DaywisebreakreportAppPDF", json).subscribe((data) => {
      console.log(data);
      if (data.Status==true) 
      {
        this.spinnerService.hide();
        window.open(data.Link,'_blank')
      }
      else{
        this.spinnerService.hide();
        this.globalToastService.warning("Failed to generate PDF File");
      }
    }, (error) => {
      this.spinnerService.hide();
      
    });
  }
  DownloadExcel() {
    this.spinnerService.show();
    this.tmp=[];
    this.tmp.push(this.DetailedData);
    const json = {
      "List": this.tmp,
      "Breaks": this.breakHeaders,
    }
    this._commonservice.ApiUsingPost("Breaks/DaywisebreakreportAppExcel", json).subscribe((data) => {
      console.log(data);
      if (data.Status==true) 
      {
        this.spinnerService.hide();
        window.open(data.Link,'_blank')
      }
      else{
        this.spinnerService.hide();
        this.globalToastService.warning("Failed to generate PDF File");
      }
    }, (error) => {
      this.spinnerService.hide();
      
    });
  }
}