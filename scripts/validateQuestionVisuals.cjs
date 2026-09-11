const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");

function loadTypeScript(relativePath) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", output)(require, module, module.exports);
  return module.exports;
}

const { questions } = loadTypeScript("data/questions.generated.ts");
const { questionVisuals } = loadTypeScript("data/questionVisuals.ts");
const questionIds = new Set(questions.map((question) => question.id));
const errors = [];
const warnings = [];

for (const [questionId, visual] of Object.entries(questionVisuals)) {
  if (!questionIds.has(questionId)) errors.push(`${questionId}: 登録されていない問題IDです。`);
  if (!visual.hasVisual) errors.push(`${questionId}: visual mappingには hasVisual: true が必要です。`);
  if (visual.questionImage && !visual.questionImage.startsWith("/questions/")) {
    errors.push(`${questionId}: questionImage は /questions/ 配下を指定してください。`);
  }
  if (visual.questionImage && !visual.questionImageAlt) errors.push(`${questionId}: 画像には questionImageAlt が必要です。`);
  if (visual.questionImage && !visual.questionImagePosition) errors.push(`${questionId}: 画像には questionImagePosition が必要です。`);
  if (visual.questionImage && !fs.existsSync(path.join(root, "public", visual.questionImage))) {
    errors.push(`${questionId}: 画像ファイルがありません (${visual.questionImage})。`);
  }
  if (visual.required && !visual.questionImage) {
    warnings.push(`${questionId}: 必須の図が未登録です。元PDFから切り出した画像を登録してください。`);
  }
}

for (const message of warnings) console.warn(`WARNING: ${message}`);
for (const message of errors) console.error(`ERROR: ${message}`);

if (errors.length > 0) process.exitCode = 1;
else console.log(`PASS: ${Object.keys(questionVisuals).length}件の図対応マッピングを検証しました。`);
