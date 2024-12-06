import express from "express";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

async function createIconWithNumber(number, filename) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  return await loadImage(__dirname + "\\default.png")
    .then((image) => {
      // Criar um canvas com as dimensões da imagem
      const canvas = createCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");

      // Desenhar a imagem carregada no canvas
      ctx.drawImage(image, 0, 0);

      ctx.fillStyle = "#0000FF"; // Cor do texto
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(number, 21, 23);

      // Salvar a imagem modificada no disco
      const out = fs.createWriteStream(path.join("icons", filename.replace(/\s+/g, "_") + ".png"));
      const stream = canvas.createPNGStream();
      stream.pipe(out);

    })
    .catch((err) => {
      console.error("Erro ao carregar ou processar a imagem:", err);
    });
}
export { createIconWithNumber };
