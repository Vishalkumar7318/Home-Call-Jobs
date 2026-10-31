import type { AttendanceRecord } from '../types';

export function exportAttendanceToCSV(records: AttendanceRecord[], filenamePrefix = 'Attendance_Report'): void {
  if (!records || records.length === 0) {
    alert('No attendance records available to export.');
    return;
  }

  const headers = ['Date', 'Employee ID', 'Employee Name', 'Status', 'Salary Deduction', 'Marked By', 'Remarks', 'Last Updated'];

  const rows = records.map((r) => [
    `"${r.date}"`,
    `"${r.employeeId}"`,
    `"${r.employeeName || ''}"`,
    `"${r.status}"`,
    `"${r.status === 'Absent' ? '-Rs. 500' : 'Rs. 0'}"`,
    `"${r.markedBy || 'Admin'}"`,
    `"${(r.remarks || '').replace(/"/g, '""')}"`,
    `"${r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : ''}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `${filenamePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function printAttendanceReport(records: AttendanceRecord[], title: string, subtitle = ''): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up was blocked. Please allow pop-ups to print the attendance report.');
    return;
  }

  const rowsHtml = records
    .map(
      (r, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0; ${idx % 2 === 0 ? 'background-color: #f8fafc;' : ''}">
        <td style="padding: 10px 12px; font-weight: 500;">${r.date}</td>
        <td style="padding: 10px 12px; font-weight: 600; color: #1e3a8a;">${r.employeeId}</td>
        <td style="padding: 10px 12px;">${r.employeeName || '-'}</td>
        <td style="padding: 10px 12px;">
          <span style="
            display: inline-block;
            padding: 2px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            background-color: ${r.status === 'Present' ? '#dcfce7; color: #166534' : r.status === 'Absent' ? '#fee2e2; color: #991b1b' : '#fef3c7; color: #92400e'};
          ">
            ${r.status}
          </span>
        </td>
        <td style="padding: 10px 12px; font-weight: bold; color: ${r.status === 'Absent' ? '#dc2626' : '#16a34a'};">
          ${r.status === 'Absent' ? '-₹500' : '₹0'}
        </td>
        <td style="padding: 10px 12px; color: #475569;">${r.markedBy || 'System'}</td>
        <td style="padding: 10px 12px; color: #64748b;">${r.remarks || '-'}</td>
      </tr>
    `
    )
    .join('');

  const totalPresent = records.filter((r) => r.status === 'Present').length;
  const totalAbsent = records.filter((r) => r.status === 'Absent').length;
  const totalLeave = records.filter((r) => r.status === 'Leave').length;
  const totalDeductions = totalAbsent * 500;
  const totalRecords = records.length;
  const percentage = totalRecords > 0 ? ((totalPresent / totalRecords) * 100).toFixed(1) : '0';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Home Call Jobs - ${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 24px; color: #0f172a; }
          .header { border-bottom: 2px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
          .subtitle { color: #64748b; font-size: 14px; margin-top: 4px; }
          .policy-note { font-size: 12px; color: #b45309; background: #fffbeb; border: 1px solid #fde68a; padding: 8px 12px; border-radius: 6px; margin-top: 8px; font-weight: 500; }
          .brand { text-align: right; }
          .brand-name { font-size: 18px; font-weight: 800; color: #1e3a8a; letter-spacing: -0.5px; }
          .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
          .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
          .stat-value { font-size: 20px; font-weight: bold; color: #0f172a; }
          .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
          th { background: #0f172a; color: white; padding: 10px 12px; font-weight: 600; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${title}</h1>
            <div class="subtitle">${subtitle || `Generated on ${new Date().toLocaleString()}`}</div>
            <div class="policy-note">Policy: Shift 11:50 AM to 8:00 PM (All Days / No Holiday) • Absent Penalty: ₹500 deducted per absent shift.</div>
          </div>
          <div class="brand">
            <div class="brand-name">HOME CALL JOBS</div>
            <div style="font-size: 11px; color: #64748b;">Employee Attendance System</div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-value">${totalRecords}</div>
            <div class="stat-label">Total Logs</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color: #16a34a;">${totalPresent}</div>
            <div class="stat-label">Present</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color: #dc2626;">${totalAbsent}</div>
            <div class="stat-label">Absent</div>
          </div>
          <div class="stat-box">
            <div class="stat-value" style="color: #2563eb;">${percentage}%</div>
            <div class="stat-label">Rate</div>
          </div>
          <div class="stat-box" style="background: #fff1f2; border-color: #fecdd3;">
            <div class="stat-value" style="color: #be123c;">- ₹${totalDeductions}</div>
            <div class="stat-label" style="color: #9f1239;">Absent Deductions</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Status</th>
              <th>Salary Deduction</th>
              <th>Marked By</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Confidential - Internal Home Call Jobs Document</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
