import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  generatePDF(header:string,title: string, columns: string[], data: any[]) {
    const doc = new jsPDF('landscape', 'mm', 'a3');
    // const imgData = 'assets/images/pngs/mwblogo.png';
    // doc.addImage(imgData, 'PNG', 20, 15, 25, 20);
  
    // // Add a title
    doc.setFontSize(20);
    doc.text(title,190, 20);
    // doc.setFontSize(13);
    // doc.text('EasyPagar Portal',20, 50);
    // doc.setFontSize(15);
    // doc.text('MWB Technologies Pvt Ltd India',50, 28);
    // doc.setFontSize(13);
    // doc.text('Name : '+title, 170, 50);
    // doc.setFontSize(13);
    // const currentDate = moment().format('DD-MM-YYYY');
    // doc.text(`Date: ${currentDate}`, 350, 50);

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20; // Assuming 20 units of margin on both sides
    const availableWidth = pageWidth - (margin * 2);
    const columnWidth = availableWidth / columns.length;

    const columnStyles:any = {};
    columns.forEach((_, index) => {
      columnStyles[index] = { halign: 'left', cellWidth: columnWidth };
    });
    autoTable(doc,{
      head: [columns],
      body: data,
      theme: 'grid',
      startY: 30,
      styles: {
        fontStyle: 'normal',
        fontSize:(8)
      },
      columnStyles: columnStyles,
    });
   doc.save(title +'.pdf');
}
}