"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AlertTriangle } from "lucide-react";
import { cn } from "@/common/utils/cn";
import { Navbar } from "@/common/components/ui/Navbar";
import { Menu } from "@/common/components/ui/Menu";
import { SidebarToggle } from "@/common/components/ui/Menu/SidebarToggle";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { key: "incidents", label: "Incidents", icon: <AlertTriangle size={18} />, href: "/incidents" },
] as const;

const MOBILE_BREAKPOINT = 768;

function getActiveNavKey(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "";
  const match = NAV_ITEMS.find((item) => item.key === lastSegment);
  return match?.key ?? "dashboard";
}

export default function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const activeKey = getActiveNavKey(pathname);

  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = e.matches;
      setIsMobile(mobile);
      if (mobile) setExpanded(false);
    };
    handleChange(mql);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setExpanded((prev) => !prev);
    }
  }, [isMobile]);

  const closeMobileSidebar = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const sidebarCollapsed = isMobile ? false : !expanded;

  const sidebar = (
    <div className={cn(styles.sidebar, sidebarCollapsed && styles.collapsed)}>
      <Menu
        items={NAV_ITEMS.map((item) => ({ ...item }))}
        activeItem={activeKey}
        profileName="BIM Manager"
        profileSub="Site A-102"
        collapsed={sidebarCollapsed}
      />
      {!isMobile && (
        <SidebarToggle collapsed={sidebarCollapsed} onClick={toggleSidebar} />
      )}
    </div>
  );

  return (
    <div className={styles.layout}>
      <Navbar
        leadingSlot={
          isMobile ? (
            <button
              type="button"
              className={styles.mobileToggle}
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <LayoutDashboard size={18} />
            </button>
          ) : undefined
        }
      />

      <div className={styles.body}>
        {!isMobile && sidebar}

        {isMobile && mobileOpen && (
          <>
            <div
              className={styles.overlay}
              onClick={closeMobileSidebar}
              aria-hidden="true"
            />
            <div className={cn(styles.sidebar, styles.mobileOpen)}>
              <Menu
                items={NAV_ITEMS.map((item) => ({ ...item }))}
                activeItem={activeKey}
                profileName="BIM Manager"
                profileSub="Site A-102"
                collapsed={false}
              />
            </div>
          </>
        )}

        <main
          className={cn(
            styles.main,
            sidebarCollapsed ? styles.mainCompact : styles.mainExpanded,
          )}
        >
          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </div>
  );
}
