
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DirectoryService } from 'src/app/services/directory.service';
import { PdfExportService } from 'src/app/services/pdf-export.service';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-docgrouporder',
  templateUrl: './docgrouporder.component.html',
  styleUrls: ['./docgrouporder.component.css']
})
export class DocgrouporderComponent {
  DocumentGroups: any[] = []
  reorderedGroups: any[] = []

  constructor(private pdfExportService: PdfExportService, private spinnerService: NgxSpinnerService,
    private _route: Router, private directoryService: DirectoryService, public dialogRef: MatDialogRef<DocgrouporderComponent>,
    private globalToastService: ToastrService, private _httpClient: HttpClient, private dialog: MatDialog) {
  }
  ngOnInit() {
    this.getGroupsDoc()
  }

  getGroupsDoc() {
    this.spinnerService.show()
    let json = {
      "SoftwareId": 8,
      mapping: {
        orgId: this.directoryService.ORGId,
      }
    }
    this.directoryService.PostMethod('group/get/type', json).subscribe((res: any) => {
      this.DocumentGroups = res.data || [];
      this.reorderedGroups = JSON.parse(JSON.stringify(this.DocumentGroups))
      this.spinnerService.hide()
    }, (error) => {
      this.globalToastService.error(error.error.message)
      this.spinnerService.hide()
    })
  }

  getNamings(doc: any) {
    return doc.groupTypeName
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.DocumentGroups, event.previousIndex, event.currentIndex);
    let splicedElement = this.reorderedGroups.splice(event.previousIndex, 1)
    this.reorderedGroups.splice(event.currentIndex, 0, splicedElement[0]);
    console.log(this.reorderedGroups);

  }

  submit() {
    let ordered = this.reorderedGroups.map((f: any) => f._id)
    let json = {
      "SoftwareId": 8,
      "mapping": {
        orgId: this.directoryService.ORGId,
      },
      "docGroupIds": ordered
    }
    this.directoryService.PostMethod('positionOrder/create', json).subscribe((res: any) => {
      this.globalToastService.success(res.message)
      this.spinnerService.hide()
      this.dialogRef.close({ res })
    }, (error) => {
      this.globalToastService.error(error.error.message)
      this.spinnerService.hide()
    })
  }

  close() {
    this.dialogRef.close()
  }
}
