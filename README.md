# Local R Stat Lab

A browser-based R statistics tool for clinical research. It runs a real R engine (WebR) entirely inside your browser, so your CSV data never leaves your device.

CSV を読み込み、ブラウザ内で完結する R 統計解析ツール。本物の R エンジン（WebR）をブラウザ上で動かすため、データを外部サーバーに送信することなく統計解析を実行できる。

**🌐 Language / 言語:** [English](#-english) · [日本語](#-日本語)

**Current version / 現行バージョン:** v1.1.0

## Files / ファイル

| File | UI | Description |
|---|---|---|
| `local-r-stat-lab.html` | 日本語 | Japanese user interface |
| `local-r-stat-lab-en.html` | English | English user interface |
| `sample_clinical_data.csv` | 日本語 | Sample data with Japanese headers/values |
| `sample_clinical_data_en.csv` | English | Same data with English headers/values |

> Note: GitHub does not run JavaScript inside README files, so a true "click-to-switch" toggle is not possible here. Instead, the two languages are placed in collapsible sections below — click a section to expand it.
> 補足: GitHub は README 内で JavaScript を実行しないため、真の「クリックで切替」はできない。代わりに、下記の折りたたみセクションで各言語を展開できる。

---

## Changelog / 変更履歴

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
- **Dummy data generation** — creates a fake CSV you can safely share with a generative AI.
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
| **Linear regression** | Multiple regression of a continuous outcome | Outcome (numeric), predictors (multiple) | coefficients, 95% CI, R², AIC |
| **Logistic regression** | Multivariable analysis of a binary outcome | Outcome (binary), predictors (multiple) | odds ratios, 95% CI, AIC, forest plot |
| **ROC curve** | Discrimination of a test value | Outcome (binary), test value (numeric) | AUC, 95% CI, optimal cutoff (Youden), sensitivity/specificity, ROC curve |
| **🎲 Dummy data generation** | Fake data to share with a generative AI | (no variable selection) | preview, structure check, CSV download |

**Choosing an analysis**

- **2 groups vs. ≥3 groups**: for continuous values, use "Two-group comparison" for 2 groups and "Multi-group comparison" for 3 or more. Do not repeat t-tests for ≥3 groups (multiple-testing problem).
- **Paired or not**: for paired data (e.g., before/after in the same subjects), use "Paired comparison" (continuous) or "McNemar's test" (categorical). Independent two-group tests cannot be used.
- **Adjustment**: to adjust for other factors, use "Linear regression" (continuous outcome) or "Logistic regression" (binary outcome).

### Dummy data generation

Uploading actual patient data to a generative AI (ChatGPT, etc.) raises data-governance concerns. This feature generates fake data with the same *structure* as the real data. You can hand this to an AI to safely debug code or discuss analysis procedures.

**How to use**

1. With a CSV loaded, select the **🎲 Dummy data generation** tab.
2. Click "Run analysis in R". No variable selection is needed.
3. A preview (first 6 rows) of the fake data and a "structure preserved?" check appear.
4. Use "Download dummy CSV" or "Copy dummy CSV" and give it to the AI.

**Preserved vs. fully changed**

Preserved (structure):

- Column names, each column's type (numeric / categorical / date), number of rows
- The min and max of numeric variables, and whether they are integers or decimals (decimal places)
- The *number of categories* of categorical variables. For 2-level variables, the labels themselves.
- The date range (earliest–latest) and format of date columns
- The proportion of missing values (empty cells)

Fully changed (content):

- Every cell value; no real value remains.
- Numeric values are redrawn as uniform random numbers within the min–max range.
- Categorical variables with ≥3 levels are replaced with "column name + sequential number" dummy labels (e.g., Sex1, Sex2, …).
- Binary variables (Yes/No, Male/Female, etc.) are randomized while keeping the original labels.
- Columns detected as date/time (timestamps) are replaced with random dates within the original range.

**Handling by data type**

| Data type | How the fake value is generated |
|---|---|
| Numeric (integer) | Uniform random within min–max, rounded to integer |
| Numeric (decimal) | Uniform random within min–max, rounded to the original number of decimal places |
| Categorical (binary) | Original labels (e.g., Yes / No) assigned randomly |
| Categorical (≥3 levels) | "Column name + number" labels for each level, assigned randomly |
| Date / time | Random date within the original range, output in the original format |
| Missing | Missing rate measured per column and reproduced at the same rate |

Supported date formats include `2020-01-01`, `2020/01/01`, `2020-01-01 12:34:56`, `12:34:56`, etc. (The Japanese-locale formats such as `2020年1月1日` are recognized in the Japanese version.) Formats not on the candidate list are treated as ordinary categories (sequential labels).

**Notes**

- This is **synthetic data** that mimics statistical structure; it is not de-identified real data.
- The distribution (mean, SD, proportions) and the row-wise correspondence are not preserved.
- Therefore, real analysis results (significant differences, etc.) are not reproduced in the fake data. Treat it strictly as material for code/procedure discussion.

### Interpreting, copying, and saving results

- **Automatic interpretation card**: for test-based analyses, the null hypothesis, the decision (p-value vs. 0.05), and a plain-language interpretation are shown. Warnings appear when, e.g., the t-test and Wilcoxon disagree.
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

- **Dependencies**: WebR (loaded from an external CDN). The only additional download is the `survival` package used by survival analysis.
- **Pre-loading survival**: after the R engine starts, `survival` is pre-loaded in the background to reduce the wait on the first survival analysis.
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
- **ダミーデータ生成**：生成 AI に安全に渡せる偽データ CSV を作成する。
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
| **線形回帰** | 連続アウトカムの重回帰 | 目的変数（数値）、説明変数（複数可） | 係数・95%CI、決定係数 R²、AIC |
| **ロジスティック回帰** | 2 値アウトカムの多変量解析 | 目的変数（2 値）、説明変数（複数可） | オッズ比・95%CI、AIC、forest plot |
| **ROC曲線** | 検査値の判別能評価 | アウトカム（2 値）、検査値（数値） | AUC・95%CI、最適カットオフ（Youden）、感度・特異度、ROC 曲線 |
| **🎲 ダミーデータ生成** | 生成 AI に渡す偽データ作成 | （変数指定なし） | 偽データのプレビュー、構造確認、CSV ダウンロード |

#### 解析選択の指針

- **群が 2 つか 3 つ以上か**：連続値の群間比較では、2 群なら「2群比較」、3 群以上なら「多群比較」を用いる。3 群以上で t 検定を繰り返してはならない（多重検定の問題が生じる）。
- **対応の有無**：同一対象の前後測定など対応があるデータには、連続値なら「対応のある比較」、カテゴリなら「McNemar検定」を用いる。独立 2 群の検定（2群比較・分割表の検定）は使えない。
- **調整の要否**：他の因子の影響を調整したい場合は、連続アウトカムで「線形回帰」、2 値アウトカムで「ロジスティック回帰」を用いる。

### ダミーデータ生成機能

患者データそのものを生成 AI（ChatGPT 等）にアップロードすることは情報管理上の問題がある。本機能は、実データと同じ「構造」を持つ偽データを生成する。これを AI に渡せば、コードのデバッグや解析手順の相談を安全に行える。

#### 使い方

1. CSV を読み込んだ状態で **🎲 ダミーデータ生成** タブを選ぶ。
2. 「Rで解析を実行」を押す。変数の指定は不要である。
3. 偽データのプレビュー（先頭 6 行）と「構造が保たれているか」の確認表示が出る。
4. 「⬇ ダミーCSVをダウンロード」または「📋 ダミーCSVをコピー」で取得し、AI に渡す。

#### 保たれるもの／完全に変わるもの

**保たれるもの（構造）**

- 列名、各列の型（数値／カテゴリ／日付）、行数
- 数値変数の最小値・最大値、整数か小数かの別（小数桁数）
- カテゴリ変数の「種類の数」。ただし 2 値変数は選択肢そのもの。
- 日付列の期間（最古〜最新）と書式
- 欠損（空セル）の割合

**完全に変わるもの（中身）**

- すべてのセルの値。実在する値は 1 つも残らない。
- 数値は Min〜Max の範囲で一様乱数として引き直す。
- カテゴリ（3 水準以上）は「列名＋連番」のダミーラベルに置換する（例：性別1, 性別2, …）。
- 2 値変数（あり／なし、男／女 等）は元の表記を保ったままランダム化する。
- 日付・時刻（タイムスタンプ）と判定された列は、元の期間内のランダムな日付に置換する。

#### 各データ型の扱い

| データ型 | 偽データの生成方法 |
|---|---|
| 数値（整数） | Min〜Max の一様乱数を整数に丸め |
| 数値（小数） | Min〜Max の一様乱数を元の小数桁数で丸め |
| カテゴリ（2 値） | 元のラベル（例：あり／なし）をそのままランダムに割当 |
| カテゴリ（3 水準以上） | 「列名＋連番」ラベルを水準数だけ作りランダムに割当 |
| 日付・時刻 | 元の期間内のランダムな日付を、元と同じ書式で生成 |
| 欠損 | 列ごとの欠損率を測り、同じ割合で空セルを再現 |

対応する日付書式は、`2020-01-01`・`2020/01/01`・`2020年1月1日`・`2020-01-01 12:34:56`・`12:34:56` などである。ただし、候補にない特殊な表記（和暦など）は日付と判定されず、通常のカテゴリ（連番ラベル）として扱われる。

#### 注意

- これは統計的構造を真似た**合成データ**であり、匿名化した実データではない。
- 分布（平均・SD・出現比率）や行どうしの対応は保たれない。
- したがって、本物の解析結果（有意差など）は偽データでは再現されない。あくまでコードや手順の相談用とみなすこと。

### 結果の解釈・コピー・保存

- **自動解釈カード**：検定系の解析では、帰無仮説・判定（p 値と 0.05 の比較）・平易な解釈を自動表示する。t 検定と Wilcoxon で結論が分かれた場合などは警告も出る。
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

- **依存**：WebR（外部 CDN から読込）。追加のダウンロードが発生するのは生存分析の `survival` パッケージのみである。
- **survival の先読み**：R エンジンの起動完了後、バックグラウンドで `survival` を先読みする。生存分析の初回実行の待ち時間を抑えるためである。
- **対応データ規模**：数千例規模の臨床データであれば快適に動作する。数十万行を超えると、メモリ・速度の制約で不安定になることがある。
- **動作環境**：モダンブラウザ（Chrome・Edge・Firefox・Safari）。グラフ描画は OffscreenCanvas に対応するブラウザで有効である。

</details>
