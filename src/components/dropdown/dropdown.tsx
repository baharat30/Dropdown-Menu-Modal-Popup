import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import "./dropdown.css";

export type Option = { value: string; label: string };

type DropdownProps = {
  label?: string;
  options: Option[];
  placeholder?: string;

  /** حالت جدید: کامپوننت کنترلی */
  value?: Option | null;
  onChange?: (opt: Option | null) => void;

  /** سازگاری با قبل: اگر فقط این را دادی، همچنان کار می‌کند */
  onSelect?: (opt: Option) => void;

  /** نمایش دکمه پاک‌کردن در صورت انتخاب */
  clearable?: boolean;
};

export default function Dropdown({
  label = "Menu",
  options,
  placeholder = "Select…",
  value,                // اگر مقدار بدهی → کنترلی
  onChange,
  onSelect,
  clearable = true,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // غیرکنترلی داخلی
  const [internalSelected, setInternalSelected] = useState<Option | null>(null);

  // اگر value آمده → کنترلی؛ وگرنه از internal استفاده کن
  const isControlled = value !== undefined;
  const selected = isControlled ? value! : internalSelected;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef  = useRef<HTMLButtonElement>(null);
  const listRef    = useRef<HTMLUListElement>(null);

  useOnClickOutside(wrapperRef, () => setOpen(false), open);

  // بستن با ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // وقتی باز شد فوکوس به لیست
  useEffect(() => {
    if (open) {
      setActiveIdx(0);
      setTimeout(() => listRef.current?.focus(), 0);
    }
  }, [open]);

  const setSelected = (opt: Option | null) => {
    if (!isControlled) setInternalSelected(opt);
    onChange?.(opt ?? null);
    if (opt) onSelect?.(opt); // سازگاری با API قبلی
  };

  const toggle = () => setOpen(o => !o);

  const choose = (opt: Option) => {
    setSelected(opt);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const clear = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // نذار دکمه باز/بسته شود
    setSelected(null);
    setOpen(false);
    buttonRef.current?.focus();
  };

  // ناوبری با کیبورد داخل منو
  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => (i - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeIdx >= 0) choose(options[activeIdx]);
    } else if (e.key === "Backspace" && clearable && selected) {
      // پاک‌کردن سریع با Backspace
      e.preventDefault();
      clear();
    }
  };

  return (
    <div className="dd-wrap" ref={wrapperRef}>
      {label && <label className="dd-label">{label}</label>}

      <button
        ref={buttonRef}
        type="button"
        className="dd-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="dd-button-text">
          {selected ? selected.label : placeholder}
        </span>

        {/* دکمه پاک‌کردن؛ فقط وقتی انتخاب شده و clearable */}
        {clearable && selected && (
          <span
            className="dd-clear"
            role="button"
            aria-label="Clear selection"
            onClick={clear}
          >
            ×
          </span>
        )}

        <span aria-hidden className={`dd-caret ${open ? "rotate" : ""}`}>▾</span>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="dd-menu"
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
        >
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={selected?.value === opt.value}
              className={`dd-item ${idx === activeIdx ? "active" : ""} ${
                selected?.value === opt.value ? "selected" : ""
              }`}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => choose(opt)}
            >
              {opt.label}
            </li>
          ))}

          {/* آیتم پاک‌کردن داخل منو هم (اختیاری) */}
          {clearable && selected && (
            <li className="dd-item" onClick={() => clear()}>
              Clear selection
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
