const fs = require("fs");
const hsb = require("handlebars");
const path = require("path");
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");

export default async (req, res) => {
  let data = JSON.parse(req.body, "utf-8");

  const template = fs.readFileSync(
    path.resolve("./public/template.hbs"),
    "utf-8"
  );
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  });

  const html = await hsb.compile(template)(data);
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  res.setHeader("Content-type", "application/pdf");
  res.end(pdf);
};
