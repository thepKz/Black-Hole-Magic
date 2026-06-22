'use client';

// ---------------------------------------------------------------------------
// Dev-only live tuning panel for the three.js scenes (About + GameCompanion).
//
// It mounts a floating slider panel that mutates the LIVE three.js objects in
// place — bloom, tone-mapping exposure, the emissive tint/intensity on the
// model materials, and each point light's colour + intensity. Drag a slider and
// the scene updates immediately (it calls requestRender() so on-demand renderers
// repaint).
//
// Gating: only shows in dev (NODE_ENV !== 'production') OR when the URL has a
// `?tune` query param. It NEVER renders for a normal production visitor, so the
// customer never sees it. Nothing is imported by the panel into the prod bundle
// beyond this tiny file.
//
// Workflow: open the page, drag sliders until it looks right, click "Copy
// values" — the current numbers land on your clipboard as a ready-to-paste
// block. Paste those back as the locked defaults in the component and remove
// nothing else.
// ---------------------------------------------------------------------------

// We keep these structurally typed (no `three` import) so this module stays
// dependency-light and the scene files pass in their already-loaded objects.
type Vec2Like = { x: number; y: number };

interface BloomPassLike {
  strength: number;
  radius: number;
  threshold: number;
}

interface RendererLike {
  toneMappingExposure: number;
}

interface ColorLike {
  getHexString(): string;
  setHex(hex: number): unknown;
  copy(c: ColorLike): unknown;
}

interface MaterialLike {
  emissive?: ColorLike;
  emissiveIntensity?: number;
  needsUpdate: boolean;
}

interface LightLike {
  color: ColorLike;
  intensity: number;
}

export interface TuningTargets {
  /** Human label shown in the panel header, e.g. "About 3D" / "Game Companion". */
  label: string;
  bloomPass: BloomPassLike & { resolution?: Vec2Like };
  renderer: RendererLike;
  /** Materials carrying the emissive tint that should track the tint colour. */
  materials: MaterialLike[];
  /** The shared tint colour object applied to every material's `emissive`. */
  tintColor: ColorLike;
  /** Named point/directional lights to expose colour + intensity for. */
  lights: { name: string; light: LightLike }[];
  /** Called after any mutation so on-demand renderers repaint (composer.render). */
  requestRender: () => void;
}

export function tuningEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NODE_ENV !== 'production') return true;
  return new URLSearchParams(window.location.search).has('tune');
}

// Hex helpers — the panel uses <input type="color"> which speaks "#rrggbb".
const toHexInput = (c: ColorLike) => `#${c.getHexString()}`;
const fromHexInput = (s: string) => parseInt(s.replace('#', ''), 16) || 0;

/**
 * Mounts the panel for one scene. Returns a disposer; call it on unmount.
 * No-op (returns a noop disposer) when tuning is disabled.
 */
export function mount3DTuningPanel(targets: TuningTargets): () => void {
  if (!tuningEnabled() || typeof document === 'undefined') {
    return () => {};
  }

  const { label, bloomPass, renderer, materials, tintColor, lights, requestRender } = targets;

  const panel = document.createElement('div');
  panel.className = 'tuning-panel-3d';
  // Stack multiple panels (About + Companion can both be open) by counting
  // existing ones and shifting this one down.
  const existing = document.querySelectorAll('.tuning-panel-3d').length;
  Object.assign(panel.style, {
    position: 'fixed',
    top: `${12 + existing * 8}px`,
    right: '12px',
    zIndex: '2147483647',
    width: '258px',
    maxHeight: '86vh',
    overflowY: 'auto',
    padding: '12px 14px 14px',
    borderRadius: '12px',
    background: 'rgba(10, 8, 20, 0.92)',
    border: '1px solid rgba(155, 124, 255, 0.4)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 0 24px rgba(108,92,231,0.25)',
    backdropFilter: 'blur(8px)',
    color: '#e9e6ff',
    font: '12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace',
    userSelect: 'none',
  } as Partial<CSSStyleDeclaration>);

  const rows: string[] = [];
  const bind: Array<() => void> = [];

  // --- header (drag handle + collapse) ---
  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    cursor: 'move',
    fontWeight: '700',
    letterSpacing: '0.04em',
    color: '#c7b5ff',
  } as Partial<CSSStyleDeclaration>);
  header.innerHTML = `<span>🎛 ${label}</span>`;
  const collapseBtn = document.createElement('button');
  collapseBtn.textContent = '–';
  Object.assign(collapseBtn.style, {
    background: 'transparent',
    border: '1px solid rgba(155,124,255,0.4)',
    color: '#c7b5ff',
    borderRadius: '6px',
    width: '22px',
    height: '22px',
    cursor: 'pointer',
    lineHeight: '1',
  } as Partial<CSSStyleDeclaration>);
  header.appendChild(collapseBtn);
  panel.appendChild(header);

  const body = document.createElement('div');
  panel.appendChild(body);

  let collapsed = false;
  collapseBtn.onclick = () => {
    collapsed = !collapsed;
    body.style.display = collapsed ? 'none' : '';
    collapseBtn.textContent = collapsed ? '+' : '–';
  };

  // --- drag the panel around so it never blocks the model ---
  let dragging = false;
  let dx = 0;
  let dy = 0;
  header.addEventListener('pointerdown', (e) => {
    if (e.target === collapseBtn) return;
    dragging = true;
    const r = panel.getBoundingClientRect();
    dx = e.clientX - r.left;
    dy = e.clientY - r.top;
    header.setPointerCapture(e.pointerId);
  });
  header.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    panel.style.left = `${e.clientX - dx}px`;
    panel.style.top = `${e.clientY - dy}px`;
    panel.style.right = 'auto';
  });
  header.addEventListener('pointerup', () => {
    dragging = false;
  });

  // Build a labelled slider row that mutates `obj[key]` live.
  const slider = (
    title: string,
    get: () => number,
    set: (v: number) => void,
    min: number,
    max: number,
    step: number
  ) => {
    const row = document.createElement('label');
    Object.assign(row.style, { display: 'block', margin: '9px 0' } as Partial<CSSStyleDeclaration>);
    const head = document.createElement('div');
    Object.assign(head.style, {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '3px',
    } as Partial<CSSStyleDeclaration>);
    const name = document.createElement('span');
    name.textContent = title;
    const val = document.createElement('span');
    val.style.color = '#9b7cff';
    val.textContent = get().toFixed(step < 0.01 ? 3 : 2);
    head.append(name, val);
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(get());
    Object.assign(input.style, { width: '100%', accentColor: '#9b7cff' } as Partial<CSSStyleDeclaration>);
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      set(v);
      val.textContent = v.toFixed(step < 0.01 ? 3 : 2);
      requestRender();
    });
    row.append(head, input);
    body.appendChild(row);
    bind.push(() => {
      input.value = String(get());
      val.textContent = get().toFixed(step < 0.01 ? 3 : 2);
    });
  };

  const colorRow = (title: string, get: () => ColorLike, onChange: (hex: number) => void) => {
    const row = document.createElement('label');
    Object.assign(row.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '7px 0',
    } as Partial<CSSStyleDeclaration>);
    const name = document.createElement('span');
    name.textContent = title;
    const input = document.createElement('input');
    input.type = 'color';
    input.value = toHexInput(get());
    Object.assign(input.style, {
      width: '34px',
      height: '22px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
    } as Partial<CSSStyleDeclaration>);
    input.addEventListener('input', () => {
      onChange(fromHexInput(input.value));
      requestRender();
    });
    row.append(name, input);
    body.appendChild(row);
  };

  const section = (title: string) => {
    const h = document.createElement('div');
    h.textContent = title;
    Object.assign(h.style, {
      marginTop: '12px',
      marginBottom: '2px',
      paddingBottom: '3px',
      borderBottom: '1px solid rgba(155,124,255,0.22)',
      color: '#8b7ae8',
      fontWeight: '700',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      fontSize: '10px',
    } as Partial<CSSStyleDeclaration>);
    body.appendChild(h);
  };

  // ── Bloom ──────────────────────────────────────────────────────────────
  section('Bloom');
  slider('strength', () => bloomPass.strength, (v) => (bloomPass.strength = v), 0, 3, 0.001);
  slider('radius', () => bloomPass.radius, (v) => (bloomPass.radius = v), 0, 2, 0.001);
  slider('threshold', () => bloomPass.threshold, (v) => (bloomPass.threshold = v), 0, 1, 0.001);

  // ── Tone / exposure ────────────────────────────────────────────────────
  section('Exposure');
  slider(
    'toneMappingExposure',
    () => renderer.toneMappingExposure,
    (v) => (renderer.toneMappingExposure = v),
    0,
    4,
    0.01
  );

  // ── Emissive tint ──────────────────────────────────────────────────────
  section('Emissive tint');
  colorRow(
    'tint color',
    () => tintColor,
    (hex) => {
      tintColor.setHex(hex);
      materials.forEach((m) => {
        if (m.emissive) {
          m.emissive.copy(tintColor);
          m.needsUpdate = true;
        }
      });
    }
  );
  if (materials.length > 0) {
    slider(
      'emissiveIntensity',
      () => materials[0].emissiveIntensity ?? 1,
      (v) => {
        materials.forEach((m) => {
          if ('emissiveIntensity' in m) {
            m.emissiveIntensity = v;
            m.needsUpdate = true;
          }
        });
      },
      0,
      8,
      0.01
    );
  }

  // ── Lights ─────────────────────────────────────────────────────────────
  if (lights.length) {
    section('Lights');
    lights.forEach(({ name, light }) => {
      colorRow(`${name} color`, () => light.color, (hex) => light.color.setHex(hex));
      slider(`${name} intensity`, () => light.intensity, (v) => (light.intensity = v), 0, 20, 0.01);
    });
  }

  // ── Copy button ────────────────────────────────────────────────────────
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋 Copy values';
  Object.assign(copyBtn.style, {
    marginTop: '14px',
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid rgba(155,124,255,0.5)',
    background: 'linear-gradient(135deg, rgba(108,92,231,0.6), rgba(75,34,216,0.6))',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
  } as Partial<CSSStyleDeclaration>);
  copyBtn.onclick = () => {
    const lightLines = lights
      .map(
        ({ name, light }) =>
          `  ${name}: 0x${light.color.getHexString()}  intensity ${light.intensity.toFixed(2)}`
      )
      .join('\n');
    const dump = [
      `// === ${label} tuned values ===`,
      `bloom.strength  = ${bloomPass.strength.toFixed(3)};`,
      `bloom.radius    = ${bloomPass.radius.toFixed(3)};`,
      `bloom.threshold = ${bloomPass.threshold.toFixed(3)};`,
      `renderer.toneMappingExposure = ${renderer.toneMappingExposure.toFixed(2)};`,
      `tintColor = 0x${tintColor.getHexString()};`,
      `emissiveIntensity = ${(materials[0]?.emissiveIntensity ?? 1).toFixed(2)};`,
      lights.length ? `// lights:\n${lightLines}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    navigator.clipboard?.writeText(dump).then(
      () => {
        copyBtn.textContent = '✓ Copied!';
        window.setTimeout(() => (copyBtn.textContent = '📋 Copy values'), 1400);
      },
      () => {
        copyBtn.textContent = '⚠ Clipboard blocked — see console';
        // eslint-disable-next-line no-console
        console.log(dump);
      }
    );
  };
  body.appendChild(copyBtn);

  void rows; // reserved for future row registry

  document.body.appendChild(panel);

  return () => {
    panel.remove();
  };
}
