# Local R Stat Lab

A browser-based R statistics tool for clinical research. It runs a real R engine (WebR) entirely inside your browser, so your CSV data never leaves your device.

CSV を読み込み、ブラウザ内で完結する R 統計解析ツール。本物の R エンジン（WebR）をブラウザ上で動かすため、データを外部サーバーに送信することなく統計解析を実行できる。

**🌐 Language / 言語:** [English](#-english) · [日本語](#-日本語)

**Current version / 現行バージョン:** v1.2.0

## Files / ファイル

| File | UI | Description |
|---|---|---|
| `local-r-stat-lab.html` | 日本語 | Japanese user interface |
| `local-r-stat-lab-en.html` | English | English user interface |
| `sample_clinical_data.csv` | 日本語 | Sample data with Japanese headers/values |
| `sample_clinical_data_en.csv` | English | Same data with English headers/values |

## Development checks / 開発時チェック

Run `node tests/smoke-test.mjs` from the repository root. It checks both HTML files, CSV parsing/serialization, R-string escaping, and all generated analysis paths using the bundled sample data. Node.js is required; if a local R executable is unavailable, the JavaScript checks still run and R analysis checks are skipped.

リポジトリ直下で `node tests/smoke-test.mjs` を実行する。日英 HTML、CSV の解析・再シリアライズ、R 文字列のエスケープ、サンプルデータを用いた全解析コードを確認する。Node.js が必要であり、ローカルに R がない場合は JavaScript の確認のみ実行し、R 解析テストはスキップする。

> Note: GitHub does not run JavaScript inside README files, so a true "click-to-switch" toggle is not possible here. Instead, the two languages are placed in collapsible sections below — click a section to expand it.
> 補足: GitHub は README 内で JavaScript を実行しないため、真の「クリックで切替」はできない。代わりに、下記の折りたたみセクションで各言語を展開できる。

---

## Changelog / 変更履歴

### v1.2.0 - 2026-07-13

- Pinned WebR to v0.6.0 for reproducible startup behavior.
- Added a 50 MB CSV size limit plus validation for unclosed quotes, blank or duplicate headers, and inconsistent row widths.
- Made numeric type detection consistent with R and verified parsed row/column counts before enabling analyses.
- Improved startup and execution error recovery, serialized CSV writes, and added a clipboard fallback for local-file use.
- Added minimum-data checks for common analyses and made Table 1 tests tolerate sparse or constant variables.
- Added predictor-name mappings to linear and logistic regression output.
- Corrected the dummy-data privacy language: generated values may coincide with source values, and the feature is not an anonymization tool.

- WebR を v0.6.0 に固定し、起動時の再現性を高めた。
- CSV に 50 MB の上限を設け、閉じていない引用符、空または重複した列名、行ごとの列数不一致を検証するようにした。
- 数値型判定を R と整合させ、解析ボタンを有効にする前に読込後の行数・列数を検証するようにした。
- 起動・解析エラーからの復帰、CSV 書込の直列化、ローカルファイル利用時のコピー代替処理を追加した。
- 主な解析に最小データ数の検証を追加し、Table 1 が疎なデータや定数列で全体停止しにくいようにした。
- 線形・ロジスティック回帰の出力に、内部変数名と元の列名の対応を追加した。
- ダミーデータの説明を修正し、元値との偶然一致があり得ること、匿名化機能ではないことを明記した。

### v1.1.0 - 2026-06-20

- Improved CSV loading reliability: analysis buttons now remain disabled until the CSV has been fully written into WebR as `df`.
- Made generated regression and Cox model formulas safer for column names containing spaces, Japanese text, symbols, or backticks by using temporary internal variable names.
- Prevented logistic regression from modifying the global `df` object by using a local analysis data frame.
- Added a size guard for Fisher's exact test in contingency tables to avoid long freezes on large tables.

- CSV 読み込みの信頼性を改善。CSV が WebR 内で `df` として完全に読み込まれるまで解析ボタンを有効化しないようにした。
- 回帰分析・Cox 回帰の式生成を改善。空白、日本語、記号、バッククォートを含む列名でも壊れにくいよう、一時的な内部変数名を使う方式に変更した。
- ロジスティック回帰がグローバルな `df` を変更しないよう、解析用のローカルデータフレームを使う方式に変更した。
- 分割表の Fisher 正確検定にサイズ制限を追加し、大きな表で長時間停止するリスクを抑えた。

---

## 🇬🇧 English

<details open>
<summary><b>Click to expand / collapse the English guide</b></summary>

### Overview

Local R Stat Lab is a single-file web app (`local-r-stat-lab-en.html`) that runs the R statistical language in your browser through **WebR** (R compiled to WebAssembly). You can perform the statistical analyses commonly used in medical and clinical research without sending data to any server, and without installing R.

Just open the HTML file in a browser. No installation or server setup is required.

### Features

- **Runs fully in the browser** — the contents of your CSV are processed on your device and never sent over the network.
- **Real R** — uses WebR, an open-source build of R. R functions such as `t.test` and `coxph` run as-is, not as approximations.
- **Shows the executed code** — the generated R code is displayed and can be copied, so you can reproduce results in your own R.
- **Beginner help** — every analysis explains when to use it, how to read the output, and what to watch for.
- **Automatic interpretation** — the null hypothesis, the decision, and a plain-language interpretation are shown automatically.
- **Table 1** — generates a publication-ready patient characteristics table (EZR-style).
- **Dummy data generation** — creates a synthetic CSV for code and workflow discussions; review it under your organization's data policy before sharing.
- **Figure/table export** — plots as PNG, tables as TSV (for pasting into Excel/Word).

### How it works & privacy

WebR is the R language itself compiled to WebAssembly (a binary format browsers can run directly). It does not connect to a cloud R server; it computes inside the browser using your device's CPU and memory.

Data flow:

1. When you select a CSV, the browser reads the file into its own memory.
2. It writes the file into WebR's virtual filesystem (an in-memory area of the browser).
3. The in-browser R analyzes it and returns the results (text and plot images) to the screen.

In other words, **the CSV content never leaves your device.**

That said, communication is not entirely absent. The following are one-way downloads of code/fonts; they do not transmit your CSV contents:

- The R engine itself (`webr.r-wasm.org`)
- The `survival` package (used for survival analysis)
- The screen font (`fonts.googleapis.com`)

However, if stricter confidentiality is required, bundling these (engine, packages, fonts) within your organization allows operation in a closed network with zero external communication.

The preset CSV loader and analysis tabs do not contain code that uploads CSV contents. The free R console runs arbitrary user-provided code, however, so its network behavior—and that of additional packages—depends on the code being executed. Review such code before running it with sensitive data.

### Quick start

1. Open `local-r-stat-lab-en.html` in a browser (Chrome, Edge, Firefox, etc.).
2. Wait until the status at the top right shows "ready". The first load of the R engine may take 1–2 minutes.
3. Drag and drop a CSV onto **1 · Data** on the left (or "Choose file").
4. Choose an analysis tab under **2 · Analysis** on the right and assign variables.
5. Click "Run analysis in R". Results, plots, and the automatic interpretation appear.

### Data requirements

- **Format**: CSV with the first row as the header (variable names). Data rows follow.
- **Encoding**: UTF-8 and Shift_JIS are supported. The default is auto-detect; switch manually if needed.
- **Missing values**: blanks or `NA` are treated as missing.
- **Type detection**: each column is auto-classified as "numeric" or "categorical".
  - However, a group code entered as numbers (e.g., 1 = male, 2 = female) may be detected as numeric. In that case, simply assign it as a grouping variable.

After loading, the left panel shows the variable list (type, number of levels) and a preview of the first 8 rows. Use "Replace with another CSV" to reload.

### Statistical analyses

Open "For beginners" on each tab to see detailed use cases, how to read the output, and cautions. An overview:

| Tab | Purpose | Main inputs | Main outputs |
|---|---|---|---|
| **Descriptive statistics** | Grasp the overall data | Variables (multiple) | n / missing, mean (SD), median [IQR], range, histogram / frequency table |
| **Table 1** | Patient characteristics table | Variables to include, grouping variable (optional) | mean (SD) or median [IQR], n (%), between-group p-value and test |
| **Two-group comparison** | Continuous values between 2 independent groups | Outcome (numeric), grouping (2 levels) | group summaries, normality (Shapiro-Wilk), equal variance, t-test, Wilcoxon, boxplot |
| **Paired comparison** | Before/after in the same subjects | Variable 1 (before), Variable 2 (after) | before/after summaries, normality of differences, paired t-test, Wilcoxon signed-rank, boxplot |
| **Multi-group comparison** | Continuous values across ≥3 groups | Outcome (numeric), grouping (≥3 levels) | ANOVA, Tukey HSD, Kruskal-Wallis, boxplot |
| **Contingency table** | Association of two categorical variables | Variable 1 (rows), Variable 2 (columns) | cross-tab, row %, χ² test, expected counts, Fisher's exact test, mosaic plot |
| **McNemar's test** | Paired categorical before/after | Variable 1 (before), Variable 2 (after) | cross-tab, discordant pairs, McNemar's test, binomial test for small samples |
| **Survival analysis** | Time to event | Time, event (0/1), grouping (optional), covariates (optional) | KM curve + number at risk, log-rank, Cox (HR, 95% CI), proportional hazards test, forest plot |
| **Correlation** | Correlation of 2 continuous variables | Variable X, Variable Y | Pearson, Spearman, scatter plot + regression line |
| **Linear regression** | Multiple regression of a continuous outcome | Outcome (numeric), predictors (multiple) | coefficients, 95% CI, R², residual/homoscedasticity/influence/collinearity diagnostics |
| **Logistic regression** | Multivariable analysis of a binary outcome | Outcome (binary), predictors (multiple) | odds ratios, 95% CI, convergence/separation/EPV/calibration/discrimination diagnostics |
| **ROC curve** | Discrimination of a test value | Outcome (binary), test value (numeric) | AUC, 95% CI, optimal cutoff (Youden), sensitivity/specificity, ROC curve |
| **🎲 Dummy data generation** | Synthetic CSV for code and UI testing | (no variable selection) | privacy-first generalization, risk screen, preview, CSV download |

**Choosing an analysis**

- **2 groups vs. ≥3 groups**: for continuous values, use "Two-group comparison" for 2 groups and "Multi-group comparison" for 3 or more. Do not repeat t-tests for ≥3 groups (multiple-testing problem).
- **Paired or not**: for paired data (e.g., before/after in the same subjects), use "Paired comparison" (continuous) or "McNemar's test" (categorical). Independent two-group tests cannot be used.
- **Adjustment**: to adjust for other factors, use "Linear regression" (continuous outcome) or "Logistic regression" (binary outcome).

### Dummy data generation

This feature creates synthetic CSVs for testing code and UI workflows. It is not an anonymization or de-identification tool.

**How to use**

1. With a CSV loaded, select the **🎲 Dummy data generation** tab.
2. Keep **Privacy-first mode** enabled for any output that may leave the protected environment.
3. Run the generator and review the disclosure-risk warnings and preview.
4. Save or copy the CSV only after that review.

Privacy-first mode generalizes column names (variable_01…), every categorical label (category_1…), date spans, and ordinary numeric scales. It preserves row count, data types, category cardinality, and optionally the exact number of missing values. Numeric 0/1 columns remain 0/1 for analysis compatibility.

The generator screens for identifier-like names, ≥80% uniqueness, date/time fields, long free text, rare categories, and datasets with fewer than 30 rows. With privacy-first mode off, the default risk-blocking option suppresses CSV output when these risks are detected. The diagnostic output reports only properties of the dummy CSV and does not print source ranges or date spans in privacy-first mode.

These safeguards reduce accidental disclosure but provide no formal privacy guarantee. External sharing still requires review under the organization's data-governance policy.

### Interpreting, copying, and saving results

- **Automatic interpretation card**: the decision follows the primary test selected before execution; supporting tests are shown as sensitivity analyses. Key effect sizes are displayed with the p-value.
- **Copy output**: "Copy output" copies the R output text.
- **Copy table**: in Table 1, "Copy table" gives TSV that pastes directly into Excel/Word.
- **Save plots**: "Save PNG" on each plot saves the image.
- **Copy executed code**: "Copy" on the dark box copies the R code for reproduction in your own R.

### R console (free input)

The **3 · R Console** at the bottom runs arbitrary R code.

- The loaded data is available as the variable `df`.
- Examples: `summary(df)` / `table(df[["Sex"]])` / `lm(y ~ x, data = df)`
- `Ctrl+Enter` (Mac: `⌘+Enter`) also runs the code.

For analyses not in the preset tabs, write the R code here directly.

### Notes & disclaimer

- Results are reference information for research decisions. Confirm final statistical judgments with a statistician.
- A small p-value does not mean a large difference. Judge the magnitude by effect size and confidence intervals.
- A non-significant result is not proof of "no difference"; it means "insufficient evidence of a difference."
- Confirm that each analysis's assumptions (normality, sample size, number of events, etc.) are met. See each tab's help for details.

### Technical notes

- **Dependencies**: WebR v0.6.0 (loaded from an external CDN). The `survival` package is downloaded only when survival analysis is first run.
- **Data size**: clinical datasets of a few thousand cases run comfortably. Beyond a few hundred thousand rows, memory/speed constraints may make it unstable.
- **Environment**: modern browsers (Chrome, Edge, Firefox, Safari). Plot rendering is enabled on browsers that support OffscreenCanvas.

</details>

---

## 🇯🇵 日本語

<details>
<summary><b>クリックで日本語ガイドを開く / 閉じる</b></summary>

CSV を読み込み、ブラウザ内で完結する R 統計解析ツールである。本物の R エンジン（WebR）をブラウザ上で動かすため、データを外部サーバーに送信することなく、医療・臨床研究で頻用する統計解析を実行できる。

日本語版は単一の HTML ファイル（`local-r-stat-lab.html`）で動作する。ブラウザで開くだけで利用でき、インストールやサーバー構築は不要である。

### 特徴

- **ブラウザ完結**：CSV の中身は端末内（ブラウザ）で処理され、ネットワークに送信されない。
- **本物の R**：WebR（R を WebAssembly 化したオープンソース）を用いる。簡易な近似計算ではなく、`t.test` や `coxph` など R の関数そのものが動く。
- **実行コードを表示**：生成された R コードを画面に表示し、コピーできる。手元の R でもそのまま再現可能である。
- **初学者向けヘルプ**：各解析に「いつ使うか・結果の読み方・注意点」を備える。
- **結果の自動解釈**：帰無仮説・判定・平易な解釈を日本語で自動表示する。
- **EZR 風の Table 1**：論文用の患者背景表を自動生成する。
- **ダミーデータ生成**：コードや解析手順の相談用に合成 CSV を作成する。外部へ渡す前に内容を確認し、所属組織の規程に従う必要がある。
- **図表の保存**：グラフは PNG、表は TSV（Excel／Word 貼り付け用）で書き出せる。

### 動作の仕組みとプライバシー

WebR は、R 言語そのものを WebAssembly（ブラウザが直接実行できるバイナリ形式）に変換したものである。クラウド上の R に接続しているのではなく、端末の CPU・メモリだけを用いてブラウザ内で計算する。

データの流れは以下のとおりである。

1. CSV を選択すると、ブラウザが自分のメモリにファイルを読み込む。
2. それを WebR の仮想ファイルシステム（ブラウザのメモリ上の領域）に書き込む。
3. ブラウザ内の R が解析し、結果（文字列・グラフ画像）を画面に返す。

すなわち、**CSV の内容は端末から外部に出ない**。

ただし、通信が皆無というわけではない。以下はコード・フォントを取得する一方向の通信であり、CSV の中身を送るものではない。

- R エンジン本体のダウンロード（`webr.r-wasm.org`）
- `survival` パッケージのダウンロード（生存分析で使用）
- 画面フォント（`fonts.googleapis.com`）

ただし、より厳密な機密管理が必要な場合は、これら（エンジン・パッケージ・フォント）を組織内に同梱すれば、外部通信ゼロの閉域環境でも動作する。

標準の CSV 読込とプリセット解析には、CSV の内容をアップロードする処理は含まれない。ただし、R コンソールは任意のコードを実行できるため、自由入力コードや追加パッケージの通信動作は実行内容に依存する。機密データで実行する前にコードを確認する必要がある。

### クイックスタート

1. `local-r-stat-lab.html` をブラウザ（Chrome・Edge・Firefox 等）で開く。
2. 画面右上のステータスが「準備完了」になるまで待つ。ただし、初回は R エンジンの読込に 1〜2 分かかることがある。
3. 左の **1 · Data** に CSV をドラッグ＆ドロップする（または「ファイルを選択」）。
4. 右の **2 · Analysis** で解析タブを選び、変数を割り当てる。
5. 「Rで解析を実行」を押す。結果・グラフ・自動解釈が表示される。

### データ準備の要件

- **形式**：1 行目をヘッダー（変数名）とする CSV。2 行目以降がデータ行である。
- **文字コード**：UTF-8 と Shift_JIS に対応する。既定は「自動判定」であり、必要に応じて手動で切り替える。
- **欠損**：空欄または `NA` を欠損として扱う。
- **型判定**：列ごとに「数値」「カテゴリ」を自動判定する。数値の割合が高く水準数が多い列を数値、それ以外をカテゴリとみなす。
  - ただし、群コードを数字で入力した列（例：1＝男、2＝女）は数値と判定されることがある。その場合は群分けの選択肢にそのまま指定すればよい。

読み込み後、左パネルに変数一覧（型・水準数）と先頭 8 行のプレビューが表示される。「別の CSV に差し替える」で再読込できる。

### 搭載する統計解析

各タブの「？ はじめての方へ」を開くと、用途・読み方・注意点の詳細を確認できる。以下は概要である。

| タブ | 用途 | 主な入力 | 主な出力 |
|---|---|---|---|
| **記述統計** | データの全体像把握 | 変数（複数可） | n・欠損、平均(SD)、中央値[IQR]、範囲、ヒストグラム／度数表 |
| **Table 1（背景表）** | 論文用の患者背景表 | 含める変数、群分け変数（任意） | 平均(SD) または 中央値[IQR]、n(%)、群間 p 値と検定法 |
| **2群比較** | 独立 2 群の連続値比較 | アウトカム（数値）、群分け（2 水準） | 群別要約、正規性（Shapiro-Wilk）、等分散性、t 検定、Wilcoxon、箱ひげ図 |
| **対応のある比較** | 同一対象の前後比較 | 変数 1（前）、変数 2（後） | 前後要約、差の正規性、対応 t 検定、Wilcoxon 符号付き順位検定、箱ひげ図 |
| **多群比較** | 3 群以上の連続値比較 | アウトカム（数値）、群分け（3 水準以上） | ANOVA、Tukey HSD、Kruskal-Wallis、箱ひげ図 |
| **分割表の検定** | 2 つのカテゴリ変数の関連 | 変数 1（行）、変数 2（列） | クロス集計、行%、χ² 検定、期待度数、Fisher 正確検定、モザイクプロット |
| **McNemar検定** | 対応のあるカテゴリの前後比較 | 変数 1（前）、変数 2（後） | クロス集計、不一致ペア、McNemar 検定、少数例では二項検定 |
| **生存分析** | イベント発生までの時間 | 時間、イベント（0/1）、群分け（任意）、共変量（任意） | KM 曲線＋Number at risk、log-rank、Cox（HR・95%CI）、比例ハザード性検定、forest plot |
| **相関** | 2 連続変数の相関 | 変数 X、変数 Y | Pearson、Spearman、散布図＋回帰直線 |
| **線形回帰** | 連続アウトカムの重回帰 | 目的変数（数値）、説明変数（複数可） | 係数・95%CI、R²、残差・等分散性・影響点・共線性診断 |
| **ロジスティック回帰** | 2 値アウトカムの多変量解析 | 目的変数（2 値）、説明変数（複数可） | オッズ比・95%CI、収束・分離・EPV・校正・判別能診断 |
| **ROC曲線** | 検査値の判別能評価 | アウトカム（2 値）、検査値（数値） | AUC・95%CI、最適カットオフ（Youden）、感度・特異度、ROC 曲線 |
| **🎲 ダミーデータ生成** | コード・画面テスト用の合成CSV | （変数指定なし） | 共有安全化、リスク検査、プレビュー、CSV保存 |

#### 解析選択の指針

- **群が 2 つか 3 つ以上か**：連続値の群間比較では、2 群なら「2群比較」、3 群以上なら「多群比較」を用いる。3 群以上で t 検定を繰り返してはならない（多重検定の問題が生じる）。
- **対応の有無**：同一対象の前後測定など対応があるデータには、連続値なら「対応のある比較」、カテゴリなら「McNemar検定」を用いる。独立 2 群の検定（2群比較・分割表の検定）は使えない。
- **調整の要否**：他の因子の影響を調整したい場合は、連続アウトカムで「線形回帰」、2 値アウトカムで「ロジスティック回帰」を用いる。

### ダミーデータ生成機能

コードや画面の動作確認用に合成 CSV を生成する機能である。匿名化・非識別化を保証する機能ではない。

#### 使い方

1. CSV を読み込んだ状態で **🎲 ダミーデータ生成** タブを選ぶ。
2. 保護環境外へ出る可能性がある場合は、**共有安全モード**を ON のままにする。
3. 実行後、開示リスク警告とプレビューを確認する。
4. 確認後にのみ CSV を保存またはコピーする。

共有安全モードでは、列名を variable_01…、全カテゴリラベルを category_1…へ置換し、日付期間と通常の数値尺度も一般化する。行数、型、カテゴリ数、指定時の正確な欠損数は維持する。解析互換性のため、数値の 0/1 列は 0/1 を維持する。

識別子らしい列名、一意率 80% 以上、日付・時刻、長い自由記述、5 件未満のカテゴリ、30 行未満の小規模データを検査する。共有安全モードを OFF にした場合、既定ではリスク検出時に CSV 出力を停止する。共有安全モードの診断表示には、元データの値域や日付期間を出力しない。

これらは偶発的な開示リスクを下げる対策であり、形式的なプライバシー保証ではない。外部共有には所属組織の規程に基づく確認が必要である。

### 結果の解釈・コピー・保存

- **自動解釈カード**：実行前に指定した主解析の p 値で判定し、補助検定は感度分析として併記する。主要な効果量も表示する。
- **出力のコピー**：「📋 出力をコピー」で R の出力テキストをコピーする。
- **表のコピー**：Table 1 では「📋 表をコピー」で TSV を取得でき、Excel・Word にそのまま貼り付けられる。
- **グラフの保存**：各グラフの「⬇ PNG保存」で画像を保存する。
- **実行コードのコピー**：黒いボックスの「コピー」で R コードを取得し、手元の R で再現できる。

### R コンソール（自由入力）

画面下部の **3 · R Console** で、任意の R コードを実行できる。

- 読み込んだデータは変数 `df` で参照する。
- 例：`summary(df)` / `table(df[["性別"]])` / `lm(y ~ x, data = df)`
- `Ctrl+Enter`（Mac は `⌘+Enter`）でも実行できる。

定型タブにない解析（対応のあるカテゴリ以外の特殊な検定、独自の作図など）は、ここで直接記述する。

### 注意・免責

- 本ツールの結果は研究判断の参考情報である。最終的な統計判断は統計家に確認すること。
- p 値が小さいことは差が大きいことを意味しない。差の大きさは効果量と信頼区間で判断する。
- 有意でない結果は「差がない」証明ではなく、「差があるという十分な証拠が得られなかった」を意味する。
- 各解析の前提（正規性、サンプルサイズ、イベント数など）を満たしているか確認すること。詳細は各タブのヘルプを参照する。

### 技術メモ

- **依存**：WebR v0.6.0（外部 CDN から読込）。`survival` パッケージは生存分析の初回実行時にのみダウンロードする。
- **対応データ規模**：数千例規模の臨床データであれば快適に動作する。数十万行を超えると、メモリ・速度の制約で不安定になることがある。
- **動作環境**：モダンブラウザ（Chrome・Edge・Firefox・Safari）。グラフ描画は OffscreenCanvas に対応するブラウザで有効である。

</details>
