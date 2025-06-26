import { Component, ElementRef, Inject, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, ViewChildren} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { environment } from 'src/environments/environment';
import * as html2pdf from 'html2pdf.js';
import { ReduxService } from 'src/app/services/redux.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dir-print-doc',
  templateUrl: './print-doc.component.html',
  styleUrls: ['./print-doc.component.css']
})
export class PrintDocComponent implements OnInit,OnChanges{

  docList:any = []
  Loader:any
  selectedDocListType:any
  latestDocList:any
  historyDocList:any
  IMGURL = environment.DirectoryUrl
  prinitng:boolean = false;
  filename:string = ""
  filenameByUser:string = ""
  filenameDateTime:string = ""
  pages:any[] = []

  @ViewChildren('itemsToMeasure', { read: ElementRef }) itemElements!: QueryList<ElementRef>;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private directoryService: DirectoryService,
  private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<PrintDocComponent>,
  private renderer: Renderer2,private reduxService:ReduxService){
    this.selectedDocListType = 'latest'

    this.filename = `DOC_${data.fulldata[0]?.name}_${data.userdata?.UserName}`
  }

  ngOnInit(): void {
    this.changeDocListType(this.selectedDocListType)
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    
  }

  // processPages() {
  //   const pageHeightLimit = window.innerHeight * 0.8;
  //   let currentPage: any[] = [];
  //   let currentHeight = 0;
  
  //   const nativeElements = this.itemElements?.toArray();
  
  //   nativeElements?.forEach((elRef, index) => {
  //     const height = elRef.nativeElement.offsetHeight;
  
  //     if (currentHeight + height > pageHeightLimit) {
  //       this.pages.push(currentPage);
  //       currentPage = [];
  //       currentHeight = 0;
  //     }
  
  //     currentPage.push(this.docList[index]);
  //     currentHeight += height;
  //   });
  
  //   if (currentPage.length) {
  //     debugger
  //     this.pages.push(currentPage);
  //   }
  // }

  getUploadedData(){
    let json={
      docTypeId:this.data.fulldata[0]?._id,
      SoftwareId:8,
      mapping:{
        orgId:this.directoryService.ORGId,
        "userId":this.data.userdata?.UserId,
      },
      approvalStatus: "approved",
      limit:1
      }
    this.Loader = true
    this.directoryService.PostMethod('submit/get',json).subscribe((res:any)=>{
      this.latestDocList  = res.data.map((item: any) => ({
        ...item,
        _id:item._id,
        createdAt: item.createdAt, 
        documents: this.getProcessedDocs(item.documents)
      }));
      this.changeDocListType(this.selectedDocListType)
      this.Loader = false
      
    },(error)=>{
      this.Loader = false
    })
  }

  
viewHistory(){
  let json={
    "docTypeId":this.data.fulldata[0]?._id,
    "SoftwareId":8,
    mapping:{
      "orgId":this.directoryService.ORGId,
      "userId":this.data.userdata?.UserId,
    }
   }
   this.Loader = true
   this.directoryService.PostMethod('submit/get/history',json).subscribe((res:any)=>{
     this.historyDocList = res.data.map((item: any) =>{
      return {
        ...item,
        documents:this.getProcessedDocs(item.documents),
        createdAt : item.updateAt,
      }

    })
     
   
     // Merge both responses, ensuring second API data is on top
     this.changeDocListType(this.selectedDocListType)
    this.Loader = false
   },error=>{
    this.Loader = false
   })

}

  
  getAllowedExtensions(param: any): string {
    return param.allowedExtension
      .map((ext: string) => `.${ext.toLowerCase()},.${ext.toUpperCase()}`)
      .join(',');
  }

  getProcessedDocs(docs:any){
    docs?.file?.forEach((docFile:any) => {
      docFile['fileType'] = this.getDocFileType(docFile.data)
    });
    return docs
  }

  getDocFileType(filePath:any){
    try{
      let extension = filePath.split('.').pop()
      console.log(extension);
      return this.directoryService.extensionTypes[extension.toLowerCase()] || ""
    }catch(error){
      console.log(error);
      return ""
    }
  }

  getDocDetails(key:any,param:string,temp:string):any{
    try{
      // console.log(this.data.fulldata[0].paramData,key,param,this.data.fulldata[0].paramData.filter((p:any)=>p._id == key)[0]);
      // console.log(this.data.fulldata[0].paramData.filter((p:any)=>p._id == key)[0][param]);
      return this.data.fulldata[0].paramData.filter((p:any)=>p._id == key)[0][param]
    }catch(error){
      // console.log(this.data.fulldata[0].paramData);
      // console.log(key,param,temp);
      return ""
    }
  }

  changeDocListType(value:any){
    if(this.latestDocList){
      this.docList = this.getFormattedDocList(this.latestDocList)//[...this.latestDocList]
      // this.docList = [...this.latestDocList]
    }else{
      this.getUploadedData()
    }
    if(value == 'allDocs'){
      if(this.historyDocList){
        this.docList = [...this.docList, ...this.getFormattedDocList(this.historyDocList)]
        // this.docList = [...this.docList, ...this.historyDocList]
      }else{
        this.viewHistory()
      }
    }
    console.log({docList:this.docList});
    // this.processPages()
  }

  getFormattedDocList(list:any){
    let processedList : any[] = []
    


    this.reduxService.getAllEmployeeList().subscribe(res=>{
      processedList = list?.map((l:any,i:any)=>{
        return {
          ...l,
          uploadedByName:this.reduxService.EmployeeListKV[l.createdBy].Name,
          documents:this.getProcessedDocs(l.documents),
        }
      })

    this.spinnerService.hide()

    },err=>{
      this.spinnerService.hide()
    })

    return processedList
    
  }

  print(){
    this.prinitng = true

    
    setTimeout(async () => {
      const content = document.getElementById('print_container')!;

      const originalHeight = content.style.height;
      const originalOverflow = content.style.overflow;

      content.style.height = 'auto';
      content.style.overflow = 'visible';

      const options = {
        // margin: 1,
        // filename: 'content.pdf',
        // image: { type: 'jpeg', quality: 0.98 },
        // html2canvas: { scale: 2 },
        // jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },

        
        margin: [10, 10, 10, 10], // top, left, bottom, right
        filename: this.filename+"_"+this.filenameByUser+"_"+this.getFileNameDateTime()+".pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true, // Important for images
          allowTaint: true,
          logging: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: {
          mode: ['css', 'legacy'],
          before: '.page-break', // Add <div class="page-break"></div> where needed
          avoid: ['img'] // Prevent cutting images in half
        }
      };

      await this.waitForImagesToLoad(content)
      html2pdf().from(content).set(options).save().then(() => {
        // Restore original styles
        content.style.height = originalHeight;
        content.style.overflow = originalOverflow;
      });
      
      setTimeout(() => {
        this.prinitng = false
      }, 1000);
    }, 100);
    

  }

  async waitForImagesToLoad(container: HTMLElement): Promise<void> {
    const images = container.getElementsByTagName('img');
    const promises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // fail-safe
      });
    });
    return Promise.all(promises).then(() => {});
  }

  getFileNameDateTime(){
    this.filenameDateTime =  moment().format('YYYYMMMDD_hhmmss')
    return this.filenameDateTime
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
  
}
