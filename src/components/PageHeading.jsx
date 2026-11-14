export default function PageHeading({ title, children }) {
  return (
    <div className="page-heading">
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
