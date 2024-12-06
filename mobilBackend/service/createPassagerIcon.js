import express from "express";
import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";

function createIconWithNumber(number, filename) {
  const canvas = createCanvas(32, 32);
  const ctx = canvas.getContext("2d");

  // Desenhar um círculo
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, 2 * Math.PI);
  ctx.closePath();
  //   ctx.fillStyle = "#F00"; // Cor de fundo do círculo
  //   ctx.fill();

  // Adicionar o número
  ctx.fillStyle = "#0000ff"; // Cor do texto
  ctx.font = "bold 50px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("☻", 16, 11, 64);

  ctx.fillStyle = "#FF0000"; // Cor do texto
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, 27, 25);

  // Salvar o arquivo no servidor
  const out = fs.createWriteStream(path.join("icons", filename.replace(/\s+/g, "_") + ".png"));
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  return new Promise((resolve, reject) => {
    out.on("finish", () => resolve(filename.replace(/\s+/g, "_") + ".png"));
    out.on("error", (err) => reject(err));
  });
}
export { createIconWithNumber };
