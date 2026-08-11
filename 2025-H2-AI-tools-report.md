# 2025년 하반기 가장 인기 있었던 AI 도구

**조사 기간** 2025-07-01 ~ 2025-12-31 · **작성** 2026-08-11 · **수치 원장** [research-notes.md](research-notes.md)

## 1. 핵심 요약

"인기"는 단일 지표가 아니다. 소비자 사용량과 개발자 채택률은 서로 다른 승자를 가리킨다. 그래서 이 보고서는 둘을 하나로 합치지 않고 **분리해서** 결론 낸다.

- **소비자 1위 — ChatGPT.** 10월 주간 활성 사용자 8억 명, 8월 AI 도구 웹 트래픽의 69%, a16z 웹·모바일 동시 1위. 독립 3출처가 모두 같은 방향이다.
- **개발자 도구 1위 — GitHub Copilot.** 개발자 67.9%가 사용하고, GitHub 신규 가입자의 80%가 첫 주 안에 쓴다.
- **하반기의 진짜 사건은 1위가 아니라 2위권의 이동이다.** 기업 코딩 시장에서 **Anthropic Claude**가, 소비자 시장에서 **Google Gemini**가 하반기 순위표를 바꿨다.

## 2. 조사 방법론

두 축으로 나눠 각각 1차 출처만 인용했다. 요약 매체가 아니라 발행처 원문에서 수치를 뽑았다.

| 축 | 출처 | 측정 방식 | 기준 시점 |
|---|---|---|---|
| A. 사용자 규모 | [a16z Top 100 Gen AI Apps 5판](https://a16z.com/100-gen-ai-apps-5/) | Similarweb 순 방문자 + Sensor Tower MAU | 2025-08 |
| A. 사용자 규모 | [Similarweb Gen AI 분석](https://www.similarweb.com/blog/marketing/seo/most-used-ai/) | 웹 트래픽 패널 | 2025 전체 |
| A. 사용자 규모 | 벤더 공식 발표 (OpenAI DevDay, [Alphabet Q3](https://s206.q4cdn.com/479360582/files/doc_financials/2025/q3/2025q3-alphabet-earnings-release.pdf)) | 자체 집계 WAU·MAU | 2025-10 |
| B. 개발자·업계 | [Stack Overflow 설문 2025](https://survey.stackoverflow.co/2025/ai) | 자발적 응답 49,000명+ | 2025 상반기 |
| B. 개발자·업계 | [Menlo Ventures 기업 리포트](https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/) | 미국 기업 의사결정자 495명 | 2025-11 |
| B. 개발자·업계 | [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) | 플랫폼 실측 로그 | 2024-09~2025-08 |

**판정 규칙** ① 독립 2출처가 일치할 때만 순위를 단정한다. ② 두 축의 1위가 다르면 통합하지 않고 나눠 적는다. ③ 근거가 부족하면 "판정 불가"로 남긴다.

## 3. 종합 순위

| 부문 | 1위 | 2위 | 3위 | 근거 |
|---|---|---|---|---|
| 소비자 웹 | ChatGPT | Gemini | Perplexity | a16z 5판 |
| 소비자 모바일 | ChatGPT | Gemini | Character.AI | a16z 5판 |
| 개발자 코딩 도구 | GitHub Copilot (67.9%) | Cursor (18%) | Claude Code (10%) | SO 2025 |
| 기업 LLM API 지출 | Anthropic (40%) | OpenAI (27%) | Google (21%) | Menlo |
| 기업 코딩 모델 | Anthropic (54%) | OpenAI (21%) | — | Menlo |

![a16z 웹 부문 상위 50개 생성형 AI 서비스 (2025년 8월)](https://d1lamhf6l6yk6d.cloudfront.net/uploads/2025/08/Top-Gen-AI-Web-Top-50-List-1.png)

*a16z 5판 웹 TOP 50 (2025-08-27 발행). 출처: [a16z](https://a16z.com/100-gen-ai-apps-5/)*

## 4. 카테고리별 분석

### 챗봇·범용 LLM — ChatGPT 독주, 그러나 격차 축소

ChatGPT는 2월 4억 명에서 10월 8억 WAU로 7개월 만에 두 배가 됐다. 8월 기준 전체 AI 도구 트래픽의 69%를 혼자 가져갔고, 같은 시점 Gemini 웹 트래픽은 ChatGPT의 약 12% 수준이었다.

문제는 추세다. Gemini 앱은 Q3에 MAU 6억 5천만 명을 넘겼고, Similarweb 집계로 2025년 한 해 트래픽이 **548% 늘었다**. 특히 9월(+46%)과 12월(+28%)에 급등했다. 반면 DeepSeek는 2월 정점 대비 40% 이상 빠졌고, Grok은 7월 모델 공개로 모바일 사용량이 한 달 만에 40% 가까이 뛰었다.

### 코딩 — 채택률은 Copilot, 지출은 Anthropic

이 부문이 하반기 판도가 가장 크게 흔들린 곳이다. **"누가 많이 쓰나"와 "돈이 어디로 가나"의 답이 갈린다.**

![개발자 AI 코딩 도구 사용률](assets/chart-dev-tool-adoption.svg)

*상반기 설문 기준선. 출처: [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/ai)*

| 도구 | 개발자 사용률 | 비고 |
|---|---|---|
| GitHub Copilot | 67.9% | 신규 GitHub 가입자 80%가 첫 주 사용 |
| Cursor | 18% | 2025년 설문 첫 등재 |
| Claude Code | 10% | 2025년 설문 첫 등재 |
| Windsurf | 5% | — |

그런데 11월 Menlo 조사에서 Anthropic은 기업 **코딩 모델 시장의 54%**를 차지했다. 6개월 전 42%에서 올라간 수치이며, 원문은 그 상승의 주된 동력으로 Claude Code를 지목한다. OpenAI는 21%다. 즉 Copilot이 여전히 가장 널리 깔린 도구인 반면, 그 아래에서 돌아가는 모델과 기업 예산은 Anthropic 쪽으로 이동했다.

![엔터프라이즈 LLM API 점유율 3개년 변화](assets/chart-enterprise-llm-share.svg)

*OpenAI 50%→27%, Anthropic 12%→40%. 출처: [Menlo Ventures](https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/)*

### 기업 도입 — AI 예산의 절반이 코딩으로

2025년 기업 생성형 AI 지출은 **370억 달러**로 전년(115억) 대비 3.2배가 됐다. 부서별 지출 73억 달러 중 코딩이 40억 달러, 55%를 가져갔다. 다른 어떤 용도도 이 근처에 못 온다.

![2025년 기업 부서별 AI 지출](assets/chart-departmental-spend.svg)

*출처: [Menlo Ventures](https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/)*

### 이미지·영상 생성 — 판정 불가

하반기 구간의 1차 순위 데이터가 없다. a16z 5판은 8월, 6판은 2026년 1월 기준이라 그 사이가 비어 있다. Midjourney가 TOP 10에서 46위로 떨어진 것은 확인되지만 **하반기 중 언제인지 특정할 수 없어** 순위를 적지 않는다.

### 개발 생태계 전반

GitHub 개발자는 1억 8천만 명을 넘겼고, 한 해 3,600만 명이 새로 들어왔다. LLM SDK를 쓰는 공개 저장소는 110만 개(+178%). Copilot coding agent는 5~9월 다섯 달 동안 PR 100만 건 이상을 열었다. 8월에는 **TypeScript가 사상 처음 Python·JavaScript를 제치고 1위 언어**가 됐는데, AI 코딩 도구가 타입이 있는 언어에서 훨씬 잘 동작하기 때문이라는 게 GitHub의 해석이다.

## 5. 하반기의 변화 요약

| 시점 | 사건 |
|---|---|
| 7월 | Grok 모바일 +40%; Stack Overflow 설문 공개(AI 신뢰도 하락 확인) |
| 8월 | a16z 5판 — Lovable 웹 22위 신규 진입, 웹 11개·모바일 14개 신규 |
| 10월 | ChatGPT 8억 WAU 발표; Gemini 6.5억 MAU; Octoverse 공개 |
| 11~12월 | Menlo 조사 — Anthropic이 기업 LLM 1위(40%) 확정; Gemini 트래픽 +28% |

한 문장으로: **하반기는 ChatGPT의 왕좌가 흔들린 시기가 아니라, 2위 자리를 놓고 Gemini와 Anthropic이 각자의 시장에서 확실히 자리를 잡은 시기였다.**

## 6. 한계와 반증

1. **구간 공백** — a16z 5판(8월)과 6판(2026년 1월) 사이에 스냅샷이 없다. 하반기 후반 소비자 순위는 성장률로 방향만 추정했다.
2. **설문 시점** — Stack Overflow 조사는 상반기에 실시됐다. Claude Code 10%, Cursor 18%는 하반기 실제 채택률보다 **낮게 잡혔을 가능성이 크다.** Menlo의 54%와 대조하면 그렇다.
3. **패널 추정치** — Similarweb·Sensor Tower는 실측이 아니다. 절대값이 아니라 상대 순위와 추세만 신뢰해야 한다.
4. **지표 비교 불가** — WAU(OpenAI), MAU(Google), 순 방문자(Similarweb)는 정의가 달라 직접 비교할 수 없다. 본문에서 두 수치를 나란히 놓지 않은 이유다.
5. **표본 편향** — Menlo는 미국 기업 495명 한정이다. 중국권 서비스(Doubao, Quark, Kimi)와 한국 시장은 두 축 모두에서 과소 반영됐다.

**결론이 뒤집힐 조건:** 하반기 중반 시점의 Similarweb 원자료가 공개되어 Gemini의 웹 점유율이 30%를 넘었던 것으로 확인되면, "ChatGPT 독주"라는 3장의 표현은 "격차 급속 축소"로 수정해야 한다.

## 7. 출처

- [a16z, The Top 100 Gen AI Consumer Apps — 5th Edition](https://a16z.com/100-gen-ai-apps-5/) (2025-08-27)
- [a16z, 6th Edition](https://a16z.com/100-gen-ai-apps-6/) (2026-03-09, 기간 밖 참고)
- [Stack Overflow Developer Survey 2025 — AI](https://survey.stackoverflow.co/2025/ai) · [보도자료](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/) (2025-07-29)
- [Menlo Ventures, 2025: The State of Generative AI in the Enterprise](https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/) (2025-12-09)
- [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) (2025-10-28)
- [Similarweb, Most Used AI Tools](https://www.similarweb.com/blog/marketing/seo/most-used-ai/) · [Winners and Losers in the Gen AI Market](https://www.similarweb.com/blog/insights/marketing-insights/gen-ai-market-winners/)
- [Alphabet Q3 2025 실적 발표](https://s206.q4cdn.com/479360582/files/doc_financials/2025/q3/2025q3-alphabet-earnings-release.pdf) (2025-10-29) · [9to5Google 보도](https://9to5google.com/2025/10/29/gemini-app-650-million-users/)
- [OpenAI DevDay — ChatGPT 8억 WAU 보도](https://slashdot.org/story/25/10/06/1848254/chatgpt-now-has-800-million-weekly-active-users) (2025-10-06)
