"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Descúbrenos", href: "/home" },
  { label: "Participantes", href: "/participantes" },
  { label: "Academia", href: "/academia" },
  { label: "Votaciones", href: "/votaciones" },
  { label: "Tienda", href: "/tienda" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .tbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: #3D0814;
          transition: box-shadow .3s;
        }
        .tbar.up { box-shadow: 0 4px 8px 3px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.12); }
        .tbar-i { display: flex; align-items: stretch; height: 58px; }
        .tb-brand {
          display: flex; align-items: center; gap: 10px;
          padding: 0 18px 0 24px; background: #5C0E20; flex-shrink: 0;
          cursor: pointer; border-right: 1px solid rgba(255,255,255,.07);
          transition: background .2s; text-decoration: none;
        }
        .tb-brand:hover { background: #8B1A30; }
        .tb-brand img { height: 30px; width: auto; }
        .tb-bname {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: .9rem; font-weight: 700; color: #fff;
          text-transform: uppercase; letter-spacing: .04em;
          line-height: 1; display: flex; flex-direction: column;
        }
        .tb-bname small { font-size: .55rem; font-weight: 400; letter-spacing: .2em; opacity: .5; line-height: 1.4; }
        .tb-nav { flex: 1; display: flex; align-items: center; justify-content: center; gap: 2px; padding: 0 8px; }
        .tb-a {
          font-family: 'Barlow', sans-serif; font-size: .74rem; font-weight: 500;
          letter-spacing: .08em; text-transform: uppercase;
          color: rgba(255,255,255,.5); padding: 6px 13px;
          border-radius: 50px; transition: all .2s;
          cursor: pointer; text-decoration: none; user-select: none;
        }
        .tb-a:hover { color: rgba(255,255,255,.9); background: rgba(255,255,255,.07); }
        .tb-a.active { color: #C4D4E8; background: rgba(196,212,232,.12); }
        .tb-act { display: flex; align-items: center; gap: 4px; padding: 0 18px 0 8px; }
        .ibtn {
          width: 38px; height: 38px; border-radius: 50px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.08); color: rgba(255,255,255,.75);
          cursor: pointer; transition: background .15s; border: none;
          position: relative; overflow: hidden;
        }
        .ibtn:hover { background: rgba(255,255,255,.15); }
        .btn-vote {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          height: 32px; padding: 0 14px; border-radius: 50px;
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500;
          background: #C4D4E8; color: #3D0814; border: none;
          cursor: pointer; transition: all .2s; white-space: nowrap;
        }
        .btn-vote:hover { background: #8AAFD4; color: #fff; }
        @media (max-width: 640px) {
          .tb-nav { display: none; }
        }
      `}</style>

      <nav className={`tbar${scrolled ? " up" : ""}`}>
        <div className="tbar-i">
          {/* Brand */}
          <Link href="/home" className="tb-brand">
            <img src="/logo.webp" alt="CGP" style={{ height: 30 }} />
            <div className="tb-bname">
              Coffee Geeks
              <small>Panamá</small>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="tb-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`tb-a${pathname === link.href ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="tb-act">
            {/* Search */}
            <button className="ibtn" aria-label="Buscar">
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "rgba(255,255,255,.75)", fill: "none", strokeWidth: 1.5 }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* User */}
            <button className="ibtn" aria-label="Mi cuenta">
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "rgba(255,255,255,.75)", fill: "none", strokeWidth: 1.5 }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>

            {/* Vote CTA */}
            <button className="btn-vote">
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "currentColor", fill: "none", strokeWidth: 2.5, flexShrink: 0 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Votar ahora
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
