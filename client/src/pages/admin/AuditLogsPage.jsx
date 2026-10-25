import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Activity, Shield, RefreshCw, Terminal, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs({
        action: actionFilter !== 'all' ? actionFilter : undefined,
        limit: 50,
      });
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk']">
            System Audit Trail & Security Logs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log of all user authentications, job status alterations, and recruitment pipeline events
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Trail
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} height="h-20" />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No audit entries recorded"
          description="System actions will be automatically recorded here."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Audit Details</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-cyan-400">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans">
                      {log.user ? (
                        <div>
                          <span className="font-semibold">{log.user.name}</span>
                          <span className="text-[10px] text-slate-500 ml-1.5">
                            ({log.user.role})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">System Automation</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-300 font-sans font-medium">
                      {log.resource}
                      {log.resourceId && (
                        <span className="text-[10px] text-slate-500 block font-mono">
                          id: {log.resourceId.substring(0, 10)}...
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px] max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500 font-sans text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
