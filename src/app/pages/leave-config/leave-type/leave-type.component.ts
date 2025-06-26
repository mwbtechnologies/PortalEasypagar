import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css']
})
export class LeaveTypeComponent implements OnInit {

    window_header: string = "Create New Leave Type";
    leave_type_form!: FormGroup;
    OrgID: string = "";
    UserId: string = "";

    ngOnInit(): void {


    }

    constructor(public dialogRef: MatDialogRef<LeaveTypeComponent>, private dialog: MatDialog, private common_service: HttpCommonService, private spinner_service: NgxSpinnerService, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.OrgID = localStorage.getItem("OrgID")!;
        this.UserId = localStorage.getItem("LoggedInUserID")!;

        this.leave_type_form = new FormGroup({
            Id: new FormControl(0),
            LeaveTypeName: new FormControl('', [Validators.required])
        });

        if (this.data != undefined) {
            if (data.edit) {
                this.leave_type_form.setValue({
                    Id: data.data.Id,
                    LeaveTypeName: data.data.LeaveTypeName,
                  
                });
            }
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

    close() {
        this.dialogRef.close({Status:false});
    }

    on_save() {
        let json_body = this.leave_type_form.value;
        if (json_body.Id > 0) {
            this.update_leave_type();
        } else {
            this.create_leave_type();
        }
    }

    create_leave_type() {
        


        let json_body = this.leave_type_form.value;
        json_body["UserId"] = this.UserId;
        json_body["OrgID"] = this.OrgID;

        this.spinner_service.show();
        let api_url = "LeaveMaster/AddLeaveMasterTypes";
        this.common_service.ApiUsingPost(api_url, json_body)
        .subscribe({
            next: (result) => {
                this.spinner_service.hide();
              
                if (result.status == 201) {
                    this.ShowAlert(result.message, 'success');
                }
                else if (result.Status) {
                    this.ShowAlert(result.message, 'success');
                  
                }else{
                    this.ShowAlert(result.message, 'warning');

                }
                this.dialogRef.close({ result });
            },
            error: (error) => {
                this.spinner_service.hide();
                if (error instanceof HttpErrorResponse) {
                    this.ShowAlert(error.error.message, 'error');
                } else {
                    this.ShowAlert(error.message, 'error');

                }
            }
        });

    }

    update_leave_type() {
        let json_body = this.leave_type_form.value;
        json_body["UserId"] = this.UserId;
        json_body["OrgID"] = this.OrgID;

        this.spinner_service.show();
        let api_url = "LeaveMaster/UpdateLeaveMasterTypes";
        this.common_service.ApiUsingPost(api_url, json_body)
            .subscribe({
                next: (result) => {
                    this.spinner_service.hide();

                    if (result.status == 201) {
                        this.ShowAlert(result.message, 'success');
                    }
                    else if (result.Status) {
                        this.ShowAlert(result.message, 'success');

                    } else {
                        this.ShowAlert(result.message, 'warning');

                    }
                    this.dialogRef.close({ result });
                },
                error: (error) => {
                    this.spinner_service.hide();
                    if (error instanceof HttpErrorResponse) {
                        this.ShowAlert(error.error.message, 'error');
                    } else {
                        this.ShowAlert(error.message, 'error');

                    }
                }
            });

    }


}
