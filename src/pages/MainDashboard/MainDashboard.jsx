import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Database,
  Sparkles,
  Brain,
  Shield,
  Plus,
  Play,
  MoreVertical,
  Search,
  ArrowRight,
  CheckCircle2,
  Loader2,
  CircleDashed,
  Copy,
  Trash2,
  FileText,
  Inbox,
} from 'lucide-react';
import './MainDashboard.css';

/* ================================================================== */
/* Content                                                             */
/* ================================================================== */

const DOMAINS = [
  {
    key: 'data',
    title: 'Data',
    description: 'ETL, CDC, Kafka',
    caption: 'Events flowing from source to sink',
    icon: Database,
    color: '#4CC9F0',
  },
  {
    key: 'genai',
    title: 'GenAI',
    description: 'LLM, RAG, Model Serving',
    caption: 'Prompts passing through the model layers',
    icon: Sparkles,
    color: '#C084FC',
  },
  {
    key: 'ml',
    title: 'ML',
    description: 'Training, Inference, MLOps',
    caption: 'Clusters settling as training converges',
    icon: Brain,
    color: '#5EEAD4',
  },
  {
    key: 'governance',
    title: 'Data Governance',
    description: 'Catalog, Quality, Lineage',
    caption: 'Lineage traced from origin to report',
    icon: Shield,
    color: '#FFB454',
  },
];

const INITIAL_ASSESSMENTS = [
  {
    id: 1,
    name: 'APB Kafka Prod',
    module: 'Data',
    technology: 'Kafka',
    environment: 'Production',
    createdOn: '12 Mar 2024',
    status: 'Completed',
    progress: 100,
    running: false,
  },
  {
    id: 2,
    name: 'MySQL CDC POC',
    module: 'Data',
    technology: 'CDC',
    environment: 'SIT',
    createdOn: '10 Mar 2024',
    status: 'In Progress',
    progress: 62,
    running: false,
  },
  {
    id: 3,
    name: 'GenAI Platform',
    module: 'GenAI',
    technology: 'RAG',
    environment: 'Production',
    createdOn: '08 Mar 2024',
    status: 'Completed',
    progress: 100,
    running: false,
  },
];

const STATUSES = ['Completed', 'In Progress', 'Draft'];
const STATUS_ICON = { Completed: CheckCircle2, 'In Progress': Loader2, Draft: CircleDashed };
const AUTOPLAY_MS = 6000;

const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');
const todayLabel = () =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================================================================== */
/* Canvas scenes: one living picture per solution                      */
/* ================================================================== */

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;
const RGB = Object.fromEntries(DOMAINS.map((d) => [d.key, hexToRgb(d.color)]));

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(11);
const ML_POINTS = Array.from({ length: 120 }, (_, i) => ({
  k: i % 3,
  a: rnd() * Math.PI * 2,
  rad: 0.15 + rnd() * 0.85,
  sp: (0.15 + rnd() * 0.5) * (rnd() > 0.5 ? 1 : -1),
  size: 1 + rnd() * 1.6,
}));

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const bez = (p0, p1, p2, p3, u) => {
  const m = 1 - u;
  return {
    x: m * m * m * p0.x + 3 * m * m * u * p1.x + 3 * m * u * u * p2.x + u * u * u * p3.x,
    y: m * m * m * p0.y + 3 * m * m * u * p1.y + 3 * m * u * u * p2.y + u * u * u * p3.y,
  };
};

const curveCtl = (a, b) => {
  const mx = a.x + (b.x - a.x) * 0.5;
  return [a, { x: mx, y: a.y }, { x: mx, y: b.y }, b];
};

function strokeCurve(ctx, a, b, color, alpha, lw = 1) {
  const [p0, p1, p2, p3] = curveCtl(a, b);
  ctx.strokeStyle = rgba(color, alpha);
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  ctx.stroke();
}

function glowDot(ctx, p, r, color, alpha) {
  ctx.fillStyle = rgba(color, alpha * 0.18);
  ctx.beginPath();
  ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(color, alpha);
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
}

/* Data: ETL, CDC and Kafka/event streaming */
function drawData(ctx, w, h, t, c) {
  const stages = [
    { x: w * 0.1, y: h * 0.45, label: 'Data Sources', type: 'db' },
    { x: w * 0.3, y: h * 0.45, label: 'CDC/Extract', type: 'rect' },
    { x: w * 0.5, y: h * 0.45, label: 'Kafka/Stream', type: 'kafka' },
    { x: w * 0.7, y: h * 0.45, label: 'ETL/Process', type: 'rect' },
    { x: w * 0.9, y: h * 0.45, label: 'Destinations', type: 'db' }
  ];

  ctx.strokeStyle = rgba(c, 0.2);
  ctx.lineWidth = 2;
  
  for(let i=0; i<stages.length-1; i++) {
    ctx.beginPath();
    ctx.moveTo(stages[i].x, stages[i].y);
    ctx.lineTo(stages[i+1].x, stages[i+1].y);
    ctx.stroke();

    for(let j=0; j<3; j++) {
      const u = (t * 0.6 + i * 0.2 + j * 0.33) % 1;
      const px = stages[i].x + (stages[i+1].x - stages[i].x) * u;
      glowDot(ctx, {x: px, y: h * 0.45}, 2.5, c, Math.sin(u * Math.PI));
    }
  }

  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  
  stages.forEach(s => {
    ctx.fillStyle = '#0c0a13';
    ctx.strokeStyle = rgba(c, 0.7);
    ctx.lineWidth = 2;
    
    if (s.type === 'db') {
      rrect(ctx, s.x - 16, s.y - 18, 32, 36, 6);
      ctx.beginPath(); ctx.moveTo(s.x - 16, s.y - 6); ctx.lineTo(s.x + 16, s.y - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x - 16, s.y + 6); ctx.lineTo(s.x + 16, s.y + 6); ctx.stroke();
    } else if (s.type === 'rect') {
      rrect(ctx, s.x - 18, s.y - 16, 36, 32, 4);
    } else if (s.type === 'kafka') {
      rrect(ctx, s.x - 24, s.y - 24, 48, 48, 12);
      ctx.fillStyle = rgba(c, 0.1 + 0.1 * Math.sin(t*4));
    }
    
    ctx.fill(); ctx.stroke();
    
    if (s.type === 'kafka') {
      ctx.beginPath(); ctx.arc(s.x - 8, s.y - 8, 3, 0, Math.PI*2); ctx.fillStyle = rgba(c,0.8); ctx.fill();
      ctx.beginPath(); ctx.arc(s.x + 8, s.y + 8, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(s.x - 8, s.y + 8, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(s.x + 8, s.y - 8, 3, 0, Math.PI*2); ctx.fill();
    }

    ctx.fillStyle = rgba(c, 0.9);
    ctx.fillText(s.label, s.x, s.y + 45);
  });
}

/* GenAI: User/Input -> Processing -> Embeddings/Knowledge -> AI/LLM -> Response */
function drawGenAI(ctx, w, h, t, c) {
  const stages = [
    { x: w * 0.1, y: h * 0.45, label: 'User/Input', type: 'circle' },
    { x: w * 0.3, y: h * 0.45, label: 'Processing', type: 'rect' },
    { x: w * 0.5, y: h * 0.45, label: 'Embeddings', type: 'db' },
    { x: w * 0.7, y: h * 0.45, label: 'AI/LLM', type: 'hex' },
    { x: w * 0.9, y: h * 0.45, label: 'Response', type: 'circle' }
  ];

  ctx.strokeStyle = rgba(c, 0.2);
  ctx.lineWidth = 2;
  
  for(let i=0; i<stages.length-1; i++) {
    ctx.beginPath();
    ctx.moveTo(stages[i].x, stages[i].y);
    ctx.lineTo(stages[i+1].x, stages[i+1].y);
    ctx.stroke();

    const u = (t * 0.5 + i * 0.2) % 1;
    const px = stages[i].x + (stages[i+1].x - stages[i].x) * u;
    glowDot(ctx, {x: px, y: h * 0.45}, 3, c, Math.sin(u * Math.PI));
  }

  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  
  stages.forEach(s => {
    ctx.fillStyle = '#0c0a13';
    ctx.strokeStyle = rgba(c, 0.7);
    ctx.lineWidth = 2;
    if (s.type === 'circle') {
      ctx.beginPath(); ctx.arc(s.x, s.y, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    } else if (s.type === 'rect') {
      rrect(ctx, s.x - 20, s.y - 16, 40, 32, 4); ctx.fill(); ctx.stroke();
    } else if (s.type === 'db') {
      rrect(ctx, s.x - 18, s.y - 20, 36, 40, 8); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x - 18, s.y - 5); ctx.lineTo(s.x + 18, s.y - 5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x - 18, s.y + 5); ctx.lineTo(s.x + 18, s.y + 5); ctx.stroke();
    } else if (s.type === 'hex') {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        const hx = s.x + 22 * Math.cos(a);
        const hy = s.y + 22 * Math.sin(a);
        if (i===0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      
      const pulse = 0.5 + 0.5 * Math.sin(t * 3);
      glowDot(ctx, {x: s.x, y: s.y}, 6 + pulse*2, c, pulse);
    }
    
    ctx.fillStyle = rgba(c, 0.9);
    ctx.fillText(s.label, s.x, s.y + 45);
  });
}

/* ML: Data -> Feature Processing -> Model Training -> Model -> Prediction */
function drawML(ctx, w, h, t, c) {
  const stages = [
    { x: w * 0.1, y: h * 0.45, label: 'Data', type: 'data' },
    { x: w * 0.3, y: h * 0.45, label: 'Feature Proc', type: 'gear' },
    { x: w * 0.5, y: h * 0.45, label: 'Model Training', type: 'train' },
    { x: w * 0.7, y: h * 0.45, label: 'Model', type: 'model' },
    { x: w * 0.9, y: h * 0.45, label: 'Prediction', type: 'pred' }
  ];

  ctx.strokeStyle = rgba(c, 0.2);
  ctx.lineWidth = 2;
  
  for(let i=0; i<stages.length-1; i++) {
    ctx.beginPath();
    ctx.moveTo(stages[i].x, stages[i].y);
    ctx.lineTo(stages[i+1].x, stages[i+1].y);
    ctx.stroke();

    const u = (t * 0.6 + i * 0.2) % 1;
    const px = stages[i].x + (stages[i+1].x - stages[i].x) * u;
    glowDot(ctx, {x: px, y: h * 0.45}, 3, c, Math.sin(u * Math.PI));
  }

  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  
  stages.forEach(s => {
    ctx.fillStyle = '#0c0a13';
    ctx.strokeStyle = rgba(c, 0.7);
    ctx.lineWidth = 2;
    
    if (s.type === 'data') {
      rrect(ctx, s.x - 15, s.y - 15, 30, 30, 4); ctx.fill(); ctx.stroke();
    } else if (s.type === 'gear') {
      ctx.beginPath(); ctx.arc(s.x, s.y, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, Math.PI*2); ctx.stroke();
    } else if (s.type === 'train') {
      rrect(ctx, s.x - 25, s.y - 20, 50, 40, 6); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x - 15, s.y + 10);
      ctx.quadraticCurveTo(s.x, s.y + 10, s.x + 15, s.y - 10);
      ctx.stroke();
      for (let j=0; j<3; j++) {
        const a = t * 2 + j * Math.PI * 2 / 3;
        const px = s.x + 35 * Math.cos(a);
        const py = s.y + 30 * Math.sin(a);
        glowDot(ctx, {x: px, y: py}, 2, c, 1);
      }
    } else if (s.type === 'model') {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - 20); ctx.lineTo(s.x + 20, s.y);
      ctx.lineTo(s.x, s.y + 20); ctx.lineTo(s.x - 20, s.y);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    } else if (s.type === 'pred') {
      ctx.beginPath(); ctx.arc(s.x, s.y, 14, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, Math.PI*2); ctx.fillStyle = rgba(c, 0.5); ctx.fill();
    }
    
    ctx.fillStyle = rgba(c, 0.9);
    ctx.fillText(s.label, s.x, s.y + 45);
  });
}

/* Governance: Data Sources -> Catalog -> Governance/Policy -> Security/Compliance -> Trusted Data */
function drawGov(ctx, w, h, t, c) {
  const stages = [
    { x: w * 0.1, y: h * 0.45, label: 'Data Sources' },
    { x: w * 0.3, y: h * 0.45, label: 'Catalog' },
    { x: w * 0.5, y: h * 0.45, label: 'Governance/Policy' },
    { x: w * 0.7, y: h * 0.45, label: 'Security/Compliance' },
    { x: w * 0.9, y: h * 0.45, label: 'Trusted Data' }
  ];

  ctx.strokeStyle = rgba(c, 0.2);
  ctx.lineWidth = 2;
  
  for(let i=0; i<stages.length-1; i++) {
    ctx.beginPath();
    ctx.moveTo(stages[i].x, stages[i].y);
    ctx.lineTo(stages[i+1].x, stages[i+1].y);
    ctx.stroke();

    const u = (t * 0.4 + i * 0.2) % 1;
    const px = stages[i].x + (stages[i+1].x - stages[i].x) * u;
    glowDot(ctx, {x: px, y: h * 0.45}, 3, c, Math.sin(u * Math.PI));
  }

  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  
  stages.forEach((s, idx) => {
    ctx.fillStyle = '#0c0a13';
    ctx.strokeStyle = rgba(c, 0.7);
    ctx.lineWidth = 2;
    
    if (idx === 0) {
      rrect(ctx, s.x - 16, s.y - 16, 32, 32, 4);
    } else if (idx === 1) { 
      rrect(ctx, s.x - 18, s.y - 20, 36, 40, 4);
      ctx.beginPath(); ctx.moveTo(s.x - 10, s.y - 8); ctx.lineTo(s.x + 10, s.y - 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x - 10, s.y); ctx.lineTo(s.x + 10, s.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s.x - 10, s.y + 8); ctx.lineTo(s.x + 10, s.y + 8); ctx.stroke();
    } else if (idx === 2) { 
      ctx.beginPath();
      ctx.moveTo(s.x - 16, s.y - 16); ctx.lineTo(s.x + 16, s.y - 16);
      ctx.lineTo(s.x + 12, s.y + 12); ctx.lineTo(s.x, s.y + 20);
      ctx.lineTo(s.x - 12, s.y + 12); ctx.closePath();
    } else if (idx === 3) { 
      rrect(ctx, s.x - 14, s.y, 28, 20, 4);
      ctx.beginPath(); ctx.arc(s.x, s.y, 10, Math.PI, 0); ctx.stroke();
    } else if (idx === 4) { 
      ctx.beginPath(); ctx.arc(s.x, s.y, 18, 0, Math.PI*2);
      ctx.fillStyle = rgba(c, 0.15 + 0.15 * Math.sin(t*2));
    }
    
    ctx.fill(); ctx.stroke();
    
    if (idx === 4) {
      ctx.beginPath();
      ctx.moveTo(s.x - 6, s.y);
      ctx.lineTo(s.x - 2, s.y + 5);
      ctx.lineTo(s.x + 8, s.y - 5);
      ctx.stroke();
      glowDot(ctx, {x: s.x, y: s.y}, 10, c, 0.3 + 0.2*Math.sin(t*3));
    }

    ctx.fillStyle = rgba(c, 0.9);
    ctx.fillText(s.label, s.x, s.y + 45);
  });
}

const SCENES = { data: drawData, genai: drawGenAI, ml: drawML, governance: drawGov };

function Stage({ domain }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const redraw = useRef(null);
  const state = useRef({ active: domain.key, prev: null, switchAt: -1e9, ptr: null });

  useEffect(() => {
    const s = state.current;
    if (s.active === domain.key) return;
    const reduce = prefersReduced();
    s.prev = reduce ? null : s.active;
    s.active = domain.key;
    s.switchAt = performance.now();
    if (reduce && redraw.current) redraw.current(performance.now());
  }, [domain.key]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = prefersReduced();
    let raf = 0;
    let w = 0;
    let h = 0;

    const frame = (now) => {
      if (w > 0 && h > 0) {
        const s = state.current;
        const t = now / 1000;
        ctx.clearRect(0, 0, w, h);

        const k = Math.min(1, (now - s.switchAt) / 650);
        if (s.prev && k < 1) {
          ctx.globalAlpha = 1 - k;
          SCENES[s.prev](ctx, w, h, t, RGB[s.prev]);
        }
        ctx.globalAlpha = s.prev && k < 1 ? k : 1;
        SCENES[s.active](ctx, w, h, t, RGB[s.active]);
        ctx.globalAlpha = 1;

        const gx = s.ptr ? s.ptr.x : w * 0.5;
        const gy = s.ptr ? s.ptr.y : h * 0.4;
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.min(w, h) * 0.5);
        g.addColorStop(0, rgba(RGB[s.active], s.ptr ? 0.16 : 0.07));
        g.addColorStop(1, rgba(RGB[s.active], 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    redraw.current = frame;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) frame(performance.now());
    };

    resize();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(wrap);
    } else {
      window.addEventListener('resize', resize);
    }
    if (!reduce) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      redraw.current = null;
    };
  }, []);

  const onMove = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    state.current.ptr = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div
      ref={wrapRef}
      className="stage"
      onPointerMove={onMove}
      onPointerLeave={() => {
        state.current.ptr = null;
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <p className="stage-caption" aria-live="polite" key={domain.key}>
        {domain.caption}
      </p>
    </div>
  );
}

/* ================================================================== */
/* Row action menu (portal, so the table never clips it)               */
/* ================================================================== */

function RowMenu({ name, onAction }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const close = useCallback(() => setPos(null), []);

  useEffect(() => {
    if (!pos) return undefined;
    const onDown = (e) => {
      if (menuRef.current?.contains(e.target) || btnRef.current?.contains(e.target)) return;
      close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
        btnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [pos, close]);

  const toggle = () => {
    if (pos) return close();
    const r = btnRef.current.getBoundingClientRect();
    return setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
  };

  const choose = (action) => {
    close();
    onAction(action);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="icon-btn"
        aria-label={`More actions for ${name}`}
        aria-haspopup="menu"
        aria-expanded={Boolean(pos)}
        onClick={toggle}
      >
        <MoreVertical size={16} />
      </button>
      {pos &&
        createPortal(
          <div ref={menuRef} className="row-menu" role="menu" style={{ top: pos.top, right: pos.right }}>
            <button type="button" role="menuitem" onClick={() => choose('report')}>
              <FileText size={15} /> View report
            </button>
            <button type="button" role="menuitem" onClick={() => choose('duplicate')}>
              <Copy size={15} /> Duplicate
            </button>
            <button type="button" role="menuitem" className="danger" onClick={() => choose('delete')}>
              <Trash2 size={15} /> Delete
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

/* ================================================================== */
/* Main component                                                      */
/* ================================================================== */

export default function MainDashboard({ userName = 'Anuj', onViewReport, onStartAssessment }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(() => !prefersReduced());
  const [rows, setRows] = useState(INITIAL_ASSESSMENTS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const nextId = useRef(INITIAL_ASSESSMENTS.length + 1);

  const active = DOMAINS[activeIdx];

  /* Auto-cycle the showcase until the person takes over */
  useEffect(() => {
    if (!autoplay) return undefined;
    const id = setTimeout(() => setActiveIdx((i) => (i + 1) % DOMAINS.length), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [autoplay, activeIdx]);

  const select = (i) => {
    setAutoplay(false);
    setActiveIdx(i);
  };

  /* Simulated run progress: ticks only while something is running */
  const anyRunning = rows.some((r) => r.running);
  useEffect(() => {
    if (!anyRunning) return undefined;
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          if (!r.running) return r;
          const progress = Math.min(100, r.progress + 7);
          return progress >= 100
            ? { ...r, progress: 100, running: false, status: 'Completed' }
            : { ...r, progress };
        })
      );
    }, 400);
    return () => clearInterval(id);
  }, [anyRunning]);

  const addAssessment = useCallback((partial) => {
    const id = nextId.current++;
    setRows((prev) => [
      {
        id,
        name: partial.name,
        module: partial.module,
        technology: partial.technology,
        environment: 'Development',
        createdOn: todayLabel(),
        status: 'Draft',
        progress: 0,
        running: false,
        isNew: true,
      },
      ...prev.map((r) => ({ ...r, isNew: false })),
    ]);
  }, []);

  const handleStart = (domain) => {
    addAssessment({
      name: `New ${domain.title} assessment`,
      module: domain.title,
      technology: domain.description.split(',')[0].trim(),
    });
    if (onStartAssessment) onStartAssessment(domain);
  };

  const handleNew = () => handleStart(active);

  const handleRun = (id) =>
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, running: true, status: 'In Progress', progress: r.progress >= 100 ? 0 : r.progress }
          : r
      )
    );

  const handleRowAction = (row, action) => {
    if (action === 'delete') {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } else if (action === 'duplicate') {
      const id = nextId.current++;
      setRows((prev) => [
        {
          ...row,
          id,
          name: `${row.name} (copy)`,
          createdOn: todayLabel(),
          status: 'Draft',
          progress: 0,
          running: false,
          isNew: true,
        },
        ...prev.map((r) => ({ ...r, isNew: false })),
      ]);
    } else if (action === 'report' && onViewReport) {
      onViewReport(row);
    }
  };

  const counts = useMemo(() => {
    const c = { All: rows.length };
    STATUSES.forEach((s) => {
      c[s] = rows.filter((r) => r.status === s).length;
    });
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const okStatus = statusFilter === 'All' || r.status === statusFilter;
      const okQuery =
        !q || [r.name, r.module, r.technology, r.environment].some((v) => v.toLowerCase().includes(q));
      return okStatus && okQuery;
    });
  }, [rows, query, statusFilter]);

  return (
    <div className="dash" style={{ '--accent': active.color }}>
      <div className="dash-glow" aria-hidden="true" />
      <div className="dash-grain" aria-hidden="true" />

      <div className="dash-inner">
        {/* Hero */}
        <header className="dash-hero">
          <h1 className="dash-hero-title">
            <span className="mask">
              <span className="mask-inner">Welcome, {userName}</span>
            </span>
          </h1>
          <p className="dash-hero-sub">Choose a solution to start a new assessment</p>
        </header>

        {/* Showcase */}
        <section className="showcase" aria-label="Solutions">
          <div className="domain-list">
            {DOMAINS.map((d, i) => {
              const Icon = d.icon;
              const isActive = i === activeIdx;
              return (
                <div
                  key={d.key}
                  className={`domain ${isActive ? 'is-active' : ''}`}
                  style={{ '--d': d.color, '--i': i }}
                >
                  <button
                    type="button"
                    className="domain-name"
                    aria-pressed={isActive}
                    onMouseEnter={() => select(i)}
                    onFocus={() => select(i)}
                    onClick={() => select(i)}
                  >
                    <span className="domain-icon" aria-hidden="true">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <span className="domain-label">{d.title}</span>
                  </button>

                  <div className="domain-body">
                    <div className="domain-body-inner">
                      <ul className="tags" aria-label={`${d.title} capabilities`}>
                        {d.description.split(',').map((tag) => (
                          <li key={tag.trim()}>{tag.trim()}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="cta"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleStart(d)}
                      >
                        Start assessment
                        <span className="cta-arrow" aria-hidden="true">
                          <ArrowRight size={16} />
                        </span>
                      </button>
                    </div>
                  </div>

                  {isActive && autoplay && <span className="autoplay" key={`ap-${activeIdx}`} aria-hidden="true" />}
                </div>
              );
            })}
          </div>

          <Stage domain={active} />
        </section>

        {/* Run log */}
        <section className="log-section">
          <div className="log-head">
            <h2>Recent assessments</h2>
            <button type="button" className="ghost-btn" onClick={handleNew}>
              <Plus size={16} />
              New assessment
            </button>
          </div>

          {rows.length > 0 && (
            <div className="dist" aria-hidden="true">
              {STATUSES.map((s) =>
                counts[s] ? (
                  <span
                    key={s}
                    className={`dist-seg ${slug(s)}`}
                    style={{ flexGrow: counts[s] }}
                    title={`${s}: ${counts[s]}`}
                  />
                ) : null
              )}
            </div>
          )}

          <div className="log-tools">
            <div className="filters" role="group" aria-label="Filter by status">
              {['All', ...STATUSES].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter ${statusFilter === f ? 'on' : ''}`}
                  aria-pressed={statusFilter === f}
                  onClick={() => setStatusFilter(f)}
                >
                  {f}
                  <span className="filter-count">{counts[f]}</span>
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={15} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search assessments"
                aria-label="Search assessments"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>

          <ol className="log">
            {filtered.map((row, i) => {
              const dom = DOMAINS.find((d) => d.title === row.module) || DOMAINS[0];
              const DomIcon = dom.icon;
              const StatusIcon = STATUS_ICON[row.status] || CircleDashed;
              return (
                <li
                  key={row.id}
                  className={`entry ${row.isNew ? 'entry-new' : 'entry-in'}`}
                  style={{ '--d': dom.color, '--i': i }}
                >
                  <span className={`rail-dot ${slug(row.status)}`} aria-hidden="true" />
                  <div className="entry-card">
                    <span className="entry-icon" aria-hidden="true">
                      <DomIcon size={18} strokeWidth={1.75} />
                    </span>

                    <div className="entry-main">
                      <span className="entry-name">{row.name}</span>
                      <span className="entry-meta">
                        <span>{row.module}</span>
                        <span>{row.technology}</span>
                        <span>{row.environment}</span>
                      </span>
                    </div>

                    <div className="entry-status">
                      <span className={`badge ${slug(row.status)}`}>
                        <StatusIcon size={13} className={row.running ? 'spin' : undefined} aria-hidden="true" />
                        {row.status}
                      </span>
                      {row.status === 'In Progress' && (
                        <div
                          className="bar"
                          role="progressbar"
                          aria-label={`${row.name} progress`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={row.progress}
                        >
                          <span style={{ width: `${row.progress}%` }} />
                        </div>
                      )}
                    </div>

                    <time className="entry-date">{row.createdOn}</time>

                    <div className="entry-actions">
                      <button
                        type="button"
                        className="icon-btn run"
                        aria-label={`Run ${row.name}`}
                        title={row.progress > 0 && row.progress < 100 ? 'Resume' : 'Run'}
                        disabled={row.running}
                        onClick={() => handleRun(row.id)}
                      >
                        <Play size={16} />
                      </button>
                      <RowMenu name={row.name} onAction={(a) => handleRowAction(row, a)} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {filtered.length === 0 && (
            <div className="empty">
              <Inbox size={26} aria-hidden="true" />
              <p className="empty-title">No assessments match</p>
              <p className="empty-text">Clear the search or choose a different status.</p>
              <button
                type="button"
                className="filter on"
                onClick={() => {
                  setQuery('');
                  setStatusFilter('All');
                }}
              >
                Reset filters
              </button>
            </div>
          )}

          <p className="log-foot" aria-live="polite">
            Showing {filtered.length} of {rows.length}
          </p>
        </section>
      </div>
    </div>
  );
}