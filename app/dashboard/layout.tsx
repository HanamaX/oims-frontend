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

// Navigation component for Supervisor role
function SupervisorNavigation({ isActive }: Readonly<{ isActive: (path: string) => boolean }>) {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section-title">Management</div>
      <ul className="dashboard-nav">
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/supervisor/center-management"
            className={`dashboard-link ${isActive("/dashboard/supervisor/center-management") ? "dashboard-link-active" : ""}`}
          >
            Center Management
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/supervisor/orphans"
            className={`dashboard-link ${isActive("/dashboard/supervisor/orphans") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.orphans" />
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/supervisor/inventory"
            className={`dashboard-link ${isActive("/dashboard/supervisor/inventory") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.inventory" />
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/supervisor/fundraisers"
            className={`dashboard-link ${isActive("/dashboard/supervisor/fundraisers") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.fundraisers" />
          </Link>
        </li>        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/supervisor/volunteers"
            className={`dashboard-link ${isActive("/dashboard/supervisor/volunteers") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.volunteers" />
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/supervisor/reports"
            className={`dashboard-link ${isActive("/dashboard/supervisor/reports") ? "dashboard-link-active" : ""}`}
          >
            Reports
          </Link>
        </li>
      </ul>
    </div>
  )
}

// Navigation component for Orphanage Admin role
function OrphanageAdminNavigation({ isActive }: Readonly<{ isActive: (path: string) => boolean }>) {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section-title">Management</div>
      <ul className="dashboard-nav">
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/orphanage_admin/center-management"
            className={`dashboard-link ${isActive("/dashboard/orphanage_admin/center-management") ? "dashboard-link-active" : ""}`}
          >
            Center Management
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/orphanage_admin/orphans"
            className={`dashboard-link ${isActive("/dashboard/orphanage_admin/orphans") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.orphans" />
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/orphanage_admin/volunteers"
            className={`dashboard-link ${isActive("/dashboard/orphanage_admin/volunteers") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.volunteers" />
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/orphanage_admin/fundraisers"
            className={`dashboard-link ${isActive("/dashboard/orphanage_admin/fundraisers") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.fundraisers" />
          </Link>
        </li>        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/orphanage_admin/inventory"
            className={`dashboard-link ${isActive("/dashboard/orphanage_admin/inventory") ? "dashboard-link-active" : ""}`}
          >
            <T k="dashboard.inventory" />
          </Link>
        </li>
        <li className="dashboard-nav-item">
          <Link
            href="/dashboard/orphanage_admin/reports"
            className={`dashboard-link ${isActive("/dashboard/orphanage_admin/reports") ? "dashboard-link-active" : ""}`}
          >
            Reports
          </Link>
        </li>
      </ul>
    </div>  )
}

// General navigation component
function GeneralNavigation({ user, isActive }: Readonly<{ user: any, isActive: (path: string) => boolean }>) {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section-title">General</div>      
      <ul className="dashboard-nav">
        {(user?.role === "supervisor" || user?.role === "admin") && (
          <li className="dashboard-nav-item">
            <Link
              href="/dashboard/supervisor"
              className={`dashboard-link ${isActive("/dashboard/supervisor") ? "dashboard-link-active" : ""}`}
            >
              <T k="dashboard.title" />
            </Link>
          </li>
        )}
        {(user?.role === "orphanage_admin" || user?.role === "super_admin") && (
          <li className="dashboard-nav-item">
            <Link
              href="/dashboard/orphanage_admin"
              className={`dashboard-link ${isActive("/dashboard/orphanage_admin") ? "dashboard-link-active" : ""}`}
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
  )
}

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
      
      <div 
        className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} 
        onClick={() => setSidebarOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            setSidebarOpen(false)
          }
        }}
        role="button"
        tabIndex={sidebarOpen ? 0 : -1}
        aria-label="Close sidebar"
      ></div>
      
      <nav className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="dashboard-header">
          <Link href="/" className="font-bold text-3xl text-blue-700">
              OIMS 
            </Link>
          <p className="dashboard-subtitle">
            <T k="dashboard.title" />
          </p>        </div>

        <GeneralNavigation user={user} isActive={isActive} />

        {(user?.role === "supervisor" || user?.role === "admin") && <SupervisorNavigation isActive={isActive} />}
        {(user?.role === "orphanage_admin" || user?.role === "super_admin") && <OrphanageAdminNavigation isActive={isActive} />}

        <div className="dashboard-footer">
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

