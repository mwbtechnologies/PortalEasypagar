import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpCommonService } from 'src/app/services/httpcommon.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import * as XLSX from 'xlsx';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { NumberPrecisionPipe } from 'src/app/pipes/number-precision.pipe';

@Component({
  selector: 'app-common-table-buttons',
  templateUrl: './common-table-buttons.component.html',
  styleUrls: ['./common-table-buttons.component.css']
})
export class CommonTableButtonsComponent implements OnInit, OnChanges {
    isScrolled: boolean
    @HostListener('window:scroll')
    onWindowScroll() {
        this.isScrolled = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > 0;
    }
    @ViewChild('paginator') paginator!: MatPaginator
    @ViewChild('tableContainer') tableContainer!: ElementRef
    @ViewChild('drawer') drawer: any
    @Input() data: any[] = [] // MatTableDataSource<any> = new MatTableDataSource<any>()
    dataSource: MatTableDataSource<any>
    @Input() name: any
    @Input() displayedColumns: any
    @Input() displayColumns: any
    @Input() actions: any
    @Input() Loading: any
    @Input() editableColumns: any
    @Input() topHeaders: any
    @Input() headerColors: any
    @Input() headerInfo: any
    @Input() smallHeaders: any
    @Input() ReportTitles: any
    @Input() CellColors: any
    @Input() dataColors: any
    @Input() ExportName: any
    @Input() ExportYearMonth: any
    @Input() ExportBranch: any
    @Output() StatusUpdate: EventEmitter<any> = new EventEmitter()
    @Output() actionEmitter: EventEmitter<any> = new EventEmitter()
    @Input() cellWiseButtons: any = {}
    @Input() searchVisible: Boolean = true

    @Output() cellButtonClicked: EventEmitter<any> = new EventEmitter()


    originalDisplayedColumns: any
    selectedRows: any[] = []

    selectAll: boolean = false


    sortType: any
    sortIndex: any
    currentEditData: any = undefined
    editValue: number = 0
    editRow: any = undefined
    editRowFail: any = undefined
    searchText: string = "";

    constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef,
        private globalToastService: ToastrService,) {
        this.sortType = 0
        this.dataSource = new MatTableDataSource<any>(this.data)
        // this.dataSource.paginator?.firstPage();
        this.isScrolled = false;

    }

    ngOnInit(): void {

    }

    emitCellButtonEvent(row: any, column: string, button: any) {
        this.cellButtonClicked.emit({ row, column, button });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.cdr.detectChanges()
        console.log(changes);

        if (this.paginator && this.dataSource) {
            this.dataSource.paginator = this.paginator;
        }
        if (changes['Loading']?.currentValue == true) {
            this.resetValues()
        }
        if (changes['data']?.currentValue) {
            this.dataSource.data = changes['data'].currentValue
            console.log(this.dataSource.data);
        }
        if (changes['displayedColumns']?.currentValue) {
            this.originalDisplayedColumns = JSON.parse(JSON.stringify(changes['displayedColumns']?.currentValue))
        }
        if (changes['name']?.currentValue) {
            this.ExportName = changes['name']?.currentValue
        }
    }


    applyFilter() {
        this.dataSource.filter = this.searchText.trim().toLowerCase();
        this.actionEmitter.emit({ row: this.dataSource, action: { name: "searchUpdate" } })
    }

    removesearch() {
        this.searchText = "";
        this.applyFilter();
    }

    resetValues() {
        let data: any[] = Array(5).fill(['Loading'])

        this.dataSource.data = [...data]
        // this.actions = []
    }

    sort(index: any) {
        if (this.displayedColumns[index] === 'SelectAll' || this.displayedColumns[index] === 'Actions') {
            return;
        }

        if (this.sortIndex === index) {
            this.sortType = (this.sortType + 1) % 3;
        } else {
            this.sortType = 1;
        }

        this.sortIndex = index;

        if (this.sortType > 0) {
            let data = [...this.dataSource.data];

            data.sort((a: any, b: any) => {
                const column = this.displayedColumns[this.sortIndex];
                const aValue = a[column];
                const bValue = b[column];

                // Determine the data type of the column
                const dataType = typeof aValue;

                // Perform sorting based on data type
                if (dataType === 'string') {
                    return this.sortType === 1 ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                } else if (dataType === 'number') {
                    return this.sortType === 1 ? aValue - bValue : bValue - aValue;
                } else if (dataType === 'object' && aValue instanceof Date && bValue instanceof Date) {
                    return this.sortType === 1 ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
                } else {
                    return 0;
                }
            });
            this.dataSource.data = [...data]
        } else {
            // this.dataSource = new MatTableDataSource<any>(this.data)
            this.dataSource.data = this.data
        }
    }

    getColumnName(colName: string) {
        if (this.displayColumns[colName]) {
            return this.displayColumns[colName]
        } else return colName
    }

    clearSelectAll() {
        this.selectAll = false
        this.changeAll()
    }

    changeAll() {
        this.dataSource.data.map((element: any) => (element["isSelected"] = this.selectAll));
        if (this.selectAll) {
            this.selectedRows = [...this.dataSource.filteredData];
            // this.checkboxSelect.emit(this.selectedRows)
        } else {
            this.selectedRows = [];
            // this.checkboxSelect.emit(this.selectedRows)
        }

        this.actionEmitter.emit({ row: this.selectedRows, action: { name: "updatedSelectedRows" } })

    }

    checkButtonFilter(column: string, rowData: any): boolean {
      

        const filters = this.cellWiseButtons[column]?.[0]?.filters;
        

        if (!filters) return true; // No filters = always show

        return Object.keys(filters).every(key => rowData[key] === filters[key]);
    }

    isDateType(data: any, column: any): any {
        let validDateHeader: any = ["LoanIssuedDate", "DeleteDate", "DeletedDate",
            "EmplooyeeCreatedDate", "EmployeeDeletedDate", "CreatedDate",
            "Date", "AssignedDate", "ModifiedDate", "Startdate", "assignedDate",
            "returnDate", "uploadedDate", "createdDate", "createdAt", "uploadedAt",
            "updatedDate", "approvedDate", "StartDateByAdmin", "AssignedOn", "EndDateByAdmin"]
        if (validDateHeader.includes(column)) {
            const date = new Date(data);
            if (date.getFullYear() == 1970) return false
            return !isNaN(date.getTime()); // Check if the date is valid
        }
        return false
        // return data instanceof Date
    }
    isDateTimeType(data: any, column: any): any {
        let validDateHeader: any = ['CreatedDateTime', 'returnDate']
        if (validDateHeader.includes(column)) {
            const date = new Date(data);
            if (date.getFullYear() == 1970) return false
            return !isNaN(date.getTime()); // Check if the date is valid
        }
        return false
        // return data instanceof Date
    }



    onRowCheckboxChange(row: any) {
        const index = this.selectedRows.findIndex((selectedRow) => selectedRow.SLno === row.SLno);
        if (row["isSelected"] && index === -1) {
            this.selectedRows.push(row);
            // this.checkboxSelect.emit(this.selectedRows)
        } else if (!row["isSelected"] && index !== -1) {
            this.selectedRows.splice(index, 1);
            // this.checkboxSelect.emit(this.selectedRows)
        }
        const allSelected = this.dataSource.data.every((element: any) => element["isSelected"])
        this.selectAll = allSelected;

        this.actionEmitter.emit({ row: this.selectedRows, action: { name: "updatedSelectedRows" } })
    }

    convertToLocalTimezone(utcDate: string, column: string): string {
        let format = 'DD MMM YYYY'
        if (this.isDateTimeType(utcDate, column)) {
            format = 'DD MMM YYYY, h:mm:ss a'
        }
        const date = moment(utcDate).format(format);
        return date.toLocaleString(); // Converts to local timezone and formats the date
    }

    onPageChange(event: any): void {
        if (event.pageIndex > event.previousPageIndex) {
            this.tableContainer.nativeElement.scrollTop = 0
        }
    }

    ChangeStatus(row: any) {
        this.StatusUpdate.emit(row)
    }

    getStatusMessage(status: any) {
        if (status == true) return "Click to Deactivate"
        else if (status == false) return "Click to Activate"
        else return "Click to change status"
    }

    actionCall(row: any, action: any) {
        this.actionEmitter.emit({ row, action })
    }

    rowClick(row: any) {
        let rowClickAction = this.actions.filter((a: any) => a.rowClick)
        if (rowClickAction && rowClickAction.length > 0)
            this.actionCall(row, rowClickAction[0])
    }

    validateActionFilter(row: any, filter: any) {
        if (!filter) return true
        else {
            for (let i = 0; i < filter.length; i++) {
                const f = filter[i];
                if (row[f.field] != f.value) {
                    return false
                }

            }
            return true
        }
    }

    editTableData(column: any, rowIndex: any) {

        if (this.currentEditData?.column == column && this.currentEditData?.rowIndex == rowIndex) {
            let row = { data: this.dataSource.filteredData[rowIndex], column, value: this.editValue }
            if (this.editableColumns[column]) {
                let regex = this.editableColumns[column].regex && this.editableColumns[column].regex.length > 0 ?
                    new RegExp(this.editableColumns[column].regex) : this.editableColumns[column].type == 'Number' ? new RegExp('^(0|0\\.\\d+|[1-9]\\d*(\\.\\d*)?)$') : null
                console.log(regex);
                if (regex != null) {
                    console.log(regex.test(this.editValue.toString()));

                    if (!regex.test(this.editValue.toString())) {
                        this.globalToastService.warning(this.editableColumns[column].errorMessage || "Please Enter Valid  Input");
                        this.editRowFail = rowIndex
                        setTimeout(() => {
                            this.editRowFail = undefined
                        }, 1000);
                    } else {

                        this.actionEmitter.emit({ row, action: { name: 'editColumn' } })
                        this.editRow = rowIndex
                        setTimeout(() => {
                            this.editRow = undefined
                        }, 1000);
                    }
                } else {
                    this.actionEmitter.emit({ row, action: { name: 'editColumn' } })
                    this.editRow = rowIndex
                    setTimeout(() => {
                        this.editRow = undefined
                    }, 1000);
                }
            } else {
                this.actionEmitter.emit({ row, action: { name: 'editColumn' } })
                this.editRow = rowIndex
                setTimeout(() => {
                    this.editRow = undefined
                }, 1000);
            }
            this.editValue = this.editableColumns[column].type && this.editableColumns[column].default ? this.editableColumns[column].default : 0
            this.currentEditData = undefined

        } else {
            this.editValue = this.dataSource.filteredData[rowIndex][column]
            this.currentEditData = { column, rowIndex }
        }
    }

    getTopHeaders() {
        return this.topHeaders?.map((l: any) => l.id)
    }

    getHeaderColor(name: string) {
        if (this.headerColors && this.headerColors[name] && this.headerColors[name].text) {
            return this.headerColors[name].text
        }
        return undefined
    }
    getHeaderBG(name: string) {
        if (this.headerColors && this.headerColors[name] && this.headerColors[name].bg) {
            let op = "" + this.headerColors[name].bg + " !important"
            return op
        }
        return undefined
    }

    getCellBG(name: string) {
        if (this.CellColors && this.CellColors[name] && this.CellColors[name].bg) {
            let op = "" + this.CellColors[name].bg + " !important"
            return op
        }
        return undefined
    }
    getHeaderBorder(name: string) {
        if (this.headerColors && this.headerColors[name] && this.headerColors[name].text) {
            let op = "1px solid " + this.headerColors[name].text
            return op
        }
        return undefined
    }

    downloadReport(selectedColumns: any) {

        const dialogRef = this.dialog.open(DownloadReport, {
            disableClose: true,
            data: { displayedColumns: this.displayedColumns, selectedColumns, displayColumns: this.displayColumns, headerColors: this.headerColors, originalDisplayedColumns: this.originalDisplayedColumns }
        })

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let selectedData = this.getSelectedData(result.selectedColumns)
                if (result.fileType == 'pdf') this.exportPdf(selectedData, result.selectedColumns)
                if (result.fileType == 'excel') this.exportExcel(selectedData, result.selectedColumns)
                // Handle the result data here
            }
        });
    }

    showColumnSelection() {
        const dialogRef = this.dialog.open(ColumnSelection, {
            disableClose: true,
            data: { displayedColumns: this.displayedColumns, displayColumns: this.displayColumns, originalDisplayedColumns: this.originalDisplayedColumns, headerColors: this.headerColors }
        })

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // console.log(this.displayColumns,result);
                if (result.selectedColumns && result.selectedColumns.length > 0) {
                    this.displayedColumns = result.selectedColumns
                }

                // let selectedData = this.getSelectedData(result.selectedColumns)
                // if(result.fileType == 'pdf') this.exportPdf(selectedData,result.selectedColumns)
                // if(result.fileType == 'excel') this.exportExcel(selectedData,result.selectedColumns)
                // Handle the result data here
            }
        });
    }


    getSelectedData(header: any) {
        const dataToExport = this.selectedRows && this.selectedRows.length > 0 ? this.selectedRows : this.dataSource.filteredData;
        return JSON.parse(JSON.stringify(dataToExport)).map((d: any) => {
            Object.keys(d).forEach(dkey => {
                if (this.isDateType(d[dkey], dkey) == true) {
                    d[dkey] = this.convertToLocalTimezone(d[dkey], dkey)
                }
            });
            d.Status = d.Status == true ? 'Active' : 'InActive'
            return header.map((h: any) => d[h])
        })
    }

    getHeaders(selectedHeader: any, fileType: any) {
        let head = []
        let headIds: any = []
        if (fileType == 'pdf') {
            if (this.topHeaders) head.push(this.topHeaders.map((th: any) => { return { content: th.name, colSpan: th.colspan, styles: { halign: 'center' } } }))
            if (selectedHeader) head.push(selectedHeader.map((dc: any) => (this.ReportTitles && this.ReportTitles[dc]) || this.getColumnName(dc)))

        }
        if (fileType == 'excel') {
            if (this.topHeaders) {
                let extendTopHeaders = this.topHeaders?.map((th: any) => Array(th.colspan).fill(th.id))
                extendTopHeaders = extendTopHeaders.flat()
                head.push(selectedHeader.map((dc: any) => {
                    let i = this.displayedColumns.indexOf(dc)
                    if (i == -1) { return "" }
                    else {
                        let res = this.topHeaders.filter((th: any) => extendTopHeaders[i] == th.id)
                        if (res.length > 0) return res[0]
                        else return ""
                    }

                }))
            }
            // head.push(this.topHeaders.map((th:any)=>th.name))
            head.push(selectedHeader.map((dc: any) => { return { id: dc, name: this.ReportTitles && this.ReportTitles[dc] ? this.ReportTitles[dc] : this.getColumnName(dc), } }))
        }

        return head
    }

    exportPdf(data: any, selectedHeader: any) {
        const doc = new jsPDF('landscape', 'mm', 'a3');
        // doc.setFontSize(20);
        // doc.text(this.ExportName,190, 20);
        const pageWidth = doc.internal.pageSize.width;
        let currentY = 10;
        // let suborg:any = localStorage.getItem("SubOrganization")
        let selecBr: any = localStorage.getItem("BranchName") || ""
        let selecOrg: any = localStorage.getItem("Organization") || ""
        // let selecAdd:any = localStorage.getItem("Address")
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(selecOrg, pageWidth / 2, 10, { align: 'center' });
        doc.setFontSize(14);
        // doc.text(suborg, pageWidth / 2, 20, { align: 'center' });
        doc.text(selecBr, pageWidth / 2, 20, { align: 'center' });
        // doc.text(selecAdd, pageWidth / 2, 30, { align: 'center' });
        doc.text(this.ExportName, pageWidth / 2, 30, { align: 'center' });

        if (this.ExportYearMonth) {
            const textWidthExportYearMonth = doc.getTextWidth(this.ExportYearMonth);
            doc.text(this.ExportYearMonth, (pageWidth - textWidthExportYearMonth) / 2, 40);
        }

        // Center ExportBranch if it exists
        if (this.ExportBranch) {
            const textWidthExportBranch = doc.getTextWidth(this.ExportBranch);
            doc.text(this.ExportBranch, (pageWidth - textWidthExportBranch) / 2, 30);
        }
        let head: any = this.getHeaders(selectedHeader, 'pdf');
        (doc as any).autoTable({
            head,
            body: data,
            theme: 'grid',
            startY: 45,
        });

        // Save the PDF
        doc.save(this.ExportName);
    }


    getMergePoints(arr: any) {
        let merges = [];
        let start = 0;
        for (let i = 1; i <= arr.length; i++) {
            if (i === arr.length || arr[i] !== arr[i - 1]) {
                merges.push({ s: { r: 0, c: start }, e: { r: 0, c: i - 1 } });
                start = i;
            }
        }
        return merges;
    }

    // exportExcel(data:any,selectedHeader:any) {
    //   // Create an empty workbook
    //   const wb = XLSX.utils.book_new();

    //   // Define headers and data
    //   // Create a worksheet
    //   let head = this.getHeaders(selectedHeader,'excel');

    //   let headValues = head.map(hi=>hi.map((hj:any)=>hj.name || hj || "") || "")
    //   let headerRows: any[][] = [];
    //   let selecBr:any = localStorage.getItem("BranchName") || ""
    //   let selecOrg:any = localStorage.getItem("Organization") || ""
    //   if (this.ExportName) {
    //     headerRows.push([{ 
    //       v: this.ExportName, 
    //       s: { font: { bold: true, sz: 16 }, alignment: { horizontal: 'center' } } 
    //     }]);
    //   }
    //   if (selecOrg) {
    //     headerRows.push([{ 
    //       v: selecOrg, 
    //       s: { font: { bold: false, sz: 12 }, alignment: { horizontal: 'center' } } 
    //     }]);
    //   }
    //   if (selecBr) {
    //     headerRows.push([{ 
    //       v: selecBr, 
    //       s: { font: { bold: false, sz: 12 }, alignment: { horizontal: 'center' } } 
    //     }]);
    //   }
    //   const ws = XLSX.utils.aoa_to_sheet(headValues.concat(data));

    //   // Merge cells
    //   // ws['!merges'] = this.getMergePoints(head[0])
    //   const headerOffset = headerRows.length;
    // const originalMerges = this.getMergePoints(head[0]) || [];
    // ws['!merges'] = originalMerges.map(m => ({
    //   s: { r: m.s.r + headerOffset, c: m.s.c },
    //   e: { r: m.e.r + headerOffset, c: m.e.c }
    // }));

    //   for (let row = 0; row < head.length; row++) {
    //     for (let col = 0; col < head[row].length; col++) {

    //       let bgColor:string = this.headerColors ? this.headerColors[head[row][col]?.id]?.bg : "e7e0f6"

    //       if(bgColor) bgColor = bgColor.replace("#",'')
    //       else bgColor = "e7e0f6"

    //       let textColor:string = this.headerColors ? this.headerColors[head[row][col]?.id]?.text : "000"
    //       if(textColor) textColor = textColor.replace("#",'')
    //       else textColor = "000"
    //       const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
    //       ws[cellRef]['s'] = {
    //         // font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
    //         alignment: { horizontal: "center", vertical: "center" },
    //         fill: {
    //           fgColor: { rgb: bgColor }, // Background color
    //         },
    //         border: {
    //           top: { style: 'thin', color: { rgb: '000000' } },
    //           bottom: { style: 'thin', color: { rgb: '000000' } },
    //           left: { style: 'thin', color: { rgb: '000000' } },
    //           right: { style: 'thin', color: { rgb: '000000' } },
    //         },
    //         font:{
    //           bold:true,
    //           color:{rgb:textColor}
    //         }
    //       }

    //     }
    //   }

    //   // Add worksheet to workbook
    //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    //   // Write the workbook to binary and save
    //   const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, this.ExportName);
    // }

    exportExcel(data: any, selectedHeader: any) {
        const wb = XLSX.utils.book_new();

        const head = this.getHeaders(selectedHeader, 'excel');
        const headValues = head.map(hi => hi.map((hj: any) => hj.name || hj || "") || []);
        const totalCols = headValues[0]?.length || 1;

        let selecBr: any = localStorage.getItem("BranchName") || "";
        let selecOrg: any = localStorage.getItem("Organization") || "";
        let mergeRows: any[] = [];

        let headerRows: any[][] = [];
        let rowIndex = 0;

        const addStyledRow = (text: string, fontSize: number, bold: boolean) => {
            const row = new Array(totalCols).fill("");
            row[0] = {
                v: text,
                s: {
                    font: { bold, sz: fontSize },
                    alignment: { horizontal: 'center', vertical: 'center' }
                }
            };
            mergeRows.push({
                s: { r: rowIndex, c: 0 },
                e: { r: rowIndex, c: totalCols - 1 }
            });
            headerRows.push(row);
            rowIndex++;
        };

        // Add header rows conditionally
        if (this.ExportName) addStyledRow(this.ExportName, 16, true);
        if (selecOrg) addStyledRow(selecOrg, 14, true);
        if (selecBr) addStyledRow(selecBr, 14, true);

        const allData = headerRows.concat(headValues, data);
        const ws = XLSX.utils.aoa_to_sheet(allData);

        // Merge header cells
        const headerOffset = headerRows.length;
        const originalMerges = this.getMergePoints(head[0]) || [];
        const shiftedMerges = originalMerges.map(m => ({
            s: { r: m.s.r + headerOffset, c: m.s.c },
            e: { r: m.e.r + headerOffset, c: m.e.c }
        }));
        ws['!merges'] = [...mergeRows, ...shiftedMerges];

        // Style the actual table headers
        for (let row = 0; row < head.length; row++) {
            for (let col = 0; col < head[row].length; col++) {
                let bgColor: string = this.headerColors ? this.headerColors[head[row][col]?.id]?.bg : "e7e0f6";
                bgColor = (bgColor || "e7e0f6").replace("#", "");

                let textColor: string = this.headerColors ? this.headerColors[head[row][col]?.id]?.text : "000";
                textColor = (textColor || "000").replace("#", "");

                const cellRef = XLSX.utils.encode_cell({ r: row + headerOffset, c: col });
                ws[cellRef]['s'] = {
                    alignment: { horizontal: "center", vertical: "center" },
                    fill: { fgColor: { rgb: bgColor } },
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    },
                    font: {
                        bold: true,
                        color: { rgb: textColor }
                    }
                };
            }
        }

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, this.ExportName);
    }




    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    }

    checkEditFilter(column: any, rowData: any) {
        if (this.editableColumns[column] && this.editableColumns[column].type && this.editableColumns[column].type != 'Number') return false
        let filters = this.editableColumns.hasOwnProperty(column) ? this.editableColumns[column].filters : {}
        let fKeys = Object.keys(filters)
        for (let fi = 0; fi < fKeys.length; fi++) {
            const f = fKeys[fi];
            if (rowData[f] != filters[f]) return false
        }
        return true
    }
    checkBooleanEditFilter(column: any, rowData: any) {

        let filters = this.editableColumns.hasOwnProperty(column) ? this.editableColumns[column].filters : {}
        if (!filters) return true
        let fKeys = Object.keys(filters)
        for (let fi = 0; fi < fKeys.length; fi++) {
            const f = fKeys[fi];
            if (rowData[f] != filters[f]) {
                // console.log("checkBooleanEditFilter ", rowData[f],filters[f],rowData,filters,this.editableColumns,)
                return false
            }
        }
        return true
    }


    getTableDataColorClass(column: string, rowData: any) {
        if (!this.dataColors) return ""
        let filterRules = this.dataColors[column]
        let classes: string[] = []
        filterRules?.forEach((rule: any) => {
            let status = true
            rule.filter?.forEach((f: any) => {
                if (rowData[f.col] != f.value) status = false
            });
            if (status) classes.push(rule.styleClass)
        });
        // console.log(classes.join(" "));

        return classes.join(" ")
    }

    getTableCellColorClass(column: string, rowData: any) {
        if (!this.CellColors) return ""
        let filterRules = this.CellColors[column]
        let classes: string[] = []
        filterRules?.forEach((rule: any) => {
            let status = true
            rule.filter?.forEach((f: any) => {
                if (rowData[f.col] != f.value) status = false
            });
            if (status) classes.push(rule.styleClass)
        });
        // console.log(classes.join(" "));

        return classes.join(" ")
    }

    getToolTip(element: any, column: any) {
        if (this.Loading == false)
            if (element && element['tooltip']) {
                if (element.tooltip[column]) {
                    return element.tooltip[column].toString()
                }
            }
        return ''
    }

    setDisplayColumns() {
        this.showColumnSelection()
    }

}


import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';


@Component({
    selector: 'downloadReport',
    templateUrl: 'downloadReport.html',
    styleUrls: ['downloadReport.css'],
})
export class DownloadReport {

    selectedFileType: string;

    selectedColumns: any = []
    displayedColumns: any = []
    excludedColumns: any = ['SelectAll', "Actions"]
    headerColors: any = []
    dragDropHelp: boolean = false
    constructor(
        public dialogRef: MatDialogRef<DownloadReport>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private spinnerService: NgxSpinnerService,
        private globalToastService: ToastrService,
    ) {
        this.selectedFileType = "excel"

        // this.displayedColumns = data.displayedColumns.filter((dc:any)=>!this.excludedColumns.includes(dc))
        // this.selectedColumns = data.selectedColumns.filter((sc:any)=> sc.toString().toLowerCase() != "actions")
        this.selectedColumns = data.displayedColumns.filter((dc: any) => !this.excludedColumns.includes(dc))
        this.displayedColumns = data.originalDisplayedColumns.filter((sc: any) => sc.toString().toLowerCase() != "actions" && !this.displayedColumns.includes(sc.toString()))

        this.headerColors = data.headerColors || {}
        this.removeRepeatedItems()

    }
    ngOnInit(): void {



    }

    getHeaderBorderColor(title: string) {
        let borderColor: string = this.headerColors[title]?.text
        if (!borderColor) borderColor = "1px solid #c3b6de"
        else borderColor = '1px solid ' + borderColor
        return borderColor
    }

    getHeaderBgColor(title: string) {
        let bgColor: string = this.headerColors[title]?.bg
        if (!bgColor) bgColor = "#e7e0f6"
        return bgColor
    }

    getHeaderTextColor(title: string) {
        let textColor: string = this.headerColors[title]?.text
        if (!textColor) textColor = "#000000"
        return textColor
    }

    getColumnDiaplayName(name: any) {
        return this.data.displayColumns[name]
    }

    removeRepeatedItems() {
        this.displayedColumns = this.displayedColumns.filter((dc: any) => !this.selectedColumns.includes(dc))
    }


    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

    close(): void {
        const dialogData = { selectedColumns: this.selectedColumns, fileType: this.selectedFileType };
        this.dialogRef.close(dialogData);
    }

    showDragDropHelp() {
        this.dragDropHelp = true
    }

    hideDragDropHelp() {
        this.dragDropHelp = false
    }

    shift(type: string, index: any) {
        if (type == 'left') {
            let item = this.displayedColumns.splice(index, 1)
            this.selectedColumns.push(item)
        }
        if (type == 'right') {
            let item = this.selectedColumns.splice(index, 1)
            this.displayedColumns.push(item)
        }
        if (type == 'select-up') {
            let temp = this.selectedColumns[index]
            this.selectedColumns[index] = this.selectedColumns[index - 1]
            this.selectedColumns[index - 1] = temp
        }
        if (type == 'select-down') {
            let temp = this.selectedColumns[index]
            this.selectedColumns[index] = this.selectedColumns[index + 1]
            this.selectedColumns[index + 1] = temp
        }

    }
}
@Component({
    selector: 'app-columnSelection',
    templateUrl: 'columnSelection.html',
    styleUrls: ['downloadReport.css'],
})
export class ColumnSelection {

    // selectedFileType:string;

    selectedColumns: any = []
    displayedColumns: any = []
    originalDisplayedColumns: any = []
    excludedColumns: any = ['SelectAll']
    headerColors: any = []
    dragDropHelp: boolean = false
    constructor(
        public dialogRef: MatDialogRef<DownloadReport>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private spinnerService: NgxSpinnerService,
        private globalToastService: ToastrService,
    ) {
        // this.selectedFileType = "excel"
        // this.originalDisplayedColumns = data.originalDisplayedColumns.filter((dc:any)=>!this.excludedColumns.includes(dc))
        // this.displayedColumns = data.displayedColumns.filter((dc:any)=>!this.excludedColumns.includes(dc))
        // this.selectedColumns = data.originalDisplayedColumns.filter((sc:any)=> sc.toString().toLowerCase() != "actions" && this.displayedColumns.includes(sc.toString()))
        this.selectedColumns = data.displayedColumns.filter((dc: any) => !this.excludedColumns.includes(dc))
        this.displayedColumns = data.originalDisplayedColumns.filter((sc: any) => sc.toString().toLowerCase() != "actions" && !this.displayedColumns.includes(sc.toString()))
        this.headerColors = data.headerColors || {}
        this.removeRepeatedItems()

    }
    ngOnInit(): void {



    }

    getHeaderBorderColor(title: string) {
        let borderColor: string = this.headerColors[title]?.text
        if (!borderColor) borderColor = "1px solid #c3b6de"
        else borderColor = '1px solid ' + borderColor
        return borderColor
    }

    getHeaderBgColor(title: string) {
        let bgColor: string = this.headerColors[title]?.bg
        if (!bgColor) bgColor = "#e7e0f6"
        return bgColor
    }

    getHeaderTextColor(title: string) {
        let textColor: string = this.headerColors[title]?.text
        if (!textColor) textColor = "#000000"
        return textColor
    }

    getColumnDiaplayName(name: any) {
        return this.data.displayColumns[name]
    }

    removeRepeatedItems() {
        this.displayedColumns = this.displayedColumns.filter((dc: any) => !this.selectedColumns.includes(dc))
    }


    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

    close(): void {
        const dialogData = { selectedColumns: this.selectedColumns };
        this.dialogRef.close(dialogData);
    }

    showDragDropHelp() {
        this.dragDropHelp = true
    }

    hideDragDropHelp() {
        this.dragDropHelp = false
    }

    shift(type: string, index: any) {
        if (type == 'left') {
            let item = this.displayedColumns.splice(index, 1)
            this.selectedColumns.push(item)
        }
        if (type == 'right') {
            let item = this.selectedColumns.splice(index, 1)
            this.displayedColumns.push(item)
        }
        if (type == 'select-up') {
            let temp = this.selectedColumns[index]
            this.selectedColumns[index] = this.selectedColumns[index - 1]
            this.selectedColumns[index - 1] = temp
        }
        if (type == 'select-down') {
            let temp = this.selectedColumns[index]
            this.selectedColumns[index] = this.selectedColumns[index + 1]
            this.selectedColumns[index + 1] = temp
        }

    }
}

