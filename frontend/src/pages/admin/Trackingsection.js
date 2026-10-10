import React from 'react';
import { STATUS_STYLES, fmtDateTime } from '../../utils/api';

/* ─── Status Timeline (full history) ────────────────────────────────
   Only used inside TrackingSection, so it lives in this file rather
   than being exported separately.
──────────────────────────────────────────────────────────────────── */
const StatusTimeline = ({ history = [] }) => {
  const reversed = [...history].reverse();
  return (
    <div className="space-y-0">
      {reversed.map((h, i) => {
        const s = STATUS_STYLES[h.status] || STATUS_STYLES.pending;
        return (
          <div key={i} className="flex gap-3">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${i === 0 ? s.dot : 'bg-gray-200'}`} />
              {i < reversed.length - 1 && <div className="w-px flex-1 bg-gray-100 my-0.5 min-h-[16px]" />}
            </div>
            <div className={`pb-3 ${i === 0 ? '' : 'opacity-60'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold capitalize ${i === 0 ? 'text-gray-800' : 'text-gray-500'}`}>
                  {h.status}
                </span>
                <span className="text-[10px] text-gray-400">{fmtDateTime(h.timestamp)}</span>
              </div>
              {h.note && (
                <p className="text-[11px] text-gray-400 mt-0.5 italic">{h.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Tracking Section ──────────────────────────────────────────────
   Pure presentational component: shows the latest tracking update,
   plus a collapsible button that reveals the full status timeline.
   Holds no state of its own — open/closed state and the toggle
   handler are owned by the parent (OrderCard) and passed in as props.
──────────────────────────────────────────────────────────────────── */
const TrackingSection = ({ history = [], trackingNumber, isOpen, onToggle }) => {
  const latest = history.length > 0 ? [...history].slice(-1)[0] : null;
  const latestStyle = latest ? (STATUS_STYLES[latest.status] || STATUS_STYLES.pending) : STATUS_STYLES.pending;

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Latest Tracking</p>

        {trackingNumber && (
          <div className="flex items-center gap-2 mb-3 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
            <span className="text-indigo-500 text-sm">📦</span>
            <div>
              <p className="text-[10px] text-indigo-500 font-medium uppercase tracking-wider">Tracking ID</p>
              <p className="text-sm font-mono font-semibold text-indigo-800">{trackingNumber}</p>
            </div>
          </div>
        )}

        {latest ? (
          <div className="flex items-start gap-3">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${latestStyle.dot}`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 capitalize">{latest.status}</p>
              <p className="text-xs text-gray-400 mt-0.5">Updated {fmtDateTime(latest.timestamp)}</p>
              {latest.note && <p className="text-xs text-gray-400 mt-0.5 italic">{latest.note}</p>}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400">No tracking updates yet.</p>
        )}
      </div>

      {history.length > 0 && (
        <>
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-t border-gray-100 transition-colors"
          >
            {isOpen ? 'Hide Complete Tracking' : 'View Complete Tracking'}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isOpen && (
            <div className="px-4 pb-4 pt-3 border-t border-gray-100">
              <StatusTimeline history={history} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrackingSection;