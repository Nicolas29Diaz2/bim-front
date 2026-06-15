"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AlertTriangle, Menu as MenuIcon, CircleHelp, LogOut } from "lucide-react";
import { cn } from "@/common/utils/cn";
import { Navbar } from "@/common/components/ui/Navbar";
import { Menu, MenuItem } from "@/common/components/ui/Menu";
import { SidebarToggle } from "@/common/components/ui/Menu/SidebarToggle";
import styles from "./Sidebar.module.scss";
import useIsMobile from "@/common/hooks/useIsMobile";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const NAV_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/dashboard",
  },
  {
    key: "incidents",
    label: "Incidents",
    icon: <AlertTriangle size={18} />,
    href: "/incidents",
  },
] as const;

const footerItems: MenuItem[] = [
  {
    key: "help",
    label: "Help",
    icon: <CircleHelp size={18} />,
    href: "/help",
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogOut size={18} />,
    onClick: () => signOut({ callbackUrl: "/login" }),
  },
]

function getActiveNavKey(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1) ?? "";
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
  const isMobile = useIsMobile();
  const { data } = useSession();
  const user = data?.user;

  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarCollapsed = isMobile ? false : !expanded;



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

  const renderSidebar = (isMobileView: boolean) => (
    <div
      className={cn(
        styles.sidebar,
        isMobileView ? styles.mobileOpen : sidebarCollapsed && styles.collapsed,
      )}
    >
      <Menu
        items={NAV_ITEMS}
        footerItems={footerItems}
        activeItem={activeKey}
        profileName="BIM Manager"
        profileSub="Site A-102"
        collapsed={isMobileView ? false : sidebarCollapsed}
      />
      {!isMobileView && (
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
              <MenuIcon size={18} />
            </button>
          ) : undefined
        }
        user={{
          name: user?.name ?? "",
          role: user?.role ?? "",
        }}
      />

      <div className={styles.body}>
        {/* Desktop */}
        {!isMobile && renderSidebar(false)}

        {/* Mobile */}
        {isMobile && mobileOpen && (
          <>
            <div
              className={styles.overlay}
              onClick={closeMobileSidebar}
              aria-hidden="true"
            />
            {renderSidebar(true)}
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
