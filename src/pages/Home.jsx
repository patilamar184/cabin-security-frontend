import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeading from '../components/PageHeading';
import Panel from '../components/Panel';
import Notice from '../components/Notice';
import Badge from '../components/Badge';
import EmptyRow from '../components/EmptyRow';
import { useRequests } from '../context/RequestsContext';
import { deviceApi, logApi, requestApi, visitorApi } from '../api';
import { formatDateTime, secondsLeft, titleCase } from '../utils/format';

function DoorRequest({ request, visitor, onDone }) {
  const [left, setLeft] = useState(secondsLeft(request.expires_at));
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setLeft(secondsLeft(request.expires_at)), 1000);
    return () => clearInterval(timer);
  }, [request.expires_at]);

  async function respond(kind) {
    setBusy(kind);
    setError('');
    try {
      if (kind === 'allow') await requestApi.allow(request.id, 5);
      else await requestApi.deny(request.id);
      onDone(kind === 'allow' ? 'Access approved. The backend has queued a door command for the ESP32.' : 'Entry was refused.');
    } catch (err) {
      setError(err.message);
      onDone('');
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="door-request">
      <div>
        <div className="who">{visitor ? visitor.name : `Visitor ${request.visitor_id || ''}`}</div>
        <div className="meta">
          {visitor ? `${visitor.role}, ${visitor.department}. ` : ''}
          Used {request.authentication_method === 'pin' ? 'PIN' : 'fingerprint'} at {formatDateTime(request.created_at)}.
          {' '}{left > 0 ? `Expires in ${left} seconds.` : 'Expired.'}
        </div>
        {error && <div style={{ color: 'var(--bad)', marginTop: 4 }}>{error}</div>}
      </div>
      <div className="buttons">
        <button type="button" className="btn btn-good" disabled={!!busy || left === 0} onClick={() => respond('allow')}>
          {busy === 'allow' ? 'Approving...' : 'Allow entry'}
        </button>
        <button type="button" className="btn btn-danger" disabled={!!busy || left === 0} onClick={() => respond('deny')}>
          {busy === 'deny' ? 'Refusing...' : 'Refuse entry'}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { requests, visitors, refresh } = useRequests();
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState({ visitors: null, device: undefined, recent: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    let live = true;
    (async () => {
      const [visitorResult, deviceResult, logResult] = await Promise.allSettled([
        visitorApi.list(), deviceApi.mine(), logApi.list(),
      ]);
      if (!live) return;
      setSummary({
        visitors: visitorResult.status === 'fulfilled' ? visitorResult.value.length : null,
        device: deviceResult.status === 'fulfilled' ? deviceResult.value : null,
        recent: logResult.status === 'fulfilled' ? logResult.value.slice(0, 5) : [],
      });
      const failed = [visitorResult, deviceResult, logResult].find((item) => item.status === 'rejected');
      if (failed) setError(failed.reason?.message || 'Some dashboard information could not be loaded.');
    })();
    return () => { live = false; };
  }, []);

  function done(text) {
    if (text) setMessage(text);
    refresh();
  }

  const { device } = summary;

  return (
    <>
      <PageHeading title="Home">
        Respond to people waiting at your door and see what has happened recently.
      </PageHeading>
      <Notice kind="error">{error}</Notice>
      <Notice kind="success">{message}</Notice>

      <Panel title="Waiting at your door">
        {requests.length === 0 ? (
          <p className="muted">Nobody is waiting. New requests appear here automatically while this page is open.</p>
        ) : (
          requests.map((item) => (
            <DoorRequest key={item.id} request={item} visitor={visitors[item.visitor_id]} onDone={done} />
          ))
        )}
      </Panel>

      <Panel title="At a glance">
        <dl className="facts">
          <dt>Registered visitors</dt>
          <dd>{summary.visitors === null ? '-' : summary.visitors} <Link to="/visitors">View the list</Link></dd>
          <dt>Door unit</dt>
          <dd>
            {device === undefined ? 'Checking...' : device ? (
              <>
                <Badge value={device.status || 'offline'} />{' '}
                {device.last_heartbeat_at ? `Last heartbeat ${formatDateTime(device.last_heartbeat_at)}.` : 'Waiting for first heartbeat.'}
              </>
            ) : <>No door unit is linked yet. <Link to="/device">Set one up</Link></>}
          </dd>
        </dl>
      </Panel>

      <Panel title="Latest entries" actions={<Link to="/entries">See all entries</Link>}>
        <div className="panel-body flush table-wrap" style={{ margin: -14 }}>
          <table className="data">
            <thead><tr><th>When</th><th>Visitor ID</th><th>Authentication</th><th>Result</th></tr></thead>
            <tbody>
              {summary.recent.length === 0 && <EmptyRow cols={4}>No entries have been recorded yet.</EmptyRow>}
              {summary.recent.map((entry) => (
                <tr key={entry.id}>
                  <td>{formatDateTime(entry.created_at)}</td>
                  <td>{entry.visitor_id || 'Unknown person'}</td>
                  <td>{titleCase(entry.authentication_method)}</td>
                  <td><Badge value={entry.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
