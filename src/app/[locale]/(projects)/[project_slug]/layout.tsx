"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useParams, notFound, useRouter } from "next/navigation";
import {
  Menu as MenuIcon,
  LayoutDashboard,
  AlertTriangle,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { cn } from "@/common/utils/cn";
import { Navbar } from "@/common/components/ui/Navbar";
import { Menu } from "@/common/components/ui/Menu";
import { SidebarToggle } from "@/common/components/ui/Menu/SidebarToggle";
import useIsMobile from "@/common/hooks/useIsMobile";
import { getProjectBySlug } from "@/modules/projects/services/getProjectBySlug.service";
import type { Project } from "@/modules/projects/types/projects";
import styles from "./layout.module.scss";
import type { MenuItem } from "@/common/components/ui/Menu";

export const getNavItems = (
  t: (key: string) => string,
  slug: string,
): MenuItem[] => [
  {
    key: "dashboard",
    label: t("menu.dashboard"),
    icon: <LayoutDashboard size={18} />,
    href: `/${slug}/dashboard`,
  },
  {
    key: "incidents",
    label: t("menu.incidents"),
    icon: <AlertTriangle size={18} />,
    href: `/${slug}/incidents`,
  },
];

export const getFooterItems = (
  t: (key: string) => string,
  locale?: string,
): MenuItem[] => [
  {
    key: "help",
    label: t("menu.help"),
    icon: <CircleHelp size={18} />,
    href: "/help",
  },
  {
    key: "logout",
    label: t("menu.logout"),
    icon: <LogOut size={18} />,
    onClick: () => signOut({ callbackUrl: `/${locale || "es"}/login` }),
  },
];

export function getActiveNavKey(
  pathname: string,
  navItems: MenuItem[],
): string {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments.at(-1) ?? "";
  const match = navItems.find((item) => item.key === lastSegment);
  return match?.key ?? "dashboard";
}

export default function ManagementLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();
  const pathname = usePathname();
  const params = useParams();
  const slug = params.project_slug as string;
  const router = useRouter();

  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const user = session?.user;

  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const navItems = useMemo(() => getNavItems(t, slug ?? ""), [t, slug]);
  const menuFooterItems = useMemo(
    () => getFooterItems(t, params.locale as string),
    [t, params.locale],
  );
  const activeKey = useMemo(
    () => getActiveNavKey(pathname, navItems),
    [pathname, navItems],
  );

  const sidebarCollapsed = isMobile ? false : !expanded;

  const fetchProject = useCallback(async () => {
    try {
      const result = await getProjectBySlug(slug);
      if (!result.ok || !result.value) {
        notFound();
        return;
      }
      setProject(result.value);
    } catch (error) {
      console.error("Error loading project configuration:", error);
      notFound();
    }
  }, [slug]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setExpanded((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!slug) return;
    //eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject();
  }, [fetchProject, slug]);

  const renderSidebar = (isMobileView: boolean) => (
    <div
      className={cn(
        styles.sidebar,
        isMobileView ? styles.mobileOpen : sidebarCollapsed && styles.collapsed,
      )}
    >
      <Menu
        items={navItems}
        footerItems={menuFooterItems}
        activeItem={activeKey}
        profileName={user?.name ?? "User"}
        profileSub={project?.name ?? t("menu.loading")}
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
              aria-label={t("menu.openMenu")}
            >
              <MenuIcon size={18} />
            </button>
          ) : undefined
        }
        centerSlot={project?.name}
        avatar={user?.avatar}
        user={{
          name: user?.name ?? "",
          role: user?.role ?? "",
        }}
        handleLogoClick={() => {
          router.push("/");
        }}
      />

      <div className={styles.body}>
        {!isMobile && renderSidebar(false)}

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
