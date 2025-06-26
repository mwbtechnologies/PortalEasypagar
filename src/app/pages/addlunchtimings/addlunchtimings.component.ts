import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { AdminlunchconfigComponent } from '../adminlunchconfig/adminlunchconfig.component';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-addlunchtimings',
  templateUrl: './addlunchtimings.component.html',
  styleUrls: ['./addlunchtimings.component.css']
})
export class AddlunchtimingsComponent {
  LunchList:any[]=[]
  ORGId:any
  timeFormat:any;
  timeFormat1:any
  BranchList:any[]=[];
  DepartmentList:any;
  selectedBranch:any[]=[];
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  selectedDepartment:any[]=[];
  MultipleBreaks:any[]=[];
  AdminID:any; UserID:any;
  temparray:any=[]; tempdeparray:any=[];
  isChecked:boolean = false
  @Input() EditedData:any
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}

  constructor(private spinnerService: NgxSpinnerService,private adminlunch:AdminlunchconfigComponent,private dialog:MatDialog,
    private cdr :ChangeDetectorRef, private _commonservice: HttpCommonService, private globalToastService:ToastrService,private _httpClient:HttpClient){ 
      this.branchSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.departmentSettings = {
        singleSelection: false,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
      this.orgSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      };
   
  }


  getBranchID(branchNames: string[]) {
    // Get the ID from the list of branch names
    if (branchNames.length > 0) {
      const branch = this.BranchList.find(b => b.Text === branchNames[0]);
      return branch ? branch.ID : 0;
    }
    return 0;
  }

  getDepartmentID(deptName: string) {
    // Get the ID from the department name
    const department = this.DepartmentList.find((d:any)=> d.Text === deptName);
    return department ? department.ID : 0;
  }
  ngOnInit(){
  this.ORGId = localStorage.getItem('OrgID')
  this.AdminID = localStorage.getItem("AdminID");
  this.UserID=localStorage.getItem("UserID");
  this.getLunchTimings()
  this.getTimeFormat()
  this.GetOrganization()
  this.GetBranches()
  console.log(this.EditedData,"sddsd")
  if (this.EditedData) {
    this.bindEditedData();
  }
  }

  bindEditedData() {
    this.MultipleBreaks.push({
      branch: this.EditedData.BranchName,
      branchid:[this.EditedData.BranchID],
      departments: this.EditedData.Departments.map((dept:any) => ({
        Text: dept.Name,
        Value:dept.ID
      })),
      breaks: this.EditedData.Breaks.map((b:any) => ({
        id:b.BreakID,
        name: b.BreakName,
        duration: b.Duration,
        startTime: this.formatTime(b.StartTime),
        endTime: this.formatTime(b.EndTime),
        status:b.Status,
        editable:b.IsEdittable,
        
      }))
    });
  }
  onselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.GetBranches()
  }
  
  GetOrganization() {
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetSuborgList?OrgID="+this.ORGId+"&AdminId="+this.AdminID).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
    }, (error) => {
       console.log(error);
    });
  }
  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    
    this._commonservice.ApiUsingGetWithOneParam("Admin/GetBranchListupdated?OrgID="+this.ORGId+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
    }, (error) => {
      // this.globalToastService.error(error); 
      this.ShowAlert(error,"error")
      console.log(error);
    });

  }
  GetDepartments() {
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      AdminID:loggedinuserid,
      OrgID:this.ORGId,
      Branches:this.selectedBranch.map((br: any) => {
        return {
          "id":br.Value
        }
      })
    }
    this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments",json).subscribe((data) => {
      console.log(data);
      if (data.DepartmentList.length > 0) {
        this.DepartmentList = data.List;
        console.log(this.DepartmentList,"department list");
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }

  onDeptSelect(item:any){
    const newDeptText = item.Text;
    var branchname=this.selectedBranch.map(br => br.Text);
    var selectedd=this.selectedDepartment;
    var branchexist="No";
    for(let i=0;i<this.MultipleBreaks.length;i++)
    {
      if(this.MultipleBreaks[i].branch[0]==branchname)
      {
        for(let j=0;j<this.MultipleBreaks[i].departments.length;j++)
        {
          if(this.MultipleBreaks[i].departments[j].Text==newDeptText)
    {
      branchexist="Yes";break;
    }       
      }
      }
    }
    if (branchexist=="Yes") {
      // this.globalToastService.error("Department Already Selected")
      this.ShowAlert("Department Already Selected","error")
      this.selectedDepartment = this.selectedDepartment.filter(sb => !newDeptText.includes(sb.Text));
      return;
    } else{
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
    }
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
  onBranchSelect(item:any){
   this.temparray.push({id:item.Value,text:item.Text });
   this.selectedDepartment = []
   this.DepartmentList = []
   this.GetDepartments();
 
  }
  onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.selectedDepartment = []
   this.DepartmentList = []
   this.GetDepartments();
  }

  getTimeFormat() {
    const LoggedInUserData: any = localStorage.getItem("LoggedInUserData");
    if (LoggedInUserData?.TimeFormat === true) {
      this.timeFormat = 24;
    }
  }

  // calculateDuration(breakEntry: any) {
  //   setTimeout(() => {
  //     const timeFormat = this.timeFormat === 24 ? 'HH:mm' : 'h:mm A';
  
  //     const fromTime = moment(breakEntry.startTime, timeFormat);
  //     const toTime = moment(breakEntry.endTime, timeFormat);
  
  //     // Check if both startTime and endTime are present
  //     if (breakEntry.startTime && breakEntry.endTime) {
  //       const startParts = breakEntry.startTime.split(':');
  //       const endParts = breakEntry.endTime.split(':');
  
  //       const startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
  //       const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
  
  //       const diffMinutes = endMinutes - startMinutes;
        
  
  //       if (diffMinutes < 5) {
  //         this.globalToastService.warning("There Must Be 5 Min Differ Between StartTime and EndTime");
  //         breakEntry.startTime = "";
  //         breakEntry.endTime = "";
  //         breakEntry.duration = ""; 
  //       }
  //     }

  //      if (breakEntry.startTime && breakEntry.endTime) {
  //       let duration = toTime.diff(fromTime, 'minutes');
  //       if (duration < 0) {
  //         duration += 24 * 60; // Handle overnight duration
  //       }
  
  //       breakEntry.duration = duration;
  
  //       if (duration > 180) {
  //         this.globalToastService.warning("Total Duration Should Not Exceed 3 Hours");
  //         breakEntry.startTime = "";
  //         breakEntry.endTime = "";
  //         breakEntry.duration = ""; // Optionally set duration to blank
  //         this.cdr.detectChanges();
  //       }
  //     } else {
  //       // If either startTime or endTime is not present, set duration to 0 or blank
  //       breakEntry.duration = 0; // Set to 0 or leave it as an empty string
  //     }
  //   }, 0);
  // }
  calculateDuration(breakEntry: any) {
    setTimeout(() => {
      const timeFormat = this.timeFormat === 24 ? 'HH:mm' : 'h:mm A';
  
      const fromTime = moment(breakEntry.startTime, timeFormat);
      const toTime = moment(breakEntry.endTime, timeFormat);
  
      if (breakEntry.startTime && breakEntry.endTime) {
        const startParts = breakEntry.startTime.split(':');
        const endParts = breakEntry.endTime.split(':');
  
        const startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);
        const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);
  
        let diffMinutes = endMinutes - startMinutes;
        if (diffMinutes < 0) {
          diffMinutes += 24 * 60; // Handle overnight scenario
        }
  
        if (diffMinutes < 5) {
          // this.globalToastService.warning("There Must Be 5 Min Difference Between StartTime and EndTime");
          this.ShowAlert("There Must Be 5 Min Difference Between StartTime and EndTime","warning")
          breakEntry.startTime = "";
          breakEntry.endTime = "";
          breakEntry.duration = ""; 
          return; // Stop execution
        }
  
        let duration = toTime.diff(fromTime, 'minutes');
        if (duration < 0) {
          duration += 24 * 60; // Handle overnight duration
        }
  
        breakEntry.duration = duration;
  
        if (duration > 180) {
          // this.globalToastService.warning("Total Duration Should Not Exceed 3 Hours");
          this.ShowAlert("Total Duration Should Not Exceed 3 Hours","warning")
          breakEntry.startTime = "";
          breakEntry.endTime = "";
          breakEntry.duration = "";
          this.cdr.detectChanges();
        }
      } else {
        breakEntry.duration = 0; // If either start or end time is missing
      }
    }, 0);
  }
  

  formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

getLunchTimings(){
  const json = {
    "OrgID":this.ORGId,
  }
   this._commonservice.ApiUsingPost("Admin/AddLunchHour",json).subscribe((data:any) =>{
    this.LunchList = data.List.hours.map((item: any) => {
      return {
        ...item,
        originalMinutes: item.Minutes
      };
    });

   })
}


SubmitLunch(IL:any){
  const json = {
    "OrgID":this.ORGId,
    "hours":IL.map((d:any)=>{
      return {
        "branchid":d.branchid,
        "Minutes":d.Minutes,
        "StartTime":d.StartTime,
        "EndTime":d.EndTime
      }
    })
  }
  console.log(json,"lunch json");
  this._commonservice.ApiUsingPost("Admin/AddLunchHour",json).subscribe((data:any) =>{
    // this.globalToastService.success("Lunch Timings Added Successfully")
    this.ShowAlert("Lunch Timings Added Successfully","success")
  },(error)=>{
    // this.globalToastService.error("Failed To Submit")
    this.ShowAlert("Failed To Submit","error")
  })
}

addBrDeptWise(){
  if(this.selectedBranch.length == 0){
    // this.globalToastService.warning("Please Select Branch")
    this.ShowAlert("Please Select Branch","warning")
  } 
  else if
  (this.selectedDepartment.length == 0){
    // this.globalToastService.warning("Please Select Atleast One Department To Proceed")
    this.ShowAlert("Please Select Atleast One Department To Proceed","warning")
  }
  else
  {
    var branchname=this.selectedBranch.map(br => br.Text);
    var selectedd=this.selectedDepartment;
    var branchexist="No";
    for(let i=0;i<this.MultipleBreaks.length;i++)
    {
      if(this.MultipleBreaks[i].branch[0]==branchname)
      {
        for(let j=0;j<this.MultipleBreaks[i].departments.length;j++)
        {
          for(let k=0;k<this.selectedDepartment.length;k++)
          {
            if(this.MultipleBreaks[i].departments[j].Text==this.selectedDepartment[k].Text)
              {
                this.selectedDepartment.splice(k, 1);
                branchexist="Yes";break;
              } 
          }
        
      }
      }
    }
    if(this.selectedDepartment.length>0)
    {
      this.MultipleBreaks.push({
        "branch":this.selectedBranch.map(br => br.Text),
        "branchid":this.selectedBranch.map(br => br.Value),
        "departments":this.selectedDepartment,
        "breaks": this.initializeDefaultBreaks()
      })
    }

    this.selectedBranch = [];
    this.selectedDepartment = [];
  }
 
}
initializeDefaultBreaks() {
  return Array(1).fill(null).map(() => ({
    id:0,
    name: '',
    startTime: '',
    endTime: '',
    duration: '',
    status:true,
    editable:true
  }));
}

addBreak(mb: any) {
  mb.breaks.push({
    id:0,
    name: '',
    startTime: '',
    endTime: '',
    duration: '',
    status:true,
    editable:true
  });
}

restrictInput(event: KeyboardEvent): void {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (!allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
}

removeBreak(mb: any, index: number) {
  mb.breaks.splice(index, 1);
}
removeDepartment(mIndex: number, dIndex: number) {
  this.MultipleBreaks[mIndex].departments.splice(dIndex, 1);
}
removeBranchWise(mb: any, index: number) {
  this.MultipleBreaks.splice(index, 1);
}
formatTime(time: string) {
  return moment(time, this.timeFormat === 24 ? 'HH:mm' : 'h:mm A').format('HH:mm');
}

parseDuration(duration: string) {
  const [hours, mins] = duration.split('h').map(Number);
  return (hours || 0) * 60 + (mins || 0);
}
submit(){

  var ValidationStatus="Correct";var Message="";
  for(let i=0;i<this.MultipleBreaks.length;i++)
  {
    var BranchName=this.MultipleBreaks[i].branch;
    if(this.MultipleBreaks[i].breaks.length>0)
    {
      for(let j=0; j<this.MultipleBreaks[i].breaks.length;j++)
        {
          if(this.MultipleBreaks[i].breaks[j].name == undefined || this.MultipleBreaks[i].breaks[j].name.length == 0){
           
            Message="Please Enter Break Name for "+BranchName + " Branch"; ValidationStatus="Wrong";
            break;
          }          
          else if(this.MultipleBreaks[i].breaks[j].startTime && this.MultipleBreaks[i].breaks[j].endTime == undefined){
            Message="Please Enter End Time for "+this.MultipleBreaks[i].breaks[j].name+" Break of "+BranchName + "";
            ValidationStatus="Wrong"; break;
          }
          else if(this.MultipleBreaks[i].breaks[j].endTime && this.MultipleBreaks[i].breaks[j].startTime == undefined){
           Message="Please Enter Start Time for "+this.MultipleBreaks[i].breaks[j].name+" Break of "+BranchName + "";
            ValidationStatus="Wrong"; break;
          }
          else if(this.MultipleBreaks[i].breaks[j].duration == undefined ||this.MultipleBreaks[i].breaks[j].duration == 0||this.MultipleBreaks[i].breaks[j].duration == ""||this.MultipleBreaks[i].breaks[j].duration == "0"){
            Message=BranchName+"'s "+ this.MultipleBreaks[i].breaks[j].name+" Break Duration should be greater than 0"; 
            ValidationStatus="Wrong"; break;
          }
          else if(parseInt(this.MultipleBreaks[i].breaks[j].duration)>120){
            Message=BranchName+"'s "+ this.MultipleBreaks[i].breaks[j].name+" Break Duration should not be greater than 120Mins"; 
            ValidationStatus="Wrong"; break;
          }

        }
    }
    else{
      // this.globalToastService.warning("Please Add Atlest One Break for "+BranchName);
      this.ShowAlert("Please Add Atlest One Break for "+BranchName,"warning")
    }
   
  }
  if(ValidationStatus=="Correct") 
    {
    const json:any = {
    "AdminID": this.AdminID,
    "BreaksData": this.MultipleBreaks.map(mb => ({
      "BranchID": mb.branchid[0],
      "Departments": mb.departments.map((deptName:any) => ({
        "ID":deptName.Value,
        "Name": deptName.Text
      })),
      "Breaks": mb.breaks.map((b:any) => ({
        "BreakID":b.id,
        "BreakName": b.name,
        "Duration": b.duration,
        "StartTime": this.formatTime(b.startTime),
        "EndTime": this.formatTime(b.endTime),
        "Status":b.status,
        "ActualBreakID":b.id
      }))
    }))
  };
  if(this.EditedData.length !=0){
    json["Type"]="Update"
  }
  console.log(json,"final json to send to add lunch");
  this._commonservice.ApiUsingPost("Breaks/AddUpdateBreakList",json).subscribe((data:any) => {
    if(data.Status = true){
      // this.globalToastService.success(data.Message)
      this.ShowAlert(data.Message,"success")
      this.MultipleBreaks = []
      this.selectedBranch = []
      this.selectedDepartment = [];
      this.EditedData=[];
      this.adminlunch.backToList();
    }else {
      // this.globalToastService.error(data.Message)
      this.ShowAlert(data.Message,"error")
    }
  }, (error) => {
    // this.globalToastService.error(error.mesasge)
    this.ShowAlert(error.Message,"error")
  })
}
else{
  // this.globalToastService.warning(Message);
  this.ShowAlert(Message,"error")
}
 }

 sanitizeInput(event: any,i:any) {
  let value = event.target.value;

  // Remove any non-numeric characters, allowing only numbers
  value = value.replace(/[^0-9]/g, '');

  // Limit the length to 3 digits
  if (value.length > 3) {
    value = value.substring(0, 3);  // Trim the value to 3 digits
  }

  // Update the model
  event.target.value = value;
  this.MultipleBreaks[i].duration = value;
}
preventFirstSpace(event: KeyboardEvent): void {
  const inputElement = event.target as HTMLInputElement;
  if (event.key === ' ' && inputElement.selectionStart === 0) {
    event.preventDefault();
  }
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
}
