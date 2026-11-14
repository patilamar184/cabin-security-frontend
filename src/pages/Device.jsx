import { useCallback, useState } from 'react';
import PageHeading from '../components/PageHeading';
import Panel from '../components/Panel';
import Field from '../components/Field';
import Notice from '../components/Notice';
import Badge from '../components/Badge';
import usePolling from '../hooks/usePolling';
import { deviceApi } from '../api';
import { formatDateTime } from '../utils/format';

export default function Device() {
  const [device, setDevice] = useState(undefined);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const load = useCallback(async () => {
    try {
      setDevice(await deviceApi.mine());
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  usePolling(load, 10000);

  async function register(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await deviceApi.register(name.trim());
      setCredentials({ device_id: result.id, api_key: result.device_api_key });
      setDevice({
        id: result.id,
        name: result.name,
        status: result.status,
        is_active: true,
        last_heartbeat_at: null,
        firmware_version: null,
      });
      setName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeading title="Door unit">
        The ESP32 unit fitted to your cabin door. It must be linked to your account before visitors can use it.
      </PageHeading>
      <Notice kind="error">{error}</Notice>

      {credentials && (
        <Panel title="Door unit credentials">
          <Notice kind="warning">
            Copy the device ID and API key into your ESP32 firmware settings now. The API key is shown only once.
          </Notice>
          <div className="field-label">Device ID</div>
          <div className="secret-box">{credentials.device_id}</div>
          <div className="field-label">Device API key</div>
          <div className="secret-box">{credentials.api_key}</div>
          <button type="button" className="btn" onClick={() => setCredentials(null)}>I have copied these</button>
        </Panel>
      )}

      {device === undefined && !error && <p className="muted">Loading...</p>}

      {device === null && (
        <Panel title="Link a door unit">
          <form className="form" onSubmit={register}>
            <Field label="Name for this door unit" hint="For example: Room 204 door.">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={120} required />
            </Field>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Linking...' : 'Link door unit'}</button>
            </div>
          </form>
        </Panel>
      )}

      {device && (
        <Panel title="Your door unit">
          <dl className="facts">
            <dt>Device name</dt><dd>{device.name}</dd>
            <dt>Connection</dt><dd><Badge value={device.status || 'offline'} /></dd>
            <dt>Device ID</dt><dd>{device.id}</dd>
            <dt>Last heartbeat</dt><dd>{formatDateTime(device.last_heartbeat_at)}</dd>
            <dt>Firmware version</dt><dd>{device.firmware_version || '-'}</dd>
            <dt>Account status</dt><dd><Badge value={device.is_active ? 'active' : 'inactive'} /></dd>
          </dl>
          <p className="muted" style={{ marginTop: 12 }}>The page checks the unit every 10 seconds. The device sends its heartbeat every 20 seconds.</p>
        </Panel>
      )}
    </>
  );
}
