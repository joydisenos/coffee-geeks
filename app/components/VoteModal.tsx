"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SHOPS = [
  { id: "kotowa", name: "Kotowa", sub: "Coffee House", loc: "La Chorrera | Costa Verde", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=75" },
  { id: "tosto",  name: "Tosto",  sub: "Coffee Co.", loc: "San Francisco | Panamá",  img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=75" },
  { id: "tonos",  name: "Toño's", sub: "Café Bakery", loc: "Colón | Margarita",       img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=75" },
  { id: "unido",  name: "Unido",  sub: "Panama Coffee Roasters", loc: "Casco Viejo | Panamá", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=75" },
  { id: "radisson", name: "Radisson", sub: "Café & Lobby Bar", loc: "Paitilla | Panamá", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=75" },
  { id: "origin", name: "Origin", sub: "Specialty Coffee", loc: "Boquete | Chiriquí",    img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&q=75" },
];

interface VoteModalProps {
  open: boolean;
  preselected?: string | null;
  onClose: () => void;
}

export default function VoteModal({ open, preselected, onClose }: VoteModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  // sync preselected when modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setSelected(preselected ?? null);
    }
  }, [open, preselected]);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleVote = () => {
    if (!selected) return;
    setStep(2);
    // Simulate submit → go to step 2 then toast
    setTimeout(() => {
      onClose();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const handleViewProfile = () => {
    if (!selected) return;
    onClose();
    router.push(`/participantes/${selected}`);
  };

  return (
    <>
      <style>{`
        .ov{position:fixed;inset:0;z-index:500;background:rgba(26,8,8,.72);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:18px;opacity:0;pointer-events:none;transition:opacity .25s}
        .ov.open{opacity:1;pointer-events:all}
        .mod{background:#FFFFFF;border-radius:28px;width:100%;max-width:560px;overflow:hidden;transform:translateY(22px);transition:transform .28s;box-shadow:0 24px 60px rgba(26,8,8,.3)}
        .ov.open .mod{transform:translateY(0)}
        .mod-hd{background:#3D0814;padding:20px 24px 16px;position:relative}
        .mod-x{position:absolute;top:13px;right:13px;width:28px;height:28px;border:none;background:rgba(255,255,255,.12);border-radius:50%;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:background .2s}
        .mod-x:hover{background:rgba(255,255,255,.22)}
        .mod-t{font-family:'Barlow Condensed',sans-serif;font-size:1.4rem;font-weight:900;text-transform:uppercase;color:#fff}
        .mod-s{font-size:13px;color:rgba(255,255,255,.45);margin-top:1px;font-family:'Barlow',sans-serif}
        .mod-body{padding:20px 24px}
        .vsteps{display:flex;align-items:center;gap:0;margin-bottom:20px}
        .vs{display:flex;align-items:center;gap:6px;font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;flex:1}
        .vs-n{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;flex-shrink:0}
        .vs.curr .vs-n{background:#C4D4E8;color:#3D0814}
        .vs.done .vs-n{background:#9E3A52;color:#fff}
        .vs.pend .vs-n{background:#F2E2E4;color:#524345}
        .vs.curr span,.vs.done span{color:#22191A}
        .vs.pend span{color:#524345}
        .vsl{flex:1;height:2px;background:#D6C2C4}
        .vs.done+.vsl{background:#9E3A52}
        .shop-opts{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:16px}
        .sopt{background:#F8E8EA;border-radius:12px;padding:9px;display:flex;align-items:center;gap:8px;cursor:pointer;border:2px solid transparent;transition:all .2s}
        .sopt:hover{border-color:#9E3A52;background:#FFD9E2}
        .sopt.sel{border-color:#9E3A52;background:#FFD9E2}
        .sopt-img{width:46px;height:46px;border-radius:8px;background-size:cover;background-position:center;flex-shrink:0}
        .sopt-name{font-family:'Barlow Condensed',sans-serif;font-size:.88rem;font-weight:900;text-transform:uppercase;color:#22191A}
        .sopt-loc{font-size:11px;color:#524345;font-family:'Barlow',sans-serif}
        .mod-ft{padding:0 24px 20px;display:flex;gap:8px}
        .mbtn{flex:1;height:40px;border-radius:50px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:.82rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s}
        .mbp{background:#9E3A52;color:#fff}
        .mbp:hover{filter:brightness(1.1)}
        .mbp:disabled{opacity:.4;cursor:not-allowed}
        .mbs{background:#F2E2E4;color:#524345}
        .mbs:hover{background:#F8E8EA}
        .toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(38px);z-index:600;background:#9E3A52;color:#fff;padding:10px 22px;border-radius:50px;font-family:'Barlow Condensed',sans-serif;font-size:.82rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 4px 8px 3px rgba(0,0,0,.1);opacity:0;transition:all .3s;pointer-events:none;white-space:nowrap}
        .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
        @media(max-width:520px){.shop-opts{grid-template-columns:1fr}}
      `}</style>

      {/* Modal overlay */}
      <div className={`ov${open ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="mod" role="dialog" aria-modal="true" aria-label="Votar">
          {/* Header */}
          <div className="mod-hd">
            <button className="mod-x" onClick={onClose} aria-label="Cerrar">✕</button>
            <div className="mod-t">Emitir mi voto</div>
            <div className="mod-s">Tu voto vale 30% del puntaje final · Cierra 23 Abril 2026</div>
          </div>

          {/* Body */}
          <div className="mod-body">
            {/* Stepper */}
            <div className="vsteps">
              <div className={`vs ${step === 1 ? "curr" : "done"}`}>
                <div className="vs-n">{step === 1 ? "1" : "✓"}</div>
                <span>Elige</span>
              </div>
              <div className={`vsl${step > 1 ? " done" : ""}`} />
              <div className={`vs ${step === 2 ? "curr" : "pend"}`}>
                <div className="vs-n">2</div>
                <span>Confirma</span>
              </div>
              <div className="vsl" />
              <div className="vs pend">
                <div className="vs-n">3</div>
                <span>Registro</span>
              </div>
            </div>

            {step === 1 && (
              <>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#524345", marginBottom: 12 }}>
                  Selecciona la cafetería por la que quieres votar:
                </p>
                <div className="shop-opts">
                  {SHOPS.map((s) => (
                    <div
                      key={s.id}
                      className={`sopt${selected === s.id ? " sel" : ""}`}
                      onClick={() => setSelected(s.id)}
                    >
                      <div className="sopt-img" style={{ backgroundImage: `url('${s.img}')` }} />
                      <div>
                        <div className="sopt-name">{s.name}</div>
                        <div className="sopt-loc">{s.loc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>☕</div>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase", color: "#3D0814" }}>
                  Procesando tu voto...
                </p>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#524345" }}>
                  Esto tomará un momento
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {step === 1 && (
            <div className="mod-ft">
              <button className="mbtn mbs" onClick={handleViewProfile} disabled={!selected}>
                Ver perfil
              </button>
              <button className="mbtn mbp" onClick={handleVote} disabled={!selected}>
                Votar →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${showToast ? " show" : ""}`}>
        ¡Voto registrado con éxito! ☕
      </div>
    </>
  );
}
