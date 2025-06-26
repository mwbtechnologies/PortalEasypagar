import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { Subject } from 'rxjs/internal/Subject';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-detailed-break',
  templateUrl: './detailed-break.component.html',
  styleUrls: ['./detailed-break.component.css']
})
export class DetailedBreakComponent {

  @Input()
  DetailedData:any[]=[]
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  UserName:any
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
BreakData:any[]=[]

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
    this.UserName = this.DetailedData[0].Username
    this.getBreakData()
  }

  getBreakData(){
    this.employeeLoading = true
    this.BreakData = this.DetailedData?.map((dataList:any)=>{
      const toggledItem = {...dataList,
      "BreakIn":dataList.BreakIn,
      "BreakOut":dataList.BreakOut
  };
  console.log(toggledItem);
  return toggledItem;
})
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

  exportexcel() {
    let columns = ["Break","BreakIn","BreakOut","Duration"]
    let fileName = 'Employee Break.xlsx'
  let data = this.BreakData.map((item: any) => {
      const rowData: any[] = [];
      for (let column of columns) {
        rowData.push(item[column]);
      }
      return rowData;
    });
    data.unshift(columns);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Break');
    XLSX.writeFile(wb, fileName);
  }

  exportPDF() {
    let columns = ["Break","BreakIn","BreakOut","Duration"]
    const header = ''
    const title = 'Employee Break'
    let data = this.BreakData.map((item: any) => {
      const rowData: any[] = [];
      for (let column of columns) {
         rowData.push(item[column]);
      }
      return rowData;
    });
    console.log(data, "data");

    this.pdfExportService.generatePDF(header, title, columns, data);
  }
}
