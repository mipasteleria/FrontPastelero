import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Player propio de cursos — Shaka Player (DASH; HLS nativo en iOS/Safari)
 * con skin sobrio de la marca. Controles: play/pausa, barra con marcadores
 * de capítulo, tiempo, volumen, calidad (auto/360/720/1080), captions,
 * capítulos, Picture-in-Picture y pantalla completa.
 *
 * props:
 *   src        { dash, hls }  (rutas de /video-stream firmadas, relativas al API)
 *   poster     url del thumbnail elegido
 *   captionsUrl .vtt opcional
 *   capitulos  [{ titulo, segundos }]
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const fmt = (s) => {
  if (!isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
};

export default function VideoPlayer({ src, poster, captionsUrl, capitulos = [] }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1);
  const [ccOn, setCcOn] = useState(false);
  const [menu, setMenu] = useState(null); // "calidad" | "capitulos" | null
  const [tracks, setTracks] = useState([]);
  const [calidad, setCalidad] = useState("auto");
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef(null);

  // ── Cargar Shaka (solo cliente) ──────────────────────────────────
  useEffect(() => {
    let destroyed = false;
    (async () => {
      const video = videoRef.current;
      if (!video || !src) return;
      const dashUrl = `${API_BASE}${src.dash}`;
      const hlsUrl = `${API_BASE}${src.hls}`;

      // iOS/Safari: HLS nativo.
      const nativo = video.canPlayType("application/vnd.apple.mpegurl");
      if (nativo && !window.MediaSource) {
        video.src = hlsUrl;
        setReady(true);
        return;
      }
      const shaka = (await import("shaka-player")).default;
      shaka.polyfill.installAll();
      if (!shaka.Player.isBrowserSupported()) { video.src = hlsUrl; setReady(true); return; }
      const player = new shaka.Player();
      await player.attach(video);
      playerRef.current = player;
      player.configure({ abr: { enabled: true } });
      try {
        await player.load(dashUrl);
        if (destroyed) return;
        const vts = player.getVariantTracks().filter((x) => x.height).sort((a, b) => b.height - a.height);
        const alturas = [...new Set(vts.map((x) => x.height))];
        setTracks(alturas);
        setReady(true);
      } catch (e) {
        console.error("Shaka load:", e);
        video.src = hlsUrl; // fallback
        setReady(true);
      }
    })();
    return () => { destroyed = true; playerRef.current?.destroy?.(); };
  }, [src]);

  // ── Estado del <video> ───────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setT(v.currentTime);
    const onDur = () => setDur(v.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("durationchange", onDur);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("durationchange", onDur);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [ready]);

  // Auto-ocultar controles durante reproducción.
  const poke = useCallback(() => {
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 2800);
  }, []);
  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const toggle = () => { const v = videoRef.current; v && (v.paused ? v.play() : v.pause()); };
  const seekTo = (seg) => { const v = videoRef.current; if (v) v.currentTime = seg; };
  const setCalidadFn = (h) => {
    const p = playerRef.current;
    setCalidad(h);
    setMenu(null);
    if (!p) return;
    if (h === "auto") { p.configure({ abr: { enabled: true } }); return; }
    p.configure({ abr: { enabled: false } });
    const track = p.getVariantTracks().find((x) => x.height === h);
    if (track) p.selectVariantTrack(track, true);
  };
  const toggleCc = () => {
    const v = videoRef.current;
    if (!v?.textTracks?.length) return;
    const next = !ccOn;
    for (const tr of v.textTracks) tr.mode = next ? "showing" : "hidden";
    setCcOn(next);
  };
  const pip = async () => {
    const v = videoRef.current;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch {}
  };
  const fs = () => {
    const w = wrapRef.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else w?.requestFullscreen?.();
  };

  const pct = dur ? (t / dur) * 100 : 0;
  const capActual = [...capitulos].reverse().find((c) => t >= c.segundos);

  return (
    <div ref={wrapRef} onMouseMove={poke} onTouchStart={poke}
      style={{ position: "relative", background: "#1a0510", borderRadius: 16, overflow: "hidden", aspectRatio: "16/9" }}>
      <video ref={videoRef} poster={poster ? poster : undefined} playsInline crossOrigin="anonymous"
        onClick={toggle} style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}>
        {captionsUrl && <track kind="subtitles" srcLang="es" label="Español" src={captionsUrl} default={false} />}
      </video>

      {/* Play grande al centro */}
      {!playing && ready && (
        <button onClick={toggle} aria-label="Reproducir"
          style={{ position: "absolute", inset: 0, margin: "auto", width: 72, height: 72, borderRadius: "50%", border: "none", background: "rgba(255,111,125,.92)", color: "#fff", fontSize: 26, cursor: "pointer", boxShadow: "0 8px 24px rgba(84,0,39,.4)" }}>▶</button>
      )}

      {/* Controles */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "28px 14px 10px", background: "linear-gradient(transparent, rgba(26,5,16,.88))", opacity: visible || !playing ? 1 : 0, transition: "opacity .25s", pointerEvents: visible || !playing ? "auto" : "none" }}>
        {/* Barra de progreso con marcadores de capítulo */}
        <div style={{ position: "relative", height: 16, display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seekTo(((e.clientX - r.left) / r.width) * dur);
          }}>
          <div style={{ position: "absolute", left: 0, right: 0, height: 5, borderRadius: 3, background: "rgba(255,255,255,.25)" }} />
          <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 5, borderRadius: 3, background: "#FF6F7D" }} />
          {capitulos.map((c, i) => dur > 0 && (
            <span key={i} title={c.titulo}
              style={{ position: "absolute", left: `${(c.segundos / dur) * 100}%`, width: 3, height: 9, background: "#FFE99B", borderRadius: 2, transform: "translateX(-1px)" }} />
          ))}
          <span style={{ position: "absolute", left: `calc(${pct}% - 6px)`, width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, color: "#FFE2E7", fontSize: 13, fontFamily: "var(--font-nunito, sans-serif)" }}>
          <Btn onClick={toggle}>{playing ? "❚❚" : "▶"}</Btn>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(t)} / {fmt(dur)}</span>
          {capActual && <span style={{ opacity: .8, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>· {capActual.titulo}</span>}
          <span style={{ flex: 1 }} />
          <input type="range" min="0" max="1" step="0.05" value={vol} aria-label="Volumen"
            onChange={(e) => { const v = Number(e.target.value); setVol(v); if (videoRef.current) videoRef.current.volume = v; }}
            style={{ width: 70, accentColor: "#FF6F7D" }} />
          {captionsUrl && <Btn onClick={toggleCc} active={ccOn} title="Subtítulos">CC</Btn>}
          {capitulos.length > 0 && <Btn onClick={() => setMenu(menu === "capitulos" ? null : "capitulos")} title="Capítulos">☰</Btn>}
          {tracks.length > 0 && <Btn onClick={() => setMenu(menu === "calidad" ? null : "calidad")} title="Calidad">{calidad === "auto" ? "HD·auto" : `${calidad}p`}</Btn>}
          <Btn onClick={pip} title="Picture in Picture">⧉</Btn>
          <Btn onClick={fs} title="Pantalla completa">⛶</Btn>
        </div>
      </div>

      {/* Menús */}
      {menu === "calidad" && (
        <Menu onClose={() => setMenu(null)}>
          <MenuItem sel={calidad === "auto"} onClick={() => setCalidadFn("auto")}>Automática</MenuItem>
          {tracks.map((h) => <MenuItem key={h} sel={calidad === h} onClick={() => setCalidadFn(h)}>{h}p{h >= 1080 ? " · Monitor" : h >= 720 ? " · Tablet" : " · Móvil"}</MenuItem>)}
        </Menu>
      )}
      {menu === "capitulos" && (
        <Menu onClose={() => setMenu(null)}>
          {capitulos.map((c, i) => (
            <MenuItem key={i} onClick={() => { seekTo(c.segundos); setMenu(null); }}>
              <span style={{ color: "#FFA1AA", marginRight: 8, fontVariantNumeric: "tabular-nums" }}>{fmt(c.segundos)}</span>{c.titulo || `Capítulo ${i + 1}`}
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  );
}

function Btn({ children, onClick, active, title }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background: active ? "#FF6F7D" : "transparent", border: "none", color: active ? "#fff" : "#FFE2E7", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "4px 7px", borderRadius: 6 }}>
      {children}
    </button>
  );
}

function Menu({ children, onClose }) {
  return (
    <div onMouseLeave={onClose}
      style={{ position: "absolute", right: 12, bottom: 58, background: "rgba(26,5,16,.96)", border: "1px solid rgba(255,161,170,.3)", borderRadius: 12, padding: 6, minWidth: 170, maxHeight: 240, overflowY: "auto", zIndex: 5 }}>
      {children}
    </div>
  );
}

function MenuItem({ children, onClick, sel }) {
  return (
    <button onClick={onClick}
      style={{ display: "block", width: "100%", textAlign: "left", background: sel ? "rgba(255,111,125,.25)" : "transparent", border: "none", color: "#FFE2E7", fontSize: 13, padding: "7px 10px", borderRadius: 8, cursor: "pointer" }}>
      {children}
    </button>
  );
}
