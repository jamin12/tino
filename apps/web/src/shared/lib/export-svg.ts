export async function domToFigmaSvg(element: HTMLElement): Promise<string> {
  const rootRect = element.getBoundingClientRect();

  let svgContent = "";

  function traverse(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || "";
      if (!text) return;

      const parent = node.parentElement;
      if (
        !parent ||
        parent.tagName === "STYLE" ||
        parent.tagName === "SCRIPT" ||
        parent.tagName === "NOSCRIPT"
      )
        return;

      const style = window.getComputedStyle(parent);

      const range = document.createRange();
      range.selectNode(node);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) return;

      // Extract colors and typography
      const fill = style.color || "#000000";
      const fontSize = parseFloat(style.fontSize) || 16;
      const fontFamily = (style.fontFamily || "sans-serif").replace(/"/g, "'");
      const fontWeight = style.fontWeight || "normal";

      // Calculate position relative to root
      const x = rect.left - rootRect.left;
      // In SVG, the y coordinate for text is the baseline.
      // Approximating baseline by adding font size to top.
      const y = rect.top - rootRect.top + fontSize * 0.85;

      // Escape HTML entities
      const safeText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      svgContent += `\n  <text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}px" font-weight="${fontWeight}" fill="${fill}">${safeText}</text>`;
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // Don't render internal or hidden nodes
      if (
        el.tagName === "STYLE" ||
        el.tagName === "SCRIPT" ||
        el.tagName === "NOSCRIPT"
      )
        return;

      const style = window.getComputedStyle(el);
      // Skip invisible elements
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        parseFloat(style.opacity) === 0
      )
        return;

      const rect = el.getBoundingClientRect();
      const x = rect.left - rootRect.left;
      const y = rect.top - rootRect.top;

      // Draw background if exists
      const bgColor = style.backgroundColor;
      if (
        bgColor &&
        bgColor !== "rgba(0, 0, 0, 0)" &&
        bgColor !== "transparent"
      ) {
        const radius = parseFloat(style.borderRadius) || 0;
        svgContent += `\n  <rect x="${x}" y="${y}" width="${rect.width}" height="${rect.height}" fill="${bgColor}" rx="${radius}" ry="${radius}" />`;
      }

      // Draw borders if exists
      const borderTopWidth = parseFloat(style.borderTopWidth);
      if (borderTopWidth > 0 && style.borderTopStyle !== "none") {
        const borderColor = style.borderTopColor;
        const radius = parseFloat(style.borderRadius) || 0;
        svgContent += `\n  <rect x="${x}" y="${y}" width="${rect.width}" height="${rect.height}" fill="none" stroke="${borderColor}" stroke-width="${borderTopWidth}" rx="${radius}" ry="${radius}" />`;
      }

      // If it's an SVG, we can embed it directly
      if (el.tagName.toUpperCase() === "SVG") {
        const innerSvg = el.outerHTML;
        svgContent += `\n  <g transform="translate(${x}, ${y})">${innerSvg}</g>`;
        return; // Don't traverse inside SVG since it's already an SVG tree
      }

      // If it's an image, embed it
      if (el.tagName === "IMG") {
        const img = el as HTMLImageElement;
        svgContent += `\n  <image x="${x}" y="${y}" width="${rect.width}" height="${rect.height}" href="${img.src}" />`;
        return;
      }

      // Recursively process children
      Array.from(node.childNodes).forEach(traverse);
    }
  }

  traverse(element);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${rootRect.width}" height="${rootRect.height}" viewBox="0 0 ${rootRect.width} ${rootRect.height}">
${svgContent}
</svg>`;
}
