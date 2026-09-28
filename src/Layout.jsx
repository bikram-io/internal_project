import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Assessments', path: '/assessments' },
  { name: 'Data', path: '/data' },
  { name: 'GenAI', path: '/genai' },
  { name: 'ML', path: '/ml' },
  { name: 'Data Governance', path: '/data-governance' },
  { name: 'Reports', path: '/reports' },
  { name: 'Administration', path: '/administration' },
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
              {item.name}
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
