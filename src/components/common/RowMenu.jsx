import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

/** The three-dot menu at the end of a table row. items: [{label, icon, onClick, danger}] */
export default function RowMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="row-menu" ref={ref}>
      <button className="row-menu-btn" onClick={() => setOpen(!open)} aria-label="Row actions">
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="row-menu-list">
          {items.map(({ label, icon: Icon, onClick, danger }) => (
            <button key={label} className={danger ? 'danger' : ''} onClick={() => { setOpen(false); onClick(); }}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
