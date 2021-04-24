import puppeteer from "puppeteer";
import $ from "cheerio";

const url = "https://kuliah.uajy.ac.id/login/index.php";
const username = "username here";
const password = "password here";
const matkul = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.focus("#username");
  await page.keyboard.type(username);

  await page.focus("#password");
  await page.keyboard.type(password);

  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2" });

  const matkulLinks = await page.$$eval(
    'a[data-parent-key="mycourses"]',
    (as) => as.map((a) => a.href)
  );
  matkulLinks.pop();

  for (let i = 0; i < matkulLinks.length; i++) {
    let course = {};
    let title = [];
    await page.goto(matkulLinks[i], { waitUntil: "networkidle2" });
    const html = await page.content();
    course.name = $("h1", html).text();
    $(".content", html).each((i, con) => {
      title.push($(con).find("h3 a").text());
    });
    console.log(title);
  }

  await browser.close();
})();
