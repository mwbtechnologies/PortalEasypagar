import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';
@Component({
  selector: 'app-monthwise',
  templateUrl: './monthwise.component.html',
  styleUrls: ['./monthwise.component.css']
})
export class MonthwiseComponent {
  @Input()
  MonthlyData:any
  
  monthlyData:any
  //common table
  actionOptions:any
  displayColumns:any
  displayedColumns:any
  employeeLoading:any=undefined;
  editableColumns:any =[]
  topHeaders:any = []
  headerColors:any = []
  smallHeaders:any = []
  ReportTitles:any = {}
  selectedRows:any = []
  commonTableOptions :any = {}
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  //ends here
  
  constructor(private _router: Router,private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, private globalToastService:ToastrService){ 
   //common table
   this.actionOptions = [
    // {
    //   name: "View",
    //   icon: "fa fa-eye",
    // }
  ];
  
  this.displayColumns= {
    // SelectAll: "SelectAll",
    "SLno":"SL No",
    "Date":"DATE",
    "ActionType":"TYPE",
    "Module":"MODULE",
    "ActionFor":"TYPE FOR",
    "Value":"VALUE",
    "Amount":"AMOUNT",
    "SalaryType":"SALARY TYPE"
  },
  
  
  this.displayedColumns= [
    "SLno",
    "Date",
    "ActionType",  
    "Module",
    "ActionFor",
    "Value",
    "Amount",
    "SalaryType"
  ]
  
  this.editableColumns = {
    // "HRA":{
    //   filters:{}
    // },
  }
  
  // this.topHeaders = [
  // ]
  
  this.headerColors ={
    // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
  }
  //ends here
  }
  
  ngOnInit(){
    console.log(this.MonthlyData,"what are here");
    
    this.getMonthWiseData()
  
  }
  getMonthWiseData(){
    this.employeeLoading = true
    this.spinnerService.show()
    this.monthlyData =  this.MonthlyData.data.map((l: any, i: any) => { return { SLno: i + 1, ...l } })
    this.employeeLoading = false
    this.spinnerService.hide()
  }
  actionEmitter(data:any){
    
  }
  downloadReport() {
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
  }
  }
  
