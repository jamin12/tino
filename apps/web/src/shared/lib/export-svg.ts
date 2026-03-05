// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractPrimaryFont(fontFamily: string): string {
  const first = fontFamily.split(",")[0].trim();
  return first.replace(/^['"]|['"]$/g, "");
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Defs collectors (clip-paths, filters, gradients) ────────────────────────

let defsContent = "";
let defIdCounter = 0;

function resetDefs() {
  defsContent = "";
  defIdCounter = 0;
}

function nextId(prefix: string): string {
  return `${prefix}-${++defIdCounter}`;
}

// ─── Layer naming ────────────────────────────────────────────────────────────

function getLayerName(el: HTMLElement): string {
  if (el.id) return el.id;
  const role = el.getAttribute("role");
  if (role) return role;
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;
  const dataName = el.getAttribute("data-name");
  if (dataName) return dataName;
  return el.tagName.toLowerCase();
}

// ─── Grouping heuristic ─────────────────────────────────────────────────────

const SEMANTIC_TAGS = new Set([
  "NAV", "HEADER", "FOOTER", "SECTION", "ARTICLE", "ASIDE", "MAIN",
  "TABLE", "THEAD", "TBODY", "TFOOT", "TR", "TD", "TH",
  "UL", "OL", "LI", "BUTTON", "A", "FORM", "LABEL",
]);

function shouldGroup(el: HTMLElement, style: CSSStyleDeclaration): boolean {
  if (el.id) return true;
  if (SEMANTIC_TAGS.has(el.tagName)) return true;

  const bg = style.backgroundColor;
  if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return true;

  if (
    (parseFloat(style.borderTopWidth) || 0) > 0 ||
    (parseFloat(style.borderBottomWidth) || 0) > 0 ||
    (parseFloat(style.borderLeftWidth) || 0) > 0 ||
    (parseFloat(style.borderRightWidth) || 0) > 0
  )
    return true;

  if (parseFloat(style.borderRadius) > 0) return true;
  if (style.boxShadow && style.boxShadow !== "none") return true;

  return false;
}

// ─── Text rendering ─────────────────────────────────────────────────────────

function getRenderedLines(
  textNode: Text,
): Array<{ text: string; rect: DOMRect }> {
  const lines: Array<{ text: string; rect: DOMRect }> = [];
  const range = document.createRange();
  const fullText = textNode.textContent || "";
  if (!fullText.trim()) return lines;

  let lineStart = 0;
  let curTop = -Infinity;

  for (let i = 0; i < fullText.length; i++) {
    range.setStart(textNode, i);
    range.setEnd(textNode, Math.min(i + 1, fullText.length));
    const r = range.getBoundingClientRect();
    if (r.height === 0 && r.width === 0) continue;

    if (curTop === -Infinity) {
      curTop = r.top;
      lineStart = i;
      continue;
    }

    if (Math.abs(r.top - curTop) > r.height * 0.3) {
      range.setStart(textNode, lineStart);
      range.setEnd(textNode, i);
      const lr = range.getBoundingClientRect();
      const lt = fullText.substring(lineStart, i).trimEnd();
      if (lt) lines.push({ text: lt, rect: lr });
      curTop = r.top;
      lineStart = i;
    }
  }

  if (lineStart < fullText.length) {
    range.setStart(textNode, lineStart);
    range.setEnd(textNode, fullText.length);
    const lr = range.getBoundingClientRect();
    const lt = fullText.substring(lineStart).trimEnd();
    if (lt) lines.push({ text: lt, rect: lr });
  }

  return lines;
}

function textAttrs(style: CSSStyleDeclaration): string {
  const a: string[] = [];
  a.push(`font-family="${extractPrimaryFont(style.fontFamily || "sans-serif")}"`);
  a.push(`font-size="${parseFloat(style.fontSize) || 16}px"`);
  const fw = style.fontWeight || "normal";
  if (fw !== "normal" && fw !== "400") a.push(`font-weight="${fw}"`);
  const fs = style.fontStyle || "normal";
  if (fs !== "normal") a.push(`font-style="${fs}"`);
  a.push(`fill="${style.color || "#000000"}"`);
  const ls = style.letterSpacing;
  if (ls && ls !== "normal" && ls !== "0px") a.push(`letter-spacing="${ls}"`);
  const td = style.textDecorationLine || style.textDecoration || "";
  if (td && td !== "none") a.push(`text-decoration="${td}"`);
  return a.join(" ");
}

// ─── Gradient parsing ────────────────────────────────────────────────────────

function parseLinearGradient(
  bgImage: string,
  x: number, y: number, w: number, h: number,
): { fill: string; def: string } | null {
  const match = bgImage.match(/linear-gradient\(([^)]+)\)/);
  if (!match) return null;

  const parts = match[1].split(",").map((s) => s.trim());
  let angle = 180; // default: to bottom
  let stopStart = 0;

  const dirMap: Record<string, number> = {
    "to top": 0, "to right": 90, "to bottom": 180, "to left": 270,
    "to top right": 45, "to bottom right": 135,
    "to bottom left": 225, "to top left": 315,
  };

  if (dirMap[parts[0]] !== undefined) {
    angle = dirMap[parts[0]];
    stopStart = 1;
  } else if (parts[0].endsWith("deg")) {
    angle = parseFloat(parts[0]);
    stopStart = 1;
  }

  const rad = ((angle - 90) * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 - Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;

  const id = nextId("grad");
  let stops = "";
  for (let i = stopStart; i < parts.length; i++) {
    const stopMatch = parts[i].match(/^(.+?)(?:\s+([\d.]+%))?$/);
    if (!stopMatch) continue;
    const color = stopMatch[1];
    const offset = stopMatch[2] || `${((i - stopStart) / Math.max(1, parts.length - stopStart - 1)) * 100}%`;
    stops += `<stop offset="${offset}" stop-color="${color}" />`;
  }

  const def = `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`;
  return { fill: `url(#${id})`, def };
}

// ─── Box shadow parsing ─────────────────────────────────────────────────────

function parseBoxShadow(shadow: string): { filterId: string; def: string } | null {
  if (!shadow || shadow === "none") return null;

  // Parse first shadow: offsetX offsetY blur spread color
  const match = shadow.match(
    /(?:rgba?\([^)]+\)|#[0-9a-f]+|\w+)\s|([+-]?\d+(?:\.\d+)?px)\s+([+-]?\d+(?:\.\d+)?px)\s+([+-]?\d+(?:\.\d+)?px)(?:\s+([+-]?\d+(?:\.\d+)?px))?\s+(rgba?\([^)]+\)|#[0-9a-f]+|\w+)/i,
  );

  if (!match) {
    // Try color-first format: color offsetX offsetY blur
    const match2 = shadow.match(
      /(rgba?\([^)]+\)|#[0-9a-f]+)\s+([+-]?\d+(?:\.\d+)?px)\s+([+-]?\d+(?:\.\d+)?px)\s+([+-]?\d+(?:\.\d+)?px)/i,
    );
    if (!match2) return null;

    const color = match2[1];
    const dx = parseFloat(match2[2]);
    const dy = parseFloat(match2[3]);
    const blur = parseFloat(match2[4]);

    const id = nextId("shadow");
    const def = `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${blur / 2}" flood-color="${color}" /></filter>`;
    return { filterId: id, def };
  }

  const dx = parseFloat(match[1]);
  const dy = parseFloat(match[2]);
  const blur = parseFloat(match[3]);
  const color = match[5];

  const id = nextId("shadow");
  const def = `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${blur / 2}" flood-color="${color}" /></filter>`;
  return { filterId: id, def };
}

// ─── Visual rendering ───────────────────────────────────────────────────────

function renderBackground(
  style: CSSStyleDeclaration,
  x: number, y: number, w: number, h: number,
): string {
  const bg = style.backgroundColor;
  const bgImage = style.backgroundImage;
  const r = parseFloat(style.borderRadius) || 0;

  let out = "";

  // Solid background color
  if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" rx="${r}" ry="${r}" />`;
  }

  // Gradient background
  if (bgImage && bgImage !== "none") {
    const grad = parseLinearGradient(bgImage, x, y, w, h);
    if (grad) {
      defsContent += grad.def;
      out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${grad.fill}" rx="${r}" ry="${r}" />`;
    }
  }

  return out;
}

function renderBorders(
  style: CSSStyleDeclaration,
  x: number, y: number, w: number, h: number,
): string {
  const bt = parseFloat(style.borderTopWidth) || 0;
  const br = parseFloat(style.borderRightWidth) || 0;
  const bb = parseFloat(style.borderBottomWidth) || 0;
  const bl = parseFloat(style.borderLeftWidth) || 0;

  const hasT = bt > 0 && style.borderTopStyle !== "none";
  const hasR = br > 0 && style.borderRightStyle !== "none";
  const hasB = bb > 0 && style.borderBottomStyle !== "none";
  const hasL = bl > 0 && style.borderLeftStyle !== "none";

  if (!hasT && !hasR && !hasB && !hasL) return "";

  // Uniform border → rounded rect
  if (
    hasT && hasR && hasB && hasL &&
    bt === br && br === bb && bb === bl &&
    style.borderTopColor === style.borderRightColor &&
    style.borderRightColor === style.borderBottomColor &&
    style.borderBottomColor === style.borderLeftColor
  ) {
    const r = parseFloat(style.borderRadius) || 0;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${style.borderTopColor}" stroke-width="${bt}" rx="${r}" ry="${r}" />`;
  }

  // Per-side
  let out = "";
  if (hasT) out += `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${style.borderTopColor}" stroke-width="${bt}" />`;
  if (hasR) out += `<line x1="${x + w}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="${style.borderRightColor}" stroke-width="${br}" />`;
  if (hasB) out += `<line x1="${x}" y1="${y + h}" x2="${x + w}" y2="${y + h}" stroke="${style.borderBottomColor}" stroke-width="${bb}" />`;
  if (hasL) out += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + h}" stroke="${style.borderLeftColor}" stroke-width="${bl}" />`;
  return out;
}

// ─── Special elements ───────────────────────────────────────────────────────

function renderCheckbox(
  el: HTMLInputElement,
  x: number, y: number, w: number, h: number,
): string {
  const size = Math.min(w, h);
  const cx = x + (w - size) / 2;
  const cy = y + (h - size) / 2;

  if (el.checked) {
    const sx = cx + size * 0.2, sy = cy + size * 0.5;
    const mx = cx + size * 0.4, my = cy + size * 0.72;
    const ex = cx + size * 0.8, ey = cy + size * 0.28;
    return (
      `<rect x="${cx}" y="${cy}" width="${size}" height="${size}" fill="#3b82f6" rx="3" ry="3" />` +
      `<polyline points="${sx},${sy} ${mx},${my} ${ex},${ey}" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`
    );
  }
  return `<rect x="${cx}" y="${cy}" width="${size}" height="${size}" fill="white" stroke="#d1d5db" stroke-width="1.5" rx="3" ry="3" />`;
}

function renderInputPlaceholder(
  el: HTMLInputElement | HTMLTextAreaElement,
  style: CSSStyleDeclaration,
  x: number, y: number, rootRect: DOMRect,
): string {
  if (el.value || !el.placeholder) return "";
  const rect = el.getBoundingClientRect();
  const fs = parseFloat(style.fontSize) || 14;
  const pl = parseFloat(style.paddingLeft) || 0;
  const pt = parseFloat(style.paddingTop) || 0;
  const tx = x + pl;
  const ty = rect.top - rootRect.top + pt + fs * 0.85;
  const font = extractPrimaryFont(style.fontFamily || "sans-serif");
  return `<text x="${tx}" y="${ty}" font-family="${font}" font-size="${fs}px" fill="#9ca3af">${esc(el.placeholder)}</text>`;
}

function renderSelect(
  el: HTMLSelectElement,
  style: CSSStyleDeclaration,
  x: number, y: number, h: number,
): string {
  const text = el.options[el.selectedIndex]?.text || "";
  if (!text) return "";
  const fs = parseFloat(style.fontSize) || 14;
  const pl = parseFloat(style.paddingLeft) || 0;
  const font = extractPrimaryFont(style.fontFamily || "sans-serif");
  return `<text x="${x + pl}" y="${y + h / 2 + fs * 0.35}" font-family="${font}" font-size="${fs}px" fill="${style.color || "#000"}">${esc(text)}</text>`;
}

// ─── Pseudo-element rendering ────────────────────────────────────────────────

function renderPseudoElement(
  el: HTMLElement,
  pseudo: "::before" | "::after",
  rootRect: DOMRect,
): string {
  const style = window.getComputedStyle(el, pseudo);
  const content = style.content;

  // No pseudo-element
  if (!content || content === "none" || content === "normal") return "";

  const display = style.display;
  if (display === "none") return "";

  const parentRect = el.getBoundingClientRect();
  const w = parseFloat(style.width) || 0;
  const h = parseFloat(style.height) || 0;

  // For positioned pseudo-elements, calculate position
  let px = parentRect.left - rootRect.left;
  let py = parentRect.top - rootRect.top;

  const position = style.position;
  if (position === "absolute" || position === "relative") {
    const left = parseFloat(style.left);
    const top = parseFloat(style.top);
    const right = parseFloat(style.right);
    const bottom = parseFloat(style.bottom);

    if (!isNaN(left)) px += left;
    else if (!isNaN(right)) px = px + parentRect.width - right - w;

    if (!isNaN(top)) py += top;
    else if (!isNaN(bottom)) py = py + parentRect.height - bottom - h;
  }

  let out = "";

  // Background
  const bg = style.backgroundColor;
  if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent" && w > 0 && h > 0) {
    const r = parseFloat(style.borderRadius) || 0;
    out += `<rect x="${px}" y="${py}" width="${w}" height="${h}" fill="${bg}" rx="${r}" ry="${r}" />`;
  }

  // Border
  if (w > 0 && h > 0) {
    out += renderBorders(style, px, py, w, h);
  }

  // Text content (strip quotes from CSS content value)
  const text = content.replace(/^["']|["']$/g, "");
  if (text && text !== " ") {
    const fs = parseFloat(style.fontSize) || 16;
    const attrs = textAttrs(style);
    const tx = px + (parseFloat(style.paddingLeft) || 0);
    const ty = py + (parseFloat(style.paddingTop) || 0) + fs * 0.85;
    out += `<text x="${tx}" y="${ty}" ${attrs}>${esc(text)}</text>`;
  }

  return out;
}

// ─── Main export ────────────────────────────────────────────────────────────

export async function domToFigmaSvg(
  element: HTMLElement,
): Promise<string> {
  resetDefs();
  const rootRect = element.getBoundingClientRect();
  const nameCount = new Map<string, number>();

  function uniqueName(base: string): string {
    const count = (nameCount.get(base) || 0) + 1;
    nameCount.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  }

  function traverse(node: Node): string {
    // ── Text nodes ──
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      if (!textNode.textContent?.trim()) return "";

      const parent = node.parentElement;
      if (!parent || parent.tagName === "STYLE" || parent.tagName === "SCRIPT" || parent.tagName === "NOSCRIPT") return "";

      const style = window.getComputedStyle(parent);
      const fs = parseFloat(style.fontSize) || 16;
      const attrs = textAttrs(style);
      const lines = getRenderedLines(textNode);

      let out = "";
      for (const line of lines) {
        const lx = line.rect.left - rootRect.left;
        const ly = line.rect.top - rootRect.top + fs * 0.85;
        out += `<text x="${lx}" y="${ly}" ${attrs}>${esc(line.text)}</text>`;
      }
      return out;
    }

    // ── Element nodes ──
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const el = node as HTMLElement;
    if (el.tagName === "STYLE" || el.tagName === "SCRIPT" || el.tagName === "NOSCRIPT") return "";

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) return "";

    const rect = el.getBoundingClientRect();
    const x = rect.left - rootRect.left;
    const y = rect.top - rootRect.top;
    const w = rect.width;
    const h = rect.height;

    // ── Build inner content ──
    let inner = "";

    // Own visuals: background + borders
    inner += renderBackground(style, x, y, w, h);
    inner += renderBorders(style, x, y, w, h);

    // Box shadow
    const shadowResult = parseBoxShadow(style.boxShadow);
    let filterAttr = "";
    if (shadowResult) {
      defsContent += shadowResult.def;
      filterAttr = ` filter="url(#${shadowResult.filterId})"`;
    }

    // ── Special leaf elements (don't recurse) ──

    if (el.tagName === "INPUT" && (el as HTMLInputElement).type === "checkbox") {
      inner += renderCheckbox(el as HTMLInputElement, x, y, w, h);
    } else if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      inner += renderInputPlaceholder(el as HTMLInputElement, style, x, y, rootRect);
    } else if (el.tagName === "SELECT") {
      inner += renderSelect(el as HTMLSelectElement, style, x, y, h);
    } else if (el.tagName.toUpperCase() === "SVG") {
      const color = style.color || "#000000";
      let html = el.outerHTML.replace(/currentColor/g, color);
      // Override width/height attributes to match CSS-computed size
      html = html.replace(/\bwidth="[^"]*"/, `width="${w}"`);
      html = html.replace(/\bheight="[^"]*"/, `height="${h}"`);
      inner += `<g transform="translate(${x}, ${y})">${html}</g>`;
    } else if (el.tagName === "IMG") {
      inner += `<image x="${x}" y="${y}" width="${w}" height="${h}" href="${(el as HTMLImageElement).src}" />`;
    } else {
      // ── Pseudo-elements ::before and ::after ──
      inner += renderPseudoElement(el, "::before", rootRect);

      // ── Recurse children ──
      for (const child of el.childNodes) {
        inner += traverse(child);
      }

      inner += renderPseudoElement(el, "::after", rootRect);
    }

    // ── Wrap in group if visually significant ──
    if (!inner) return "";

    const opacity = parseFloat(style.opacity);
    const opacityAttr = opacity < 1 && opacity > 0 ? ` opacity="${opacity}"` : "";

    // ── Overflow clipping ──
    const overflow = style.overflow || style.overflowX || style.overflowY;
    let clipStart = "";
    let clipEnd = "";
    if (overflow === "hidden" || overflow === "clip" || overflow === "scroll" || overflow === "auto") {
      const clipId = nextId("clip");
      const r = parseFloat(style.borderRadius) || 0;
      defsContent += `<clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" /></clipPath>`;
      clipStart = `<g clip-path="url(#${clipId})">`;
      clipEnd = `</g>`;
    }

    if (shouldGroup(el, style)) {
      const name = uniqueName(getLayerName(el));
      return `${clipStart}<g id="${esc(name)}"${opacityAttr}${filterAttr}>${inner}</g>${clipEnd}`;
    }

    // Not grouped — but still apply opacity/filter/clip if needed
    if (opacityAttr || filterAttr || clipStart) {
      return `${clipStart}<g${opacityAttr}${filterAttr}>${inner}</g>${clipEnd}`;
    }

    return inner;
  }

  const content = traverse(element);
  const defs = defsContent ? `<defs>${defsContent}</defs>` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${rootRect.width}" height="${rootRect.height}" viewBox="0 0 ${rootRect.width} ${rootRect.height}">
${defs}
${content}
</svg>`;
}
