"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { familyColor, moleculeById, molecules, processById, processes, type Molecule, type ProcessPlane, type ProcessStep, type Vec3 } from "./universe-data";

type Camera = { focus: Vec3; yaw: number; pitch: number; distance: number };
type Projected = { x: number; y: number; z: number; scale: number; id: string; r: number };

const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
const mix3 = (a: Vec3, b: Vec3, n: number): Vec3 => [lerp(a[0], b[0], n), lerp(a[1], b[1], n), lerp(a[2], b[2], n)];
const add3 = (a: Vec3, b: Vec3, n = 1): Vec3 => [a[0] + b[0] * n, a[1] + b[1] * n, a[2] + b[2] * n];
const relatedProcesses = (id: string | null) => {
  if (!id) return [];
  const conceptualBridges: Record<string, string[]> = { oaa: ["fatty-synthesis", "urea"] };
  return processes.filter((process) => process.nodeIds.includes(id) || conceptualBridges[id]?.includes(process.id));
};

function buildEdges() {
  const seen = new Set<string>();
  return processes.flatMap((process) => (process.steps ?? process.nodeIds.map((id, index) => ({ from: id, to: process.nodeIds[index + 1] ?? (process.layout === "cycle" ? process.nodeIds[0] : ""), enzyme: "", reaction: "" }))).map((step) => {
    if (!step.to || step.from === step.to) return null;
    const key = [step.from, step.to].sort().join("|");
    if (seen.has(key)) return null;
    seen.add(key);
    return [step.from, step.to] as const;
  })).filter((edge): edge is readonly [string, string] => Boolean(edge));
}

const worldEdges = buildEdges();
const graphFontScales = [0.82, 0.96, 1.1, 1.28, 1.48];
const drawerFontScales = [0.9, 1, 1.12, 1.26, 1.42];
const familyInnerTextColor: Record<Molecule["family"], string> = {
  carbon: "#244f82",
  nitrogen: "#503c8f",
  energy: "#7a5310",
  enzyme: "#87392e",
  cell: "#1f6f52",
};

function canvasLabel(molecule: Molecule, mode: "symbol" | "chinese") {
  return mode === "chinese" ? molecule.label : molecule.symbol;
}

function compactLabelLines(label: string) {
  if (label.length <= 8) return [label];
  const chunks = label.match(/.{1,8}/g) ?? [label];
  if (chunks.length <= 2) return chunks;
  return [chunks[0], `${chunks[1].slice(0, 7)}…`];
}

function PathwayView({ process, enteredFrom, onMolecule, onClose }: { process: ProcessPlane; enteredFrom: string; onMolecule: (id: string) => void; onClose: () => void }) {
  const pathwayNodeIds = process.nodeIds.includes(enteredFrom) ? process.nodeIds : [enteredFrom, ...process.nodeIds];
  const classicLayouts: Record<string, Record<string, [number, number]>> = {
    tca: { "oaa":[500,82], "acetyl-coa":[330,65], citrate:[260,145], isocitrate:[175,260], akg:[245,420], "succinyl-coa":[420,505], succinate:[625,500], fumarate:[790,405], malate:[820,220], nadh:[500,300], fadh2:[665,300] },
    urea: { ammonia:[340,80], "carbamoyl-p":[500,75], ornithine:[710,155], citrulline:[800,300], aspartate:[650,365], argininosuccinate:[610,500], arginine:[380,510], urea:[170,400], fumarate:[520,390], malate:[360,300], oaa:[250,210] },
    apoptosis: { p53:[110,300], bax:[250,230], bcl2:[250,390], cytc:[410,250], apaf1:[540,250], atp:[540,400], caspase9:[700,250], caspase3:[860,250] },
    "oxidative-phosphorylation": { nadh:[80,160], complex1:[210,160], fadh2:[80,380], complex2:[210,380], coq:[350,270], complex3:[480,270], cytc:[600,270], complex4:[720,270], oxygen:[850,270], "atp-synthase":[720,470], adp:[520,490], atp:[870,490] },
  };
  const nodes = pathwayNodeIds.map((id, index) => {
    const classic = classicLayouts[process.id]?.[id];
    if (classic) return { id, x: classic[0], y: classic[1] };
    const count = pathwayNodeIds.length;
    if (process.layout === "line") return { id, x: 105 + index * (790 / Math.max(1, count - 1)), y: 285 + Math.sin(index * 1.7) * 75 };
    const angle = -Math.PI / 2 + index * Math.PI * 2 / count;
    return { id, x: 500 + Math.cos(angle) * 300, y: 300 + Math.sin(angle) * 205 };
  });
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const steps: ProcessStep[] = process.steps ?? nodes.map((node, index) => ({ from: node.id, to: nodes[index + 1]?.id ?? (process.layout === "cycle" ? nodes[0].id : ""), enzyme: "关键酶", reaction: "反应", flags: [] }));
  const edges = steps.map((step) => ({ step, a: byId[step.from], b: byId[step.to] })).filter((edge) => edge.a && edge.b && edge.a.id !== edge.b.id);
  return <section className="pathway-view" style={{ "--process": process.color } as React.CSSProperties} aria-label={`${process.label}二维经典图`}>
    <header>
      <button onClick={onClose}>← 返回3D网络</button>
      <div><span>PLANE / 2D · 从 {moleculeById[enteredFrom]?.label} 进入</span><h2>{process.label}</h2></div>
      <p>{process.summary}</p>
    </header>
    <div className="pathway-canvas">
      <div className="pathway-grid" />
      <svg viewBox="0 0 1000 600" role="img" aria-label={`${process.label}的分子与反应顺序`}>
        <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={process.color} /></marker></defs>
        {edges.map(({ step, a, b }, index) => <g key={`${step.from}-${step.to}-${index}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={process.color} strokeOpacity=".55" strokeWidth="2" markerEnd="url(#arrow)" /><text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 12} textAnchor="middle"><tspan x={(a.x + b.x) / 2}>{step.enzyme}</tspan><tspan x={(a.x + b.x) / 2} dy="12">{step.reaction}{step.flags?.length ? ` · ${step.flags.join(" / ")}` : ""}</tspan></text></g>)}
      </svg>
      {nodes.map((node) => {
        const molecule = moleculeById[node.id];
        return <button key={node.id} className={`flat-molecule ${node.id === enteredFrom ? "entered" : ""}`} style={{ left: `${node.x / 10}%`, top: `${node.y / 6}%`, "--molecule": familyColor[molecule.family] } as React.CSSProperties} onClick={() => onMolecule(node.id)}>
          <i>{molecule.symbol}</i><span>{molecule.label}</span><small>点击以它为中心返回3D</small>
        </button>;
      })}
      <aside><span>考研答题骨架</span><p>{process.exam}</p><b>循环不是球：这里的球仍然只代表具体生物分子。</b></aside>
    </div>
  </section>;
}

export default function Universe() {
  const universeRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const camera = useRef<Camera>({ focus: [0, 0, 0], yaw: -0.4, pitch: 0.28, distance: 15 });
  const target = useRef<Camera>({ focus: [0, 0, 0], yaw: -0.4, pitch: 0.28, distance: 15 });
  const projected = useRef<Projected[]>([]);
  const planeHits = useRef<{ id: string; x: number; y: number; w: number; h: number }[]>([]);
  const pointer = useRef({ down: false, moved: false, x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activePlane, setActivePlane] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [isUniverseFullscreen, setIsUniverseFullscreen] = useState(false);
  const [graphFontLevel, setGraphFontLevel] = useState(2);
  const [labelMode, setLabelMode] = useState<"symbol" | "chinese">("symbol");
  const [focusLabelClarity, setFocusLabelClarity] = useState(72);
  const [drawerWidth, setDrawerWidth] = useState(520);
  const [drawerFontLevel, setDrawerFontLevel] = useState(2);
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const selectedRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const autoOrbitRef = useRef(false);
  const universeFullscreenRef = useRef(false);
  const graphFontLevelRef = useRef(2);
  const labelModeRef = useRef<"symbol" | "chinese">("symbol");
  const focusLabelClarityRef = useRef(0.72);

  useEffect(() => { selectedRef.current = selected; }, [selected]);
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);
  useEffect(() => { autoOrbitRef.current = autoOrbit; }, [autoOrbit]);
  useEffect(() => { universeFullscreenRef.current = isUniverseFullscreen; }, [isUniverseFullscreen]);
  useEffect(() => { graphFontLevelRef.current = graphFontLevel; }, [graphFontLevel]);
  useEffect(() => { labelModeRef.current = labelMode; }, [labelMode]);
  useEffect(() => { focusLabelClarityRef.current = focusLabelClarity / 100; }, [focusLabelClarity]);

  useEffect(() => {
    if (!isUniverseFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUniverseFullscreen(false);
    };
    window.addEventListener("keydown", exitOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", exitOnEscape); };
  }, [isUniverseFullscreen]);

  const visibleProcesses = useMemo(() => relatedProcesses(selected), [selected]);
  const directReactions = useMemo(() => selected ? processes.flatMap((process) => (process.steps ?? []).filter((step) => step.from === selected || step.to === selected).map((step) => ({ ...step, process }))).slice(0, 10) : [], [selected]);
  const results = useMemo(() => search.trim() ? molecules.filter((item) => `${item.label}${item.symbol}${item.flags?.join("")}`.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 8) : [], [search]);

  const focusMolecule = useCallback((id: string) => {
    const item = moleculeById[id];
    if (!item) return;
    setSelected(id);
    setActivePlane(null);
    setSearch("");
    target.current = { ...target.current, focus: item.position, distance: 8.2 };
  }, []);

  const resetOverview = useCallback(() => {
    setSelected(null);
    setActivePlane(null);
    setDrawerExpanded(false);
    target.current = { focus: [0, 0, 0], yaw: -0.4, pitch: 0.28, distance: 15 };
  }, []);

  const toggleUniverseFullscreen = useCallback(() => setIsUniverseFullscreen((value) => !value), []);

  const startDrawerResize = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drawerExpanded) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = drawerWidth;
    const onMove = (moveEvent: PointerEvent) => {
      const maxWidth = Math.max(520, Math.min(window.innerWidth - 80, 1060));
      setDrawerWidth(Math.max(400, Math.min(maxWidth, startWidth + startX - moveEvent.clientX)));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  };

  useEffect(() => {
    const onExternalFocus = (event: Event) => focusMolecule((event as CustomEvent<string>).detail);
    window.addEventListener("focus-molecule", onExternalFocus);
    return () => window.removeEventListener("focus-molecule", onExternalFocus);
  }, [focusMolecule]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const project = (point: Vec3, width: number, height: number) => {
      const c = camera.current;
      const x = point[0] - c.focus[0], y = point[1] - c.focus[1], z = point[2] - c.focus[2];
      const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
      const rx = cy * x - sy * z, rz = sy * x + cy * z;
      const ry = cp * y - sp * rz, dz = sp * y + cp * rz;
      const depth = Math.max(1.4, c.distance + dz), focal = Math.min(width, height) * 1.05, scale = focal / depth;
      return { x: width / 2 + rx * scale, y: height / 2 - ry * scale, z: dz, scale };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) { canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = rect.width, height = rect.height;
      const fontScale = graphFontScales[graphFontLevelRef.current];
      const c = camera.current, t = target.current;
      c.focus = mix3(c.focus, t.focus, 0.075); c.yaw = lerp(c.yaw, t.yaw, 0.075); c.pitch = lerp(c.pitch, t.pitch, 0.075); c.distance = lerp(c.distance, t.distance, 0.075);
      if (autoOrbitRef.current) target.current.yaw += 0.0022;

      const background = ctx.createRadialGradient(width * .5, height * .45, 30, width * .5, height * .5, Math.max(width, height) * .8);
      background.addColorStop(0, "#102b33"); background.addColorStop(.48, "#08171d"); background.addColorStop(1, "#03090c");
      ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = .18; ctx.fillStyle = "#a9fff0";
      for (let i = 0; i < 55; i++) { const x = (i * 83.7) % width; const y = (i * i * 19.3) % height; ctx.fillRect(x, y, i % 5 === 0 ? 1.5 : .7, i % 5 === 0 ? 1.5 : .7); }
      ctx.globalAlpha = 1;

      const selectedId = selectedRef.current, selectedProcesses = relatedProcesses(selectedId);
      planeHits.current = [];
      selectedProcesses.forEach((process, index) => {
        const halfU = 2.15, halfV = 1.35;
        const planeCenter = selectedId ? moleculeById[selectedId].position : process.origin;
        const corners = [add3(add3(planeCenter, process.u, -halfU), process.v, -halfV), add3(add3(planeCenter, process.u, halfU), process.v, -halfV), add3(add3(planeCenter, process.u, halfU), process.v, halfV), add3(add3(planeCenter, process.u, -halfU), process.v, halfV)].map((p) => project(p, width, height));
        ctx.beginPath(); corners.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
        ctx.fillStyle = `${process.color}12`; ctx.fill(); ctx.strokeStyle = `${process.color}55`; ctx.lineWidth = 1; ctx.stroke();
        const labelPoint = add3(add3(planeCenter, process.u, index % 2 ? -1.55 : 1.55), process.v, ((index % 3) - 1) * .78);
        const center = project(labelPoint, width, height), label = `${String(index + 1).padStart(2, "0")}  ${process.label}  ↗`;
        ctx.font = `600 ${12 * fontScale}px system-ui, sans-serif`; const w = ctx.measureText(label).width + 24 * fontScale, h = 30 * fontScale;
        ctx.fillStyle = "rgba(4,14,18,.9)"; ctx.strokeStyle = `${process.color}aa`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(center.x - w / 2, center.y - h / 2, w, h, 8 * fontScale); ctx.fill(); ctx.stroke();
        ctx.fillStyle = process.color; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, center.x, center.y);
        planeHits.current.push({ id: process.id, x: center.x - w / 2, y: center.y - h / 2, w, h });
      });

      ctx.lineCap = "round";
      for (const [aId, bId] of worldEdges) {
        const a = project(moleculeById[aId].position, width, height), b = project(moleculeById[bId].position, width, height);
        const hot = Boolean(selectedId && (aId === selectedId || bId === selectedId || selectedProcesses.some((p) => p.nodeIds.includes(aId) && p.nodeIds.includes(bId))));
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = hot ? "rgba(89,227,167,.52)" : "rgba(119,159,165,.15)"; ctx.lineWidth = hot ? 1.7 : .8; ctx.stroke();
      }

      const points = molecules.map((item) => { const p = project(item.position, width, height); return { ...p, id: item.id, r: Math.max(7, Math.min(26, (item.radius ?? 1) * p.scale * .38)) }; }).sort((a, b) => b.z - a.z);
      projected.current = points;
      for (const p of points) {
        const item = moleculeById[p.id], selectedNow = p.id === selectedId, hover = p.id === hoveredRef.current;
        const isDirect = !selectedId || selectedProcesses.some((process) => process.nodeIds.includes(p.id));
        const sphereAlpha = selectedId && !isDirect ? .14 : 1;
        ctx.globalAlpha = sphereAlpha;
        const glow = ctx.createRadialGradient(p.x - p.r * .28, p.y - p.r * .35, 1, p.x, p.y, p.r * 1.5);
        glow.addColorStop(0, "#f2ffff"); glow.addColorStop(.18, familyColor[item.family]); glow.addColorStop(.7, `${familyColor[item.family]}88`); glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = familyColor[item.family]; ctx.strokeStyle = selectedNow ? "#ffffff" : hover ? "#dffef7" : "rgba(255,255,255,.42)"; ctx.lineWidth = selectedNow ? 2.7 : hover ? 2 : .8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        if (selectedId && p.r >= 7) {
          const clarity = focusLabelClarityRef.current;
          const size = Math.max(5.2, Math.min(10.5, p.r * .43 * fontScale));
          ctx.save();
          ctx.globalAlpha = Math.min(1, sphereAlpha + .12 + clarity * .28);
          ctx.font = `750 ${size}px system-ui, sans-serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillStyle = familyInnerTextColor[item.family];
          ctx.shadowColor = `rgba(235,255,250,${.08 + clarity * .16})`;
          ctx.shadowBlur = 1 + clarity * 2.2;
          ctx.fillText(item.symbol, p.x, p.y, p.r * 1.62);
          ctx.restore();
        }
        if (selectedNow || hover || (!selectedId && p.r > 10)) {
          const size = (selectedNow ? 12 : 10) * fontScale;
          const lines = compactLabelLines(canvasLabel(item, labelModeRef.current));
          ctx.font = `${selectedNow ? 700 : 600} ${size}px system-ui, sans-serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = "#eafffa";
          lines.forEach((line, index) => ctx.fillText(line, p.x, p.y + p.r + 7 + index * size * 1.12));
        }
        ctx.globalAlpha = 1;
      }

      if (!selectedId) {
        ctx.textAlign = "center"; ctx.fillStyle = "rgba(223,255,248,.72)"; ctx.font = `600 ${13 * fontScale}px system-ui, sans-serif`;
        const guide = universeFullscreenRef.current ? "沉浸模式：拖动环绕 · 滚轮缩放 · 点击分子查看详情" : "拖动环绕 · 点击右上角全屏后可用滚轮缩放";
        ctx.fillText(guide, width / 2, height - 32);
      }
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const pointerPosition = (event: React.PointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
  const hitMolecule = (x: number, y: number) => [...projected.current].reverse().find((p) => Math.hypot(p.x - x, p.y - y) <= Math.max(15, p.r + 5))?.id ?? null;
  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => { const p = pointerPosition(event); pointer.current = { down: true, moved: false, ...p }; event.currentTarget.setPointerCapture(event.pointerId); };
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerPosition(event);
    if (pointer.current.down) { const dx = p.x - pointer.current.x, dy = p.y - pointer.current.y; if (Math.abs(dx) + Math.abs(dy) > 2) pointer.current.moved = true; target.current.yaw += dx * .007; target.current.pitch = Math.max(-1.1, Math.min(1.1, target.current.pitch + dy * .006)); pointer.current.x = p.x; pointer.current.y = p.y; }
    else setHovered(hitMolecule(p.x, p.y));
  };
  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const p = pointerPosition(event);
    if (!pointer.current.moved) { const plane = planeHits.current.find((hit) => p.x >= hit.x && p.x <= hit.x + hit.w && p.y >= hit.y && p.y <= hit.y + hit.h); if (plane) setActivePlane(plane.id); else { const id = hitMolecule(p.x, p.y); if (id) focusMolecule(id); } }
    pointer.current.down = false;
  };

  const selectedMolecule: Molecule | null = selected ? moleculeById[selected] : null;
  const activeProcess = activePlane ? processById[activePlane] : null;

  return <section ref={universeRef} className={`universe-shell ${isUniverseFullscreen ? "universe-immersive" : ""}`} id="universe">
    <div className="universe-toolbar">
      <div className="universe-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜草酰乙酸、乙酰-CoA、NADH…" aria-label="搜索生物分子" />{results.length > 0 && <div>{results.map((item) => <button key={item.id} onClick={() => focusMolecule(item.id)}><i style={{ background: familyColor[item.family] }} /><span><strong>{item.label}</strong><small>{item.symbol} · {item.location}</small></span><b>定位</b></button>)}</div>}</div>
      <button className={!selected ? "active" : ""} onClick={resetOverview}>全网预览</button>
      <button className={autoOrbit ? "active" : ""} onClick={() => setAutoOrbit(!autoOrbit)}>{autoOrbit ? "暂停环绕" : "自动环绕"}</button>
      <button className={`universe-fullscreen-button ${isUniverseFullscreen ? "active" : ""}`} onClick={toggleUniverseFullscreen}>{isUniverseFullscreen ? "退出全屏" : "⛶ 全屏沉浸"}</button>
      <span className="molecule-count"><b>{molecules.length}</b> 个固定坐标分子</span>
    </div>
    <canvas ref={canvasRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={() => { pointer.current.down = false; setHovered(null); }} onWheel={(event) => { if (!universeFullscreenRef.current) return; event.preventDefault(); target.current.distance = Math.max(5.8, Math.min(22, target.current.distance + event.deltaY * .008)); }} aria-label="可拖动旋转的三维生物分子网络" />
    <div className="axis-cue"><i className="axis-x" /><i className="axis-y" /><i className="axis-z" /><span>固定世界坐标</span></div>
    <div className="graph-display-controls" aria-label="图谱显示设置">
      <div className="graph-label-switch"><button className={labelMode === "symbol" ? "active" : ""} onClick={() => setLabelMode("symbol")}>缩写</button><button className={labelMode === "chinese" ? "active" : ""} onClick={() => setLabelMode("chinese")}>中文</button></div>
      <div className="graph-font-levels"><span>图中文字</span>{graphFontScales.map((_, index) => <button key={index} className={graphFontLevel === index ? "active" : ""} onClick={() => setGraphFontLevel(index)} aria-label={`图谱字号第${index + 1}档`}>{index + 1}</button>)}</div>
    </div>
    {selected && <label className="focus-label-control"><span><b>球内英文小字</b><i>{focusLabelClarity}%</i></span><input type="range" min="35" max="100" step="5" value={focusLabelClarity} onChange={(event) => setFocusLabelClarity(Number(event.target.value))} aria-label="调节选中分子视图中球内英文小字的清晰度" /><small>深色缩写随球体远近同步淡化，但比球体更清晰</small></label>}
    {hovered && !selected && <div className="hover-note"><span>{moleculeById[hovered].symbol}</span><strong>{moleculeById[hovered].label}</strong><small>点击聚焦</small></div>}
    {selectedMolecule && <aside className={`molecule-drawer ${drawerExpanded ? "drawer-expanded" : ""}`} style={{ width: drawerExpanded ? undefined : drawerWidth, fontSize: `${14 * drawerFontScales[drawerFontLevel]}px`, "--drawer-scale": drawerFontScales[drawerFontLevel] } as React.CSSProperties} aria-live="polite">
      {!drawerExpanded && <div className="drawer-resize-handle" onPointerDown={startDrawerResize} role="separator" aria-orientation="vertical" aria-label="拖动调整详情窗口宽度"><i /><i /><i /></div>}
      <div className="drawer-head"><span>{selectedMolecule.evidence}</span><div className="drawer-window-controls"><div className="drawer-font-controls" aria-label="详情字号">{drawerFontScales.map((_, index) => <button key={index} className={drawerFontLevel === index ? "active" : ""} onClick={() => setDrawerFontLevel(index)} aria-label={`详情字号第${index + 1}档`}>A{index + 1}</button>)}</div><button className="drawer-expand-button" onClick={() => setDrawerExpanded((value) => !value)} aria-label={drawerExpanded ? "退出详情全屏" : "详情全屏"}>{drawerExpanded ? "↙" : "⛶"}</button><button className="drawer-close-button" onClick={resetOverview} aria-label="关闭详情">×</button></div></div>
      <div className="molecule-title"><i style={{ background: familyColor[selectedMolecule.family] }}>{selectedMolecule.symbol}</i><div><small>当前旋转中心</small><h2>{selectedMolecule.label}</h2></div></div>
      <p>{selectedMolecule.summary}</p>
      <dl><div><dt>细胞定位</dt><dd>{selectedMolecule.location}</dd></div><div><dt>复习优先级</dt><dd>{"★".repeat(selectedMolecule.priority)}{"☆".repeat(3 - selectedMolecule.priority)}</dd></div></dl>
      <div className="molecule-flags">{selectedMolecule.flags?.map((flag) => <span key={flag}>{flag}</span>)}</div>
      {directReactions.length > 0 && <div className="direct-reactions"><header><span>直接联系 · 酶 · 反应类型</span><b>{directReactions.length} 条</b></header>{directReactions.map((reaction, index) => { const otherId = reaction.from === selected ? reaction.to : reaction.from; const other = moleculeById[otherId]; return <button key={`${reaction.process.id}-${reaction.from}-${reaction.to}-${index}`} onClick={() => other && focusMolecule(other.id)}><i style={{ background: other ? familyColor[other.family] : "#fff" }} /><span><strong>{other?.label ?? otherId}</strong><small>{reaction.enzyme} · {reaction.reaction}</small></span>{reaction.flags?.length ? <b>{reaction.flags.join(" · ")}</b> : <b>直接</b>}</button>; })}</div>}
      <div className="process-list"><header><span>相关循环 / 过程</span><b>{visibleProcesses.length} 个空间平面</b></header>{visibleProcesses.map((process, index) => <button key={process.id} onClick={() => setActivePlane(process.id)}><i style={{ borderColor: process.color, color: process.color }}>{String(index + 1).padStart(2, "0")}</i><span><strong>{process.label}</strong><small>{process.summary}</small></span><b>展开2D →</b></button>)}</div>
      <footer>现在拖动鼠标，会始终围绕<strong>{selectedMolecule.label}</strong>旋转。</footer>
    </aside>}
    {!selected && <div className="overview-card"><span>UN1 OPEN SOURCE · ONE UNIVERSE</span><h2>所有分子，一张网。</h2><p>没有“能量代谢区”和“含氮代谢区”的切页。循环只是穿过同一批分子的空间平面，球只代表具体生物分子。</p><small>由 UN1 发起并免费开源 · Codex 辅助构建</small><button onClick={() => focusMolecule("oaa")}>从草酰乙酸开始演示 →</button></div>}
    {activeProcess && selected && <div className="plane-overlay"><PathwayView process={activeProcess} enteredFrom={selected} onClose={() => setActivePlane(null)} onMolecule={focusMolecule} /></div>}
  </section>;
}
