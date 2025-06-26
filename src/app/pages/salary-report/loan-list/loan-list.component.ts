import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { DutyRosterDateEditComponent } from '../../emp-roaster-reports/duty-roster-date-edit/duty-roster-date-edit.component';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {

    loan_list: any[] = [];
    window_header: string = "Edit Loan Deductions";
    displayColumns: any;
    employeeLoading = false;
    displayedColumns: any;
    editableColumns: any = [];
    actionOptions: any;
    headerColors: any = [];
    smallHeaders: any = [];
    EmpId: any;
    change_status:Boolean= false;

    ngOnInit(): void {
        console.log("data received from type:" + this.data.Loan_data.type);
        console.log(this.data);

        if (this.data.Loan_data.type == 'Loan') {

            this.window_header = "Edit Loan Deductions";
            this.EmpId = this.data.Loan_data.payload.EmployeeID;
            this.editableColumns = {
                Deduction: {
                    filters: {},
                }

            };

            this.displayColumns = {

                "LoanID": "LoanID",
                "Deduction": "Deducted Amount",
                "RemainingBalance": "RemainingBalance",


            }
            this.displayedColumns = [

                "LoanID",
                "Deduction",
                "RemainingBalance",


            ];
            this.employeeLoading = true;
            this.loan_list = this.data.Loan_data.payload.LoanList.filter((item: any) => item.LoanType == 'Loan');
            this.employeeLoading = false;


            this.actionOptions = [];
        }

        else if (this.data.Loan_data.type == 'Shift') {
            this.window_header = "Edit Shift Earnings";
            this.EmpId = this.data.Loan_data.payload.EmployeeID;
            this.editableColumns = {
                ShiftHours: {
                    filters: {},
                },
                ShiftAmount: {
                    filters: {},
                }

            };

            this.displayColumns = {

                "ShiftHours": "Shift Hours",
                "ShiftAmount": "Shift Amount",
                "Details": "Details",


            }
            this.displayedColumns = [

                "ShiftHours",
                "ShiftAmount",
                "Details",


            ];
            this.employeeLoading = true;
            this.loan_list = this.data.Loan_data.payload.ShiftEarning;
            this.employeeLoading = false;
            this.actionOptions = [];
        }
        else if (this.data.Loan_data.type == 'OT') {
            debugger;
            this.window_header = "Edit OT Earnings";
            this.EmpId = this.data.Loan_data.payload.EmployeeID;
            this.editableColumns = {


            };

            this.displayColumns = {

                "Date": "Date",
                "ActualHours": "ActualHours",
                "AmountPerHour": "AmountPerHour",
                "Ratio": "Ratio",
                "CalculatedHours": "CalculatedHours",
                "CalculatedAmount": "Amount",


            }
            this.displayedColumns = [

                "Date",
                "ActualHours",
                "AmountPerHour",
                "Ratio",
                "CalculatedHours",
                "CalculatedAmount"


            ];
            this.employeeLoading = true;
            this.loan_list = this.data.Loan_data.payload.OTEarning.Details;
            this.employeeLoading = false;
            this.actionOptions = [];
        }
        else if (this.data.Loan_data.type == 'Advance') {
            this.window_header = "Edit Advance Deductions";
            this.EmpId = this.data.Loan_data.payload.EmployeeID;
            this.editableColumns = {
                Deduction: {
                    filters: {},
                }

            };

            this.displayColumns = {

                "LoanID": "ID",
                "Deduction": "Deducted Amount",
                "RemainingBalance": "RemainingBalance",


            }
            this.displayedColumns = [

                "LoanID",
                "Deduction",
                "RemainingBalance",


            ];
            this.employeeLoading = true;
            this.loan_list = this.data.Loan_data.payload.LoanList.filter((item: any) => item.LoanType == 'Advance');
            this.employeeLoading = false;


            this.actionOptions = [];
        }

    }

    actionEmitter(data: any) {
        if (data.action.name == "editColumn") {
          
            this.editColumn(data.row);
        }
    }

    editColumn(row: any) {
        if (this.data.Loan_data.type == 'Loan') {
            let data = row.data;
            let column = row.column;
            let value = row.value;
            let loan_list_item = this.loan_list.find((item: any) => item.LoanID == data.LoanID);


            loan_list_item.Deduction = row.value;
            loan_list_item.RemainingBalance = loan_list_item.OldBalance - loan_list_item.Deduction;
            this.change_status = true;
        }

        if (this.data.Loan_data.type == 'OT') {

            

            let data = row.data;
            let column = row.column;
            let value = row.value;
            let loan_list_item = this.loan_list.find((item: any) => item.Date == data.Date && item.EmpID == data.EmpID);
            loan_list_item.CalculatedAmount = value;
            this.data.Loan_data.payload.OTEarning.OTAmount = 0;
            for (let i = 0; i < this.loan_list.length; i++) {
                this.data.Loan_data.payload.OTEarning.OTAmount += Number(this.loan_list[i].CalculatedAmount);
            }

            console.log(this.data.Loan_data.payload.OTEarning.OTAmount);
           
            this.change_status = true;
        }

        if (this.data.Loan_data.type == 'Advance') {

            let data = row.data;
            let column = row.column;
            let value = row.value;
            let loan_list_item = this.loan_list.find((item: any) => item.LoanID == data.LoanID);


            loan_list_item.Deduction = row.value;
            loan_list_item.RemainingBalance = loan_list_item.OldBalance - loan_list_item.Deduction;
            this.change_status = true;
        }
 

        
    }

    saveChangesClick() {

        if (this.data.Loan_data.type == 'Loan') {

            let result_data = {
                list: this.loan_list,
                type: this.data.Loan_data.type,
                EmpID: this.EmpId,
                Status: this.change_status
            };
            this.dialogRef.close({ result_data });

        }
        else if (this.data.Loan_data.type == 'OT')
        {
            this.data.Loan_data.payload.OTEarning.Details = this.loan_list;

            let result_data = {
                list: this.data.Loan_data.payload.OTEarning,
                type: this.data.Loan_data.type,
                EmpID: this.EmpId,
                Status: true
            };
            this.dialogRef.close({ result_data });
        }
        else if (this.data.Loan_data.type == 'Advance') {


            let result_data = {
                list: this.loan_list,
                type: this.data.Loan_data.type,
                EmpID: this.EmpId,
                Status: this.change_status
            };
            this.dialogRef.close({ result_data });

        }


    }

    close() {
        this.dialogRef.close();
    }
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<LoanListComponent>,
     
        private common_service: HttpCommonService,
        private spinnerService: NgxSpinnerService,
        public dialog: MatDialog
    ) {




    }
}
