import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

puppeteer.use(StealthPlugin());

function buildListingUrl(sale) {
  const city = sale.cityName.replace(/ /g, '-');
  return `https://www.estatesales.net/${sale.stateCode}/${city}/${sale.id}`;
}

function getSaleType(typeName) {
  if (typeName === 'EstateSales') return 'estate';
  if (typeName === 'OnlineOnlyAuctions') return 'auction';
  return 'estate';
}

function formatDates(dates) {
  if (!dates || dates.length === 0) return '';
  const start = new Date(dates[0].localStartDate._value);
  const end = new Date(dates[dates.length - 1].localEndDate._value);
  const opts = { month: 'short', day: 'numeric' };
  return start.toLocaleDateString('en-US', opts) + ' - ' + end.toLocaleDateString('en-US', opts);
}

async function scrapeAddress(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // EstateSales.net shows address in an element with itemprop="streetAddress" or similar
    const address = await page.evaluate(() => {
      const el =
        document.querySelector('[itemprop="streetAddress"]') ||
        document.querySelector('.address') ||
        document.querySelector('[class*="address"]');
      return el ? el.innerText.trim() : '';
    });
    return address;
  } catch {
    return '';
  }
}

async function scrape() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let byidsBody = null;

  const allRaw = new Map();

  page.on('response', async (response) => {
    const url = response.url();
    const ct = response.headers()['content-type'] || '';
    if (ct.includes('json') && url.includes('byids')) {
      try {
        const batch = JSON.parse(await response.text());
        batch.forEach(s => { if (!allRaw.has(s.id)) allRaw.set(s.id, s); });
        console.log(`  Captured batch of ${batch.length} (${allRaw.size} unique so far)`);
      } catch {}
    }
  });

  console.log('Loading EstateSales.net STL page...');
  await page.goto('https://www.estatesales.net/MO/St-Louis', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 3000));

  // Scroll to bottom repeatedly to trigger lazy-load pagination
  let prevCount = 0;
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2500));
    if (allRaw.size === prevCount) break; // no new listings loaded, stop
    prevCount = allRaw.size;
  }

  if (allRaw.size === 0) {
    await browser.close();
    console.error('ERROR: No listings captured. Try running again.');
    process.exit(1);
  }

  const rawSales = [...allRaw.values()];
  console.log('Total unique sales captured:', rawSales.length);

  const sales = [];
  for (const sale of rawSales) {
    const listingUrl = buildListingUrl(sale);
    let address = sale.address || '';

    if (!address) {
      console.log(`  Fetching address for: ${sale.name?.slice(0, 50)}`);
      address = await scrapeAddress(page, listingUrl);
      await new Promise(r => setTimeout(r, 1000)); // polite delay
    }

    sales.push({
      id: sale.id,
      name: sale.name,
      type: getSaleType(sale.typeName),
      orgName: sale.orgName,
      address,
      city: sale.cityName,
      state: sale.stateCode,
      zip: sale.postalCodeNumber,
      latitude: sale.latitude,
      longitude: sale.longitude,
      phone: sale.phoneNumbers?.[0] || '',
      website: sale.orgWebsite || '',
      auctionUrl: sale.auctionUrl || '',
      orgLogoUrl: sale.orgLogoUrl || '',
      pictureCount: sale.pictureCount,
      imageUrl: sale.mainPicture?.url || '',
      thumbnailUrl: sale.mainPicture?.thumbnailUrl || '',
      dateRange: formatDates(sale.dates),
      startDate: sale.dates?.[0]?.localStartDate?._value || '',
      endDate: sale.dates?.[sale.dates.length - 1]?.localEndDate?._value || '',
      isFeatured: sale.isLocallyFeatured || sale.isRegionallyFeaturedThisWeek || sale.isNationallyFeaturedThisWeek,
      listingUrl,
      scrapedAt: new Date().toISOString()
    });
  }

  await browser.close();

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outputDir = join(__dirname, 'public');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, 'sales.json');
  writeFileSync(outputPath, JSON.stringify(sales, null, 2));

  console.log(`Saved ${sales.length} sales to public/sales.json`);
  sales.slice(0, 3).forEach(s => {
    console.log(` - ${s.name} | ${s.address || '(no address)'} | ${s.dateRange}`);
  });
}

scrape().catch(console.error);
