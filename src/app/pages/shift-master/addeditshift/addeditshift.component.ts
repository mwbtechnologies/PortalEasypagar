import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
export class FormInput {
  OrgID:any;
  ShiftName:any;
  FromTime:any;
  ToTime:any;
  Branches:any;
  Departments:any;
  MinWorkHours:any;
  Ratio:any;
}
@Component({
  selector: 'app-addeditshift',
  templateUrl: './addeditshift.component.html',
  styleUrls: ['./addeditshift.component.css']
})
export class AddeditshiftComponent {
  formInput: FormInput|any;
  public isSubmit: boolean;
  BranchList:any[]=[]
  ApiURL:any
  Branches:any[]=[]
  selectedBranch:any[]=[];selectedDepartment:any[]=[];
  selectedbranchfordept:any
  temparray:any=[]; tempdeparray:any=[];tempbrarray:any=[];tempdtarray:any=[]
  isEdit:boolean
  AdminID:any;OrgID:any;
  AmountType:any;
  branchSettings:IDropdownSettings = {};
  departmentSettings:IDropdownSettings = {};
  shifttypeSettings:IDropdownSettings = {};
  ShiftTypeSettings:IDropdownSettings = {};
  DepartmentList: any;
  BranchNames:any
  DepartmentNames:any
  Columns: any;
  DepColumns: any;
  selectShift:any[]=[];
  selectShiftEdit:any
  selectedBranchEdit:any
  selectedDeptEdit:any;UserID:any;
  BranchSettings:IDropdownSettings = {};
  DeptSettings:IDropdownSettings = {};
  ShiftTypeList:any[]=[]
  ShiftTypeName:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private globalToastService: ToastrService, private _commonservice: HttpCommonService, private toastr: ToastrService,
  private spinnerService: NgxSpinnerService, public dialogRef: MatDialogRef<AddeditshiftComponent>){
    this.isSubmit = false
    this.isEdit = this.data.isEdit || false,
    this.BranchNames =this.data.row?.BranchName || '' ,
    this.DepartmentNames = this.data.row?.DepartmentName || '' ,
    this.ShiftTypeName= this.data.row?.ShiftType || ""
    this.formInput = {    
      Branches :this.data.row?.BranchName || '' ,
      Department : this.data.row?.DepartmentName || '' ,
      OrgID:'',
      FromTime:this.data.row?.StartTime || '',
      ToTime:this.data.row?.EndTime || '',
      ShiftName : this.data.row?.ShiftName || '',
      GraceIn :this.data.row?.GraceInTime || 0,
      GraceOut :this.data.row?.GraceOutTime || 0,
      Amount:this.data.row?.Amount || 0,
      IsPercent:this.isEdit && this.data.row?.IsPercent || false,
      isHalfDay :this.isEdit && this.data.row?.IsHalfDay || false,
      MinWorkHours:this.data.row?.MinWorkingHours || 0,
      Ratio: Number(this.data.row?.RatioValue)|| 1,

    };

    this.branchSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.BranchSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.DeptSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.departmentSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.shifttypeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.ShiftTypeSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.AmountType="Amount (Rs)";
    
  }
  ngOnInit(){
    this.OrgID = localStorage.getItem("OrgID");
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID=localStorage.getItem("UserID");
    this.ApiURL = "Admin/GetBranchList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID;
    this.GetBranches();
    this.getShiftTypes()
    // this.GetDepartments();
  }


getShiftTypes(){
  this._commonservice.ApiUsingGetWithOneParam("ShiftMaster/GetShiftTypes").subscribe((data) => {
    this.ShiftTypeList = data.List;
    let shift = this.ShiftTypeList.find((b:any) => b.text === this.ShiftTypeName);
    if (shift) { 
      this.selectShiftEdit = [shift];
    } else {
        this.selectShiftEdit = [];
    }
  }, (error) => {
    // this.globalToastService.error(error);
    this.ShowAlert(error,"error")
    console.log(error,"error");
  });
}
  changeamttype()
  {
    if(this.AmountType=="Amount (Rs)")
    {
this.AmountType="Ratio (%)";
    }
    else{
this.AmountType="Amount (Rs)";
    }
  }
  getData(): void {
    let tmp = [];this.temparray=[];
    // tmp.push({ id: 0, text: "All Branch" });
    for (let i = 0; i < this.Columns.length; i++) {
      tmp.push({ id: this.Columns[i].Value, text: this.Columns[i].Text });
    }
    this.Columns = tmp;
    let branch = this.Columns.find((b:any) => b.text === this.BranchNames);
          if (branch) { 
            this.temparray.push({"id":branch.id,"text":branch.text});
            this.selectedBranchEdit = [branch];
          } else {
              this.selectedBranchEdit = [];
          }
          this.GetDepartments()
  }
  getData1(): void {
    let tmp = [];this.tempdeparray=[];
    // tmp.push({ id: 0, text: "All Department" });
    for (let i = 0; i < this.DepColumns.length; i++) {
      tmp.push({ id: this.DepColumns[i].Value, text: this.DepColumns[i].Text });
    }
    this.DepColumns = tmp;
    let dept = this.DepColumns.find((b:any) => b.text === this.DepartmentNames);
          if (dept) { 
            this.tempdeparray.push({"id":dept.id,"text":dept.text});
            this.selectedDeptEdit = [dept];
          } else {
              this.selectedDeptEdit = [];
          }
  }
  GetBranches() {
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      if (this.BranchList.length > 0) {
        this.Columns = data.List;
        this.getData();

      }
      console.log(this.BranchList, "branchlist");
      
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error,"error");
    });
 
  }
  GetDepartments() {
    this.selectedDepartment=[];
    this.DepartmentList=[];
   if(this.isEdit === false){
    console.log("for add open");
    this.selectedbranchfordept =  this.selectedBranch.map((br: any) => {
      return {
       "id": br.id,
       "text":br.text
       };
      })
   } 
   if(this.isEdit === true){
    console.log("for edit open");
    
      this.selectedbranchfordept = this.selectedBranchEdit.map((br: any) => {
        return {
       "id": br.id,
       "text":br.text
       };
      })
   } 
   var loggedinuserid=localStorage.getItem("UserID");
    const json={
      Branches:this.selectedbranchfordept,
      OrgID:this.OrgID,
      AdminID:loggedinuserid
    }
    console.log(json,"yuiujjujhghhgh");
    
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
      if (data.Status==true) {
        this.DepartmentList = data.List;
        this.DepColumns=this.DepartmentList;
        this.getData1();
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error,"error");
    });
  }

  onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.id, text:item.text });
   }
   onDeptSelectAll(item:any){
    console.log(item,"item");
    this.tempdeparray = item;
   }
   onDeptDeSelectAll(){
    this.tempdeparray = [];
   }
   onDeptDeSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
   }

   onShiftSelect(item:any){
    console.log(item);

   }
   onShiftDeSelect(item:any){
    console.log(item);

   }
   onShiftEditSelect(item:any){
    console.log(item);

   }
   onShiftEditDeSelect(item:any){
    console.log(item);

   }

  onBranchSelect(item:any){
   console.log(item,"item");
  //  this.temparray.push({id:item.id, text:item.text });
   this.GetDepartments();
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
  //  this.temparray.splice(this.temparray.indexOf(item), 1);
   this.GetDepartments();
  }

  CreateShift() {
    if(this.selectedBranch.length==0)
      {
        // this.globalToastService.warning('Please select atleast one branch');
        this.ShowAlert("Please select atleast one branch","warning")
        return false;
      }
      if(this.tempdeparray.length==0)
        {
          // this.globalToastService.warning('Please select atleast one department');
          this.ShowAlert("Please select atleast one department","warning")
          return false;
        }
    else if(this.selectShift.length==0) {
      // this.globalToastService.warning("Please Select One Shift Type...!");
      this.ShowAlert("Please Select Shift Type...!","warning")
      return false;
    }
    else if(this.formInput.ShiftName == ""||this.formInput.ShiftName == undefined||this.formInput.ShiftName == null||this.formInput.ShiftName == 0) {
      // this.globalToastService.warning("Please Enter Shift Title...!");
      this.ShowAlert("Please Enter Shift Title...!","warning")
      return false;
    }
    else if(this.formInput.FromTime == ""||this.formInput.FromTime == undefined||this.formInput.FromTime == null||this.formInput.FromTime == 0) {
      // this.globalToastService.warning("Please Select Start Time");
      this.ShowAlert("Please Select Start Time","warning")
      return false;
    } 
    else if (this.formInput.ToTime == ""||this.formInput.ToTime == undefined||this.formInput.ToTime == null||this.formInput.ToTime == 0){
      // this.globalToastService.warning("Please Select End Time");
      this.ShowAlert("Please Select End Time","warning")
      return false;
    } 
    else if (this.formInput.GraceIn > 60) {
      // this.globalToastService.warning('Grace-In Time should be less than 60 Minutes');
      this.ShowAlert("Grace-In Time should be less than 60 Minutes","warning")
      return false;
    }
   else if (this.formInput.GraceOut > 60) {
      // this.globalToastService.warning('Grace-Out Time should be less than 60 Minutes');
      this.ShowAlert("Grace-Out Time should be less than 60 Minutes","warning")
      return false;
    }
      else{
      const selectranch =  this.selectedBranch.map((br: any) => {
        return {
         "id": br.id // Ensure this is the correct property
         };
        })
        if(this.tempdeparray)
        {
          this.selectedDepartment =  this.tempdeparray.map((br: any) => {
            return {
             "id": br.id // Ensure this is the correct property
             };
            })
        }
        const selectedShift = this.selectShift.map((shift:any)=>shift.text)[0]
       
          if(this.formInput.Percentage>0){this.formInput.IsPercent=true;}else{this.formInput.IsPercent=false;}
        const json = {
          AdminID:this.AdminID,
          Branches:this.selectedBranch,
          EndTime:this.formInput.ToTime,
          StartTime:this.formInput.FromTime,
          ShiftName:this.formInput.ShiftName,
          Amount:this.formInput.Amount,
          IsPercent:this.formInput.IsPercent,
          GraceOutTime :this.formInput.GraceOut,
          GraceInTime :this.formInput.GraceIn,
          IsHalfDay:this.formInput.isHalfDay,
          MinWorkingHours:this.formInput.MinWorkHours,
          Departments:this.selectedDepartment,
          Ratio:this.formInput.Ratio,
          ShiftType:selectedShift
         }
         console.log(json,"json of add shift");
         
        this._commonservice.ApiUsingPost("ShiftMaster/CreateShift",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            // this.globalToastService.success(data.Message);
            this.ShowAlert(data.Message,"success")
            this.closeWithDelay();
            }
            else
            {
              // this.globalToastService.warning(data.Message);
              this.ShowAlert(data.Message,"warning")
                this.spinnerService.hide();
            }
            
          }, (error: any) => {
            localStorage.clear();
    
            // this.globalToastService.error(error.message);
            this.ShowAlert(error.message,"warning")
            this.spinnerService.hide();
           }
        );
        return true;
      }
        
    }
    onBranchEditSelect(item:any){
      this.tempbrarray.push({id:item.id, text:item.text });
      console.log(item.id,"for edit Select");
      this.GetDepartments();
      
    }
    closeWithDelay(): void {
      // Add a delay of 2 seconds (2000 milliseconds)
      setTimeout(() => {
        this.dialogRef.close();
      }, 2000);  // Delay time in milliseconds
    }
    onBranchEditDeSelect(item:any){
      this.tempbrarray.splice(this.tempbrarray.indexOf(item), 1);
      console.log(item.id,"for edit DeSelect");
      this.GetDepartments();
    }
    ondepthEditSelect(item:any){
      this.tempdtarray.push({id:item.id, text:item.text });
      console.log(item.id,"for edit Select");
      
    }
    ondepthEditDeSelect(item:any){
      this.tempdtarray.splice(this.tempdtarray.indexOf(item), 1);
      console.log(item.id,"for edit DeSelect");
    }
    UpdateShift() {
      const existingbranch =  this.selectedBranchEdit.map((br: any) => br.id)[0]
      const existingdept =  this.selectedDeptEdit.map((br: any) => br.id)[0]
      const editbranch =  this.tempbrarray.map((br: any) => br.id)[0] || existingbranch
      const editdept =  this.tempdtarray.map((br: any) => br.id)[0] || existingdept
      const editshift =  this.selectShiftEdit.map((br: any) => br.text)[0] || ""
      if(editbranch==null||editbranch==undefined||editbranch==""||editbranch==0||editbranch=="0")
        {
          // this.globalToastService.warning('Please select atleast one branch');
          this.ShowAlert('Please select atleast one branch',"warning")
          return false;
        }
        if(editdept==null||editdept==undefined||editdept==""||editdept==0||editdept=="0")
          {
            this.ShowAlert('Please select atleast one department','warning');
            return false;
          }
        else if(editshift==null||editshift==undefined||editshift==""||editshift==0||editshift=="0") {
          this.ShowAlert("Please Select Shift Type...!",'warning');
          return false;
        }
        else if(this.formInput.ShiftName == ""||this.formInput.ShiftName == undefined||this.formInput.ShiftName == null||this.formInput.ShiftName == 0) {
          // this.globalToastService.warning("Please Enter Shift Title...!");
          this.ShowAlert('Please Enter Shift Title...!',"warning")
          return false;
        }
        else if(this.formInput.FromTime == ""||this.formInput.FromTime == undefined||this.formInput.FromTime == null||this.formInput.FromTime == 0) {
          // this.globalToastService.warning("Please Select FromTime");
          this.ShowAlert('Please Select FromTime',"warning")
          return false;
        } 
        else if (this.formInput.ToTime == ""||this.formInput.ToTime == undefined||this.formInput.ToTime == null||this.formInput.ToTime == 0){
          // this.globalToastService.warning("Please Select ToTime");
          this.ShowAlert('Please Select ToTime',"warning")
          return false;
        } 
        else if (this.formInput.GraceIn > 60) {
          // this.globalToastService.warning('Grace-In Time should be less than 60');
          this.ShowAlert("Grace-In Time should be less than 60","warning")
          return false;
        }
       else if (this.formInput.GraceOut > 60) {
          // this.globalToastService.warning('Grace-Out Time should be less than 60');
          this.ShowAlert("Grace-Out Time should be less than 60","warning")
          return false;
        }
          else{
      if(this.formInput.Percentage>0)
        {
          this.formInput.IsPercent=true;}else{this.formInput.IsPercent=false;}
      
        const json = {
          ShiftID:this.data.row?.ShiftID,
          ShiftName:this.data.row?.ShiftName,
          StartTime:this.formInput.FromTime,
          EndTime:this.formInput.ToTime,
          Amount:this.formInput.Amount,
          IsPercent:this.formInput.IsPercent,
          GraceOutTime :this.formInput.GraceOut,
          GraceInTime :this.formInput.GraceIn,
          IsHalfDay:this.formInput.isHalfDay,
          MinWorkingHours:this.formInput.MinWorkHours,
          Departments:this.selectedDepartment,
           Ratio:this.formInput.Ratio,
           BranchID:editbranch,
           DepartmentID:editdept,
           ShiftType:editshift

        }
         console.log(json,"json of add shift");
         
        this._commonservice.ApiUsingPost("ShiftMaster/UpdateShift",json).subscribe(
    
          (data: any) => {
            if(data.Status==true){
            this.spinnerService.hide();
            // this.globalToastService.success(data.Message);
            this.ShowAlert(data.Message,"success")
             this.dialogRef.close()
            }
            else
            {
              // this.globalToastService.warning(data.Message);
              this.ShowAlert(data.Message,"warning")
                this.spinnerService.hide();
            }
            
          }, (error: any) => {
            localStorage.clear();
    
            // this.globalToastService.error(error.message);
            this.ShowAlert(error.message,"error")
            this.spinnerService.hide();
           }
        );
        return true;
      }
    }
       AmountValidation(){
        this.formInput.Ratio = 1
       }
       RatioValidation(){
        this.formInput.Amount = 0
       }

       Cancel(){
        this.dialogRef.close()
       }
        ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
               this.dialog.open(ShowalertComponent, {
                 data: { message, type },
                 panelClass: 'custom-dialog',
                 disableClose: true  
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
