import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { DeleteconfirmationComponent } from '../../employee-muster/deleteconfirmation/deleteconfirmation.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { typRssOutline } from '@ng-icons/typicons';
import { MinValidator } from '@angular/forms';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-addeditbonusdeduction',
  templateUrl: './addeditbonusdeduction.component.html',
  styleUrls: ['./addeditbonusdeduction.component.css']
})
export class AddeditbonusdeductionComponent {
  moduletype:any
  TotalNoDays:any
  NoDaysWorked:any
  ExtraHours:any;
  showminerror=false;showmaxerror=false;minmsg:any; maxmsg:any;
  TypeBonusList:any[] = []
  TypeDeducList:any[] = []
  // TypeBonusList = ['Early-In', 'Late-Exit','On-Time','Present']
  // TypeDeducList = ['Late-In', 'Early-Exit', 'Leave-Without-Permission','Absent']
  selectedType:any
  TypeSettings:IDropdownSettings = {}
  SalaryTypeList:any[]=['Basic','Gross']
  selectedSalaryType:any
  SalaryTypeSettings:IDropdownSettings = {}
  moduleTypeSettings:IDropdownSettings = {}
  isAmountSelected:boolean = true
  isPercentageSelected:boolean = false
  isDaySelected:boolean = false
  TotalAmount:any
  PercentageValue:any
  IsPerDay:boolean=true
  isAmountInput:boolean=false
  isPercentInput:boolean=false
  isPercentageInput:boolean=false
  isDayInput:boolean=false
  isNumberSelected:boolean = false
   isPercentSelected:boolean = false
   isNumberInput:boolean = false
  selectedDeductType: any
  selectedValueType:any
  module:any[]=['Attendance','Lunch']
  bdData:any[]=['Day-Wise','Month-Wise']
  bdtype:any
  Value:any
  finalvalues:any
  bdTypeSettings:IDropdownSettings={}
  EmployeeList:any;
  DepartmentList:any;UserID:any
  BranchList:any[]=[];
  branchSettings :IDropdownSettings = {}
  departmentSettings :IDropdownSettings = {}
  employeeSettings :IDropdownSettings = {}
  temparray:any=[]; tempdeparray:any=[];
  selectedDepartment:any[]=[];
  selectedEmployees:any[]=[]
  selectedBranch:any[]=[];
  AdminID:any
  OrgID:any
  ApiURL:any
  isEdit:boolean
  branchName:any
  departmentName:any
  employeeName:any
  NumberDays:any[]=['28','29','30','31']
  selectedOrganization:any[]=[]
  OrgList:any[]=[]
  orgSettings:IDropdownSettings = {}
  constructor( private globalToastService:ToastrService,@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService,private toastr: ToastrService,public dialogRef: MatDialogRef<DeleteconfirmationComponent>){
    this.isEdit = this.data.isEdit || false,
    this.branchName =this.data.row?.BranchName || 'No Branch' ,
    this.departmentName =this.data.row?.MappingDetails || [] ,
    this.employeeName =this.data.row?.MappingDetails || [] ,
    // this.TotalNoDays = this.data.row?.NoOfDays || 0,
    this.NoDaysWorked = this.data.row?.Days || 1,
    this.ExtraHours = this.data.row?.ExtraHours || 0,
    this.IsPerDay = this.data.row?.IsPerDay || false,
    // this.selectedType = this.data.row?.Isdayspercentage || true,
    this.Value = this.data.row?.Value || 0
  
    if(this.data.row?.IsPercentage == false){
      this.selectedDeductType = 'amount';
    }
    if(this.data.row?.IsPercentage == true){
      this.selectedDeductType = 'percentage';
    }
    if(this.data.row?.Isdayspercentage == false){
      this.selectedValueType = 'number';
    }
    if(this.data.row?.Isdayspercentage == true){
      this.selectedValueType = 'percent';
    }
    if(this.isEdit == false){  
      this.selectedDeductType = 'amount';
      this.selectedValueType='number';
    }
    if(this.isEdit == false){
      this.selectedType = []
      this.selectedSalaryType = []
    }
    if(this.isEdit == true){
      let logintypedata = this.data.row?.LoginType || []
      this.selectedType = [logintypedata]
     
      let totalnoofdays = (this.data.row?.NoOfDays || 0).toString();
      this.TotalNoDays = [totalnoofdays]

      let salarytypedata = this.data.row?.SalaryType || ""
      salarytypedata ?  this.selectedSalaryType = [salarytypedata] :  this.selectedSalaryType = [] 
    }
    if(this.isEdit == false){
      // this.moduletype = ['Attendance']
      this.moduletype = []
      this.bdtype = []
    }
    if(this.isEdit == true){
      let editmodule = this.data.row?.Module || []
      this.moduletype = [editmodule]
      this.OnModulSelect(editmodule)
      // let edittype = this.data.row?.Type || []
      // this.bdtype = [edittype]
    }
  // this.bdtype = ['Bonus']
    this.TypeSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  }
  this.SalaryTypeSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  }
  this.moduleTypeSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  }
  this.bdTypeSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  }
  this.branchSettings = {
    singleSelection: true,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
  };
 this.employeeSettings = {
    singleSelection: false,
    idField: 'ID',
    textField: 'Name',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    disabledField: 'disabled'
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
  ngOnInit() {
    this.updateSelection()
    this.updateValueSelection()
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID=localStorage.getItem("UserID");
    this.OrgID = localStorage.getItem("OrgID");
    this.GetOrganization()
    this.GetBranches()
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
    this.ApiURL = "Admin/GetSuborgList?OrgID="+this.OrgID+"&AdminId="+this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if(data.List.length == 1){
        this.selectedOrganization = [{Value:this.OrgList[0].Value,Text:this.OrgList[0].Text}]
        this.onselectedOrg({Value:this.OrgList[0].Value,Text:this.OrgList[0].Text})
      }
    }, (error) => {
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }

  GetBranches() {
    let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    this.ApiURL = "Admin/GetBranchListupdated?OrgID="+this.OrgID+"&SubOrgID="+suborgid+"&AdminId="+this.AdminID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.BranchList = data.List;
      console.log(this.BranchList, "branchlist");
      if(this.isEdit){
        this.selectedBranch =  this.BranchList.filter((br:any) => br.Value == this.data.row?.BranchID)      
        this.getEmployeeList()
        this.GetDepartments()
      }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });

  }
  GetDepartments() {
    this.DepartmentList=[];
    this.selectedDepartment=[];
    var loggedinuserid=localStorage.getItem("UserID");
    const json={
      AdminID:loggedinuserid,
      OrgID:this.OrgID,
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
        this.selectedDepartment = this.departmentName.map((r: any) => {
          return this.DepartmentList.find((emp: any) => emp.Value === r.DepartmentID);
        }).filter((dept:any, index:any, self:any) => 
          dept && index === self.findIndex((d:any) => d?.Value === dept.Value));
       }
    }, (error) => {
      // this.globalToastService.error(error);
      this.ShowAlert(error,"error")
       console.log(error);
    });
  }
  // getEmployeeList(){
  //  let BranchID = this.selectedBranch?.map((y:any) => y.Value)[0] || 0
  //  let deptID = this.tempdeparray?.map((y:any) => y.id)[0] || 0
  //   this.ApiURL="Admin/GetEmployees?AdminID="+this.AdminID+"&BranchID="+BranchID+"&DeptId="+deptID+"&Year="+0+"&Month="+0+"&Key=en";
  //   this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) =>{
  //      this.EmployeeList = data.data
  //   this.EmployeeList = this.EmployeeList.map((emp: any) => {
  //     const matchedType = this.employeeName.find((ep: any) => emp.Value === ep.EmployeeID);
  //     return {
  //       ...emp,
  //       disabled: matchedType ? !matchedType.IsDeletable : false 
  //     };
  //   });
  //      this.selectedEmployees = this.employeeName.map((r:any) => {
  //       return this.EmployeeList.filter((emp:any) => emp.Value == r.EmployeeID)[0]
  //     })
  //     }, (error) => {
  //      console.log(error);this.spinnerService.hide();
  //   });
  // }
  getEmployeeList(){
    const json:any = {
      AdminID:this.AdminID
    }
    if (this.selectedBranch) {
      json["BranchID"] =  this.selectedBranch.map((br:any)=>{return br.Value})
     }
    if (this.selectedDepartment) {
      json["DepartmentID"] =  this.tempdeparray.map((br:any)=>{ return br.id})
     }
    this._commonservice.ApiUsingPost("Portal/GetEmpListOnBranch",json).subscribe((data) => {
    this.EmployeeList = data.List
    this.EmployeeList = this.EmployeeList.map((emp: any) => {
          const matchedType = this.employeeName.find((ep: any) => emp.ID === ep.EmployeeID);
          return {
            ...emp,
            disabled: matchedType ? !matchedType.IsDeletable : false 
          };
        });
           this.selectedEmployees = this.employeeName.map((r:any) => {
            return this.EmployeeList.filter((emp:any) => emp.ID == r.EmployeeID)[0]
          })
    }
    ,(error) => {
    console.log(error);this.spinnerService.hide();
  });
    }
 onDeptSelect(item:any){
    console.log(item,"item");
    this.tempdeparray.push({id:item.Value, text:item.Text });
    this.selectedEmployees = []
   this.getEmployeeList()
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
    this.selectedEmployees = []
   this.getEmployeeList()
   }
 onBranchSelect(item:any){
   console.log(item,"item");
   this.temparray.push({id:item.Value,text:item.Text });
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }
 onBranchDeSelect(item:any){
   console.log(item,"item");
   this.temparray.splice(this.temparray.indexOf(item), 1);
   this.GetDepartments();
   this.selectedEmployees = []
   this.getEmployeeList()
  }
  OnEmployeesChange(_event:any){
  }
  OnEmployeesChangeDeSelect(event:any){ 
  }
  onTypeSelect(item:any){
    this.updateValueSelection()
  }
  onTypeDeSelect(item:any){
 
  }
  onSalaryTypeSelect(item:any){

  }
  onSalaryTypeDeSelect(item:any){

  }
  onmoduleTypeSelect(item:any){
    this.selectedType = []
    this.OnModulSelect(item);
  }
  onmoduleTypeDeSelect(item:any){
    this.TypeDeducList = []
    this.TypeBonusList = []
    this.selectedType = []
  }
  onbdTypeSelect(item:any){
  }
  onbdTypeDeSelect(item:any){
  }
  updateSelection(): void {
    this.isAmountSelected = this.selectedDeductType === 'amount';
    this.isPercentageSelected = this.selectedDeductType === 'percentage';
    this.isDaySelected = this.selectedDeductType === 'day';
    if(this.isAmountSelected){
      this.isPercentageInput = false
      this.isAmountInput = true
      this.isDayInput = false
    }
    if(this.isPercentageSelected){
      this.isAmountInput = false
      this.isPercentageInput = true
      this.isDayInput = false
    }
    if(this.isDaySelected){
      this.isAmountInput = false
      this.isPercentageInput = false
      this.isDayInput = true
    }
  }
  updateValueSelection(): void {
    if(this.selectedValueType == 'number')
      {
       this.TotalNoDays = 31
    }
    else if(this.selectedValueType == 'percent'){
      this.TotalNoDays = 100
    }
    if(this.selectedType[0] != 'Absent' && this.selectedType[0] !='Present')
    {
this.NoDaysWorked=1;
    }
    // this.isNumberSelected = this.selectedValueType === 'number';
    // this.isPercentSelected = this.selectedValueType === 'percent';
    // if(this.isNumberSelected){
    //   this.isPercentInput = false
    //   this.isNumberInput = true
    // }
    // if(this.isPercentSelected){
    //   this.isNumberInput = false
    //   this.isPercentInput = true
    // }
  }
  
  
  AddbonusDeduction(){
    var minvalue=parseInt(this.NoDaysWorked);
    var maxvalue=parseInt(this.TotalNoDays);
  if(this.selectedBranch==null || this.selectedBranch==undefined || this.selectedBranch.length==0)
    {
    // this.toastr.warning('Please Select Branch');
    this.ShowAlert("Please Select Branch","warning")
  }
  else if(this.selectedEmployees==null || this.selectedEmployees.length==0 || this.selectedEmployees==undefined){
    // this.toastr.warning('Please Select Employees');\
    this.ShowAlert("Please Select Employees","warning")
  }
 else if(this.moduletype==null || this.moduletype==undefined || this.moduletype=='')
    {
    // this.toastr.warning('Please Select Module');
    this.ShowAlert("Please Select Module","warning")
  }
  else if(this.selectedType==null || this.selectedType==undefined || this.selectedType==''){
    // this.toastr.warning('Please Select Login Type');
    this.ShowAlert("Please Select Login Type","warning")
  }
  else if(this.selectedValueType!='percent' && this.selectedValueType!='number'){
    // this.toastr.warning('Please Select Value Type');
    this.ShowAlert("Please Select Value Type","warning")
  }
 else if(this.selectedValueType=='percent' && ((minvalue < 1 || minvalue > 100)|| (maxvalue < 1 || maxvalue > 100) || (minvalue>maxvalue) ))
  {
    if (minvalue < 1 || minvalue > 100) 
      {
        // this.globalToastService.warning('Please enter min value between 1 and 100.');\
        this.ShowAlert("Please enter min value between 1 and 100.","warning")
        this.NoDaysWorked=1;
      }
    else  if (maxvalue < 1 || maxvalue > 100) 
        {
          // this.globalToastService.warning('Please enter max value between 1 and 100.');
          this.ShowAlert("Please enter max value between 1 and 100.","warning")
          // this.TotalNoDays=1;
        }
        else if (minvalue>maxvalue) 
        {
          // this.globalToastService.warning('Max value should be greater than min value');
          this.ShowAlert("Max value should be greater than min value","warning")
          this.NoDaysWorked=1;
        }
  }
  else if(this.selectedValueType=='number' && (minvalue == null || minvalue == undefined || minvalue == 0 || Number.isNaN(minvalue)))
    {
      // this.toastr.warning('Please Enter Min Value');
      this.ShowAlert("Please Enter Min Value","warning")
  
      }
 else if(this.selectedValueType=='number' && (this.selectedType == 'Absent' || this.selectedType =='Present') && (maxvalue == null || maxvalue == undefined || maxvalue == 0 || Number.isNaN(maxvalue)))
  {
    // this.toastr.warning('Please Select Max Value');
    this.ShowAlert("Please Enter Max Value","warning")

    }
    else if(this.selectedDeductType === 'percentage' && (this.selectedSalaryType==undefined|| this.selectedSalaryType==null || this.selectedSalaryType == "")){

        // this.toastr.warning('Please Select Salary Type');
        this.ShowAlert("Please Enter Salary Type","warning")

    }
    else if(this.Value==undefined|| this.Value==null || this.Value==''){
      // this.toastr.warning('Please Enter Value');
      this.ShowAlert("Please Enter Value","warning")
    }
    else if(this.Value==0 || this.Value=='0'||parseInt(this.Value)<1)
      {
        // this.toastr.warning('Please Enter Value greather than 0');
        this.ShowAlert("Please Enter Min Value greater than 0","warning")
      }

  
    else{
      if(this.selectedType[0] != 'Absent' && this.selectedType[0] !='Present')
        {
    this.NoDaysWorked=1;this.TotalNoDays=31;
        }
      let empid = this.selectedEmployees.map((se:any)=>se.ID) || []
      let brid = this.selectedBranch.map((se:any)=>se.Value)[0] || 0
      let deptid = this.selectedDepartment.map((se:any)=>se.Value) || []
      let amountorpercent = false
      if(this.selectedValueType == 'number'){
        amountorpercent = false
      }else if(this.selectedValueType == 'percent'){
        amountorpercent = true
      }
      if(this.selectedType =='Late-In' || 
        this.selectedType == 'Early-Exit' || 
        this.selectedType == 'Leave-Without-Permission' || 
        this.selectedType == 'Early-In' || 
        this.selectedType == 'Late-Exit' || 
        this.selectedType == 'On-Time'
      ){
        this.TotalNoDays = 1
        amountorpercent = false
      }
        const json:any={
          "AdminID":this.UserID,
           "Module": this.moduletype[0],
           "LoginType": this.selectedType[0],
           "Type":this.data.type,
           "NoOfDays": parseInt(this.TotalNoDays),
           "Days": this.NoDaysWorked,
           "Isdayspercentage":amountorpercent,
          // "NoOfDays": 1,
          // "Days": 1,
          //  "ExtraHours":this.ExtraHours,
           "IsPercentage": this.isPercentageSelected,
           "Value": this.Value,
           "IsPerDay": this.IsPerDay,
          //  "SalaryType":this.selectedSalaryType[0] || "",
          //  "BranchID": 0,
           "BranchName": "",
          //  "DepartmentIDs": [],
           "DepartmentName": "",
          //  "EmployeeIDs": empid,
           "EmployeeName": ""
        }
        if(this.selectedBranch.length > 0){
          json["BranchID"] = brid
          json["DepartmentIDs"] = []
          json["EmployeeIDs"] = []
        }
        if(this.selectedDepartment.length > 0){
          json["BranchID"] = brid
          json["DepartmentIDs"] = deptid
          json["EmployeeIDs"] = []
        }
        if(this.selectedEmployees.length > 0){
          json["EmployeeIDs"] = empid
          json["BranchID"] = 0
          json["DepartmentIDs"] = []
        }
        if(this.selectedDeductType === 'amount'){
          json["SalaryType"] = ""
        }
        if(this.selectedDeductType === 'percentage'){
          json["SalaryType"] = this.selectedSalaryType[0]
        }
        //  this.spinnerService.show()
         console.log(json,"json")
          this._commonservice.ApiUsingPost('Bonusdeduction/addBonusAndAdvanceDetails',json).subscribe((data:any)=>{
            // this.toastr.success(data.Message);
            this.ShowAlert(data.Message,"success")
            this.dialogRef.close();
            this.spinnerService.hide()
          },(error)=>{
          //  this.toastr.error(error.Message);
          this.ShowAlert(error.Message,"error")
           this.spinnerService.hide()
           this.dialogRef.close();
          })
         }
  
  }

  UpdatebonusDeduction(){
    var minvalue=parseInt(this.NoDaysWorked);
    var maxvalue=parseInt(this.TotalNoDays);
    if(this.moduletype==null || this.moduletype==undefined || this.moduletype=='')
      {
      // this.toastr.warning('Please Select Module');
      this.ShowAlert('Please Select Module',"warning")
    }
    else if(this.selectedEmployees==null || this.selectedEmployees.length==0 || this.selectedEmployees==undefined){
      // this.toastr.warning('Please Select Employees');
      this.ShowAlert('Please Select Employees',"warning")
    }
    else if(this.selectedType==null || this.selectedType==undefined || this.selectedType==''){
      // this.toastr.warning('Please Select Login Type');
      this.ShowAlert('Please Select Login Type',"warning")
    }
    else if(this.selectedValueType!='percent' && this.selectedValueType!='number'){
      // this.toastr.warning('Please Select Value Type');
      this.ShowAlert('Please Select Value Type',"warning")
    }
    else if(this.selectedValueType=='number' && (minvalue == null || minvalue == undefined || minvalue == 0 || Number.isNaN(minvalue)))
      {
        // this.toastr.warning('Please Enter Min Value');
        this.ShowAlert('Please Select Min Value',"warning")
    
        }
   else if(this.selectedValueType=='number' && (maxvalue == null || maxvalue == undefined || maxvalue == 0 || Number.isNaN(maxvalue)))
    {
      // this.toastr.warning('Please Select Max Value');
      this.ShowAlert('Please Select Max Value',"warning")
  
      }
      else if(this.selectedValueType=='number' && (minvalue<1 || minvalue>30))
        {
          // this.toastr.warning('Min value should be between 1 to 30');
          this.ShowAlert('Min value should be between 1 to 30',"warning")
      
          }
          else if(this.selectedValueType=='number' && (minvalue<1 || minvalue>30))
            {
              // this.toastr.warning('Min value should be between 1 to 30');
              this.ShowAlert('Min value should be between 1 to 30',"warning")
          
              }
   else if(this.selectedValueType=='percent' && ((minvalue < 1 || minvalue > 100)|| (maxvalue < 1 || maxvalue > 100) || (minvalue>maxvalue) ))
    {
      if (minvalue < 1 || minvalue > 100) 
        {
          // this.globalToastService.warning('Please enter min value between 1 and 100.');
          this.ShowAlert('Please enter min value between 1 and 100.',"warning")
          this.NoDaysWorked=1;
        }
      else  if (maxvalue < 1 || maxvalue > 100) 
          {
            this.globalToastService.warning('Please enter max value between 1 and 100.');
          this.ShowAlert('Please enter max value between 1 and 100.',"warning")

            // this.TotalNoDays=1;
          }
          else if (minvalue>maxvalue) 
          {
            // this.globalToastService.warning('Max value should be greater than min value');
            this.ShowAlert('Max value should be greater than min value',"warning")
            this.NoDaysWorked=1;
          }
    }
      else if(this.selectedDeductType === 'percentage' && (this.selectedSalaryType==undefined|| this.selectedSalaryType==null || this.selectedSalaryType == "")){
        // if(){
          // this.toastr.warning('Please Select Salary Type');
          this.ShowAlert('Please Select Salary Type',"warning")
        // }else{ 
          
        // }
      }
      else if(this.Value==undefined|| this.Value==null || this.Value==''){
        // this.toastr.warning('Please Enter Value');
        this.ShowAlert('Please Enter Value',"warning")
      }
      else if(this.Value==0 || this.Value=='0'||parseInt(this.Value)<1)
      {
        // this.toastr.warning('Please Enter Value greather than 0');
        this.ShowAlert('Please Enter Value greather than 0',"warning")
      }

      else
      {
        let empid = this.selectedEmployees.map((se:any)=>se.ID) || []
        let amountorpercent = false
        if(this.selectedValueType == 'number'){
          amountorpercent = false
        }else if(this.selectedValueType == 'percent'){
          amountorpercent = true
        }
        if(this.selectedType =='Late-In' || 
          this.selectedType == 'Early-Exit' || 
          this.selectedType == 'Leave-Without-Permission' || 
          this.selectedType == 'Early-In' || 
          this.selectedType == 'Late-Exit' || 
          this.selectedType == 'On-Time'
        ){
          // this.TotalNoDays = 1
          amountorpercent = false
        }
        const json:any={
          "ID":this.data.row?.ID,
          "Module": this.moduletype[0],
          "LoginType": this.selectedType[0],
          "Type":this.data.row?.Type,
          "NoOfDays": parseInt(this.TotalNoDays),
          "Days": this.NoDaysWorked,
          "Isdayspercentage":amountorpercent,
          "ExtraHours":0,
          "IsPercentage": this.isPercentageSelected,
          "Value": this.Value,
          "IsPerDay": this.IsPerDay,
          "SalaryType":this.selectedSalaryType[0] || "",
          "BranchID": 0,
          "BranchName": "",
          "DepartmentIDs": [],
          "DepartmentName": "",
          "EmployeeIDs": empid,
          "EmployeeName": "",
          "AdminID":this.UserID
       }
        if(this.selectedDeductType === 'amount'){
          json["SalaryType"] = ""
        }
        if(this.selectedDeductType === 'percentage'){
          json["SalaryType"] = this.selectedSalaryType[0]
        }
       console.log(json,"edit");
       
        this.spinnerService.show()
         this._commonservice.ApiUsingPost('Bonusdeduction/UpdateBonusAndAdvanceDetails',json).subscribe((data:any)=>{
          //  this.toastr.success(data.Message);
          this.ShowAlert(data.Message,"success")
           this.spinnerService.hide()
           this.dialogRef.close();
         },(error)=>{
          // this.toastr.error(error.Message);
          this.ShowAlert(error.Message,"error")
          this.spinnerService.hide()
          this.dialogRef.close();
         })
      }

     
         }
  
         OnModulSelect(event:any)
         {
          if(event=="Lunch")
          {
            this.TypeDeducList = ['Late-In'];
            this.TypeBonusList = ['On-Time','Early-In'];
          }
          else {
            this.TypeDeducList = ['Late-In', 'Early-Exit', 'Leave-Without-Permission','Absent'];
            this.TypeBonusList = ['Early-In', 'Late-Exit','On-Time','Present'];
          }
         }

         checkminmax() {
          var minvalue=parseInt(this.NoDaysWorked);
          var maxvalue=parseInt(this.TotalNoDays);
          if(this.selectedValueType=='percent')
          {
            if (minvalue < 1 || minvalue > 100) 
              {
                // this.globalToastService.warning('Please enter min value between 1 and 100.');
                this.ShowAlert('Please enter min value between 1 and 100.',"warning")
                this.NoDaysWorked=1;
              }
            else  if (maxvalue < 1 || maxvalue > 100) 
                {
                  // this.globalToastService.warning('Please enter max value between 1 and 100.');
                  this.ShowAlert('Please enter max value between 1 and 100.',"warning")
                  // this.TotalNoDays=1;
                }
                else if (minvalue>maxvalue) 
                {
                  // this.globalToastService.warning('Max value should be greater than min value');
                  this.ShowAlert('Max value should be greater than min value',"warning")
                  this.NoDaysWorked=1;
                }
          }
         else if(this.selectedValueType=='number')
            {
              if (minvalue < 1 || minvalue > 31) 
                {
                  // this.globalToastService.warning('Please enter min value between 1 and 31.');
                  this.ShowAlert('Please enter min value between 1 and 31.',"warning")
                  this.NoDaysWorked=1;
                }
              else  if (maxvalue < 1 || maxvalue > 31) 
                  {
                    // this.globalToastService.warning('Please enter max value between 1 and 31.');
                    this.ShowAlert('Please enter max value between 1 and 31.',"warning")
                    // this.TotalNoDays=1;
                  }
                  else if (minvalue>maxvalue) 
                  {
                    // this.globalToastService.warning('Max value should be greater than min value');
                    this.ShowAlert('Max value should be greater than min value',"warning")
                    this.NoDaysWorked=1;
                  }

            }
            else{
              // this.globalToastService.warning("Please select value type before min & max values")
              this.ShowAlert('Please select value type before min & max values',"warning")
            }
         
        }

        checkval() {
          var minvalue=parseInt(this.Value);
          if (minvalue < 1) 
            {
              // this.globalToastService.warning('Please enter value greater than 0.');
              this.ShowAlert('Please enter value greater than 0.',"warning")
              this.Value=1;
            }
         
        }
        preventPlusMinus(event: KeyboardEvent): void {
          if (event.key === '+' || event.key === '-' || event.key === 'e'|| event.key === ' ') {
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
          close(){
            this.dialogRef.close();
          }
  }
  
