"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { T } from "@/contexts/LanguageContext"
import { useState, useEffect } from "react"
import { User, Menu, X } from "lucide-react"
import "./dashboard.css"

function DashboardLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIsMobile();
    
    // Listen for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="dashboard-container">
      {/* Hamburger menu button - only visible on mobile */}
      <button 
        className="mobile-menu-button" 
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      <nav className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-header">
          <h2 className="dashboard-title">
            <T k="app.name" />
          </h2>
          <p className="dashboard-subtitle">
            <T k="dashboard.title" />
          </p>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-title">
            General
          </div>
          <ul className="dashboard-nav">
            {user?.role === "admin" && (
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/admin"
                  className={`dashboard-link ${isActive("/dashboard/admin") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.title" />
                </Link>
              </li>
            )}
            {user?.role === "superadmin" && (
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin"
                  className={`dashboard-link ${isActive("/dashboard/superadmin") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.title" />
                </Link>
              </li>
            )}
            <li className="dashboard-nav-item">
              <Link
                href="/dashboard/profile"
                className={`dashboard-link-flex ${isActive("/dashboard/profile") ? "dashboard-link-active" : ""}`}
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>
            </li>
          </ul>
        </div>

        {user?.role === "admin" && (
          <div className="dashboard-section">
            <div className="dashboard-section-title">
              Management
            </div>
            <ul className="dashboard-nav">
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/admin/orphans"
                  className={`dashboard-link ${isActive("/dashboard/admin/orphans") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.orphans" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/admin/inventory"
                  className={`dashboard-link ${isActive("/dashboard/admin/inventory") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.inventory" />
                </Link>
              </li>

              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/admin/fundraisers"
                  className={`dashboard-link ${isActive("/dashboard/admin/fundraisers") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.fundraisers" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/admin/volunteers"
                  className={`dashboard-link ${isActive("/dashboard/admin/volunteers") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.volunteers" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/admin/reports"
                  className={`dashboard-link ${isActive("/dashboard/admin/reports") ? "dashboard-link-active" : ""}`}
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>
        )}        {user?.role === "superadmin" && (
          <div className="dashboard-section">
            <div className="dashboard-section-title">
              Management
            </div>
            <ul className="dashboard-nav">
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/branches"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/branches") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.branches" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/center"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/center") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.center" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/orphans"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/orphans") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.orphans" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/volunteers"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/volunteers") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.volunteers" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/fundraisers"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/fundraisers") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.fundraisers" />
                </Link>
              </li>              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/inventory"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/inventory") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.inventory" />
                </Link>              </li>              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/staff"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/staff") ? "dashboard-link-active" : ""}`}
                >
                  <T k="dashboard.staff" />
                </Link>
              </li>
              <li className="dashboard-nav-item">
                <Link
                  href="/dashboard/superadmin/reports"
                  className={`dashboard-link ${isActive("/dashboard/superadmin/reports") ? "dashboard-link-active" : ""}`}
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>
        )}        <div className="dashboard-footer">
          <div className="dashboard-footer-row">
            <LanguageSwitcher />
          </div>
          <button
            onClick={logout}
            className="dashboard-logout-btn"
            aria-label="Logout"
            title="Logout"
          >
            <T k="nav.logout" />
          </button>
        </div>
      </nav>

      <main className={`dashboard-main ${sidebarOpen ? 'main-pushed' : ''}`}>{children}</main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  )
}
