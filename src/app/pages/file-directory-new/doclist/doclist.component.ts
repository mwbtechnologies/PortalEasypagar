import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import { environment } from 'src/environments/environment';
import { DocgrouporderComponent } from './docgrouporder/docgrouporder.component';
import { DocorderComponent } from './docorder/docorder.component';

@Component({
  selector: 'app-doclist',
  templateUrl: './doclist.component.html',
  styleUrls: ['./doclist.component.css']
})
export class DoclistComponent implements OnInit,AfterViewInit{

  activeTabIndex = 0;
  DocumentGroups:any=[]
  Total:any
  selectedDocumentTypes:any[]=[]
  AdminName:any
  IMGURL = environment.DirectoryUrl;
  ORGId: any
  AdminID: any
  UserID: any
  Loading:any
  searchText: string = "";
  originalDocs :any
  animationDuration : any

    @ViewChild('docTabGroupList') docTabGroupList: any;
    tabHeaderScrollContainer: HTMLElement;
    private rightArrowBtn: HTMLButtonElement | null = null;
    tabHeader:any
    paginatedData:any
    page:number = 1

  constructor(private pdfExportService:PdfExportService,private spinnerService: NgxSpinnerService,
    private _route: Router, private directoryService: DirectoryService, private globalToastService: ToastrService, private _httpClient: HttpClient, private dialog: MatDialog)
   {
      this.animationDuration ='200ms'

      
      this.tabHeader = this.docTabGroupList?._tabHeader?._elementRef.nativeElement;  
      this.tabHeaderScrollContainer = this.tabHeader?.querySelector('.mat-tab');

   }

    ngOnInit(){
      this.ORGId = localStorage.getItem('OrgID')
      this.AdminID = localStorage.getItem("AdminID");
      this.UserID = localStorage.getItem("UserID");
      this.getGroupsDoc()
      this.AdminName = localStorage.getItem('Name')
    }

    
    ngAfterViewInit() {
      this.setMatScrollDetector()
    }

    setMatScrollDetector(){
      setTimeout(() => {
        const tabHeaderEl: HTMLElement = this.docTabGroupList._tabHeader._elementRef.nativeElement;
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
      },1000);
    }
    
    onTabChange(event: MatTabChangeEvent) {
      this.selectedDocumentTypes = this.DocumentGroups[event.index]?.documentTypes || [];
      if(event.index == this.DocumentGroups.length-1){
        this.getGroupsDoc(true)
      }
    }
    getGroupsDoc(autoScrollAfterLoad:boolean = false){
      this.Loading = true
      this.spinnerService.show()
      let json = {
        "SoftwareId":8,
        mapping:{
          orgId:this.directoryService.ORGId,
        },
        docMapping:{
          orgId:this.directoryService.ORGId,
        },
        page:this.page
      }

      this.directoryService.PostMethod('document/get/group',json).subscribe((res:any)=>{
        this.paginatedData = res.data.documentList
        if(res?.data?.documentList?.data?.length>0){
          this.DocumentGroups = [...this.DocumentGroups,...res.data.documentList.data]

          console.log(this.DocumentGroups);
          this.Total = res.data.topcards
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
    setDefaultImage(event: Event) {
      (event.target as HTMLImageElement).src = 'assets/images/directory/default.png';
    }
  createDoc(){
    const navigationExtras: NavigationExtras = {
      state: { type:"Create" }
     };
    this._route.navigate(["/Directory/createdoc"],navigationExtras);
    
  }
  EditDoc(doc:any){
       const navigationExtras: NavigationExtras = {
             state: { data: doc,type:"Edit" }
            };
    this._route.navigate(["/Directory/createdoc"],navigationExtras);
  }
  backToList(){
  this._route.navigate(["/Directory"])
  }
  updateStatus(doc:any,status:boolean){
    let json={
      "SoftwareId": 8,
      "mapping": {
        "orgId": this.directoryService.ORGId
      },
        "status": status,
        "docTypeId": doc._id,
        "createdBy":this.UserID
    }
    this.directoryService.PostMethod('document/edit/status',json).subscribe((res:any)=>{
      this.globalToastService.success(res.message)
      this.getGroupsDoc()
    },(error)=>{
      this.globalToastService.error(error.error.message)
    })
  }

  getNamings(doc:any){
    return doc.groupTypeName + " - " + doc.total
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

  doGroupOrder(){
    this.dialog.open(DocgrouporderComponent,{
    }).afterClosed().subscribe(res=>{
      if(res){
        this.getGroupsDoc()
      }
    })
  }
  docOrder(){
    this.dialog.open(DocorderComponent,{
    }).afterClosed().subscribe(res=>{
      if(res){
        this.getGroupsDoc()
      }
    })
  }
}
