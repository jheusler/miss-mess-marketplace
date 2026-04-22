// scraper.mjs
// Scrapes EstateSales.net STL listings via API interception
// Run with: node scraper.mjs
// Output: public/sales.json

import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function buildListingUrl(sale) {
  const city = sale.cityName.replace(/ /g, '-');
  return 'https://www.estatesales.net/' + sale.stateCode + '/' + city + '/' + sale.id;
}

function getSaleType(typeName) {
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
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  let byidsBody = null;

  // Intercept API response containing sale listings
  page.on('response', async (response) => {
    const url = response.url();
    const ct = response.headers()['content-type'] || '';
    if (ct.includes('json') && url.includes('byids')) {
      try {
        byidsBody = await response.text();
        console.log('Captured byids API response');
      } catch (e) {
        console.error('Error reading response:', e.message);
      }
    }
  });

  try {
    console.log('Loading EstateSales.net STL page...');
    await page.goto('https://www.estatesales.net/MO/St-Louis', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    await new Promise(r => setTimeout(r, 5000));
  } catch (e) {
    console.error('Navigation error:', e.message);
  } finally {
    await browser.close();
  }

  if (!byidsBody) {
    console.error('ERROR: No byids response captured. Try again.');
    process.exit(1);
  }

  const rawSales = JSON.parse(byidsBody);
  console.log('Sales captured:', rawSales.length);

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
    phone: sale.phoneNumbers ? (sale.phoneNumbers[0] || '') : '',
    imageUrl: sale.mainPicture ? (sale.mainPicture.url || '') : '',
    thumbnailUrl: sale.mainPicture ? (sale.mainPicture.thumbnailUrl || '') : '',
    dateRange: formatDates(sale.dates),
    startDate: sale.dates && sale.dates[0] ? sale.dates[0].localStartDate._value || '' : '',
    endDate: sale.dates && sale.dates.length ? sale.dates[sale.dates.length-1].localEndDate._value || '' : '',
    isFeatured: !!(sale.isLocallyFeatured || sale.isRegionallyFeaturedThisWeek || sale.isNationallyFeaturedThisWeek),
    listingUrl: buildListingUrl(sale),
    scrapedAt: new Date().toISOString()
  }));

  const outputPath = join(__dirname, 'public', 'sales.json');
  mkdirSync(join(__dirname, 'public'), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(sales, null, 2));
  console.log('Saved ' + sales.length + ' sales to public/sales.json');
  sales.slice(0, 3).forEach(s => console.log(' -', s.name, '|', s.city, '|', s.dateRange));
}

scrape().catch(console.error);