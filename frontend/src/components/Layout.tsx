import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Calendar, 
  Receipt,
  TrendingUp
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/packages', icon: Package, label: 'Packages' },
  { to: '/teachers', icon: Users, label: 'Teachers' },
  { to: '/sessions', icon: Calendar, label: 'Sessions' },
  { to: '/transactions', icon: Receipt, label: 'Transactions' },
];

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-dark-700 fixed h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Nwmoon</h1>
              <p className="text-[10px] text-dark-500 uppercase tracking-[0.2em]">Finance System</p>
            </div>
          </div>
        </div>

        <nav className="px-3 pb-6">
          <div className="mb-4">
            <p className="px-3 text-[10px] font-medium text-dark-500 uppercase tracking-wider mb-2">
              Menu
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                          : 'text-dark-400 hover:text-white hover:bg-dark-800'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-800">
          <div className="glass rounded-xl p-4">
            <p className="text-xs text-dark-400 mb-1">API Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-emerald-400">Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-dark-950 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

