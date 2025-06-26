import { Component, ViewChild,  TemplateRef, OnInit,} from '@angular/core';
import {  startOfDay,  endOfDay,  subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours, parse} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  CalendarEvent,  CalendarEventAction,  CalendarEventTimesChangedEvent,  CalendarView} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import { NgxSpinnerService } from 'ngx-spinner';

export class FormInput {
  IsHalfday:any;
  StartDate:any;
  EndDate:any;
  Title:any;
  Description:any;
}
export class eventclass{
  start:any;
  end:any;
  title:any;
  color:any;
  allDay:any;
  draggable:any;
  actions:any;
  comment:any;
}

@Component({
  selector: 'app-holiday-master',
  templateUrl: './holiday-master.component.html',
  styleUrls: ['./holiday-master.component.css']
})
export class HolidayMasterComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | any;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  CalendarEvents:Array<eventclass> = [];
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   

  modalData: {
    action: string;
    event: CalendarEvent;
  } | any;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent: CalendarEvent<any>) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  refresh = new Subject<void>();
title:any;description:any;
  activeDayIsOpen: boolean = false;
  ApiURl:any
  AdminID:any;OrgID:any;
  formInput: FormInput|any;
  events: any;
  HolidayList: any;
  index: any;EventStartDate:any;EventEndDate:any;
  constructor(private modal: NgbModal,private _router: Router,private _commonservice: HttpCommonService,private spinnerService: NgxSpinnerService, private toastr: ToastrService) {}

ngOnInit(): void {
  if (localStorage.getItem('LoggedInUserData') == null) {
  
    this._router.navigate(["auth/signin-v2"]);
  }
  else {
    this.AdminID = localStorage.getItem("AdminID");
    this.OrgID = localStorage.getItem("OrgID");
  }
  this.formInput = {     
    IsHalfday:false,
    StartDate:'',
    EndDate:'',
    Title:'',
    Description:''
  };
  this.SetCalendarEvent();
  
this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}

}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    var datePipe = new DatePipe("en-US");
    this.formInput.StartDate = datePipe.transform(date, 'yyyy-MM-dd');
    this.formInput.EndDate= this.formInput.StartDate
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent: CalendarEvent<any>) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: any): void {
    this.title=event.comment;
this.description=event.title;
this.EventStartDate=event.start;
this.EventEndDate=event.end;
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  Save() { 
    if (this.formInput.StartDate == ""||this.formInput.StartDate ==undefined) {
       this.toastr.warning("Please Select StartDate...!");
       return false;
     }
     else  if (this.formInput.EndDate == ""||this.formInput.EndDate ==undefined) {
       this.toastr.warning("Please Select StartDate...!");
       return false;
     }
     else  if (this.formInput.Title == ""||this.formInput.Title ==undefined) {
       this.toastr.warning("Please Enter Title...!");
       return false;
     }
     else  if (this.formInput.Description == ""||this.formInput.Description ==undefined) {
       this.toastr.warning("Please Enter Description...!");
       return false;
     }
     else{
       const json={
         AdminID:this.AdminID, 
         Comment:this.formInput.Description,
         ModifiedBy:this.AdminID,
         StartDate:this.formInput.StartDate,
         EndDate:this.formInput.EndDate,
         IsHalfday:this.formInput.IsHalfday,
         OrgID:this.OrgID,
         Title:this.formInput.Title
                   }
       this._commonservice.ApiUsingPost("Portal/SetHolidays",json).subscribe(
   
         (data: any) => {
           if(data.Status==true){
            this.formInput.Description='';
            this.formInput.StartDate='';
            this.formInput.EndDate='';
            this.formInput.IsHalfday='';
            this.formInput.Title='';
           this.spinnerService.hide();
           this.toastr.success(data.Message);
             window.location.reload();
           }
           else
           {
             this.toastr.warning(data.Message);
               this.spinnerService.hide();
           }
           
         }, (error: any) => {
           localStorage.clear();
   
           // this.toastr.error(error.message);
           this.spinnerService.hide();
          }
       );
       return true;
     }
       
   }

  Checkdate()
  {
    if(this.formInput.StartDate=='' ||this.formInput.StartDate==null||this.formInput.StartDate=="" ||this.formInput.StartDate==undefined)
    {
      this.toastr.warning("Please select StartDate");
    }
   else if(this.formInput.EndDate=='' ||this.formInput.EndDate==null||this.formInput.EndDate=="" ||this.formInput.EndDate==undefined)
    {
this.ApiURl="Portal/CheckDateRange?FromDate="+this.formInput.StartDate+"&ToDate="+this.formInput.EndDate;
this._commonservice.ApiUsingGetWithOneParam(this.ApiURl).subscribe((res:any) => {
if(res.Status==false)
{
  this.toastr.warning("Holidays EndDate should be Greater than StartDate");
  this.formInput.EndDate='';
}
}, (error) => {});
    }
  }

  SetCalendarEvent()
  {
    var currentDate=new Date();
    this.ApiURl="Admin/GetHolidays?AdminID="+this.AdminID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURl).subscribe((res:any) => {
      if(res.Status==true)
      {
        this.HolidayList=res.Holidays;
        for(this.index=0;this.index<this.HolidayList.length;this.index++)
        {
          let holi=new eventclass();
          holi.allDay=true;
          holi.draggable=true;
          holi.color={ primary: '#ad2121',
          secondary: '#FAE3E3'};
          holi.start=new Date(this.HolidayList[this.index].Date);
          holi.title=this.HolidayList[this.index].Comment;
          holi.end=new Date(this.HolidayList[this.index].Date);
          holi.actions=this.actions,
          holi.comment=this.HolidayList[this.index].Title;
          this.CalendarEvents.push(holi);
        
        }
        this.events=this.CalendarEvents;
      }
      }, (error) => {});
  }
}