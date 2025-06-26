import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shiftalert',
  templateUrl: './shiftalert.component.html',
  styleUrls: ['./shiftalert.component.css']
})
export class ShiftalertComponent {
 constructor(public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ShiftalertComponent>){
 }

 ngOnInit(): void{
 }
 onConfirmClick() {
this.dialogRef.close();
 }

}
