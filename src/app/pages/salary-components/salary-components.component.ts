import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from '../../services/httpcommon.service';
import { AddUpdateFieldComponent } from '../../pages/salarymastersettings/add-update-field/add-update-field.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddSalaryComponentComponent } from './add-salary-component/add-salary-component.component';
import { AddSalaryGrossComponent } from '../add-salary-gross/add-salary-gross.component';


import { ToastrService } from 'ngx-toastr';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-salary-components',
  templateUrl: './salary-components.component.html',
  styleUrls: ['./salary-components.component.css']
})
export class SalaryComponentsComponent implements OnInit {


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


    //


    OrgId: string = "";
    LoggedInUserID: string = "";

    

    ngOnInit(): void {

        this.displayColumns = {
         
            "No": "No",
            "ComponentName": "Component Name",
            "ComponentType": "Component Type",
            "Description":"Description",
            "IsIncludeInGross": "IsIncludeInGross",
            "IsGlobal": "IsGlobal",
            "IsMandatory": "IsMandatory",
            "IsTaxable": "IsTaxable",
            "CreatedBy":"Created By",
            "Actions": "ACTIONS"
           
        }
        this.actionOptions = [
          
            {
                name: "Edit",
                icon: "fa fa-edit"
            },
            {
                name: 'Delete',
                icon: 'fa fa-trash',
                filter: [
                    { field: 'IsDeletable', value: true }
                ]
            }
            
        ]
        this.displayedColumns = [

            "No",
            "ComponentName",
            "ComponentType",
            "Description",
            "IsIncludeInGross",
            "IsGlobal",
            "IsMandatory",
            "IsTaxable",
            "CreatedBy",
            "Actions"

        ];
        this.OrgId = localStorage.getItem("OrgID")!;
        this.LoggedInUserID = localStorage.getItem("LoggedInUserID")!;
       
        this.load_component_data();
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

    actionEmitter(data: any) {
        if (data.action.name == "View") {
            
        }
        else if (data.action.name == "Edit") {
            this.openAddDialog_Edit(data.row);
        }
        else if (data.action.name = "Delete") {

           this.delete_component(data.row);
        }
       else if (data.action.name == "Bulk Update") {
            
        }
    }


    delete_component(row:any) {
        let api_url = "api/Salary/DeleteComponent?ComponentID=" + row.ComponentId + "&UserID=" + this.LoggedInUserID.toString().trim() + "&EditType=Delete";
       
        this._common_service.GetWithOneParam(api_url).subscribe({
            next: (result) => {
                if (result.Status) {
                    this.ShowAlert(result.message,'success');
                    this.load_component_data();
                } else {
                    this.ShowAlert(result.message,'success');
                }
            },
            error: (error) => {
                this.ShowAlert(error.message,'error');
                this.employeeLoading = false;
            }
        });
    }


    load_component_data() {
        this.employeeLoading = true;
        let api_url = "api/Salary/GetComponents?OrgID=" + this.OrgId;
        this._common_service.GetWithOneParam(api_url).subscribe({
            next: (result) => {
                if (result.Status) {

                 
                    this.data_list = result.data;
                    
                    for (let i = 0; i < this.data_list.length; i++) {
                        this.data_list[i]["No"] = (i + 1).toString();
                    }
                    this.employeeLoading = false;

                  

                }
                else {
                    this.ShowAlert(result.message,'warning');
                }
             
            },
            error: (error) => {

                this.ShowAlert(error.message,'error');
                this.employeeLoading = false;
            }

        });

    }

    constructor(private spinner_service: NgxSpinnerService,private dialog:MatDialog, private _common_service: HttpCommonService, private form_builder: FormBuilder)
    {
        

    }
    openConfigDialog() {
        const dialogRef = this.dialog.open(AddSalaryGrossComponent, {
            maxWidth: '80vw',
            maxHeight: '80vh',
            height: '80%',
            width: '80%',
            panelClass: 'full-screen-modal',
            data: { edit: false },
        });


    }
    openComponentConfiguration() {
        const dialogRef = this.dialog.open(AddSalaryGrossComponent, {
            maxWidth: '800px',
           
            panelClass: 'full-with-dialog-lg',
            data: { edit: false },
        });


    }



    openAddDialog() {
        const dialogRef = this.dialog.open(AddSalaryComponentComponent, {
            maxWidth: '500px',
            panelClass: 'full-with-dialog',
            disableClose: true,
            data: { edit: false },
        });

        dialogRef.afterClosed().subscribe((result) => {
           
            if (result) {
                this.load_component_data();
            }
        });
    }

    openAddDialog_Edit(row:any) {
        const dialogRef = this.dialog.open(AddSalaryComponentComponent, {
            disableClose: true,
            data: { edit: true,data:row },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.load_component_data();
            }
        });
    }
}
