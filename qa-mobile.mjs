import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
});

const page = await context.newPage();
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

// 1. 에디터 페이지
console.log('=== 에디터 모바일 QA ===');
await page.goto('https://appintoss-builder.vercel.app/editor', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'qa-mobile-editor.png' });

// 하단 탭 바 확인
const bottomTabs = await page.$$('[class*="bottom"] button, [class*="tab-bar"] button, nav[class*="fixed"] button');
console.log(`하단 탭 바 버튼 수: ${bottomTabs.length}`);

// 탭 바 요소 찾기 (다양한 셀렉터)
const tabBar = await page.$('nav, [class*="md:hidden"][class*="fixed"], [class*="bottom-0"]');
if (tabBar) {
  const box = await tabBar.boundingBox();
  console.log(`탭 바 위치: ${JSON.stringify(box)}`);
}

// 터치 타겟 확인 — 모든 버튼의 크기
const buttons = await page.$$('button');
let smallButtons = 0;
for (const btn of buttons) {
  const box = await btn.boundingBox();
  if (box && (box.width < 44 || box.height < 44)) {
    const text = await btn.textContent();
    if (text?.trim()) {
      smallButtons++;
      if (smallButtons <= 5) console.log(`  작은 버튼: "${text.trim().slice(0,20)}" (${Math.round(box.width)}x${Math.round(box.height)})`);
    }
  }
}
console.log(`터치 타겟 44px 미만 버튼: ${smallButtons}개`);

// 2. 템플릿 갤러리
console.log('\n=== 템플릿 갤러리 모바일 QA ===');
await page.goto('https://appintoss-builder.vercel.app/templates', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'qa-mobile-templates.png' });

// 템플릿 카드 확인
const cards = await page.$$('[class*="card"], [class*="template"], [class*="grid"] > div');
console.log(`템플릿 카드 수: ${cards.length}`);

// 스크롤 가능 확인
const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
console.log(`페이지 높이: ${scrollHeight}px, 뷰포트: ${clientHeight}px, 스크롤: ${scrollHeight > clientHeight ? 'OK' : '필요없음'}`);

// 3. 에디터 툴바
console.log('\n=== 에디터 툴바 모바일 QA ===');
await page.goto('https://appintoss-builder.vercel.app/editor', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

// 툴바 버튼 확인
const toolbarBtns = await page.$$('header button, [class*="toolbar"] button');
console.log(`툴바 버튼 수: ${toolbarBtns.length}`);
for (const btn of toolbarBtns.slice(0, 8)) {
  const box = await btn.boundingBox();
  const text = await btn.textContent();
  const ariaLabel = await btn.getAttribute('aria-label');
  console.log(`  툴바: "${(ariaLabel || text || '').trim().slice(0,20)}" ${box ? `(${Math.round(box.width)}x${Math.round(box.height)})` : '(hidden)'}`);
}

console.log(`\n콘솔 에러: ${errors.length}개`);
errors.forEach(e => console.log(`  ❌ ${e.slice(0,100)}`));

await browser.close();
console.log('\n✅ QA 완료');
