import { Link, useLocation } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebarStore';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    name: 'Devices',
    href: '/devices',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
  },
];

export default function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const location = useLocation();

  return (
    <div
      className={`bg-gray-800 text-white w-64 min-h-screen flex-shrink-0 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-64 hidden'}`}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-700">
        <span className="text-xl font-bold tracking-wider text-blue-400">BCMS</span>
      </div>
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
              >
                <svg
                  className={`${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'} flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
