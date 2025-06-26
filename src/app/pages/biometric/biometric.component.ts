import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.component.html',
  styleUrls: ['./biometric.component.css']
})
export class BiometricComponent implements OnInit {
UserName:any;showpunchpage:any;
Password:any;ApiURL:any;
 //common table
  actionOptions:any
  displayColumns:any
  displayedColumns:any
  employeeLoading:any;
  editableColumns:any =[]
  topHeaders:any = []
  headerColors:any = []
  smallHeaders:any = []
  ReportTitles:any = {}
  selectedRows:any = []
  commonTableOptions :any = {};UserID:any
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent|any;
  BiometricData: any;
  
constructor(private spinnerService: NgxSpinnerService,private toastr: ToastrService, private _commonservice: HttpCommonService) {
   //common table
   this.actionOptions = [
    {
      name: "View Edit",
      icon: "fa fa-edit",
      filter: [
        { field:'Status',value : true}
      ],
    },
    {
      name: "Delete",
      icon: "fa fa-trash",
    }
  ];
  this.editableColumns = {
  }
  this.headerColors ={}

  this.displayColumns= {
    // SelectAll: "SelectAll",
    "SLno":"SL No",
    "BranchName":"BRANCH NAME",
    "devName":"DEVICE",
    "macAddress":"MAC ADDRESS",
    "Address":"ADDRESS"
    // "serialNumber":"SERIAL NUMBER"
  },


  this.displayedColumns= [
    "SLno",
    "BranchName",
    "devName",
    "macAddress",
    // "serialNumber",
    "Address"
  ]

  this.editableColumns = {
  }
  this.headerColors ={}
}
  ngOnInit(): void {
    this.UserName=localStorage.getItem("UserName");
    this.Password=localStorage.getItem("Password");
    this.showpunchpage=false;
    this.GetDeviceList();
  }
  actionEmitter(data:any){  
  }
  RegBioMetric()
  {
    this.spinnerService.show();
    if(this.UserName!=null && this.UserName!=''&&this.UserName!='undefined'&&this.Password!=null && this.Password!=''&&this.Password!='undefined')
    {
      this.ApiURL = "http://192.168.1.123:8000/Sync/Login/Role/Based";
      const json={"UserName":this.UserName,"Password":this.Password}
      this._commonservice.MasterApiUsingPost(this.ApiURL,json).subscribe(
        (res: any) => {
          console.log(res);
          if(res.status==200)
          {
            var url='http://localhost:8001/dashboard/home?token='+res.data;
            window.open(url, "_blank");
          }
          else{
            this.toastr.warning("Authentication Failed. Please Try Again");
          }
        
          this.spinnerService.hide();
      }, (error) => {
        this.spinnerService.hide();
        // this.toastr.error(error.message);
  
      });
    }
  }

  ShowPunch(val:any)
  {
    if(val==1)
      {this.showpunchpage=1;}
    else if(val==2){this.showpunchpage=2;}
    else{
      this.showpunchpage=0;
    }
  }
  backTobio()
  {
    this.showpunchpage=0;
  }

  GetDeviceList() {
    this.spinnerService.show();
    this.employeeLoading= true;
    let orgid = localStorage.getItem("OrgID");
    this._commonservice.ApiUsingGetWithOneParam("Helper/GetBiometricDevices?OrgID="+orgid).subscribe((sec) => {
      this.BiometricData = sec.List.map((data:any,i:any)=>{
          const toggledItem = {...data,
          "SLno": i + 1, ...data
      };
      return toggledItem;
    })
        this.employeeLoading= false;        
      this.spinnerService.hide();
    }, (error) => {
      this.spinnerService.hide();
      this.employeeLoading= false
      // 
    });
  }
}
