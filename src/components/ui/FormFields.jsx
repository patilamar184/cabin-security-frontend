import { useId } from 'react';

export function TextField({ label, icon: Icon, error, required, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <div className="input-wrap">
        {Icon && <Icon size={18} />}
        <input id={id} className={`input ${error ? 'has-error' : ''}`} {...props} />
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function SelectField({ label, icon: Icon, error, required, options, placeholder = 'Select...', ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <div className="input-wrap">
        {Icon && <Icon size={18} />}
        <select id={id} className={`select ${error ? 'has-error' : ''}`} {...props}>
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

/** Small dropdown used in table filters (no icon, label above). */
export function FilterSelect({ label, value, onChange, options, allLabel = 'All' }) {
  return (
    <label className="filter">
      {label}
      <select className="select select-compact" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </label>
  );
}
