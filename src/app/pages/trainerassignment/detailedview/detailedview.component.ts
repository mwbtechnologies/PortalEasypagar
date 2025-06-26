import { Component, Input, ViewChild } from '@angular/core';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonTableComponent } from '../../common-table/common-table.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeatiledviewupdateComponent } from '../deatiledviewupdate/deatiledviewupdate.component';

@Component({
  selector: 'app-detailedview',
  templateUrl: './detailedview.component.html',
  styleUrls: ['./detailedview.component.css']
})
export class DetailedviewComponent {
  OrgID: any
  AdminID: any
  UserID: any
  EmployeesList: any[]=[]
  @Input() EmployeeWiseList: any
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
  BranchList: any; DepartmentList: any[] = [];
  orgSettings: IDropdownSettings = {}
  pdfSrc:any
  @ViewChild(CommonTableComponent) commonTableChild: CommonTableComponent | any;
  //ends here
  StatusList: any[] = ["Pending", "Complete", "On-Going"]
  selectedStatus: any[] = []
  statusSettings: IDropdownSettings = {}
  filteredList:any[]=[]
  showFilter:boolean = false
  searchText:any = ''

  constructor(private _commonservice: HttpCommonService, private dialog: MatDialog,private spinnerService: NgxSpinnerService) {
    this.actionOptions = [
      {
        name:"Update",
        icon:"fa fa-edit",
        filter: [
          { field:'IsEditable',value : true}
        ],
      }
    ]
    this.displayColumns = {
      "Actions":"ACTIONS",
      "StatusByTrainee":"STATUS",
      "SLno": "SL NO",
      "EmployeeName":"TRAINEE",
      "Training_Description":"DESCRIPTION",
      "AssignedOn":"ASSIGNED ON",
      "AssignedByName":"ASSIGNED BY",
      "StartDateByAdmin":"STARTDATE",
      "EndDateByAdmin":"ENDDATE",
      "SessionStartDate":"TRAINER START DATE",
      "SessionEndDate":"TRAINER END DATE",
      "CreatedDate":"ASSIGNED ON",
      "TrainingHeading":"TITLE",
      // "RemarksByTrainee":"TRAINER REMARKS",
      "StatusByEmployee":"TRAINEE STATUS",
      "TrainingSessionAddress":"ADDRESS",
    }

    this.displayedColumns = [
      "Actions",
      "StatusByTrainee",
        "SLno",
        "EmployeeName",
        // "TrainingHeading",
        // "Training_Description",
        // "StartDateByAdmin",
        // "EndDateByAdmin",
        // "AssignedOn",
        "CreatedDate",
        "SessionStartDate",
        "SessionEndDate",
        // "RemarksByTrainee",
        "StatusByEmployee",
        "TrainingSessionAddress",
    ]

    this.statusSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

  }
  ngOnInit() {
    this.OrgID = localStorage.getItem('OrgID')
    this.AdminID = localStorage.getItem("AdminID");
    this.UserID = localStorage.getItem("UserID");
    this.getTrainerWiseList()
  }
  onstatusSelect(item:any){
    this.getFeFilters(item)
  }
  onDeselectstatus(item:any){
    this.getFeFilters(item)
  }
  getFeFilters(fitem:any){
    this.EmployeesList = this.filteredList.filter(item => {
      return (
          item.StatusByTrainee.toLowerCase().includes(fitem.toLowerCase())
      );
    });
    if(this.selectedStatus.length == 0){
      this.EmployeesList = [...this.filteredList]
    }
  }
  applyFilter(){
    this.EmployeesList = this.filteredList.filter(item => {
      return (
          item.EmployeeName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.TrainingHeading.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.Training_Description.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.TrainingHeading.toLowerCase().includes(this.searchText.toLowerCase())
      );
    });
  }
  removesearch() {
    this.searchText = "";
    this.applyFilter();
  }
  getTrainerWiseList() {
    this.spinnerService.show()
    this.employeeLoading = true
    let json = {
      "FromDate": this.EmployeeWiseList.fromdate,
      "EndDate": this.EmployeeWiseList.todate,
      // "Status": this.EmployeeWiseList.selectedstatus,
      "TrainerId": this.EmployeeWiseList.trainerID,
      "TrainingId": this.EmployeeWiseList.trainingID
    }
    this._commonservice.ApiUsingPost("TraniningMaster/TrainingDetailListForTrainer", json).subscribe((res: any) => {
      this.EmployeesList = res.data.List.map((l: any, i: any) => {
              return {
                SLno: i + 1, ...l,
              }
            });
      this.showFilter = true
      this.filteredList = [...this.EmployeesList]
      this.spinnerService.hide()
      this.employeeLoading = false
    }, (error) => {
      this.ShowAlert("Something went wrong", "error")
      this.spinnerService.hide()
      this.employeeLoading = false
    })
  }

  updateRemarks(row: any) {
   this.dialog.open(DeatiledviewupdateComponent, {
         data: {row},
       }).afterClosed().subscribe(res=>{
         if(res){
          this.getTrainerWiseList()
          this.selectedStatus = []
         }
       })
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
  actionEmitter(data:any){
    if(data.action.name == "Update"){
      this.updateRemarks(data.row)
    }
  }


  downloadPDF(){
    this.openReport("api/TraniningMaster/GenerateBranchwiseTrainingPDF")
   }
   downloadExcel(){
      this.openReport("api/TraniningMaster/GenerateBranchwiseTrainingExcel")
   }
 
   openReport(data:any){
     this._commonservice.ApiUsingPostNew(data, this.EmployeesList, { responseType: 'text' }).subscribe((res: any) => {
       res = JSON.parse(res)
       if (res.Status == true) {
         this.pdfSrc = res;
         window.open(res.Link, "_blank");
         this.spinnerService.hide();
       }else if (res.Status == false) {
         this.ShowAlert(res.Message,"warning")
         this.spinnerService.hide();
       }
       else {
         this.ShowAlert("Sorry Failed to Generate","warning")
         this.spinnerService.hide();
       }
     }, (error) => {
       this.ShowAlert(error.message,"error")
       this.spinnerService.hide();
     });
   }
}
