"use client";

import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function AcademiaPage() {
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

        .main-page{padding:44px 0 64px;background:#F5F0E4;min-height:400px}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .eyebrow-row{display:flex;align-items:center;gap:9px;margin-bottom:6px;justify-content:center}
        .eyebrow-line{width:24px;height:2px;background:#9E3A52;flex-shrink:0}
        .eyebrow-text{font-family:'Barlow',sans-serif;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#9E3A52}
      `}</style>

      <Navbar />

      {/* Page Hero */}
      <div className="ph">
        <div className="ph-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&q=75')" }} />
        <div className="ph-sc" />
        <div className="ph-cnt">
          <div className="wrap">
            <div className="ph-eye">Conocimiento y Pasión</div>
            <h1 className="ph-h1">Academia</h1>
            <h2 className="ph-h2">Aprende con los expertos</h2>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/home">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "rgba(255,255,255,.3)", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>Academia</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="main-page">
        <div className="wrap">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="eyebrow-row">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Formación profesional y para aficionados</span>
              <div className="eyebrow-line" />
            </div>
            <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, textTransform: "uppercase", color: "#22191A", lineHeight: ".92" }}>Nuestros Cursos</h2>
            <h3 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 700, textTransform: "uppercase", color: "#524345", marginTop: 2 }}>Próximamente disponibles</h3>
            <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14, color: "#524345", marginTop: 6, maxWidth: "600px", margin: "6px auto 0" }}>
              Estamos preparando los mejores contenidos y talleres para que lleves tu pasión por el café al siguiente nivel.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
