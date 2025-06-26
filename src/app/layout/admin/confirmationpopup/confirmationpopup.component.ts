import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmationpopup',
  templateUrl: './confirmationpopup.component.html',
  styleUrls: ['./confirmationpopup.component.css']
})
export class ConfirmationpopupComponent {
@Output()
   confirmClick: EventEmitter<any> = new EventEmitter();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,public dialogRef: MatDialogRef<ConfirmationpopupComponent>){
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
