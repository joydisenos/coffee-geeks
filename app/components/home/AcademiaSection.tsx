const FEATS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#9E3A52", fill: "none", strokeWidth: 2 }}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Fundamentos del Barista",
    desc: "Técnicas de extracción y molienda",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#9E3A52", fill: "none", strokeWidth: 2 }}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Maestría en Filtrados",
    desc: "V60, Chemex, Aeropress y más",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: "#9E3A52", fill: "none", strokeWidth: 2 }}>
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Arte Latte Avanzado",
    desc: "Certificación con respaldo SCA",
  },
];

export default function AcademiaSection() {
  return (
    <>
      <style>{`
        .acad-sec { background: #FEF0F1; padding: 80px 0; }
        .acad-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px); }
        .acad-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 56px; align-items: center; }
        .acad-img-wrap { background: linear-gradient(135deg, #5C0E20 0%, #3D0814 60%, #1A0808 100%); border-radius: 20px; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 340px; position: relative; overflow: hidden; }
        .acad-img-wrap::before { content: ''; position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800') center/cover; opacity: .12; }
        .acad-char { width: 140px; height: auto; object-fit: contain; position: relative; z-index: 1; }
        .acad-badge { position: relative; z-index: 1; margin-top: 16px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15); border-radius: 50px; padding: 6px 16px; }
        .acad-badge span { font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: rgba(255,255,255,.65); }
        .eyebrow-dark2 { display: flex; align-items: center; gap: 9px; margin-bottom: 9px; }
        .eyebrow-line-d2 { width: 24px; height: 2px; background: #9E3A52; flex-shrink: 0; }
        .eyebrow-text-d2 { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: #9E3A52; }
        .acad-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(28px,4vw,42px); font-weight: 900; text-transform: uppercase; color: #22191A; line-height: .92; margin-bottom: 12px; }
        .acad-title .acc { color: #9E3A52; }
        .acad-text p { font-family: 'Barlow', sans-serif; font-size: 16px; color: #524345; line-height: 1.7; margin-bottom: 20px; }
        .acad-feats { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
        .af { display: flex; align-items: flex-start; gap: 10px; }
        .af-ico { width: 30px; height: 30px; background: rgba(158,58,82,.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
        .af-t { font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 600; color: #22191A; }
        .af-s { font-family: 'Barlow', sans-serif; font-size: 13px; color: #857375; }
        .btn-tonal { height: 40px; padding: 0 24px; border-radius: 50px; border: none; background: #F2E2E4; color: #9E3A52; font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all .2s; }
        .btn-tonal:hover { background: #9E3A52; color: #fff; }
        @media (max-width: 800px) {
          .acad-grid { grid-template-columns: 1fr; }
          .acad-img-wrap { min-height: 220px; }
        }
      `}</style>

      <section className="acad-sec">
        <div className="acad-wrap">
          <div className="acad-grid">
            {/* Image side */}
            <div>
              <div className="acad-img-wrap">
                <img className="acad-char" src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80" alt="Barista" />
                <div className="acad-badge">
                  <span>Specialty Coffee Academy</span>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div className="acad-text">
              <div className="eyebrow-dark2">
                <div className="eyebrow-line-d2" />
                <span className="eyebrow-text-d2">Academia CGP</span>
              </div>
              <h2 className="acad-title">El conocimiento<br /><span className="acc">detrás de la taza</span></h2>
              <p>Formamos a la próxima generación de líderes de la industria cafetera. Módulos bajo estándares internacionales SCA.</p>

              <div className="acad-feats">
                {FEATS.map((f) => (
                  <div className="af" key={f.title}>
                    <div className="af-ico">{f.icon}</div>
                    <div>
                      <div className="af-t">{f.title}</div>
                      <div className="af-s">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-tonal">Más información →</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
