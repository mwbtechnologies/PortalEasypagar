import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowalertComponent } from "../../create-employee/showalert/showalert.component"
import { AddeditshiftComponent } from '../../shift-master/addeditshift/addeditshift.component';

@Component({
  selector: 'app-duty-roster-date-edit',
  templateUrl: './duty-roster-date-edit.component.html',
  styleUrls: ['./duty-roster-date-edit.component.css']
})
export class DutyRosterDateEditComponent implements OnInit {

    timeForm!: FormGroup;
    employee_name: string = "";
    employee_date!: Date;
    max_week_off_count:Number = 0;
    week_off_count: Number = 0;
    shift_list: any[] = [];
    show_shift_selection: Boolean = false;


    //
    branch_list: any[] = [];
    department_list: any[] = [];
    admin_id: string = "";




    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<DutyRosterDateEditComponent>,
        private datepipe: DatePipe,
        private common_service: HttpCommonService,
        private spinnerService: NgxSpinnerService,
        public dialog: MatDialog
    ) { this.admin_id = localStorage.getItem("AdminID")!; }



    fetch_shift_list() {
        
        let api_url = "api/Portal/GetShiftbyBranch";
        let json_body = {
            BranchID: this.branch_list.map((item: any) => item.Value),
            DepartmentID: this.department_list.map((item:any)=>item.Value),
            AdminId:this.admin_id

        }
        this.common_service.Postwithjson(api_url, json_body)
       .subscribe({
           next: (response) => {
               if (response.Status) {
                   this.shift_list = response.List;
                   if (this.shift_list.length > 0) {
                       this.show_shift_selection = true;
                   }

                   this.shift_list.push(
                       {
                           ID: '0',
                           Name: "Regular Shift",
                           StartTime: "-1",
                           EndTime: "-1"
                       }
                   );
                   this.select_default_shift();
               }

           }
        });


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
    convert12To24(time12: string): string {
        const [time, modifier] = time12.trim().split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }

    get_shift_name_work_startEndTime(startTime: string, endTime: string): string {
        let result: string = "";
       
        if (this.data.ShiftID != undefined) {

            if (Number(this.data.ShiftID) > 0) {
                result = this.data.ShiftID;
                return result;
            } else {
                result = "0";
                return result;
            }


        } else {
            const inputStart = this.convert12To24(startTime); // "9:10 AM" -> "09:10:00"
            const inputEnd = this.convert12To24(endTime);
            const shift_record = this.shift_list.find((item: any) =>
                item.StartTime == inputStart.toString() && item.EndTime == inputEnd
            );
            if (shift_record != undefined) {
                
                return shift_record.ID;
            } else {
                
                return "0";
            }
        }


        return result;
       
    }

    get_shift_name(startTime: string, endTime: string): string {
        let result: string = "";
       
            const inputStart = this.convert12To24(startTime); // "9:10 AM" -> "09:10:00"
            const inputEnd = this.convert12To24(endTime);
            const shift_record = this.shift_list.find((item: any) =>
                item.StartTime == inputStart.toString() && item.EndTime == inputEnd
            );
            if (shift_record != undefined) {

                return shift_record.ID;
            } else {

                return "0";
            }
        


        return result;

    }

    formatTimeTo12Hour(time24: string): string {
        const [hourStr, minuteStr] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert 0 -> 12 for 12 AM
        return `${hour}:${minute} ${ampm}`;
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


    getWorkStartEndTime(start: string): string | undefined {
        // Expecting format dd-MM-yyyy
        let result = "";
   

        const start_date = this.parseCustomDate(start);
     
        return start_date?.toLocaleTimeString("en-us", { hour: 'numeric', minute: '2-digit', hour12: true }).toString();
    }

    select_default_shift() {
        this.timeForm.get('Shift_ID')?.setValue(this.get_shift_name_work_startEndTime(this.data.fromTime, this.data.toTime));
    }

    shift_change() {
       
        let selected_shift_Id = this.timeForm.get('Shift_ID')?.value;
        let selected_shift = this.shift_list.find((item: any) => item.ID == selected_shift_Id);
        if (selected_shift != undefined) {

            if (selected_shift.StartTime == -1) return;
            let start_time = selected_shift.StartTime;
            let end_time = selected_shift.EndTime;

            start_time = this.formatTimeTo12Hour(start_time);
            end_time = this.formatTimeTo12Hour(end_time);

            this.timeForm.get('StartTime')?.setValue(start_time);
            this.timeForm.get('EndTime')?.setValue(end_time);

            this.timeForm.get('isweekoff')?.setValue(false);
            this.timeForm.get('isholiday')?.setValue(false);



        }
    }

    ngOnInit() {
        console.log("data from main____Page");
        console.log(this.data);
        if (this.data.ShiftID == undefined || this.data.ShiftID == undefined) {
            this.data.ShiftID = 0
        }

        this.employee_date = this.data.Date;
        this.timeForm = this.fb.group({
            EmployeeId: this.data.empId,
            BranchId: this.data.BranchId,
            Date: this.data.Date,
            StartTime: [this.data.fromTime || ''],
            EndTime: [this.data.toTime || ''],
            isweekoff: [this.data.isWeekOff || false],
            isholiday: [this.data.isHoliday || false],
            column: this.data.column,
            Shift_ID: this.data.ShiftID
        });
        this.max_week_off_count = this.data.max_week_off_count;
        this.week_off_count = this.data.week_off_count;
        this.department_list = this.data.department_list;
        this.branch_list = this.data.branch_list;
        this.fetch_shift_list();


        this.employee_name = this.data.EmpName;

        this.timeForm.get('isweekoff')!.valueChanges.subscribe((value: boolean) => {
            if (value) {
                this.timeForm.get('isholiday')!.setValue(false, { emitEvent: false });
                this.timeForm.get('StartTime')!.setValue('', { emitEvent: false });
                this.timeForm.get('EndTime')!.setValue('', { emitEvent: false });
                this.timeForm.get('Shift_ID')!.setValue('0', { emitEvent: false });
                this.timeForm.get('Shift_ID')!.disable();
            } else {
              
                if (this.timeForm.value.isholiday == false ) {
                    this.timeForm.get('Shift_ID')!.enable();
                   
                }

            }
        });

    

        this.timeForm.get('isholiday')!.valueChanges.subscribe((value: boolean) => {
            if (value) {
                this.timeForm.get('isweekoff')!.setValue(false, { emitEvent: false });
                this.timeForm.get('StartTime')!.setValue('', { emitEvent: false });
                this.timeForm.get('EndTime')!.setValue('', { emitEvent: false });
                this.timeForm.get('Shift_ID')!.setValue('0', { emitEvent: false });
                this.timeForm.get('Shift_ID')!.disable();
            }
            else {
                
                if (this.timeForm.value.isweekoff == false) {
                    this.timeForm.get('Shift_ID')!.enable();
                }
            
            }
        });

        this.timeForm.get('StartTime')!.valueChanges.subscribe((value: string) => {
            this.timeForm.get('isweekoff')!.setValue(false, { emitEvent: false });
            this.timeForm.get('isholiday')!.setValue(false, { emitEvent: false });
            this.timeForm.get('Shift_ID')?.setValue(this.get_shift_name(this.timeForm.get('StartTime')?.value, this.timeForm.get('EndTime')?.value));
       
        });

        this.timeForm.get('EndTime')!.valueChanges.subscribe((value: string) => {

            this.timeForm.get('isweekoff')!.setValue(false, { emitEvent: false });
            this.timeForm.get('isholiday')!.setValue(false, { emitEvent: false });
            this.timeForm.get('Shift_ID')?.setValue(this.get_shift_name(this.timeForm.get('StartTime')?.value, this.timeForm.get('EndTime')?.value));

           
        });


        console.log(this.timeForm.value);
    }

    onSubmit() {
        this.edit_duty_roaster();
       
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

    convertToDate(timeStr: string): Date {
        const [time, meridian] = timeStr.split(' ');
        let [hour, minute] = time.split(':').map(Number);

        if (meridian === 'PM' && hour !== 12) hour += 12;
        if (meridian === 'AM' && hour === 12) hour = 0;

        // Use today's date with parsed hour and minute
        const date = new Date();
        date.setHours(hour, minute, 0, 0);

        return date;
    }

    AddNewModule() {
        let institutionsList: any[] = [];
        let row = {};
        let isEdit: Boolean = false;
        this.dialog.open(AddeditshiftComponent, {
            data: { isEdit, row,}
            , panelClass: 'custom-dialog',
            disableClose: true
        }).afterClosed().subscribe((res: any) => {
            // if(res){
            this.fetch_shift_list();
            // }
        })
    }

    onCreateShift() {
        this.AddNewModule();
    }


    //isValidTimeRange(timeRange: string): { valid: boolean, reason?: string } {
    //    // Allow format: hh:mm AM/PM - hh:mm AM/PM (with or without leading zeros)
    //    const timeRangeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)-(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

    //    if (!timeRange) {
    //        return { valid: false, reason: "Time range is empty." };
    //    }

    //    if (!timeRangeRegex.test(timeRange)) {
    //        return {
    //            valid: false,
    //            reason: "Time range must be in the format hh:mm AM/PM-hh:mm AM/PM with correct spacing and a dash in between."
    //        };
    //    }

    //    const [from, to] = timeRange.split('-');

    //    const fromDate = this.convertToDate(from.trim());
    //    const toDate = this.convertToDate(to.trim());

    //    if (fromDate.getTime() >= toDate.getTime()) {
    //        return {
    //            valid: false,
    //            reason: "Start time must be earlier than end time. Please adjust the shift timings."
    //        };
    //    }

    //    return { valid: true };
    //}
    isValidTimeRange(
        timeRange: string
        
       
    ): { valid: boolean, reason ?: string } {

        let  offset: number = 2  
        // Format: hh:mm AM/PM - hh:mm AM/PM
        const timeRangeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)-(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;

        if (!timeRange) {
            return { valid: false, reason: "Time range is empty." };
        }

        if (!timeRangeRegex.test(timeRange)) {
            return {
                valid: false,
                reason: "Time range must be in the format hh:mm AM/PM - hh:mm AM/PM with correct spacing and a dash in between."
            };
        }

        const [from, to] = timeRange.split('-');
        const fromDate = this.convertToDate(from.trim());
        const toDate = this.convertToDate(to.trim());
        const shiftCount = this.shift_list.length ?? 0;

        const now = new Date();

      
        const isToday = this.data.Date.toDateString() === now.toDateString();
        const diffInHours = (fromDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (isToday && diffInHours < offset) {
            return {
                valid: false,
                reason: `You can only assign shifts starting .<br/> atleast ${offset} hours from now.`
            };
        }

        const isOvernight = fromDate.getTime() >= toDate.getTime();
        let adjustedToDate = new Date(toDate);

        if (isOvernight) {
            // Treat it as overnight: add 1 day to toDate
            adjustedToDate.setDate(adjustedToDate.getDate() + 1);
        }

        // Re-check duration (must be positive and reasonable)
        const shiftDurationInHours = (adjustedToDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60);

        if (shiftDurationInHours <= 0 || shiftDurationInHours > 16) {
            return {
                valid: false,
                reason: "You cannot set a shift that ends before <br/> it starts. Please check the timing."
            };
        }
      

        // ✅ Night shift detection
        const fromHour = fromDate.getHours();
        const toHour = toDate.getHours();
        const isNightShift = fromHour >= 19 || toHour < 6;

        if (shiftCount <= 1 && isNightShift) {
            return {
                valid: false,
                reason: "You are trying to allocate time in the <br/> night shift. Please create a night shift first,<br/> then assign duty."
            };
        }

        return { valid: true };
    }

    edit_duty_roaster() {

     
        var json_data = this.timeForm.value;
        if (json_data.isweekoff)
        {
            if (this.week_off_count >= this.max_week_off_count) {
                this.ShowToast("Only " + this.max_week_off_count + " Weekly Offs Are Allowed.<br/> Employee Already  Allocated " + this.week_off_count +" Week Offs For This Week .", 'warning');
                return;
            }
        }

        if (json_data.isweekoff == false && json_data.isholiday==false) {
            let over_write_value = json_data.StartTime + '-' + json_data.EndTime;
            let is_datetime_valid = this.isValidTimeRange(over_write_value);
            if (!is_datetime_valid.valid) {
                this.ShowToast(is_datetime_valid.reason!.toString(), 'warning');
                return;
            }

        }
        
        this.spinnerService.show();
        
     
     
     

   

        console.log(json_data);
        let api_url = "api/DutyRoster/EditDutyRosters";
        json_data.Date = this.datepipe.transform(json_data.Date, "yyyy-MM-dd");
        if (json_data.isholiday) {
            json_data["StartTime"] = null!;
            json_data["EndTime"] = null! ;

        }
        if (json_data.isweekoff) {
            json_data["StartTime"] =null!;
            json_data["EndTime"] = null!;

        }

        debugger;
        json_data["ShiftID"] = json_data.Shift_ID;
        let shift_object = this.shift_list.find((item: any) => item.ID == json_data.Shift_ID);
        if (shift_object != undefined) {
            json_data["ShiftName"] = shift_object.Name;
        } else {
            json_data["ShiftName"] = "Regular";

        }
        this.common_service.Postwithjson(api_url, json_data).subscribe({
            next: (result) => {
                let over_write_value = json_data.StartTime + '-' + json_data.EndTime;
                this.spinnerService.hide();
                if (result.Status) {
                 
                  

                 
                   // this.edit_list_records(data.EmpId, over_write_value, column);
                    this.ShowToast(result.message, 'success');

                  
                } else {
                    this.ShowToast(result.message, 'warning');
                }

                
                if (json_data.isweekoff == true) {
                    over_write_value = "W/O";
                }
                if (json_data.isholiday ==true) {
                    over_write_value = "H/O"
                }
                json_data["over_write_value"] = over_write_value;
                this.dialogRef.close(json_data);
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


    onCancel() {
        this.dialogRef.close();
    }
}
