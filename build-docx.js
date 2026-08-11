const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  ImageRun, ExternalHyperlink, LevelFormat, convertInchesToTwip,
} = require('docx');

const ROOT = __dirname;
const PNG = (n) => path.join(ROOT, 'assets', 'png', n);
const CONTENT_W = 9638;           // A4 width (11906) - 2 x 1134 margins
const IMG_W = 620;                // px

const FONT = { ascii: 'Malgun Gothic', eastAsia: '맑은 고딕', hAnsi: 'Malgun Gothic', cs: 'Malgun Gothic' };
const NAVY = '0D366B', BLUE = '184F95', MID = '256ABF', MUTED = '898781', RULE = 'D8D8D4', HEADFILL = 'E8F0FB';

// --- PNG intrinsic size from the IHDR chunk -------------------------------
function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
function picture(file, caption, captionLink) {
  const { w, h } = pngSize(file);
  const out = [
    new Paragraph({
      spacing: { before: 160, after: 40 },
      children: [new ImageRun({
        type: 'png',
        data: fs.readFileSync(file),
        transformation: { width: IMG_W, height: Math.round((h / w) * IMG_W) },
      })],
    }),
  ];
  if (caption) out.push(cap(caption, captionLink));
  return out;
}
function cap(text, link) {
  const kids = [new TextRun({ text, italics: true, size: 16, color: MUTED, font: FONT })];
  if (link) {
    kids.push(new TextRun({ text: ' ', size: 16, font: FONT }));
    kids.push(new ExternalHyperlink({
      link: link.url,
      children: [new TextRun({ text: link.label, italics: true, size: 16, style: 'Hyperlink', font: FONT })],
    }));
  }
  return new Paragraph({ spacing: { after: 200 }, children: kids });
}

// --- inline runs: [text] | [text, {b}] | {link, label} ---------------------
function runs(parts) {
  return parts.map((p) => {
    if (typeof p === 'string') return new TextRun({ text: p, font: FONT, size: 21 });
    if (p.url) {
      return new ExternalHyperlink({
        link: p.url,
        children: [new TextRun({ text: p.label, style: 'Hyperlink', font: FONT, size: p.size || 19 })],
      });
    }
    return new TextRun({ text: p.t, bold: !!p.b, font: FONT, size: p.size || 21, color: p.color });
  });
}
const P = (parts, opts = {}) => new Paragraph({ spacing: { after: 120, line: 300 }, children: runs(parts), ...opts });

function H(text, level) {
  const map = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 };
  const size = { 1: 40, 2: 28, 3: 24 }[level];
  const color = { 1: NAVY, 2: BLUE, 3: MID }[level];
  return new Paragraph({
    heading: map[level],
    spacing: { before: level === 1 ? 0 : 320, after: 140 },
    border: level === 1 ? { bottom: { style: BorderStyle.SINGLE, size: 12, color: '2A78D6', space: 6 } } : undefined,
    children: [new TextRun({ text, bold: true, size, color, font: FONT })],
  });
}

function callout(parts) {
  return new Paragraph({
    spacing: { before: 160, after: 200 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F4F8FE' },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: '2A78D6', space: 8 } },
    indent: { left: 120, right: 120 },
    children: runs(parts),
  });
}

// --- table ----------------------------------------------------------------
function tbl(widths, header, rows) {
  const cols = widths.map((w) => Math.round((w / 100) * CONTENT_W));
  cols[cols.length - 1] = CONTENT_W - cols.slice(0, -1).reduce((a, b) => a + b, 0);
  const cell = (parts, w, isHead) => new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: isHead ? { type: ShadingType.CLEAR, color: 'auto', fill: HEADFILL } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      spacing: { after: 0, line: 260 },
      children: parts.map((p) => {
        if (typeof p === 'string') return new TextRun({ text: p, font: FONT, size: 19, bold: !!isHead, color: isHead ? NAVY : undefined });
        if (p.url) return new ExternalHyperlink({ link: p.url, children: [new TextRun({ text: p.label, style: 'Hyperlink', font: FONT, size: 19 })] });
        return new TextRun({ text: p.t, bold: !!p.b || !!isHead, font: FONT, size: 19, color: isHead ? NAVY : p.color });
      }),
    })],
  });
  const border = { style: BorderStyle.SINGLE, size: 4, color: RULE };
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: cols,
    borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
    rows: [
      new TableRow({ tableHeader: true, children: header.map((c, i) => cell([c], cols[i], true)) }),
      ...rows.map((r) => new TableRow({ children: r.map((c, i) => cell(Array.isArray(c) ? c : [c], cols[i], false)) })),
    ],
  });
}

const spacer = () => new Paragraph({ spacing: { after: 200 }, children: [] });
const bullet = (parts) => new Paragraph({ numbering: { reference: 'dot', level: 0 }, spacing: { after: 80, line: 300 }, children: runs(parts) });
const num = (parts) => new Paragraph({ numbering: { reference: 'ord', level: 0 }, spacing: { after: 80, line: 300 }, children: runs(parts) });

const SRC_SO = 'https://survey.stackoverflow.co/2025/ai';
const SRC_MENLO = 'https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/';
const SRC_A16Z5 = 'https://a16z.com/100-gen-ai-apps-5/';

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 21 }, paragraph: { spacing: { line: 300 } } } } },
  numbering: {
    config: [
      { reference: 'dot', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 340, hanging: 200 } } } }] },
      { reference: 'ord', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 340, hanging: 200 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
    children: [
      H('2025년 하반기 가장 인기 있었던 AI 도구', 1),
      new Paragraph({
        spacing: { after: 280 },
        children: runs([
          { t: '조사 기간 ', b: true, size: 18, color: '52514E' }, { t: '2025-07-01 ~ 2025-12-31   ·   ', size: 18, color: '52514E' },
          { t: '작성 ', b: true, size: 18, color: '52514E' }, { t: '2026-08-11   ·   ', size: 18, color: '52514E' },
          { t: '수치 원장 ', b: true, size: 18, color: '52514E' }, { t: 'research-notes.md', size: 18, color: '52514E' },
        ]),
      }),

      H('1. 핵심 요약', 2),
      P(['“인기”는 단일 지표가 아니다. 소비자 사용량과 개발자 채택률은 서로 다른 승자를 가리키므로, 둘을 합치지 않고 ', { t: '분리해서', b: true }, ' 결론 낸다.']),
      bullet([{ t: '소비자 1위 — ChatGPT.', b: true }, ' 10월 주간 활성 사용자 8억 명, 8월 AI 도구 웹 트래픽의 69%, a16z 웹·모바일 동시 1위. 독립 3출처가 모두 같은 방향이다.']),
      bullet([{ t: '개발자 도구 1위 — GitHub Copilot.', b: true }, ' 개발자 67.9%가 사용하고, GitHub 신규 가입자의 80%가 첫 주 안에 쓴다.']),
      bullet([{ t: '하반기의 진짜 사건은 1위가 아니라 2위권의 이동이다.', b: true }, ' 기업 코딩 시장에서 ', { t: 'Anthropic Claude', b: true }, '가, 소비자 시장에서 ', { t: 'Google Gemini', b: true }, '가 하반기 순위표를 바꿨다.']),

      H('2. 조사 방법론', 2),
      P(['두 축으로 나눠 각각 1차 출처만 인용했다. 요약 매체가 아니라 발행처 원문에서 수치를 뽑았다.']),
      tbl([17, 27, 34, 22], ['축', '출처', '측정 방식', '기준 시점'], [
        [[{ t: 'A. 사용자 규모', b: true }], [{ url: SRC_A16Z5, label: 'a16z 5판' }], 'Similarweb 방문자 + Sensor Tower MAU', '2025-08'],
        ['', [{ url: 'https://www.similarweb.com/blog/marketing/seo/most-used-ai/', label: 'Similarweb' }], '웹 트래픽 패널', '2025 전체'],
        ['', [{ t: 'OpenAI DevDay · ' }, { url: 'https://s206.q4cdn.com/479360582/files/doc_financials/2025/q3/2025q3-alphabet-earnings-release.pdf', label: 'Alphabet Q3' }], '벤더 자체 집계 WAU·MAU', '2025-10'],
        [[{ t: 'B. 개발자·업계', b: true }], [{ url: SRC_SO, label: 'Stack Overflow 2025' }], '자발적 응답 49,000명+', '2025 상반기'],
        ['', [{ url: SRC_MENLO, label: 'Menlo Ventures' }], '미국 기업 의사결정자 495명', '2025-11'],
        ['', [{ url: 'https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/', label: 'GitHub Octoverse' }], '플랫폼 실측 로그', '2024-09~2025-08'],
      ]),
      spacer(),
      callout([{ t: '판정 규칙  ', b: true }, '① 독립 2출처가 일치할 때만 순위를 단정한다.  ② 두 축의 1위가 다르면 통합하지 않고 나눠 적는다.  ③ 근거가 부족하면 “판정 불가”로 남긴다.']),

      H('3. 종합 순위', 2),
      tbl([22, 22, 19, 20, 17], ['부문', '1위', '2위', '3위', '근거'], [
        ['소비자 웹', [{ t: 'ChatGPT', b: true }], 'Gemini', 'Perplexity', 'a16z 5판'],
        ['소비자 모바일', [{ t: 'ChatGPT', b: true }], 'Gemini', 'Character.AI', 'a16z 5판'],
        ['개발자 코딩 도구', [{ t: 'GitHub Copilot (67.9%)', b: true }], 'Cursor (18%)', 'Claude Code (10%)', 'SO 2025'],
        ['기업 LLM API 지출', [{ t: 'Anthropic (40%)', b: true }], 'OpenAI (27%)', 'Google (21%)', 'Menlo'],
        ['기업 코딩 모델', [{ t: 'Anthropic (54%)', b: true }], 'OpenAI (21%)', '—', 'Menlo'],
      ]),
      ...picture(PNG('a16z-web-top50.png'), 'a16z 5판 웹 TOP 50 (2025-08-27 발행). 출처:', { url: SRC_A16Z5, label: 'a16z' }),

      H('4. 카테고리별 분석', 2),
      H('챗봇·범용 LLM — ChatGPT 독주, 그러나 격차 축소', 3),
      P(['ChatGPT는 2월 4억 명에서 10월 8억 WAU로 7개월 만에 두 배가 됐다. 8월 기준 전체 AI 도구 트래픽의 69%를 혼자 가져갔고, 같은 시점 Gemini 웹 트래픽은 ChatGPT의 약 12% 수준이었다.']),
      P(['문제는 추세다. Gemini 앱은 Q3에 MAU 6억 5천만 명을 넘겼고, 2025년 한 해 트래픽이 ', { t: '548% 늘었다', b: true }, '(9월 +46%, 12월 +28%). 반면 DeepSeek는 2월 정점 대비 40% 이상 빠졌고, Grok은 7월 모델 공개로 모바일 사용량이 한 달 만에 40% 가까이 뛰었다.']),

      H('코딩 — 채택률은 Copilot, 지출은 Anthropic', 3),
      P(['하반기 판도가 가장 크게 흔들린 곳이다. ', { t: '“누가 많이 쓰나”와 “돈이 어디로 가나”의 답이 갈린다.', b: true }]),
      ...picture(PNG('chart-dev-tool-adoption.png'), '상반기 설문 기준선. 출처:', { url: SRC_SO, label: 'Stack Overflow Developer Survey 2025' }),
      tbl([26, 22, 52], ['도구', '개발자 사용률', '비고'], [
        ['GitHub Copilot', [{ t: '67.9%', b: true }], '신규 GitHub 가입자 80%가 첫 주 사용'],
        ['Cursor', '18%', '2025년 설문 첫 등재'],
        ['Claude Code', '10%', '2025년 설문 첫 등재'],
        ['Windsurf', '5%', '—'],
      ]),
      spacer(),
      P(['그런데 11월 Menlo 조사에서 Anthropic은 기업 ', { t: '코딩 모델 시장의 54%', b: true }, '를 차지했다. 6개월 전 42%에서 올라간 수치이며, 원문은 그 상승의 주된 동력으로 Claude Code를 지목한다. OpenAI는 21%다. 즉 Copilot이 여전히 가장 널리 깔린 도구인 반면, 그 아래에서 돌아가는 모델과 기업 예산은 Anthropic 쪽으로 이동했다.']),
      ...picture(PNG('chart-enterprise-llm-share.png'), 'OpenAI 50%→27%, Anthropic 12%→40%. 출처:', { url: SRC_MENLO, label: 'Menlo Ventures' }),

      H('기업 도입 — AI 예산의 절반이 코딩으로', 3),
      P(['2025년 기업 생성형 AI 지출은 ', { t: '370억 달러', b: true }, '로 전년(115억) 대비 3.2배가 됐다. 부서별 지출 73억 달러 중 코딩이 40억 달러, 55%를 가져갔다. 다른 어떤 용도도 이 근처에 못 온다.']),
      ...picture(PNG('chart-departmental-spend.png'), '출처:', { url: SRC_MENLO, label: 'Menlo Ventures' }),

      H('이미지·영상 생성 — 판정 불가', 3),
      P(['하반기 구간의 1차 순위 데이터가 없다. a16z 5판은 8월, 6판은 2026년 1월 기준이라 그 사이가 비어 있다. Midjourney가 TOP 10에서 46위로 떨어진 것은 확인되지만 ', { t: '하반기 중 언제인지 특정할 수 없어', b: true }, ' 순위를 적지 않는다.']),

      H('개발 생태계 전반', 3),
      P(['GitHub 개발자는 1억 8천만 명을 넘겼고 한 해 3,600만 명이 새로 들어왔다. LLM SDK를 쓰는 공개 저장소는 110만 개(+178%), Copilot coding agent는 5~9월에 PR 100만 건 이상을 열었다. 8월에는 ', { t: 'TypeScript가 사상 처음 Python·JavaScript를 제치고 1위 언어', b: true }, '가 됐다. AI 코딩 도구가 타입 있는 언어에서 훨씬 잘 동작하기 때문이라는 게 GitHub의 해석이다.']),

      H('5. 하반기의 변화 요약', 2),
      tbl([18, 82], ['시점', '사건'], [
        ['7월', 'Grok 모바일 +40%; SO 설문 공개(AI 신뢰도 하락)'],
        ['8월', 'a16z 5판 — Lovable 웹 22위 진입, 웹 11개·모바일 14개 신규'],
        ['10월', 'ChatGPT 8억 WAU; Gemini 6.5억 MAU; Octoverse 공개'],
        ['11~12월', 'Anthropic 기업 LLM 1위(40%) 확정; Gemini 트래픽 +28%'],
      ]),
      spacer(),
      callout([{ t: '하반기는 ChatGPT의 왕좌가 흔들린 시기가 아니라, 2위 자리를 놓고 Gemini와 Anthropic이 각자의 시장에서 자리를 잡은 시기였다.', b: true }]),

      H('6. 한계와 반증', 2),
      num([{ t: '구간 공백', b: true }, ' — a16z 5판(8월)과 6판(2026년 1월) 사이에 스냅샷이 없다. 하반기 후반 소비자 순위는 성장률로 방향만 추정했다.']),
      num([{ t: '설문 시점', b: true }, ' — Stack Overflow 조사는 상반기 실시다. Claude Code 10%, Cursor 18%는 하반기 실제 채택률보다 ', { t: '낮게 잡혔을 가능성이 크다', b: true }, ' (Menlo의 54%와 대조).']),
      num([{ t: '패널 추정치', b: true }, ' — Similarweb·Sensor Tower는 실측이 아니다. 절대값이 아니라 상대 순위와 추세만 신뢰해야 한다.']),
      num([{ t: '지표 비교 불가', b: true }, ' — WAU·MAU·순 방문자는 정의가 달라 직접 비교할 수 없다. 본문에서 두 수치를 나란히 놓지 않은 이유다.']),
      num([{ t: '표본 편향', b: true }, ' — Menlo는 미국 기업 495명 한정이다. 중국권(Doubao, Quark, Kimi)과 한국 시장은 두 축 모두 과소 반영됐다.']),
      new Paragraph({ spacing: { before: 160, after: 120, line: 300 }, children: runs([{ t: '뒤집힐 조건: ', b: true }, '하반기 중반 Similarweb 원자료에서 Gemini 웹 점유율이 30%를 넘었던 것으로 확인되면, 3장의 “독주”는 “격차 급속 축소”로 고쳐야 한다.']) }),

      H('7. 출처', 2),
      ...[
        [{ url: SRC_A16Z5, label: 'a16z, The Top 100 Gen AI Consumer Apps — 5th Edition' }, ' (2025-08-27)'],
        [{ url: 'https://a16z.com/100-gen-ai-apps-6/', label: 'a16z, 6th Edition' }, ' (2026-03-09, 기간 밖 참고)'],
        [{ url: SRC_SO, label: 'Stack Overflow Developer Survey 2025 — AI' }, ' · ', { url: 'https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/', label: '보도자료' }, ' (2025-07-29)'],
        [{ url: SRC_MENLO, label: 'Menlo Ventures, 2025: The State of Generative AI in the Enterprise' }, ' (2025-12-09)'],
        [{ url: 'https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/', label: 'GitHub Octoverse 2025' }, ' (2025-10-28)'],
        [{ url: 'https://www.similarweb.com/blog/marketing/seo/most-used-ai/', label: 'Similarweb, Most Used AI Tools' }, ' · ', { url: 'https://www.similarweb.com/blog/insights/marketing-insights/gen-ai-market-winners/', label: 'Winners and Losers in the Gen AI Market' }],
        [{ url: 'https://s206.q4cdn.com/479360582/files/doc_financials/2025/q3/2025q3-alphabet-earnings-release.pdf', label: 'Alphabet Q3 2025 실적 발표' }, ' (2025-10-29) · ', { url: 'https://9to5google.com/2025/10/29/gemini-app-650-million-users/', label: '9to5Google 보도' }],
        [{ url: 'https://slashdot.org/story/25/10/06/1848254/chatgpt-now-has-800-million-weekly-active-users', label: 'OpenAI DevDay — ChatGPT 8억 WAU 보도' }, ' (2025-10-06)'],
      ].map((parts) => bullet(parts.map((p) => (typeof p === 'string' ? { t: p, size: 19 } : p)))),
    ],
  }],
});

const out = path.join(ROOT, '2025년 하반기 인기 AI 도구 보고서.docx');
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log('WROTE', out, Math.round(buf.length / 1024) + ' KB');
});
