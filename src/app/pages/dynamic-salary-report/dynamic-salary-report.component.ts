import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpCommonService } from 'src/app/services/httpcommon.service';

@Component({
  selector: 'app-dynamic-salary-report',
  templateUrl: './dynamic-salary-report.component.html',
  styleUrls: ['./dynamic-salary-report.component.css']
})
export class DynamicSalaryReportComponent implements OnInit {

  displayedColumns: string[] = [];
  displayColumns: any = {};
  headerInfo: any = {};
  headerColors: any = {};
  topHeaders: any[] = [];

  salaryData: any[] = []; // your actual row data
  OrgID: string = '';
  UserID: string = '';

  constructor(private _commonService: HttpCommonService, private http: HttpClient) { }

  ngOnInit(): void {
    this.OrgID = localStorage.getItem('OrgID') || '0';
    this.UserID = localStorage.getItem('UserID') || '';
    this.getComponentsAndSetupTable();
  }

  getComponentsAndSetupTable() {
    const apiUrl = `api/Salary/GetGrossComponents?OrgID=${this.OrgID}`;
    this.http.get<any>(apiUrl).subscribe(res => {
      if (res?.Status && res?.ComponentList) {
        const components = res.ComponentList;

        const earnings = components.filter((c: { Type: string; }) => c.Type === 'Earnings');
        const deductions = components.filter((c: { Type: string; }) => c.Type === 'Deduction');

        const dynamicDisplayColumns: any = {};
        const dynamicDisplayedColumns: string[] = [];

        // Add earnings
        earnings.forEach((c: { ComponentName: string; }) => {
          const key = this.sanitizeColumnKey(c.ComponentName);
          dynamicDisplayColumns[key] = c.ComponentName;
          dynamicDisplayedColumns.push(key);
          this.headerInfo[key] = { text: `${c.ComponentName} (Earnings)` };
          this.headerColors[key] = { text: "#00a927", bg: "#daffe2" };
        });

        // Add deductions
        deductions.forEach((c: { ComponentName: string; }) => {
          const key = this.sanitizeColumnKey(c.ComponentName);
          dynamicDisplayColumns[key] = c.ComponentName;
          dynamicDisplayedColumns.push(key);
          this.headerInfo[key] = { text: `${c.ComponentName} (Deduction)` };
          this.headerColors[key] = { text: "#ff2d2d", bg: "#fff1f1" };
        });

        // Static columns
        this.displayColumns = {
          SLno: "S.No",
          MappedEmpId: "Emp ID",
          Employee: "Employee Name",
          ...dynamicDisplayColumns,
          TotalDeduction: "Total Deduction",
          NetSalary: "Net Salary"
        };

        this.displayedColumns = [
          "SLno",
          "MappedEmpId",
          "Employee",
          ...dynamicDisplayedColumns,
          "TotalDeduction",
          "NetSalary"
        ];

        this.updateTopHeaders(earnings, deductions);
      }
    });
  }

  sanitizeColumnKey(name: string): string {
    return name.replace(/\s+/g, '_').replace(/[^\w]/g, '');
  }


  updateTopHeaders(earnings: any[], deductions: any[]) {
    this.topHeaders = [
      {
        id: 'static',
        name: '',
        colspan: 3
      },
      {
        id: 'earnings',
        name: 'Earnings',
        colspan: earnings.length
      },
      {
        id: 'deductions',
        name: 'Deductions',
        colspan: deductions.length
      },
      {
        id: 'totals',
        name: '',
        colspan: 2
      }
    ];
  }

}
