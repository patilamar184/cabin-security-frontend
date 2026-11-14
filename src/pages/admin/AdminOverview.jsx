import { useEffect, useState } from 'react';
import PageHeading from '../../components/PageHeading';
import Panel from '../../components/Panel';
import Notice from '../../components/Notice';
import { adminApi } from '../../api';

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.dashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  const rows = data && [
    ['Cabin owners registered', data.owners],
    ['Owners with active accounts', data.active_owners],
    ['Cabins / tenants', data.tenants],
  ];

  return (
    <>
      <PageHeading title="Overview">A summary of the platform using the administrator statistics API.</PageHeading>
      <Notice kind="error">{error}</Notice>
      <Panel title="Platform summary">
        {!data && !error && <p className="muted">Loading...</p>}
        {rows && (
          <dl className="facts">
            {rows.map(([label, value]) => (
              <span key={label} style={{ display: 'contents' }}>
                <dt>{label}</dt><dd><strong>{value ?? 0}</strong></dd>
              </span>
            ))}
          </dl>
        )}
      </Panel>
    </>
  );
}
