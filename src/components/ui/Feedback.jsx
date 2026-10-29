export function Loading({ text = 'Loading...' }) {
  return (
    <div className="center-fill">
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="center-fill">
      <p className="alert-error-inline">{message}</p>
      {onRetry && (
        <button className="btn btn-neutral" onClick={() => onRetry()}>Try again</button>
      )}
    </div>
  );
}

export const EmptyState = ({ children }) => <div className="empty-state">{children}</div>;
