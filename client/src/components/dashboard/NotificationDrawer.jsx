import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { X, CheckCheck, Bell, ExternalLink, Calendar, Briefcase, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDrawer = () => {
  const { notifications, unreadCount, isDrawerOpen, closeDrawer, markAsRead, markAllAsRead } =
    useNotifications();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markAsRead(notif._id);
    }
    if (notif.link) {
      closeDrawer();
      navigate(notif.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'interview_scheduled':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'application_status':
        return <Briefcase className="w-4 h-4 text-indigo-400" />;
      default:
        return <Info className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel-elevated border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100">Notifications</h2>
                <p className="text-xs text-slate-400">
                  {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-xs text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeDrawer}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Bell className="w-10 h-10 text-slate-600 mb-2 stroke-1" />
                <p className="text-sm text-slate-400">No notifications yet</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Updates on application statuses and interviews will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.isRead
                      ? 'bg-slate-900/30 border-slate-800/60 opacity-75 hover:opacity-100'
                      : 'bg-indigo-950/20 border-indigo-500/30 shadow-lg shadow-indigo-950/20 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-200 truncate">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40">
                        <span className="text-[10px] text-slate-500">
                          {new Date(notif.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {notif.link && (
                          <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-medium">
                            View details <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
