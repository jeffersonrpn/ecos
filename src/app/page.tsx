import fs from "fs";
import path from "path";

export default function Home() {
  // Caminho do arquivo CSV
  const filePath = path.join(process.cwd(), "public", "quotes.csv");
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Converter CSV para array de objetos
  const lines = fileContent.split("\n").slice(1); // Ignorar cabeçalho
  const quotes = lines.map((line) => {
    const [quote, author] = line
      .split('","')
      .map((text) => text.replace(/(^"|"$)/g, ""));
    return { quote, author };
  });

  // Criar um índice baseado na data atual (YYYYMMDD)
  const todayIndex = parseInt(
    new Date().toISOString().slice(0, 10).replace(/-/g, ""),
    10
  );

  // Garantir que o índice esteja dentro dos limites do array de frases
  const quoteIndex = todayIndex % quotes.length;
  const todayQuote = quotes[quoteIndex];

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
        {todayQuote.quote}
      </h1>
      <p>- {todayQuote.author}</p>
    </main>
  );
}
