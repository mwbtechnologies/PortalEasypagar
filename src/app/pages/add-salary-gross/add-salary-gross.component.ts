import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { HttpCommonService } from '../../services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, merge, combineLatest } from 'rxjs';
import { EditFormulaComponent } from '../add-salary-gross/edit-formula/edit-formula.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-add-salary-gross',
  templateUrl: './add-salary-gross.component.html',
  styleUrls: ['./add-salary-gross.component.css']
})
export class AddSalaryGrossComponent implements OnInit {


    //dynamic salary settings
    steps: any = [];
    gross_calcuation_text: string = "";
    @ViewChild(MatStepper) stepper!: MatStepper;
    edit: Boolean = false;

    //
    main_form_group!: FormGroup;


    //branch,org related data

    selectedBranch: any[] = [];
    errorMessages: any = {};
   
    selectedDepartment: any[] = []
    selectedEmployees: any[] = []
    selectedSalaryType: any = []
    EmployeeList: any = [];
    OrgList: any[] = [];
    selectedOrganization: any[] = [];
    dragDropHelp: boolean = false;
    BranchList: any;
    DepartmentList: any;
    // salary components
    salary_component_list: any[] = [];
    salary_earnings_list: any[] = [];
    salary_deduction_list: any[] = [];
    tempdeparray: any = [];



    salary_compoisition_list: any[] = [];


    // user keys
    AdminID: string = "";
    OrgID: string = "";
    UserID: string = "";
    temparray: any = [];
    

    //dropdown config

      branchSettings = {
    singleSelection: true,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
}
employeeSettings = {
    singleSelection: false,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
}
departmentSettings = {
    singleSelection: true,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
}
orgSettings = {
    singleSelection: true,
    idField: 'Value',
    textField: 'Text',
    itemsShowLimit: 1,
    allowSearchFilter: true,
};


    //gross calculations

    totalGross: number = 0;
    
    selected_salary_components: any = [];

    // select all controls

     is_all_earnings_selected: Boolean = false;
     is_all_deductions_selected: Boolean = false;

    constructor(public dialogRef: MatDialogRef<AddSalaryGrossComponent>, private cdr: ChangeDetectorRef, private _commonservice: HttpCommonService, private spinnerService: NgxSpinnerService, private dialog: MatDialog, private fb: FormBuilder, private breakpointObserver: BreakpointObserver) {

        this.main_form_group = this.fb.group({
            earning_list: this.fb.array([]),
            deduction_list: this.fb.array([]),
            select_all_earnings: [false],
            select_all_deductions:[false]
        });


    }



    ngOnInit(): void {
        this.AdminID = localStorage.getItem("AdminID")!;
        this.UserID = localStorage.getItem("UserID")!;
        this.OrgID = localStorage.getItem("OrgID")!;
        this.GetOrganization();
        this.load_salary_components();
        
    }










    //branch validation

    validateBranch(): boolean {
        if (this.selectedBranch.length <= 0) {
            this.errorMessages['branch'] = { message: "Please select a Branch." }
            return false
        }
        if (this.errorMessages['branch']) delete this.errorMessages['branch']
        return true
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
                },
                (error) => {
                    console.log(error)
                    this.spinnerService.hide()
                }
            )
        }

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


    // loading dropdowns

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

    showDragDropHelp() {
        this.dragDropHelp = true
    }

    hideDragDropHelp() {
        this.dragDropHelp = false
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

    onDeptDeSelectAll() {
        this.tempdeparray = []
        this.getEmployeeList()
    }
    onDeptDeSelect(item: any) {
        // console.log(item,"item")
        this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1)
        this.getEmployeeList()
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
    onBranchSelect(item: any) {
        // console.log(this.selectedBranch)

        //  console.log(item,"item")
        this.temparray.push({ id: item.Value, text: item.Text })
        this.GetDepartments()
        this.selectedEmployees = []
        this.getEmployeeList()

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

    OnEmployeesChange(_event: any) {
        // this.validateEmployee()
    }
    OnEmployeesChangeDeSelect(event: any) {
        // this.validateEmployee()
    }

    onBranchDeSelect(item: any) {
        //  console.log(item,"item")
        this.temparray.splice(this.temparray.indexOf(item), 1)
        this.GetDepartments()
        this.selectedEmployees = []
        this.getEmployeeList()
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
                    this.getEmployeeList()
                }
            },
            (error) => {
                // this.globalToastService.error(error)
                this.ShowToast(error, "error")
                console.log(error)
            }
        )
    }

    //steps

    isStepValid(step: number) {
        return this.steps[step] || false;
    }


    validateEarnings() {
        let selected_earnings = this.earning_list.value.filter((i: any) => i.is_selected == true);
        
        let earningsStatus = selected_earnings.length > 0 ? true : false;
        if (!earningsStatus) this.errorMessages['earnings'] = { message: "Please select minimum one of the above given Earnings" }
        else if (this.errorMessages['earnings']) delete this.errorMessages['earnings']
        return earningsStatus
    }

    validateDeductions() {
        let selected_deductions = this.deduction_list.value.filter((i: any) => i.is_selected == true);
     
        let deductionsStatus = selected_deductions.length > 0 ? true : false;
        if (!deductionsStatus) this.errorMessages['deductions'] = { message: "Please select minimum one of the above given Deductions" }
        else if (this.errorMessages['deductions']) delete this.errorMessages['deductions']
        return deductionsStatus
    }

    validateGross() {
        if (this.totalGross != 100) {
            this.errorMessages['grossError'] = { message: "Sum of all salary type given below must be equal to 100", type: "danger" }
            return false
        }
        if (this.errorMessages['grossError']) delete this.errorMessages['grossError']
        return true
    }

    ValidateSelection(): Boolean {

        const earnings = this.earning_list.getRawValue().filter((item: any) => item.is_selected).map((item: any) => ({
            ComponentID: item.ComponentId,

            Percentage: item.Percentage || 0,
            ComponentName: item.ComponentName
        }));

        for (let i = 0; i < earnings.length; i++) {
            if (earnings[i].Percentage == 0) {
                return false;
            }
        }
        return true;

    }

    IsValidSelection() {
      
        return this.validateEarnings() && this.validateDeductions() && this.validateGross() && this.ValidateSelection();
    }

    validateSteps(step: number) {
        this.cdr.detectChanges()
        if (step == 0) {
            this.steps[0] = this.validateBranch() && this.selectedDepartment.length > 0 && this.selectedEmployees.length > 0;
            if (this.selectedBranch.length <= 0) {
                this.ShowToast('Please Select Branch', 'warning');

            }
            if (this.selectedDepartment.length ==0) {
                this.ShowToast('Please Select Department', 'warning');

            }
            if (this.selectedEmployees.length == 0) {
                this.ShowToast('Please Select Employees', 'warning');

            } else
            {
                if (this.steps[0] == true)
                    this.stepper.selectedIndex = 1

            }

        }

        else if (step == 1) {
            this.cdr.detectChanges();
             this.steps[1] = true;
             this.stepper.selectedIndex = 2;
           
        
        }
    }

    private load_salary_components() {
        let api_url = "api/Salary/GetGrossComponents?OrgID=" + this.OrgID + "";
        this._commonservice.GetWithOneParam(api_url)
            .subscribe({
                next: (result) => {
                    if (result.Status) {
                        this.salary_component_list = result.data;
                        console.log(this.salary_component_list);
                        for (let i = 0; i < this.salary_component_list.length; i++) {
                            this.salary_component_list[i]["Percentage"] = "";
                            this.salary_component_list[i]["selected"] = false;

                        }
                        this.salary_earnings_list = this.salary_component_list.filter((i: any) => i.Type == "Earnings");
                        this.salary_deduction_list = this.salary_component_list.filter((i: any) => i.Type == "Deduction");

                        this.add_earning_components();
                        this.add_deduction_components();
                    }
                },
                error: (error) => {
                    if (error instanceof Error) {
                        this.ShowToast(error.message, 'error');
                    } else {
                        this.ShowToast("unexcepted error==>" + error, 'error');
                    }
                }
            });

    }

    private load_salary_components_dummy() {
        this.salary_component_list.push(
            {
                "ComponentId": 1,
                "ComponentName": "Basic Pay",
                "Type": "Earnings"
            },
            {
                "ComponentId": 2,
                "ComponentName": "ESI 5 23",
                "Type": "Deduction"
            },
            {
                "ComponentId": 3,
                "ComponentName": "House Rent Allowance",
                "Type": "Earnings"
            },
            {
                "ComponentId": 4,
                "ComponentName": "Provident Fund",
                "Type": "Deduction"
            },
            {
                "ComponentId": 5,
                "ComponentName": "ANOTHER  ONE ",
                "Type": "Earnings"
            },
            {
                "ComponentId": 6,
                "ComponentName": "ABC",
                "Type": "Earnings"
            },
            {
                "ComponentId": 7,
                "ComponentName": "Special Allowance",
                "Type": "Earnings"
            },
            {
                "ComponentId": 8,
                "ComponentName": "Professional Tax",
                "Type": "Deduction"
            },
            {
                "ComponentId": 9,
                "ComponentName": "Medical Allowance",
                "Type": "Earnings"
            },
            {
                "ComponentId": 10,
                "ComponentName": "Income Tax",
                "Type": "Deduction"
            });
        for (let i = 0; i < this.salary_component_list.length; i++) {
            this.salary_component_list[i]["Percentage"] = "";
            this.salary_component_list[i]["selected"] = false;

        }

        this.salary_earnings_list = this.salary_component_list.filter((i: any) => i.Type == "Earnings");
        this.salary_deduction_list = this.salary_component_list.filter((i: any) => i.Type == "Deduction");


        this.add_earning_components();
        this.add_deduction_components();
    }
   

    goToPreviousStep() {
        this.stepper.previous();
    }

    get deduction_list(): FormArray {
        return this.main_form_group.get('deduction_list') as FormArray;
    }

    get earning_list(): FormArray {
        return this.main_form_group.get('earning_list') as FormArray;
    }


    add_earning_components(): void {
        this.salary_earnings_list.forEach(component => {
            this.earning_list.push(this.fb.group({
                ComponentId: new FormControl(component.ComponentId),
                is_selected: new FormControl(component.is_selected),
                Percentage: new FormControl(component.Percentage, [Validators.required]),
                ComponentName: new FormControl(component.ComponentName)
            }));
        });



        this.earning_list.valueChanges.subscribe(values => {
            let totalPercentage = 0;
            let temp_gross_calc = "Gross Salary = ";

            values.forEach((val: any) => {
                if (val.is_selected) {
                    // Convert to number and fallback to 0 if not valid
                    const percent = parseFloat(val.Percentage) || 0;
                    totalPercentage += percent;
                    temp_gross_calc += val.ComponentName + "(" + percent + ")% + "; 
                }
            });

            if (temp_gross_calc.toString().endsWith("+ ")){
                temp_gross_calc = temp_gross_calc.substring(0, temp_gross_calc.toString().lastIndexOf("+ "));
            }
            // Optionally store this in a variable if needed
            this.totalGross = totalPercentage;
            this.gross_calcuation_text = temp_gross_calc;
        });
    }

    

     add_deduction_components(): void {
        this.salary_deduction_list.forEach(component => {
            this.deduction_list.push(this.fb.group({
                ComponentId: new FormControl(component.ComponentId),
                is_selected: new FormControl(component.is_selected),
              
                ComponentName: new FormControl(component.ComponentName)
            }));
        });
    }


    
    openConfigDialog_demo() {
        const dialogRef = this.dialog.open(EditFormulaComponent, {
            maxWidth: '500px',
            panelClass: 'full-with-dialog',
            disableClose: true,
           
        });


    }
    openConfigDialog(row:any) {
        const dialogRef = this.dialog.open(EditFormulaComponent, {
            maxWidth: '500px',
            panelClass: 'full-with-dialog',
            disableClose: true,
            data:row,
        });


    }

    does_component_exists(item:any): Boolean {
        let result = false;
        this.selected_salary_components.forEach((item: any) => {
            if (item.ComponentID == item.ComponentID) {
                result = true;
               
            }
        });
        return result;
    }
    

    get_final_list(): void {

        

        this.salary_component_list = this.salary_component_list.filter(i => this.does_component_exists(i));
        for (let i = 0; i < this.salary_component_list.length; i++) {
            this.salary_component_list[i]["Amount"] = "0";
            this.salary_component_list[i]["Expression"] = "";
            this.salary_component_list[i]["type"] = "FixedAmount";

        }
    }

    close(): void {
        const dialogData = {};
        this.dialogRef.close(dialogData);
    }



    select_all_earnings_clicked() {
       
        let is_select_all_clicked = this.is_all_earnings_selected;
        this.is_all_earnings_selected = !this.is_all_earnings_selected;
        this.select_all_earnings(this.is_all_earnings_selected);
     

    }

    select_all_deduction_clicked() {
        let is_select_all_clicked = this.is_all_deductions_selected;
        this.is_all_deductions_selected = !this.is_all_deductions_selected;
        this.select_all_deductions(this.is_all_deductions_selected);
   

    }

    select_all_deductions(main_flag: Boolean) {
      
         for (let i = 0; i < this.deduction_list.length; i++) {
            this.deduction_list.at(i).get("is_selected")?.setValue(main_flag);

        }
    }

    select_all_earnings(main_flag: Boolean) {
       
        for (let i = 0; i < this.earning_list.length; i++) {
            this.earning_list.at(i).get("is_selected")?.setValue(main_flag);

        }
    }

    save_gross_composition(): void
    {
        try {

            this.spinnerService.show();
            const api_url = "Salary/CreateGrossComposition";
            const earnings = this.earning_list.getRawValue().filter((item: any) => item.is_selected).map((item: any) => ({
                ComponentID: item.ComponentId,

                Percentage: item.Percentage || 0,
                ComponentName: item.ComponentName
            }));

            for (let i = 0; i < earnings.length; i++) {
                if (earnings[i].Percentage == 0) {
                    throw new Error("PERCENTAGE CANNOT BE ZERO FOR " + earnings[i].ComponentName + "");
                }
            }

            const deductions = this.deduction_list.getRawValue().filter((item: any) => item.is_selected).map((item: any) => ({
                ComponentID: item.ComponentId,
                Percentage: item.Percentage || 0
            }));

            const components = [...earnings, ...deductions];


            // Temprory Remove Emloyee Id Array And Passing Single Value  this.selectedEmployees.map((item: any) => item.Value)


            const post_item = {
                BranchID: this.selectedBranch[0].Value,
                DepartmentID: this.selectedDepartment[0].Value,
                CreatedByID: this.UserID,
                EmployeeID: this.selectedEmployees[0].Value,
                Components: components
            };

            this._commonservice.ApiUsingPost(api_url, post_item).subscribe({
                next: (result) => {
                    if (result.Status) {
                        this.spinnerService.hide();
                        this.ShowToast(result.message, 'success');

                        this.validateSteps(1);



                    } else {
                        this.spinnerService.hide();
                        this.ShowToast(result.message, 'warning');
                        this.validateSteps(1);
                        console.log("selected index :" + this.stepper.selectedIndex);



                    }

                       
                       
                    this.get_gross_composition();




                },
                error: (error) => {
                    if (error.error !=undefined && error.error.Status==false) {
                        this.ShowToast(error.error.message, 'error');

                    } else {
                        this.ShowToast(error.message, 'error');

                    }

                    this.spinnerService.hide();
                }
            });

        } catch (error: any) {
            this.spinnerService.hide();
            if (error.error != undefined) {

                if (error.error.Status == false) {
                    this.ShowToast(error.error.message, 'error');

                }
            }

             else {
                this.ShowToast(error.message, 'error');

            }

           
        }
      
   

        // Get current values directly from form controls
       
     
       
    }

    get_gross_composition() {


        this.spinnerService.show();
        let api_url = "api/Salary/GetCustomGrossComponents";
        let request_body = {
            orgId: this.OrgID,
            EmployeeList: this.selectedEmployees.map((item: any) => item.Value),
            BranchList: this.selectedBranch.map((item: any) => item.Value) ,
            DeparmentList: this.selectedDepartment.map((item: any) => item.Value)
        };

        this._commonservice.Postwithjson(api_url, request_body).subscribe({
            next: (result) => {
                debugger;
                this.spinnerService.hide();
                let component_list: any[] = [];
                if (result.Status==true) {
                    component_list = result.ComponentList;
                    for (let i = 0; i < component_list.length; i++) {
                        let salary_component_element = this.salary_component_list.find(k => k.ComponentId == component_list[i].ComponentId);
                        if (salary_component_element != null && salary_component_element != null) {
                            this.salary_compoisition_list.push(salary_component_element);
                        }
                    }
                }
                

            },

            error: (error) => {
                this.spinnerService.hide();
                if (error.error != undefined) {
                    if (error.error.Status == false) {
                        this.ShowToast(error.error.message, 'error');

                    } 
                }
                 else {
                    this.ShowToast(error.message, 'error');

                }

              
            }
        });

    }


}
