import type { Reflection, Template } from "../../backend";

export async function downloadPosterPng(
  reflection: Reflection,
  template: Template,
): Promise<void> {
  const posterElement = document.getElementById("poster-preview");
  if (!posterElement) {
    throw new Error("Poster preview element not found");
  }

  // Get the dimensions of the poster element
  const rect = posterElement.getBoundingClientRect();
  const width = rect.width * 2; // 2x for better quality
  const height = rect.height * 2;

  // Create a canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  // Scale for higher quality
  ctx.scale(2, 2);

  // Load the background image
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load template image"));
    img.src = template.previewImage;
  });

  // Draw background image
  ctx.drawImage(img, 0, 0, rect.width, rect.height);

  // Draw gradient overlays
  const gradientTop = ctx.createLinearGradient(0, 0, 0, rect.height * 0.3);
  gradientTop.addColorStop(0, "rgba(0, 0, 0, 0.4)");
  gradientTop.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradientTop;
  ctx.fillRect(0, 0, rect.width, rect.height * 0.3);

  const gradientBottom = ctx.createLinearGradient(
    0,
    rect.height * 0.7,
    0,
    rect.height,
  );
  gradientBottom.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradientBottom.addColorStop(1, "rgba(0, 0, 0, 0.6)");
  ctx.fillStyle = gradientBottom;
  ctx.fillRect(0, rect.height * 0.7, rect.width, rect.height * 0.3);

  // Set text properties
  ctx.fillStyle = "white";
  ctx.textBaseline = "top";

  // Draw title
  ctx.font = "bold 32px Inter, sans-serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const titleLines = wrapText(ctx, reflection.title, rect.width - 64);
  let yPos = 32;
  for (const line of titleLines) {
    ctx.fillText(line, 32, yPos);
    yPos += 40;
  }

  // Draw excerpt
  ctx.font = "18px Inter, sans-serif";
  const excerpt = getExcerpt(reflection.body);
  const excerptLines = wrapText(ctx, excerpt, rect.width - 64);
  yPos += 16;
  for (const line of excerptLines) {
    ctx.fillText(line, 32, yPos);
    yPos += 26;
  }

  // Draw separator line at bottom
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, rect.height - 60);
  ctx.lineTo(rect.width - 32, rect.height - 60);
  ctx.stroke();

  // Draw attribution
  ctx.font = "14px Inter, sans-serif";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 5;
  ctx.fillText("— Student Reflection", 32, rect.height - 40);

  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (!blob) {
      throw new Error("Failed to create image blob");
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Create meaningful filename
    const date = new Date().toISOString().split("T")[0];
    const sanitizedTitle = reflection.title
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase();
    link.download = `poster-${sanitizedTitle}-${date}.png`;

    link.href = url;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  }, "image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function getExcerpt(body: string): string {
  const sentences = body.match(/[^.!?]+[.!?]+/g) || [];

  if (sentences.length >= 2) {
    return sentences.slice(0, 2).join(" ").trim();
  }
  if (body.length > 200) {
    return `${body.substring(0, 200).trim()}...`;
  }

  return body;
}
