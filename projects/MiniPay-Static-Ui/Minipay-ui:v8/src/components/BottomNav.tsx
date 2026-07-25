import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ArrowLeftRight, Compass, Clock, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/swap", label: "Swap", icon: ArrowLeftRight },
  { to: "/discover", label: "Apps", icon: Compass },
  { to: "/activity", label: "Activity", icon: Clock },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`group flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition-colors ${
                  active ? "text-brand" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`grid size-9 place-items-center rounded-full transition-all ${
                    active ? "bg-brand/15" : "bg-transparent group-hover:bg-accent/60"
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className="tracking-wide">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
