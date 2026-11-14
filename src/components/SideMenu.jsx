import { NavLink } from 'react-router-dom';

export default function SideMenu({ title, items }) {
  return (
    <nav className="side-menu" aria-label={title}>
      <div className="side-menu-title">{title}</div>
      <ul>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end}>{item.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
