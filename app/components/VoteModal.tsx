"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitVote, getActiveCafeteriasForVoting } from "@/app/actions/voting";

interface VoteModalProps {
  open: boolean;
  preselected?: string | null;
  onClose: () => void;
}

export default function VoteModal({ open, preselected, onClose }: VoteModalProps) {
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Elegir, 2: Calificar, 3: Éxito
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Data del servidor
  const [shops, setShops] = useState<any[]>([]);
  const [round, setRound] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("user");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Calificaciones
  const [exp, setExp] = useState<number>(0);
  const [pres, setPres] = useState<number>(0);
  const [cup, setCup] = useState<number>(0);

  const router = useRouter();

  // Fetch data on open
  useEffect(() => {
    if (open) {
      setStep(1);
      setExp(0);
      setPres(0);
      setCup(0);
      setErrorMsg("");
      setSelectedId(preselected || null);

      if (shops.length === 0) {
        setLoadingData(true);
        getActiveCafeteriasForVoting()
          .then((res) => {
            setShops(res.cafeterias);
            setRound(res.round);
            setUserRole(res.userRole);
            
            // Si hay preselected, saltamos directo al paso 2 si existe la cafetería
            if (preselected && res.cafeterias.some((c: any) => c.id === preselected)) {
              setStep(2);
            }
            
            setLoadingData(false);
          })
          .catch((err) => {
            console.error(err);
            setErrorMsg("Error al cargar las cafeterías.");
            setLoadingData(false);
          });
      } else {
        // Ya teníamos la data
        if (preselected && shops.some((c: any) => c.id === preselected)) {
          setStep(2);
        }
      }
    }
  }, [open, preselected, shops.length]); // eslint-disable-line

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleNextStep = () => {
    if (!selectedId) {
      setErrorMsg("Selecciona una cafetería primero.");
      return;
    }
    const shop = shops.find(s => s.id === selectedId);
    if (!shop || !shop.baristaId) {
      setErrorMsg("Esta cafetería no tiene un barista asignado para votar.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleVote = async () => {
    if (!selectedId || exp === 0 || pres === 0 || cup === 0) {
      setErrorMsg("Debes calificar todos los criterios antes de enviar tu voto.");
      return;
    }
    
    const shop = shops.find(s => s.id === selectedId);
    if (!shop) return;

    setLoadingSubmit(true);
    setErrorMsg("");
    
    const res = await submitVote(shop.id, shop.baristaId, {
      scoreExperience: exp,
      scorePresence: pres,
      scoreCup: cup
    });

    setLoadingSubmit(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setStep(3);
      setTimeout(() => {
        onClose();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }, 1500);
    }
  };

  const renderStars = (value: number, setValue: (v: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            className={`text-2xl transition-all ${value >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const renderR2Scale = (value: number, setValue: (v: number) => void) => {
    const options = [
      { v: 1, label: "Excelente" },
      { v: 2, label: "Varias veces al día" },
      { v: 3, label: "Moriré sin él" },
    ];
    return (
      <div className="flex flex-col gap-2 w-full">
        {options.map((opt) => (
          <button
            key={opt.v}
            type="button"
            onClick={() => setValue(opt.v)}
            className={`w-full text-left px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
              value === opt.v ? 'bg-[#9E3A52] text-white border-[#9E3A52]' : 'bg-white text-[#524345] border-[#D6C2C4] hover:bg-[#F8E8EA]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  };

  const selectedShop = shops.find(s => s.id === selectedId);
  const isVotingBlockedForRole = (round === 1 && (userRole === "user" || userRole === "juez_internacional")) || userRole === "cafeteria";

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

        .shop-opts{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:16px;max-height:300px;overflow-y:auto;padding-right:4px;}
        .sopt{background:#F8E8EA;border-radius:12px;padding:9px;display:flex;align-items:center;gap:8px;cursor:pointer;border:2px solid transparent;transition:all .2s}
        .sopt:hover{border-color:#9E3A52;background:#FFD9E2}
        .sopt.sel{border-color:#9E3A52;background:#FFD9E2}
        .sopt-img{width:46px;height:46px;border-radius:8px;background-size:cover;background-position:center;background-color:#ccc;flex-shrink:0}
        .sopt-name{font-family:'Barlow Condensed',sans-serif;font-size:.88rem;font-weight:900;text-transform:uppercase;color:#22191A}
        .sopt-loc{font-size:11px;color:#524345;font-family:'Barlow',sans-serif}

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
            <div className="mod-s">
              {round === 0 ? "Votaciones cerradas" : `Ronda ${round}`} 
              {selectedShop && !isVotingBlockedForRole ? ` · Evaluando a ${selectedShop.name}` : ""}
            </div>
          </div>

          {/* Body */}
          <div className="mod-body">
            {round !== 0 && !isVotingBlockedForRole && (
              <div className="vsteps">
                <div className={`vs ${step === 1 ? "curr" : "done"}`}>
                  <div className="vs-n">{step === 1 ? "1" : "✓"}</div>
                  <span>Elige</span>
                </div>
                <div className={`vsl${step > 1 ? " done" : ""}`} />
                <div className={`vs ${step === 2 ? "curr" : step > 2 ? "done" : "pend"}`}>
                  <div className="vs-n">{step > 2 ? "✓" : "2"}</div>
                  <span>Califica</span>
                </div>
                <div className={`vsl${step > 2 ? " done" : ""}`} />
                <div className={`vs ${step === 3 ? "curr" : "pend"}`}>
                  <div className="vs-n">3</div>
                  <span>Confirmación</span>
                </div>
              </div>
            )}

            {round === 0 && !loadingData && (
              <div className="text-center py-10 text-[#9E3A52] font-bold text-lg uppercase tracking-wide">
                Las votaciones se encuentran cerradas en este momento.
              </div>
            )}

            {isVotingBlockedForRole && !loadingData && (
              <div className="text-center py-10 text-[#9E3A52] font-bold text-lg uppercase tracking-wide flex flex-col gap-3">
                <span className="text-4xl">🔒</span>
                {userRole === "cafeteria" 
                  ? "Tu usuario no está habilitado para emitir votos." 
                  : "Las votaciones están temporalmente desactivadas para tu perfil en esta ronda."
                }
              </div>
            )}

            {round !== 0 && !isVotingBlockedForRole && step === 1 && (
              <div className="flex flex-col gap-4">
                <p className="font-sans text-sm text-[#524345]">Selecciona la cafetería por la que quieres votar:</p>
                
                {loadingData ? (
                  <div className="text-center py-10 text-[#9E3A52] font-bold">Cargando cafeterías...</div>
                ) : (
                  <div className="shop-opts">
                    {shops.map((s) => (
                      <div
                        key={s.id}
                        className={`sopt${selectedId === s.id ? " sel" : ""}`}
                        onClick={() => setSelectedId(s.id)}
                      >
                        <div className="sopt-img" style={{ backgroundImage: `url('${s.coverImage || '/background.webp'}')` }} />
                        <div>
                          <div className="sopt-name">{s.name}</div>
                          <div className="sopt-loc">📍 {s.neighborhood || "Panamá"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {errorMsg && (
                  <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm font-semibold text-center border border-red-200 mt-2">
                    {errorMsg}
                  </div>
                )}

                <button 
                  onClick={handleNextStep}
                  disabled={!selectedId}
                  className="mt-2 w-full py-3.5 rounded-xl bg-[#9E3A52] text-white font-bold uppercase tracking-wider hover:bg-[#3D0814] transition-colors disabled:opacity-50"
                >
                  Continuar →
                </button>
              </div>
            )}

            {round !== 0 && !isVotingBlockedForRole && step === 2 && selectedShop && (
              <div className="flex flex-col gap-5">
                <div className="bg-[#F8E8EA] p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-[#3D0814] uppercase text-xs tracking-wider mb-1">Barista Destacado</h3>
                    <p className="text-[#9E3A52] font-semibold text-lg leading-none">{selectedShop.baristaName || "No asignado"}</p>
                    <p className="text-[#524345] text-xs uppercase tracking-wider mt-1.5 border border-[#9E3A52]/30 inline-block px-2 py-0.5 rounded-md">
                      Cat: {selectedShop.competitionCategory || "General"}
                    </p>
                  </div>
                  {selectedShop.baristaPhoto && (
                    <div className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-[#9E3A52]/30" style={{ backgroundImage: `url('${selectedShop.baristaPhoto}')` }}></div>
                  )}
                </div>

                {errorMsg && (
                  <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm font-semibold text-center border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#524345] mb-2 uppercase tracking-wide">1. Experiencia General</p>
                    {round === 1 ? renderStars(exp, setExp) : renderR2Scale(exp, setExp)}
                  </div>
                  <hr className="border-[#D6C2C4]" />
                  <div>
                    <p className="text-sm font-bold text-[#524345] mb-2 uppercase tracking-wide">2. Presencia del Barista</p>
                    {round === 1 ? renderStars(pres, setPres) : renderR2Scale(pres, setPres)}
                  </div>
                  <hr className="border-[#D6C2C4]" />
                  <div>
                    <p className="text-sm font-bold text-[#524345] mb-2 uppercase tracking-wide">3. Calidad de la Taza</p>
                    {round === 1 ? renderStars(cup, setCup) : renderR2Scale(cup, setCup)}
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-shrink-0 px-4 py-3.5 rounded-xl bg-[#F2E2E4] text-[#524345] font-bold uppercase tracking-wider hover:bg-[#E8D0D3] transition-colors"
                  >
                    Volver
                  </button>
                  <button 
                    onClick={handleVote}
                    disabled={loadingSubmit}
                    className="flex-1 py-3.5 rounded-xl bg-[#9E3A52] text-white font-bold uppercase tracking-wider hover:bg-[#3D0814] transition-colors disabled:opacity-50"
                  >
                    {loadingSubmit ? "Enviando..." : "Enviar Voto Irreversible"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>☕</div>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.3rem", fontWeight: 900, textTransform: "uppercase", color: "#3D0814" }}>
                  ¡Tu voto fue registrado!
                </p>
                <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#524345" }}>
                  Gracias por participar en Coffee Geeks 2025.
                </p>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${showToast ? " show" : ""}`}>
        ¡Voto registrado con éxito! ☕
      </div>
    </>
  );
}
