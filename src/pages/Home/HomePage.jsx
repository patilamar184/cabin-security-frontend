import { useEffect, useMemo, useState } from 'react';
import { Check, FileClock, X } from 'lucide-react';
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
import { Fingerprint } from 'lucide-react';

/** Home = live access requests. The owner picks requests, then allows or denies them. */
export default function HomePage() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => accessRequestService.listAccessRequests(), []);
  const [selected, setSelected] = useState(new Set());
  const [duration, setDuration] = useState('');
  const [busy, setBusy] = useState('');
  const [page, setPage] = useState(1);

  // Check for new requests every few seconds.
  useEffect(() => {
    const t = setInterval(() => reload(true), POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [reload]);

  const requests = data || [];
  const rows = requests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pendingIds = useMemo(() => requests.filter((r) => r.status === 'pending').map((r) => r.id), [requests]);
  const allSelected = pendingIds.length > 0 && pendingIds.every((id) => selected.has(id));

  const toggle = (id) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const decide = async (decision) => {
    const ids = [...selected];
    if (ids.length === 0) return toast.show('Select at least one pending request first.', 'error');
    if (decision === 'allowed' && !duration) return toast.show('Choose how long access should last.', 'error');

    setBusy(decision);
    try {
      await accessRequestService.decideAccessRequests({
        ids,
        decision,
        durationMinutes: decision === 'allowed' ? Number(duration) : undefined,
      });
      toast.show(`${ids.length} request${ids.length > 1 ? 's' : ''} ${decision}.`);
      setSelected(new Set());
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
        subtitle="Manage and respond to visitor access requests."
        actions={
          <>
            <Button variant="success" icon={Check} onClick={() => decide('allowed')} loading={busy === 'allowed'} disabled={!!busy}>Allow</Button>
            <Button variant="danger" icon={X} onClick={() => decide('denied')} loading={busy === 'denied'} disabled={!!busy}>Deny</Button>
            <select className="select select-compact" aria-label="Access duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">Select Duration</option>
              {ACCESS_DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </>
        }
      />

      <div className="card">
        {loading && !data ? <Loading text="Loading requests..." /> : error ? <ErrorMessage message={error} onRetry={reload} /> : requests.length === 0 ? (
          <EmptyState><FileClock size={32} /><p>No access requests yet. New ones appear here automatically.</p></EmptyState>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 44 }}>
                      <input type="checkbox" aria-label="Select all pending requests" checked={allSelected}
                        onChange={() => setSelected(allSelected ? new Set() : new Set(pendingIds))} />
                    </th>
                    <th>ID</th><th>Visitor Name</th><th>Request Method</th><th>Status</th><th>Request Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <input type="checkbox" aria-label={`Select request ${r.id}`} checked={selected.has(r.id)}
                          disabled={r.status !== 'pending'} onChange={() => toggle(r.id)} />
                      </td>
                      <td>{r.id}</td>
                      <td><div className="cell-flex"><Avatar name={r.visitorName} />{r.visitorName}</div></td>
                      <td><div className="cell-flex"><Fingerprint size={20} className="muted" />{r.method}</div></td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>{formatDateUS(r.requestedAt)}, {formatTime12(r.requestedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE_SIZE} total={requests.length} onChange={setPage} noun="requests" />
          </>
        )}
      </div>
    </>
  );
}
