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

async function scrape() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let byidsBody = null;

  page.on('response', async (response) => {
    const url = response.url();
    const ct = response.headers()['content-type'] || '';
    if (ct.includes('json') && url.includes('byids')) {
      try {
        const text = await response.text();
        byidsBody = text;
        console.log('Captured byids API response');
      } catch (e) {}
    }
  });

  console.log('Loading EstateSales.net STL page...');
  await page.goto('https://www.estatesales.net/MO/St-Louis', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 4000));
  await browser.close();

  if (!byidsBody) {
    console.error('ERROR: No byids API response captured. Try running again.');
    process.exit(1);
  }

  const rawSales = JSON.parse(byidsBody);
  console.log('Total sales captured:', rawSales.length);

  const sales = rawSales.map(sale => ({
    id: sale.id,
    name: sale.name,
    type: getSaleType(sale.typeName),
    orgName: sale.orgName,
    address: sale.address || '',
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
    listingUrl: buildListingUrl(sale),
    scrapedAt: new Date().toISOString()
  }));

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outputDir = join(__dirname, 'public');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, 'sales.json');
  writeFileSync(outputPath, JSON.stringify(sales, null, 2));

  console.log('Saved ' + sales.length + ' sales to public/sales.json');
  sales.slice(0, 3).forEach(s => {
    console.log(' -', s.name, '|', s.city, '|', s.dateRange);
  });
}

scrape().catch(console.error);