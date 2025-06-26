import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateMessageComponent } from './create-message/create-message.component';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ShowAlertComponent } from './showalert/showalert.component';
import { DatePipe } from '@angular/common';
import { ShowalertComponent } from '../create-employee/showalert/showalert.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  UserID:any;MainMessageID:any;
  ApiURL:any;
  MessageList:any=[];fileurl:any;
MessageHistory:any; ProfileList:any;
MainUserID:any;FileType:any
UserName:any;
 UserProfile:any;
 Message:any;
 BranchID:any;
 DepartmentID:any;LoginType:any;
 MessageStart:any;
ShowMessageTab=false;
AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
IsEmail:any; ReplyFiles:any=[];
IsAdmin:any;MessageType:any;Employees:any;
searchAll:any='';searsearchEmployeechAll:any='';Branches:any;Departments:any;
MessageWithoutFilter:any[]=[];EmployeesString="";subMessageListFilter:any[]=[]
ShowChatHistory:any=false;ShowChats:any=true;
file:File | any;ImageUrl:any;ShowImage=false;CurrentDomain:any;
OverAllReadCount:any;
OverAllUnreadCount:any;
OverAllCount:any;
  SubMessageList: any;
  EmployeeName: any;
  Department: any;
  Branch: any;
  ProfileImage: any;
  FromDate:any
  ToDate:any
  EmployeeID: any;HistoryFilter:any;
  searchEmployee:any='';
  ShowSingleShow=false;
  OriginalMessageList: any;
  constructor(private _route: Router,private toastr: ToastrService,
    private spinnerService: NgxSpinnerService,private _commonservice: HttpCommonService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.HistoryFilter="Unread";
    var CurrentDate =new Date();
    var datePipe = new DatePipe('en-US');
    // this.FromDate = datePipe.transform(CurrentDate, 'dd/MM/yyyy');
    // this.ToDate = datePipe.transform(CurrentDate, 'dd/MM/yyyy');
    this.CurrentDomain=environment.Url;
    this.UserID=localStorage.getItem("EmployeeID");
    this.MainUserID=localStorage.getItem("UserID");
    this.MainMessageID=localStorage.getItem("MainMessageID");
    this.IsEmail=localStorage.getItem("LoginStatus");
    this.IsAdmin=localStorage.getItem("IsAdmin");
     this.GetMessages();
      this.LoginType =  localStorage.getItem("LoginStatus");if(this.LoginType=="true"){this.LoginType="Email";} else{this.LoginType="Mobile";}
  
  }

  ChangeHistoryFilter(Type:any)
  {
    if(Type=="Read")
    {
      this.SubMessageList = this.OriginalMessageList.filter((message: any) => message.UnReadCount == 0 && message.IsreplyExist==true);  
    }
    else if(Type=="Unread"){
      this.SubMessageList = this.OriginalMessageList.filter((message: any) => message.UnReadCount > 0);  
    }
    else{
this.SubMessageList=this.OriginalMessageList;
    }
    this.HistoryFilter=Type;
  }
  UploadMultipleFiles(event:any,form: NgForm) {
    const target = event.target as HTMLInputElement;
   
    const fileList = event.target.files;
    if(fileList.length<5)
    {
      for(let i=0;i<fileList.length;i++)
        {
          this.file = (target.files as FileList)[i];
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
          fData.append('ImageType','Chats');
          if (this.file != undefined) { fData.append('File', this.file, this.file.name);
          this._commonservice.ApiUsingPost("Admin/FileUpload",fData).subscribe(data => { 
            this.ImageUrl=data.NewUrl;
            this.FileType=data.fileType;
            this.ReplyFiles.push({FilePath:this.ImageUrl,FileType:this.FileType});
          });
        }
      }
    }
    else{
      // this.toastr.warning("You are allowed to choose only 4 files")
      this.ShowToast("You are allowed to choose only 4 files","warning")
    }
  }

removeFile(index: number): void {
    if (index >= 0 && index < this.ReplyFiles.length) {
        this.ReplyFiles.splice(index, 1);
        if(this.ReplyFiles.length==0){this.ShowImage=false;}
    } else {
        console.error('Invalid index');
    }
}

  GetMessages()
  {
    this.spinnerService.show();
    this.ApiURL="Messages/GetMessages?UserID="+this.MainUserID+"&BranchId=0&DeptId=0&IsEmail=false&FromDate="+this.FromDate+"&ToDate="+this.ToDate+"";
    if(this.LoginType=="Email")
      {
        this.ApiURL="Messages/GetMessages?UserID="+this.MainUserID+"&BranchId=0&DeptId=0&IsEmail=true&FromDate=&ToDate=";
      }
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.MessageList = res.List;
      this.spinnerService.hide();
      this.MessageWithoutFilter = [...this.MessageList]
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
  }
  GetMessageHistory()
  { 
    this.HistoryFilter="Unread";
    this.ShowSingleShow=false;
    this.ApiURL="Messages/GetMessageHistory?MainMessageID="+this.MainMessageID+"&UserID="+this.MainUserID+"&BranchID=0&DeptID=0&IsEmail=false";
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.OriginalMessageList=res.MessageReceivers;
      this.SubMessageList =   this.OriginalMessageList;  
      this.OverAllReadCount=res.ReadMessageCounts;
      this.OverAllUnreadCount=res.UnreadMessageCounts;
      this.OverAllCount=res.AllMessageCounts;
      if(this.SubMessageList.length==1)
      {
        this.HistoryFilter="All";
        this.ShowChatHistory=true;
        this.ShowChats=false;
        this.GetUserMessageHistory(this.SubMessageList[0].EmployeeID, this.SubMessageList[0].EmployeeName,this.SubMessageList[0].Branch,this.SubMessageList[0].Department,this.SubMessageList[0].ProfileImage,null)
      this.ShowSingleShow=true;
      }
      else{
        // if(this.OverAllUnreadCount>0)
        // {
        //   this.HistoryFilter="Unread";
        // }
        // else  if(this.OverAllReadCount>0)
        //   {
        //     this.HistoryFilter="Read";
        //   }
        //   else{
        //     this.HistoryFilter="All";
        //   }
        this.ShowChatHistory=true;
        this.ShowChats=false;
      }
      this.subMessageListFilter = [...this.SubMessageList]
    }, (error) => {
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }

  GetUserMessageHistory(UserID:any, Username:any,Branch:any,Department:any,Profile:any,index:any)
  { 
    this.EmployeeName=Username;
    this.EmployeeID=UserID;
    this.Branch=Branch;this.Department=Department;this.ProfileImage=Profile;
    this.ApiURL="Messages/GetUserMessageHistory?MainMessageID="+this.MainMessageID+"&UserID="+UserID+"&LoggedInUserID="+this.MainUserID;
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.MessageStart=res.FirstMessageStart;
      this.MessageHistory = res.List;
      if(index!=null)
      {
        this.SubMessageList[index].UnReadCount=0;
        // this.OverAllUnreadCount=this.OverAllUnreadCount-1;
      }
            // this.MessageType=res.MessageType;
      // this.Employees=res.Employees;

      // this.Branches=res.Branches;
      // this.Departments=res.Departments;
//       if(this.MessageType=="Single")
//       {
//         this.UserID=this.Employees[0].id;
//         this.GetUserProfile();
//       }
//       else
//       {
//         for(let i=0;i<this.Employees.length;i++)
//         {
//           if(i==0)
//           {
// this.EmployeesString=this.EmployeesString+ this.Employees[i].text;
//           }
//           else{
//             this.EmployeesString=this.EmployeesString+ ", "+this.Employees[i].text;
//           }
          
//         }
//         console.log(this.EmployeesString);
//       }
      this.spinnerService.hide();
    }, (error) => {
      // // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  GetUserProfile()
  {  this.ApiURL="Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=true";
    if(this.LoginType!="Email"){
      this.ApiURL="Employee/GetUserProfileDetails?ID="+this.UserID+"&IsEmail=false";
    }
    this.spinnerService.show();
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
if(res.Status==true)
{
  this.ProfileList = res.List;
  this.UserName=this.ProfileList[0].FirstName + " "+ this.ProfileList[0].LastName;
  this.UserProfile=this.ProfileList[0].ProfileImageURl;
  this.BranchID=this.ProfileList[0].BranchID;
  this.DepartmentID=this.ProfileList[0].DepartmentID;
  localStorage.setItem('OrgName', res.List[0].Organization)
}
      
      this.spinnerService.hide();
    }, (error) => {
      // this.toastr.error(error.message);
      this.spinnerService.hide();
    });
    this.spinnerService.hide();
  }
  CloseChat()
  {
    this.ShowChatHistory=false;
    this.ShowChats=true;
    this.ShowSingleShow=false;
  }
  ChangeUser(MainMessageID:any, Index:any)
  {
    this.MessageList[Index].UnReadCount=0;
    this.MainMessageID=MainMessageID;
    localStorage.setItem("MainMessageID",MainMessageID);
    this.GetMessageHistory();
   
  }
  AllFilter() {
    const searchTerm = this.searchAll.trim().toLowerCase();
    this.MessageList = this.MessageWithoutFilter.filter(item => {
      return (
        // item.Message.toString().trim().toLowerCase().includes(this.searchAll)
        item.Message.toString().trim().toLowerCase().includes(searchTerm) ||
      item.Branch.toString().trim().toLowerCase().includes(searchTerm) ||
      item.Department.toString().trim().toLowerCase().includes(searchTerm)
      );
    });
  }
  empFilter() {
    this.SubMessageList = this.subMessageListFilter.filter(item => {
      return (
        item.EmployeeName.toString().trim().toLowerCase().includes(this.searchEmployee)
      );
    });
  }
  ReplyMessage()
  {
    if(this.Message=="" || this.Message==null ||this.Message==undefined)
    {
      // this.toastr.warning("Please Enter Message");
      this.ShowToast("Please Enter Message","warning")
    }
    else
    {
      const json={
        MessageID:this.MainMessageID,
        Message:this.Message,
        FromEmployee:this.MainUserID,
        ToEmployee:this.EmployeeID,
        BranchID:this.BranchID,
        DepartmentID:this.DepartmentID,
        Files:this.ReplyFiles
      }
      this._commonservice.ApiUsingPost("Messages/ReplyMessage",json).subscribe((res:any) => {
        if(res.Status==true)
        {
          // this.toastr.success(res.Message);
          this.ShowToast(res.Message,"success")
          this.Message="";this.ReplyFiles=[];this.ShowImage=false;
          this.GetMessageHistory();
          this.GetUserMessageHistory(this.EmployeeID,this.EmployeeName,this.Branch,this.Department,this.ProfileImage,null);
        }
        else{
          // this.toastr.warning(res.Message);
          this.ShowToast(res.Message,"warning")
        }
              
              this.spinnerService.hide();
            }, (error) => {
              // this.toastr.error(error.message);
              this.spinnerService.hide();
            });
    }
   
  }
  ShowAlert(IP:any,URL: any): void {
    var CompleteURL=IP+""+URL;
    this.dialog.open(ShowAlertComponent,{
      data: { FileUrl:CompleteURL}
       ,panelClass: 'custom-dialog',
        disableClose: true }).afterClosed().subscribe((res:any)=>{
      if(res){
      }
    })
  }
  createMeessage(){
    this.dialog.open(CreateMessageComponent).afterClosed().subscribe((res:any)=>{
      this.GetMessages()
    })
  }
  Close()
  {
    this.GetMessages();
    this.ShowChatHistory=false;
    this.ShowChats=true;
  }

          ShowToast(message: string, type: 'success' | 'warning' | 'error'): void {
            this.dialog.open(ShowalertComponent, {
              data: { message, type },
              panelClass: 'custom-dialog',
              disableClose: true  // Prevents closing on outside click
            }).afterClosed().subscribe((res) => {
              if (res) {
                console.log("Dialog closed");
              }
            });
          }
}
