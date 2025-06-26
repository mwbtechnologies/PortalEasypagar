import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AssetService } from 'src/app/services/assets.service';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { ReduxService } from 'src/app/services/redux.service';

@Component({
  selector: 'app-asset-item-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AssetItemAddComponent {
  AssetTypeList: any[] = []
  originalAssetList: any[] = []
  SelectedAssetType: any = ''
  SelectedAssetTypeid:any
  assetTypeSettings: IDropdownSettings = {}
  ReturnTypeList: any[];
  SelectedReturnType: any[] = []
  ReturnTypeSettings: IDropdownSettings = {}
  MeasureTypeList: any[] = ['Quantity', 'Serial Number']
  SelectedMeasureType: any[] = []
  MeasureTypeSettings: IDropdownSettings = {}
  AssetName: any
  ModelNumber: any
  UnitOfMeasurement: any
  searchText: string = '';
  filteredUnits: string[] = [];
  originalunits: string[] = ["pcs", "kg", "set", "mtr", "ltr", "ft"];
  isEdit: boolean
  // filteredUnits: string[] = [];
  ORGId: any
  AdminID: any
  MeasurementType: any
  showmeasurements: boolean = false;
  showAssetTypes: boolean = false;
  errors: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private assetService: AssetService, private spinnerService: NgxSpinnerService, private toastr: ToastrService, public dialogRef: MatDialogRef<AssetItemAddComponent>, private reduxService:ReduxService) {
    this.isEdit = this.data.isEdit || false,
      this.AssetName = this.data.row?.name || '',
      this.ModelNumber = this.data.row?.modelNumber || '',
      this.searchText = this.data.row?.measurement || '',
      this.SelectedReturnType = this.data.row?.returnType ? [this.data.row?.returnType] : [],
      this.SelectedMeasureType = [this.data.row?.measurementType],
      // this.SelectedAssetType = [this.data.row?.category,
      this.MeasurementType = this.data.row?.measurementType || ''
    this.assetTypeSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'name',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.ReturnTypeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.MeasureTypeSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.filteredUnits = [...this.originalunits];
    this.AssetTypeList = JSON.parse(JSON.stringify(this.originalAssetList));
    this.ReturnTypeList = assetService.returnTypes

  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    console.log(this.data.row, "row data");
    this.getAssetTypeList()
  }
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: Event) {
      if (!(event.target as HTMLElement).closest('.autocomplete-container')) {
       this.showmeasurements = false;
       this.showAssetTypes = false
      }
    }

  getAssetTypeList() {
    let json = {
      "SoftwareId": 8,
      // "createdBy": parseInt(this.AdminID),
      "mapping":{
        "orgId": parseInt(this.ORGId),
      }
    }
    this.assetService.PostMethod('assetMgnt/category/get', json).subscribe((res: any) => {
      this.AssetTypeList = res.data
      this.originalAssetList = JSON.parse(JSON.stringify(this.AssetTypeList))
      if (this.isEdit) {
        const selectedCategory = this.AssetTypeList.find(
          (item: any) => item._id === this.data.row?.category
        );
        if (selectedCategory) {
          this.SelectedAssetType = selectedCategory.name;
        }
      }
    }, (error) => {
      // this.toastr.error(error.error.message)
    })
  }
  editUnits() {
    if (!this.searchText.trim()) {
      this.filteredUnits = [...this.originalunits];
      this.showmeasurements = true;
      return;
    }
    const filterValue = this.searchText.toLowerCase();
    this.filteredUnits = this.originalunits.filter(unit =>
      unit.toLowerCase().includes(filterValue)
    );
    this.showmeasurements = this.filteredUnits.length > 0;
  }
  
  selectUnit(unit: any) {
    this.searchText = unit
    this.filteredUnits = [];
    this.showmeasurements = false
  }

  editAssetTypes() {
    console.log("editAssetTypes",this.SelectedAssetType);
    if (!this.originalAssetList) {
      this.originalAssetList = Array.isArray(this.AssetTypeList) ? [...this.AssetTypeList] : [];
    }
    if (this.SelectedAssetType?.trim()) {
      const filterValue = this.SelectedAssetType.toLowerCase();
      this.AssetTypeList = this.originalAssetList.filter((unit: any) =>
        unit?.name.toLowerCase().includes(filterValue)
      );
    } else {
      this.AssetTypeList = [...this.originalAssetList];
    }
    this.showAssetTypes = true;
  }

  
  selectAssetTypes(unit: any) {
    this.SelectedAssetType = unit.name
    this.SelectedAssetTypeid = unit._id
    this.originalAssetList = [];
    this.showAssetTypes = false
  }

  addAsset(){
    this.errors = {}; 
    let errorCount = 0
    if(this.AssetName.length == 0){
      // this.toastr.warning("Please Enter Asset Name")
      this.errors.AssetName = "Please Enter Asset Name";
      errorCount+=1
    }
    if(this.SelectedAssetType.length == 0){
      // this.toastr.warning("Please Select Asset Type")
      this.errors.AssetType = "Please Select Asset Type";
      errorCount+=1
    }
    if(this.searchText.length == 0){
      // this.toastr.warning("Please Select Measurement Type")
      this.errors.Measurement = "Please Select Measurement Type";
      errorCount+=1
    }
    console.log(this.SelectedReturnType);
    
    if(this.SelectedReturnType.length == 0){
      // this.toastr.warning("Please Select Measurement Type")
      this.errors.ReturnType = "Please Select Return Type";
      errorCount+=1
    }

    if(errorCount==0){
      const isAlreadyExist = this.AssetTypeList.some(
        (asset: any) => asset.name === this.SelectedAssetType
      );
      if(!isAlreadyExist){
        let json = {
        "name": this.SelectedAssetType,
        "SoftwareId": 8,
        "createdBy": this.reduxService.UserID,
         "mapping":{
          "orgId": parseInt(this.ORGId),
         } 
        }
        console.log(json, "addcategory")
         this.assetService.PostMethod('assetMgnt/category/add', json).subscribe((res: any) => {
          if(res.status == 200){
            this.SelectedAssetTypeid = res.data.insertedId
            if (this.isEdit) {
              this.editAsset()
            } else{
              this.saveAsset()
            }
          }
        }, (error) => {
        })
      }
      else{
        if (this.isEdit) {
          this.editAsset()
        } else{
          this.saveAsset()
        }
      }
    }
  }
  saveAsset() {
    this.spinnerService.show()
    let json = {
      "name": this.AssetName,
      "measurement": this.searchText,
      "returnType":this.SelectedReturnType[0]?.id,
      "category": this.SelectedAssetTypeid,
      "SoftwareId": 8,
      "createdBy": parseInt(this.reduxService.UserID),
      "mapping":{
      "orgId":parseInt(this.ORGId),
      }
    }
    console.log(json, "addasset");
    this.assetService.PostMethod('assetMgnt/item/add', json).subscribe((res: any) => {
      this.toastr.success(res.message)
      this.spinnerService.hide()
      this.dialogRef.close(json)
    }, (error) => {
      this.toastr.error(error.error.message)
      this.spinnerService.hide()
    })
  }
  editAsset() {
    this.spinnerService.show()
    let json = {
      "itemId": this.data.row._id,
      "name": this.AssetName,
      "measurement": this.searchText,
      "returnType":this.SelectedReturnType[0].id,
      "category": this.SelectedAssetTypeid,
      "SoftwareId": 8,
      "createdBy": parseInt(this.reduxService.UserID),
      "mapping":{
      "orgId":parseInt(this.ORGId),
      }
    }
    console.log(json, "editasset");
    this.assetService.PostMethod('assetMgnt/item/update', json).subscribe((res: any) => {
      this.toastr.success(res.message)
      this.spinnerService.hide()
      this.dialogRef.close({json})
    }, (error) => {
      this.toastr.error(error.error.message)
    })
  }

  closeAsset() {
    this.dialogRef.close()
  }

}
