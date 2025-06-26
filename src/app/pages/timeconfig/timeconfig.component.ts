import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddconfigComponent } from './addconfig/addconfig.component';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-timeconfig',
  templateUrl: './timeconfig.component.html',
  styleUrls: ['./timeconfig.component.css']
})
export class TimeconfigComponent {
  TimeConfig:any[]=[]
  ApiUrl:any
  AdminID:any
  StatusUrl:any
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  constructor(public dialog: MatDialog,private globalToastService:ToastrService,private _commonservice: HttpCommonService,private toastr:ToastrService,
    private spinnerService: NgxSpinnerService,private pdfExportService:PdfExportService){
  }

  ngOnInit(): void {
    this.AdminID = localStorage.getItem("AdminID");
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
     this.ApiUrl = "/Portal/GetTimeConfigList?AdminID="+ this.AdminID
     this.getTimeConfig()

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
  }

  addConfigs(isEdit:boolean,row?:any):void{
    console.log(isEdit ,row,"sdsdsds");
    this.dialog.open(AddconfigComponent,{
      data: { isEdit, row, fulldata: this.TimeConfig }
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
        this.getTimeConfig()
      }
    })
  }
  
  getTimeConfig(){
    this._commonservice.ApiUsingGetWithOneParam(this.ApiUrl).subscribe((data:any) => {
      var table = $('#DataTables_Table_0').DataTable();
      table.destroy();
      console.log(data);
      if (data.List.length > 0) {
        this.TimeConfig = data.List;
        this.dtTrigger.next(null);
      }
    }, (error:any) => {
      this.globalToastService.error(error); console.log(error);
    });
  }
  activateDeactivateStatus(row:any){
   this._commonservice.ApiUsingGetWithOneParam("/Portal/UpdateConfigStatus?Id="+row.Id).subscribe((data:any) => {
    this.toastr.success(data.Message);
    this.getTimeConfig()
  },(error)=>{
    // this.toastr.error(error.message);
  })
}
exportexcel() {
  let columns = ['Branch','Department','Day','StartTime','EndTime']
let fileName = 'TimeConfig.xlsx'
let data = this.TimeConfig.map((item:any) => {
  const rowData: any[] = [];
  for (let column of columns) {
    if (column.toLowerCase().split('date').length > 1) {
      rowData.push(moment(item[column]).format('MMMM Do YYYY'));
    }
    else rowData.push(item[column]);
  }
  return rowData;
});
data.unshift(columns);
const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
const wb: XLSX.WorkBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'OT List');
XLSX.writeFile(wb, fileName);
}

exportPDF() {
let columns = ['Branch','Department','Day','StartTime','EndTime']
const header = ''
const title = 'Timeconfig List'
let data = this.TimeConfig.map((item:any) => {
  const rowData: any[] = [];
  for (let column of columns) {
    if (column.toLowerCase().split('date').length > 1) {
      rowData.push(moment(item[column]).format('MMMM Do YYYY'));
    }
    else rowData.push(item[column]);
  }
  return rowData;
});
console.log(data,"data");

this.pdfExportService.generatePDF(header, title, columns, data);
}

}
