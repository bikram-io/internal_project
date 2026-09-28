import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Search, Bell, LayoutDashboard, ClipboardList, Database, Sparkles, Brain, ShieldCheck, BarChart3, Settings } from 'lucide-react';
import Icon3D from './components/Icon3D/Icon3D';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Assessments', path: '/assessments', icon: ClipboardList, icon3DType: 'assessments' },
  { name: 'Data', path: '/data', icon: Database, icon3DType: 'data' },
  { name: 'GenAI', path: '/genai', icon: Sparkles, icon3DType: 'genai' },
  { name: 'ML', path: '/ml', icon: Brain, icon3DType: 'ml' },
  { name: 'Data Governance', path: '/data-governance', icon: ShieldCheck, icon3DType: 'governance' },
  { name: 'Reports', path: '/reports', icon: BarChart3, icon3DType: 'reports' },
  { name: 'Administration', path: '/administration', icon: Settings, icon3DType: 'administration' },
];

export default function Layout() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          InfraSizer
        </div>
        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  {item.icon3DType ? (
                    <Icon3D icon={item.icon} type={item.icon3DType} />
                  ) : (
                    <div className={`nav-icon-square ${isActive ? 'active' : ''}`}>
                      <item.icon size={20} />
                    </div>
                  )}
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search assessments..."
              className="search-input"
            />
          </div>
          <div className="topbar-right">
            <button className="bell-button">
              <Bell size={20} />
            </button>
            <div className="avatar">
              AP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
