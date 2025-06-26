import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-leave-map',
  templateUrl: './leave-map.component.html',
  styleUrls: ['./leave-map.component.css']
})
export class LeaveMapComponent implements OnInit {
    BranchList: any;
    DepartmentList: any;
    EmployeeList: any;
    AdminID: any;
    UserID: any;
    OrgID: any;

    branchSettings: IDropdownSettings = {};
    departmentSettings: IDropdownSettings = {};
    employeeSettings: IDropdownSettings = {};
    errorMessages: any = {};
    selectedBranch: any[] = [];
    selectedDepartment: any[] = [];
    selectedEmployees: any[] = [];
    temparray: any = [];
    tempdeparray: any = [];
    OrgList: any[] = [];
    orgSettings: IDropdownSettings = {};
    edit: Boolean = false;
    selectedOrganization: any[] = [];
    LeaveTypes: any[] = [];

    form!: FormGroup;


    constructor(
        public dialogRef: MatDialogRef<LeaveMapComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _commonservice: HttpCommonService,
        private spinnerService: NgxSpinnerService,
        private globalToastService: ToastrService,
        private cdr: ChangeDetectorRef, private dialog: MatDialog
    ) {
        this.AdminID = localStorage.getItem("AdminID");
        this.UserID = localStorage.getItem("UserID");
        this.OrgID = localStorage.getItem("OrgID");

        this.branchSettings = {
            singleSelection: true,
            idField: 'Value',
            textField: 'Text',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        }
        this.employeeSettings = {
            singleSelection: false,
            idField: 'Value',
            textField: 'Text',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        }
        this.departmentSettings = {
            singleSelection: true,
            idField: 'Value',
            textField: 'Text',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        }
        this.orgSettings = {
            singleSelection: true,
            idField: 'Value',
            textField: 'Text',
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };

        this.form = new FormGroup(
        {
                LeaveTypeId: new FormControl('', [Validators.required]),
                CountType: new FormControl('M', [Validators.required]),
                MonthWise: new FormControl('1', [Validators.required]),
                Yearly: new FormControl('12', [Validators.required]),
                Eligibility: new FormControl('1.5'),
                January: new FormControl('1'),
                February: new FormControl('1'),
                March: new FormControl('1'),
                April: new FormControl('1'),
                May: new FormControl('1'),
                June: new FormControl('1'),
                July: new FormControl('1'),
                August: new FormControl('1'),
                September: new FormControl('1'),
                October: new FormControl('1'),
                November: new FormControl('1'),
                December: new FormControl('1'),
                IsActive: new FormControl(true),
                Total:new FormControl('1')


        });

         
    }

    close(): void {
        const dialogData = {};
        this.dialogRef.close(dialogData);
    }
    load_component_data() {
        debugger;
        let api_url = "api/LeaveMaster/GetLeaveMasterTypes?OrgID=" + this.OrgID;
        this._commonservice.GetWithOneParam(api_url).subscribe({
            next: (result) => {

                if (result.status == 200) {


                    this.LeaveTypes = result.data.LeaveMasterTypes;

                  



                }
                else {
                    this.ShowToast(result.message, 'warning');
                }

            },
            error: (error) => {

                this.ShowToast(error.message, 'error');
               
            }

        });

    }
    onDepartmentSelect_All(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        this.selectedDepartment = item;
        this.getEmployeeList();
    }
    onBranchSelect_All(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        this.selectedBranch = item;
        this.GetDepartments();
        this.selectedEmployees = [];
       
    }
    onBranchDeSelect_All(item: any) {
        //  console.log(item,"item")

        this.selectedBranch = [];
        this.DepartmentList = [];
        this.temparray.splice(this.temparray.indexOf(item), 1);
        this.selectedDepartment = [];
        this.selectedEmployees = [];
      
    }
    onBranchSelect(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        this.temparray.push({ id: item.Value, text: item.Text })
        this.GetDepartments()
        this.selectedEmployees = []
      

    }
    onDepartmentDeSelect_All(item: any) {
        //  console.log(item,"item")

        this.selectedDepartment = [];


        this.temparray.splice(this.temparray.indexOf(item), 1);
        this.selectedDepartment = [];
        this.selectedEmployees = [];
        this.EmployeeList = [];
    }
    onBranchDeSelect(item: any) {
        //  console.log(item,"item")
        this.temparray.splice(this.temparray.indexOf(item), 1)
        this.GetDepartments()
        this.selectedEmployees = []
        this.getEmployeeList();
        this.DepartmentList = [];
    }
    onDeptSelect(item: any) {
        // console.log(item,"item")
        this.tempdeparray.push({ id: item.Value, text: item.Text })
        this.getEmployeeList()
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
    ngOnInit(): void {
        this.GetOrganization();
        this.load_component_data();
    }
    onselectedOrg(item: any) {
        this.selectedBranch = []
        this.selectedDepartment = []
        this.GetBranches()
    }
    onDeselectedOrg(item: any) {
        this.selectedBranch = []
        this.selectedDepartment = []
        this.GetBranches()
    }
    GetOrganization() {
        let ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID
        this._commonservice.ApiUsingGetWithOneParam(ApiURL).subscribe((data) => {
            this.OrgList = data.List
            if (data.List.length == 1) {
                this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
                this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
            }

            if (this.edit == true) {
                if (this.data.row != null && this.data.row.SubOrg != null) {
                    this.selectedOrganization = [{ Value: this.data.row.SubOrg[0].ID, Text: this.data.row.SubOrg[0].Name }];
                }
            }



        }, (error) => {
            this.ShowToast(error, "error")
            console.log(error);
        });
    }
    OnEmployeesChange(_event: any) {
        // this.validateEmployee()
    }
    OnEmployeesChangeDeSelect(event: any) {
        // this.validateEmployee()
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
                    this.BranchList = data.List
                    // console.log(this.BranchList, "branchlist")
                    // if(this.edit != true){
                    //   this.selectedBranch = [this.BranchList[0]]

                    // }


                    if (this.edit == true) {
                        if (this.data.row != null) {
                            this.selectedBranch = [{ Value: this.data.row.Branch[0].ID, Text: this.data.row.Branch[0].Name }];
                        }
                    }
                    this.GetDepartments()
                    this.getEmployeeList()

                },
                (error) => {
                    // this.globalToastService.error(error)
                    this.ShowToast(error, "error")
                    console.log(error)
                }
            )
    }
    ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
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
                // console.log(data)
                if (data.DepartmentList.length > 0) {
                    this.DepartmentList = data.List
                    // console.log(this.DepartmentList,"department list")

                    if (this.edit == true) {
                        debugger;
                        if (this.data.row != null && this.data.row.Department != null) {
                            this.selectedDepartment = [];
                            for (let i = 0; i < this.data.row.Department.length; i++) {
                                this.selectedDepartment.push({ Value: this.data.row.Department[i].ID, Text: this.data.row.Department[i].Name });

                            }
                        }
                    }
                  //  this.getEmployeeList()
                }
            },
            (error) => {
                // this.globalToastService.error(error)
                this.ShowToast(error, "error")
                console.log(error)
            }
        )
    }

    getEmployeeList() {
        this.selectedEmployees = []
        this.EmployeeList = [];
        if (!(this.selectedBranch?.length > 0)) return
        if (this.selectedBranch) {
            let BranchID = this.selectedBranch?.map((y: any) => y.Value)[0]

            let deptID = this.selectedDepartment?.map((y: any) => y.Value)[0] || 0
            let ApiURL =
                "Admin/GetEmployees?AdminID=" +
                this.AdminID +
                "&BranchID=" +
                BranchID +
                "&DeptId=" +
                deptID +
                "&Year=0&Month=0&Key=en"
            this._commonservice.ApiUsingGetWithOneParam(ApiURL).subscribe(
                (data) => {
                    this.EmployeeList = data.data
                    // this.selectedEmployees = this.EmployeeList.map((e: any) => {
                    //   return { Value: e.Value, Text: e.Text }
                    // })

                    // this.GetReport()

                    if (this.edit == true) {
                        if (this.data.row != null && this.data.row.Employee) {
                            debugger;
                            this.selectedEmployees = [];
                            for (let i = 0; i < this.data.row.Employee.length; i++) {
                                this.selectedEmployees.push({ Value: this.data.row.Employee[i].ID, Text: this.data.row.Employee[i].Name });
                            }
                        }
                    }
                },
                (error) => {
                    console.log(error)
                    this.spinnerService.hide()
                }
            )
        }

    }



    month_wise_leave_split() {
        let month_wise_leaves = this.form.get('MonthWise')?.value;
        if (Number(month_wise_leaves) > 0) {
            this.form.get('January')?.setValue(month_wise_leaves);
            this.form.get('February')?.setValue(month_wise_leaves);
            this.form.get('March')?.setValue(month_wise_leaves);
            this.form.get('April')?.setValue(month_wise_leaves);
            this.form.get('May')?.setValue(month_wise_leaves);
            this.form.get('June')?.setValue(month_wise_leaves);
            this.form.get('July')?.setValue(month_wise_leaves);
            this.form.get('August')?.setValue(month_wise_leaves);
            this.form.get('September')?.setValue(month_wise_leaves);
            this.form.get('October')?.setValue(month_wise_leaves);
            this.form.get('November')?.setValue(month_wise_leaves);
            this.form.get('December')?.setValue(month_wise_leaves);

        }

        this.calculate_total();
    }

 

    OnSave() {
        debugger;
        if (this.selectedBranch.length == 0) {
            this.ShowToast('Please Select Branch !', 'warning');
            return;
        }
        if (this.form.get('LeaveTypeId')!.value=='') {
            this.ShowToast('Please Select Leave Type !', 'warning');
            return;
        }
        if (this.form.get('CountType')!.value=='M' && Number(this.form.get('MonthWise')!.value) <= 0) {
            this.ShowToast('Please Enter No Leaves Per Month !', 'warning');
            return;
        }
        if (this.form.get('CountType')!.value == 'Y' && ((this.form.get('Yearly')!.value != this.form.get('total') || Number(this.form.get('Yearly')!.value) <= 0 ))) {
            this.ShowToast('Please Enter No Leaves Per Year !', 'warning');
            return;
        }
        else {

            var json_body = this.form.value;
            let api_url = "LeaveConfiguration";
            json_body["OrgId"] = this.OrgID;
            json_body["Admin"] = this.AdminID;
            json_body["SubOrgId"] = this.selectedOrganization[0].Value;
            json_body["BranchList"] = this.selectedBranch.map((item: any) => { return { BranchId: item.Value } });
            json_body["DeptList"] = this.selectedDepartment.map((item: any) => { return { DeptId: item.Value } });
            json_body["EmployeeList"] = this.selectedEmployees.map((item: any) => { return { EmployeeID: item.Value } });
            json_body["SubOrgList"] = this.selectedOrganization.map((item: any) => { return { SubOrgId: item.Value } });

            this._commonservice
                .Postwithjson(api_url, json_body)
                .subscribe({
                    next: (result) => {
                        if (result.Status != undefined) {
                            if (result.Status) {
                                this.ShowToast(result.message, 'success');
                            } else {
                                this.ShowToast(result.message, 'warning');

                            }
                        }
                        else if (result.status != undefined) {
                            if (result.status == 200) {
                                this.ShowToast(result.message, 'success');

                            } else {
                                this.ShowToast(result.message, 'warning');

                            }
                        }
                    },
                    error: (error) => {
                        if (error instanceof HttpErrorResponse) {
                            this.ShowToast(error.error.message, 'error');

                        }else if(error instanceof Error) {
                            this.ShowToast(error.message, 'error');

                        }
                    }


                })



        }
    }


    calculate_total() {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        let total = 0;
        months.forEach(month => {
            total += Number(this.form.get(month)?.value);
        });

        this.form.get('Total')?.setValue(total);
    }

    type_changed() {
        let type = this.form.get('CountType')?.value;
        if (type == 'M') {
            this.month_wise_leave_split();
        } else {
            this.year_wise_leave_split();
        }

        this.calculate_total();
    }
    year_wise_leave_split() {
        let totalLeaves = this.form.get('Yearly')?.value || 0;
        if (totalLeaves <= 0) return;

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Calculate base and remainder
        const baseLeave = Math.floor(totalLeaves / 12);
        let remainder = totalLeaves % 12;

        // Set base leave for all months
        months.forEach(month => {
            this.form.get(month)?.setValue(baseLeave);
        });

        // Distribute remainder starting from end (December backward)
        for (let i = months.length - 1; i >= 0 && remainder > 0; i--) {
            const current = this.form.get(months[i])?.value || 0;
            this.form.get(months[i])?.setValue(current + 1);
            remainder--;
        }

        this.calculate_total();
    }
}
