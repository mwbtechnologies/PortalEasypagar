import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeaveTypeComponent } from './leave-type/leave-type.component';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from '../../services/httpcommon.service';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-leave-config',
  templateUrl: './leave-config.component.html',
  styleUrls: ['./leave-config.component.css']
})
export class LeaveConfigComponent implements OnInit {


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

    OrgId: string = "";
    LoggedInUserID: string = "";
    constructor(private spinner_service: NgxSpinnerService, private dialog: MatDialog, private _common_service: HttpCommonService, private form_builder: FormBuilder) {


    }

    openAddDialog_Edit(row: any) {
        const dialogRef = this.dialog.open(LeaveTypeComponent, {
            disableClose: true,
            data: { edit: true, data: row },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (result.result.status == 201) {
                    this.load_component_data();
                }
            }
        });
    }

    actionEmitter(data: any) {
        if (data.action.name == "View") {

        }
        else if (data.action.name == "Edit") {
            this.openAddDialog_Edit(data.row);
        }
       
        else if (data.action.name == "Bulk Update") {

        }
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


    load_component_data() {
        this.employeeLoading = true;
        let api_url = "api/LeaveMaster/GetLeaveMasterTypes?OrgID=" + this.OrgId;
        this._common_service.GetWithOneParam(api_url).subscribe({
            next: (result) => {
            
                if (result.status == 200) {


                    this.data_list = result.data.LeaveMasterTypes;

                    for (let i = 0; i < this.data_list.length; i++) {
                        this.data_list[i]["No"] = (i + 1).toString();
                    }
                    this.employeeLoading = false;



                }
                else {
                    this.ShowAlert(result.message, 'warning');
                }

            },
            error: (error) => {

                this.ShowAlert(error.message, 'error');
                this.employeeLoading = false;
            }

        });

    }

    openAddDialog() {
        const dialogRef = this.dialog.open(LeaveTypeComponent, {
            maxWidth: '500px',
            panelClass: 'full-with-dialog',
            disableClose: true,
            data: { edit: false },
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result) {
               
                if (result.result.status == 201) {
                    this.load_component_data();
                }
            }
        });
    }

    ngOnInit(): void {
        this.displayColumns = {

            "No": "No",
            "Id": "ID",
            "LeaveTypeName": "Leave Type Name",
            "CreatedByID": "Created By",
            "Actions": "ACTIONS"

        }
        this.actionOptions = [

            {
                name: "Edit",
                icon: "fa fa-edit"
            },
         

        ]
        this.displayedColumns = [

            "No",
            "Id",
            "LeaveTypeName",
            "CreatedByID",
            "Actions"

        ];
        this.OrgId = localStorage.getItem("OrgID")!;
        this.LoggedInUserID = localStorage.getItem("LoggedInUserID")!;

        this.load_component_data();
    }
}
