import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../leave-list/leave-list.component';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.css']
})
export class CommonDialogComponent implements OnInit {

  type:any = ""
  title:any = ""
  subTitle:any = ""
  options:any = ""

  constructor(public dialogRef: MatDialogRef<CommonDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any){
    console.log(data);
    // this.title = data?.title
    // this.subTitle = data?.subTitle
    this.type = data.type
    this.title = data.title
    this.subTitle = data.subTitle
    this.options = data.options
  }

  ngOnInit(): void {
    
  }

  close(){
    this.dialogRef.close();
  }

  selectOption(index:any){
    this.dialogRef.close({optionSelected:this.options[index]});
  }

}
