import fs from "fs";
import path from "path";
import React from "react";

export default function Home() {
  // Caminho do arquivo CSV
  const filePath = path.join(process.cwd(), "public", "quotes.csv");
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Converter CSV para array de objetos
  const lines = fileContent.split("\n").slice(1); // Ignorar cabeçalho
  const quotes = lines.map((line) => {
    const obj = line.split(";");
    return {
      id: +obj[0],
      quote: obj[1].replace(/"/g, ""),
      author: obj[2].replace(/"/g, ""),
    };
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  
  // Create a deterministic but different rotation each month
  const totalQuotes = quotes.length;
  const yearMonthSeed = (year * 12 + month) % totalQuotes;
  const rotationIndex = (yearMonthSeed + day - 1) % totalQuotes;

  const todayQuote = quotes[rotationIndex];

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center", maxWidth: "600px" }}>
        {todayQuote?.quote}
      </h1>
      <p>- {todayQuote?.author}</p>
    </main>
  );
}
