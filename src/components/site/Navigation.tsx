import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const primaryLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/visita", label: "Visita" },
  { to: "/eventi", label: "Cosa c'è" },
  { to: "/approccio", label: "Il nostro approccio" },
  { to: "/lavora-con-noi", label: "Lavora con noi" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 pb-1 text-sm transition-colors ${
    isActive
      ? "border-signal-current text-foreground"
      : "border-transparent text-foreground/70 hover:border-border hover:text-foreground"
  }`;

export const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="font-display text-lg tracking-tight">
          L&apos;Altro Spazio
        </Link>

        <nav aria-label="Navigazione principale" className="hidden items-center gap-8 md:flex">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center border border-border text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Chiudi il menu" : "Apri il menu"}</span>
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Navigazione principale (mobile)" className="border-t border-border md:hidden">
          <ul className="flex flex-col">
            {primaryLinks.map((link) => (
              <li key={link.to} className="border-b border-border last:border-0">
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-11 items-center px-6 py-3 text-sm ${isActive ? "text-signal-current" : "text-foreground/80"}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
};
