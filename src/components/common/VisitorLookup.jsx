import { useState } from 'react';
import { ArrowRight, Contact } from 'lucide-react';
import Button from '../ui/Button';

/** The "Visitor ID  [ 102 ]  Proceed" bar used on the Edit and Delete pages. */
export default function VisitorLookup({ initialId = '', onProceed, loading }) {
  const [value, setValue] = useState(initialId);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) onProceed(value.trim());
  };

  return (
    <form className="lookup" onSubmit={submit}>
      <span className="icon"><Contact size={26} /></span>
      <div>
        <label className="muted" htmlFor="visitor-id" style={{ fontSize: 14 }}>Visitor ID</label>
        <input
          id="visitor-id"
          className="input input-id"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
          placeholder="e.g. 102"
        />
      </div>
      <span className="spacer" />
      <Button type="submit" icon={ArrowRight} loading={loading} disabled={!value.trim()}>Proceed</Button>
    </form>
  );
}
