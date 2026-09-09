# 今回の改修

## 変更した既存ファイル

- `app/layout.tsx`: metadata名称。
- `app/page.tsx`: 名称、指定順のホーム、カレンダー導線。
- `app/globals.css`: 5種類のアニメーションとreduced-motion対応。
- `app/review/page.tsx`: review画像と表示文言。
- `components/AppShell.tsx`: 4項目ナビ、現在地、iPhoneのセーフエリア。
- `components/Mascot.tsx`: Next.js Image、画像切替、フォールバック。
- `components/QuizClient.tsx`: リアクション、30分経過時のtired、復習遷移の状態リセット。
- `components/StatCard.tsx`: 狭いスマホ画面の文字サイズ。
- `constants/mascot.ts`: 画像altと型。
- `constants/reactions.ts`: 今日のひとこと。回答リアクションは専用データへ移動。
- `lib/utils/date.ts`: ローカル日付キー。
- `lib/progress/localProgressRepository.ts`: 日別・月別集計、旧履歴からローカル日付集計を再構成。
- `types/progress.ts`: 日別・月別集計の型。
- `README.md`: 起動・画像・問題・デプロイ・移行方法。
- `package.json`: アプリ用のパッケージ名とNext.js内のPostCSSを修正版へ固定するoverride。
- `pnpm-lock.yaml`, `pnpm-workspace.yaml`: npmへ統一するため削除。

## 新規ファイル

- `config/exam.ts`
- `lib/utils/examCountdown.ts`
- `components/CountdownCard.tsx`
- `data/mascot-images.ts`
- `data/mascot-reactions.ts`
- `app/calendar/page.tsx`
- `app/manifest.ts`
- `scripts/verify.cjs`
- `IMPLEMENTATION.md`
- `package-lock.json` (npmによる依存関係の固定)

## 画像の旧名と割り当て

画像を実際に確認したうえで、以下のようにリネームしました。保存先はすべて `public/mascot/mofumaru/` です。

| 旧ファイル名 | 新ファイル名 | 用途・見た目 |
| --- | --- | --- |
| Codex 画像 2026年9月8日 23_17_05.png | normal.png | ホーム・立ってにっこり |
| Codex 画像 2026年9月8日 23_17_40.png | study.png | 学習開始・緑の本と鉛筆 |
| Codex 画像 2026年9月8日 23_17_45.png | celebrate.png | 結果・特別連続正解、跳び上がって喜ぶ |
| Codex 画像 2026年9月8日 23_17_54.png | correct-1.png | 通常正解・きらきらした喜び |
| Codex 画像 2026年9月8日 23_18_09.png | correct-2.png | 通常正解の別画像・前足を合わせる |
| Codex 画像 2026年9月8日 23_18_14.png | wrong.png | 不正解・疑問符と考える表情 |
| Codex 画像 2026年9月8日 23_18_21.png | streak.png | 連続正解・元気なポーズと星 |
| Codex 画像 2026年9月8日 23_18_29.png | cheer.png | 学習終了・前足を上げて応援 |
| Codex 画像 2026年9月8日 23_18_37.png | review.png | 復習と不正解・ピンクの本と考える表情 |
| Codex 画像 2026年9月8日 23_18_41.png | tired.png | 長時間学習・毛布と温かい飲み物 |

## リアクション数

合計30種類: 正解10、不正解10、連続正解4、normal / study / cheer / review / tired / celebrateが各1。
通常回答はランダムに選び、直前と同じ文言を除きます。連続正解の特別表示は3・5・7・10問目に出し、それ以外は通常正解です。
アニメーションはbounce / wiggle / pop / celebrate / gentle-float。端末の「視差効果を減らす」設定を尊重します。

## カウントダウン

`config/exam.ts` の2027-01-31を `lib/utils/examCountdown.ts` で計算し、`components/CountdownCard.tsx` で表示します。
ブラウザのローカル日付で計算し、日付境界と夏時間の影響を考慮。当日・試験後の表示と30秒ごとの更新に対応します。

## カレンダーと保存互換性

画面は `app/calendar/page.tsx`。集計は `lib/progress/localProgressRepository.ts` の `getDailyStudySummaries` と `getMonthlyStudySummary`。
保存キー `care-rabbit-study-progress-v1`、回答履歴の構造、ISO日時、問題別成績、復習IDは維持します。今日の問題数と連続学習日数は旧履歴からローカル日付で再計算します。未来の記録はカレンダー表示と月別集計から除外します。

## Supabase移行

問題取得は `lib/questions/repository.ts`、履歴保存は `lib/progress/localProgressRepository.ts` を差し替えます。
認証ユーザーIDとRLSを加え、UI呼出しを非同期化します。既存履歴を取り込む場合は、ログイン後に同意のあるローカル履歴を一度だけインポートする処理を追加します。

## 検証スクリプト

`node scripts/verify.cjs` で日付境界、月別集計、未来日除外、旧履歴互換性、リアクションを検証します。
Playwright利用可能な環境では `node scripts/verify.cjs --browser` でブラウザ確認を実行します。`APP_URL` で確認先、`PLAYWRIGHT_MODULE` でPlaywrightモジュールのパスを指定可能です。確認用ブラウザは独立した一時プロファイルなので実際の学習履歴を変更しません。スクリーンショットは `outputs/verification/` に生成します。
