import Image from "next/image";
import { clients, type Client } from "@/data/clients";

function Wall({ title, items }: { title: string; items: Client[] }) {
  return (
    <div>
      <h3 className="eyebrow text-[0.95rem] text-brand-ink">{title}</h3>
      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7" dir="ltr">
        {items.map((c) => (
          <li key={c.key} className="flex h-16 items-center justify-center rounded-md border border-line bg-white px-2 py-2 sm:h-24 sm:px-4 sm:py-3">
            <Image
              src={`/images/clients/${c.key}.png`}
              alt={c.name}
              title={c.name}
              width={c.w}
              height={c.h}
              sizes="160px"
              className="max-h-9 w-auto sm:max-h-12 max-w-full object-contain"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ClientWall({ contractors, owners }: { contractors: string; owners: string }) {
  return (
    <div className="space-y-8">
      <Wall title={contractors} items={clients.filter((c) => c.group === "contractor")} />
      <Wall title={owners} items={clients.filter((c) => c.group === "owner")} />
    </div>
  );
}
