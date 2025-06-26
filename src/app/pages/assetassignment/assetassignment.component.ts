import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-assetassignment',
  templateUrl: './assetassignment.component.html',
  styleUrls: ['./assetassignment.component.css']
})
export class AssetassignmentComponent {
 AssetList:any[]=[]
  datalist:any[]=[
    {
      "AssetName":"Laptop",
      "AssetType":"Hardware",
      "ModelNumber":"1019101910",
      "UnitOfMeasurement":"1",
      "CreatedBy":"Mohit D",
      "CreatedOn":"19-Feb-2025",
    },
    {
      "AssetName":"Biometric",
      "AssetType":"Machines",
      "ModelNumber":"1019101910",
      "UnitOfMeasurement":"1",
      "CreatedBy":"Mohit D",
      "CreatedOn":"19-Feb-2025",
    }
  ]
  //common table
  actionOptions: any
  orginalValues: any = {}
  displayColumns: any
  displayedColumns: any
  employeeLoading: any;
  editableColumns: any = []
  ReportTitles: any = {}
  selectedRows: any = [];
  commonTableOptions: any = {}
  tableDataColors: any;
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  ORGId: any
  AdminID: any
  UserID: any
  constructor( private _route: Router, private spinnerService: NgxSpinnerService, private docservice: DirectoryService,
    private globalToastService: ToastrService, private _httpClient: HttpClient,
    private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    //common table
    // this.actionOptions = [

    // ]
    // this.displayColumns = {
    //   "AssetName": "ASSET NAME",
    //   "AssetType": "ASSET TYPE",
    //   "ModelNumber": "MODEL NUMBER",
    //   "UnitOfMeasurement": "UNIT OF MEASUREMENT",
    //   "CreatedBy": "CREATED BY",
    //   "CreatedOn": "CREATED ON",
    // },
    //   this.displayedColumns = [
    //     "AssetName",
    //     "AssetType",
    //     "ModelNumber",
    //     "UnitOfMeasurement",
    //     "CreatedBy",
    //     "CreatedOn",
    //   ]

  }
  ngOnInit() {
    this.ORGId = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.getAssets()
  }

  getAssets() {

  }
  assetAssign(){
    this._route.navigate(["/Asset/Assignment/Assign"]);
  }

  backToAssets(){
    this._route.navigate(["/Asset"]);
  }
  //common table
  actionEmitter(data: any) {
  }
  //ends here
}
