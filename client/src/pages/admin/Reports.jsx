import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileText, Download, FileSpreadsheet, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import ExportButton from '../../components/admin/ExportButton';
import Loader from '../../components/common/Loader';
import exportService from '../../services/exportService';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await exportService.getDetailedStats();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = async (type, status = 'all') => {
    const key = `${type}-${status}`;
    setExporting(key);
    try {
      if (type === 'pdf') {
        await exportService.exportPDF(status);
        toast.success('PDF report downloaded!');
      } else {
        await exportService.exportCSV(status);
        toast.success('CSV file downloaded!');
      }
    } catch (err) {
      toast.error(`Export failed: ${err.message}`);
    } finally {
      setExporting('');
    }
  };

  return (
    <AdminLayout title="Reports & Export" subtitle="Generate and download volunteer reports">
      {loading ? (
        <Loader text="Loading report data..." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: 'Total Volunteers', value: stats?.summary?.total || 0, icon: Users, color: 'bg-primary/10 text-primary' },
              { label: 'Approved', value: stats?.summary?.approved || 0, icon: CheckCircle, color: 'bg-success/10 text-success' },
              { label: 'Pending', value: stats?.summary?.pending || 0, icon: Clock, color: 'bg-warning/10 text-warning' },
              { label: 'Rejected', value: stats?.summary?.rejected || 0, icon: XCircle, color: 'bg-error/10 text-error' },
            ].map((item) => (
              <div key={item.label} className="card-elevated p-4 sm:p-5">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-text-primary">{item.value}</p>
                <p className="text-xs text-text-secondary mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="card-elevated p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">PDF Reports</h3>
                  <p className="text-xs text-text-secondary">Generate formatted PDF documents</p>
                </div>
              </div>
              <div className="space-y-3">
                <ExportButton onClick={() => handleExport('pdf', 'all')} loading={exporting === 'pdf-all'} icon={Download} variant="primary" className="w-full justify-center">
                  Export All Volunteers (PDF)
                </ExportButton>
                <ExportButton onClick={() => handleExport('pdf', 'approved')} loading={exporting === 'pdf-approved'} icon={Download} variant="outline" className="w-full justify-center">
                  Export Approved Only (PDF)
                </ExportButton>
              </div>
            </div>

            <div className="card-elevated p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">CSV Exports</h3>
                  <p className="text-xs text-text-secondary">Download spreadsheet-ready data</p>
                </div>
              </div>
              <div className="space-y-3">
                <ExportButton onClick={() => handleExport('csv', 'all')} loading={exporting === 'csv-all'} icon={Download} variant="success" className="w-full justify-center">
                  Export All Volunteers (CSV)
                </ExportButton>
                <ExportButton onClick={() => handleExport('csv', 'approved')} loading={exporting === 'csv-approved'} icon={Download} variant="outline" className="w-full justify-center">
                  Export Approved Only (CSV)
                </ExportButton>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="card-elevated p-4 sm:p-6">
              <h3 className="font-semibold text-text-primary mb-4">Skills Distribution</h3>
              <div className="space-y-3">
                {(stats?.skillsDistribution || []).slice(0, 8).map((s) => {
                  const max = stats.skillsDistribution[0]?.count || 1;
                  return (
                    <div key={s._id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary truncate mr-2">{s._id}</span>
                        <span className="font-bold text-text-primary">{s.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full gradient-primary" style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-elevated p-4 sm:p-6">
              <h3 className="font-semibold text-text-primary mb-4">Top Cities</h3>
              <div className="space-y-2">
                {(stats?.cityDistribution || []).slice(0, 8).map((c, i) => (
                  <div key={c._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-alt transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                      <span className="text-sm text-text-primary truncate">{c._id}</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary flex-shrink-0 ml-2">{c.count}</span>
                  </div>
                ))}
                {(!stats?.cityDistribution || stats.cityDistribution.length === 0) && (
                  <p className="text-text-secondary text-sm text-center py-4">No data</p>
                )}
              </div>
            </div>

            <div className="card-elevated p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <h3 className="font-semibold text-text-primary mb-4">Year of Study</h3>
              <div className="space-y-2 mb-6">
                {(stats?.yearDistribution || []).map((y) => (
                  <div key={y._id} className="flex items-center justify-between p-2 rounded-lg bg-surface-alt">
                    <span className="text-sm text-text-primary">{y._id}</span>
                    <span className="text-sm font-bold text-text-primary">{y.count}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-text-primary mb-4">Available Hours</h3>
              <div className="space-y-2">
                {(stats?.hoursDistribution || []).map((h) => (
                  <div key={h._id} className="flex items-center justify-between p-2 rounded-lg bg-surface-alt">
                    <span className="text-sm text-text-primary">{h._id}</span>
                    <span className="text-sm font-bold text-text-primary">{h.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Reports;
