import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from '../../../../services/httpcommon.service';
import { PdfExportService } from '../../../../services/pdf-export.service';
import { AssetService } from 'src/app/services/assets.service';
import { JsonPipe } from '@angular/common';
import { AnyFn } from '@ngrx/store/src/selector';
import { ReduxService } from 'src/app/services/redux.service';
import { HierarchyComponent } from 'src/app/pages/hierarchy/hierarchy.component';

@Component({
  selector: 'app-asset-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit, AfterViewInit,OnChanges {

  @Input() showAssignType : any
  @Input() showAssignData : any
  @Output() close = new EventEmitter<void>()
  EmployeeList: any[] = [];
  BranchList: any[] = []; UserID: any
  DepartmentList: any;
  branchSettings: IDropdownSettings = {}
  departmentSettings: IDropdownSettings = {}
  employeeSettings: IDropdownSettings = {}
  documentSettings: IDropdownSettings = {}
  serialsettings: IDropdownSettings = {}
  modelsettings: IDropdownSettings = {}
  temparray: any = []; tempdeparray: any = [];
  selectedDepartment: any[] = [];
  selectedEmployees: any[] = []
  selectedBranch: any[] = []
  selectedDocuments: any[] = []
  AdminID: any
  ApiURL: any
  ORGId: any
  AssetsDetails: any[] = [];
  CheckAssetsDetails: any[] = [];
  ModelNumberData: string[] = [];
  showDetails: boolean = false
  AssetList: any = []
  SerialNumberList: any = []
  AssetListKV: any = []
  assetSettings: IDropdownSettings = {}
  steps: any = []
  @ViewChild(MatStepper) stepper!: MatStepper;
  edit: boolean = false;
  serialNumber: any;
  AssetName: any
  ModelNumber: any
  Quantity: any
  SerialNumber: any
  UnitOfMeasurement: any
  RemainingQuantity: any
  AssignedQuantity: any
  showModelNumberSuggestions: boolean[] = [];
  showSerialNumberSuggestions: boolean[] = [];
  public isDrawerOpen: boolean = false;
  drawerOpened: boolean = false;
  AssetId: any
  selectedOrganization: any[] = []
  SubOrgList: any[] = []
  orgSettings: IDropdownSettings = {}
  hirearchyActions: any[] = []
  selectedFilterData: any
  @ViewChild(HierarchyComponent) hierarchyChild!: HierarchyComponent;
  dropDownExtras: any
  error: any = {}
  constructor(private pdfExportService: PdfExportService, private spinnerService: NgxSpinnerService,
    private _route: Router, private _commonservice: HttpCommonService, private assetService: AssetService,
    private globalToastService: ToastrService, private _httpClient: HttpClient,
    private cdr: ChangeDetectorRef, private reduxService: ReduxService) {
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
      enableCheckAll: false
    };
    this.departmentSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.assetSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.serialsettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.modelsettings = {
      singleSelection: true,
      idField: 'modelNumber',
      textField: 'modelNumber',
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
    if (this.showAssignType == "Edit") {
      this.edit = true
      this.bindData()
    }
    if (this.showAssignType == "Create") {
      this.edit = false
    }
    this.steps = [false, false]
    // this.hirearchyActions = ['Search']
    this.dropDownExtras = {
      employee: {
        isActive: true,
        settings: {
          singleSelection: true
        }
      }
    }
  }
  ngAfterViewInit(): void {
    // this.loadFilterData()
  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");

    this.getAssets()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['showAssignType'].currentValue){
      if (this.showAssignType == "Create") {
        this.initializeInwardData()
      }
    }
  }


  

  // loadFilterData() {
  //   let temp = localStorage.getItem('HirearchyData')
  //   this.hierarchyChild?.dropDownData['organization'].data
  //   if (temp) this.selectedFilterData = JSON.parse(temp);
  // }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.autocomplete-container')) {
      this.showModelNumberSuggestions = this.showModelNumberSuggestions.map(() => false);
      this.showSerialNumberSuggestions = this.showSerialNumberSuggestions.map(() => false);
    }
  }
  @ViewChild('drawer') drawer: any;
  drawerOpen() {
    this.drawer.open();
    this.drawerOpened = true;
  }
  closeDrawer() {
    this.drawer.close();
    this.drawerOpened = false;
  }
  onItemSelected(event: any, item_i: any) {
    this.AssetsDetails[item_i].itemDetails = this.AssetListKV[event.Value]
    this.getModelNumbers(event, item_i)
  }
  onItemDeSelect(event: any, item_i: any) {
    this.AssetsDetails[item_i].item = {}
    this.AssetsDetails[item_i].ModelNumberList = []
  }
  onModelSelected(event: any, item_i: any) {
  }
  onModelDeSelect(event: any, item_i: any) {
  }
  getModelNumbers(event: any, index: any) {
    let json = {
      "itemId": event.Value,
      "SoftwareId": 8,
      "mapping": {
        "orgId": parseInt(this.ORGId),
      },
      // "createdBy": parseInt(this.res)
    }
    this.assetService.PostMethod('assetMgnt/stock/getModelNumbers', json).subscribe((res: any) => {
      this.AssetsDetails[index].ModelNumberList = res.data
      this.AssetsDetails[index].OriginalModelNumberList = res.data
    }, (error) => {
    })
  }
  getSerialNumbers(modelnumber: any, index: any, item: any) {
    let json = {
      "itemId": item,
      "modelNumber": modelnumber,
      "SoftwareId": 8,
      "mapping": {
        "orgId": parseInt(this.ORGId),
      },
      // "createdBy": parseInt(this.AdminID)
    }
    console.log(json, "get serial umenenj");
    this.assetService.PostMethod('assetMgnt/stock/getSerialNumbers', json).subscribe((res: any) => {
      this.AssetsDetails[index].SerialNumberList = res.data[0].serialNumbers
      this.AssetsDetails[index].OriginalSerialNumberList = res.data[0].serialNumbers
    }, (error) => {
    })
  }
  editModelNumber(index: any) {
    const asset = this.AssetsDetails[index];
    if (!asset) return;
    if (!asset.OriginalModelNumberList) {
      asset.OriginalModelNumberList = Array.isArray(asset.ModelNumberList) ? [...asset.ModelNumberList] : [];
    }
    if (asset.modelNumbers?.trim()) {
      const filterValue = asset.modelNumbers.toLowerCase();
      asset.ModelNumberList = asset.OriginalModelNumberList.filter((unit: any) =>
        unit?.modelNumber?.toLowerCase().includes(filterValue)
      );
      asset.SerialNumberList = [];
      asset.OriginalSerialNumberList = [];
    } else {
      asset.ModelNumberList = [...asset.OriginalModelNumberList];
    }
    this.showModelNumberSuggestions[index] = true;
  }
  selectModelNumber(unit: any, index: any, item: any) {
    this.AssetsDetails[index].modelNumbers = unit.modelNumber
    this.AssetsDetails[index].ModelNumberList = [];
    this.showModelNumberSuggestions[index] = false;
    this.getSerialNumbers(unit.modelNumber, index, item.item[0].Value)
  }
  editSerialNumber(index: any) {
    const asset = this.AssetsDetails[index];
    if (!asset) return;
    if (!asset.OriginalSerialNumberList) {
      asset.OriginalSerialNumberList = Array.isArray(asset.SerialNumberList) ? [...asset.SerialNumberList] : [];
    }
    if (asset.serialNumbers?.trim()) {
      const filterValue = asset.serialNumbers.toLowerCase();
      asset.SerialNumberList = asset.OriginalSerialNumberList.filter((unit: any) =>
        unit?.toLowerCase().includes(filterValue)
      );
    } else {
      asset.SerialNumberList = [...asset.OriginalSerialNumberList];
    }
    this.showSerialNumberSuggestions[index] = true;
  }
  selectSerialNumber(unit: any, index: any, item: any) {
    this.AssetsDetails[index].serialNumbers = unit
    this.AssetsDetails[index].SerialNumberList = [];
    this.showSerialNumberSuggestions[index] = false;
  }
  initializeInwardData() {
    this.addItemRow()
  }
  addItemRow() {
    this.AssetsDetails.push({
      item: [],
      quantity: '',
      SerialNumberList: [],
      ModelNumberList: [],
      serialNumbers: '',
      modelNumbers: '',
      returnType: "",
    })

  }
  bindData() {
    this.AssetsDetails = []
    this.AssetId = this.showAssignData.assignmentId
    const assignedItems = this.showAssignData.data || {};
    if (Object.keys(assignedItems).length === 0) {
      this.AssetsDetails = [];
      return;
    }
    this.AssetsDetails = [{
      key: assignedItems.key,
      item: [{ Value: assignedItems.itemId, Text: assignedItems.name }],
      quantity: assignedItems?.quantity || 0,
      serialNumbers: assignedItems.details?.serialNumber || "N/A", // Fix: Access serialNumber inside details
      modelNumbers: assignedItems.details?.modelNumber || "N/A", // Fix: Access modelNumber inside details
      itemDetails: assignedItems
    }];
    this.CheckAssetsDetails = JSON.parse(JSON.stringify(this.AssetsDetails))
  }
  viewDetails(index: any, item: any) {
    this.showDetails = true
    this.AssetName = item.item[0]?.Text
    this.ModelNumber = item?.modelNumbers
    this.SerialNumber = item?.serialNumbers
    this.Quantity = item?.quantity
    this.UnitOfMeasurement = item.itemDetails.measurement
    this.getQuantityCounts(item)

  }
  getQuantityCounts(item: any) {
    let json = {
      "SoftwareId": 8,
      "mapping": {
        "orgId": parseInt(this.ORGId),
      },
      "itemId": item.item[0]?.Value
    }
    this.assetService.PostMethod('assetMgnt/item/count', json).subscribe((res: any) => {
      this.RemainingQuantity = res.data.remainingQuantity
      this.AssignedQuantity = res.data.assignedCount
    }, (error) => {
      this.globalToastService.error(error.error.message)
    })
  }
  removeDetails(index: number): void {
    this.AssetsDetails.splice(index, 1);
  }
  getAssets(page:number = 1) {
    let json = {
      // "createdBy": parseInt(this.AdminID),
      "SoftwareId": 8,
      "mapping": {
        "orgId": parseInt(this.ORGId),
      },
      page
    }
    this.assetService.PostMethod('assetMgnt/item/get', json).subscribe((res: any) => {
      if(page == 1) this.AssetList = []
      this.AssetListKV = {}
      if (res.data && res.data.length > 0) {
        this.AssetList = [...this.AssetList, ...res.data.map((itemElement: any, item_i: any) => {
          this.AssetListKV[itemElement._id] = itemElement
          return { Text: itemElement.name, Value: itemElement._id }
        })]
        if(res.nextPage == true){
          this.getAssets(page+1)
        }
      }
    }, (error) => {
      this.globalToastService.error(error.error.message)
    })
  }

  isStepValid(step: number) {
    return this.steps[step] || false;
  }
  validateSteps(step: number) {
    this.cdr.detectChanges()
    if (step == 0) {
      this.steps[0] = this.validateUserDetails()
      console.log(this.steps[0]);
      if (this.steps[0] == true ) this.stepper.selectedIndex = 1
    }
    else if (step == 1) {
      this.steps[1] = true
      console.log(this.steps[0]);
      if (this.steps[1] == true) {
        this.stepper.selectedIndex = 2
      }
    }
  }


  validateUserDetails():boolean{
    let selectedData = this.hierarchyChild.getAllSelectedData()
    if(selectedData.employee.length>0){
      this.hierarchyChild.dropDownData.employee['errorString']=""
      return true
    }
    this.hierarchyChild.dropDownData.employee['errorString']="Please select minimum one employee"
    return false
  }

  goToPreviousStep() {
    this.stepper.previous();
  }

  onSubmit() {
    let hasError = false;
    let paramerror: any = {}
    if (this.AssetsDetails.length > 0) {
      for (let i = 0; i < this.AssetsDetails.length; i++) {
        paramerror[`${i}`] = {}
        let param = this.AssetsDetails[i]
        if (param.item == undefined || param.item.length == 0) {
          paramerror[`${i}`][`item`] = "Please Select Item"
          hasError = true;
        }
        if (param.quantity == null || param.quantity == "") {
          paramerror[`${i}`][`quantity`] = "Please Enter Quantity"
          hasError = true;
        }
        // if (param.modelNumbers == null || param.modelNumbers == "") {
        //   paramerror[`${i}`][`model`] = "Please Enter Model Number"
        //   hasError = true;
        // }
        // if (param.serialNumbers == null || param.serialNumbers == "") {
        //   paramerror[`${i}`][`serial`] = "Please Enter Serial Number"
        //   hasError = true;
        // }
      }
    }
    this.error = paramerror;
    if (hasError) {
      return;
    }
    let subOrg = this.hierarchyChild.getDropdownSelected('organization') ? this.hierarchyChild.getDropdownSelected('organization')[0]?.Value : undefined
    let branch = this.hierarchyChild.getDropdownSelected('branch') ? this.hierarchyChild.getDropdownSelected('branch')[0]?.Value : undefined
    let dept = this.hierarchyChild.getDropdownSelected('department') ? this.hierarchyChild.getDropdownSelected('department')[0]?.id : undefined
    let emp = this.hierarchyChild.getDropdownSelected('employee') ? this.hierarchyChild.getDropdownSelected('employee')[0]?.ID : undefined
    let json = {
      "SoftwareId": 8,
      "mapping": {
        "orgId": this.assetService.ORGId,
        // "SubOrgId": subOrg,
        "userId": emp,
        // "branchId": branch,
        // "departmentId": dept,
      },
      // "orgId": parseInt(this.ORGId),
      "createdBy": parseInt(this.reduxService.UserID),
      "assignedItems": this.AssetsDetails.map((res: any) => {
        let assignedItem: any = {};
        if (res.item && res.item.length > 0) {
          assignedItem["itemId"] = res.item[0].Value;
        }
        if (res.modelNumbers) {
          assignedItem["modelNumber"] = res.modelNumbers;
        }
        if (res.serialNumbers) {
          assignedItem["serialNumber"] = res.serialNumbers;
        }
        if (res.quantity) {
          assignedItem["quantity"] = res.quantity;
        }

        return assignedItem;
      })
    };
    console.log(json, "jdvbhshdsh");

    this.assetService.PostMethod('assetMgnt/assign/asset/item/user', json).subscribe(
      (res: any) => {
        this.globalToastService.success(res.message);
        this.backtolist();
      },
      (error) => {
        this.globalToastService.error(error.error.message);
      }
    );
  }



  onUpdate() {
    let branch = this.hierarchyChild.getDropdownSelected('branch') ? this.hierarchyChild.getDropdownSelected('branch')[0]?.Value : undefined
    let dept = this.hierarchyChild.getDropdownSelected('department') ? this.hierarchyChild.getDropdownSelected('department')[0]?.id : undefined
    let emp = this.hierarchyChild.getDropdownSelected('employee') ? this.hierarchyChild.getDropdownSelected('employee')[0]?.ID : undefined

    const hasEmptyNewItem = this.AssetsDetails.some((res: any) => {
      return !res.key && (!res.item || res.item.length === 0 || !res.item[0]?.Value);
    });

    if (hasEmptyNewItem) {
      this.globalToastService.warning("Please add an item to proceed");
      return;
    }

    const updatedItems = this.AssetsDetails.filter((res: any, index: number) => {
      const original = this.CheckAssetsDetails[index];
      if (!original) return true;

      return (
        res.quantity !== original?.quantity ||
        res.serialNumbers !== original?.serialNumbers ||
        res.modelNumbers !== original?.modelNumbers
      );
    }).map((res: any, index: number) => {
      const original = this.CheckAssetsDetails[index];
      const itemData: any = {};

      if (res.key) {
        itemData.key = res.key;
      }

      if (res.quantity !== original?.quantity &&
        res.serialNumbers === original?.serialNumbers &&
        res.modelNumbers === original?.modelNumbers) {
        itemData.quantity = res.quantity;
        return itemData;
      }

      if (res.quantity !== original?.quantity) itemData.quantity = res.quantity;
      if (res.serialNumbers !== original?.serialNumbers) itemData.serialNumber = res.serialNumbers;
      if (res.modelNumbers !== original?.modelNumbers) itemData.modelNumber = res.modelNumbers;
      itemData.itemId = res.item[0]?.Value;

      return itemData;
    });

    if (updatedItems.length > 0) {
      let json = {
        SoftwareId: 8,
        createdBy: parseInt(this.reduxService.UserID),
        "mapping": {
          "orgId": parseInt(this.ORGId),
          "userId": emp,
          "branchId": branch,
          "departmentId": dept,
        },
        _id: this.AssetId,
        assignedItems: updatedItems,
      };

      console.log(json, "edit data");
      this.assetService.PostMethod('assetMgnt/assign/asset/item/edit', json).subscribe((res: any) => {
        this.globalToastService.success(res.message)
        this.backtolist()
      }, (error) => {
        this.globalToastService.error(error.error.message)
      })
    } else {
      this.globalToastService.warning("Please make desired changes to update");
    }
  }

  backtolist() {
    // if(this.showAssignType == "Create"){
    // this._route.navigate(['Asset/assign/list'])
    // }else if(this.showAssignType == "Edit"){
    // this._route.navigate(['Asset/assign/list'])
    // }
    this.close.emit()
  }

  triggerHierarchyAction(event: any) {
    if (event.action == 'Search') {
      // localStorage.setItem('HirearchyData', JSON.stringify(event.data))
    }
  }
}


