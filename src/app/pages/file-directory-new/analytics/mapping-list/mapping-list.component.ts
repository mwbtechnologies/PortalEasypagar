import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { ReduxService } from 'src/app/services/redux.service';

@Component({
  selector: 'app-dir-mapping-list',
  templateUrl: './mapping-list.component.html',
  styleUrls: ['./mapping-list.component.css']
})
export class MappingListComponent implements OnInit,OnChanges {

  @Input() groupBy:any;
  @Input() filters:any;
  @Input() actionRowOptions:any;
  @Output() triggerActionEmitter: EventEmitter<any> = new EventEmitter();
  @Output() chipsData: EventEmitter<any> = new EventEmitter();
  ChipsArray:any
  commonTableName:string = "Directory_Analytics"
  dataList:any[] = []
  actionOptions:any
  displayColumns:any
  displayedColumns:any
  topHeaders:any
  Loading:any;
  editableColumns: any = []
  tableDataColors: any;
  

  constructor(private spinnerService: NgxSpinnerService, private reduxService:ReduxService, private directoryService : DirectoryService,private globalToastService: ToastrService,){

    // this.actionOptions = this.actionRowOptions
    this.displayColumns = {
      "SLno":"SLno",
      "_id":"ID",
      // "totalDocs":"TOTAL",
      // "mandatoryDocs":"TOTAL MANDATORY",
      // "UploadedDocs":"UPLOADED",
      // "uploadedMandatoryDocs":"UPLOADED MANDATORY",
      // "approved":"APPROVED",
      // "pending":"PENDING",
      // "rejected":"REJECTED",
      "empName":"NAME",
      "branchName":"BRANCH",
      "departmentName":"DEPARTMENT",
      "subOrgName":"ORGANIZATION",

      Actions:"ACTIONS",

      mandatoryDocs:"NO OF DOCS",
      mandatoryToBeUploaded:"TO BE UPLOADED",
      mandatoryDocumentsUploaded:"UPLOADED",
      mandatoryApproved:"APPROVED",
      mandatoryRejected:"REJECTED",
      mandatoryPending:"APPROVAL PENDING",

      totalDocs:"NO OF DOCS",
      totalDocumentsToBeUploaded:"TO BE UPLOADED",
      totalDocumentsUploaded:"UPLOADED",
      totalApproved:"APPROVED",
      totalRejected:"REJECTED",
      totalPending:"APPROVAL PENDING",
      documentCount:"NO OF UPLOADS",
    },
    this.displayedColumns = [
      "SLno",
      "mandatoryDocs",
      "mandatoryToBeUploaded",
      "mandatoryDocumentsUploaded",
      "mandatoryApproved",
      "mandatoryRejected",
      "mandatoryPending",
      "totalDocs",
      "totalDocumentsToBeUploaded",
      "totalDocumentsUploaded",
      "totalApproved",
      "totalRejected",
      "totalPending",
      "documentCount"
    ]

    this.topHeaders = [
      {
        id:"blank1",
        name:"",
        colspan:2
      },
      {
        id:"mandatory",
        name:"MANDATORY DOCUMENTS",
        colspan:6
      },
      {
        id:"total",
        name:"TOTAL DOCUMENTS",
        colspan:7
      }
    ]

    // this.tableDataColors = {
    //   mandatoryDocs:
    //   mandatoryToBeUploaded:
    //   mandatoryDocumentsUploaded:
    //   mandatoryApproved:
    //   mandatoryRejected:
    //   mandatoryPending:
    //   "BreaksStrings": [
    //     { styleClass: "breakLine", filter: [{}] }
    //   ]
    // }
  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['groupBy'] && changes['groupBy'].currentValue || changes['filters'] && changes['filters'].currentValue){
      this.getMappingList()
    }
    if(changes['actionRowOptions'] && changes['actionRowOptions'].currentValue){
      this.actionOptions = this.actionRowOptions
      this.checkActions()
    }
  }

  checkActions(){
    if(this.actionRowOptions){
      if (!this.displayedColumns.includes('Actions')) {
        this.displayedColumns.push('Actions');
        console.log(this.topHeaders.findIndex((th:any)=>th.id == 'actions1'));
        if(this.topHeaders.findIndex((th:any)=>th.id == 'actions1')== -1){
          this.topHeaders.push({
            id:"actions1",
            name:"",
            colspan:1
          })
        }
      }
    }
  }


  getMappingList() {
    this.Loading = true
    this.spinnerService.show()
    let json = {
      "SoftwareId": 8,
      "docMapping": {
          "orgId": this.reduxService.ORGId
      },
      "mapping": {
        "orgId": this.reduxService.ORGId,
        "userId": this.filters
      },
      "groupBy": this.groupBy
    }
    this.directoryService.PostMethod('user/document/mappingList',json).subscribe((res:any)=>{
      
      if(res.data){
        this.dataList = res.data.docList.map((doc:any,i:any)=>{
          return {
            "SLno": i + 1,
            totalDocs:res.data?.total[0]?.totalDocs,
            mandatoryDocs:res.data.total[0].mandatoryDocs,
            ...doc
          }
        })
        this.ChipsArray = {data:res.data.summary,total:res.data.total[0],datalength:this.dataList.length,totalUsers:this.filters.length} 
        this.chipsData.emit(this.ChipsArray)
        if(this.groupBy=='userId'){ 
          this.setEmployeeData(res.data)
        }
        else if(this.groupBy=='deptId') this.setDepartmentData()
        else if(this.groupBy=='branchId') this.setBranchData()
        else if(this.groupBy=='SubOrgId') this.setSubOrgData()
        else{
          this.Loading = false
          this.spinnerService.hide()
        }
      }else{
        this.Loading = false
        this.spinnerService.hide()
      }
    },(error)=>{
      this.globalToastService.error(error.error.message)
      this.Loading = false
      this.spinnerService.hide()
    })

  }


  actionEmitter(data: any) {
    this.triggerActionEmitter.emit(data)

     
  }

  setEmployeeData(resData:any){
    this.spinnerService.show()
    this.Loading = true

    // this.reduxService.getSubOrgList().subscribe(res=>{
    //   this.reduxService.getBranchListByOrgId(0).subscribe(res=>{
        // this.reduxService.getDepartments(0).subscribe(res=>{
          this.reduxService.getAllEmployeeList().subscribe(res=>{
            console.log(this.filters);
            let dataListKV = this.dataList.reduce((acc, item) => {
              acc[item._id] = item;
              return acc;
            }, {});
            if(this.filters && this.filters.length>0){
              this.dataList = this.filters.map((empId:any,i:any)=>{
                let emp_dir = dataListKV[empId]
                return{
                  ...emp_dir,
                  _id:empId,
                  "SLno": i + 1,
                  mandatoryDocs:resData.total[0].mandatoryDocs || 0,
                  mandatoryDocumentsUploaded:emp_dir ? emp_dir['mandatoryDocumentsUploaded'] : 0,
                  mandatoryApproved:emp_dir ? emp_dir['mandatoryApproved'] : 0,
                  mandatoryRejected:emp_dir ? emp_dir['mandatoryRejected'] : 0,
                  mandatoryPending:emp_dir ? emp_dir['mandatoryPending'] : 0,
                  totalDocs:resData.total[0].totalDocs || 0,
                  totalDocumentsUploaded:emp_dir ? emp_dir['totalDocumentsUploaded'] : 0,
                  totalApproved:emp_dir ? emp_dir['totalApproved'] : 0,
                  totalRejected:emp_dir ? emp_dir['totalRejected'] : 0,
                  totalPending:emp_dir ? emp_dir['totalPending'] : 0,
                  documentCount:emp_dir ? emp_dir['documentCount'] : 0,
                  empName:this.reduxService.EmployeeListKV[empId]?.Name,
                  branchName:this.reduxService.EmployeeListKV[empId]?.Branch,

                  // subOrgName:this.reduxService.SubOrgListKV[d._id].Name,
                  // deptName:this.reduxService.DepartmentListKV[d._id].Branch,
                }
              })

            }else{
              this.dataList = this.dataList.map((d:any)=>{
                return{
                  ...d,
                  empName:this.reduxService.EmployeeListKV[d._id]?.Name,
                  branchName:this.reduxService.EmployeeListKV[d._id]?.Branch,
                  // subOrgName:this.reduxService.SubOrgListKV[d._id].Name,
                  // deptName:this.reduxService.DepartmentListKV[d._id].Branch,
                }
              })

            }


            this.displayedColumns = 
            [
              "SLno",
              "empName",
              "branchName",
              "mandatoryDocs",
              // "mandatoryToBeUploaded",
              "mandatoryDocumentsUploaded",
              "mandatoryApproved",
              "mandatoryRejected",
              "mandatoryPending",
              "totalDocs",
              // "totalDocumentsToBeUploaded",
              "totalDocumentsUploaded",
              "totalApproved",
              "totalRejected",
              "totalPending",
              "documentCount"
            ]
            this.topHeaders[0].colspan = 3
            this.topHeaders[1].colspan = 5
            this.topHeaders[2].colspan = 6
            this.checkActions()
            // console.log(this.dataList);

          this.Loading = false
          this.spinnerService.hide()

          },err=>{
            this.spinnerService.hide()
            this.Loading = false
          })
  }

  setDepartmentData(){
    this.spinnerService.show()
    this.Loading = true
    this.reduxService.getDepartments([]).subscribe(res=>{
      this.dataList = this.dataList.map((d:any)=>{
        return{
          ...d,
          departmentName:d._id ? this.reduxService.DepartmentListKV[d._id]?.Text : "NA",
          // branchName:this.reduxService.EmployeeListKV[d._id].Branch
        }
      })

      this.displayedColumns = [
        "SLno",
        "departmentName",
        "mandatoryDocs",
        // "mandatoryToBeUploaded",
        "mandatoryDocumentsUploaded",
        "mandatoryApproved",
        "mandatoryRejected",
        "mandatoryPending",
        "totalDocs",
        // "totalDocumentsToBeUploaded",
        "totalDocumentsUploaded",
        "totalApproved",
        "totalRejected",
        "totalPending",
        "documentCount"
      ]
      // console.log(this.dataList);
      
      this.topHeaders[1].colspan = 5
      this.topHeaders[2].colspan = 6
    this.Loading = false
    this.spinnerService.hide()
      
    },err=>{
      this.spinnerService.hide()
      this.Loading = false
    })
  }

  setBranchData(){
    this.spinnerService.show()
    this.Loading = true
    this.reduxService.getBranchListByOrgId(0).subscribe(res=>{
      this.dataList = this.dataList.map((d:any)=>{
        return{
          ...d,
          branchName:d._id ? this.reduxService.BranchListKV[d._id]?.Text : "NA",
          // branchName:this.reduxService.EmployeeListKV[d._id].Branch
        }
      })

      this.displayedColumns = [
        "SLno",
        "branchName",
        "mandatoryDocs",
        // "mandatoryToBeUploaded",
        "mandatoryDocumentsUploaded",
        "mandatoryApproved",
        "mandatoryRejected",
        "mandatoryPending",
        "totalDocs",
        // "totalDocumentsToBeUploaded",
        "totalDocumentsUploaded",
        "totalApproved",
        "totalRejected",
        "totalPending",
        "documentCount"
      ]
      this.checkActions()
      this.topHeaders[1].colspan = 5
      this.topHeaders[2].colspan = 6
      // console.log(this.dataList);
      
    this.Loading = false
    this.spinnerService.hide()
      
    },err=>{
      this.spinnerService.hide()
      this.Loading = false
    })
  }

  setSubOrgData(){
    this.spinnerService.show()
    this.Loading = true
    this.reduxService.getSubOrgList().subscribe(res=>{
      this.dataList = this.dataList.map((d:any)=>{
        return{
          ...d,
          subOrgName:d._id ? this.reduxService.SubOrgListKV[d._id]?.Text : "NA",
          // branchName:this.reduxService.EmployeeListKV[d._id].Branch
        }
      })

      this.displayedColumns = [
        "SLno",
        "subOrgName",
        "mandatoryDocs",
        // "mandatoryToBeUploaded",
        "mandatoryDocumentsUploaded",
        "mandatoryApproved",
        "mandatoryRejected",
        "mandatoryPending",
        "totalDocs",
        // "totalDocumentsToBeUploaded",
        "totalDocumentsUploaded",
        "totalApproved",
        "totalRejected",
        "totalPending",
        "documentCount"
      ]
      this.topHeaders[1].colspan = 5
      this.topHeaders[2].colspan = 6
      // console.log(this.dataList);
      
    this.Loading = false
    this.spinnerService.hide()
      
    },err=>{
      this.spinnerService.hide()
      this.Loading = false
    })
  }

}
