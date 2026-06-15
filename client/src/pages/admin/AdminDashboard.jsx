import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Clock, XCircle, Eye, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/volunteer/StatusBadge';
import Loader from '../../components/common/Loader';
import adminService from '../../services/adminService';
import { formatShortDate, getMonthName } from '../../utils/formatters';

const CHART_COLORS = ['#10b981', '#f59e0b', '#f43f5e'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        if (res.success) setStats(res.data);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData = stats ? [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
    { name: 'Rejected', value: stats.rejected },
  ] : [];

  const barData = (stats?.monthlyRegistrations || []).map((m) => ({
    name: `${getMonthName(m._id.month)} ${m._id.year}`,
    count: m.count,
  }));

  const skillsData = (stats?.topSkills || []).slice(0, 6).map((s) => ({
    name: s._id,
    count: s.count,
  }));

  return (
    <AdminLayout title="Dashboard" subtitle="Overview of volunteer registrations">
      {loading ? (
        <Loader size="lg" text="Loading dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            <StatCard icon={Users} label="Total Volunteers" value={stats?.total || 0} color="primary" />
            <StatCard icon={CheckCircle} label="Approved" value={stats?.approved || 0} color="success" />
            <StatCard icon={Clock} label="Pending" value={stats?.pending || 0} color="warning" />
            <StatCard icon={XCircle} label="Rejected" value={stats?.rejected || 0} color="error" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="card-elevated p-4 sm:p-6 border border-white/5">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-4 font-mono text-xs tracking-widest uppercase">Status Distribution</h3>
              {stats?.total > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={CHART_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-text-secondary text-sm">No data yet</div>
              )}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2">
                {pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                    <span className="text-text-secondary">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-4 sm:p-6 lg:col-span-1 border border-white/5">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-4 font-mono text-xs tracking-widest uppercase">Monthly Registrations</h3>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} width={30} />
                    <Tooltip contentStyle={{ background: '#141c32', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', color: '#e2e8f0' }} />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-text-secondary text-sm">No data yet</div>
              )}
            </div>

            <div className="card-elevated p-4 sm:p-6 border border-white/5">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-4 font-mono text-xs tracking-widest uppercase">Top Skills</h3>
              {skillsData.length > 0 ? (
                <div className="space-y-3">
                  {skillsData.map((skill) => {
                    const max = skillsData[0]?.count || 1;
                    const pct = (skill.count / max) * 100;
                    return (
                      <div key={skill.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400 font-medium truncate mr-2">{skill.name}</span>
                          <span className="text-white font-bold font-mono">{skill.count}</span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-text-secondary text-sm">No data yet</div>
              )}
            </div>
          </div>

          <div className="card-elevated overflow-hidden border border-white/5">
            <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="font-mono tracking-wider text-xs uppercase">Recent Registrations</span>
              </h3>
              <Link to="/admin/volunteers" className="text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors tracking-widest">
                VIEW ALL →
              </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block table-responsive">
              <table className="w-full min-w-[640px]">
                <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <tr>
                    {['Name', 'College', 'City', 'Status', 'Date', 'Action'].map((h) => (
                      <th key={h} className="px-4 lg:px-6 py-3 text-left text-[10px] font-mono text-slate-500 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {(stats?.recentVolunteers || []).map((v) => (
                    <tr key={v._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 lg:px-6 py-4 text-sm font-medium text-slate-200">{v.fullName}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-slate-400">{v.college}</td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-slate-400">{v.city}</td>
                      <td className="px-4 lg:px-6 py-4"><StatusBadge status={v.status} /></td>
                      <td className="px-4 lg:px-6 py-4 text-xs text-slate-500 font-mono">{formatShortDate(v.registeredAt)}</td>
                      <td className="px-4 lg:px-6 py-4">
                        <Link to={`/admin/volunteers/${v._id}`} className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> VIEW
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {(!stats?.recentVolunteers || stats.recentVolunteers.length === 0) && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm font-mono">
                        No volunteers registered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {(stats?.recentVolunteers || []).map((v) => (
                <div key={v._id} className="p-4 hover:bg-surface-alt/50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{v.fullName}</p>
                      <p className="text-xs text-text-secondary truncate">{v.college}</p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">{v.city} · {formatShortDate(v.registeredAt)}</span>
                    <Link to={`/admin/volunteers/${v._id}`} className="text-sm text-primary font-medium">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
              {(!stats?.recentVolunteers || stats.recentVolunteers.length === 0) && (
                <div className="p-8 text-center text-text-secondary text-sm">No volunteers registered yet.</div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
