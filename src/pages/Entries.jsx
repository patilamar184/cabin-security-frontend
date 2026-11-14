import { useEffect, useMemo, useState } from 'react';
import PageHeading from '../components/PageHeading';
import Panel from '../components/Panel';
import Notice from '../components/Notice';
import Badge from '../components/Badge';
import EmptyRow from '../components/EmptyRow';
import Field from '../components/Field';
import { logApi, visitorApi } from '../api';
import { formatDateTime, titleCase } from '../utils/format';

export default function Entries() {
  const [logs, setLogs] = useState(null);
  const [names, setNames] = useState({});
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('all');

  useEffect(() => {
    logApi.list().then(setLogs).catch((e) => setError(e.message));
    visitorApi.list().then((list) => {
      const map = {};
      list.forEach((visitor) => { map[visitor.id] = visitor.name; });
      setNames(map);
    }).catch(() => {});
  }, []);

  const results = useMemo(() => logs ? [...new Set(logs.map((log) => log.result))] : [], [logs]);
  const nameOf = (log) => log.visitor_id ? names[log.visitor_id] || `Visitor ${log.visitor_id}` : 'Unknown person';

  const shown = useMemo(() => {
    if (!logs) return [];
    const query = search.trim().toLowerCase();
    return logs.filter((log) =>
      (result === 'all' || log.result === result) &&
      (!query || `${nameOf(log)} ${log.event_type} ${log.description || ''}`.toLowerCase().includes(query))
    );
  }, [logs, names, search, result]);

  return (
    <>
      <PageHeading title="Previous entries">A record of authentication attempts, newest first.</PageHeading>
      <Notice kind="error">{error}</Notice>
      <Panel title="Entry record">
        <div className="toolbar">
          <div className="grow">
            <Field label="Search by visitor or details">
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </Field>
          </div>
          <Field label="Authentication result">
            <select value={result} onChange={(e) => setResult(e.target.value)}>
              <option value="all">All results</option>
              {results.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
            </select>
          </Field>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead><tr><th>Date and time</th><th>Visitor</th><th>Authentication</th><th>Result</th><th>Access decision</th></tr></thead>
            <tbody>
              {logs === null && !error && <EmptyRow cols={5}>Loading entries...</EmptyRow>}
              {logs !== null && shown.length === 0 && <EmptyRow cols={5}>{logs.length === 0 ? 'No entries have been recorded yet.' : 'No entry matches your search.'}</EmptyRow>}
              {shown.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(log.created_at)}</td>
                  <td>{nameOf(log)}</td>
                  <td>{titleCase(log.authentication_method)}</td>
                  <td><Badge value={log.authentication_result} /></td>
                  <td><Badge value={log.access_decision} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs && <p className="muted" style={{ marginTop: 10 }}>Showing {shown.length} of {logs.length}.</p>}
      </Panel>
    </>
  );
}
