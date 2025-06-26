import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
declare const GetInfo: any;
import { Subject } from 'rxjs';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import * as XLSX from 'xlsx';
import { CommonTableComponent } from '../common-table/common-table.component';
import { ShowalertComponent } from './showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LeavesettingComponent } from './leavesetting/leavesetting.component';

declare var google: any;
export class FormInput {
  Name: any;
  OrgID: any;
  Address: any;
  City: any;
  State: any;
  Latitude: any;
  Longitude: any;
  FromTime: any;
  ToTime: any;
}

@Component({
  selector: 'app-branch-master',
  templateUrl: './branch-master.component.html',
  styleUrls: ['./branch-master.component.css']
})
export class BranchMasterComponent implements OnInit {
  public lat = 15.3583616;
  public lng = 75.1403008;
  // private geoCoder:any;
  geocoder: any;
  public origin: any;
  public destination: any;
  latitude: any;
  longitude: any;
  curlatitude: any;
  curlongitude: any;
  GetLocations: any; zoom: any
  source: any;
  destiny: any;
  @ViewChild('search') public searchElementRef: ElementRef | any;
  formInput: FormInput | any;
  public isSubmit: boolean;
  Editdetails: any;
  editid: any;
  Add = false;
  Edit = false;
  View = true; AdminID: any; OrgID: any;
  BranchList: any; DepartmentList: any; ApiURL: any;
  selectedBranchId: string[] | any; selectedDepartmentId: string[] | any;
  institutionsList: any;
  selectedCityId: string[] | any;
  dtExportButtonOptions: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  file: File | any; ImageUrl: any; ShowImage = false;
  StateList: any;
  CityList: any; Length: any; UserID: any;
  AddPermission: any; EditPermission: any; ViewPermission: any; DeletePermission: any;
  compolength: any;

  timeFormat: any;

  //common table
  actionOptions: any
  displayColumns: any
  displayedColumns: any
  employeeLoading: any;
  editableColumns: any = []
  topHeaders: any = []
  headerColors: any = []
  smallHeaders: any = []
  ReportTitles: any = {}
  selectedRows: any = []
  commonTableOptions: any = {}
  ShowBtn: boolean = false
  selectedOrganization: any[] = []
  OrgList: any[] = []
  orgSettings: IDropdownSettings = {}
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;

  constructor(private dialog: MatDialog, public mapsApiLoader: MapsAPILoader, private pdfExportService: PdfExportService, private zone: NgZone, private _router: Router, private globalToastService: ToastrService, private spinnerService: NgxSpinnerService, private _commonservice: HttpCommonService) {
    this.zone = zone;
    this.isSubmit = false;
    this.orgSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    //this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
    //common table
    this.actionOptions = [
      {
        name: "View Edit",
        icon: "fa fa-edit",
        filter: [
          { field: 'IsActive', value: true }
        ],
      },
      {
        name: "Deactivate",
        icon: "fa fa-times",
        filter: [
          { field: 'IsActive', value: true }
        ],
      },
      {
        name: "Activate",
        icon: "fa fa-check",
        filter: [
          { field: 'IsActive', value: false }
        ],
      },
      // {
      //   name: "Leave Configure",
      //   icon: "fa fa-gear",
      // }
    ];

    this.displayColumns = {
      // SelectAll: "SelectAll",
      "SLno": "SL No",
      "SubOrgname": "SUB ORGANIZATION",
      "BranchName": "BRANCH NAME",
      "State": "STATE",
      "City": "CITY",
      "Address": "ADDRESS",
      "WorkStartTime": "WORK START TIME",
      "WorkEndTime": "WORK END TIME",
      "CreatedDate": "CREATED DATE",
      "Actions": "ACTIONS"
    },


      this.displayedColumns = [
        "SLno",
        "SubOrgname",
        "BranchName",
        "State",
        "City",
        "Address",
        "WorkStartTime",
        "WorkEndTime",
        "CreatedDate",
        "Actions"
      ]

    this.editableColumns = {
      // "HRA":{
      //   filters:{}
      // },
    }

    this.topHeaders = [
      {
        id: "blank1",
        name: "",
        colspan: 6
      },
      {
        id: "Officetimings",
        name: "OFFICE TIMINGS",
        colspan: 2
      },
      {
        id: "blank2",
        name: "",
        colspan: 2
      }
    ]

    this.headerColors = {
      // Deductions : {text:"#ff2d2d",bg:"#ffd5d5"},
    }
    //ends here
  }
  formattedAddress = '';
  formattedAddress1 = '';
  formattedAddress2 = '';

  ngOnInit(): void {
    this.zoom = 8;
    this.ImageUrl = "";
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
    this.UserID = localStorage.getItem("UserID");
    if (this.AdminID == null || this.AdminID == "" || this.OrgID == undefined || this.OrgID == null || this.OrgID == "" || this.AdminID == undefined) {
      this._router.navigate(["auth/signin-v2"]);
    }
    this.formInput = {
      Name: '',
      OrgID: '',
      Address: '',
      City: '',
      State: '',
      Latitude: '',
      Longitude: '',
      FromTime: '',
      ToTime: ''
    };
    this.dtExportButtonOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'excel',
        'csv'
      ]
    };
    this.formInput.OrgID = this.OrgID;
    this.GetBranchList();
    // this._commonservice.ApiUsingGetWithOneParam("Admin/GetStateList").subscribe((data) => this.StateList = data.List, (error) => {
    //   this.ShowAlert(error); console.log(error);
    // });
    this.AddPermission = localStorage.getItem("AddPermission"); if (this.AddPermission == "true") { this.AddPermission = true; } else { this.AddPermission = false; }
    this.EditPermission = localStorage.getItem("EditPermission"); if (this.EditPermission == "true") { this.EditPermission = true; } else { this.EditPermission = false; }
    this.ViewPermission = localStorage.getItem("ViewPermission"); if (this.ViewPermission == "true") { this.ViewPermission = true; } else { this.ViewPermission = false; }
    this.DeletePermission = localStorage.getItem("DeletePermission"); if (this.DeletePermission == "true") { this.DeletePermission = true; } else { this.DeletePermission = false; }
    this.getTimeFormat()
  }

  onselectedOrg(item: any) {

  }
  onDeselectedOrg(item: any) {

  }
  GetOrganization() {
    this.ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((data) => {
      this.OrgList = data.List
      if (data.List.length == 1) {
        this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
        this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
      }
    }, (error) => {
      this.ShowAlert(error, "error")
      console.log(error);
    });
  }

  getTimeFormat() {
    this.timeFormat = 24;
    let TimeFormat: boolean = Boolean(localStorage.getItem("TimeFormat"))
    if (TimeFormat == true) {
      this.timeFormat = 12
    }
  }

  public setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.curlatitude = position.coords.latitude;
        this.curlongitude = position.coords.longitude;
        this.formInput.Latitude = position.coords.latitude;
        this.formInput.Longitude = position.coords.longitude;
        if (this.formInput.Latitude == null || this.formInput.Latitude == undefined) {
          this.formInput.Latitude = 15.35558737035252;
        }
        if (this.formInput.Longitude == null || this.formInput.Longitude == undefined) {
          this.formInput.Longitude = 75.13571665276675;
        }

        this.zoom = 8;

        this.getAddress(this.formInput.Latitude, this.formInput.Longitude);
      });
    }
  }
  backForAdd() {
    this.Add = false
    this.View = true
  }
  backForEdit() {
    this.Edit = false
    this.View = true
  }
  getAddress(latitude: any, longitude: any) {
    this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.compolength = 0;
          this.compolength = results[0].address_components.length;
          if (this.compolength > 0) {
            this.formInput.State = results[0].address_components[this.compolength - 3].long_name;
            this.formInput.City = results[0].address_components[this.compolength - 4].long_name;

          }

          this.formInput.Address = results[0].formatted_address;
          // this.ApiURL="Admin/GetStateCity?Address="+ this.formInput.Address;
          // this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
          //   this.formInput.State=sec.state;
          //   this.formInput.City=sec.city;
          // }, (error) => {

          // });
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }

    });
  }

  getDirection() {
    this.origin = { lat: this.formInput.Latitude, lng: this.formInput.Longitude };
    this.destination = { lat: this.curlatitude, lng: this.curlongitude };
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



  Viewlist() {
    window.location.reload();
  }


  UploadProof1Image1(event: any, form: NgForm) {
    const target = event.target as HTMLInputElement;
    var img = (target.files as FileList)[0];
    if (img && img.type.startsWith('image/')) {
      this.file = (target.files as FileList)[0];

      var reader = new FileReader();
      reader.onload = (event: any) => {
        this, this.ImageUrl = event.target.result;
      }
      reader.readAsDataURL(this.file);
      this.ShowImage = true;
      const fData: FormData = new FormData();
      fData.append('formdata', JSON.stringify(form.value));
      fData.append('FileType', "Image");
      if (this.file != undefined) {
        fData.append('File', this.file, this.file.name);
        this._commonservice.ApiUsingPost("Admin/FileUpload", fData).subscribe(data => { this.ImageUrl = data.URL; });
      }
    }
    else {
      this.ShowAlert("Please select valid image file", "warning");
    }

  }

  GetBranchList() {
    this.spinnerService.show();
    this.employeeLoading = true
    this.ApiURL = "Admin/GetBranches?OrgID=" + this.OrgID+"&UserID="+this.UserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((sec) => {
      if (sec.Status == true) {
        this.institutionsList = sec.BranchList.map((l: any, i: any) => { return { SLno: i + 1, ...l } });
        this.employeeLoading = false
        this.ShowBtn = true
        this.dtTrigger.next(null);
        this.Edit = false; this.Add = false;
      }
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading = false

    });
  }


  Update() {
    if (this.selectedOrganization.length ==0) {
      this.ShowAlert("Please Select SubOrganization!", "warning");
      return false;
    }
   else if (this.formInput.Name == "" || this.formInput.Name == undefined) {
      this.ShowAlert("Please Enter BranchName...!", "warning");
      return false;
    }
    else if (this.formInput.State == "" || this.formInput.State == undefined || this.formInput.State == null) {
      this.ShowAlert("Please Enter State", "warning");
      return false;
    }
    else if (this.formInput.City == "" || this.formInput.City == undefined || this.formInput.City == null) {
      this.ShowAlert("Please Enter City", "warning");
      return false;
    }
    else if (this.formInput.Address == "" || this.formInput.Address == undefined) {
      this.ShowAlert("Please Enter Address", "warning");
      return false;
    }
    else if (this.formInput.FromTime == "" || this.formInput.FromTime == undefined) {
      this.ShowAlert("Please Select Work Start Time", "warning");
      return false;
    }
    else if (this.formInput.ToTime == "" || this.formInput.ToTime == undefined) {
      this.ShowAlert("Please Select Work End Time", "warning");
      return false;
    }
    else {
      const json = {
        Name: this.formInput.Name,
        OrgID: this.OrgID,
        Address: this.formInput.Address,
        City: this.formInput.City,
        State: this.formInput.State,
        Latitude: this.formInput.Latitude,
        Longitude: this.formInput.Longitude,
        BranchId: this.editid,
        ImageUrl: this.ImageUrl,
        WorkStartTime: this.formInput.FromTime,
        WorkEndTime: this.formInput.ToTime,
        SubOrgID: this.selectedOrganization.map(res => res.Value)[0] || 0
      }
      this._commonservice.ApiUsingPost("Admin/UpdateBranch", json).subscribe(

        (data: any) => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.Add = false;
            this.Edit = false;
            this.View = true;
            this.ShowAlert(data.Message, "success");
            this.GetBranchList()
            // window.location.reload();
          }
          else {
            this.ShowAlert(data.Message, "warning");
            this.spinnerService.hide();
          }

        }, (error: any) => {
          localStorage.clear();

          this.ShowAlert(error.message, "error");
          this.spinnerService.hide();
        }
      );
      return true;
    }

  }

  clearFormInputs() {
    this.formInput.Name = "";
    this.formInput.Addres = "";
    this.formInput.City = "";
    this.formInput.State = "";
    this.formInput.Latitude = "";
    this.formInput.Longitude = "";
    this.formInput.FromTime = null
    this.formInput.ToTime = null
  }


  edit(IL: any): any {

    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=branch&editType=edit";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.View = false;
        this.Add = false;
        this.Edit = true;
        window.scrollTo({ top: 0, behavior: 'smooth' })
        this.spinnerService.show();
        this.Editdetails = IL;
        this.GetOrganization()
        this.selectedOrganization = [{ Value: this.Editdetails.SubOrgID, Text: this.Editdetails.SubOrgname }]
        this.editid = IL.BranchId;
        this.formInput.Name = this.Editdetails.BranchName;
        this.formInput.Address = this.Editdetails.Address;
        this.formInput.City = this.Editdetails.City;
        this.formInput.State = this.Editdetails.State;
        this.formInput.Latitude = this.Editdetails.Latitude;
        this.formInput.Longitude = this.Editdetails.Longitude;
        const FormatTime = (timeStr: string) => 
          timeStr?.match(/^(\d{1,2}:\d{2})\s?(AM|PM)?$/i)?.slice(1).join(' ') || timeStr;
        this.formInput.FromTime = FormatTime(this.Editdetails.WorkStartTime);
        this.formInput.ToTime = FormatTime(this.Editdetails.WorkEndTime);

        this.spinnerService.hide();
      }
      else {
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");
    });
  }


  CreateBranch() {
    let existingbranch = this.institutionsList.map((n: any) => n.BranchName)
    if (this.selectedOrganization.length ==0) {
      this.ShowAlert("Please Select SubOrganization!", "warning");
      return false;
    }
   else if (this.formInput.Name == "" || this.formInput.Name == undefined) {
      this.ShowAlert("Please Enter Branch Name...!", "warning");
      return false;
    }
    else if (this.formInput.State == "" || this.formInput.State == undefined || this.formInput.State == null) {
      this.ShowAlert("Please Enter State Name", "warning");
      return false;
    }
    else if (this.formInput.City == "" || this.formInput.City == undefined || this.formInput.City == null) {
      this.ShowAlert("Please Enter City Name", "warning");
      return false;
    }
    else if (this.formInput.Address == "" || this.formInput.Address == undefined) {
      this.ShowAlert("Please Enter Address", "warning");
      return false;
    }
    else if (this.formInput.FromTime == undefined || this.formInput.FromTime == null) {
      this.ShowAlert("Please Select Work Start Time", "warning");
      return false;
    }
    else if (this.formInput.ToTime == undefined || this.formInput.ToTime == null) {
      this.ShowAlert("Please Select Work End Time", "warning");
      return false;
    }
    else if (existingbranch.includes(this.formInput.Name)) {
      this.ShowAlert("Branch Already Created", "warning");
      return false
    }
    else {
      const json = {
        Name: this.formInput.Name,
        OrgID: this.OrgID,
        Address: this.formInput.Address,
        City: this.formInput.City,
        State: this.formInput.State,
        Latitude: this.formInput.Latitude,
        Longitude: this.formInput.Longitude,
        BranchId: this.editid,
        ImageUrl: this.ImageUrl,
        SubOrgID: this.selectedOrganization.map(res => res.Value)[0] || 0,
        WorkStartTime: moment(this.formInput.FromTime, ['h:mm A', 'hh:mm A']).format('hh:mm A'),
        WorkEndTime: moment(this.formInput.ToTime, ['h:mm A', 'hh:mm A']).format('hh:mm A')
      }
      console.log(json);

      this._commonservice.ApiUsingPost("Admin/CreateBranch", json).subscribe(

        (data: any) => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.Add = false;
            this.Edit = false;
            this.View = true;

            // window.location.reload();
            this.GetBranchList()
            this.ShowAlert(data.Message, "success");
          }
          else {
            this.ShowAlert(data.Message, "warning");
            this.spinnerService.hide();
          }

        }, (error: any) => {
          localStorage.clear();

          this.ShowAlert(error.message, "error");
          this.spinnerService.hide();
        }
      );
      return true;
    }
  }


  AddNewModule() {
    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=branch&editType=create";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.clearFormInputs();       
        this.View = false;
        this.Add = true;
        this.Edit = false;
        this.spinnerService.hide(); this.selectedBranchId = "";
        this.GetOrganization();
        this.formInput.Addres="";
      }
      else {
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");

    });

  }

  ActiveModule(ID: number): any {
    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=branch&editType=delete";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.ApiURL = "Admin/ActiveBranch?BranchID=" + ID;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.ShowAlert(data.Message, "success");
            this.GetBranchList()
          }
          else {
            this.ShowAlert(data.Message, "warning");
            this.spinnerService.hide();
          }
        }, (error) => {
          this.ShowAlert(error, "error");
          this.spinnerService.hide();
        })
      }
      else {
        this.ShowAlert(data.Message, "error");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");

    });

  }
  DeactiveModule(ID: number): any {
    this.ApiURL = "Admin/GetAccessStatusRole?UserID=" + this.UserID + "&feature=branch&editType=delete";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
      if (data.Status == true) {
        this.spinnerService.show();
        this.ApiURL = "Admin/DeleteBranch?BranchID=" + ID;
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
          if (data.Status == true) {
            this.spinnerService.hide();
            this.ShowAlert(data.Message, "success");
            this.GetBranchList()
          }
          else {
            this.ShowAlert(data.Message, "warning");
            this.spinnerService.hide();
          }
        }, (error) => {
          this.ShowAlert(error, "error");
          this.spinnerService.hide();
        })
      }
      else {
        this.ShowAlert(data.Message, "warning");
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.ShowAlert("Failed to Validate the Access. Please Refresh page and try again", "error");

    });
  }

  exportexcel() {
    let columns = ['BranchName', 'OrgName', 'Address', 'State', 'City', 'CreatedDate']
    let fileName = 'BranchListr.xlsx'
    let data = this.institutionsList.map((item: any) => {
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
    let columns = ['BranchName', 'OrgName', 'Address', 'State', 'City', 'CreatedDate']
    const header = ''
    const title = 'Branch Master'
    let data = this.institutionsList.map((item: any) => {
      const rowData: any[] = [];
      for (let column of columns) {
        if (column.toLowerCase().split('date').length > 1) {
          rowData.push(moment(item[column]).format('MMMM Do YYYY'));
        }
        else rowData.push(item[column]);
      }
      return rowData;
    });
    console.log(data, "data");

    this.pdfExportService.generatePDF(header, title, columns, data);
  }
  //common table
  actionEmitter(data: any) {
    if (data.action.name == "View Edit") {
      this.edit(data.row);
    }
    if (data.action.name == "Deactivate") {
      this.DeactiveModule(data.row.BranchId);
    }
    if (data.action.name == "Activate") {
      this.ActiveModule(data.row.BranchId);
    }
    // if (data.action.name == "Leave Configure") {
    //   this.configLeaveSetting(data.row)
    // }

  }
  downloadReport() {
    let selectedColumns = this.displayedColumns
    this.commonTableChild.downloadReport(selectedColumns)
  }
  //ends here
  configLeaveSetting(row: any) {
    this.dialog.open(LeavesettingComponent, {
      data: { row }
    }).afterClosed().subscribe(res=>{
      if(res){
        this.GetBranchList()
      }
    })

  }
  restrictInput(event: KeyboardEvent): void {
    event.preventDefault();
  }
  backToDashboard() {
    this._router.navigate(["appdashboard"]);
  }

}
