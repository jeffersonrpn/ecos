const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const URL = "https://www.pensador.com/365_frases_motivacionais/";
const OUTPUT_FILE = path.join(__dirname, "../public/quotes.csv");

async function fetchQuotes() {
  try {
    const { data } = await axios.get(URL);
    const $ = cheerio.load(data);
    const quotes = [];

    let baseDate = new Date();
    let index = 1;

    $("blockquote").each((index, element) => {
      const quote = $(element).find("p").first().text().trim();
      const author = $(element).find("p.autor").text().trim();
      if (quote) {
        const timestamp = new Date(baseDate);
        timestamp.setDate(baseDate.getDate() + index);
        const formattedDate = timestamp
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "");
        const q = quote.replace(/"/g, "").replace(/\n/g, "<br>");
        const entry = author
          ? `"${q}","${author.replace(/"/g, "")}"`
          : `"${q}","--"`;
        quotes.push(`${index},${formattedDate},${entry}`);
        index++;
      }
    });
    // Criar diretório se não existir
    if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
      fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    }

    // Escrever no arquivo CSV
    const header = "id,index,quote,author\n";
    fs.writeFileSync(OUTPUT_FILE, header + quotes.join("\n"), "utf8");
    console.log(`Arquivo salvo em: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Erro ao buscar as frases:", error.message);
  }
}

fetchQuotes();
