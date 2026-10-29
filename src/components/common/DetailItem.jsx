export default function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="detail">
      <span className="icon"><Icon size={20} /></span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
