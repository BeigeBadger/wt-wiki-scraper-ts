import { NavLink } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/vehicles', label: 'Vehicles' },
  { path: '/line-up-builder', label: 'Line-up Builder' },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200">
      <div className="px-8 py-4">
        <ul className="flex gap-6">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `text-lg pb-1 ${
                    isActive
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
