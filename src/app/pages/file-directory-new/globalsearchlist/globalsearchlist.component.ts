import { Component, ViewChild } from '@angular/core';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { ReduxService } from 'src/app/services/redux.service';
import { UseradddocComponent } from '../userdoclist/useradddoc/useradddoc.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-globalsearchlist',
  templateUrl: './globalsearchlist.component.html',
  styleUrls: ['./globalsearchlist.component.css']
})
export class GlobalsearchlistComponent {
  //common table
  actionOptions: any
  orginalValues: any = {}
  displayColumns: any
  displayedColumns: any
  Loading: any;
  editableColumns: any = []
  ReportTitles: any = {}
  selectedRows: any = [];
  commonTableOptions: any = {}
  tableDataColors: any;
  commonTableName:any
  UserData:any
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  SearchedData:any[]=[]
  searchText:any
  paginatedData:any
  page:number = 1
  limit:number = 10
  allData:any[] = []


  constructor(private spinnerService: NgxSpinnerService,
      private _route: Router, private directoryService: DirectoryService,
      private globalToastService: ToastrService, private _httpClient: HttpClient, private reduxService : ReduxService,private dialog: MatDialog) {
    this.actionOptions = [
      {
        name: "View",
        icon: "fa fa-eye",
        rowClick: false,
      },
      {
        name: "Print",
        icon: "fa fa-print",
        rowClick: false,
      },
    ]
    this.displayColumns = {
        "SLno":"SL NO",
        "docGroupName":"DOCUMENT GROUP NAME",
        "docTypeName":"DOCUMENT TYPE NAME",
        "param_name":"PARAMETER NAME",
        "param_data":"PARAMETER DATA",
        "param_type":"PARAMETER TYPE",
        "CreatedDate":"CREATED AT",
        "modifiedBy":"MODIFIED BY",
        "param_isActive":"STATUS",
        "param_approvalStatus":"APPROVAL STATUS",
        "Actions":"ACTIONS"

    },
      this.displayedColumns = [
        "SLno",
        "docGroupName",
        "docTypeName",
        "param_name",
        "param_data",
        "param_type",
        "CreatedDate",
        "modifiedBy",
        "param_isActive",
        "param_approvalStatus",
        "Actions"

    ]
  }

    ngOnInit(){
      this.loadEmployees()

    }

    searchData(pageNumber:number = 1,changePageNumber:boolean = false){

      // let userId = this.reduxService.EmployeeListKV[this.searchText].map((emp:any)=>parseInt(emp.EmployeeId))
      let json = {
        mapping:{
          orgId:this.directoryService.ORGId,
        },
        // userMapping:{
        //   userId
        // },
        SoftwareId:8,
        data:this.searchText,
        page:pageNumber,
        limit:this.limit,
      }
      this.Loading = true
      this.spinnerService.show()
      this.directoryService.PostMethod("user/document/global/search/data",json).subscribe((res:any)=>{
        // this.pagesData = res.data

        this.paginatedData = {
          totalRecord: res.data.totalRecord,
          limit: res.data.limit,
          next_page: res.data.next_page,
          currentPage:pageNumber
        }
  
        this.SearchedData = res.data.data.map((items: any, i: any) => {
          return {
            SLno : ((pageNumber-1) * this.limit)+ i + 1,
            CreatedDate :items.param_createdAt,
            modifiedBy:items.param_modifiedBy,
            ...items
          }
        })
  
        // this.searchData = this.allData.slice((pageNumber*this.limit))
        console.log({SearchedData:this.SearchedData});
        
        this.reduxService.getAllEmployeeList().subscribe(res=>{
          this.SearchedData = this.SearchedData.map((d:any)=>{
            return{
              ...d,
              modifiedBy:this.reduxService.EmployeeListKV[d.modifiedBy]?.Name,
            }
          })
        })
        
        this.Loading = false
        this.spinnerService.hide()
        
      },(error)=>{
        this.Loading = false
        this.spinnerService.hide()
        // this.globalToastService.error("Something Went Wrong...")
        this.SearchedData = []
      })
    }

    UploadDoc(row:any,edit:boolean = false){
      this.Loading = true
      let json = {
        "SoftwareId":8,
        "docTypeId":row.docTypeId,
        mapping:{
          orgId:this.directoryService.ORGId
        }
      }
      this.directoryService.PostMethod('document/get',json).subscribe((res:any)=>{
        let fulldata:any[] = []
        if(res.data.data){
          for (let res_data_i = 0; res_data_i < res.data.data.length; res_data_i++) {
            const docDataRes = res.data.data[res_data_i];
            let paramData = docDataRes.parameters
            let parameters:any[] = []
            Object.keys(paramData).forEach((key:any)=>{
              parameters.push({
                key,
                ...paramData[key],
              })
            })
            fulldata.push({...docDataRes,parameters,paramData})
          }
          this.UserData = {
            UserId:row.mapping.userId
          }
          this.dialog.open(UseradddocComponent,{
            data: {
              fulldata,
              userdata:this.UserData.data,
              branch:row.mapping.branchId,
              suborg:row.mapping.SubOrgId,
              dept:row.mapping.departmentId,
              uploadstatus:row.uploadedStatus,
              edit
            },
            disableClose: true,
          })
          .afterClosed().subscribe(res => {
            // if(res){
              this.searchData(this.page,false)  
            // }
          })
        }
      },(error)=>{
        this.globalToastService.error(error.error.message)
      })
      }

    actionEmitter(data: any) {
      if (data.action.name == "View") {
        this.UploadDoc(data.row)
      }
      if (data.action.name == "Print") {
      }
    }

    backToList(){
      this._route.navigate(["/Directory"])
    }

    
  onPageNumberChange(event:any){
    console.log(event);
    // if(event.pageIndex >= this.page){
      this.limit = event.pageSize
      this.page = event.pageIndex+1
      this.searchData(this.page,true)
    // }else{
    //   this.limit = event.pageSize
    //   this.page = event.pageIndex+1
    //   this.searchData(this.page)
    // }
  }

  loadEmployees(){
    this.spinnerService.show()
    this.reduxService.getAllEmployeeList().subscribe(res=>{
      this.spinnerService.hide()
    },(error)=>{
      this.spinnerService.hide()
    })
  }
}
