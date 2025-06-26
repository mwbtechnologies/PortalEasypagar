import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { environment } from 'src/environments/environment';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { UseradddocComponent } from '../userdoclist/useradddoc/useradddoc.component';
import { MatDialog } from '@angular/material/dialog';
import { ReduxService } from 'src/app/services/redux.service';

@Component({
  selector: 'app-doctimeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class DocTimelineComponent implements OnInit,OnChanges{
  
  commonTableName:string = "Directory_Timeline"
  @Input() UserData:any

  timeLineData:any;
  timeLineList:any;
  Loading:any;
  DocumentGroups:any
  DocumentGroupsKV:any
  originalDocs:any
  IMGURL = environment.DirectoryUrl;

  gridView:boolean = true
   //common table
  actionOptions: any
  orginalValues: any = {}
  displayColumns: any
  displayedColumns: any
  TimeLoading: any;
  editableColumns: any = []
  ReportTitles: any = {}
  selectedRows: any = [];
  commonTableOptions: any = {}
  tableDataColors: any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  tableView:boolean = false
  currentView: 'table' | 'grid' = 'grid';

  constructor(
    // private pdfExportService:PdfExportService,
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private directoryService: DirectoryService,
    private globalToastService: ToastrService, private dialog: MatDialog,
    private reduxService:ReduxService
    // private dialog: MatDialog
  ){
    this.timeLineData = {}
        //common table
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
          "documentType":"DOCUMENT TYPE",
          "documentGroup":"DOCUMENT GROUP",
          "Status":"STATUS",
          // "createdAt":"APPROVED DATE",
          "approvedByName":"APPROVED BY",
          "uploadedByName":"UPLOADED BY",
          "uploadStatus":"UPLOAD STATUS",
          "uploadedAt":"UPLOADED DATE",
          "approvedDate":"APPROVED DATE",
          "Actions":"ACTIONS"
        },
          this.displayedColumns = [
            "SLno",
            "documentType",
            "documentGroup",
            // "Status",
            "uploadedByName",
            "uploadedAt",
            "uploadStatus",
            // "createdAt",
            "approvedByName",
            "approvedDate",
            "Actions"
          ]
  }

  ngOnInit(): void {

    
  }

    ngOnChanges(changes: SimpleChanges): void {
      if(changes['UserData'] && changes['UserData'].currentValue ){
        this.UserData.data['UserId'] = this.UserData.data['_id']
        this.UserData.data['UserName'] = this.UserData.data['empName']
        this.getTimeline()
        // this.getGroupsDoc()
      }
    }
  
  getTimeline(){
    this.TimeLoading = true
    this.spinnerService.show()
    let json:any = {
      "mapping":{
        "userId":this.UserData.data.UserId,
        "orgId":this.directoryService.ORGId
      },
      "SoftwareId":8
    }
    this.directoryService.PostMethod('submit/get/timeline/documents',json).subscribe((res:any)=>{
      console.log(res);
      // this.timeLineData = res.data.data
      this.timeLineList = res.data.data.map((item: any, i: any) => {
        return {
         "SLno": i + 1,
         "Status":item.isActive,

        ...item}
       })

       this.getEmployeeNames()
      // this.mergeData()
      this.TimeLoading = false
      this.spinnerService.hide()
    },(error)=>{
      this.globalToastService.error(error.error.message)
      this.TimeLoading = false
      this.spinnerService.hide()
    })
  }

  getEmployeeNames(){
    this.Loading = true
    this.spinnerService.show()
    this.reduxService.getAllEmployeeList().subscribe(res=>{

      this.timeLineList = this.timeLineList.map((item: any, i: any) => {
        let uploadedByName = item.uploadedBy ? this.reduxService.EmployeeListKV[item.uploadedBy].Name : ""
        let approvedByName = item.approvedBy ? this.reduxService.EmployeeListKV[item.approvedBy].Name : ""
        return {
          uploadedByName,
          approvedByName,
          ...item}
       })
       this.Loading = false
       this.spinnerService.hide()
       
      },err=>{
      this.Loading = false
      this.spinnerService.hide()
    })

    
  }
  
  getGroupsDoc(){
    this.Loading = true
    this.spinnerService.show()
    let json = {
      "SoftwareId":8,
      mapping:{
        orgId:this.directoryService.ORGId,
      },
      docMapping:{
        orgId:this.directoryService.ORGId,
      }
      // "_id":row._id
    }
    this.directoryService.PostMethod('document/get/group',json).subscribe((res:any)=>{
      this.DocumentGroups = res.data.documentList || [];
      this.DocumentGroupsKV = {}
      if(this.DocumentGroups && this.DocumentGroups.data.length > 0){
        JSON.parse(JSON.stringify(this.DocumentGroups.data)).forEach((element:any)=>{
          let docTypesKV:any = {}
          element.documentTypes.forEach((type:any)=>{
            docTypesKV[type._id] = type
          })
          this.DocumentGroupsKV[element.docGroupId] = {...element,docTypesKV}
        })
      }

      this.originalDocs = JSON.parse(JSON.stringify(this.DocumentGroups))
      this.mergeData()
      this.Loading = false
      this.spinnerService.hide()
    },(error)=>{
      this.globalToastService.error(error.error.message)
      this.Loading = false
      this.spinnerService.hide()
    })
  }


  // mergeData(){
  //   this.TimeLoading = true
  //   if(this.DocumentGroups && this.DocumentGroups.data.length > 0 && this.timeLineData && this.timeLineData.data.length > 0){

  //     this.timeLineData.data.forEach((data:any) => {
  //       data["groupTypeName"] = this.DocumentGroupsKV[data.docGroupId].groupTypeName
  //       data["docType"] = this.DocumentGroupsKV[data.docGroupId].docTypesKV[data.docTypeId]
  //     });
      
  //     this.TimeLoading = false
  //   }
  // }
  mergeData() {
    this.TimeLoading = true;
  
    if (
      this.DocumentGroups &&
      this.DocumentGroups.data.length > 0 &&
      this.timeLineData &&
      this.timeLineData.data.length > 0
    ) {
      debugger
      this.timeLineData.data.forEach((data: any) => {
        data["groupTypeName"] = this.DocumentGroupsKV[data.docGroupId]?.groupTypeName;
        data["docType"] = this.DocumentGroupsKV[data.docGroupId]?.docTypesKV[data.docTypeId];
      });
      
      this.timeLineList = this.timeLineData.data.map((data: any) => ({
        "name": data.docType?.name || '',
        "CreatedDate": data.createdAt,
        "groupTypeName": data.groupTypeName || '',
        "docTypeId": data.docType?._id || ''
      }));
      console.log(this.timeLineList,"timeline list");
      
      this.TimeLoading = false;
    }
  }
  

  setDefaultImage(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/directory/default.png';
  }

  ViewTable(){
    this.gridView = false
    this.tableView = true
    this.currentView = 'table'
  }
  ViewGrid(){
    this.gridView = true
    this.tableView = false
    this.currentView = 'grid'
  }

  actionEmitter(data: any) {
    if (data.action.name == "View") {
      this.UploadDoc(data.row)
      // console.log(data,"data in response");
      
    }
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
        this.dialog.open(UseradddocComponent,{
          data: {
            fulldata,
            userdata:this.UserData.data,
            branch:this.UserData.branch,
            suborg:this.UserData.suborg,
            dept:this.UserData.dept,
            uploadstatus:row.uploadedStatus,
            edit
          },
          disableClose: true,
        }).afterClosed().subscribe(res => {
          if(res){
            console.log(res,"res");
            // this.getGroupsDoc()
            this.getTimeline()
          }
        })
      }
    },(error)=>{
      this.globalToastService.error(error.error.message)
    })
    }


}
