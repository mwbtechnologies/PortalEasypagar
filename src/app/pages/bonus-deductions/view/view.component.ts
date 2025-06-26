import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  searchText: any = ''
  filteredList:any[]=[]
  constructor( private globalToastService:ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<ViewComponent>){
    this.filteredList = [...this.data.row.MappingDetails]
  }
  ngOnInit(){
    // this.modulesWithoutFilter = [...this.modules]
  }

  applyFilter() {
    const searchTextLower = this.searchText.trim().toLowerCase();
    if (searchTextLower) {
      this.filteredList = this.data.row.MappingDetails.filter((item: any) => {
        return item.EmployeeName.toString().trim().toLowerCase().includes(searchTextLower);
      });
    } else {
      this.filteredList = [...this.data.row.MappingDetails]; // Reset if search text is empty
    }
  }
  removesearch(){
    this.searchText = ''
 }

  DeActive(IL:any){
   this._commonservice.ApiUsingGetWithOneParam("Bonusdeduction/DeactiveBonusMapping?MappingID="+IL.MappingID+"").subscribe(data =>{
    if(data.Status == true){
      // this.globalToastService.success(data.Message)
      this.ShowAlert(data.Message,"success")
      this.dialogRef.close();
    }else if (data.Status == false){
      // this.globalToastService.error(data.Message)
      this.ShowAlert(data.Message,"error")
    }else{
      // this.globalToastService.error("An error occurred. PLease try later")
      this.ShowAlert("An error occurred. Please try later","error")
    }
   },(error)=>{
    // this.globalToastService.error(error.error.Message)
    this.ShowAlert(error.error.Message,"error")
   }
  )
    
  }
  delete(IL:any){    
   this._commonservice.ApiUsingGetWithOneParam("Bonusdeduction/DeleteBonusMapping?MappingID="+IL.MappingID+"").subscribe(data =>{
    if(data.Status == true){
      // this.globalToastService.success(data.Message)
      this.ShowAlert(data.Message,"success")
      this.dialogRef.close();
    }else if (data.Status == false){
      // this.globalToastService.error(data.Message)
      this.ShowAlert(data.Message,"error")
    }else{
      // this.globalToastService.error("An error occurred. PLease try later")
      this.ShowAlert("An error occurred. Please try later","error")
    }
   },(error)=>{
    // this.globalToastService.error(error.error.Message)
    this.ShowAlert(error.error.Message,"error")
   }
  )
    
  }
              ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
                  this.dialog.open(ShowalertComponent, {
                    data: { message, type },
                    panelClass: 'custom-dialog',
                    disableClose: true  // Prevents closing on outside click
                  }).afterClosed().subscribe((res) => {
                    if (res) {
                      console.log("Dialog closed");
                    }
                  });
                }

                close(){
                  this.dialogRef.close();
                }
}
