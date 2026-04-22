"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import VoteModal from "@/app/components/VoteModal";

const RANKING = [
  { pos: 1, tier: "g", posLabel: "1er",  id: "kotowa",   name: "Kotowa",    sub: "Coffee House",          cat: "Coffee",  loc: "La Chorrera | Costa Verde", votes: 175, img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75" },
  { pos: 2, tier: "s", posLabel: "2do",  id: "tosto",    name: "Tosto",     sub: "Coffee Co.",             cat: "Coffee",  loc: "San Francisco | Panamá",    votes: 162, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=75" },
  { pos: 3, tier: "b", posLabel: "3er",  id: "tonos",    name: "Toño's",    sub: "Café Bakery",            cat: "Rest",    loc: "Colón | Margarita",         votes: 148, img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=75" },
  { pos: 4, tier: "d", posLabel: "4",    id: "unido",    name: "Unido",     sub: "Panama Coffee Roasters", cat: "Coffee",  loc: "Casco Viejo | Panamá",      votes: 134, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=75" },
  { pos: 5, tier: "d", posLabel: "5",    id: "radisson", name: "Radisson",  sub: "Café & Lobby Bar",       cat: "Hotel",   loc: "Paitilla | Panamá",         votes: 118, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75" },
  { pos: 6, tier: "d", posLabel: "6",    id: "origin",   name: "Origin",    sub: "Specialty Coffee",       cat: "Coffee",  loc: "Boquete | Chiriquí",        votes: 96,  img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=75" },
  { pos: 7, tier: "d", posLabel: "7",    id: "pergamino",name: "Pergamino", sub: "Brew Bar",               cat: "Especialidad", loc: "Casco Viejo | Panamá", votes: 82,  img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=75" },
];

const TIER_COLORS: Record<string, string> = {
  g: "#C9A227",
  s: "#9EB0BE",
  b: "#C46A28",
  d: "#9E3A52",
};

export default function VotacionesPage() {
  const [voteModal, setVoteModal] = useState<{ open: boolean; preselected?: string }>({ open: false });

  const openVote = (id?: string) => setVoteModal({ open: true, preselected: id });
  const closeVote = () => setVoteModal({ open: false });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .ph{position:relative;padding-top:58px}
        .ph-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.18}
        .ph-sc{position:absolute;inset:0;background:linear-gradient(to bottom,#3D0814 0%,rgba(61,8,20,.7) 100%)}
        .ph-sello{position:absolute;right:clamp(20px,5vw,60px);top:72px;width:84px;height:84px;opacity:.55;animation:spin3 28s linear infinite}
        @keyframes spin3{to{transform:rotate(360deg)}}
        .ph-cnt{position:relative;z-index:2;padding:44px 0 44px}
        .ph-eye{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(196,212,232,.7);margin-bottom:10px}
        .ph-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,6vw,64px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92;margin-bottom:4px}
        .ph-h2{font-family:'Barlow Condensed',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:400;text-transform:uppercase;color:rgba(196,212,232,.55)}
        .bread{background:#5C0E20;border-bottom:1px solid rgba(255,255,255,.06)}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:rgba(255,255,255,.45);transition:color .2s;text-decoration:none}
        .bread-i a:hover{color:#fff}
        .bread-i span{color:rgba(255,255,255,.25)}

        .rk-page{padding:44px 0 64px;background:#F5F0E4}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .eyebrow-row{display:flex;align-items:center;gap:9px;margin-bottom:6px;justify-content:center}
        .eyebrow-line{width:24px;height:2px;background:#9E3A52;flex-shrink:0}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#9E3A52}

        /* Ranking rows */
        .rkr{background:#fff;border-radius:16px;overflow:hidden;display:flex;align-items:stretch;box-shadow:0 1px 2px rgba(0,0,0,.12),0 1px 3px 1px rgba(0,0,0,.08);transition:box-shadow .2s,transform .2s;cursor:pointer;border:1px solid #D6C2C4;margin-bottom:9px}
        .rkr:hover{box-shadow:0 4px 8px 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.12);transform:translateX(3px)}
        .rkr-g{border-left:4px solid #C9A227}
        .rkr-s{border-left:4px solid #9EB0BE}
        .rkr-b{border-left:4px solid #C46A28}
        .rkr-d{border-left:4px solid #9E3A52}
        .rkr-photo{width:170px;flex-shrink:0;background-size:cover;background-position:center}
        .rkr-logo{width:115px;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:10px;background:rgba(92,14,32,.03);border-right:1px solid #D6C2C4}
        .rkr-logo-i{width:86px;height:54px;background:#F8E8EA;border-radius:8px;display:flex;align-items:center;justify-content:center}
        .rkr-info{flex:1;padding:13px 16px;display:flex;flex-direction:column;justify-content:center}
        .rkr-name{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:900;text-transform:uppercase;color:#22191A;margin-bottom:1px}
        .rkr-sub{font-family:'Barlow Condensed',sans-serif;font-size:.72rem;font-weight:700;text-transform:uppercase;color:#9E3A52;margin-bottom:6px}
        .rkr-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .rkr-cat{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#524345;font-family:'Barlow',sans-serif}
        .rkr-loc{display:flex;align-items:center;gap:3px;font-size:11px;color:#524345;font-family:'Barlow',sans-serif}
        .rkr-ver{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9E3A52;text-decoration:underline;cursor:pointer;margin-top:4px;display:inline-block;transition:opacity .2s}
        .rkr-ver:hover{opacity:.7}
        .rkr-right{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:13px 14px;gap:9px;background:rgba(92,14,32,.03);border-left:1px solid #D6C2C4;min-width:115px}
        .rkr-pn{font-family:'Barlow Condensed',sans-serif;font-size:1.9rem;font-weight:900;line-height:1}
        .rkr-pl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-family:'Barlow',sans-serif}
        .rkr-btn{width:100%;height:32px;border-radius:50px;border:none;background:#9E3A52;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:.74rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s;white-space:nowrap}
        .rkr-btn:hover{filter:brightness(1.1)}
        .load-btn{height:40px;padding:0 24px;border-radius:50px;border:1px solid #857375;background:transparent;color:#9E3A52;font-family:'Barlow',sans-serif;font-size:14px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
        .load-btn:hover{background:#9E3A52;color:#fff;border-color:#9E3A52}
        @media(max-width:960px){.rkr-photo{width:110px}}
        @media(max-width:640px){.rkr-photo{display:none}}
      `}</style>

      <Navbar />

      {/* Page Hero */}
      <div className="ph">
        <div className="ph-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1800&q=75')" }} />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">Temporada 2026</div>
            <h1 className="ph-h1">Votar Ahora</h1>
            <h2 className="ph-h2">Mi Cafetería Preferida</h2>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/home">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "rgba(255,255,255,.3)", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>Votaciones</span>
          </div>
        </div>
      </div>

      {/* Ranking list */}
      <main className="rk-page">
        <div className="wrap">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="eyebrow-row">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">24 cafeterías compiten por el mejor café</span>
              <div className="eyebrow-line" />
            </div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, textTransform: "uppercase", color: "#22191A", lineHeight: ".92" }}>Los Protagonistas</h2>
            <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 700, textTransform: "uppercase", color: "#524345", marginTop: 2 }}>de la Ruta del Café</h3>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#524345", marginTop: 6 }}>
              El voto del público vale 30% del puntaje final · Cierre 23 Abril 2026
            </p>
          </div>

          {/* Ranking rows */}
          {RANKING.map((r) => (
            <div
              key={r.id}
              className={`rkr rkr-${r.tier}`}
              onClick={() => {}} // navigate on click row (optional)
            >
              {/* Photo */}
              <div className="rkr-photo" style={{ backgroundImage: `url('${r.img}')` }} />

              {/* Logo placeholder */}
              <div className="rkr-logo">
                <div className="rkr-logo-i">
                  <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, stroke: "#9E3A52", fill: "none", strokeWidth: 1.5 }}>
                    <path d="M17 8h1a4 4 0 0 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" />
                  </svg>
                </div>
              </div>

              {/* Info */}
              <div className="rkr-info">
                <div className="rkr-name">{r.name}</div>
                <div className="rkr-sub">{r.sub}</div>
                <div className="rkr-meta">
                  <span className="rkr-cat">{r.cat}</span>
                  <span className="rkr-loc">
                    <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: "#524345", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {r.loc}
                  </span>
                </div>
                <Link href={`/participantes/${r.id}`} className="rkr-ver" onClick={(e) => e.stopPropagation()}>
                  VER FICHA →
                </Link>
              </div>

              {/* Right: rank + vote */}
              <div className="rkr-right">
                <div>
                  <div className="rkr-pn" style={{ color: TIER_COLORS[r.tier] }}>{r.posLabel}</div>
                  <div className="rkr-pl" style={{ color: r.tier === "d" ? "#524345" : TIER_COLORS[r.tier] }}>
                    {r.tier === "d" ? "Puesto" : "Lugar"}
                  </div>
                </div>
                <button
                  className="rkr-btn"
                  onClick={(e) => { e.stopPropagation(); openVote(r.id); }}
                >
                  Votar ahora
                </button>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: 22 }}>
            <Link href="/participantes" className="load-btn">
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><polyline points="15 18 9 12 15 6" /></svg>
              Ver todos los participantes
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <VoteModal
        open={voteModal.open}
        preselected={voteModal.preselected}
        onClose={closeVote}
      />
    </>
  );
}
