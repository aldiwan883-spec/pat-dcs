const paths = {
  arrow: "M5 12h14M13 6l6 6-6 6",
  cpu: "M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zM10 10h4v4h-4z",
  plug: "M9 2v5M15 2v5M6 7h12v4a6 6 0 01-12 0V7zM12 17v5",
  power: "M12 3v8M6.4 6.6a8 8 0 1011.2 0",
  check: "M5 6l2 2 3-3M5 14l2 2 3-3M13 7h6M13 15h6",
  gauge: "M12 14l4-4M3.5 17a9 9 0 1117 0",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 19a6 6 0 0112 0M16 11a3 3 0 000-6M17 19h4a5 5 0 00-4-4.9",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 21h15",
  alert: "M12 4l9 16H3L12 4zM12 10v4M12 17h.01",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mail: "M4 6h16v12H4V6zM4 7l8 6 8-6",
  pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  clock: "M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-6", flip = false }: { name: IconName; className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${className}${flip ? " rtl:-scale-x-100" : ""}`}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export const serviceIcon: Record<string, IconName> = {
  dcs: "cpu",
  plc: "plug",
  commissioning: "power",
  ic: "gauge",
  training: "book",
  staffing: "users",
  support: "alert",
};
