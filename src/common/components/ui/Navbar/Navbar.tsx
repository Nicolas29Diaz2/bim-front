"use client";

import { HTMLAttributes, ReactNode, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Bell, Settings } from "lucide-react";
import { cn } from "@/common/utils/cn";
import { CustomSelect } from "@/common/components/ui/CustomSelect";
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
  centerSlot?: string;
  user?: {
    name: string;
    role: string;
  };
  handleLogoClick?: () => void;
}

const LOCALE_OPTIONS = [
  { value: "es" as const, label: "locale.es" },
  { value: "en" as const, label: "locale.en" },
];

function Navbar({
  logo = "Spybee",
  tabs,
  activeTab,
  onTabClick,
  actions,
  avatar,
  leadingSlot,
  centerSlot,
  className,
  user,
  handleLogoClick,
  ...rest
}: Readonly<NavbarProps>) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale as "es" | "en" });
    },
    [router, pathname],
  );

  return (
    <header className={cn(styles.navbar, className)} {...rest}>
      {leadingSlot}

      <button className={styles.logo} onClick={handleLogoClick}>
        {logo}
      </button>

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

      <div className={styles.centerSlot}>{centerSlot}</div>

      <div className={styles.actions}>
        {actions}
        <div className={styles.localeSelector}>
          <CustomSelect
            value={locale}
            options={LOCALE_OPTIONS.map((opt) => ({
              value: opt.value,
              label: t(opt.label),
            }))}
            onChange={handleLocaleChange}
          />
        </div>
        <button
          type="button"
          className={styles.actionButton}
          aria-label={t("navbar.notifications")}
        >
          <Bell size={18} />
        </button>
        {avatar ?? <span className={styles.avatar}>A</span>}
        <div className={styles.userContainer}>
          <span className={styles.userName}>{user?.name}</span>
          <span className={styles.userRole}>{user?.role}</span>
        </div>
      </div>
    </header>
  );
}

export { Navbar, type NavbarProps, type NavbarTab };
