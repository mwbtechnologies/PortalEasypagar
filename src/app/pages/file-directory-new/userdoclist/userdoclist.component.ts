import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output ,SimpleChanges,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { environment } from 'src/environments/environment';
import { UseradddocComponent } from './useradddoc/useradddoc.component';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { PrintDocComponent } from './print-doc/print-doc.component';

@Component({
  selector: 'app-userdoclist',
  templateUrl: './userdoclist.component.html',
  styleUrls: ['./userdoclist.component.css']
})
export class UserdoclistComponent implements OnInit,OnChanges{
  @Input()
  UserData:any

  @Output()
  showTimeline: EventEmitter<any> = new EventEmitter();

  activeTabIndex = 0;
  DocumentGroups:any[]=[]
  selectedDocumentTypes:any[]=[]
  IMGURL = environment.DirectoryUrl;
  ORGId: any
  Total:any
  Uploaded:any
  AdminName:any

  searchText: string = "";
  originalDocs :any
  animationDuration : any
  displayReport: boolean = false;
  allDocuments : any[] = []
  allDocumentsFormated : any[] = []
  //common table
  actionOptions:any
  displayColumns:any
  displayedColumns:any
  Loading:any;
  editableColumns:any =[]
  topHeaders:any = []
  headerColors:any = []
  smallHeaders:any = []
  ReportTitles:any = {}
  selectedRows:any = []
  tableDataColors:any
  commonTableOptions :any = {}
  chipsData:any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  //ends here
  currentView: 'table' | 'grid' = 'grid';
  @ViewChild('docGroupList') docGroupList: any;
  tabHeaderScrollContainer: HTMLElement;
  private rightArrowBtn: HTMLButtonElement | null = null;
  tabHeader:any
  paginatedData:any
  page:number = 1
  docTypePage:number = 1
  docTypeLimit:number = 1
  scrollPagination:boolean  = true

  uploadedStatusKV:any

  constructor(private pdfExportService:PdfExportService,private spinnerService: NgxSpinnerService,
    private _route: Router, private directoryService:DirectoryService , private globalToastService: ToastrService, private _httpClient: HttpClient, private dialog: MatDialog)
     {
      // this.UserData = history.state?.data
      this.animationDuration ='200ms'
      this.actionOptions = [
        {
          name: "View",
          icon: "fa fa-eye",
        },
        {
          name: "Print",
          icon: "fa fa-print",
        },
      ];
       this.editableColumns = {
       }
      this.topHeaders = [
      ]
      
      this.uploadedStatusKV = {
        "not-uploaded": "Not Uploaded",
        "approved": "Approved",
        "approval-pending": "Approval Pending",
        "rejected": "Rejected",
      }
      this.displayColumns = {
        "SLno": "Sl No",
        "groupTypeName":"DOCUMENT GROUP",
        "name":"DOCUMENT TYPE",
        // "Status":"Status",
        "uploadCreateDate":"CREATED DATE",
        "uploadUpdateDate":"UPDATED DATE",
        "uploadedStatus":"UPLOAD STATUS",
        "totalUploadedCount":"TOTAL UPLOADED",
        "Actions":"ACTIONS"
      },
      this.displayedColumns = [
        "SLno",
        "name",
        "groupTypeName",
        "uploadCreateDate",
        "uploadUpdateDate",
        "uploadedStatus",
        "totalUploadedCount",
        "Actions",
       ]

       this.tableDataColors = {
        "uploadedStatus": [
          { styleClass: "not-uploaded", filter: [{col: "uploadedStatus", value: this.uploadedStatusKV['not-uploaded']}] },
          { styleClass: "approved", filter: [{col: "uploadedStatus", value: this.uploadedStatusKV.approved}] },
          { styleClass: "approval-pending", filter: [{col: "uploadedStatus", value: this.uploadedStatusKV['approval-pending']}] },
          { styleClass: "rejected", filter: [{col: "uploadedStatus", value: this.uploadedStatusKV.rejected}] }
        ]
      }

      this.tabHeader = this.docGroupList?._tabHeader?._elementRef.nativeElement;  
      this.tabHeaderScrollContainer = this.tabHeader?.querySelector('.mat-tab');
     }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['UserData'] && changes['UserData'].currentValue ){
      // this.UserData.data['UserId'] = this.UserData.data['_id']
      // this.UserData.data['UserName'] = this.UserData.data['empName']
      // this.getTimeline()
      // this.getGroupsDoc()
      this.prepareChips()
      this.UserData.data['UserId'] = this.UserData.data['_id']
      this.UserData.data['UserName'] = this.UserData.data['empName']
      // console.log(this.UserData,"userdata");
      this.getGroupsDoc()
    }
  }
ngOnInit(){
}
  
ngAfterViewInit() {
  this.setMatScrollDetector()
}

setMatScrollDetector(){
  setTimeout(() => {
    const tabHeaderEl: HTMLElement = this.docGroupList._tabHeader._elementRef.nativeElement;

    this.rightArrowBtn = tabHeaderEl.querySelector('.mat-mdc-tab-header-pagination-after') as HTMLButtonElement;
    const tabListEl = tabHeaderEl.querySelector('.mat-mdc-tab-list') as HTMLElement;
    if (this.rightArrowBtn && tabListEl) {
      this.rightArrowBtn.addEventListener('click', () => {
        const atEnd = tabListEl.scrollLeft + tabListEl.clientWidth >= tabListEl.scrollWidth - 5;
        if (atEnd && !this.Loading && this.paginatedData?.next_page == true) {
          this.getGroupsDoc(true)
        }
      });
    } else {
      console.warn('Arrow button or tab list not found.');
    }
  });
}


onTabChange(event: MatTabChangeEvent) {
  // this.selectedDocumentTypes = this.DocumentGroups.data[event.index]?.documentTypes || [];
  console.log(this.DocumentGroups[event.index]);
  if(event.index == (this.DocumentGroups.length -1)){
    this.onPageEnd({})
  }
}


getNamings(doc:any){
return doc.groupTypeName+"- ("+doc.uploaded+"/"+doc.total+")"
}

checkPending(doc:any):boolean{
  for (let i = 0; i < doc.documentTypes.length; i++) {
    const d = doc.documentTypes[i];
    if(d.uploadedStatus == 'approval-pending') return true
  }
  return false
}

getGroupsDoc(autoScrollAfterLoad:boolean = false){
  this.Loading=true
  this.spinnerService.show()
  let json={
    SoftwareId:8,
    isActive:true,
    docMapping:{
      orgId:this.directoryService.ORGId
    },
    mapping:{
      userId: this.UserData.data.UserId,
      orgId:this.directoryService.ORGId
    },
    page:this.page
  }
  this.directoryService.PostMethod('document/get/group',json).subscribe((res:any)=>{
    this.paginatedData = res.data.documentList
    if(res?.data?.documentList?.data?.length>0){
      this.DocumentGroups = [...this.DocumentGroups,...res.data.documentList.data]
      this.allDocuments = []
      this.DocumentGroups?.forEach((dg:any)=>{
        dg.documentTypes.forEach((dt:any)=>{
          this.allDocuments.push({
            SLno:this.allDocuments.length+1,
            groupTypeName:dg.groupTypeName,
            docGroupId:dg.docGroupId,
            order:dg.order,
            total:dg.total,
            uploaded:dg.uploaded,

            SoftwareId:dt.SoftwareId,
            createdAt:dt.createdAt,
            iconPath:dt.iconPath,
            isActive:dt.isActive,
            name:dt.name,
            docOrder:dt.order,
            required:dt.required,
            subName:dt.subName,
            upload:dt.upload,
            uploadCreateDate:dt.uploadCreateDate,
            uploadUpdateDate:dt.uploadUpdateDate,
            uploadedStatus:this.uploadedStatusKV[dt.uploadedStatus],
            totalUploadedCount:dt.totalUploadedCount,
            _id:dt._id,

          })
        })
      })
      this.originalDocs = JSON.parse(JSON.stringify(this.DocumentGroups))
      // this.Total = res.data?.overall?.allTotal
      // this.Uploaded = res.data?.overall?.allUploaded
      this.page += 1
    }
    if (autoScrollAfterLoad && this.rightArrowBtn) {
      setTimeout(() => this.rightArrowBtn?.click(), 0);
    }
    this.spinnerService.hide()
    this.Loading = false
  },(error)=>{
    this.spinnerService.hide()
    this.Loading = false
    this.globalToastService.error(error.error.message)
  })
}


onPageEnd(event:any){
  if(!this.Loading && this.paginatedData?.next_page == true) {
    this.getGroupsDoc(true)
  }
}

setDefaultImage(event: Event) {
  (event.target as HTMLImageElement).src = 'assets/images/directory/default.png';
}

download(row:any,event:any){
  event.stopPropagation();
  this.Loading = true
  let json = {
    "SoftwareId":8,
    "docTypeId":row._id,
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
      this.dialog.open(PrintDocComponent,{
        data: {
          fulldata,
          userdata:this.UserData.data,
          userdataExtras:this.UserData,
          branch:this.UserData.branch,
          suborg:this.UserData.suborg,
          dept:this.UserData.dept,
          uploadstatus:row.uploadedStatus,
        },
        disableClose: true,
      }).afterClosed().subscribe(res => {
        if(res){
          console.log(res,"res");
          // this.getGroupsDoc()
        }
      })
    }
  },(error)=>{
    this.globalToastService.error(error.error.message)
  })
}

UploadDoc(row:any,edit:boolean = false){
  this.Loading = true
  let json = {
    "SoftwareId":8,
    "docTypeId":row._id,
    mapping:{
      orgId:this.directoryService.ORGId,
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
        if(this.displayReport == true){
          this.showReport()
        }
        if(res){
          this.getGroupsDoc()
        }
      })
    }
  },(error)=>{
    this.globalToastService.error(error.error.message)
  })
  }

  
  applyFilter() {
    this.DocumentGroups = [] 
    this.animationDuration ='0ms'
    
    JSON.parse(JSON.stringify(this.originalDocs)).forEach((group:any)=>{
      console.log(group.groupTypeName, this.searchText,group.groupTypeName.includes(this.searchText));
      if(group.groupTypeName.toString().toLowerCase().includes(this.searchText.toString().toLowerCase())){
        this.DocumentGroups.push(group)
      }
      else{
        let docs:any[] = []
        group.documentTypes.filter((doc:any)=>{
          console.log(doc.name, this.searchText,doc.name.includes(this.searchText), doc.subName.includes(this.searchText));
          console.log(doc.subName, this.searchText, doc.subName.includes(this.searchText));
          if(doc.name.toString().toLowerCase().includes(this.searchText.toString().toLowerCase()) || doc.subName.toString().toLowerCase().includes(this.searchText.toString().toLowerCase())){
            docs.push(doc)
          }
        })
        if(docs.length>0){
          this.DocumentGroups.push({...group,documentTypes:docs})
        }
      }

    })
    setTimeout(() => {
      this.animationDuration ='200ms'
    }, 100);
    
  }
  removesearch() {
    this.searchText = "";
    this.applyFilter();
  }
  showReport() {
    this.Loading = true
    this.currentView = 'table'
    this.displayReport = true
    this.spinnerService.show();
    let json={
    SoftwareId:8,
    mapping:{
      orgId:this.directoryService.ORGId
    },
    userDocMapping:{
      userId: this.UserData.data.UserId,
      orgId:this.directoryService.ORGId
    }
  }
  // this.directoryService.PostMethod('document/userDocumentAnalytics',json).subscribe((res:any)=>{
  //   this.allDocuments = res.data.data.data.map((doc: any, i: any) => {
  //     return {
  //       SLno : i + 1,
  //      Status:doc.isActive,
  //       ...doc
  //     }
  //   })
    this.spinnerService.hide();
    this.Loading = false
  // },(error)=>{
  //   this.globalToastService.error(error.error.message)
  //   this.spinnerService.hide();
  //   this.Loading = false
  // })
  
  }
  showDoc(){
    this.displayReport = false
     this.currentView = 'grid'
  }

  actionEmitter(data: any) {
    if (data.action.name == "View") {
    this.UploadDoc(data.row)
    }
  }

  goToTimeline(){
    this.showTimeline.emit()
  }


  
  prepareChips(){
    console.log(this.UserData);



    this.chipsData = [
      { 
          key:"totalDocs",
          text: "Total",
          subTitle:"TOTAL DOCUMENTS"
      },
      { 
          key:"totalDocumentsUploaded",
          text: "Uploaded",
          subTitle:"TOTAL DOCUMENTS"
      },
      { 
          key:"totalApproved",
          text: "Approved",
          subTitle:"TOTAL DOCUMENTS"
      },
      { 
          key:"totalRejected",
          text: "Rejected",
          subTitle:"TOTAL DOCUMENTS"
      },
      { 
          key:"totalPending",
          text: "Pending",
          subTitle:"TOTAL DOCUMENTS"
      },
      { 
          key:"documentCount",
          text: "No of Uploads",
          subTitle:"TOTAL DOCUMENTS"
      },
      { 
          key:"mandatoryDocs",
          text: "Total",
          subTitle:"MANDATORY DOCUMENTS"
      },
      { 
          key:"mandatoryDocumentsUploaded",
          text: "Uploaded",
          subTitle:"MANDATORY DOCUMENTS"
      },
      { 
          key:"mandatoryApproved",
          text: "Approved",
          subTitle:"MANDATORY DOCUMENTS" 
      },
      { 
          key:"mandatoryRejected",
          text: "Rejected",
          subTitle:"MANDATORY DOCUMENTS"
      },
      { 
          key:"mandatoryPending",
          text: "Pending",
          subTitle:"MANDATORY DOCUMENTS"
      },
    ];

  }
 
}
