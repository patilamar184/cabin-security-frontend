// import { useEffect, useMemo, useState } from 'react';
// import { Check, FileClock, X } from 'lucide-react';
// import { ACCESS_DURATIONS, PAGE_SIZE, POLL_INTERVAL_MS } from '../../config/constants';
// import { useAsync } from '../../hooks/useAsync';
// import { useToast } from '../../context/ToastContext';
// import * as accessRequestService from '../../services/accessRequestService';
// import { formatDateUS, formatTime12 } from '../../utils/format';
// import Avatar from '../../components/common/Avatar';
// import Button from '../../components/ui/Button';
// import PageHeader from '../../components/ui/PageHeader';
// import Pagination from '../../components/ui/Pagination';
// import { StatusBadge } from '../../components/ui/Badge';
// import { EmptyState, ErrorMessage, Loading } from '../../components/ui/Feedback';
// import { Fingerprint } from 'lucide-react';

// /** Home = live access requests. The owner picks requests, then allows or denies them. */
// export default function HomePage() {
//   const toast = useToast();
//   const { data, loading, error, reload } = useAsync(() => accessRequestService.listAccessRequests(), []);
//   const [selected, setSelected] = useState(new Set());
//   const [duration, setDuration] = useState('');
//   const [busy, setBusy] = useState('');
//   const [page, setPage] = useState(1);

//   // Check for new requests every few seconds.
//   useEffect(() => {
//     const t = setInterval(() => reload(true), POLL_INTERVAL_MS);
//     return () => clearInterval(t);
//   }, [reload]);

//   const requests = data || [];
//   const rows = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
//   const pendingIds = useMemo(() => requests.filter((r) => r.status === 'pending').map((r) => r.id), [requests]);
//   const allSelected = pendingIds.length > 0 && pendingIds.every((id) => selected.has(id));

//   const toggle = (id) =>
//     setSelected((s) => {
//       const next = new Set(s);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });

//   const decide = async (decision) => {
//     const ids = [...selected];
//     if (ids.length === 0) return toast.show('Select at least one pending request first.', 'error');
//     if (decision === 'allowed' && !duration) return toast.show('Choose how long access should last.', 'error');

//     setBusy(decision);
//     try {
//       await accessRequestService.decideAccessRequests({
//         ids,
//         decision,
//         durationMinutes: decision === 'allowed' ? Number(duration) : undefined,
//       });
//       toast.show(`${ids.length} request${ids.length > 1 ? 's' : ''} ${decision}.`);
//       setSelected(new Set());
//       await reload(true);
//     } catch (err) {
//       toast.show(err.message, 'error');
//     } finally {
//       setBusy('');
//     }
//   };

//   return (
//     <>
//       <PageHeader
//         title="Access Requests"
//         subtitle="Manage and respond to visitor access requests."
//         actions={
//           <>
//             <Button variant="success" icon={Check} onClick={() => decide('allowed')} loading={busy === 'allowed'} disabled={!!busy}>Allow</Button>
//             <Button variant="danger" icon={X} onClick={() => decide('denied')} loading={busy === 'denied'} disabled={!!busy}>Deny</Button>
//             <select className="select select-compact" aria-label="Access duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
//               <option value="">Select Duration</option>
//               {ACCESS_DURATIONS.map((d) => (
//                 <option key={d.value} value={d.value}>{d.label}</option>
//               ))}
//             </select>
//           </>
//         }
//       />

//       <div className="card">
//         {loading && !data ? <Loading text="Loading requests..." /> : error ? <ErrorMessage message={error} onRetry={reload} /> : requests.length === 0 ? (
//           <EmptyState><FileClock size={32} /><p>No access requests yet. New ones appear here automatically.</p></EmptyState>
//         ) : (
//           <>
//             <div className="table-wrap">
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th style={{ width: 44 }}>
//                       <input type="checkbox" aria-label="Select all pending requests" checked={allSelected}
//                         onChange={() => setSelected(allSelected ? new Set() : new Set(pendingIds))} />
//                     </th>
//                     <th>ID</th><th>Visitor Name</th><th>Request Method</th><th>Status</th><th>Request Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((r) => (
//                     <tr key={r.id}>
//                       <td>
//                         <input type="checkbox" aria-label={`Select request ${r.id}`} checked={selected.has(r.id)}
//                           disabled={r.status !== 'pending'} onChange={() => toggle(r.id)} />
//                       </td>
//                       <td>{r.id}</td>
//                       <td><div className="cell-flex"><Avatar name={r.visitorName} />{r.visitorName}</div></td>
//                       <td><div className="cell-flex"><Fingerprint size={20} className="muted" />{r.method}</div></td>
//                       <td><StatusBadge status={r.status} /></td>
//                       <td>{formatDateUS(r.requestedAt)}, {formatTime12(r.requestedAt)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <Pagination page={page} pageSize={PAGE_SIZE} total={requests.length} onChange={setPage} noun="requests" />
//           </>
//         )}
//       </div>
//     </>
//   );
// }










import { useEffect, useMemo, useState } from 'react';
import { Check, FileClock, X, Fingerprint } from 'lucide-react';
import { ACCESS_DURATIONS, PAGE_SIZE, POLL_INTERVAL_MS } from '../../config/constants';
import { useAsync } from '../../hooks/useAsync';
import { useToast } from '../../context/ToastContext';
import * as accessRequestService from '../../services/accessRequestService';
import { formatDateUS, formatTime12 } from '../../utils/format';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import { StatusBadge } from '../../components/ui/Badge';
import { EmptyState, ErrorMessage, Loading } from '../../components/ui/Feedback';

/**
 * Home = live fingerprint access requests.
 * Checkboxes select requests for Allow/Deny.
 * Clicking a visitor ID selects one request for the separate OLED delay action.
 */
export default function HomePage() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(
    () => accessRequestService.listAccessRequests(),
    []
  );

  const [selected, setSelected] = useState(new Set());
  const [delayTargetRequestId, setDelayTargetRequestId] = useState(null);
  const [durationValue, setDurationValue] = useState('');
  const [busy, setBusy] = useState('');
  const [page, setPage] = useState(1);

  // Refresh pending requests periodically so new fingerprint scans appear automatically.
  useEffect(() => {
    const timer = setInterval(() => reload(true), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reload]);

  const requests = data || [];
  const rows = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Actions must use the access-request ID, not the visitor ID shown in the table.
  const pendingRequestIds = useMemo(
    () => requests
      .filter((request) => request.status === 'pending')
      .map((request) => request.requestId),
    [requests]
  );

  const allSelected = pendingRequestIds.length > 0
    && pendingRequestIds.every((id) => selected.has(id));

  const delayTarget = requests.find(
    (request) => request.requestId === delayTargetRequestId
      && request.status === 'pending'
  );

  const toggle = (requestId) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(requestId)) next.delete(requestId);
      else next.add(requestId);
      return next;
    });
  };

  const decide = async (decision) => {
    const ids = [...selected].filter((id) => pendingRequestIds.includes(id));

    if (ids.length === 0) {
      toast.show('Select at least one pending request first.', 'error');
      return;
    }

    setBusy(decision);
    try {
      await accessRequestService.decideAccessRequests({ ids, decision });
      toast.show(
        `${ids.length} request${ids.length > 1 ? 's' : ''} ${decision}. Device command${ids.length > 1 ? 's' : ''} queued.`
      );

      setSelected(new Set());
      if (ids.includes(delayTargetRequestId)) {
        setDelayTargetRequestId(null);
        setDurationValue('');
      }

      await reload(true);
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setBusy('');
    }
  };

  const sendDelay = async (event) => {
    const durationMinutes = Number(event.target.value);
    setDurationValue('');

    if (!delayTarget) {
      toast.show('Click a pending visitor ID first.', 'error');
      return;
    }

    if (![5, 10, 30].includes(durationMinutes)) {
      toast.show('Choose 5, 10 or 30 minutes.', 'error');
      return;
    }

    const requestId = delayTarget.requestId;
    setBusy(`delay-${requestId}`);

    try {
      await accessRequestService.delayAccessRequest(requestId, durationMinutes);
      toast.show(
        `OLED message queued: come back after ${durationMinutes} minutes. Door remains locked.`
      );

      setDelayTargetRequestId(null);
      setSelected((current) => {
        const next = new Set(current);
        next.delete(requestId);
        return next;
      });

      await reload(true);
    } catch (err) {
      toast.show(err.message, 'error');
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <PageHeader
        title="Access Requests"
        subtitle="Review fingerprint requests and control cabin entry."
        actions={
          <>
            <Button
              variant="success"
              icon={Check}
              onClick={() => decide('allowed')}
              loading={busy === 'allowed'}
              disabled={!!busy || selected.size === 0}
            >
              Allow
            </Button>
            <Button
              variant="danger"
              icon={X}
              onClick={() => decide('denied')}
              loading={busy === 'denied'}
              disabled={!!busy || selected.size === 0}
            >
              Deny
            </Button>
            <select
              className="select select-compact"
              aria-label="Select OLED delay duration"
              value={durationValue}
              onChange={sendDelay}
              disabled={!!busy || !delayTarget}
              title={delayTarget
                ? `Send delay message for visitor #${delayTarget.id}`
                : 'Click a pending visitor ID first'}
            >
              <option value="">
                {delayTarget ? `Delay visitor #${delayTarget.id}` : 'Select Duration'}
              </option>
              {ACCESS_DURATIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        }
      />

      <div className="card">
        {loading && !data ? (
          <Loading text="Loading requests..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={reload} />
        ) : requests.length === 0 ? (
          <EmptyState>
            <FileClock size={32} />
            <p>No fingerprint requests yet. New ones appear here automatically.</p>
          </EmptyState>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 44 }}>
                      <input
                        type="checkbox"
                        aria-label="Select all pending requests"
                        checked={allSelected}
                        onChange={() => setSelected(
                          allSelected ? new Set() : new Set(pendingRequestIds)
                        )}
                      />
                    </th>
                    <th>ID</th>
                    <th>Visitor Name</th>
                    <th>Request Method</th>
                    <th>Status</th>
                    <th>Request Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((request) => (
                    <tr key={request.requestId}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select visitor ${request.id}`}
                          checked={selected.has(request.requestId)}
                          disabled={request.status !== 'pending' || !!busy}
                          onChange={() => toggle(request.requestId)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setDelayTargetRequestId(
                              request.status === 'pending'
                                ? request.requestId
                                : null
                            );
                            setDurationValue('');
                          }}
                          disabled={request.status !== 'pending' || !!busy}
                          aria-label={`Choose delay duration for visitor ${request.id}`}
                          style={{
                            border: 0,
                            background: 'transparent',
                            color: request.requestId === delayTargetRequestId
                              ? 'var(--primary)'
                              : 'inherit',
                            font: 'inherit',
                            fontWeight: 700,
                            textDecoration: request.requestId === delayTargetRequestId
                              ? 'underline'
                              : 'none',
                            cursor: request.status === 'pending' ? 'pointer' : 'default',
                            padding: 0,
                          }}
                        >
                          {request.id}
                        </button>
                      </td>
                      <td>
                        <div className="cell-flex">
                          <Avatar name={request.visitorName} />
                          {request.visitorName}
                        </div>
                      </td>
                      <td>
                        <div className="cell-flex">
                          <Fingerprint size={20} className="muted" />
                          {request.method}
                        </div>
                      </td>
                      <td><StatusBadge status={request.status} /></td>
                      <td>
                        {formatDateUS(request.requestedAt)}, {formatTime12(request.requestedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={requests.length}
              onChange={setPage}
              noun="requests"
            />
          </>
        )}
      </div>
    </>
  );
}
