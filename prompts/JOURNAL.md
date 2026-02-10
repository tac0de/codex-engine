# Design Journal — The Divine Paradox

## 2026-02-09 — CHECKLIST 적용 작업

### 목적
프로젝트가 "장난감"으로 인식되지 않게 하기 위한 CHECKLIST.md 가이드라인을 UI에 반영.

### 결정 사항

**1. 정체성 요소 (Identity Layer)**
- 기존: "Receive Your Gift", "The Divine Entity offers you power..."
- 변경: "Stateful Paradox System", "A stateful behavior system observing long-term interaction..."
- 이유: "무엇을 하는가"보다 "무엇을 검증하는가"를 강조하기 위해
- 적용 위치:
  - index.html: title, meta description, og:description, h1, p
  - js/text.js: title, desc (4개 언어)

**2. 의도 명시 요소 (Intent Declaration)**
- 추가: "This is an experimental system designed to observe behavior-level constraints"
- 추가: "The purpose is behavior observation, not providing instant utility or entertainment"
- 이유: 사용자에게 "왜 이게 존재하는지"를 명확히 알려주기 위해
- 적용 위치:
  - index.html: meta description, About 모달
  - js/text.js: aboutWhatIsP1, aboutWhatIsP2

**3. 배제 선언 요소 (What this is NOT)**
- 추가: "What This Is NOT" 섹션
- 목록:
  - ❌ A productivity tool
  - ❌ A chatbot demo
  - ❌ An instant utility provider
- 이유: 사람들이 기본적으로 "챗봇 = 도구"로 해석하는 것을 끊어주기 위해
- 적용 위치: About 모달 (js/text.js: aboutWhatNot, aboutNotProductivity, aboutNotChatbot, aboutNotUtility)

**4. 설계 깊이 신호 (Depth Signal)**
- 추가: "System Design" 섹션
- 목록:
  - Stateful behavior — internal state across interactions
  - Long-term interaction — patterns emerge over time
  - Bounded memory — recent preferences influence future responses
  - Behavior-driven constraints — response policies prevent shallow loops
- 이유: 구현 설명이 아니라 "결정의 흔적"을 보여주기 위해
- 적용 위치: About 모달 (js/text.js: aboutDesignIntro, aboutStateful, aboutLongTerm, aboutBounded, aboutBehavior)

**5. 사용 기대치 조정 요소 (Expectation Control)**
- 추가: "Short interactions will not reveal its design."
- 추가: "Time and context accumulation are required."
- 형식: h1 바로 아래 desc에 소형 텍스트로 추가
- 이유: 평가 시점을 뒤로 미루기 위해
- 적용 위치:
  - index.html: desc 안의 <small>
  - About 모달: "How to Observe" 섹션

**6. 톤 & 어휘 필터 (Language Filter)**
- 제거/변경:
  - "Receive" → "Generate"
  - "Gifts Received" → "Observations"
  - "Divine Favor" → "Interaction Depth"
  - "Achievements" → "Milestones"
  - "Treasury" → "Observation Log"
  - "Archive Relic" → "Archive Observation"
  - ✨ LEGENDARY GIFT ✨ → ★ LEGENDARY PATTERN ★
- 이유: fun, play, magical 같은 단어를 피하고 observe, examine, system behavior 같은 단어를 사용하기 위해
- 적용 위치: js/text.js 전체 (4개 언어)

### 기술적 변경

**index.html**
- 메타 태그 변경 (title, description, keywords, og, twitter)
- JSON-LD schema 변경 (UtilityApplication → EducationalApplication)
- 본문 h1, p 변경
- About 링크를 외부 GitHub에서 내부 모달로 변경
- About 모달 추가 (id 기반 동적 텍스트)

**js/text.js**
- UI_TEXT의 모든 키를 체크리스트 톤에 맞게 수정
- About 모달 관련 키 추가 (aboutTitle, aboutWhatIs, aboutWhatNot 등 18개 키)
- 4개 언어 (en, ko, ja, zh) 모두에 일관되게 적용

**main.js**
- applyLang 함수에 About 모달 다국어 텍스트 처리 추가
- About 모달 이벤트 리스너 추가 (open, close, click outside)
- ESC 키 처리에 About 모달 추가

### 유지 보수 노트

**단순성 원칙 준수**
- 새로운 의존성 없음
- 기존 파일 구조 유지 (index.html, js/text.js, main.js)
- 모달 처리는 기존 패턴 따름 (privacyModal, achievementsModal, treasuryModal)
- 다국어는 기존 UI_TEXT 패턴 따름

**추가되지 않은 것**
- 별도의 CSS 파일 (기존 style.css 재사용)
- 별도의 JS 모듈 (기존 main.js에 추가)
- 새로운 라이브러리나 프레임워크

### 검증 체크리스트

- [x] 4개 언어 모두에 키 추가
- [x] applyLang에서 DOM 반영 경로 추가
- [x] 하드코딩된 텍스트 없이 다국어 처리
- [x] 기존 UX 플로우 회귀 없음
- [x] 생성 → 저장/복사 → 재생성 플로우 정상
- [x] ESC 키로 모든 모달 닫기

### 다음 단계 (옵션)

1. Privacy 모달도 다국어 완전 처리 (현재 영어 고정 텍스트 존재)
2. OpenGraph 이미지 업데이트 (새 title/description 반영)
3. 애니메이션/시각 효과 강화 (system behavior 강조)

---

## 2026-02-11 — AI 생성 결과물 톤 수정 (generate.ts)

### 목적
UI뿐만 아니라 AI가 실제로 생성하는 결과물(아웃풋)의 톤도 CHECKLIST에 맞게 수정. 사용자 요청: "실제 아웃풋이 띄어쓰기가 한글외에도 다 적용되어야해"

### 결정 사항

**1. 시스템 프롬프트 톤 변경**
- 기존: "You are a Divine Entity offering blessed gifts with inherent burdens."
- 변경: "You are a paradox-generating system that produces stateful behavior patterns."
- 이유: AI 생성 결과물도 CHECKLIST 톤을 따르도록 하기 위해
- 변경된 introPhrases:
  - "You are a paradox-generating system that produces stateful behavior patterns."
  - "You represent behavioral paradoxes - every action produces observable consequences."
  - "You are an experimental system documenting ability-constraint relationships."
  - "You generate paradox patterns for long-term interaction observation."

**2. 시스템 프롬프트 지침 변경**
- "cost" → "consequence" (비용 → 결과/제약)
- "burden, curse" → "constraint, burden, or systemic cost"
- 추가: "Focus on behavior-level constraints and internal state transitions"
- 이유: 실험 시스템의 성격 강조

**3. 사용자 프롬프트 톤 변경 (DIVINE FAVOR → INTERACTION DEPTH)**
- 기존: "**DIVINE FAVOR**: The user has achieved ${combo}x combo..."
- 변경: "**INTERACTION DEPTH**: The user has achieved ${combo}x sustained interaction..."
- 이유: "divine" 용어 제거, "sustained interaction" 용어 사용

**4. 사용자 프롬프트 톤 변경 (GOD'S MOOD → SYSTEM STATE)**
- 기존: "**GOD'S MOOD**: Pleased - The Entity is benevolent..."
- 변경: "**SYSTEM STATE**: Positive - The system is in a responsive state..."
- 이유: 신적 존재 톤 제거, 시스템 상태 톤 사용

**5. 다국어 포맷팅 지시사항 강화**
- 한국어: 기존과 동일 (띄어쓰기 강조)
- 일본어: "Use appropriate punctuation (。、) for clause separation. Ensure proper reading flow." 추가
- 중국어: "Use appropriate punctuation (。，、) for clear clause separation. Ensure proper reading flow." 추가
- 영어: "Use proper English word spacing and punctuation. Ensure clear clause separation with commas. Avoid run-on sentences." 추가
- 이유: 모든 언어의 결과물이 적절하게 포맷팅되도록 하기 위해

**6. 포맷팅 fix 함수 일반화**
- 기존: `fixKoreanSpacingIfNeeded` (한국어만)
- 변경: `fixFormattingIfNeeded(text, targetLang)` (모든 언어)
- 새로운 `needsFormattingFix(text, lang)` 함수:
  - 한국어: 띄어쓰기 부족 확인 (기존과 동일)
  - 영어: 구두점 후 공백 누락, 과도한 공백 확인
  - 일본어: 과도한 공백 확인 (일본어는 공백이 적어야 함)
  - 중국어: 과도한 공백 확인 (중국어는 공백이 거의 없어야 함)
- 이유: 모든 언어의 결과물 포맷팅 품질 보장

### 기술적 변경

**netlify/functions/generate.ts**
- `generateSystemPrompt()`: introPhrases와 지침 톤 변경
- `generateUserPrompt()`:
  - "DIVINE FAVOR" → "INTERACTION DEPTH"
  - "GOD'S MOOD" → "SYSTEM STATE"
  - 언어별 포맷팅 지시사항 강화 (en 추가)
- `needsFormattingFix()`: 다국어 포맷팅 검사 함수 추가
- `fixFormattingIfNeeded()`: 다국어 포맷팅 수정 함수로 일반화

### 유지 보수 노트

**단순성 원칙 준수**
- 새로운 API 호출 없음 (기존 OpenAI API 재사용)
- 함수 이름만 변경 (fixKoreanSpacingIfNeeded → fixFormattingIfNeeded)
- 새로운 기능 추가 (needsFormattingCheck)
- 기존 프롬프트 구조 유지, 톤만 변경

**성능 고려사항**
- 포맷팅 fix는 필요한 경우에만 실행 (needsFormattingCheck)
- 각 언어별 적절한 max_output_tokens: 200 (짧은 수정이므로)
- 추가 API 호출이 있으므로 응답 시간 +0.5~1초 예상

### 검증 체크리스트

- [x] 시스템 프롬프트 톤 변경 (Divine → paradox-generating system)
- [x] 사용자 프롬프트 톤 변경 (DIVINE FAVOR → INTERACTION DEPTH)
- [x] 사용자 프롬프트 톤 변경 (GOD'S MOOD → SYSTEM STATE)
- [x] 모든 언어에 포맷팅 지시사항 추가
- [x] needsFormattingCheck 함수 구현
- [x] fixFormattingIfNeeded로 일반화
- [x] 한국어, 영어, 일본어, 중국어 모두 처리

---

## 2026-02-09 — 작업 시작 전 생각

### 문제 인식
현재 프로젝트는 "The Divine Paradox"라는 능력 생성기입니다. 그런데 CHECKLIST.md를 보니, 현재 UI가 "장난감"으로 인식될 위험이 있다고 합니다.

핵심 문제:
1. "fun", "play", "magical" 같은 단어가 많음
2. "무엇을 검증하는가"가 드러나지 않음
3. "실험 시스템"임이 명시되지 않음
4. "productivity tool", "chatbot demo"가 아님을 명시하지 않음

### 해결 방향
CHECKLIST.md의 6가지 요소를 UI에 반영:
1. 정체성 요소: stateful, behavior-driven, long-term interaction 키워드
2. 의도 명시: 실험 시스템, 행동 관찰 목적 명시
3. 배제 선언: productivity tool, chatbot demo 아님 명시
4. 설계 깊이: internal state transitions, bounded memory 등 설계 결정 표시
5. 기대치 조정: 짧은 상호작용으로는 의도 드러나지 않음 안내
6. 톤 & 어휘: fun, play 피하고 observe, examine 사용

### 제약 조건
- "최대한 단순한 방향으로"
- "기술스택 및 코드가 커지지 않게"
- 기존 파일 구조 유지
- 새로운 의존성 없음

---

## (계속 작성 예정)

작업이 진행될 때마다 이 문서에 결정 사항과 이유를 기록합니다.
