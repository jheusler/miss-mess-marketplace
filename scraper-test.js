const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function test() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to EstateSales.net...');
  await page.goto('https://www.estatesales.net/missouri/st-louis', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  const title = await page.title();
  console.log('Page title:', title);

  const html = await page.content();
  console.log('Got HTML, length:', html.length);
  console.log(html.includes('estate') ? '✅ Found estate content' : '❌ No estate content — still blocked');

  await browser.close();
  console.log('Done.');
}

test().catch(console.error);
