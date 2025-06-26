import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-adminsupport',
  templateUrl: './adminsupport.component.html',
  styleUrls: ['./adminsupport.component.css']
})
export class AdminsupportComponent {
  problemlist:any[]=[]
  selectedProblem:any
  Query:any
  file:File | any;ImageUrl:any;ShowImage=false;
  fileurl:any;
  ProblemSettings:IDropdownSettings = {}
  AdminID:any
  constructor( private globalToastService: ToastrService,
    private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService,
   private toastr: ToastrService) { 
    this.ProblemSettings = {
      singleSelection: true,
      idField: 'Value',
      textField: 'Text',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }
  ngOnInit() {
    this.AdminID = localStorage.getItem("AdminID");
    this.GetProblemList();
  }
  GetProblemList(){
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam("Common/GetSupportTypes/en").subscribe((response: any) => {
      this.spinnerService.hide();
        this.problemlist = response.List;
    },(error) => {
      this.spinnerService.hide();
      this.toastr.error('An error occurred while fetching problem list.');
    });
  }
  UploadProof1Image1(event:any,form: NgForm) {
    const target = event.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
  
   var reader = new FileReader();
   reader.onload = (event: any) => {
   this, this.ImageUrl = event.target.result;
   this.fileurl=this.ImageUrl;
   }
   reader.readAsDataURL(this.file);
   this.ShowImage = true;
   const fData: FormData = new FormData();
   fData.append('formdata', JSON.stringify(form.value));
   fData.append('FileType', "Image");
   if (this.file != undefined) { fData.append('File', this.file, this.file.name);
   this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { this.ImageUrl=data.URL;});}
  }

  OnProblemSelect(item:any){

  }
  onProblemDeSelect(item:any){

  }

  save(){
    let mailsubject = this.selectedProblem.map((sp:any)=>sp.Text)[0]
    const json = {
      "Attachment":this.ImageUrl || "",
      "BodyMessage":this.Query,
      "Extension":"png",
      "Key":"en",
      "MailSubject":mailsubject,
      "SupportTypeID":1,
      "UserID":parseInt(this.AdminID)
    }  
    console.log(json,"admin support");
    
  }
}
