const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const modules = new Map();
function load(relative) {
  const filename = path.join(root, relative + '.ts');
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'module', 'exports', code)(
    (name) => name.startsWith('@/') ? load(name.slice(2)) : require(name), module, module.exports,
  );
  return module.exports;
}
const { getExamCountdown } = load('lib/utils/examCountdown');
assert.equal(getExamCountdown(new Date(2027, 0, 30, 23, 59)).daysUntil, 1);
assert.equal(getExamCountdown(new Date(2027, 0, 31)).isExamDay, true);
assert.deepEqual(getExamCountdown(new Date(2027, 1, 1)), { daysUntil: 0, isExamDay: false, hasPassed: true });
const progressRepo = load('lib/progress/localProgressRepository');
const sessionRepo = load('lib/progress/localExamSessionRepository');
const { questions, questionDataReport } = load('data/questions.generated');
const questionRepo = load('lib/questions/repository');
const { questionVisuals, round34VisualAudit } = load('data/questionVisuals');
assert.equal(questions.length, Object.keys(questionDataReport.roundCounts).length * 125);
assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
for (const question of questions) {
  assert.equal(question.choices.length, 5);
  assert(question.choices.every((choice) => choice.text));
  assert(question.correctChoices.every((choice) => /^[1-5]$/.test(choice)));
  assert(question.explanation);
  assert(question.category);
}
assert.equal(questionDataReport.explanationBlankCount, 0);
assert.equal(questionDataReport.multiCorrectCount, 1);
for (const [round, count] of Object.entries(questionDataReport.roundCounts)) {
  assert.equal(questionRepo.getQuestionsByRound(round).length, count);
}
for (const [category, count] of Object.entries(questionDataReport.categoryCounts)) {
  assert.equal(questionRepo.getQuestionsByCategory(category).length, count);
}
const requiredVisualQuestion = questionRepo.getQuestionById('2022-34-036');
assert(requiredVisualQuestion, 'Round 34 visual question is available');
assert.equal(requiredVisualQuestion.hasVisual, true);
assert.equal(requiredVisualQuestion.visualType, 'diagram');
assert.equal(requiredVisualQuestion.questionImage, undefined);
assert.equal(questionVisuals['2022-34-036'].required, true);
assert.equal(round34VisualAudit[0].status, 'source-needed');
const randomQuestions = questionRepo.getRandomQuestions(10);
assert.equal(randomQuestions.length, 10);
assert.equal(new Set(randomQuestions.map((question) => question.id)).size, 10);
const challengeSource = questions.slice(0, 20);
const challengeWithTwentyUnmastered = questionRepo.getChallengeQuestions({
  limit: 10,
  sourceQuestions: challengeSource,
});
assert.equal(challengeWithTwentyUnmastered.length, 10);
assert.equal(new Set(challengeWithTwentyUnmastered.map((question) => question.id)).size, 10);
const firstTenMastered = challengeSource.slice(10).map((question) => question.id);
const challengeWithTenUnmastered = questionRepo.getChallengeQuestions({
  limit: 10,
  sourceQuestions: challengeSource,
  everCorrectQuestionIds: firstTenMastered,
});
assert.equal(challengeWithTenUnmastered.length, 10);
assert(challengeWithTenUnmastered.every((question) => !firstTenMastered.includes(question.id)));
assert.equal(new Set(challengeWithTenUnmastered.map((question) => question.id)).size, 10);
const sevenUnmastered = challengeSource.slice(0, 7).map((question) => question.id);
const challengeWithSevenUnmastered = questionRepo.getChallengeQuestions({
  limit: 10,
  sourceQuestions: challengeSource,
  everCorrectQuestionIds: challengeSource.slice(7).map((question) => question.id),
});
assert.deepEqual(new Set(challengeWithSevenUnmastered.slice(0, 7).map((question) => question.id)), new Set(sevenUnmastered));
assert.equal(new Set(challengeWithSevenUnmastered.map((question) => question.id)).size, 10);
const challengeWithNoUnmastered = questionRepo.getChallengeQuestions({
  limit: 10,
  sourceQuestions: challengeSource,
  everCorrectQuestionIds: challengeSource.map((question) => question.id),
});
assert.equal(challengeWithNoUnmastered.length, 10);
assert.equal(new Set(challengeWithNoUnmastered.map((question) => question.id)).size, 10);
const { toDateKey } = load('lib/utils/date');
const now = new Date();
const records = [
  { questionId: 'sample-1', selectedChoice: 'a', isCorrect: true, answeredAt: new Date(now.getFullYear(), now.getMonth(), 1, 0, 5).toISOString() },
  { questionId: 'sample-1', selectedChoice: 'b', isCorrect: false, answeredAt: new Date(now.getFullYear(), now.getMonth(), 1, 23, 55).toISOString() },
  { questionId: 'sample-1', selectedChoice: 'a', isCorrect: true, answeredAt: '2099-01-01T00:00:00.000Z' },
];
const oldProgress = { ...progressRepo.emptyProgress, records, wrongQuestionIds: ['sample-1'] };
const month = progressRepo.getMonthlyStudySummary(now.getFullYear(), now.getMonth(), oldProgress);
assert.equal(month.studyDays, 1);
assert.equal(month.solvedCount, 2);
assert.equal(month.accuracy, 50);
assert.equal(progressRepo.getMonthlyStudySummary(2099, 0, oldProgress).solvedCount, 0);
const store = new Map([['care-rabbit-study-progress-v1', JSON.stringify(oldProgress)]]);
global.window = { localStorage: { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => { store.set(key, value); } } };
assert.deepEqual(progressRepo.loadProgress().records, []);
assert.deepEqual(progressRepo.loadProgress().wrongQuestionIds, []);
const officialQuestion = questions[0];
const nextProgress = progressRepo.recordAnswer(officialQuestion, officialQuestion.correctChoices[0], progressRepo.emptyProgress);
assert.equal(nextProgress.records.at(-1).examRound, officialQuestion.examRound);
assert.equal(nextProgress.records.at(-1).correctChoice, officialQuestion.correctChoice);
assert.equal(nextProgress.questionStats[officialQuestion.id].answerCount, 1);
assert.equal(nextProgress.questionStats[officialQuestion.id].incorrectCount, 0);
const legacyCorrectProgress = {
  ...progressRepo.emptyProgress,
  records: [
    { questionId: officialQuestion.id, isCorrect: false },
    { questionId: questions[1].id, isCorrect: true },
  ],
  questionStats: {
    [officialQuestion.id]: { questionId: officialQuestion.id, correctCount: 1 },
  },
};
assert.deepEqual(new Set(progressRepo.getEverCorrectQuestionIds(legacyCorrectProgress)), new Set([officialQuestion.id, questions[1].id]));
const multiCorrectQuestion = questions.find((question) => question.correctChoices.length > 1);
assert(multiCorrectQuestion, 'one multi-correct question is retained');
assert.equal(
  progressRepo.recordAnswer(multiCorrectQuestion, multiCorrectQuestion.correctChoices[1], progressRepo.emptyProgress).records.at(-1).isCorrect,
  true,
);
let session = sessionRepo.recordExamRoundAnswer('38', officialQuestion.id, 0, 125, true);
assert.equal(session.currentQuestionIndex, 1);
assert.deepEqual(session.correctQuestionIds, [officialQuestion.id]);
session = sessionRepo.getExamRoundSession('38');
assert.equal(session.currentQuestionIndex, 1);
delete global.window;
const { mascotReactions, getMascotReaction } = load('data/mascot-reactions');
assert.equal(mascotReactions.length, 30);
for (const type of ['correct', 'wrong']) {
  assert.equal(mascotReactions.filter((reaction) => reaction.type === type).length, 10);
  let last;
  for (let index = 0; index < 50; index++) {
    const reaction = getMascotReaction(type);
    assert.notEqual(reaction.id, last);
    last = reaction.id;
  }
}
for (const count of [3, 5, 7, 10]) assert.equal(getMascotReaction('streak', count).id, `streak-${count}`);
console.log('PASS: question CSV conversion, visual metadata, challenge prioritization, countdown boundaries, progress metadata, session resume, calendar aggregation, storage compatibility, reactions');

async function browserChecks() {
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || undefined });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Tokyo', reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const output = path.join(root, 'outputs', 'verification');
    fs.mkdirSync(output, { recursive: true });
    const base = process.env.APP_URL || 'http://localhost:3000';
    const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();
    async function shot(name) {
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `overflow: ${name}`);
      await page.screenshot({ path: path.join(output, name + '.png'), fullPage: true });
    }
    await page.goto(base);
    await page.getByText(/あと \d+ 日/).waitFor();
    assert.equal(await page.title(), 'うさぎの学習室');
    await page.locator('main img').evaluate((img) => img.decode());
    await shot('home-mobile');
    await page.getByRole('link', { name: '10問チャレンジ', exact: true }).click();
    await page.locator('.choice-button').first().waitFor();
    await shot('question-mobile');
    for (let index = 0; index < 10; index++) {
      const text = await page.locator('h1').innerText();
      const question = questions.find((q) => normalizeText(q.questionText) === normalizeText(text));
      assert(question, 'question matches sample data');
      const choiceIndex = question.choices.findIndex((choice) => index === 0 ? !question.correctChoices.includes(choice.id) : question.correctChoices.includes(choice.id));
      await page.locator('.choice-button').nth(choiceIndex).click();
      assert.equal(await page.locator('.choice-button:enabled').count(), 0);
      await page.getByText(index === 0 ? 'おしい！' : '正解！', { exact: true }).first().waitFor();
      if (index < 2) await shot(index === 0 ? 'wrong-mobile' : 'correct-mobile');
      if (index === 0) {
        await page.getByText('出典を見る', { exact: true }).click();
        await page.getByText('この問題は法制度・統計等の変更により、現在の内容と異なる可能性があります。', { exact: true }).waitFor();
        await page.getByText(question.source, { exact: true }).waitFor();
      }
      if ([3, 5, 7].includes(index)) await page.getByText(getMascotReaction('streak', index).message, { exact: true }).waitFor();
      await page.getByRole('button', { name: index === 9 ? '結果を見る' : '次の問題へ', exact: true }).click();
    }
    await page.getByText('正答率 90%', { exact: true }).waitFor();
    await shot('result-mobile');
    await page.getByRole('link', { name: '間違えた問題を復習', exact: true }).click();
    await page.getByText('1/1問目', { exact: true }).waitFor();
    async function answerReview() {
      const reviewText = await page.locator('h1').innerText();
      const reviewQuestion = questions.find((q) => normalizeText(q.questionText) === normalizeText(reviewText));
      await page.locator('.choice-button').nth(reviewQuestion.choices.findIndex((c) => reviewQuestion.correctChoices.includes(c.id))).click();
      await page.getByRole('button', { name: '結果を見る' }).click();
    }
    await answerReview();
    await page.getByText('正答率 100%', { exact: true }).waitFor();
    await page.getByRole('link', { name: 'ホームへ戻る', exact: true }).last().click();
    await page.getByText('11問', { exact: true }).waitFor();
    await page.getByRole('link', { name: '学習カレンダーを見る' }).click();
    await page.getByText('11問', { exact: true }).waitFor();
    await shot('calendar-mobile');
    await page.getByRole('button', { name: '前月へ' }).click();
    await page.getByRole('button', { name: '次月へ' }).click();
    await page.getByText('11問', { exact: true }).waitFor();
    await page.reload();
    await page.getByText('11問', { exact: true }).waitFor();
    for (const width of [320, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await shot(`calendar-${width}`);
      await page.goto(base);
      await page.getByText('11問', { exact: true }).waitFor();
      await shot(`home-${width}`);
      await page.goto(base + '/calendar');
    }
    await page.goto(base + '/categories');
    await shot('categories');
    const categoryHref = await page.locator('section[aria-label="分野一覧"] a').first().getAttribute('href');
    await page.goto(base + categoryHref);
    await page.locator('.choice-button').first().waitFor();
    const categoryQuestionText = await page.locator('h1').innerText();
    const categoryQuestion = questions.find((question) => normalizeText(question.questionText) === normalizeText(categoryQuestionText));
    assert.equal(categoryQuestion.category, decodeURIComponent(categoryHref.split('category=')[1]));
    await page.goto(base + '/review');
    await page.getByText('今のところ復習リストは空だよ。いい感じ！', { exact: true }).waitFor();
    await shot('review');
    await page.clock.install();
    await page.goto(base + '/quiz?mode=challenge');
    await page.getByText('1/10問目', { exact: true }).waitFor();
    await page.clock.fastForward(30 * 60 * 1000);
    await page.getByText('30分がんばったね。ひと息ついて、また自分のペースで進もう。', { exact: true }).waitFor();
    await shot('rest-reaction');
    const calendarRecords = [20, 10, 1].flatMap((count, index) => Array.from({ length: count }, () => ({
      questionId: questions[0].id, selectedChoice: questions[0].correctChoices[0], isCorrect: true,
      answeredAt: new Date(now.getFullYear(), now.getMonth() - 1, index + 1, 12).toISOString(),
    })));
    await page.evaluate((progress) => localStorage.setItem('care-rabbit-study-progress-v1', JSON.stringify(progress)), { ...progressRepo.emptyProgress, records: calendarRecords });
    await page.goto(base + '/calendar');
    await page.getByRole('button', { name: '前月へ' }).click();
    await page.getByText('31問', { exact: true }).waitFor();
    await page.locator('[aria-label$=": 20問以上"]').waitFor();
    await page.locator('[aria-label$=": 10問以上"]').waitFor();
    await page.locator('[aria-label$=": 1問以上"]').waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await shot('calendar-markers-mobile');
    await page.goto(base + '/learn');
    await shot('learn-mobile');
    await page.locator('a[href="/quiz?mode=round&round=38"]').click();
    await page.getByText('第38回・問題 1', { exact: true }).waitFor();
    const roundText = await page.locator('h1').innerText();
    const roundQuestion = questions.find((question) => normalizeText(question.questionText) === normalizeText(roundText));
    await page.locator('.choice-button').nth(roundQuestion.choices.findIndex((choice) => roundQuestion.correctChoices.includes(choice.id))).click();
    await page.reload();
    await page.getByText('第38回・問題 2', { exact: true }).waitFor();
    await page.goto(base + '/mock-exam');
    await page.getByRole('button', { name: '開始する', exact: true }).click();
    await page.getByText('1 / 125', { exact: true }).waitFor();
    const mockSession = await page.evaluate(() => JSON.parse(localStorage.getItem('care-rabbit-study-mock-exam-v1')));
    assert.equal(mockSession.questionIds.length, 125);
    assert.equal(new Set(mockSession.questionIds).size, 125);
    await page.locator('.choice-button').first().click();
    await page.getByText('2 / 125', { exact: true }).waitFor();
    await page.getByRole('button', { name: '問題一覧', exact: true }).click();
    await page.getByRole('button', { name: /問題 1: 回答済み/ }).click();
    await page.getByRole('button', { name: '見直す', exact: true }).click();
    await page.reload();
    await page.getByText('1 / 125', { exact: true }).waitFor();
    await page.getByRole('button', { name: '模擬試験を終了する', exact: true }).click();
    await page.getByText(/未回答が124問あります/, { exact: true }).waitFor();
    await page.getByRole('button', { name: '終了して結果を見る', exact: true }).click();
    await page.getByText('模擬試験結果', { exact: true }).waitFor();
    await shot('mock-exam-result-mobile');
    assert.deepEqual(errors, []);
    console.log('PASS: challenge, correct/wrong, milestone reactions, results, review navigation, persistence, calendar, 320/390/768/1280 layouts; no browser errors');
  } finally { await browser.close(); }
}
if (process.argv.includes('--browser')) browserChecks().catch((error) => { console.error(error); process.exitCode = 1; });
