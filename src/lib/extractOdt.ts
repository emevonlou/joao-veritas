import JSZip from "jszip";

export async function extractOdtText(
  buffer: Buffer
): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);

  const contentFile = zip.file("content.xml");

  if (!contentFile) {
    return "";
  }

  const xml = await contentFile.async("string");

  return xml
    .replace(/<text:line-break\s*\/>/g, "\n")
    .replace(/<\/text:p>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
