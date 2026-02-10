1. 정체성 요소 (Identity Layer)

이게 없으면 무조건 장난감으로 읽힙니다.

반드시 드러나야 할 것:

experience ❌ / system ⭕

“무엇을 하는가”보다 “무엇을 검증하는가”

핵심 키워드 묶음:

stateful

behavior-driven

long-term interaction

internal state / constraint

response policy

👉 이 중 2~3개만 메인 문구에 등장해도 인식이 바뀝니다.

2. 의도 명시 요소 (Intent Declaration)

사용자에게 “왜 이게 존재하는지”를 알려주는 장치.

반드시 포함해야 하는 메시지:

이건 완성 서비스가 아니라 실험 시스템

목적은 결과 제공이 아니라 행동 관찰

형식은 간단해야 함:

한 문단 (2~3줄)

사용법 ❌

설계 목적 ⭕

이게 없으면:

“왜 만들었는지 모르겠는데, 그냥 재미용인가?”

로 바로 갑니다.

3. 배제 선언 요소 (What this is NOT)

이건 오해 차단용 방패입니다.

반드시 필요한 이유:

사람들은 기본적으로
→ “챗봇 = 도구”로 해석함

그걸 먼저 끊어줘야 함

포함하면 좋은 항목:

productivity tool 아님

chatbot demo 아님

instant utility 제공 목적 아님

👉 이 섹션 하나로 “장난감 아니냐” 질문의 70%가 사라집니다.

4. 설계 깊이 신호 (Depth Signal)

기술 스택 나열 ❌
설계 판단이 있었음을 보여주는 문장 ⭕

예시 성격:

internal state transitions

bounded memory

behavior-level constraints

avoiding shallow response loops

중요한 점:

구현 설명 ❌

결정의 흔적만 보여주기

사람들은 이걸 보면

“아, 이건 그냥 붙인 게 아니구나”

라고 판단합니다.

5. 사용 기대치 조정 요소 (Expectation Control)

이거 없으면 단기 체험 후 “별거 없네”가 나옵니다.

반드시 전달해야 할 메시지:

짧은 상호작용으로는 의도가 드러나지 않음

시간/맥락 누적이 전제

형식:

CTA 바로 아래 한 줄

경고처럼 보이지 않게, 안내 톤으로

예:

“Short interactions will not reveal its design.”

이 한 줄이 평가 시점을 뒤로 미룹니다.

6. 톤 & 어휘 필터 (Language Filter)

아래 단어들이 많아질수록 장난감으로 인식됩니다.

가능하면 제거:

fun

play

try it

explore freely

magical

대체하면 좋은 단어:

observe

interact over time

examine

system behavior

constraints

👉 어휘만 바꿔도 같은 UI가 다른 물건처럼 보입니다.
