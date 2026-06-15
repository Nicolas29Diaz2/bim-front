"use client";

import { HTMLAttributes, ReactNode } from "react";
import { Bell, Settings } from "lucide-react";
import { cn } from "@/common/utils/cn";
import styles from "./Navbar.module.scss";

interface NavbarTab {
  key: string;
  label: string;
}

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  tabs?: NavbarTab[];
  activeTab?: string;
  onTabClick?: (key: string) => void;
  actions?: ReactNode;
  avatar?: ReactNode;
  leadingSlot?: ReactNode;
}

function Navbar({
  logo = "Spybee",
  tabs,
  activeTab,
  onTabClick,
  actions,
  avatar,
  leadingSlot,
  className,
  ...rest
}: Readonly<NavbarProps>) {
  return (
    <header className={cn(styles.navbar, className)} {...rest}>
      {leadingSlot}

      <span className={styles.logo}>{logo}</span>

      {tabs && tabs.length > 0 && (
        <nav className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={cn(
                styles.tab,
                activeTab === tab.key && styles.activeTab,
              )}
              onClick={() => onTabClick?.(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      <div className={styles.spacer} />

      <div className={styles.actions}>
        {actions}
        <button
          type="button"
          className={styles.actionButton}
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <button
          type="button"
          className={styles.actionButton}
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
        {avatar ?? <span className={styles.avatar}>A</span>}
      </div>
    </header>
  );
}

export { Navbar, type NavbarProps, type NavbarTab };
