import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpCommonService } from '../../services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-change-branch',
  templateUrl: './change-branch.component.html',
  styleUrls: ['./change-branch.component.css']
})
export class ChangeBranchComponent implements OnInit {

    // selection variables
    selectedBranch: any[] = [];
    selectedNewBranch: any[] = [];
    selectedDepartment: any[] = [];
    selectedEmployees: any[] = [];
    selectedOrganization: any[] = [];
    from_date: string = "";
    to_date: string = "";
    selectedOrganization_Report: any[] = [];
    errorMessages: any = {};
    temparray: any = [];
    AdminID: any;
    UserID: any;
    OrgID: any;
   
    
    OrgList: any[] = [];
    orgSettings: IDropdownSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
    };
    branchSettings_new: IDropdownSettings = {
        singleSelection: true,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
      
    };
    branchSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
        maxHeight: 150
    };
    departmentSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
    };
    employeeSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'Value',
        textField: 'Text',
        itemsShowLimit: 1,
        allowSearchFilter: true,
    };
    BranchList: any;
    BranchList_Report: any;
    DepartmentList: any;
    EmployeeList: any;
    tempdeparray: any = [];
   
    data: any;
    spinnerService: any;



    // common table related logic
    data_list: any = [];
    displayColumns: any;
    employeeLoading = false;
    displayedColumns: any;
    editableColumns: any = [];
    actionOptions: any;
    headerColors: any = [];
    smallHeaders: any = [];
    ReportTitles: any = {};
    Report_Export_List: any[] = [];;


    //
   
    

    
    ngOnInit(): void {
        this.GetOrganization();
        this.getEmployeeList();
        this.GetBranches();
        this.GetBranches_Report();
        this.assign_default_date();

        this.displayColumns = {

            
            "EmployeeId": "Employee ID",
            "EmployeeName": "Employee Name",
           
            "OldBranchName": "Old Branch Name",
            "NewBranchName": "New Branch Name",
            "CreatedByName": "Changed By"
            

        }
        this.actionOptions = [];
        this.displayedColumns = [

            "EmployeeId",
            "EmployeeName",
           
            "OldBranchName",
            "NewBranchName",
            "CreatedByName",
          

        ];
    }

    onselectedOrg(item: any) {
        this.GetBranches()
        this.getEmployeeList();
    }

    onselectedOrg_Report(item: any) {
        this.selectedBranch = []
        this.selectedDepartment = []
        this.GetBranches_Report()
    }

    onDeselectedOrg_Report(item: any) {
        this.selectedBranch = []
        this.selectedDepartment = []
        this.GetBranches_Report();
       
    }

    onDeselectedOrg(item: any) {
        this.selectedEmployees = [];
        this.EmployeeList = [];
        this.getEmployeeList();
        this.GetBranches();

    }
    onDeptSelectAll(item: any) {
        // console.log(item,"item")
        this.tempdeparray = item
        this.getEmployeeList()
    }
    onDeptDeSelectAll() {
        this.tempdeparray = []
        this.getEmployeeList()
    }
    onDeptDeSelect(item: any) {
        // console.log(item,"item")
        this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1)
        this.getEmployeeList()
    }
    onBranchSelect(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        console.log(item);
        console.log("selected branches");
        console.log(this.selectedBranch);
        this.temparray.push({ id: item.Value, text: item.Text })
      
      
       

    }


    actionEmitter(data: any) {
       
    }

    onBranchSelect_All(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
       
        console.log("selected branches");
        this.selectedBranch = item;
        console.log(this.selectedBranch);
     
        this.temparray.push({ id: item.Value, text: item.Text })




    }
    onBranchSelectNew(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
      

    }
    onBranchDeSelectNew(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")


    }


    OnEmployeesChange(_event: any) {
        
    }
    OnEmployeesChangeDeSelect(event: any) {
        
    }
    onDeptSelect(item: any) {
        // console.log(item,"item")
        this.tempdeparray.push({ id: item.Value, text: item.Text })
        this.getEmployeeList()
    }
    constructor(private _commonservice: HttpCommonService, private dialog: MatDialog, private spinner_service: NgxSpinnerService,private date_pipe:DatePipe) {
        this.AdminID = localStorage.getItem("AdminID")
        this.UserID = localStorage.getItem("UserID")
        this.OrgID = localStorage.getItem("OrgID")
    }

    getEmployeeList() {
        this.selectedEmployees = []
        this.EmployeeList = [];
        let ApiURL = "Admin/GetEmployees?AdminID=" + this.AdminID + "&BranchID=" + "0" + "&DeptId=" + "0" + "&Year=0&Month=0&Key=en";
        this._commonservice.ApiUsingGetWithOneParam(ApiURL).subscribe(
            (data) => {
                this.EmployeeList = data.data


                if (this.selectedOrganization.length > 0) {
                    let org_id = this.selectedOrganization[0].Value;
                    this.EmployeeList = this.EmployeeList.filter((item: any) => item.SubOrgID == org_id);
                }
            },
            (error) => {
                console.log(error)
                this.spinnerService.hide()
            }
        )
           
        
          
         
          

        
   

    }

    onBranchDeSelect(item: any) {
        //  console.log(item,"item")
        this.temparray.splice(this.temparray.indexOf(item), 1)
       
       
    }

    onBranchDeSelect_All(item: any) {
        this.selectedBranch = [];
        this.DepartmentList = [];
      
       

    }

    ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
        this.dialog.open(ShowalertComponent, {
            data: { message, type },
            panelClass: 'custom-dialog',
            disableClose: true  // Prevents closing on outside click
        }).afterClosed().subscribe((res:any) => {
            if (res) {
                console.log("Dialog closed");
            }
        });
    }

    GetOrganization() {
        let ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID
        this._commonservice.ApiUsingGetWithOneParam(ApiURL).subscribe((data) => {
            this.OrgList = data.List
            if (data.List.length == 1) {
                this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
                this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
            }

           



        }, (error) => {
            this.ShowToast(error, "error")
            console.log(error);
        });
    }

    GetBranches() {
        let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
        let ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
        this._commonservice
            .ApiUsingGetWithOneParam(
                ApiURL
            )
            .subscribe(
                (data) => {
                    this.BranchList = data.List;
                  
                  

                },
                (error) => {
                    this.ShowToast(error, "error")
                    console.log(error)
                }
            )
    }

    GetBranches_Report() {
        let suborgid = this.selectedOrganization_Report.map(res => res.Value)[0] || 0
        let ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
        this._commonservice
            .ApiUsingGetWithOneParam(
                ApiURL
            )
            .subscribe(
                (data) => {
                    this.BranchList_Report = data.List;
                   


                },
                (error) => {
                    this.ShowToast(error, "error")
                    console.log(error)
                }
            )
    }
    GetDepartments() {
        var loggedinuserid = localStorage.getItem("UserID");
        this.DepartmentList = [];
        if (!this.selectedBranch || this.selectedBranch?.length == 0) return
        const json = {
            AdminID: loggedinuserid,
            OrgID: this.OrgID,
            Branches: this.selectedBranch.map((br: any) => {
                return {
                    id: br.Value,
                }
            }),
        }


        this._commonservice.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
            (data) => {
               
                if (data.DepartmentList.length > 0) {
                    this.DepartmentList = data.List;
                    
                }
            },
            (error) => {
               
                this.ShowToast(error, "error")
                console.log(error)
            }
        )
    }

    list_data() {
        try {

            if (!this.to_date) {

                this.ShowToast('To  Date is Required ', 'warning');
                return;
            }

            if (!this.from_date) {

                this.ShowToast('From  Date is Required ', 'warning');
                return;
            }

            if (this.from_date > this.to_date) {
                this.ShowToast('From Date Should Not be Greater then To Date', 'warning');
                return;
            }

            if (this.selectedBranch.length == 0) {
                this.ShowToast('Please Select Branch', 'warning');


            } else {
                
                let api_url = "api/Settings/GetEmployeeBranchHistory";
           
                this.spinner_service.show();

                this.employeeLoading = true;
                var json_data =
                {
                    Fromdate: this.from_date,
                    Todate: this.to_date,
                    BranchList: this.selectedBranch.map((item: any)=> { return { BranchId : item.Value} })
                };


                this._commonservice
                    .Postwithjson(api_url,json_data)
                    .subscribe({
                        next: (result) => {
                            this.spinner_service.hide();
                            this.data_list = result.EmpData;
                            console.log(this.data_list);
                            this.employeeLoading =false;
                            if (result.EmpData.length > 0) {
                                this.Report_Export_List = ['Switched Branch History'];
                            } else {
                                this.Report_Export_List = [];

                            }
                        },
                        error: (http_error) => {
                            this.spinner_service.hide();
                            if (http_error.error != undefined && http_error.error.Status == false) {
                              
                               this.ShowToast(http_error.error.Message, 'error');
                             } 
                            else if (http_error instanceof HttpErrorResponse) {

                                this.ShowToast(http_error.message, 'error');
                            }
                            else if(http_error instanceof Error) {
                                this.ShowToast(http_error.message, 'error');
                            }
                        }
                    });
            }
         


        } catch (exception) {
            if (exception instanceof Error) {
                this.ShowToast(exception.message, 'error');
            } else {
                this.ShowToast((exception as Error).message, 'error');

            }
        }
    }
    getFirstDateOfMonth(): string {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

        // Format to yyyy-MM-dd
        const yyyy = firstDay.getFullYear();
        const mm = String(firstDay.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(firstDay.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }


    assign_default_date() {
        //  this.to_date = this.date_pipe.transform(new Date(), "yyyy-MM-dd").toString();
        this.to_date = this.date_pipe.transform(new Date(), "yyyy-MM-dd")!;
        this.from_date = this.getFirstDateOfMonth();
    }

    change_branch() {
        try {
           
            if (this.selectedEmployees.length == 0) {
               
                this.errorMessages['employee'] = { message: "Please select Employees" }

                if (this.selectedNewBranch.length == 0) {
                    this.errorMessages['branch'] = { message: "Please  select New Branch" }

                }
            }
            else if (this.selectedNewBranch.length == 0) {
            
                this.errorMessages['branch'] = { message: "Please  select New Branch" }

               

            } else {

                this.errorMessages['branch'] = "";
                this.errorMessages['employee'] = "";

                var json_data = {
                    EmployeeList: this.selectedEmployees.map((item: any) => { return { EmployeeID :item.Value} }),
                    BranchId: this.selectedNewBranch[0].Value,
                    UserId: this.UserID.toString()
                };
                this.spinner_service.show();
                let api_url = "api/Settings/EmployeeShiftingToBranchs";
                this._commonservice.Postwithjson(api_url, json_data).subscribe({
                    next: (result) => {
                        if (result.Status) {
                       
                            this.spinner_service.hide();
                            let employee_count = this.selectedEmployees.length;
                            let messageParts = [];

                            if (result.Success > 0) {
                                messageParts.push(`Changed: ${result.Success}`);
                            }

                            if (result.Failed > 0) {
                                messageParts.push(`Failed: ${result.Failed}`);
                            }

                            if (result.Dupliocate > 0) {
                                messageParts.push(`Duplicates Found: ${result.Dupliocate}`);
                            }

                            let message = messageParts.join(', ');


                            if (result.Dupliocate > 0 || result.Failed > 0) {
                                this.ShowToast(message, 'warning');
                            } else {
                                this.ShowToast(message, 'success');
                            }

                           
                       
                         
                        } else {
                            let messageParts = [];

                            if (result.Success > 0) {
                                messageParts.push(`Changed: ${result.Success}`);
                            }

                            if (result.Failed > 0) {
                                messageParts.push(`Failed: ${result.Failed}`);
                            }

                            if (result.Dupliocate > 0) {
                                messageParts.push(`Duplicates Found: ${result.Dupliocate}`);
                            }

                            let message = messageParts.join(', ');

                            this.spinner_service.hide();

                            if (result.Dupliocate > 0 || result.Failed > 0) {
                                this.ShowToast(message, 'warning');
                            } else {
                                this.ShowToast(message, 'success');
                            }

                          
                        }

                        this.selectedEmployees = [];
                        this.selectedNewBranch = [];
                    },
                    error: (http_error) => {
                        this.spinner_service.hide();
                        if (!http_error.error.Status) {
                            if (http_error.error.Message == undefined) {
                                this.ShowToast(http_error.error.message, 'error');
                            } else {
                                this.ShowToast(http_error.error.Message, 'error');
                            }
                          
                        } else {
                            this.ShowToast(http_error.message, 'error');
                        }
                    }
                });
            }


        } catch (exception) {
            if (exception instanceof Error) {
                this.ShowToast(exception.message, 'error');
            } else {
                this.ShowToast((exception as Error).message, 'error');

            }
        }
       

    }
}
