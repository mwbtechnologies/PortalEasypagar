import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpCommonService } from '../../services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-emp-profile',
  templateUrl: './emp-profile.component.html',
  styleUrls: ['./emp-profile.component.css']
})
export class EmpProfileComponent implements OnInit {

    EmployeeId: string = "";
    employee_data_object: any;

    ngOnInit(): void {
        this.spinnerService.show();
        this.activated_route.paramMap.subscribe((result) => {
            this.EmployeeId = result.get('id')!;
            this.GetEmployeeDetails();
        });
    }

    ShowAlert(message: string, type: 'success' | 'warning' | 'error'): void {
        this.dialog.open(ShowalertComponent, {
            data: { message, type },
            panelClass: 'custom-dialog',
            disableClose: true
        }).afterClosed().subscribe((res:any) => {
            if (res) {
                console.log("Dialog closed");
            }
        });
    }

    constructor(private activated_route: ActivatedRoute, private _commonservice: HttpCommonService, private spinnerService: NgxSpinnerService, private dialog: MatDialog, private location: Location) {

    }

    goBack(): void {
        this.location.back();
    }
    ApiURL: string = "";

    GetEmployeeDetails() {
        // this.spinnerService.show();
      
        this.ApiURL = "Employee/GetUserProfile?ID=" + this.EmployeeId + "&IsEmail=false";
       
        this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe(data => {
            if (data.Status == true) {
                this.employee_data_object = data.List[0];
                this.spinnerService.hide();
                //  this.spinnerService.hide();
            }
            //  this.spinnerService.hide();

        }, (error: any) => {
            this.spinnerService.hide();
            // this.spinnerService.hide();
            // this.globalToastService.error("Error while Updating the Record");
            this.ShowAlert("Error while Updating the Record", "error");
        }
        );
    }
}
