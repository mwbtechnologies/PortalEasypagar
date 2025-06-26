import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AssetService } from "src/app/services/assets.service";
import { ReduxService } from "src/app/services/redux.service";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"],
})
export class AddComponent implements OnInit {
  originalAssetList: any[] = [];
  SelectedCategoryType: any = "";
  SelectedAssetTypeid: any;
  SelectedMeasureType: any[] = [];
  CategoryName: any;
  CategoryList: any[];
  searchText: string = "";
  isEdit: boolean;
  // filteredUnits: string[] = [];
  AdminID: any;
  MeasurementType: any;
  showmeasurements: boolean = false;
  showAssetTypes: boolean = false;
  errors: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assetService: AssetService,
    private spinnerService: NgxSpinnerService,
    public dialogRef: MatDialogRef<AddComponent>,
    private toastr: ToastrService, private reduxService:ReduxService
  ) {
    (this.isEdit = this.data.isEdit || false),
      (this.CategoryName = this.data.row?.name || "");
    this.CategoryList = this.data.CategoryList || [];
  }

  ngOnInit() {
    this.AdminID = localStorage.getItem("AdminID");
    console.log(this.data.row, "row data");
  }

  addCategory() {
    this.errors = {};
    if (this.CategoryName.length < 3) {
      this.toastr.warning("Please Enter Asset Name");
      this.errors.CategoryName = "Please Enter Category Name";
    } else {
      const isAlreadyExist = this.CategoryList.filter(
        (cat) => cat.name.toString().toLowerCase() == this.CategoryName.toString().toLowerCase()
      )[0]
      if (!isAlreadyExist) {
        let json = {
          name: this.CategoryName,
          SoftwareId: 8,
          createdBy: parseInt(this.reduxService.UserID),
          mapping: {
            orgId:this.assetService.ORGId,
          },
        };
        this.assetService.PostMethod("assetMgnt/category/add", json).subscribe(
          (res: any) => {
            if (res.status) {
              this.toastr.success("Category created successfully");
              this.close()
            } else throw {};
          },
          (error) => {
            
            this.toastr.warning("Failed to add a category");
          }
        );
      } else {
        this.toastr.warning("Category Already exists");
      }
    }
  }
  close() {
    this.dialogRef.close();
  }

  checkDuplicate() {}
}
