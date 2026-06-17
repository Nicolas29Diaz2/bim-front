import { useState, useRef, useCallback, useMemo, useId } from "react";
import { cn } from "@/common/utils/cn";
import { useDropdownPosition } from "@/common/hooks/useDropdownPosition";
import { useClickOutside } from "@/common/hooks/useClickOutside";
import { DropdownPanel, DropdownOption } from "@/common/components/ui/Dropdown";
import styles from "./MultiSelect.module.scss";

interface MultiSelectOption<TValue extends string> {
  value: TValue;
  label: string;
  disabled?: boolean;
  color?: string;
}

interface MultiSelectProps<TValue extends string> {
  options: MultiSelectOption<TValue>[];
  value: TValue[];
  onChange: (values: TValue[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  searchable?: boolean;
  emptyMessage?: string;
}

function MultiSelect<TValue extends string>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  error,
  className,
  searchable = true,
  emptyMessage = "No options available",
}: Readonly<MultiSelectProps<TValue>>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const coords = useDropdownPosition(triggerRef, isOpen);

  const filtered = useMemo(() => {
    if (!searchable || !search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search, searchable]);

  const selected = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    setSearch("");
  }, []);
  useClickOutside([triggerRef, panelRef], close, isOpen);

  const openDropdown = useCallback(() => {
    if (disabled || isOpen) return;
    setIsOpen(true);
    setFocusedIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [disabled, isOpen]);

  const handleTriggerClick = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      openDropdown();
    }
  }, [disabled, isOpen, openDropdown]);

  function toggleValue(v: TValue) {
    const next = value.includes(v)
      ? value.filter((x) => x !== v)
      : [...value, v];
    onChange(next);
    if (searchable) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function removeValue(v: TValue, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(value.filter((x) => x !== v));
    triggerRef.current?.focus();
  }

  function moveFocus(delta: number) {
    setFocusedIndex((prev) => {
      let n = prev + delta;
      while (n >= 0 && n < filtered.length && filtered[n].disabled) n += delta;
      return n >= 0 && n < filtered.length ? n : prev;
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (isOpen) {
          moveFocus(1);
        } else openDropdown();
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) moveFocus(-1);
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0)
          toggleValue(filtered[focusedIndex].value);
        else if (!isOpen) openDropdown();
        break;
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          close();
        }
        break;
      case "Backspace":
        if (!search && selected.length > 0) onChange(value.slice(0, -1));
        break;
    }
  }

  const hasError = Boolean(error);
  const removeChip = (v: TValue) => (e: React.MouseEvent) => removeValue(v, e);

  return (
    <div
      className={cn(
        styles.wrapper,
        hasError && styles.error,
        disabled && styles.disabled,
        className,
      )}
    >
      <div
        ref={triggerRef}
        className={cn(styles.trigger, isOpen && styles.triggerOpen)}
        onClick={handleTriggerClick}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
      >
        {selected.length === 0 && !search && (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        {selected.map((o) => (
          <div
            key={o.value}
            className={cn(styles.chip, o.color && styles.chipCustom)}
            style={
              o.color ? { ["--chip-color" as string]: o.color } : undefined
            }
            onClick={(e) => e.stopPropagation()}
            role="option"
          >
            <span className={styles.chipLabel}>{o.label}</span>
            {!disabled && (
              <button
                type="button"
                className={styles.chipDismiss}
                onClick={removeChip(o.value)}
                aria-label={`Remove ${o.label}`}
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="2" y1="2" x2="10" y2="10" />
                  <line x1="10" y1="2" x2="2" y2="10" />
                </svg>
              </button>
            )}
          </div>
        ))}
        {searchable && isOpen && (
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            value={search}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              setSearch(e.target.value);
              setFocusedIndex(-1);
            }}
            placeholder={selected.length > 0 ? "" : placeholder}
            aria-label="Search options"
          />
        )}
      </div>
      <DropdownPanel
        ref={panelRef}
        id={listboxId}
        isOpen={isOpen}
        maxHeight={coords.maxHeight}
        direction={coords.direction}
        coordinates={coords.coordinates}
      >
        {filtered.length === 0 ? (
          <div className={styles.empty}>{emptyMessage}</div>
        ) : (
          filtered.map((o) => (
            <DropdownOption
              key={o.value}
              isSelected={value.includes(o.value)}
              isFocused={filtered.indexOf(o) === focusedIndex}
              disabled={o.disabled}
              onClick={() => toggleValue(o.value)}
              onMouseEnter={() => setFocusedIndex(filtered.indexOf(o))}
            >
              {o.label}
            </DropdownOption>
          ))
        )}
      </DropdownPanel>
      {hasError && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

export { MultiSelect, type MultiSelectProps, type MultiSelectOption };
