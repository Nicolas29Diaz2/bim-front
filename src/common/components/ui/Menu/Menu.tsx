import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Menu.module.scss";
import Link from "next/link";

interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
}

interface MenuProps extends HTMLAttributes<HTMLElement> {
  items: MenuItem[];
  footerItems?: MenuItem[];
  activeItem?: string;
  onItemClick?: (key: string) => void;
  profileName?: string;
  profileSub?: string;
  collapsed?: boolean;
}

function Menu({
  items,
  footerItems,
  activeItem,
  profileName,
  profileSub,
  collapsed,
  className,
  ...rest
}: Readonly<MenuProps>) {
  return (
    <nav
      className={cn(styles.menu, collapsed && styles.collapsed, className)}
      {...rest}
    >
      {profileName && (
        <div className={styles.profile}>
          <span className={styles.avatar}>{profileName.charAt(0)}</span>
          {!collapsed && (
            <div className={styles.profileText}>
              <span className={styles.profileName}>{profileName}</span>
              {profileSub && (
                <span className={styles.profileSub}>{profileSub}</span>
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.navItems}>
        {items.map((item) => {
          const isActive = item.key === activeItem;
          return (
            <Link
              key={item.key}
              href={item.href ?? "#"}
              className={cn(styles.navItem, isActive && styles.active)}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!collapsed && <span className={styles.label}>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {footerItems && footerItems.length > 0 && (
        <div className={styles.footer}>
          {footerItems.map((item) => {
            const content = (
              <>
                <span className={styles.icon}>{item.icon}</span>
                {!collapsed && <span className={styles.label}>{item.label}</span>}
              </>
            );

            if (item.onClick) {

              return (
                <button
                  key={item.key}
                  type="button"
                  className={styles.navItem}
                  title={collapsed ? item.label : undefined}
                  onClick={item.onClick}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href ?? "#"}
                className={styles.navItem}
                title={collapsed ? item.label : undefined}
              >
                {content}
              </Link>
            );
          })}
        </div>
      )}

    </nav>
  );
}

export { Menu, type MenuProps, type MenuItem };
