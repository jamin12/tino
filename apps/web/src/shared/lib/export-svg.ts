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

// ─── Visual rendering ───────────────────────────────────────────────────────

function renderBackground(
  style: CSSStyleDeclaration,
  x: number, y: number, w: number, h: number,
): string {
  const bg = style.backgroundColor;
  if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") return "";
  const r = parseFloat(style.borderRadius) || 0;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" rx="${r}" ry="${r}" />`;
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

// ─── Main export ────────────────────────────────────────────────────────────

export async function domToFigmaSvg(
  element: HTMLElement,
): Promise<string> {
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
      // ── Recurse children ──
      for (const child of el.childNodes) {
        inner += traverse(child);
      }
    }

    // ── Wrap in group if visually significant ──
    if (!inner) return "";

    const opacity = parseFloat(style.opacity);
    const opacityAttr = opacity < 1 && opacity > 0 ? ` opacity="${opacity}"` : "";

    if (shouldGroup(el, style)) {
      const name = uniqueName(getLayerName(el));
      return `<g id="${esc(name)}"${opacityAttr}>${inner}</g>`;
    }

    // Not grouped — but still apply opacity if needed
    if (opacityAttr) {
      return `<g${opacityAttr}>${inner}</g>`;
    }

    return inner;
  }

  const content = traverse(element);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${rootRect.width}" height="${rootRect.height}" viewBox="0 0 ${rootRect.width} ${rootRect.height}">
${content}
</svg>`;
}
