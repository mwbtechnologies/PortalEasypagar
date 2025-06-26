import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpCommonService } from '../../../services/httpcommon.service';
import { LeaveTypeComponent } from '../leave-type/leave-type.component';
import { LeaveMapComponent } from '../leave-map/leave-map.component';

@Component({
  selector: 'app-leave-mapping-list',
  templateUrl: './leave-mapping-list.component.html',
  styleUrls: ['./leave-mapping-list.component.css']
})
export class LeaveMappingListComponent {
    constructor(private spinner_service: NgxSpinnerService, private dialog: MatDialog, private _common_service: HttpCommonService, private form_builder: FormBuilder) {


    }
  

    openAddDialog() {
        const dialogRef = this.dialog.open(LeaveMapComponent, {
            maxWidth: '850px',
            panelClass: 'full-with-dialog-lg',
            disableClose: true,
            data: { edit: false },
        });

        dialogRef.afterClosed().subscribe((result) => {

            if (result) {

                if (result.result.status == 201) {
                 
                }
            }
        });
    }

}
