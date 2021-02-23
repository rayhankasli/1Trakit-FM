import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
// ------------------------------------------------ //
import { ReportType } from '../../model/chart-data.model';

/** Generate PDf Service */
@Injectable()
export class GeneratePdfService {

  constructor(
    private datePipe: DatePipe
  ) { }

  /** Export PDF For copyIt Report */
  public exportAsPDF(
    tableHeaderText: string, pdfName: string, columnChartImage: any,
    jsPDFData: any, clientName: string, reportType: any, pieChartImage?: any, isYTDComparison?: boolean
  ): void {

    let tableHeader: any[][] = [jsPDFData.tableHeader];
    let tableValue: any[][] = jsPDFData.tableValue;

    let doc: jsPDF = new jsPDF('l', 'mm', 'a4');

    /**  Image for TrakIt logo : */
    let logoImg: HTMLImageElement = new Image();
    logoImg.src = 'assets/img/1TRAKIT.png';
    doc.addImage(logoImg, 'png', 15, 10, 45, 9, '', 'FAST', 0);

    /**  Few necessary setting options */
    doc.setDrawColor('#E6E7EB');
    doc.line(14, 21, 282, 21);
    doc.setFontSize(12);

    /** Add Header Text */
    if (tableHeaderText) {
      doc.text(tableHeaderText, 14, 29, 'left');
    }
    /** Add Client Name */
    if (clientName) {
      doc.text(clientName, 282, 29, { align: 'right' });
    }

    if (ReportType.copyIt === reportType) {
      this.exportAsCopyItPDF(doc, columnChartImage, tableHeader, tableValue, pdfName, logoImg, pieChartImage, reportType, isYTDComparison);
    } else if (ReportType.bookIt === reportType) {
      this.exportAsBookItPDF(doc, columnChartImage, tableHeader, tableValue, pdfName, reportType);
    }
  }

  /** Export PDF For copyIt Report */
  private exportAsCopyItPDF(
    doc: jsPDF, columnChartImage: any, tableHeader: any[], tableValue: any[],
    pdfName: string, logoImg: any, pieChartImage: any, reportType: string, isYTDComparison?: boolean
  ): void {

    if (columnChartImage) {
      /**  Few necessary setting options */
      let imgWidth: number = 180;
      let imgHeight: number = 100;
      /** Adds Image in PDF for Chart */
      doc.rect(92, 34, 190, 147);
      doc.addImage(columnChartImage.getImageURI(), 'PNG', 96, 50, imgWidth, imgHeight, '', 'FAST', 0);
    }

    this.drawTableAndCell(doc, tableHeader, tableValue, reportType);

    /** 
     * Image for Pie chart only for total copy Volume 
     * If isYTDComparison true so create the pie chart
     */
    if (isYTDComparison) {
      this.drawPieChart(doc, logoImg, pieChartImage);
    }

    /** this gives you the value of the end-y-axis-position of the previous autotable. */
    doc.save(pdfName);
  }


  /**  For generate BookIt PDF */
  private exportAsBookItPDF(
    doc: jsPDF, columnChartImage: any, tableHeader: any[],
    tableValue: any[], pdfName: string, reportType: string
  ): void {

    if (columnChartImage) {
      /**  Few necessary setting options */
      let imgWidth: number = 180;
      let imgHeight: number = 100;
      /** Adds Image in PDF for Chart */
      doc.rect(102, 34, 182, 147);
      doc.addImage(columnChartImage.getImageURI(), 'PNG', 104, 50, imgWidth, imgHeight, '', 'FAST', 0);
    }

    this.drawTableAndCell(doc, tableHeader, tableValue, reportType);

    //this gives you the value of the end-y-axis-position of the previous autotable.
    doc.save(pdfName);
  }

  /** Draw Table and Cell for PDF */
  private drawTableAndCell(doc: jsPDF, tableHeader: any[], tableValue: any[], reportType?: string): void {

    let date: string = this.datePipe.transform(new Date(), 'MMM');

    /** Set table with Styles */
    (doc as any).autoTable({

      head: tableHeader,
      body: tableValue,
      theme: 'grid',
      tableWidth: reportType === ReportType.copyIt ? 75 : 85,

      styles: { halign: 'center' },

      /** Set Head Styles as per report type */
      headStyles: {
        fillColor: '#E6E7EB',
        textColor: '#444851',
        cellPadding: reportType === ReportType.copyIt ? 3 : 2,
        minCellHeight: reportType === ReportType.bookIt ? 12 : null,
        valign: 'middle',
        fontSize: 9
      },

      /** Set Body Styles as per report type */
      bodyStyles: {
        cellPadding: reportType === ReportType.copyIt ? 2 : 3,
        fontSize: 9,
      },

      /** Set Column Styles as per report type */
      columnStyles: reportType === ReportType.copyIt ? {
        0: { cellWidth: 20, fontStyle: 'bold' },
        1: { cellWidth: 'wrap' },
        2: { cellWidth: 'wrap' },
        3: { cellWidth: 'wrap' },
        autoSize: true,
      } : {
          1: { cellWidth: 'wrap' },
          2: { cellWidth: 'wrap' },
          3: { cellWidth: 'wrap' },
          autoSize: true,
        },

      /** For style row as per condition */
      // tslint:disable-next-line: object-literal-shorthand
      willDrawCell: function (data) {

        let rows: any = data.table.body;
        doc.setTextColor('#444851');

        if (date === data.row.raw[0]) {
          doc.setFillColor('#DA2028');
          doc.setTextColor('#ffffff');
        }

        if (data.row.index === rows.length - 1) {
          doc.setFillColor('#737988');
          doc.setTextColor('#ffffff');
        }

        if (data.row.index === rows.length - 2) {
          doc.setFillColor('#d2d4dc');
        }

        if (reportType === ReportType.copyIt) {
          if (data.row.index === 3 || data.row.index === 7 || data.row.index === 11 || data.row.index === 15) {
            doc.setFillColor('#f0f2f9');
          }
        }
      },

      /** Table start position from top */
      startY: 34
    });
  }

  /** Draw Pie Chart PDF */
  private drawPieChart(doc: jsPDF, logoImg: any, pieChartImage: any): void {

    doc.insertPage();

    doc.addImage(logoImg, 'png', 15, 10, 45, 9, '', 'FAST', 0);
    doc.line(14, 21, 282, 21);

    let currentYear: number = new Date().getFullYear();

    /**  Few necessary setting options */
    let imgWidth: number = 100;
    let imgHeight: number = 45;

    doc.rect(14, 25, 268, 60);

    doc.setFontSize(10);
    /** Add Title for only Pie chart in total copy Volume */
    doc.text(`YTD B/W & COLOR & SCAN COMPARISON ${currentYear}`, 145, 33, { align: 'center' });

    if (pieChartImage) {
      doc.addImage(pieChartImage.getImageURI(), 'PNG', 105, 38, imgWidth, imgHeight, '', 'FAST', 0);
    } else {
      doc.text('No Data', 145, 61);
    }
  }
}