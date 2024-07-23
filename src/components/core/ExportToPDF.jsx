import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportToPDF = ({ htmlContent }) => {
    const exportToPdf = () => {
        const input = document.getElementById('pdf-content');

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const margin = 10; // Margin in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const pageContentHeight = pageHeight - 20; // Space for header and footer
            let heightLeft = imgHeight;
            let position = 10; // Starting position

            const addHeader = (pdf, pageNumber) => {
                pdf.setFontSize(12);
                pdf.text('Your Company Header', 10, 10);
            };

            const addFooter = (pdf, pageNumber) => {
                pdf.setFontSize(10);
                pdf.text(`Page ${pageNumber}`, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 10, { align: 'center' });
            };

            let pageNumber = 1;
            addHeader(pdf, pageNumber);
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pageContentHeight);
            addFooter(pdf, pageNumber);
            heightLeft -= pageContentHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pageNumber++;
                addHeader(pdf, pageNumber);
                pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, pageContentHeight);
                addFooter(pdf, pageNumber);
                heightLeft -= pageContentHeight;
            }

            pdf.save('download.pdf');
        });
    };

    useEffect(() => {
        exportToPdf(htmlContent);
    }, [htmlContent]);

    return (
        <div>
            <div id="pdf-content" dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ display: 'none' }} />
        </div>
    );
};

export default ExportToPDF;
