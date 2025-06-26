import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from '../../services/httpcommon.service';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ShowalertComponent } from "../create-employee/showalert/showalert.component"
import { MatDialog } from '@angular/material/dialog';
import { DutyRosterDateEditComponent } from './duty-roster-date-edit/duty-roster-date-edit.component';


@Component({
  selector: 'app-emp-roaster-reports',
  templateUrl: './emp-roaster-reports.component.html',
  styleUrls: ['./emp-roaster-reports.component.css']
})
export class EmpRoasterReportsComponent implements OnInit {

    private AdminID!: string;
    public emp_shift_records: any[] = [];
    public employee_list: any[] = [];
    public days_list: Date[] = [];
    editableColumns: any = [];
    data_list: any[] = [];
    final_data_list: any[] = [];
    report_title: string = "";
    start_date: string = "";
    end_date: string = "";
    OrgID: string = "";
    UserID: string = "";
    tempdeparray: any[] = [];
    tableDataColors: any;
    

    // download report options
    headerColors: any = [];
    actionOptions: any;
    AssignedList: any[] = [];
    filteredList: any[] = [];
    displayColumns: any;
    employeeLoading: Boolean = false;
    ReportTitles: any = {};
    displayedColumns = [
        "No",
        "EmployeeName",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7"

    ];


    // filters


    BranchList: any;
    DepartmentList: any;
    selectedBranch: any[] = [];
    selectedDepartment: any[] = [];
    branchSettings: IDropdownSettings = {}
    departmentSettings: IDropdownSettings = {}
    selectedOrganization: any[] = [];
    OrgList: any[] = [];
    orgSettings: IDropdownSettings = {};
    export_list: any[] = [];
    default_branch_id = "-1";
    cellWiseButtons: any = [];

    max_week_of: Number = 2;



    allowed_to_edit(date: Date): boolean {
        const currentDate = new Date();

        // Remove time part for accurate date-only comparison
        const inputDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        return inputDateOnly >= currentDateOnly;
    }

    private prepare_data_list() {

        let index = 0;
        this.employee_list.forEach((item: any) => {
            let employee_item_list: {
                No: number;
                EmpId: any;
                EmployeeName: any;
                BranchID: any;
            
                [key: string]: any;  // <- This allows dynamic string keys
            } = {
                No: index + 1,
                EmpId: item.EmpID,
                EmployeeName: item.EmployeeName,
                BranchID: item.BranchID,
               
            };
            index++;

            for (let i = 0; i < this.days_list.length; i++) {
                const key_name = (i + 1).toString();
                employee_item_list[key_name] = this.getStartEndTime((this.days_list.at(i) as Date), item.EmpID);
                employee_item_list[key_name + '_date'] = this.days_list.at(i);
              
                employee_item_list["AllowEdit_"+key_name] = this.allowed_to_edit((this.days_list.at(i) as Date));
                employee_item_list["is_holiday_" + key_name] = this.get_is_holiday((this.days_list.at(i) as Date), item.EmpID);
                employee_item_list["is_weekoff_" + key_name] = this.get_is_week_off((this.days_list.at(i) as Date), item.EmpID);

                employee_item_list["show_weekoff_button_" + key_name] = employee_item_list["AllowEdit_" + key_name] && employee_item_list["is_holiday_" + key_name];
                employee_item_list["show_holiday_button_" + key_name] = employee_item_list["AllowEdit_" + key_name] && employee_item_list["is_weekoff_" + key_name];
                employee_item_list["ShiftID_" + key_name] = this.getStartEndTime_Shift((this.days_list.at(i) as Date), item.EmpID);



            }

           


            this.data_list.push(employee_item_list);


        });

        for (let i = 0; i < this.data_list.length; i++) {
          
            this.data_list[i]["week_off_count"] = this.get_week_off_count(this.data_list[i]);
        }


       

        this.final_data_list = this.data_list;
        this.employeeLoading = false;
        this.spinnerService.hide();
        if (this.final_data_list.length > 0) {
            this.export_list = ['Duty Roster Report'];
        } else {
            this.export_list = [];
        }
    }


    ngOnInit(): void {
        this.OrgID = localStorage.getItem("OrgID")!;
        this.UserID = localStorage.getItem("UserID")!;
        this.AdminID = localStorage.getItem("AdminID")!;
        this.GetOrganization();
    //    this.get_default_branch();


        this.displayColumns = {
            "No": "No",
            "EmployeeName": "EmployeeName",


        }

        this.tableDataColors = {
            1: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_1", value: false }] },
            ],
            2: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_2", value: false }] },
            ],
            3: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_3", value: false }] },
            ],
            4: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_4", value: false }] },
            ],
            5: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_5", value: false }] },
            ],
            6: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_6", value: false }] },
            ],
            7: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_7", value: false }] },
               ]
        }

        this.headerColors = {
            isBasic: { text: "#00a927", bg: "#daffe2" },
            isHRA: { text: "#00a927", bg: "#daffe2" },
            isDA: { text: "#00a927", bg: "#daffe2" },
            isTA: { text: "#00a927", bg: "#daffe2" },
            isMA: { text: "#00a927", bg: "#daffe2" },
            isLTA: { text: "#00a927", bg: "#daffe2" },
            isConveyance: { text: "#00a927", bg: "#daffe2" },
            isShiftAmount: { text: "#00a927", bg: "#daffe2" },
            isOTAmount: { text: "#00a927", bg: "#daffe2" },
            isIncentive: { text: "#00a927", bg: "#daffe2" },
            isEarningsOthers: { text: "#00a927", bg: "#daffe2" },
            isESI: { text: "#ff2d2d", bg: "#fff1f1" },
            isPF: { text: "#ff2d2d", bg: "#fff1f1" },
            isDeductionOthers: { text: "#ff2d2d", bg: "#fff1f1" },
            ispenalty: { text: "#ff2d2d", bg: "#fff1f1" },
            isPT: { text: "#ff2d2d", bg: "#fff1f1" },
            isTDS: { text: "#ff2d2d", bg: "#fff1f1" },
            isBasicStatus: { text: "#00a927", bg: "#daffe2" },
            isHRAStatus: { text: "#00a927", bg: "#daffe2" },
            isDAStatus: { text: "#00a927", bg: "#daffe2" },
            isTAStatus: { text: "#00a927", bg: "#daffe2" },
            isMAStatus: { text: "#00a927", bg: "#daffe2" },
            isLTAStatus: { text: "#00a927", bg: "#daffe2" },
            isConveyanceStatus: { text: "#00a927", bg: "#daffe2" },
            isPSAStatus: { text: "#00a927", bg: "#daffe2" },
            isFixedIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
            isLastMonthIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
            isPerformanceIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
            isBonusStatus: { text: "#00a927", bg: "#daffe2" },




            isShiftAmountStatus: { text: "#00a927", bg: "#daffe2" },
            isOTAmountStatus: { text: "#00a927", bg: "#daffe2" },
            isIncentiveStatus: { text: "#00a927", bg: "#daffe2" },
            isEarningsOthersStatus: { text: "#00a927", bg: "#daffe2" },
            isESIStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            isPFStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            isDeductionOthersStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            ispenaltyStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            isPTStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            isTDSStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            isDeductionsStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            isSDStatus: { text: "#ff2d2d", bg: "#fff1f1" },
            isFinePointsStatus: { text: "#ff2d2d", bg: "#fff1f1" },

            Basic: { text: "#00a927", bg: "#daffe2" },
            HRA: { text: "#00a927", bg: "#daffe2" },
            TA: { text: "#00a927", bg: "#daffe2" },
            DA: { text: "#00a927", bg: "#daffe2" },
            MA: { text: "#00a927", bg: "#daffe2" },
            LTA: { text: "#00a927", bg: "#daffe2" },
            Conveyance: { text: "#00a927", bg: "#daffe2" },
            totalGross: { text: "#00a927", bg: "#daffe2" },
            earnings: { text: "#00a927", bg: "#daffe2" },
            Gross: { text: "#00a927", bg: "#daffe2" },
            deductions: { text: "#ff2d2d", bg: "#fff1f1" },

            Deductions: { text: "#ff2d2d", bg: "#fff1f1" },
            TotalDeduction: { text: "#240000", bg: "#ff6767" },
            // leaveDeduction : {text:"#ff2d2d",bg:"#fff1f1"},
            Penalty: { text: "#ff2d2d", bg: "#fff1f1" },
            Deductionsothers: { text: "#ff2d2d", bg: "#fff1f1" },
            LoanDeduction: { text: "#ff2d2d", bg: "#fff1f1" },
            AdvanceDeduction: { text: "#ff2d2d", bg: "#fff1f1" },
            ESI: { text: "#ff2d2d", bg: "#fff1f1" },
            PF: { text: "#ff2d2d", bg: "#fff1f1" },
            PT: { text: "#ff2d2d", bg: "#fff1f1" },
            TDS: { text: "#ff2d2d", bg: "#fff1f1" },
            OtherEarnings: { text: "#00a927", bg: "#daffe2" },
            Earningsothers: { text: "#00a927", bg: "#daffe2" },
            // Gross: { text: "#00a927", bg: "#daffe2" },
            EarnedBasicSalary: { text: "#00a927", bg: "#daffe2" },
            TotalOtherEarnings: { text: "#006116", bg: "#65ff87" },
            TotalGross: { text: "#006116", bg: "#65ff87" },
            Incentive: { text: "#00a927", bg: "#daffe2" },
            ShiftAmount: { text: "#00a927", bg: "#daffe2" },
            OT: { text: "#00a927", bg: "#daffe2" },
        };

        this.editableColumns = {
         
        }

        this.cellWiseButtons = {
            "1": [
                
                {
                    name: "WeekOff", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit', filters: { AllowEdit_1:true },
                },
              
            ],
            "2": [

                {
                    name: "WeekOff", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit', filters: { AllowEdit_2: true },


                },
                
            ],
            "3": [


                {
                    name: "WeekOff", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit', filters: { AllowEdit_3: true },


                },
             
            ],
            "4": [


                {
                    name: "WeekOff", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit', filters: { AllowEdit_4: true },


                },
               
            ],
            "5": [


                {
                    name: "WeekOff", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit', filters: { AllowEdit_5: true },


                },
              
            ],
            "6": [


                {
                    name: "WeekOff", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit', filters: { AllowEdit_6: true },


                },
              
            ],
            "7": [


                {
                    name: "WeekOff", icon: "fa fa-pencil", class: "btn btn-sm", tooltip: 'Click To  Edit', filters: { AllowEdit_7: true },


                },
               
            ]
            
            };

        this.branchSettings = {
            singleSelection: false,
            idField: "Value",
            textField: "Text",
            itemsShowLimit: 1,
            allowSearchFilter: true,
        };

        this.departmentSettings = {
            singleSelection: false,
            idField: "Value",
            textField: "Text",
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


        this.actionOptions = [

        ];


    }

    convertDateFormat(dateStr: string): Date {
        // Expecting format dd-MM-yyyy
        const [day, month, year] = dateStr.split('-');

        // Basic validation
        if (!day || !month || !year || day.length !== 2 || month.length !== 2 || year.length !== 4) {
            throw new Error('Invalid date format. Expected format: dd-MM-yyyy');
        }

        return new Date(`${year}/${month}/${day}`);

    }
    onCellButtonClicked(event: any) {
        console.log('Clicked:', event.button.name);
        // event.row, event.column, event.button.name
        if (event.button.name == "WeekOff") {
            console.log("row_data" + event.row);
            console.log(event.row);
            console.log("column" + event.column);
            let is_week_off = event.row["is_weekoff_" + event.column];
            let is_holiday = event.row["is_holiday_" + event.column];
            if (is_week_off) {
                this.openTimeDialog(event.row.EmpId, event.column, '', '', true, false, event.row.BranchID, event.row[event.column + "_date"], event.row.EmployeeName, event.row.week_off_count,'');
            } else if (is_holiday) {
                this.openTimeDialog(event.row.EmpId, event.column, '', '', false, true, event.row.BranchID, event.row[event.column + "_date"], event.row.EmployeeName, event.row.week_off_count,'');

            } else {
                let date_value = event.row[event.column];
                let from_time = "";
                let to_time = "";
                let Shift_id = event.row["ShiftID_" + event.column];
                if (date_value.includes('-')) {
                    from_time = date_value.split('-')[0];
                    to_time = date_value.split('-')[1];
                }
                this.openTimeDialog(event.row.EmpId, event.column, from_time, to_time, false, false, event.row.BranchID, event.row[event.column + "_date"], event.row.EmployeeName, event.row.week_off_count, Shift_id);

            }

            
           // this.edit_duty_roaster(event.row, event.column, '', true, false);
            //this.openTimeDialog(event.row.EmpID, event.column,);
        }
        else if (event.button.name == "Holiday")
        {
            this.edit_duty_roaster(event.row, event.column, '', false, true);
        }
    }



    getWorkStartEndTime(start: string, end: string): string {
        // Expecting format dd-MM-yyyy
        let result = "";

        const start_date = this.parseCustomDate(start);
        const end_date = this.parseCustomDate(end);
        return start_date?.toLocaleTimeString("en-us", { hour: 'numeric', minute: '2-digit', hour12: true }) + '-' + end_date?.toLocaleTimeString("en-us", { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    parseCustomDate(dateStr: string): Date | null {
        const dateTimeParts = dateStr.split(' ');
        if (dateTimeParts.length !== 2) return null;

        const [datePart, timePart] = dateTimeParts;
        const [day, month, year] = datePart.split('/').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        // Months in JS Date are 0-based (0 = January, 11 = December)
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }
    private add_distinct_employee_list() {

        this.emp_shift_records.forEach((item: any) => {

            let item_exits = this.employee_list.find(i => i.EmpID == item.EmpID);
            if (item_exits == null) {
                this.employee_list.push(item);
            }

        });




    }


    get_week_off_count(item: any): Number {
     
        let week_off_count = 0;
        for (let i = 1; i <= 7; i++) {
            if (item["is_weekoff_" + i] == true) {
                week_off_count++;
            }
        }
        return week_off_count;
    }

    get_is_week_off(workDate: Date, empId: string): Boolean | undefined {
        let item = this.emp_shift_records.find(i => this.convertDateFormat(i.Date.toString()).getDate() == workDate.getDate() && i.EmpID == empId);
      
        if (item != null) {
            return item.isweekoff == null ? false : item.isweekoff ;
        } else {
            return false;
        }
    }

    get_is_holiday(workDate: Date, empId: string): Boolean | undefined {
        let item = this.emp_shift_records.find(i => this.convertDateFormat(i.Date.toString()).getDate() == workDate.getDate() && i.EmpID == empId);
        if (item != null) {
            return item.isholiday == null ? false : item.isholiday;
        } else {
            return false;
        }
        

    }

    getStartEndTime(workDate: Date, empId: string): string {
        let result: string = "";
        let item = this.emp_shift_records.find(i => this.convertDateFormat(i.Date.toString()).getDate() == workDate.getDate() && i.EmpID == empId);
        if (item == null || item == undefined) {
            result = "-";
        } else {
            if (item.isholiday) {
                result = "H/O";
                return result;
            }
            else if (item.isweekoff) {
                result = "W/O";
                return result;
            }
            else if (item.WorkStartTime.toString().includes('/')) {
                result = this.getWorkStartEndTime(item.WorkStartTime.toString(), item.WorkEndTime.toString());

            } else {
                result = item.WorkStartTime.toString()+"-"+ item.WorkEndTime.toString();

            }
        }

        return result;
    }

    getStartEndTime_Shift(workDate: Date, empId: string): string {
        let result: string = "";
        let item = this.emp_shift_records.find(i => this.convertDateFormat(i.Date.toString()).getDate() == workDate.getDate() && i.EmpID == empId);
        if (item == null || item == undefined) {
            result = "-";
        } else {
            result = item.ShiftID;
        }

        return result;
    }

    private add_distict_dateList() {

        this.emp_shift_records.forEach((item: any) => {

            let compare_date: Date = this.convertDateFormat(item.Date.toString());

            let item_exits = this.days_list.findIndex(i => i.getDate() == compare_date.getDate());

            if (item_exits == -1) {
                this.days_list.push(this.convertDateFormat(item.Date.toString()));
            }

        });

        for (let i = 0; i < this.days_list.length; i++) {
            let key_name = (i + 1).toString();
            this.displayColumns[key_name] = this.datepipe.transform(this.days_list[i], "EEEE");


        }


        this.prepare_data_list();
    }



    isValidTimeRange(timeRange: string): { valid: boolean, reason?: string } {
    // Allow leading zeros in hour (e.g., 09:00 AM) with proper spacing and format
    const timeRangeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)-(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

    if (!timeRange) {
        return { valid: false, reason: "Time range is empty." };
    }

    if (!timeRangeRegex.test(timeRange)) {
        return {
            valid: false,
            reason: "Time range must be in the format hh:mm AM/PM-hh:mm AM/PM with a space after the time and a dash in between."
        };
    }

    return { valid: true };
}

    actionEmitter(data: any) {
        if (data == null) return;

        if (data.action.name == 'editColumn') {

            let is_timeValid = this.isValidTimeRange(data.row.value);
            if (is_timeValid.valid) {
                this.edit_duty_roaster(data.row.data, data.row.column, data.row.value,false,false);
            } else {
                this.ShowToast(is_timeValid.reason!.toString(), 'warning');
            }
            
        }
    }

    edit_list_records(EmpID: any, value: any, column: any, isweek_off: Boolean, isholiday: Boolean) {
    
        let employee_data = this.final_data_list.find((item: any) => item.EmpId == EmpID);
        if (employee_data != null && employee_data !=undefined) {
            employee_data[column] = value;
        
            if (isweek_off != undefined) {
                employee_data["is_weekoff_" + column] = isweek_off;
            }

            if (isholiday != undefined) {
                employee_data["is_holiday_" + column] = isholiday;
            }
            
            employee_data["week_off_count"] = this.get_week_off_count(employee_data);
         
        }
    }

    edit_duty_roaster(data: any, column: any, value: any,is_weekof:Boolean,is_holiday:Boolean) {

        this.spinnerService.show();
        var text_box_value = value;
        let from_time = "";
        let to_time = "";
        if (text_box_value.includes('-')) {
            from_time = text_box_value.toString().split('-')[0];
            to_time = text_box_value.toString().split('-')[1]
        }

        var json_data = {
            EmployeeId: data.EmpId,
            BranchId: data.BranchID,
            Date: this.datepipe.transform(data[column + '_date'],"yyyy-MM-dd"),
            StartTime: from_time,
            EndTime: to_time,
            isweekoff: is_weekof,
            isholiday: is_holiday
        };
        console.log(json_data);
        let api_url = "api/DutyRoster/EditDutyRosters";

        if (is_holiday) {
            json_data["StartTime"] = null!;
            json_data["EndTime"] = null!;

        }
        if (is_weekof) {
            json_data["StartTime"] = null!;
            json_data["EndTime"] = null!;

        }
 
        this.common_service.Postwithjson(api_url, json_data).subscribe({
            next: (result) => {
               
                this.spinnerService.hide();
                if (result.Status) {
                    let over_write_value = text_box_value;
                    if (is_weekof) {
                        over_write_value = "W/O";
                    }
                    if (is_holiday) {
                        over_write_value="H/O"
                    }
                    this.edit_list_records(data.EmpId, over_write_value, column,false,false);
                    this.ShowToast(result.message, 'success');
                } else {
                    this.ShowToast(result.message, 'warning');
                }
            },
            error: (error) => {
                this.spinnerService.hide();
                if (error.error != undefined) {
                    if (error.error.Status == false) {
                        this.ShowToast(error.error.message, 'error');
                    } else {
                        this.ShowToast(error.message, 'error');

                    }
                }
            }
        });

    }


    load_employeedata() {
        try {

            this.final_data_list = [];
            this.data_list = [];
            this.days_list = [];
            this.employee_list = [];
            this.employeeLoading = true;
            this.spinnerService.show();
            let json_data = {
                UserId: this.AdminID,
                BranchList: this.selectedBranch.map((item: any) => { return { BranchId: item.Value } }),
                DeptList: this.selectedDepartment.map((item: any) => { return { DeptId: item.Value } })
            };
            let api_endpoint = "api/Dutyroster/DutyRoster";

            this.common_service.Postwithjson(api_endpoint, json_data).subscribe({
                next: (result) => {

                    this.emp_shift_records = result.shiftexist;
                    this.add_distinct_employee_list();
                    this.add_distict_dateList();




                    if (this.days_list.length > 0) {

                        this.start_date = this.datepipe.transform(this.days_list[0], "dd-MM-yyyy")!.toString();
                        this.end_date = this.datepipe.transform(this.days_list[this.days_list.length - 1], "dd-MM-yyyy")!.toString();

                    }

                },
                error: (error) => {
                    this.spinnerService.hide();

                    if (error instanceof Error) {
                        this.toast_service.error(error.message);
                    } else {
                        this.toast_service.error("unexpected error : " + error.message);
                    }
                },
                complete: () => {




                }
            });
        } catch (exception) {
            if (exception instanceof Error) {
                this.toast_service.error(exception.message);
            } else {
                this.toast_service.error("unexpected error : " + exception);
            }
        }

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

    onBranchSelect(item: any) {


        this.GetDepartments();

    }

    onDeptDeSelectAll() {
        this.tempdeparray = [];

    }
    onDeptDeSelect(item: any) {


        this.tempdeparray.splice(this.tempdeparray.indexOf(item), 1);

    }

    onBranchDeSelect_All(item: any) {


        this.selectedBranch = [];
        this.DepartmentList = [];



    }
    onBranchSelect_All(item: any) {

        this.selectedBranch = item;
        this.GetDepartments();

    }

    onBranchDeSelect(item: any) {
        
        this.selectedBranch = [];
        this.DepartmentList = [];
        this.GetDepartments();
    }

    onDeptSelect(item: any) {


    }
    onDeptSelectAll(item: any) {


    }

    openTimeDialog(empId: any, column: string, fromTime: any, toTime: any, is_week_off: Boolean, is_holiday: Boolean, BranchId: string, edit_date: Date, emp_name: string, week_off_count: string, shift_id:string) {
        const dialogRef = this.dialog.open(DutyRosterDateEditComponent, {
            data: {
                fromTime: fromTime,
                toTime: toTime,
                isWeekOff: is_week_off,
                isHoliday: is_holiday,
                empId: empId,
                column: column,
                BranchId: BranchId,
                Date: edit_date,
                EmpName: emp_name,
                max_week_off_count: this.max_week_of,
                week_off_count: week_off_count,
                department_list: this.selectedDepartment,
                branch_list: this.selectedBranch,
                ShiftID: shift_id

            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Form Data:', result);
                this.edit_list_records(result.EmployeeId, result.over_write_value, result.column, result.isweekoff, result.isholiday);
            }
        });

    }

    GetOrganization() {
        let ApiURL = "Admin/GetSuborgList?OrgID=" + this.OrgID + "&AdminId=" + this.UserID
        this.common_service.ApiUsingGetWithOneParam(ApiURL).subscribe((data) => {
            this.OrgList = data.List
            if (data.List.length == 1) {
                this.selectedOrganization = [{ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text }]
                this.onselectedOrg({ Value: this.OrgList[0].Value, Text: this.OrgList[0].Text })
            }
        }, (error: any) => {
            console.log(error);
        });
    }

    GetBranches() {
        this.selectedBranch = [];
        let suborgid = this.selectedOrganization.map(res => res.Value)[0] || 0
        let ApiURL = "Admin/GetBranchListupdated?OrgID=" + this.OrgID + "&SubOrgID=" + suborgid + "&AdminId=" + this.AdminID
        this.common_service
            .ApiUsingGetWithOneParam(
                ApiURL
            )
            .subscribe(
                (data) => {
                    this.BranchList = data.List;
                    if (this.BranchList.length > 0) {
                        if (this.BranchList.length == 1) {
                            this.selectedBranch = [
                                {
                                    Text: this.BranchList[0].Text,
                                    Value: this.BranchList[0].Value,
                                },
                            ];

                            this.GetDepartments();

                        }
                    } else {
                        if (this.default_branch_id != "-1") {
                            let default_branch_object = this.BranchList.find((item: any) => item.Value == this.default_branch_id);
                            if (default_branch_object != null) {
                                this.selectedBranch = [
                                    {
                                        Text: default_branch_object.Text,
                                        Value: default_branch_object.Value,
                                    },
                                ];
                                this.GetDepartments();
                            }
                        }
                        
                    }
                },
                (error) => {
                    // this.globalToastService.error(error);
                    this.ShowToast(error, "error")
                    console.log(error);
                }
            );
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
      
        this.selectedDepartment = [];
        this.DepartmentList = [];
        var loggedinuserid = localStorage.getItem("UserID");
        const json =
            this.selectedBranch && this.selectedBranch.length > 0
                ? {
                    OrgID: this.OrgID, AdminID: loggedinuserid,
                    Branches: this.selectedBranch.map((br: any) => {
                        return {
                            id: br.Value,
                        };
                    }),
                }
                : { Branches: [{ id: this.BranchList[0].Value }], OrgID: this.OrgID };

        this.common_service.ApiUsingPost("Portal/GetEmployeeDepartments", json).subscribe(
            (data) => {
                // console.log(data)
                if (data.DepartmentList.length > 0) {
                    this.DepartmentList = data.List;
                    // console.log(this.DepartmentList,"department list")

                }
            },
            (error) => {
                // this.globalToastService.error(error);
                this.ShowToast(error, "error")
                console.log(error);
            }
        );
    }


    /**
     *
     */


    constructor(private spinnerService: NgxSpinnerService, private toast_service: ToastrService, private common_service: HttpCommonService, public datepipe: DatePipe, public dialog: MatDialog) {


    }

    private get_default_branch(): void {

       
  


        let api_url = "api/Settings/GetDefaultBranch?userId=" + this.UserID + "";
        this.common_service.GetWithOneParam(api_url).subscribe({
            next: (result: any) => {
                console.log(result);

                if (result.Status == true) {


                    let selected_org = this.OrgList.find(i => i.Value == result.SuborgID);

                    if (selected_org != null) {
                        this.selectedOrganization = [{ Value: selected_org.Value, Text: selected_org.Text }];
                        this.selectedBranch = [{ Value: result.DefaultBranchID, Text: selected_org.Text }];
                        this.default_branch_id = result.DefaultBranchID;
                        this.GetBranches();

                    }

                }
            },
            error: (error: any) => {
                this.ShowToast(error, "error")
            }
        });
    }


}