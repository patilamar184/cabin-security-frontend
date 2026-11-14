export default function EmptyRow({ cols, children }) {
  return (
    <tr>
      <td colSpan={cols} className="empty-cell">{children}</td>
    </tr>
  );
}
