import { chromium } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

const BASE_URL = 'https://wiki.warthunder.com';
const FIXTURES_DIR = path.join(process.cwd(), 'test', 'fixtures');

const TEST_CATEGORY = 'aviation';
const TEST_MODES = ['ab', 'rb', 'sb'];

async function ensureFixturesDir(): Promise<void> {
  await fs.mkdir(FIXTURES_DIR, { recursive: true });
}

async function downloadFixtures(): Promise<void> {
  const browser = await chromium.launch({ headless: true });

  console.log('Downloading test fixtures...');

  const page = await browser.newPage();

  const listUrl = `${BASE_URL}/${TEST_CATEGORY}?v=l`;

  console.log(`Visiting: ${listUrl}`);

  try {
    await page.goto(listUrl, { waitUntil: 'networkidle', timeout: 60000 });

    for (const mode of TEST_MODES) {
      if (mode !== 'ab') {
        console.log(`Switching to ${mode} mode...`);

        try {
          await page.click('#wt-br-mode-btn');
          await page.waitForSelector('#wt-br-mode-items', { timeout: 5000 });
          await page.click(`#wt-br-mode-items button[data-br-id="${mode}"]`);
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to switch to ${mode}: ${error}`);

          continue;
        }
      }

      const html = await page.content();
      const filename = `${TEST_CATEGORY}-${mode}.html`;
      const filepath = path.join(FIXTURES_DIR, filename);

      await fs.writeFile(filepath, html, 'utf-8');

      console.log(`Saved: ${filename}`);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error(`Failed to download fixtures: ${error}`);
  } finally {
    await page.close();
  }

  await browser.close();

  console.log('Fixtures download complete!');
}

async function main(): Promise<void> {
  await ensureFixturesDir();
  await downloadFixtures();
}

main().catch(console.error);
