import { Injectable } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
// ----------------------------------------------- //
import { PdfDataType, TableRow } from './report-fleet.model';

@Injectable()
export class FleetGeneratePdfService {

    /** Download PDF */
    public fleetExportAsPDF(tableHeaderText: string, pdfName: string, jsPDFData: PdfDataType, clientName: string): void {
        let tableValue: TableRow[] = jsPDFData.tableValue;

        let doc: jsPDF = new jsPDF('p', 'mm', 'a4');

        // Set header
        let img: HTMLImageElement = new Image();
        img.src = 'assets/img/1TRAKIT.png';
        doc.addImage(img, 'png', 15, 10, 45, 9, '', 'FAST', 0);

        doc.setDrawColor('#E6E7EB');
        doc.line(14, 21, 196, 21); // For add lines

        doc.text(tableHeaderText, 14, 29); // Add Title
        doc.setFontSize(12);

        doc.text(clientName, 196, 29, { align: 'right' }); // Add Title

        let raw: TableRow[] = tableValue;
        let body = [];

        for (let i = 0; i < raw.length; i++) {
            let row = []
            for (var key in raw[i]) {
                row.push(raw[i][key])
            }
            if (raw[i]['month'] === '') {
                row.unshift({
                    colSpan: 6,
                    content: 'No record found',
                    styles: { valign: 'middle', halign: 'center', textColor: '#f0f1f5' },
                })
            }
            body.push(row)
        }

        doc.autoTable({
            head: [
                jsPDFData.tableHeader
            ],
            body: body,
            startY: 34, // Table start position from top
            margin: { top: 15 },
            theme: 'grid',

            bodyStyles: {
                cellPadding: 2,
                fontSize: 8,
                valign: 'middle',
                halign: 'center',
            },

            headStyles: {
                fontSize: 9,
                fontStyle: 'bold',
                valign: 'middle',
                halign: 'center',
                cellPadding: 2
            },

            columnStyles: {
                // autoSize: true,
                0: { cellWidth: 30 },
                1: { cellWidth: 37 },
                2: { cellWidth: 28 },
                3: { cellWidth: 30 },
                4: { cellWidth: 22 },
                5: { cellWidth: 'auto' },
            },

            willDrawCell: function (data) {
                doc.setTextColor('#444851');
                let rows = data.table.body;
                if (data.row.raw[0] === 'MANUFACTURER') {
                    doc.setFillColor('#E6E7EB');
                    doc.setFontStyle('bold');
                }
                if (data.row.raw[0] === 'MONTHS') {
                    doc.setFillColor('#d8d9e0');
                }

                if (data.row.index === rows.length - 1) {
                    doc.setFillColor('#c4c6d1');
                    doc.setFontSize(9);
                    doc.setFontStyle('bold');
                }

                if (data.row.raw[0] === 'January' || data.row.raw[0] === 'February'
                    || data.row.raw[0] === 'March' || data.row.raw[0] === 'April'
                    || data.row.raw[0] === 'May' || data.row.raw[0] === 'June' || data.row.raw[0] === 'July' || data.row.raw[0] === 'August' || data.row.raw[0] === 'September' || data.row.raw[0] === 'October' || data.row.raw[0] === 'November' || data.row.raw[0] === 'December') {
                    doc.setFillColor('#f4f5f6');
                    doc.setFontSize(9);
                }

            },
        })
        //this gives you the value of the end-y-axis-position of the previous autotable.
        doc.save(pdfName);
    }
}