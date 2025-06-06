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
    let index = 0;

    $("blockquote").each((_, element) => {
      const quote = $(element).find("p").first().text().trim();
      const author = $(element).find("p.autor").text().trim();
      if (quote) {
        const q = quote.replace(/"/g, "").replace(/\n/g, "<br>");
        const entry = author
          ? `"${q}";"${author.replace(/"/g, "")}"`
          : `"${q}";"--"`;
        quotes.push(`${index};${entry}`);
        index++;
      }
    });

    // Criar diretório se não existir
    if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
      fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    }

    // Escrever no arquivo CSV
    const header = "id,quote,author\n";
    fs.writeFileSync(OUTPUT_FILE, header + quotes.join("\n"), "utf8");
    console.log(`Arquivo salvo em: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Erro ao buscar as frases:", error.message);
  }
}

fetchQuotes();
