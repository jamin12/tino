import { toBlob } from "html-to-image";

export async function domToImageBlob(
  element: HTMLElement,
): Promise<Blob> {
  const blob = await toBlob(element, {
    backgroundColor: "#ffffff",
    pixelRatio: 2,
  });
  if (!blob) throw new Error("Image generation failed");
  return blob;
}
