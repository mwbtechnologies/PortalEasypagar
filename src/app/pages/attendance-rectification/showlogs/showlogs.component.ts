import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../../common-table/common-table.component';

@Component({
  selector: 'app-showlogs',
  templateUrl: './showlogs.component.html',
  styleUrls: ['./showlogs.component.css']
})
export class ShowlogsComponent {
  LogsData:any

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
      LogsFullData:any
  constructor( private globalToastService:ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ShowlogsComponent>){
   this.LogsData = data.fulldata


       //common table
       this.actionOptions = [
      ];
  
      this.displayColumns= {
        "Checkin":"CHECK-IN",
        "Checkout":"CHECK-OUT",
        "Sessiontype":"SESSION",
        "ModifiedCheckin":"RECTIFIED CHECK-IN",
        "ModifiedCheckout":"RECTIFIED CHECK-OUT",
        "ModifiedSessionType":"RECTIFIED SESSION",
        "ModifiedByName":"MODIFIED BY",
        "InsertedDate":"MODIFIED DATE"
      },
  
  
      this.displayedColumns= [
        "Checkin",
        "Checkout",
        "Sessiontype",
        "ModifiedCheckin",
        "ModifiedCheckout",
        "ModifiedSessionType",
        "ModifiedByName",
        "InsertedDate"
      ]
  
      this.editableColumns = {
        // "HRA":{
        //   filters:{}
        // },
      }
  
      // this.topHeaders = [
        // {
        //   id:"blank1",
        //   name:"",
        //   colspan:5
        // },
      // ]
  
      this.headerColors ={
        // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
      }
      //ends here
   }
 
   ngOnInit(){
    this.getLogsData()
 
   }
   getLogsData(){
    this.employeeLoading = true
    this.spinnerService.show()
    this.LogsFullData = this.LogsData
    this.employeeLoading = false
    this.spinnerService.hide()
   }
//common table
   actionEmitter(data:any){
    
  }
   downloadReport() {
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
  }
  //ends here
}
