import { Loader2 } from 'lucide-react';

/** variant: primary | success | danger | outline | neutral */
export default function Button({ variant = 'primary', loading = false, block, large, icon: Icon, children, className = '', ...props }) {
  const classes = ['btn', `btn-${variant}`, block && 'btn-block', large && 'btn-lg', className].filter(Boolean).join(' ');
  return (
    <button className={classes} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 size={18} className="spin-icon" style={{ animation: 'spin 0.8s linear infinite' }} /> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
