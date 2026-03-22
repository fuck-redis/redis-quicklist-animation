import { chromium } from 'playwright';

const BASE_URL = 'https://fuck-redis.github.io/redis-quicklist-animation/';

async function testSite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  console.log('Testing homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const title = await page.title();
  console.log('  Title:', title);

  console.log('Testing tutorial page...');
  await page.goto(`${BASE_URL}#/tutorial`, { waitUntil: 'networkidle' });
  const tutorialTitle = await page.title();
  console.log('  Title:', tutorialTitle);
  const h1 = await page.locator('h1').first().textContent().catch(() => 'not found');
  console.log('  H1:', h1);

  console.log('Testing playground page...');
  await page.goto(`${BASE_URL}#/playground`, { waitUntil: 'networkidle' });
  const playgroundH1 = await page.locator('h1').first().textContent().catch(() => 'not found');
  console.log('  H1:', playgroundH1);

  console.log('Testing FAQ page...');
  await page.goto(`${BASE_URL}#/faq`, { waitUntil: 'networkidle' });
  const faqH1 = await page.locator('h1').first().textContent().catch(() => 'not found');
  console.log('  H1:', faqH1);

  await browser.close();

  if (errors.length > 0) {
    console.log('\n❌ Console errors found:');
    errors.forEach(e => console.log('  -', e));
    process.exit(1);
  } else {
    console.log('\n✅ All pages loaded successfully without console errors!');
    process.exit(0);
  }
}

testSite().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
