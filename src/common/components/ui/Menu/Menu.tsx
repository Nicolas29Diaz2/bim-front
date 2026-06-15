import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/common/utils/cn";
import styles from "./Menu.module.scss";

interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  href?: string;
}

interface MenuProps extends HTMLAttributes<HTMLElement> {
  items: MenuItem[];
  activeItem?: string;
  onItemClick?: (key: string) => void;
  profileName?: string;
  profileSub?: string;
  footer?: ReactNode;
  collapsed?: boolean;
}

function Menu({
  items,
  activeItem,
  profileName,
  profileSub,
  footer,
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
            <a
              key={item.key}
              href={item.href ?? "#"}
              className={cn(styles.navItem, isActive && styles.active)}
              title={collapsed ? item.label : undefined}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!collapsed && <span className={styles.label}>{item.label}</span>}
            </a>
          );
        })}
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
}

export { Menu, type MenuProps, type MenuItem };
