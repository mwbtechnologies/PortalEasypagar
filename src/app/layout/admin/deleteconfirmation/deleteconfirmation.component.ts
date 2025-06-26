
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent {
  @Output()
   confirmClick: EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<DeleteconfirmationComponent>){
  }

  ngOnInit(): void{
  }
  onConfirmClick() {
    this.confirmClick.emit();
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
