import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apps = [
  { html: 'local-r-stat-lab-en.html', csv: 'sample_clinical_data_en.csv', language: 'en' },
  { html: 'local-r-stat-lab.html', csv: 'sample_clinical_data.csv', language: 'ja' },
];

const names = {
  Age: '年齢', Sex: '性別', TreatmentGroup: '治療群', BMI: 'BMI', Stage: 'ステージ',
  TumorMarker: '腫瘍マーカー', SBP_pre: '収縮期血圧_治療前', SBP_post: '収縮期血圧_治療後',
  Response_pre: '治療反応_前', Response_post: '治療反応_後', FollowUp_months: '追跡期間_月', Event: 'イベント',
};
const types = {
  Age: 'num', Sex: 'cat', TreatmentGroup: 'cat', BMI: 'num', Stage: 'cat', TumorMarker: 'num',
  SBP_pre: 'num', SBP_post: 'num', Response_pre: 'cat', Response_post: 'cat', FollowUp_months: 'num', Event: 'num',
};
const analyses = [
  ['desc', { vars: ['Age', 'Sex'] }],
  ['table1', { vars: ['Age', 'Sex', 'BMI', 'Stage'], g: 'TreatmentGroup', np: false }],
  ['two', { y: 'Age', g: 'Sex', welch: true, wilcox: true, primaryNonparam: true }],
  ['paired', { a: 'SBP_pre', b: 'SBP_post', primaryNonparam: true }],
  ['multi', { y: 'Age', g: 'Stage', primaryNonparam: true }],
  ['cat', { a: 'Sex', b: 'TreatmentGroup' }],
  ['mcnemar', { a: 'Response_pre', b: 'Response_post' }],
  ['surv', { time: 'FollowUp_months', event: 'Event', g: 'TreatmentGroup', covs: ['BMI'] }],
  ['cor', { x: 'Age', y: 'BMI' }],
  ['lm', { y: 'BMI', x: ['Age', 'Sex'] }],
  ['glm', { y: 'Event', x: ['Age', 'Sex', 'BMI'] }],
  ['roc', { y: 'Event', x: 'TumorMarker' }],
  ['synth', { privacy: true, exactMissing: true, blockRisk: true }],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function extract(source, pattern, label) {
  const value = source.match(pattern)?.[0];
  assert(value, `Could not extract ${label}`);
  return value;
}

function createAppHarness(app) {
  const htmlPath = path.join(root, app.html);
  const source = fs.readFileSync(htmlPath, 'utf8');
  const script = extract(source, /<script type="module">([\s\S]*?)<\/script>/, 'module script').replace(/^<script[^>]*>|<\/script>$/g, '');
  new vm.Script(script, { filename: app.html });

  const csvFunctions = extract(
    source,
    /function parseCSV\(text\)\{[\s\S]*?\n\}\n\nfunction serializeCSV\(rows\)\{[\s\S]*?\n\}/,
    'CSV functions',
  );
  const rHelpers = extract(
    source,
    /function escR\(s\)\{[\s\S]*?\n\}\nfunction col\(name\)\{[^\n]+\}/,
    'R helpers',
  );
  const genStart = source.indexOf('function genCode(a){');
  const genEnd = source.indexOf('/* =========================================================\n   Run on WebR', genStart);
  assert(genStart >= 0 && genEnd > genStart, `Could not extract genCode from ${app.html}`);
  const genCode = source.slice(genStart, genEnd);

  let formState = {};
  const context = {
    document: {
      getElementById(id) {
        const value = formState[id.slice(2)];
        if (id.startsWith('o_')) return { checked: Boolean(value) };
        if (Array.isArray(value)) {
          return { value: value[0] || '', selectedOptions: value.map(item => ({ value: item })) };
        }
        return { value: value || '', selectedOptions: [] };
      },
    },
  };
  vm.createContext(context);
  const columns = Object.keys(names).map(key => ({
    name: app.language === 'ja' ? names[key] : key,
    type: types[key],
  }));
  vm.runInContext(
    `let columns=${JSON.stringify(columns)};\n${csvFunctions}\n${rHelpers}\n${genCode}\nthis.api={parseCSV,serializeCSV,escR,genCode};`,
    context,
  );

  return {
    api: context.api,
    setFormState(value) { formState = value; },
  };
}

function translateState(state, language) {
  const translate = value => language === 'ja' ? (names[value] || value) : value;
  return Object.fromEntries(Object.entries(state).map(([key, value]) => [
    key,
    Array.isArray(value) ? value.map(translate) : typeof value === 'string' ? translate(value) : value,
  ]));
}

function testCsv(app, harness) {
  const csv = fs.readFileSync(path.join(root, app.csv), 'utf8');
  const rows = harness.api.parseCSV(csv);
  assert(rows.length === 151, `${app.csv}: expected 151 rows including the header`);
  assert(rows[0].length === 13, `${app.csv}: expected 13 columns`);
  const roundTrip = harness.api.parseCSV(harness.api.serializeCSV(rows));
  assert(JSON.stringify(roundTrip) === JSON.stringify(rows), `${app.csv}: CSV round trip changed data`);
  assert(harness.api.escR('a"b\\c\nd') === 'a\\"b\\\\c\\nd', `${app.html}: R string escaping failed`);
  let rejected = false;
  try { harness.api.parseCSV('a,b\n"unclosed'); } catch { rejected = true; }
  assert(rejected, `${app.html}: an unclosed quoted field was accepted`);
}

function hasR() {
  return spawnSync('R', ['--version'], { encoding: 'utf8' }).status === 0;
}

function hasSurvival() {
  return spawnSync('R', ['--vanilla', '--slave', '-e', 'quit(status = !requireNamespace("survival", quietly=TRUE))']).status === 0;
}

function testAnalyses(app, harness) {
  const csvPath = path.join(root, app.csv);
  const sourceRows = harness.api.parseCSV(fs.readFileSync(csvPath, 'utf8'));
  const survivalAvailable = hasSurvival();
  for (const [id, rawState] of analyses) {
    if (id === 'surv' && !survivalAvailable) {
      console.warn(`${app.html}: surv skipped (local R package "survival" is unavailable)`);
      continue;
    }
    harness.setFormState(translateState(rawState, app.language));
    const generated = harness.api.genCode({ id });
    assert(!generated.err, `${app.html} ${id}: ${generated.err}`);
    const prefix = `df <- read.csv(${JSON.stringify(csvPath)}, check.names=FALSE)\npdf(NULL)\n`;
    const result = spawnSync('R', ['--vanilla', '--slave'], {
      input: prefix + generated.code,
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    });
    assert(result.status === 0, `${app.html} ${id} failed:\n${result.stderr}\n${result.stdout.slice(-2000)}`);
    if (id === 'two') {
      assert(generated.code.includes('@@KV primary=wilcox'), `${app.html}: primary two-group test was not propagated`);
      assert(generated.code.includes("Hedges' g") && generated.code.includes('rank-biserial'), `${app.html}: two-group effect sizes are missing`);
    }
    if (id === 'multi') {
      assert(generated.code.includes('pairwise.wilcox.test') && generated.code.includes('epsilon2'), `${app.html}: nonparametric post-hoc/effect size is missing`);
    }
    if (id === 'surv') {
      assert(generated.code.includes('d_km') && generated.code.includes('d_cox'), `${app.html}: KM and Cox analysis sets are not separated`);
      assert(/KM \/ log-rank[^\n]*n = 150/.test(result.stdout), `${app.html}: KM set was incorrectly reduced by covariate missingness`);
      assert(/Cox[^\n]*n = 142/.test(result.stdout), `${app.html}: Cox complete-case count was not reported separately`);
    }
    if (id === 'lm') {
      assert(generated.code.includes('Breusch-Pagan') && generated.code.includes("Cook's distance") && generated.code.includes('VIF'), `${app.html}: linear-regression diagnostics are incomplete`);
    }
    if (id === 'glm') {
      assert(generated.code.includes('Brier score') && generated.code.includes('sep_flag') && generated.code.includes('EPV'), `${app.html}: logistic-regression diagnostics are incomplete`);
    }
    if (id === 'synth') {
      const csvText = result.stdout.match(/@@CSV_BEGIN\n([\s\S]*?)\n@@CSV_END/)?.[1];
      assert(csvText, `${app.html}: privacy-first dummy CSV was not emitted`);
      const fakeRows = harness.api.parseCSV(csvText);
      assert(fakeRows.length === sourceRows.length, `${app.html}: dummy row count changed`);
      assert(fakeRows[0].every((name, i) => name === `variable_${String(i + 1).padStart(2, '0')}`), `${app.html}: source column names remain in privacy-first output`);
      for (let i = 0; i < sourceRows[0].length; i++) {
        const sourceMissing = sourceRows.slice(1).filter(row => row[i] === '').length;
        const fakeMissing = fakeRows.slice(1).filter(row => row[i] === '').length;
        assert(fakeMissing === sourceMissing, `${app.html}: exact missing count changed in column ${i + 1}`);
      }
      assert(!csvText.includes('PatientID') && !csvText.includes(app.language === 'ja' ? '治療群' : 'TreatmentGroup'), `${app.html}: source labels leaked into privacy-first CSV`);

      harness.setFormState({ privacy: false, exactMissing: true, blockRisk: true });
      const blockedCode = harness.api.genCode({ id: 'synth' });
      const blockedResult = spawnSync('R', ['--vanilla', '--slave'], {
        input: prefix + blockedCode.code,
        encoding: 'utf8',
        maxBuffer: 20 * 1024 * 1024,
      });
      assert(blockedResult.status === 0, `${app.html}: risk-blocking dummy run failed`);
      assert(!blockedResult.stdout.includes('@@CSV_BEGIN'), `${app.html}: high-risk structure-first CSV was not blocked`);
      assert(blockedResult.stdout.includes(app.language === 'ja' ? 'CSV出力を停止' : 'CSV output was blocked'), `${app.html}: risk block was not explained`);
    }
  }
}

const rAvailable = hasR();
for (const app of apps) {
  const harness = createAppHarness(app);
  testCsv(app, harness);
  if (rAvailable) testAnalyses(app, harness);
  console.log(`${app.html}: smoke tests passed${rAvailable ? '' : ' (R analyses skipped: R is unavailable)'}`);
}
