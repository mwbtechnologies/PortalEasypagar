import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { ToastrService } from 'ngx-toastr';
import { ShowalertComponent } from '../../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-add-salary-component',
  templateUrl: './add-salary-component.component.html',
  styleUrls: ['./add-salary-component.component.css']
})
export class AddSalaryComponentComponent {

    form_title: string = "ADD salary COMPONENT";
    form_group!: FormGroup;
    OrgID: string = "";
    LoggedInUserID: string = "";
    reload_page_data: Boolean = false;
    constructor(
        public dialogRef: MatDialogRef<AddSalaryComponentComponent>,
        private dialog:MatDialog,
        private fb: FormBuilder,
        private spinner_service: NgxSpinnerService,
       
        private common_http_serve: HttpCommonService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        

        this.form_group = this.fb.group({
            ComponentName: ['', Validators.required],
            ComponentType: ['Earnings', Validators.required],
            IsGlobal: [true],
            IsMandatory: [false],
            IsTaxable: [false],
            IsIncludeInGross: [true],
            ComponentId: [0],
            Description: [''],
            order: ['',Validators.required]



        });

        this.OrgID = localStorage.getItem("OrgID")!;
        this.LoggedInUserID = localStorage.getItem("LoggedInUserID")!;

        if (data.edit) {


            // temparory code
            if (data.data.order == undefined) {
                data.data["order"] = 1;
            }


            this.form_group.setValue({
                ComponentName: data.data.ComponentName,
                ComponentType: data.data.ComponentType,
                IsGlobal: data.data.IsGlobal,
                IsMandatory: data.data.IsMandatory,
                IsTaxable: data.data.IsTaxable,
                IsIncludeInGross: data.data.IsIncludeInGross,
                ComponentId: data.data.ComponentId,
                Description: data.data.Description,
                order:data.data.order
            });
            this.form_title = "Update salary COMPONENT";
        } else {
            this.form_title = "ADD salary COMPONENT";
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

    add_component() {
        this.spinner_service.show();
        const _submission_values = this.form_group.value;
        _submission_values["CreatedByID"] = this.LoggedInUserID;
        _submission_values["OrgID"] = this.OrgID;

     
        let api_url = "Salary/CreateComponent";
        this.common_http_serve.ApiUsingPost(api_url, _submission_values).subscribe({

            next: (result) => {
                this.spinner_service.hide();
                if (result.Status) {

                    if (result.message == undefined) {
                        this.ShowAlert(result.Message, 'success');

                    } else {
                        this.ShowAlert(result.message, 'success');
                    }
                   
                    this.reload_page_data = true;

                } else {

                    if (result.message == undefined) {
                        this.ShowAlert(result.Message, 'success');

                    } else {
                        this.ShowAlert(result.message, 'success');
                    }
                   

                }
                this.form_group.setValue({

                    ComponentName: '',
                    ComponentType: 'Earnings',
                    IsGlobal: true,
                    IsMandatory: false,
                    IsTaxable: false,
                    IsIncludeInGross: true,
                    ComponentId: 0,
                    Description:''

                });
             
               
                this.dialogRef.close(this.reload_page_data);
            },
            error: (error) => {
                this.spinner_service.hide();
                if (!error.error.Status) {
                    this.ShowAlert(error.error.message,'warning');
                    this.spinner_service.hide();

                } else {
                    console.log(error);
                    this.ShowAlert(error.message,'error');

                    
                }
               
            }
        });
    }

    update_component() {
        this.spinner_service.show();
        const _submission_values = this.form_group.value;
        _submission_values["ModifiedByID"] =Number(this.LoggedInUserID);
        _submission_values["OrgID"] = this.OrgID;

        
        let api_url = "Salary/UpdateComponent";
        this.common_http_serve.ApiUsingPost(api_url, _submission_values).subscribe({

            next: (result) => {
                this.spinner_service.hide();
                if (result.Status) {
                    if (result.message == undefined) {
                        this.ShowAlert(result.Message, 'success');

                    } else {
                        this.ShowAlert(result.message, 'success');
                    }
                  
                    this.reload_page_data = true;

                } else {

                    if (result.message == undefined) {
                        this.ShowAlert(result.Message, 'success');

                    } else {
                        this.ShowAlert(result.message, 'success');
                    }



                }
                this.form_group.setValue({

                    ComponentName: '',
                    ComponentType: 'Earnings',
                    IsGlobal: true,
                    IsMandatory: false,
                    IsTaxable: false,
                    IsIncludeInGross: true,
                    ComponentId: 0,
                    Description:''

                });
               
               
                this.dialogRef.close(this.reload_page_data);

            },
            error: (error) => {
                this.spinner_service.hide();
                if (!error.error.Status) {
                    this.ShowAlert(error.error.message,'warning');
                    this.spinner_service.hide();

                } else {
                    console.log(error);
                    this.ShowAlert(error.message,'warning');

                  
                }
            }
        });
    }
    preventSpace(event: KeyboardEvent) {
        if (event.key === ' ') {
            event.preventDefault();
        }
    }

    preventPasteSpace(event: ClipboardEvent) {
        const clipboardData = event.clipboardData;
        if (clipboardData) {
            const pastedText = clipboardData.getData('text');
            if (pastedText.includes(' ')) {
                event.preventDefault();
            }
        }
    }

    closeDialog() {
        this.dialogRef.close(this.reload_page_data);
    }

    onSave(): void {
        try {
          

            let id = this.form_group.get('ComponentId')?.value;
            if (id == 0) {
                this.add_component();
            } else {
                this.update_component();
            }
           
          

        } catch (exception) {
            if (exception instanceof Error) {
                this.ShowAlert(exception.message,'error');
            } else {
                this.ShowAlert("unexpected error : "+ exception,'error');

            }
        }
    }
}
