import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "https://www.amazon.com.br/s?k=mangas&rh=n%3A7842710011&__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&linkCode=ll2&tag=minhacoleca09-20&linkId=e3830a2b0c7a87636099814e501535ed&language=pt_BR&ref_=as_li_ss_tl"
    );
    const html = await page.content(); // Obter o conteúdo HTML da página
    const $ = cheerio.load(html); // Carregar o conteúdo HTML com Cheerio

    // Extrair os dados necessários usando seletores CSS
	const products = $(".s-result-item")
	.map((index, element) => {
	  // Verificar se o produto é patrocinado
	  const isSponsored = $(element).find(".puis-label-popover").length > 0;
	  if (isSponsored) {
		return null; // Ignorar produtos patrocinados
	  }

	  const titleElement = $(element).find("h2 a span");
	  const title = titleElement.text().trim();

	  const authorElement = $(element).find(".a-row.a-size-base.a-color-secondary .a-size-base:nth-child(2)");
	  const author = authorElement.text().trim() || "Autor desconhecido";

	  const priceElement = $(element).find(".a-price .a-offscreen").first();
	  const price = priceElement.text().trim() || "Preço não disponível";

	  const discountElement = $(element).find(".a-price.a-text-price .a-offscreen").first();
	  const discount = discountElement.text().trim() || "Sem desconto";

	  const imageElement = $(element).find(".s-image");
	  const imageUrl = imageElement.attr("src");

	  const linkElement = $(element).find("h2 a");
	  const link = linkElement.attr("href");

	  // Extrair o 'dp' da URL do link
	  const dpMatch = link && link.match(/\/dp\/([^\/]+)/);
	  const dp = dpMatch ? dpMatch[1] : null;

	  if (!title || !price || !imageUrl) {
		return null;
	  }

	  return {
		title,
		author,
		price,
		discount,
		imageUrl,
		link: `https://www.amazon.com.br/dp/${dp}?tag=minhacoleca09-20&linkCode=ogi&th=1&psc=1`
	};
	})
	.get()
	.filter(product => product !== null); // Filtrar produtos não patrocinados

  return NextResponse.json({ products });
} catch (error) {
  console.error("Erro ao obter produtos:", error);
  return NextResponse.json(
	{ error: "Something went wrong" },
	{ status: 500 }
  );
} finally {
  if (browser) {
	await browser.close();
  }
}
}