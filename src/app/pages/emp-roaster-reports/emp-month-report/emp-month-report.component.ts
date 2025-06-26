import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material/dialog';
import { ShowalertComponent } from "../../create-employee/showalert/showalert.component"
import { DutyRosterDateEditComponent } from '../duty-roster-date-edit/duty-roster-date-edit.component';


@Component({
  selector: 'app-emp-month-report',
  templateUrl: './emp-month-report.component.html',
  styleUrls: ['./emp-month-report.component.css']
})
export class EmpMonthReportComponent implements OnInit {

    private AdminID!: string;
    public emp_shift_records: any[] = [];
    public employee_list: any[] = [];
    public days_list: Date[] = [];
    editableColumns: any = [];
    data_list: any[] = [];
    tempdeparray: any[] = [];
    start_date: string = "";
    end_date: string = "";
    final_data_list: any[] = [];
    headerColors: any = [];
    actionOptions: any;
    AssignedList: any[] = [];
    filteredList: any[] = [];
    displayColumns: any;
    employeeLoading: Boolean = false;
    ReportTitles: any = {};
    default_branch_id: string = "-1";
    displayedColumns = [
        "No",
        "EmployeeName",


    ];

    OrgID: string = "";
    UserID: string = "";

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
    tableDataColors: any;
    cellWiseButtons: any;
    shift_list: any[] = [];
    max_week_of: Number = 4;

    allowed_to_edit(date: Date): boolean {
        const currentDate = new Date();

        // Remove time part for accurate date-only comparison
        const inputDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        return inputDateOnly >= currentDateOnly;
    }

    get_is_holiday(workDate: Date, empId: string): Boolean | undefined {
        let item = this.emp_shift_records.find(i => this.convertDateFormat(i.Date.toString()).getDate() == workDate.getDate() && i.EmpID == empId);
        if (item != null) {
            return item.isholiday == null ? false : item.isholiday;
        } else {
            return false;
        }


    }


    get_is_week_off(workDate: Date, empId: string): Boolean | undefined {
        let item = this.emp_shift_records.find(i => this.convertDateFormat(i.Date.toString()).getDate() == workDate.getDate() && i.EmpID == empId);

        if (item != null) {
            return item.isweekoff == null ? false : item.isweekoff;
        } else {
            return false;
        }
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

    openTimeDialog(empId: any, column: string, fromTime: any, toTime: any, is_week_off: Boolean, is_holiday: Boolean, BranchId: string, edit_date: Date, emp_name: string, week_off_count:string,shift_id:string) {
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
                this.edit_list_records(result.EmployeeId, result.over_write_value, result.column, result.isweekoff, result.isholiday, result.ShiftID);
            }
        });

    }


    onCellButtonClicked(event: any) {
      
        if (event.button.name == "WeekOff") {
            console.log("row_data" + event.row);
            console.log(event.row);
            console.log("column" + event.column);
            let is_week_off = event.row["is_weekoff_" + event.column];
            let is_holiday = event.row["is_holiday_" + event.column];
            if (is_week_off) {
                this.openTimeDialog(event.row.EmpId, event.column, '', '', true, false, event.row.BranchID, event.row[event.column + "_date"], event.row.EmployeeName, event.row.week_off_count,"");
            } else if (is_holiday) {
                this.openTimeDialog(event.row.EmpId, event.column, '', '', false, true, event.row.BranchID, event.row[event.column + "_date"], event.row.EmployeeName, event.row.week_off_count,"");

            } else {
            
                let from_time = event.row["WorkStartTime_" + event.column];
                let to_time = event.row["WorkEndTime_" + event.column];
                let Shift_id = event.row["ShiftID_" + event.column];
                this.openTimeDialog(event.row.EmpId, event.column, from_time, to_time, false, false, event.row.BranchID, event.row[event.column + "_date"], event.row.EmployeeName, event.row.week_off_count, Shift_id);

            }


            // this.edit_duty_roaster(event.row, event.column, '', true, false);
            //this.openTimeDialog(event.row.EmpID, event.column,);
        }
      
    }

    get_shift_name_work_startEndTime(startTime: string, endTime: string): String {
        debugger;
        let shift_record = this.shift_list.find((item: any) => this.get_time(item.WorkStartTime) == this.get_time(startTime) && this.get_time(item.WorkEndTime) == this.get_time(endTime));
        if (shift_record != undefined) {
            console.log("shift record found");
            return shift_record.ShortName;
        } else {
            console.log("shift record not found returning regular as default value");
            return "R";
        }
    }

    get_shift_name(startTime: string, endTime: string, ShiftID: string): String {
        debugger;
        let shift_record = this.shift_list.find((item: any) => item.ShiftID == ShiftID);
        if (shift_record != undefined) {
            console.log("shift record found");
            return shift_record.ShortName;
        } else {
            console.log("shift record not found returning regular as default value");
            return "R";
        }
    }


    edit_list_records(EmpID: any, value: any, column: any, isweek_off: Boolean, isholiday: Boolean, ShiftID:string) {
        
        let employee_data = this.final_data_list.find((item: any) => item.EmpId == EmpID);
        if (employee_data != null && employee_data != undefined) {
          
            if (value.includes('-')) {
                let start_time = value.split('-')[0];
                let end_time = value.split('-')[1];
                employee_data[column] = this.get_shift_name(start_time, end_time, ShiftID);


            }


            if (isweek_off != undefined) {
                employee_data["is_weekoff_" + column] = isweek_off;
            }

            if (isholiday != undefined) {
                employee_data["is_holiday_" + column] = isholiday;
            }

            employee_data["week_off_count"] = this.get_week_off_count(employee_data);

        }
    }

    get_week_off_count(item: any): Number {

        let week_off_count = 0;
        for (let i = 1; i <= 31; i++) {
            if (item["is_weekoff_" + i] == true) {
                week_off_count++;
            }
        }
        return week_off_count;
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
                employee_item_list["AllowEdit_" + key_name] = this.allowed_to_edit((this.days_list.at(i) as Date));
                employee_item_list["is_holiday_" + key_name] = this.get_is_holiday((this.days_list.at(i) as Date), item.EmpID);
                employee_item_list["is_weekoff_" + key_name] = this.get_is_week_off((this.days_list.at(i) as Date), item.EmpID);

                employee_item_list["show_weekoff_button_" + key_name] = employee_item_list["AllowEdit_" + key_name] && employee_item_list["is_holiday_" + key_name];
                employee_item_list["show_holiday_button_" + key_name] = employee_item_list["AllowEdit_" + key_name] && employee_item_list["is_weekoff_" + key_name];
                employee_item_list["WorkStartTime_" + key_name] = this.getStartTime((this.days_list.at(i) as Date), item.EmpID);
                employee_item_list["WorkEndTime_" + key_name] = this.getEndTime((this.days_list.at(i) as Date), item.EmpID);
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

    private add_distinct_employee_list() {

        this.emp_shift_records.forEach((item: any) => {

            let item_exits = this.employee_list.find(i => i.EmpID == item.EmpID);
            if (item_exits == null) {
                this.employee_list.push(item);
            }

        });

    }

    //getStartEndTime(workDate: Date, empId: string): string {
    //    let result: string = "";
    //    let item = this.emp_shift_records.find(i => this.convertDateFormat(i.Date.toString()).getDate() == workDate.getDate() && i.EmpID == empId);
    //    if (item == null || item == undefined) {
    //        result = "-";
    //    } else {
    //        result = this.getWorkStartEndTime(item.WorkStartTime.toString(), item.WorkEndTime.toString());
    //    }

    //    return result;
    //}
    get_shift_short_code(name:string):string {
        let current_shift = this.shift_list.find((item: any) => item.ShiftName == name);
        if (current_shift != undefined || current_shift != null) {
            return current_shift.ShortName;
        } else {
            return "R";
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
            else if (item.ShiftName !=undefined) {
                result = this.get_shift_short_code(item.ShiftName);

            } else {
                result = this.get_shift_name_work_startEndTime(item.WorkStartTime, item.WorkEndTime).toString();

            }
        }

        return result;
    }


    getStartTime(workDate: Date, empId: string): string {
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
            else {
                result = this.get_time(item.WorkStartTime);

            } 
        }

        return result;
    }

    getEndTime(workDate: Date, empId: string): string {
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
            else {
                result = this.get_time(item.WorkEndTime);

            }
        }

        return result;
    }



    actionEmitter(data: any) {

    }



    ngOnInit(): void {

        this.AdminID = localStorage.getItem("AdminID")!;
       
        this.OrgID = localStorage.getItem("OrgID")!;
        this.UserID = localStorage.getItem("UserID")!;
        this.AdminID = localStorage.getItem("AdminID")!;

        this.GetOrganization();
        this.displayColumns = {
            "No": "No",
            "EmployeeName": "EmployeeName"


        }

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

        this.cellWiseButtons = [];


        for (let i = 1; i <= 31; i++) {
            this.cellWiseButtons[i.toString()] = [
                {
                    name: "WeekOff",
                    icon: "fa fa-pencil",
                    class: "btn btn-sm",
                    tooltip: "Click To  Edit",
                    filters: {
                        [`AllowEdit_${i}`]: true
                    }
                }
            ];
        }
        this.tableDataColors = [];
        for (let i = 1; i <= 31; i++) {
            this.tableDataColors[i.toString()] = [
                {
                    styleClass: "disabled_edit",
                    filters: {
                        [`AllowEdit_${i}`]: false
                    }
                }
            ];
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
            ],
            8: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_8", value: false }] },
            ],
            9: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_9", value: false }] },
            ],
            10: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_10", value: false }] },
            ],
            11: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_11", value: false }] },
            ],
            12: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_12", value: false }] },
            ],
            13: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_13", value: false }] },
            ],
            14: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_14", value: false }] },
            ],
            15: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_15", value: false }] },
            ],
            16: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_16", value: false }] },
            ],
            17: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_17", value: false }] },
            ],
            18: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_18", value: false }] },
            ],
            19: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_19", value: false }] },
            ],
            20: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_20", value: false }] },
            ],
            21: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_21", value: false }] },
            ],
            22: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_22", value: false }] },
            ],
            23: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_23", value: false }] },
            ],
            24: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_24", value: false }] },
            ],
            25: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_25", value: false }] },
            ],
            26: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_26", value: false }] },
            ],
            27: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_27", value: false }] },
            ],
            28: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_28", value: false }] },
            ],
            29: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_29", value: false }] },
            ],
            30: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_30", value: false }] },
            ],
            31: [
                { styleClass: "disabled_edit", filter: [{ col: "AllowEdit_31", value: false }] },
            ],

        }
    }


    // date formaters


    convertDateFormat(dateStr: string): Date {
        // Expecting format dd-MM-yyyy
        const [day, month, year] = dateStr.split('-');

        // Basic validation
        if (!day || !month || !year || day.length !== 2 || month.length !== 2 || year.length !== 4) {
            throw new Error('Invalid date format. Expected format: dd-MM-yyyy');
        }

        return new Date(`${year}/${month}/${day}`);

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

    get_time(start: string): string {
        // Expecting format dd-MM-yyyy
        let result = "";
        if (start.includes('-') || start.includes('/')) {
            const start_date = this.parseCustomDate(start);

            return start_date?.toLocaleTimeString("en-us", { hour: 'numeric', minute: '2-digit', hour12: true }).toString()!;
        } else {
            return start;
        }

      
    }

   getShiftCode(shiftName: string): string {
    // Normalize and split the shift name
    const words = shiftName.trim().toLowerCase().split(/\s+/);

    // Take first letter of each word and capitalize
    const code = words.map(word => word.charAt(0).toUpperCase()).join('');

    return code;
}
    private addShiftName() {
        this.shift_list = [];

        this.emp_shift_records.forEach((item: any) => {
            if (item.ShiftName != undefined) {
                let existing_shift_records = this.shift_list.find((shift: any) => shift.ShiftName == item.ShiftName);
                if (existing_shift_records == undefined || existing_shift_records == null) {
                    this.shift_list.push(
                        {
                            ShiftName: item.ShiftName,
                            ShiftType: item.ShiftType,
                            ShortName: this.getShiftCode(item.ShiftName),
                            WorkStartTime: item.WorkStartTime,
                            WorkEndTime: item.WorkEndTime,
                            ShiftID: item.ShiftID
                        });
                }
            }
          

        });
        this.shift_list = this.shift_list.filter((item: any) => item.ShiftID > 0);
        this.shift_list.push
            ({
            ShiftID:0,
            ShiftName: 'Regular (No Shift Allocated)',
            ShiftType: 'Default',
            ShortName: 'R',
            WorkStartTime: '',
            WorkEndTime: ''
        });
    }

    private add_distict_dateList() {

        this.displayedColumns = [
            "No",
            "EmployeeName",


        ];
        this.emp_shift_records.forEach((item: any) => {

            let compare_date: Date = this.convertDateFormat(item.Date.toString());

            let item_exits = this.days_list.findIndex(i => i.getDate() == compare_date.getDate());

            if (item_exits == -1) {
                this.days_list.push(this.convertDateFormat(item.Date.toString()));
            }

        });

        for (let i = 0; i < this.days_list.length; i++) {
            let key_name = (i + 1).toString();
            this.displayedColumns.push(key_name);
            this.displayColumns[key_name] = this.datepipe.transform(this.days_list[i], "dd");

        }


        this.prepare_data_list();
    }

     load_employeedata() {
         try {

             this.displayColumns = {
                 "No": "No",
                 "EmployeeName": "EmployeeName"


             };

             this.final_data_list = [];
             this.data_list = [];
             this.days_list = [];
             this.employee_list = [];

            this.employeeLoading = true;
            this.spinnerService.show();
          
             let json_data = {
                 UserId: this.AdminID,
                 BranchList: this.selectedBranch.map((item: any) => { return { BranchId: item.Value } }),
                 DeptList: this.selectedDepartment.map((item: any) => { return { DeptId: item.Value } }),
                 IsMonth:true
             };
             let api_endpoint = "api/Dutyroster/DutyRoster";

             this.common_service.Postwithjson(api_endpoint, json_data).subscribe({
                next: (result) => {

                     this.emp_shift_records = result.shiftexist;
                     this.addShiftName();
                     console.log(this.shift_list);
                    this.add_distinct_employee_list();
                    this.add_distict_dateList();
                    



                    if (this.days_list.length > 0) {

                        this.start_date = this.datepipe.transform(this.days_list[0], "dd-MM-yyyy")!.toString();
                        this.end_date = this.datepipe.transform(this.days_list[this.days_list.length - 1], "dd-MM-yyyy")!.toString();

                    }

                },
                error: (error) => {
                    this.spinnerService.hide();
                    console.log("spinner service is hidden");
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

    constructor(private spinnerService: NgxSpinnerService, private toast_service: ToastrService, private common_service: HttpCommonService, public datepipe: DatePipe, public dialog: MatDialog) {


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
        debugger;
        this.selectedBranch = [];
        this.DepartmentList = [];
        this.GetDepartments();
    }

    onDeptSelect(item: any) {


    }
    onDeptSelectAll(item: any) {


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


}
