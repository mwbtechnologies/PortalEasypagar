// import { Component } from '@angular/core';
// import { ViewChild } from "@angular/core";

//bar graph
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";

export type Chart1Options = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};


//area graph
import {
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,

} from "ng-apexcharts";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { HttpCommonService } from "src/app/services/httpcommon.service";
import { Router } from "@angular/router";



export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-other-dashboard',
  templateUrl: './other-dashboard.component.html',
  styleUrls: ['./other-dashboard.component.css']
})
export class OtherDashboardComponent implements OnInit{
  public chart1Options: Partial<Chart1Options>|any;
  AddPermission:any;EditPermission:any;ViewPermission:any;DeletePermission:any;   
  data:any;
  public chartOptions: Partial<ChartOptions>|any;
  cca: any;
  LoggedInUserID: any;ApiURL:any;BannerList:any;ProfileDetails:any;
UserName:any;DashboardCounts:any;DashboardData:any; LeaveList:any; LoanList:any; AttendanceAlerts:any;
OrganizationName:any;TotalUsers:any;


 //bar graph 
  constructor(private service:AuthService,private _router: Router,private toastr: ToastrService,private _commonservice: HttpCommonService) {
    this.chart1Options = {
      series: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 38]
        },

        {
          name: "PRODUCT B",
          data: [13, 23, 20, 8, 13, 27]
        },

        {
          name: "PRODUCT C",
          data: [10, 13, 20, 8, 3, 12]
        }
      ],
      chart: {
        type: "bar",
        height: 140,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        },
        
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: [
          "2012",
          "2014",
          "2016",
          "2018",
          "2020",
          "2022",
        ]
      },
      yaxis: {
        lines:{
          show:false
        }
        
      },
      legend: {
        position: "right",
        offsetY: 40
      },

      fill: {
        opacity: 1
      }
    };
    this.chartOptions = {
          series: [
            {
              name: "Active Users",
              // data: series.monthDataSeries1.prices,
              
                show: false,      // you can either change hear to disable all grids
                xaxis: {
                  lines: {
                    show: false  //or just here to disable only x axis grids
                   }
                 },  
                yaxis: {
                  lines: { 
                    show: false  //or just here to disable only y axis
                   }
                 },   
              
            
              },
            
          ],
          chart: {
            type: "area",
            height: 140,
            zoom: {
              enabled: false
            },
           
          },
          dataLabels: {
            enabled: false

          },
          stroke: {
            curve: "smooth",
            width: 3,
            fill: {
              type: "none"
            }

          },
    
          title: {
            // text: "Total Active users",
            // align: "left"
          },
          
                   
        // labels: series.monthDataSeries1.dates,
          xaxis: {
            labels: {
              show: false
            },
            lines:{
                show:false
            },
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
        
          },
          yaxis: {
            show:false,
            opposite: false
          },
          legend: {
            horizontalAlign: "left"
          },
          
        
          
        };
      }
  ngOnInit(): void {
    this.LoggedInUserID=localStorage.getItem("UserID");
    this.GetBanners();
    this.GetUserProfile();
    this.GetCounts();
    this.AddPermission=localStorage.getItem("AddPermission"); if(this.AddPermission=="true"){this.AddPermission=true;} else{this.AddPermission=false;}
    this.EditPermission=localStorage.getItem("EditPermission");  if(this.EditPermission=="true"){this.EditPermission=true;}else{this.EditPermission=false;}
    this.ViewPermission=localStorage.getItem("ViewPermission");  if(this.ViewPermission=="true"){this.ViewPermission=true;}else{this.ViewPermission=false;}
    this.DeletePermission=localStorage.getItem("DeletePermission");  if(this.DeletePermission=="true"){this.DeletePermission=true;}else{this.DeletePermission=false;}
   this.ViewPermission=true;
  }
  GetBanners()
  { this.ApiURL="Employee/GetBanners?EmployeeID="+this.LoggedInUserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.BannerList = res.List;

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }
  GetUserProfile()
  {    this.ApiURL="Portal/GetAdminProfile?AdminID="+this.LoggedInUserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      this.ProfileDetails=res.List;
      this.UserName=this.ProfileDetails[0].FirstName+" "+this.ProfileDetails[0].LastName;
      this.TotalUsers=this.ProfileDetails[0].Users;
      this.OrganizationName=this.ProfileDetails[0].Organization;
      if(this.OrganizationName!=null && this.OrganizationName!=undefined && this.OrganizationName!="")
      {
        this.OrganizationName= this.OrganizationName.toUpperCase();
      }

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }

  GetCounts()
  {    this.ApiURL="Portal/GetAdminDashboard?AdminID="+this.LoggedInUserID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
    if(res.Status==true)
    {
      this.DashboardData=res.List;
      this.DashboardCounts=this.DashboardData[0].Counts;
      this.LeaveList=this.DashboardData[0].LeaveRequests;
      this.LoanList=this.DashboardData[0].LoanRequests;
      this.AttendanceAlerts=this.DashboardData[0].AttendanceAlerts;
    }

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }

  UpdateNotificationStatus(ID:any)
  {    this.ApiURL="Portal/UpdateNotificationStatus?NotificationID="+ID;
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
      window.location.reload();

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }
  
  ApproveAtten(ID:any)
  {    this.ApiURL="Admin/ApproveAttendanceNew?AttendanceID="+ID+"&Status='Yes'";
    this._commonservice.ApiUsingGetWithOneParam(this.ApiURL).subscribe((res:any) => {
     if(res.Status==true)
     {
      this.toastr.success(res.Message);
      window.location.reload();
     }
     else{
      this.toastr.warning(res.Message);
     }

    }, (error) => {
      // this.toastr.error(error.message);

    });
  
  }

  Navigate(path:any)
  {
    this._router.navigate([path]);
  }
}
