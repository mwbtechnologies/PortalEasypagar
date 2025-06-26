import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatStepper } from "@angular/material/stepper";
import { Router } from "@angular/router";
import * as moment from "moment";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { HierarchyComponent } from "src/app/pages/hierarchy/hierarchy.component";
import { AssetService } from "src/app/services/assets.service";
import { HttpCommonService } from "src/app/services/httpcommon.service";
import { PdfExportService } from "src/app/services/pdf-export.service";
import { ReduxService } from "src/app/services/redux.service";

@Component({
  selector: "app-asset-inward",
  templateUrl: "./inward.component.html",
  styleUrls: ["./inward.component.css"],
})
export class AssetInwardComponent implements OnInit {
  EmployeeList: any[] = [];
  BranchList: any[] = [];
  UserID: any;
  DepartmentList: any;
  branchSettings: IDropdownSettings = {};
  departmentSettings: IDropdownSettings = {};
  employeeSettings: IDropdownSettings = {};
  documentSettings: IDropdownSettings = {};
  itemSettings: IDropdownSettings = {};
  temparray: any = [];
  tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = [];
  selectedBranch: any[] = [];
  selectedDocuments: any[] = [];
  AdminID: any;
  ApiURL: any;
  ORGId: any;
  serialNumber: any;
  error:any={}
  steps: any = [];
  @ViewChild(MatStepper) stepper!: MatStepper;
  errorMessages:any={}
  itemList : any = []
  itemListKV : any = []

  inwardData : any;
  @ViewChild('itemListContainer') itemListContainer!: ElementRef;

  selectedOrganization:any[]=[]
  SubOrgList:any[]=[]
  orgSettings:IDropdownSettings = {}

  hirearchyActions:any[] = []
  selectedFilterData:any
  @ViewChild(HierarchyComponent) hierarchyChild!: HierarchyComponent;
  dropDownExtras:any
  IsEdit:boolean =false
  
  constructor(
    private pdfExportService: PdfExportService,
    private spinnerService: NgxSpinnerService,
    private _route: Router,
    private _commonservice: HttpCommonService,
    private globalToastService: ToastrService,
    private _httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    private assetService: AssetService,
    private reduxService : ReduxService
  ) {
    this.branchSettings = {
      singleSelection: false,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };
    this.employeeSettings = {
      singleSelection: false,
      idField: "ID",
      textField: "Name",
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      enableCheckAll: false,
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.itemSettings = {
      singleSelection: true,
      idField: "Value",
      textField: "Text",
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
    };
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    
    this.steps = [false, false];
    // this.hirearchyActions = ['Search']
    this.dropDownExtras = {
      employee:{
        isActive:false,
        settings:{
          singleSelection: true
        }
      }
    }
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem("OrgID");
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    // this.GetOrganization()
    // this.getBranches();
    // this.getDepartments()

    this.getAssets()
    if (history.state?.type == "Edit") {
      this.IsEdit = true
      this.bindData()
    }
    if (history.state?.type == "Create") {
      this.IsEdit = false
    }
    // this.getEmployeeList();
    this.initializeInwardData()
    this.loadFilterData()
    // this.getList()
  }

  bindData() {
    let json = {
      "invoiceId": history?.state?.data._id,
      "mapping": {
        "orgId": this.assetService.ORGId
      },
     "SoftwareId": 8
    }
    this.assetService.PostMethod("assetMgnt/stock/get",json).subscribe(res=>{
      if(res.data && res.data.length>0){
        if(res.data[0].mapping.SubOrgId){
          this.hierarchyChild.dropDownData.organization.selected = [{Value:res.data[0].mapping.SubOrgId}]
          this.hierarchyChild.onOrganizationSelect({})
        }
        if(res.data[0].mapping.branchId){
          this.hierarchyChild.dropDownData.branch.selected = [{Value:res.data[0].mapping.branchId}]
          this.hierarchyChild.onBranchSelect({})
        }
        if(res.data[0].mapping.departmentId){
          this.hierarchyChild.dropDownData.department.selected = [{Value:res.data[0].mapping.departmentId}]
          this.hierarchyChild.onDepartmentSelect({})
        }
        this.inwardData = {
          invoice:{
            id:res.data[0].invoiceId,
            supplierName:res.data[0].supplierName,
            invoiceDate:moment(res.data[0].invoiceDate).format('YYYY-MM-DD'),
            invoiceNumber:res.data[0].invoiceNumber,
            referenceNumber:res.data[0].referenceNumber,
            purchasedBy:res.data[0].purchasedByName
          },
          items:res.data.map((item:any)=>{
            return {
              stockId:item._id,
              item:[{Value:item.itemId,Text:item.itemName}],
              warrantyDate:item.warrantyDate,
              itemDetails:{
                returnType:item.returnType,
                measurement:item.measurement
              },
              quantity:item.quantity,
              modelNumber:item.modelNumber,
              serialNumber:"",
              serialNumbers:item.serialNumbers,
            }
          })
        }
      }
    })
  }

  loadFilterData(){
    let temp = localStorage.getItem('HirearchyData')
    if(temp) this.selectedFilterData = JSON.parse(temp)
  }

  triggerHierarchyAction(event:any){
    if(event.action == 'Search'){
      localStorage.setItem('HirearchyData',JSON.stringify(event.data))
    }
  }

  onselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.getBranches()
  }
  onDeselectedOrg(item:any){
    this.selectedBranch = []
    this.selectedDepartment = []
    this.getBranches()
  }
  
  GetOrganization() {
    // this.reduxService.getSubOrgList().subscribe((res:any)=>{
    //   if(res && res.data && res.data.length>0){
    //     this.SubOrgList = res.data
    //   }else throw {}
    // },error=>{
    //   this.globalToastService.error("Failed to load SubOrganization")
    // })
  }
  getBranches() {
    // let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
    // this.reduxService.getBranchList(suborgid).subscribe((res:any)=>{
    //   if(res && res.data && res.data.length>0){
    //     this.BranchList = res.data
    //   }else throw {}
    // },error=>{
    //   this.globalToastService.error("Failed to load Branches")
    // })
  }

  getDepartments() {
    let branch = this.selectedBranch?.map((y: any) => y.Value)
    // debugger
    this.reduxService.getDepartments(branch).subscribe((res:any)=>{
      if(res && res.data && res.data.length>0){
        this.DepartmentList = res.data
        // this.AssignedList = this.processAssignedList(this.AssignedList)
      }else throw {}
    },error=>{
      this.globalToastService.error("Failed to load Department")
    })
  }

  // getEmployeeList() {

  //   let branch = this.selectedBranch?.map((y: any) => y.Value)[0]
  //   let department = this.selectedDepartment?.map((y: any) => y.Value)[0]
  //   // debugger
  //   this.assetService.getEmployeeList(branch,department).subscribe((res:any)=>{
  //     if(res && res.data && res.data.length>0){
  //       this.EmployeeList = res.data
  //       // this.AssignedList = this.processAssignedList(this.AssignedList)
  //     }else throw {}
  //   },error=>{
  //     this.globalToastService.error("Failed to load Employees")
  //   })

  //   // let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0] || 0;
  //   // let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0;
  //   // this.ApiURL = `Admin/GetMyEmployees?AdminID=${this.AdminID}&BranchId=${BranchID}&DeptId=${deptID}&ListType=All`;
  //   // this._commonservice
  //   //   .ApiUsingGetWithOneParam(this.ApiURL)
  //   //   .subscribe((response) => {
  //   //     this.EmployeeList = response.List;
  //   //   });
  // }

  onDeptSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.push({ id: item.Value, text: item.Text });
    this.selectedEmployees = [];
    // this.getEmployeeList();
  }
  onDeptSelectAll(item: any) {
    console.log(item, "item");
    this.tempdeparray = item;
  }
  onDeptDeSelectAll() {
    this.tempdeparray = [];
  }
  onDeptDeSelect(item: any) {
    console.log(item, "item");
    this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);
    this.selectedEmployees = [];
    // this.getEmployeeList();
  }
  onBranchSelect(item: any) {
    console.log(item, "item");
    this.temparray.push({ id: item.Value, text: item.Text });
    this.selectedDepartment = [];
    this.getDepartments();
    this.selectedEmployees = [];
    // this.getEmployeeList();
  }
  onBranchDeSelect(item: any) {
    console.log(item, "item");
    this.temparray.splice(this.temparray.indexOf(item), 1);
    this.selectedDepartment = [];
    this.getDepartments();
    this.selectedEmployees = [];
    // this.getEmployeeList();
  }
  OnEmployeesChange(_event: any) {
    console.log(_event, "emp details");
  }
  OnEmployeesChangeDeSelect(event: any) {}
  onItemSelected(event:any, item_i:any){
    this.inwardData.items[item_i].itemDetails = this.itemListKV[event.Value]
    
  }
  onItemDeSelect(event:any, item_i:any){
    this.inwardData.items[item_i].item = {}

  }
  initializeInwardData(){
    this.inwardData = {
      invoice:{
        supplierName:"",
        invoiceDate:moment().format('YYYY-MM-DD'),
        invoiceNumber:"",
        referenceNumber:"",
        purchasedBy:""
      },
      items:[
      ]
    }
    this.addItemRow()
    // setTimeout(() => {
    //   this.validateSteps(0)
    //   this.validateSteps(0)
    // }, 500);
  }

  addItemRow(){
    this.inwardData.items.push({
      item:[],
      warrantyDate:"",
      returnType:"",
      quantity:0,
      modelNumber:"",
      serialNumber:"",
      serialNumbers:[],
    })
    
    setTimeout(() => {
      this.itemListContainer.nativeElement.scrollTop = this.itemListContainer.nativeElement.scrollHeight;
      
    }, 100);
  }
  

  isStepValid(step: number) {
    return this.steps[step] || false;
  }

  validateInvoice(): boolean{
    console.log(this.inwardData);
    
    return true
  }

  validateSteps(step: number) {
    let hasError = false;
    let paramerror:any = {}
    let details = this.inwardData.invoice  
    if(details.supplierName ==""|| details.supplierName == null ){
      paramerror[`supplier`] = "Please Enter Supplier Name"
       hasError = true;
    }
    if(details.purchasedBy ==""|| details.purchasedBy == null ){
       paramerror[`purchase`] = "Please Enter PurchasedBy"
        hasError = true;
    }
    if(details.referenceNumber ==""|| details.referenceNumber == null ){
        paramerror[`reference`] = "Please Enter Reference Number"
         hasError = true;
    }
    if(details.invoiceNumber ==""|| details.invoiceNumber == null ){
        paramerror[`invoice`] = "Please Enter Invoice Number"
         hasError = true;
    }
    if(details.invoiceDate ==""|| details.invoiceDate == null ){
        paramerror[`invoicedate`] = "Please Select Invoice Date"
         hasError = true;
    }
    this.error = paramerror;
     if (hasError) {
      return;
     }
      this.cdr.detectChanges();
      if (step == 0) {
        this.steps[0] = this.validateInvoice()// && this.validateEmployee()
        console.log(this.steps[0]);
        if (this.steps[0] == true){
          this.stepper.selectedIndex = 1;
        } 
      } else if (step == 1) {
        // this.steps[1] = this.validateEarnings() && this.validateDeductions() && this.validateGross()
        this.steps[1] = true;
        console.log(this.steps[0]);
        if (this.steps[1] == true) {
          this.stepper.selectedIndex = 2;
          // this.refreshSalaryCalculation()
        }
      }
    }

  goToPreviousStep() {
    this.stepper.previous();
  }

  onSubmit() {
    let hasError = false;
    let paramerror:any = {}
    if(this.inwardData.items.length > 0){
      const itemSerialTracker = new Map(); 
      for(let i=0; i<this.inwardData.items.length;i++)
        {
          paramerror[`${i}`] = {}
          let param = this.inwardData.items[i]
          if(param.item == undefined || param.item.length == 0){
             paramerror[`${i}`][`item`] = "Please Select Item"
            hasError = true;
          }
           if(param.quantity == null || param.quantity == ""){
              paramerror[`${i}`][`quantity`] = "Please Enter Quantity"
            hasError = true;
          }
          // if(param.warrantyDate == null || param.warrantyDate == ""){
          //    paramerror[`${i}`][`warranty`] = "Please Select Warranty Date"
          //   hasError = true;
          // }
          else{
            const itemId = param.item[0].Text
            const serials = param.serialNumbers.map((s: any) => s.trim()).filter((s: any) => s.length > 0);
            if (!itemSerialTracker.has(itemId)) {
              itemSerialTracker.set(itemId, new Set());
            }
            const existingSerials = itemSerialTracker.get(itemId);
            for (const serial of serials) {
              if (existingSerials.has(serial)) {
                   paramerror[`InwardError`] = `Duplicate serial number "${serial}" found for item "${param.item[0]?.Text}"`
                hasError = true;
              } else {
                existingSerials.add(serial);
              }
            }
          }
        }
      }
      this.error = paramerror;
      if (hasError) {
        return;
       }
       let subOrg = this.hierarchyChild.getDropdownSelected('organization') ? this.hierarchyChild.getDropdownSelected('organization')[0]?.Value : undefined
       let branch = this.hierarchyChild.getDropdownSelected('branch') ? this.hierarchyChild.getDropdownSelected('branch')[0]?.Value : undefined
       let dept =   this.hierarchyChild.getDropdownSelected('department') ? this.hierarchyChild.getDropdownSelected('department')[0]?.id : undefined
       let json :any = {
          supplierName: this.inwardData.invoice.supplierName,
          purchasedByName: this.inwardData.invoice.purchasedBy,
          invoiceNumber: this.inwardData.invoice.invoiceNumber,
          referenceNumber: this.inwardData.invoice.referenceNumber,
          invoiceDate: this.inwardData.invoice.invoiceDate,
          createdBy: this.reduxService.UserID,
          "mapping": {
            "orgId": parseInt(this.ORGId),
            "SubOrgId":subOrg,
            "branchId": branch,
            "departmentId": dept,
          },
          SoftwareId: 8,
          stock: this.inwardData.items.map((item:any)=>{
            let obj:any = {
              itemId:item.item[0].Value,
              quantity:item.quantity,
              modelNumber:item.modelNumber,
              serialNumbers:item.serialNumbers,
            }
            if(item.stockId) obj['stockId'] = item.stockId
            if(item.warrantyDate) obj['warrantyDate'] = item.warrantyDate
            return obj
          })
          
      }
      if(!this.IsEdit){
        this.assetService.PostMethod('assetMgnt/invoice/add',json).subscribe((res:any)=>{
          if(res.data){
          this.globalToastService.success(res.message)
          this.backtolist()
          }
          this.spinnerService.hide()
        },(error)=>{
          this.spinnerService.hide()
          this.globalToastService.error(error.error.message)
        })
      }else{
        if(this.inwardData.invoice.id) json['invoiceId'] = this.inwardData.invoice.id
        this.assetService.PostMethod('assetMgnt/invoice/update',json).subscribe((res:any)=>{
          this.globalToastService.success(res.message)
          this.backtolist()
          this.spinnerService.hide()
        },(error)=>{
          this.spinnerService.hide()
          this.globalToastService.error(error.error.message)
        })
      }
  }

  getAssets() {
    this.spinnerService.show()
    let json = {
      SoftwareId: 8,
      mapping:{
        orgId:parseInt(this.ORGId),
      },
    }
    this.assetService.PostMethod('assetMgnt/item/get',json).subscribe((res:any)=>{
      this.itemList = []
      this.itemListKV = {}

      if(res.data && res.data.length>0){
        this.itemList = res.data.map((itemElement:any,item_i:any)=>{
          this.itemListKV[itemElement._id] = itemElement
          return {Text:itemElement.name,Value:itemElement._id}
        })
      }
      this.spinnerService.hide()
    },(error)=>{
      this.spinnerService.hide()
      this.globalToastService.error(error.error.message)
    })
  }

  addSerialNumber(item_i:any){
    if(this.inwardData.items[item_i].serialNumbers != this.serialNumber){
      if(!(this.inwardData.items[item_i].serialNumbers)) this.inwardData.items[item_i].serialNumbers = []
      this.inwardData.items[item_i].serialNumbers.push(this.inwardData.items[item_i].serialNumber)
      this.inwardData.items[item_i].serialNumber = ""
    }
  }

  removeDetails(index: number): void {
    this.inwardData.items.splice(index, 1);
  }

  removeSerialnumber(item:any,index:number){
    this.inwardData.items[item].serialNumbers.splice(index,1)
  }
  backtolist() {
    this._route.navigate(['Asset/stock/inward/list'])
  }
  
}
