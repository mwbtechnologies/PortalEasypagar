
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
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-docorder',
  templateUrl: './docorder.component.html',
  styleUrls: ['./docorder.component.css']
})
export class DocorderComponent {
  DocumentGroups: any[] = []
  SelectedDocuments: any[] = []
  reorderedGroups: any[] = []
  DocSettings: IDropdownSettings = {}
  SelectedDocGroup: any[] = []
  constructor(private pdfExportService: PdfExportService, private spinnerService: NgxSpinnerService,
    private _route: Router, private directoryService: DirectoryService, public dialogRef: MatDialogRef<DocorderComponent>,
    private globalToastService: ToastrService, private _httpClient: HttpClient, private dialog: MatDialog) {
    this.DocSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'groupTypeName',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection :true
    };
  }
  ngOnInit() {
    this.getGroupsDoc()
  }

  loadDocTypes(){
    this.spinnerService.show()
    let json = {
      "SoftwareId": 8,
      mapping: {
        orgId: this.directoryService.ORGId,
      },
      docGroupId:this.SelectedDocGroup[0]._id
    }
    this.directoryService.PostMethod('document/type/name/list', json).subscribe((res: any) => {
      this.SelectedDocuments = res?.data || [];
      this.reorderedGroups = JSON.parse(JSON.stringify(this.SelectedDocuments))
      this.spinnerService.hide()
    }, (error) => {
      this.globalToastService.error(error.error.message)
      this.spinnerService.hide()
    })
  }

  onDocGroupSelect(event: any) {
    const fullGroup = this.DocumentGroups.find(g => g._id === event._id);
    this.loadDocTypes()
  }
  onDocGroupDeSelect(event: any) {
    this.SelectedDocuments = [];
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
    moveItemInArray(this.SelectedDocuments, event.previousIndex, event.currentIndex);
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
      "docTypeIds": ordered
    }
    console.log(json, "dsjds");

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
