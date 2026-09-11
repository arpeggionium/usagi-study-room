# うさぎの学習室

もふまるといっしょに、楽しく合格へ。

介護福祉士国家試験向けのスマホ用学習アプリです。解説付きの第34回（2022年）から第38回（2026年）まで、各125問、合計625問を収録しています。Supabase未接続で動作します。

## 使用技術と起動

Next.js / React / TypeScript / App Router / Tailwind CSS / localStorage。
Node.js 22以上を推奨します。

```bash
npm install
npm run generate:questions
npm run dev
```

http://localhost:3000 を開きます。

```bash
npm run build
npm run lint
npm run typecheck
npm run validate:questions
```

## ディレクトリ構成

```text
app/                  ホーム、問題、分野、復習、カレンダーのルート
components/           共通UI、もふまる、カウントダウン
config/               試験日設定
constants/            分野、画像alt、今日のメッセージ
data/                 正式CSV、ビルド生成問題データ、画像対応表、リアクション
lib/questions/        問題取得repository
lib/progress/         学習履歴・試験回・模擬試験のlocalStorage repository
lib/utils/            日付、カウントダウン、ランダム選択
types/                問題・学習履歴の型
public/mascot/mofumaru/  もふまる画像10枚
```

## 問題データ

元CSVは `data/kaigo_questions_2016-2026_with_explanations.csv` に加工せず保存します。`npm run generate:questions` が `scripts/generateQuestions.cjs` を実行し、ビルド時に `data/questions.generated.ts` へ変換します。ブラウザ上でCSVを解析しません。`npm run dev` と `npm run build` の前にも自動実行されます。

変換時に、ID重複、各回125問、各回の問題番号1〜125、全5択、正答、解説、分野を検証します。第34回の解説付きCSVを `data/kaigo_questions_2022_round34_with_explanations.csv` に置くと、ヘッダーなし16列形式を検証して自動統合します。現在受領した解説欠落版は `data/pending/` に保管しており、生成対象ではありません。現在のCSVには第36回・問題46だけ `correctChoice=4,5` の複数正答指定があります。原CSVを変更せず、アプリでは選択肢4または5を正答として扱い、両方を表示します。

正規データを更新する場合は、同じ列構成のCSVに差し替えたうえで `npm run generate:questions` を実行してください。エラーが出た場合は生成を止め、該当行を表示します。出典・利用条件・法改正についても確認してください。

## 図・表・イラスト問題

CSV本文とは別に `data/questionVisuals.ts` で問題IDごとの図情報を管理します。元PDFから必要な図だけを切り出し、`public/questions/round34/036.png` のように配置した後、対応する `questionImage`、alt、表示位置を同ファイルへ追加してください。通常学習と模擬試験は同じ図表示コンポーネントを使い、図をタップすると拡大モーダルで確認できます。問題一覧には図付き問題のアイコンも表示されます。

`npm run validate:questions` は、存在しない問題ID、altや表示位置の欠落、画像ファイルの不足を検査します。現在は第34回問36を必須図として監査済みですが、元PDFが未取得のため画像パスは未登録です。この状態は警告として表示されます。

## もふまる画像とリアクション

`public/mascot/mofumaru/` の次のPNGを差し替えられます。

`normal.png`, `study.png`, `correct-1.png`, `correct-2.png`, `cheer.png`, `streak.png`, `celebrate.png`, `wrong.png`, `review.png`, `tired.png`

画像対応表は `data/mascot-images.ts`、説明文は `constants/mascot.ts`、リアクションは `data/mascot-reactions.ts` です。Next.js Imageで表示し、読込失敗時にも領域を保持します。正解10種、不正解10種、3・5・7・10連続正解の4種、その他6種の計30種を定義しています。学習画面を30分開くと休憩を促すtired表示に切り替わります。動きを減らす端末設定を尊重します。

## カウントダウンとカレンダー

`config/exam.ts` で試験日 `2027-01-31` を管理します。`lib/utils/examCountdown.ts` がローカル日付で日数を計算し、`components/CountdownCard.tsx` が表示します。当日・試験後も対応しています。

カレンダーは `app/calendar/page.tsx`。`lib/progress/localProgressRepository.ts` が既存回答履歴からローカル日付別・月別に集計します。1問以上は●、10問以上は✓、20問以上は★。未来の日は記録・集計から除外します。

## 学習履歴の互換性

保存キー `care-rabbit-study-progress-v1` と既存のデータ構造を維持します。新しい回答には試験回、分野、正答、回答回数、正解数、不正解数も保存します。旧版のサンプル問題IDは復習・分野別集計では安全に無視され、クラッシュしません。回答日時のISO文字列も変更しません。保存した端末・ブラウザ・URLのオリジンごとに履歴が分かれ、他の端末や別のVercel URLには自動移行されません。

第○回を通して解くモードの再開位置は、別キー `care-rabbit-study-exam-sessions-v1` に保存します。模擬試験は固定済み125問のID順・回答・見直しフラグ・現在位置を `care-rabbit-study-mock-exam-v1` に保存し、終了時に回答履歴へ一括反映します。

## Supabaseへの移行箇所

- `lib/questions/repository.ts`: ローカル問題配列をSupabase取得に変更。
- `lib/progress/localProgressRepository.ts` と `lib/progress/localMockExamRepository.ts`: 認証ユーザーID付き回答・模擬試験セッションの取得・保存へ変更。日別・月別集計は再利用可能。
- `types/question.ts`, `types/progress.ts`: DBとの変換とユーザーIDを追加。
- UIの同期読み込み部分: 非同期repositoryの読込中・失敗表示を追加。

テーブルはquestions、choices、answer_records、profilesなどを想定します。ユーザー別RLSを設定し、service roleキーをクライアントに公開しないでください。

## Vercelへのデプロイ

1. GitHubリポジトリへ変更をcommitしてpushします。
2. VercelでリポジトリをImportし、Framework PresetにNext.jsを指定します。
3. Build Commandは `npm run build`。インストールは採用したロックファイルに対応するコマンドを使います。
4. Deploy後に本番URLで動作を確認します。接続済みリポジトリならpushで再デプロイされます。
5. Supabase接続時にProject SettingsのEnvironment Variablesへ公開URLと公開キーを追加します。

現在の機能: 625問の正式問題、10問チャレンジ、125問の模擬試験（途中保存・見直し・問題一覧・結果/解説・復習）、分野別学習、試験回別の連続出題と再開、正誤判定と解説、出典表示、法制度注意表示、復習、成績、連続学習日数、カウントダウン、学習カレンダー、もふまるリアクション。

今回の改修ファイルと画像旧名対応は `IMPLEMENTATION.md` を参照してください。
