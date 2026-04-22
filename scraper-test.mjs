import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

async function scrape() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const captured = [];

  // ─── Intercept all JSON responses from EstateSales ───────────────────────
  page.on('response', async (response) => {
    const url = response.url();
    const ct = response.headers()['content-type'] || '';
    if (ct.includes('json') && url.includes('estatesales')) {
      try {
        const text = await response.text();
        captured.push({ url, body: text });
      } catch (e) {}
    }
  });

  // ─── Step 1: Load STL listing page ───────────────────────────────────────
  console.log('Step 1: Loading STL listing page...');
  await page.goto('https://www.estatesales.net/MO/St-Louis', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 4000));

  // ─── Find the byids call and extract the first sale ID ───────────────────
  const byidsCall = captured.find(c => c.url.includes('byids'));
  let firstSaleId = null;

  if (byidsCall) {
    try {
      const sales = JSON.parse(byidsCall.body);
      if (Array.isArray(sales) && sales.length > 0) {
        firstSaleId = sales[0].id;
        console.log('Found sale ID:', firstSaleId);
        console.log('Sale name:', sales[0].name);
        console.log('State:', sales[0].stateCode, '| City:', sales[0].cityName);
      }
    } catch(e) {
      console.log('Could not parse byids response:', e.message);
    }
  }

  // ─── Step 2: Navigate to that sale's detail page ─────────────────────────
  if (firstSaleId) {
    const detailCaptured = [];
    const detailPage = await browser.newPage();

    detailPage.on('response', async (response) => {
      const url = response.url();
      const ct = response.headers()['content-type'] || '';
      if (ct.includes('json') && url.includes('estatesales')) {
        try {
          const text = await response.text();
          detailCaptured.push({ url, body: text });
        } catch (e) {}
      }
    });

    // Build detail page URL from first sale's data
    const firstSale = JSON.parse(byidsCall.body)[0];
    const detailUrl = `https://www.estatesales.net/${firstSale.stateCode}/${firstSale.cityName.replace(/ /g, '-')}/${firstSaleId}`;
    console.log('\nStep 2: Loading sale detail page:', detailUrl);

    await detailPage.goto(detailUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));

    console.log('\n=== DETAIL PAGE API CALLS (' + detailCaptured.length + ' found) ===');
    detailCaptured.forEach((c, i) => {
      console.log('--- ' + i + ' ---');
      console.log('URL:', c.url);
      // Print full body so we can see ALL available fields
      console.log('Body:', c.body.slice(0, 1500));
      console.log('');
    });

    await detailPage.close();
  } else {
    console.log('No sale ID found — cannot load detail page.');
  }

  // ─── Print listing page summary ──────────────────────────────────────────
  console.log('\n=== LISTING PAGE: byids CALL SUMMARY ===');
  if (byidsCall) {
    try {
      const sales = JSON.parse(byidsCall.body);
      console.log('Total sales returned:', sales.length);
      console.log('\nFirst sale full data:');
      console.log(JSON.stringify(sales[0], null, 2));
    } catch(e) {}
  }

  await browser.close();
}

scrape().catch(console.error);