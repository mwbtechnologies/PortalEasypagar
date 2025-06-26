import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../leave-list/leave-list.component';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {

  title:string = ""
  subTitle:string = ""
  constructor(public dialogRef: MatDialogRef<Dialog>,@Inject(MAT_DIALOG_DATA) public data: any){
    console.log(data);
    this.title = data?.title
    this.subTitle = data?.subTitle
  }

  ngOnInit(): void {
    
  }

  close(){
    this.dialogRef.close();
  }

}
