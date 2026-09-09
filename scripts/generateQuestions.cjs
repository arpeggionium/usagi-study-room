const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outputPath = path.join(root, "data", "questions.generated.ts");
const idsOutputPath = path.join(root, "data", "questionIds.generated.ts");
const categories = new Set([
  "人間の尊厳と自立", "人間関係とコミュニケーション", "社会の理解", "介護の基本",
  "コミュニケーション技術", "生活支援技術", "介護過程", "発達と老化の理解",
  "認知症の理解", "障害の理解", "こころとからだのしくみ", "医療的ケア", "総合問題",
]);
const expectedHeaders = [
  "id", "examYear", "examRound", "questionNumber", "category", "questionText",
  "choice1", "choice2", "choice3", "choice4", "choice5", "correctChoice",
  "explanation", "source", "keywords", "needsLegalReview",
];
const sourceDefinitions = [
  { path: path.join(root, "data", "kaigo_questions_2016-2026_with_explanations.csv"), rounds: ["35", "36", "37", "38"], hasHeader: true, hasIndexColumn: false },
  { path: path.join(root, "data", "kaigo_questions_2022_round34_with_explanations.csv"), rounds: ["34"], hasHeader: true, hasIndexColumn: true },
];
const sources = sourceDefinitions.filter((source) => fs.existsSync(source.path));

function parseCsv(content) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < content.length; index++) {
    const character = content[index];
    if (quoted) {
      if (character === '"' && content[index + 1] === '"') { value += '"'; index++; }
      else if (character === '"') quoted = false;
      else value += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") { row.push(value); value = ""; }
    else if (character === "\n") { row.push(value.replace(/\r$/, "")); rows.push(row); row = []; value = ""; }
    else value += character;
  }
  if (value || row.length) { row.push(value.replace(/\r$/, "")); rows.push(row); }
  return rows;
}

function asBoolean(value) {
  const normalized = value.toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  throw new Error(`needsLegalReview must be true or false, received: ${value}`);
}

function loadSource(source, issues) {
  const rows = parseCsv(fs.readFileSync(source.path, "utf8").replace(/^\uFEFF/, ""));
  const sourceHeaders = source.hasIndexColumn ? ["index", ...expectedHeaders] : expectedHeaders;
  const headers = source.hasHeader ? rows.shift() : sourceHeaders;
  if (!headers || headers.join(",") !== sourceHeaders.join(",")) {
    issues.push(`${path.basename(source.path)}: CSV header does not match the expected schema.`);
    return [];
  }
  return rows.map((row, index) => {
    if (row.length !== sourceHeaders.length) {
      issues.push(`${path.basename(source.path)} row ${index + (source.hasHeader ? 2 : 1)}: expected ${sourceHeaders.length} columns, received ${row.length}.`);
    }
    return {
      ...Object.fromEntries(expectedHeaders.map((header, column) => [header, (row[column + (source.hasIndexColumn ? 1 : 0)] ?? "").trim()])),
      _source: path.basename(source.path),
      _row: index + (source.hasHeader ? 2 : 1),
    };
  });
}

function main() {
  const issues = [];
  const records = sources.flatMap((source) => loadSource(source, issues));
  const expectedRounds = sources.flatMap((source) => source.rounds);
  const ids = new Set();
  const roundNumbers = new Map(expectedRounds.map((round) => [round, new Set()]));
  const roundCounts = Object.fromEntries(expectedRounds.map((round) => [round, 0]));
  const categoryCounts = {};
  let legalReviewCount = 0;
  let explanationBlankCount = 0;

  for (const row of records) {
    const location = `${row._source} row ${row._row} (${row.id || "missing id"})`;
    if (!row.id || ids.has(row.id)) issues.push(`${location}: id is missing or duplicated.`);
    ids.add(row.id);
    if (!categories.has(row.category)) issues.push(`${location}: unknown or missing category.`);
    categoryCounts[row.category] = (categoryCounts[row.category] ?? 0) + 1;
    for (let choiceIndex = 1; choiceIndex <= 5; choiceIndex++) if (!row[`choice${choiceIndex}`]) issues.push(`${location}: choice${choiceIndex} is empty.`);
    if (!/^[1-5](,[1-5])*$/.test(row.correctChoice)) issues.push(`${location}: correctChoice must contain choices 1 through 5.`);
    if (!row.explanation) { explanationBlankCount++; issues.push(`${location}: explanation is empty.`); }
    if (!expectedRounds.includes(row.examRound)) issues.push(`${location}: unsupported exam round.`);
    if (!/^\d{1,3}$/.test(row.questionNumber)) issues.push(`${location}: invalid question number.`);
    roundCounts[row.examRound] = (roundCounts[row.examRound] ?? 0) + 1;
    roundNumbers.get(row.examRound)?.add(Number(row.questionNumber));
    try { if (asBoolean(row.needsLegalReview)) legalReviewCount++; }
    catch (error) { issues.push(`${location}: ${error.message}`); }
  }

  const expectedQuestionCount = expectedRounds.length * 125;
  if (records.length !== expectedQuestionCount) issues.push(`Expected ${expectedQuestionCount} questions, received ${records.length}.`);
  for (const round of expectedRounds) {
    if (roundCounts[round] !== 125) issues.push(`Round ${round}: expected 125 questions, received ${roundCounts[round]}.`);
    for (let number = 1; number <= 125; number++) if (!roundNumbers.get(round)?.has(number)) issues.push(`Round ${round}: question ${number} is missing.`);
  }
  if (issues.length) throw new Error(`Question CSV validation failed:\n${issues.join("\n")}`);

  const questions = records.map(({ _source, _row, ...row }) => ({
    id: row.id, examYear: row.examYear, examRound: row.examRound, questionNumber: Number(row.questionNumber), category: row.category, questionText: row.questionText,
    choices: [1, 2, 3, 4, 5].map((number) => ({ id: String(number), text: row[`choice${number}`] })),
    correctChoice: row.correctChoice, correctChoices: row.correctChoice.split(","), explanation: row.explanation, source: row.source,
    keywords: row.keywords ? row.keywords.split(/[;,、]/).map((keyword) => keyword.trim()).filter(Boolean) : [], needsLegalReview: asBoolean(row.needsLegalReview),
  }));
  const report = {
    questionCount: questions.length, roundCounts, categoryCounts, legalReviewCount, explanationBlankCount,
    multiCorrectCount: records.filter((row) => row.correctChoice.includes(",")).length,
    sourceFiles: sources.map((source) => path.basename(source.path)),
  };
  const generatedFrom = report.sourceFiles.join(" and ");
  fs.writeFileSync(outputPath, [
    `/* This file is generated from ${generatedFrom}. Do not edit manually. */`,
    'import type { Question } from "@/types/question";', "",
    `export const questions = ${JSON.stringify(questions)} satisfies Question[];`,
    `export const questionDataReport = ${JSON.stringify(report)} as const;`, "",
  ].join("\n"), "utf8");
  fs.writeFileSync(idsOutputPath, `/* This file is generated from ${generatedFrom}. Do not edit manually. */\nexport const questionIds = ${JSON.stringify(questions.map((question) => question.id))} as const;\n`, "utf8");
  console.log(JSON.stringify(report));
}

main();
