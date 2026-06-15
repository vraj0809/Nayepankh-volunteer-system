import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from './api';

export const exportService = {
  // Fetch data from server and generate PDF client-side
  exportPDF: async (statusFilter = 'all') => {
    const response = await api.get('/reports/pdf', { params: { status: statusFilter } });
    const { volunteers, stats, generatedAt } = response.data.data;

    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(26, 60, 110);
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('NayePankh Foundation', 14, 12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Volunteer Registration Report', 14, 19);
    doc.text(`Generated: ${new Date(generatedAt).toLocaleDateString('en-IN')}`, 14, 25);

    // Stats summary
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', 14, 38);

    autoTable(doc, {
      startY: 42,
      head: [['Total', 'Approved', 'Pending', 'Rejected']],
      body: [[stats.total, stats.approved, stats.pending, stats.rejected]],
      theme: 'grid',
      headStyles: { fillColor: [26, 60, 110], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 4, font: 'helvetica' },
      margin: { left: 14, right: 14 },
    });

    // Volunteers table
    const tableData = volunteers.map((v, i) => [
      i + 1,
      v.fullName,
      v.email,
      v.phone,
      v.city,
      v.college,
      (v.skills || []).slice(0, 3).join(', '),
      v.status.charAt(0).toUpperCase() + v.status.slice(1),
      new Date(v.registeredAt).toLocaleDateString('en-IN'),
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['#', 'Name', 'Email', 'Phone', 'City', 'College', 'Skills', 'Status', 'Date']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [26, 60, 110], textColor: 255, fontSize: 8 },
      styles: { fontSize: 7, cellPadding: 2, font: 'helvetica' },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 28 },
        2: { cellWidth: 40 },
        3: { cellWidth: 22 },
        4: { cellWidth: 22 },
        5: { cellWidth: 35 },
        6: { cellWidth: 40 },
        7: { cellWidth: 18 },
        8: { cellWidth: 22 },
      },
      margin: { left: 14, right: 14 },
      didParseCell: (data) => {
        if (data.column.index === 7 && data.section === 'body') {
          const status = data.cell.text[0]?.toLowerCase();
          if (status === 'approved') data.cell.styles.textColor = [22, 101, 52];
          if (status === 'pending') data.cell.styles.textColor = [146, 64, 14];
          if (status === 'rejected') data.cell.styles.textColor = [153, 27, 27];
        }
      },
    });

    // Footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Page ${i} of ${pageCount} | NayePankh Foundation — Giving Wings to Dreams`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }

    doc.save('nayepankh_volunteers_report.pdf');
  },

  // Download CSV from server
  exportCSV: async (statusFilter = 'all') => {
    const response = await api.get('/reports/csv', {
      params: { status: statusFilter },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nayepankh_volunteers.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Get detailed stats for reports page
  getDetailedStats: async () => {
    const response = await api.get('/reports/stats');
    return response.data;
  },
};

export default exportService;
