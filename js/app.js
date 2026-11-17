/**
 * ============================================================================
 * 사람 책 도서관: 이야기와 함께 걷기 — 메인 프론트엔드 애플리케이션 (app.js)
 * ============================================================================
 * 1. 로고 (도봉꿈의극단/image/선과요소/사용/로고.png -> 로고_crop.png):
 *    - 상단 맨 왼쪽 '사람 책 도서관'(#brandHomeBtn) 옆에 배치
 *    - '사람 책 도서관'(PROJECT_INFO) 페이지 설명 영역 안에 과감한 크기로 배치
 * 2. Monologue 지도 (도봉꿈의극단/image/선과요소/사용/지도.png):
 *    - 분홍색 원(#ff66cc)이 선들로 연결된 9개 거점 = 청소년예술공간 채움 독백 요소들 (02~10)
 *    - 초록색 원(#86e086)이 선들로 연결된 11개 거점 = 마을극장 흰고무신 독백 요소들 (11~21)
 *    - 원은 원래 색상으로 채워져 있고, 마우스를 가져다 대면 원 안에 그 장소의 사진이 비치면서 원이 조금 커짐
 *    - 원을 누르면 바로 독백이 재생되지 않고 세부 공간요소 페이지에서 해당 벡터요소 바로 앞으로 이동
 * 3. 세부 공간요소 페이지 (도봉꿈의극단/image/공간/벡터/공간벡터-02~21.png & 벡터공간들/2026도봉꿈극-02~21.png):
 *    - 순서대로 채움 9개(02~10), 마을극장 흰고무신 11개(11~21) 총 20개 실제 벡터요소 배치
 *    - 위치는 '벡터공간들/벡터올린것/벡터올린것-02~21.png' (8000x4500, 16:9) 기준 정밀 매핑
 *    - 벡터요소를 클릭하면 독백 음성이 재생되면서 해당 공간 사진(2026도봉꿈극-02~21)이 뜨고,
 *      벡터의 윤곽선은 따지 않고 핀라이트 조명이 켜지듯 글자만 벡터 안의 사물 표면을 따라 천천히 움직임
 * ============================================================================
 */

const USER_VECTOR_ASSETS = [
  // ==================== 청소년예술공간 채움 (9개: 02 ~ 10) ====================
  {
    num: '02',
    id: 'c-01',
    spaceId: 'chaeum',
    code: 'C-01',
    name: '도봉산역 지하철 환승 무빙워크 바닥',
    childName: '김서연 (12세)',
    monologueTitle: '움직이는 바닥 위에서 대사를 중얼거리면',
    quote: '무빙워크 위에 서 있으면 내 다리는 멈춰 있는데 세상이 나를 앞으로 밀어준다.',
    fullStory:
      '지하철에서 내려 채움으로 걸어갈 때 나는 항상 이 긴 통로의 노란 선을 따라 걷는다. 무빙워크 위에 가만히 서 있으면 내 다리는 멈춰 있는데 세상이 나를 앞으로 밀어준다. 그때 오늘 연습할 대사를 작게 중얼거리면, 반대편에서 걸어오는 사람들의 발소리가 내 대사에 박자를 맞춰주는 것 같다.',
    wallText:
      '지하철에서 내려 채움으로 이어지는 긴 통로   ·   무빙워크 위에 서 있으면 세상이 나를 앞으로 밀어준다   ·   반대편 사람들의 발소리가 내 대사의 박자가 된다   ·   노란 점자블록을 따라 이야기가 시작되는 곳',
    mapCircle: { cx: 1071.5, cy: 248.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 11.68, top: 42.53, width: 75.0, height: 57.44 },
    surfaceAngle: -7,
    flowDir: 'flow-left'
  },
  {
    num: '03',
    id: 'c-02',
    spaceId: 'chaeum',
    code: 'C-02',
    name: '문장이 적힌 지하철 연결 계단과 에스컬레이터 난간',
    childName: '박지호 (13세)',
    monologueTitle: '한 칸 오를 때마다 숨이 차오르는 계단 글자들',
    quote: '아래서 올려다보면 계단마다 적힌 글자들이 하나의 큰 그림처럼 합쳐진다.',
    fullStory:
      '에스컬레이터를 타지 않고 일부러 가운데 계단으로 걸어 올라올 때가 있다. 계단마다 응원 문구와 숫자들이 적혀 있는데, 아래서 올려다보면 그 글자들이 하나의 큰 그림처럼 합쳐진다. 숨이 턱까지 차오를 때 뒤를 돌아보면 내가 올라온 높이만큼 내 목소리도 커져 있다.',
    wallText:
      '아래서 올려다보면 하나로 합쳐지는 계단 위 글자들   ·   한 칸 오를 때마다 발밑에서 울리는 계단 소리   ·   숨이 차오를 때 뒤돌아보면 높아진 나의 시선   ·   지하에서 지상의 빛으로 올라가는 사다리',
    mapCircle: { cx: 1685.5, cy: 248.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 19.31, top: 44.6, width: 49.88, height: 55.38 },
    surfaceAngle: -24,
    flowDir: 'flow-left'
  },
  {
    num: '04',
    id: 'c-03',
    spaceId: 'chaeum',
    code: 'C-03',
    name: '환승센터 유리 자동문 입구 격자 조명 천장',
    childName: '최수아 (12세)',
    monologueTitle: '자동문이 열릴 때 바깥 바람과 내 목소리가 섞인다',
    quote: '문턱을 넘을 때마다 평범한 학생에서 이야기꾼으로 변신하는 주문을 속으로 외운다.',
    fullStory:
      '천장의 사각 격자 조명 아래 유리 자동문 앞에 서면 내 모습이 반투명하게 비치고, 그 너머로 버스를 기다리는 사람들이 겹쳐 보인다. 문이 스르륵 열릴 때마다 바깥의 차가운 공기가 로비의 체크무늬 바닥으로 쏟아져 들어온다. 나는 이 문턱을 넘을 때마다 평범한 학생에서 이야기꾼으로 변신하는 주문을 속으로 외운다.',
    wallText:
      '사각 격자 조명 아래 반투명하게 비치는 내 얼굴   ·   문이 열릴 때 체크무늬 바닥으로 쏟아지는 바람   ·   문턱을 넘으며 외우는 나만의 변신 주문   ·   바깥세상과 극장 도서관이 만나는 투명한 경계',
    mapCircle: { cx: 2246.5, cy: 248.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 15.48, top: 0.0, width: 57.45, height: 50.4 },
    surfaceAngle: -12,
    flowDir: 'flow-right'
  },
  {
    num: '05',
    id: 'c-04',
    spaceId: 'chaeum',
    code: 'C-04',
    name: '광역버스환승센터 거대 기둥과 가로 보',
    childName: '이도윤 (11세)',
    monologueTitle: '버스 엔진 소리 뒤에 숨어 기둥에 귀를 대면',
    quote: '이 거대한 회색 기둥이 위층의 우리 연습실을 흔들리지 않게 꼭 받쳐주고 있었다.',
    fullStory:
      '채움 건물 바로 아래에는 커다란 버스들이 쉬지 않고 들어오는 환승센터가 있다. 기둥 둘레에 달린 작은 나무 의자에 앉아 있으면 버스 문이 치익— 열리는 소리와 단풍나무 바람 소리가 같이 들린다. 이 거대한 회색 기둥이 위층의 우리 연습실을 흔들리지 않게 꼭 받쳐주고 있다는 걸 알게 된 날, 기둥이 거인 다리처럼 보였다.',
    wallText:
      '커다란 버스들이 쉬지 않고 숨을 고르는 환승센터   ·   치익— 버스 문 열리는 소리와 은행나무 바람 소리   ·   위층의 우리 연습실을 받쳐주는 거인의 회색 다리   ·   노선도 숫자들 사이로 출발하는 나의 이야기',
    mapCircle: { cx: 2848.5, cy: 248.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 12.59, top: 0.0, width: 49.85, height: 91.8 },
    surfaceAngle: 0,
    flowDir: 'flow-up'
  },
  {
    num: '06',
    id: 'c-05',
    spaceId: 'chaeum',
    code: 'C-05',
    name: '마젠타 핑크 복도 옆 연습실 유리 출입문',
    childName: '정하은 (13세)',
    monologueTitle: '분홍색 벽 앞 유리문을 열면 내 그림자도 분홍빛이 될까',
    quote: '회색 역사를 지나 이 분홍 복도 문 앞에 도착하면 비로소 우리들의 에너지 박스가 열린다.',
    fullStory:
      '에스컬레이터를 다 올라오면 눈앞에 진한 분홍색 벽과 연습실 유리 출입문이 나타난다. C.H.A.E.U.M. 알파벳 사이사이에 마침표가 찍혀 있어서, 나는 걸어가며 그 글자들을 한 글자씩 손가락으로 찍어본다. 회색 역사를 지나 이 문 앞에 도착하면 비로소 우리들의 에너지 박스가 열린다.',
    wallText:
      '회색 역사를 지나 갑자기 나타나는 진한 분홍빛 복도   ·   유리 출입문 너머로 열리는 우리들의 에너지 박스   ·   C.H.A.E.U.M. 마침표마다 손가락으로 찍어보는 박자   ·   내 그림자까지 따뜻한 색으로 물드는 통로',
    mapCircle: { cx: 2466.5, cy: 798.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 48.14, top: 0.0, width: 36.64, height: 99.87 },
    surfaceAngle: 0,
    flowDir: 'flow-up'
  },
  {
    num: '07',
    id: 'c-06',
    spaceId: 'chaeum',
    code: 'C-06',
    name: '주황색 격자 신발장 옆 대기 벽면',
    childName: '강민재 (11세)',
    monologueTitle: '신발을 벗어 넣는 작은 방 안에 비밀을 숨겨두었어',
    quote: '오늘 학교에서 있었던 속상한 일도 신발장 안에 잠깐 맡겨두고 맨발로 무대에 들어간다.',
    fullStory:
      '연습실에 들어가려면 이 주황색 신발장 옆 벽에 기대어 운동화를 벗어야 한다. 칸칸마다 검은 실내화들이 나란히 쉬고 있는 걸 보면 꼭 작은 아파트 창문들 같다. 나는 내 운동화를 넣으면서 오늘 학교에서 있었던 속상한 일도 신발장 안에 잠깐 맡겨두고 맨발로 무대에 들어간다.',
    wallText:
      '주황색 작은 문을 열고 운동화를 벗어 넣는 시간   ·   작은 아파트 창문처럼 나란히 놓인 실내화들   ·   오늘의 걱정을 신발장 칸 안에 잠시 맡겨두고   ·   가벼워진 발걸음으로 나무 마루를 밟는다',
    mapCircle: { cx: 1778.0, cy: 949.5, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 12.5, top: 0.0, width: 31.99, height: 99.98 },
    surfaceAngle: 0,
    flowDir: 'flow-down'
  },
  {
    num: '08',
    id: 'c-07',
    spaceId: 'chaeum',
    code: 'C-07',
    name: 'CHAE UM 우드월과 전면 거울 나무 마루 무대 바닥',
    childName: '윤지우 (12세)',
    monologueTitle: '나무 마루에 누워 거울 속의 나를 가만히 불러보았다',
    quote: '마루 한가운데 대자로 누우면 벽면 거울 속에 누워 있는 또 다른 내가 보인다.',
    fullStory:
      '채움 연습실 바닥은 반질반질한 나무 마루여서 다 같이 뛰면 쿵쿵거리는 진동이 발바닥을 타고 심장까지 올라온다. 연습이 잠깐 쉬는 시간에 마루 한가운데 대자로 누우면, 벽면 거울 속에 누워 있는 또 다른 내가 보인다. 거울 속의 나에게 “너 오늘 꽤 멋있었어” 하고 입모양으로만 말해본다.',
    wallText:
      '발바닥을 타고 심장까지 올라오는 나무 마루의 진동   ·   마루 한가운데 누우면 거울 속에 비치는 또 다른 나   ·   드럼과 건반 옆에서 울려 퍼지던 우리의 목소리   ·   입모양으로 건네는 조용한 응원 한마디',
    mapCircle: { cx: 1158.5, cy: 997.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 11.79, top: 64.73, width: 75.0, height: 35.24 },
    surfaceAngle: -3,
    flowDir: 'flow-left'
  },
  {
    num: '09',
    id: 'c-08',
    spaceId: 'chaeum',
    code: 'C-08',
    name: '무대 천장 블랙 트러스 아래 가로 구조보',
    childName: '한시우 (13세)',
    monologueTitle: '18번과 19번 조명 사이에서 내려다본 우리들의 정수리',
    quote: '만약 내가 저 천장 조명이라면 매일 위에서 아이들의 동그란 정수리를 내려다보며 무슨 생각을 할까.',
    fullStory:
      '고개를 젖혀 천장을 보면 검은 철봉과 가로 구조보 위로 동그란 조명들이 줄지어 매달려 있다. 자세히 보면 파이프에 16, 18, 19 같은 흰 숫자가 적혀 있다. 만약 내가 저 18번 조명이라면 매일 위에서 아이들의 동그란 정수리와 흩어지는 대사들을 내려다보며 무슨 생각을 할까 상상해 보았다.',
    wallText:
      '검은 철봉에 나란히 매달린 16번, 18번, 19번 조명들   ·   위에서 내려다본 아이들의 동그란 정수리와 발걸음   ·   조명이 켜지는 순간 먼지 알갱이마저 별처럼 빛난다   ·   천장에서 쏟아지는 노란 빛의 기둥',
    mapCircle: { cx: 539.0, cy: 1096.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 12.33, top: 70.2, width: 75.39, height: 29.78 },
    surfaceAngle: 7,
    flowDir: 'flow-right'
  },
  {
    num: '10',
    id: 'c-09',
    spaceId: 'chaeum',
    code: 'C-09',
    name: '2단 원목 단차 객석 옆 회색 무대 커튼 벽면',
    childName: '오유진 (12세)',
    monologueTitle: '회색 커튼 옆 나무 단에 걸터앉아 아직 끝나지 않은 이야기를 기다려',
    quote: '옆에 드리운 회색 커튼 뒤로 숨었다가 다시 나오면 관객이었던 내가 순식간에 배우가 된다.',
    fullStory:
      '연습실 뒤쪽에는 계단처럼 두 칸으로 된 나무 턱과 회색 커튼 벽면이 있어서, 자기 차례가 아닐 때는 다들 여기에 쪼르르 걸터앉아 친구들의 연기를 본다. 옆에 드리운 회색 커튼 뒤로 숨었다가 다시 나오면 관객이었던 내가 순식간에 배우가 된다. 수업이 끝나고도 가장 늦게까지 온기가 남아 있는 자리다.',
    wallText:
      '두 칸짜리 나무 단차에 쪼르르 걸터앉은 아이들   ·   회색 커튼을 젖히면 관객에서 배우가 되는 순간   ·   벽면의 작은 검은 창들이 기억하는 우리의 박수 소리   ·   수업이 끝나도 가장 오래 온기가 남는 자리',
    mapCircle: { cx: 269.5, cy: 1698.0, r: 150.8, fill: '#ff66cc' },
    bbox: { left: 12.5, top: 0.0, width: 44.38, height: 99.98 },
    surfaceAngle: 0,
    flowDir: 'flow-up'
  },

  // ==================== 마을극장 흰고무신 (11개: 11 ~ 21) ====================
  {
    num: '11',
    id: 'h-01',
    spaceId: 'huingomusin',
    code: 'H-01',
    name: '‘700-06’ 골목길과 하얀 요철 돌기 외벽',
    childName: '송현우 (12세)',
    monologueTitle: '올록볼록 하얀 벽을 손끝으로 짚으며 골목을 걸어왔어',
    quote: '햇빛이 비칠 때마다 돌기들 아래로 생기는 삼각형 그림자들이 우리 극장의 비밀 암호 같았다.',
    fullStory:
      '바닥에 노란 페인트로 700-06이라고 적힌 조용한 동네 골목을 걸어오면, 벽에 하얀 블록들이 점자처럼 올록볼록 튀어나온 건물이 나타난다. 햇빛이 비칠 때마다 그 돌기들 아래로 작은 삼각형 그림자 수백 개가 생긴다. 그 그림자들이 우리 극장의 비밀 암호 같아서 올 때마다 눈으로 읽어본다.',
    wallText:
      '노란 700-06 숫자가 적힌 조용한 동네 골목길   ·   점자처럼 올록볼록 튀어나온 하얀 외벽의 돌기들   ·   햇빛을 받아 생겨나는 수백 개의 삼각형 그림자 암호   ·   마을극장 흰고무신으로 들어서는 첫 번째 표지판',
    mapCircle: { cx: 3214.5, cy: 1615.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 27.24, top: 0.0, width: 60.33, height: 99.89 },
    surfaceAngle: -10,
    flowDir: 'flow-left'
  },
  {
    num: '12',
    id: 'h-02',
    spaceId: 'huingomusin',
    code: 'H-02',
    name: '노란 은행잎이 쌓인 놀이터 나무 벤치와 타일 담장',
    childName: '임태윤 (13세)',
    monologueTitle: '누군가 그려놓은 타일 그림 앞 벤치에 앉아 내 이야기를 겹쳐 쓰다',
    quote: '오래전 아이들이 남긴 그림 앞 벤치에 앉아 오늘 우리의 대본을 읽으니 시간이 겹쳐지는 기분이 들었다.',
    fullStory:
      '놀이터 가장자리 나무 벤치 뒤에는 물결 모양 벽돌 담장이 있고, 그 안에 옛날에 동네 아이들이 그린 작은 타일 그림들이 수십 장 붙어 있다. 벤치 밑에는 노란 은행잎이 양탄자처럼 깔려 있다. 오래전 아이들이 남긴 그림 앞에 앉아 오늘 우리의 대본을 읽으니 시간이 겹쳐지는 기분이 들었다.',
    wallText:
      '물결 모양 담장 안에 빼곡히 박힌 작은 타일 그림들   ·   벤치 아래 노란 양탄자처럼 내려앉은 가을 은행잎   ·   오래전 아이들의 그림 위에 겹쳐지는 오늘의 대사   ·   야외 객석이 되어주는 따뜻한 나무 벤치',
    mapCircle: { cx: 2944.5, cy: 2217.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 43.51, top: 34.07, width: 28.69, height: 22.64 },
    surfaceAngle: 4,
    flowDir: 'flow-left'
  },
  {
    num: '13',
    id: 'h-03',
    spaceId: 'huingomusin',
    code: 'H-03',
    name: '놀이터 초록 도깨비와 보라색 별 스프링 시소',
    childName: '배준서 (11세)',
    monologueTitle: '용수철 위에서 앞뒤로 흔들리면 세상이 천천히 기울어진다',
    quote: '가만히 서 있을 때는 안 보이던 리듬이 용수철 위에서 흔들릴 때 비로소 보인다.',
    fullStory:
      '초록색 도깨비 얼굴이 그려진 스프링 의자와 보라색 별 모양 시소가 나란히 서 있다. 여기에 앉아 몸을 앞뒤로 흔들면 끼익— 끼익— 용수철 소리가 나면서 놀이터의 나무들과 약국 간판이 파도처럼 출렁거린다. 가만히 서 있을 때는 안 보이던 리듬이 흔들릴 때 비로소 보인다.',
    wallText:
      '초록 도깨비와 보라색 별이 나란히 서 있는 자리   ·   용수철 위에서 몸을 흔들면 파도처럼 기울어지는 풍경   ·   끼익— 끼익— 스프링이 만들어내는 느린 박자   ·   흔들리는 시선 속에서 찾아낸 새로운 이야기',
    mapCircle: { cx: 2325.5, cy: 2316.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 40.39, top: 24.47, width: 38.2, height: 37.98 },
    surfaceAngle: -12,
    flowDir: 'flow-right'
  },
  {
    num: '14',
    id: 'h-04',
    spaceId: 'huingomusin',
    code: 'H-04',
    name: '은행나무 놀이터 원통형 미끄럼틀',
    childName: '조은서 (11세)',
    monologueTitle: '‘올라가지 마시오’ 원통 안에 들어가 속삭인 비밀 대사',
    quote: '동그란 구멍 안으로 고개를 넣고 아— 소리를 내면 동굴처럼 목소리가 둥글게 울린다.',
    fullStory:
      '극장 근처 놀이터에는 커다란 원통 미끄럼틀이 있다. 출구 테두리에 ‘올라가지 마시오’라고 적혀 있는데, 그 동그란 구멍 안으로 고개를 넣고 “아—” 하고 소리를 내면 동굴처럼 목소리가 둥글게 울린다. 수업 전에 대사가 잘 안 외워질 때 나는 이 미끄럼틀 입구에 대고 대사를 속삭여 본다.',
    wallText:
      '노란 은행나무 잎이 내려앉은 원통형 미끄럼틀   ·   동그란 출구 안으로 고개를 넣고 속삭이는 비밀 대사   ·   작은 동굴처럼 내 목소리를 둥글게 돌려주는 통로   ·   미끄러져 내려오면 시작되는 놀이터의 연극',
    mapCircle: { cx: 1706.0, cy: 2364.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 31.61, top: 11.2, width: 39.71, height: 45.2 },
    surfaceAngle: 24,
    flowDir: 'flow-right'
  },
  {
    num: '15',
    id: 'h-05',
    spaceId: 'huingomusin',
    code: 'H-05',
    name: '동네 지붕과 골목이 내려다보이는 작은 야외 옥상 난간 벽',
    childName: '문채원 (13세)',
    monologueTitle: '옥상 난간에 기대어 바람에게 먼저 들려준 첫 독백',
    quote: '답답하던 마음이 뻥 뚫리면서 동네 지붕들 위로 내 목소리가 멀리 날아간다.',
    fullStory:
      '극장 문을 열고 나가면 동네 골목과 지붕들이 한눈에 내려다보이는 작은 야외 옥상과 발코니가 있다. 난간 벽에 기대어 바람을 맞으며 대사를 소리 내어 읽으면, 실내에서는 부끄러워서 작게 나오던 목소리가 시원하게 뻗어 나간다. 동네 참새들이 내 첫 번째 관객이 되어주었다.',
    wallText:
      '문을 열면 나타나는 작은 야외 옥상과 발코니 난간   ·   동네 지붕들과 전깃줄 위로 뻗어 나가는 나의 목소리   ·   바람을 맞으며 읽는 가장 시원하고 솔직한 독백   ·   지붕 위 참새들이 첫 번째 관객이 되어주는 곳',
    mapCircle: { cx: 1017.5, cy: 2515.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 15.13, top: 0.16, width: 72.33, height: 99.82 },
    surfaceAngle: -8,
    flowDir: 'flow-left'
  },
  {
    num: '16',
    id: 'h-06',
    spaceId: 'huingomusin',
    code: 'H-06',
    name: '‘공·연·장’ 글씨가 붙은 하얀 사물함 가로 칸',
    childName: '정우진 (12세)',
    monologueTitle: '사물함 칸마다 들어 있는 열한 개의 서로 다른 이야기',
    quote: '공·연·장 세 글자 아래 작은 사물함 문들을 보면 우리 열한 명의 비밀 서랍 같다.',
    fullStory:
      '극장 입구에는 하얀 사물함들이 가로세로 반듯하게 모여 있고, 그 위에 파란 글씨로 ‘공 연 장’ 세 글자가 붙어 있다. 가방과 외투를 사물함 안에 넣고 문을 닫을 때 철컥 소리가 난다. 작은 칸마다 우리 열한 명의 서로 다른 오늘 이야기가 한 권씩 들어 있는 것 같다.',
    wallText:
      '파란 글씨로 공·연·장 세 글자가 붙어 있는 하얀 사물함   ·   가방과 외투를 넣고 문을 닫을 때 울리는 철컥 소리   ·   열한 명의 서로 다른 이야기가 담긴 작은 비밀 서랍들   ·   극장으로 들어가기 전 마음을 정돈하는 정거장',
    mapCircle: { cx: 635.5, cy: 3065.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 25.36, top: 31.71, width: 58.14, height: 43.82 },
    surfaceAngle: -4,
    flowDir: 'flow-left'
  },
  {
    num: '17',
    id: 'h-07',
    spaceId: 'huingomusin',
    code: 'H-07',
    name: '마을극장 흰고무신 무대 정면 하얀 배경막',
    childName: '유하린 (11세)',
    monologueTitle: '아무것도 안 그려진 하얀 막 앞에 서면 무엇이든 될 수 있어',
    quote: '조명이 켜지고 내 그림자가 하얀 막 위에 커다랗게 생기는 순간 연극이 시작된다.',
    fullStory:
      '흰고무신 극장 안으로 들어서면 정면에 커다랗고 하얀 배경막이 드리워져 있다. 처음에는 아무것도 없는 빈 종이 같아서 떨렸는데, 조명이 켜지고 내 그림자가 하얀 막 위에 커다랗게 생기는 순간 여기가 바다도 되고 우주도 된다는 걸 알았다.',
    wallText:
      '극장 정면에 커다란 빈 종이처럼 드리운 하얀 배경막   ·   조명이 켜지면 내 그림자가 거인처럼 자라나는 무대   ·   바다도 되고 숲도 되고 우주도 되는 하얀 캔버스   ·   떨리는 첫걸음이 이야기가 되는 중심 무대',
    mapCircle: { cx: 1237.5, cy: 3065.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 25.14, top: 20.56, width: 27.55, height: 41.53 },
    surfaceAngle: -2,
    flowDir: 'flow-up'
  },
  {
    num: '18',
    id: 'h-08',
    spaceId: 'huingomusin',
    code: 'H-08',
    name: '둥근 벽시계가 걸린 극장 벽면',
    childName: '한결 (13세)',
    monologueTitle: '모두가 숨을 죽이면 벽시계 초침 소리만 무대 위에 남는다',
    quote: '대사와 대사 사이의 조용한 멈춤 속에서 벽시계가 똑딱거리며 우리와 함께 호흡한다.',
    fullStory:
      '극장 한쪽 벽 높은 곳에는 동그란 시계가 걸려 있다. 평소에는 시계 소리가 안 들리는데, 친구가 독백을 하다가 잠시 멈추는 순간에는 극장 전체가 고요해지면서 초침 움직이는 느낌까지 전해진다. 극장의 시간은 바깥세상보다 조금 더 깊고 천천히 흐른다.',
    wallText:
      '극장 벽 높은 곳에서 우리를 지켜보는 둥근 벽시계   ·   대사와 대사 사이 고요한 멈춤 속에 흐르는 극장의 시간   ·   바깥세상보다 조금 더 깊고 천천히 흘러가는 호흡   ·   수많은 연습의 시간들을 기억하는 하얀 벽면',
    mapCircle: { cx: 1798.5, cy: 3065.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 12.55, top: 24.49, width: 74.89, height: 75.49 },
    surfaceAngle: 0,
    flowDir: 'flow-left'
  },
  {
    num: '19',
    id: 'h-09',
    spaceId: 'huingomusin',
    code: 'H-09',
    name: '나무 선반 위 사각 나무 액자',
    childName: '신아린 (12세)',
    monologueTitle: '작은 나무 창문 액자 속에 오늘 우리의 장면을 담아두었어',
    quote: '선반 위 나무 액자를 들여다보면 지난 시간의 이야기들이 그림처럼 걸려 있다.',
    fullStory:
      '극장 구석 나무 선반 위에는 따뜻한 나무테를 두른 사각 액자가 놓여 있다. 연습하다가 우연히 그 액자와 눈이 마주치면, 마치 누군가 지금 우리의 모습을 사진으로 찍어 영원히 간직해 주는 것 같은 기분이 든다.',
    wallText:
      '나무 선반 위에 조용히 놓인 사각 나무 액자   ·   작은 창문처럼 오늘 우리의 장면을 담아두는 프레임   ·   지나간 수업의 웃음소리와 대사들이 머무는 자리   ·   오래도록 바래지 않을 사람 책의 한 페이지',
    mapCircle: { cx: 2412.5, cy: 3065.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 45.96, top: 24.89, width: 21.74, height: 40.11 },
    surfaceAngle: -6,
    flowDir: 'flow-left'
  },
  {
    num: '20',
    id: 'h-10',
    spaceId: 'huingomusin',
    code: 'H-10',
    name: '무대 한켠 검은 업라이트 피아노',
    childName: '강다현 (12세)',
    monologueTitle: '피아노 건반 하나를 누르면 긴장이 사르르 풀리는 순간',
    quote: '검은 피아노 통 안에서 울려 나오는 낮은 음 하나가 내 첫 대사의 용기가 되어주었다.',
    fullStory:
      '무대 오른쪽 구석에는 반짝이는 검은 업라이트 피아노가 묵직하게 서 있다. 독백을 시작하기 전에 낮은 건반 하나를 딩— 하고 누르면, 그 여운이 극장 바닥과 벽을 타고 천천히 퍼져 나간다. 그 소리에 기대어 첫 마디를 꺼내면 떨리던 목소리가 단단해진다.',
    wallText:
      '무대 한켠을 묵직하게 지키고 서 있는 검은 업라이트 피아노   ·   건반 하나를 누르면 극장 안으로 번져가는 깊은 울림   ·   떨리는 첫 대사에 용기를 건네주는 따뜻한 공명   ·   피아노 선율처럼 이어지는 아이들의 독백',
    mapCircle: { cx: 3090.5, cy: 3052.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 13.4, top: 21.22, width: 61.05, height: 78.76 },
    surfaceAngle: 0,
    flowDir: 'flow-left'
  },
  {
    num: '21',
    id: 'h-11',
    spaceId: 'huingomusin',
    code: 'H-11',
    name: '극장 출입문 옆 마지막 벽면',
    childName: '박소율 (13세)',
    monologueTitle: '문을 나서기 전 뒤돌아본 무대에는 아직 빛이 남아 있다',
    quote: '수업이 끝나고 문을 열고 나가도 내 마음속 한구석에는 작은 극장 조명이 켜져 있다.',
    fullStory:
      '모든 독백 연습이 끝나고 집으로 돌아가기 위해 극장 출입문 앞에 섰다. 손잡이를 잡기 전에 마지막으로 무대를 한 번 더 뒤돌아보면, 방금까지 우리가 떠들고 움직이던 공기 속에 아직 따뜻한 빛이 떠다니는 것 같다. 내일 다시 올 때까지 이야기를 이곳에 잘 접어 둔다.',
    wallText:
      '집으로 돌아가기 전 마지막으로 마주하는 극장 출입문 옆 벽면   ·   뒤돌아본 무대 위에 아직 떠다니는 따뜻한 빛과 목소리   ·   문을 나서도 마음속에 켜져 있는 작은 핀라이트 조명   ·   다음 산책을 기약하며 접어 두는 사람 책의 마지막 장',
    mapCircle: { cx: 3543.5, cy: 2468.0, r: 150.8, fill: '#86e086' },
    bbox: { left: 58.14, top: 0.0, width: 26.51, height: 99.98 },
    surfaceAngle: 0,
    flowDir: 'flow-up'
  }
];

class ArchiveApp {
  constructor() {
    this.rawData = window.ArchiveStore
      ? window.ArchiveStore.getData()
      : window.DEFAULT_ARCHIVE_DATA;
    this.audio = window.MonologueAudioEngine
      ? new window.MonologueAudioEngine()
      : null;

    this.currentView = 'monologue';

    // Monologue 상태: 'map' | 'space'
    this.monologueStage = 'map';
    this.selectedSpaceId = 'chaeum';
    // 세부 공간요소 페이지에서 현재 내 눈앞(중앙)에 놓인 벡터요소 ID (아직 재생 전 상태)
    this.frontElementId = null;
    // 실제로 한 번 더 클릭해서 핀라이트 조명과 독백 음성이 켜진 벡터요소 ID
    this.activeElementId = null;

    this.stationsList = [];

    // 세부 공간요소 파노라마 스트립 드래그 상태
    this.stripDragDeltaX = 0;

    // TimeWork 상태 (10페이지, 좌측 채움 사진 인덱스 & 우측 흰고무신 사진 인덱스)
    this.activeTimeworkPageIdx = 0;
    this.twChaeumPhotoIdxMap = {};
    this.twHuinPhotoIdxMap = {};
    this.activeBookmarkId = null;
    this.expandedWorkId = null;

    // INDEX 필터 상태
    this.indexFilterSpace = 'all';
    this.indexFilterType = 'all';
    this.indexSearchQuery = '';

    this.init();
  }

  async init() {
    if (window.LargeMediaDB && window.LargeMediaDB.initCache) {
      await window.LargeMediaDB.initCache();
    }
    if (window.ArchiveStore) {
      this.rawData = window.ArchiveStore.getData();
    }
    this.normalizeData();
    this.buildStationsList();
    this.bindGlobalNav();
    this.bindAudioCallbacks();
    this.updateHeaderLogo();
    this.renderAllViews();

    this._lastPublishedAt = this.rawData?.meta?.publishedAt || '';

    const reloadData = async (forceRender = true) => {
      const freshData = window.ArchiveStore
        ? window.ArchiveStore.getData()
        : window.DEFAULT_ARCHIVE_DATA;
      const newPubAt = freshData?.meta?.publishedAt || '';
      if (!forceRender && newPubAt === this._lastPublishedAt) {
        return;
      }
      this._lastPublishedAt = newPubAt;

      if (window.LargeMediaDB && window.LargeMediaDB.initCache) {
        await window.LargeMediaDB.initCache(true);
      }
      this.rawData = freshData;
      this.normalizeData();
      this.buildStationsList();
      this.updateHeaderLogo();

      const viewport = document.getElementById('architecturalRoomViewport');
      if (viewport) {
        viewport.removeAttribute('data-rendered-space');
      }

      this.renderAllViews();
    };

    window.addEventListener('storage', () => reloadData(true));
    window.addEventListener('archiveDataUpdated', () => reloadData(true));
    window.addEventListener('focus', () => reloadData(true));

    // 시크릿 관리자 진입: Cmd+Shift+A (Mac) 또는 Ctrl+Shift+A (Win) 입력 시 이동
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        window.location.href = 'admin.html';
      }
    });

    // 상단 '2026 도봉꿈의극단' 파란 태그 3회 연속 클릭 시 관리자 페이지로 이동
    const brandTag = document.querySelector('.brand-tag-blue');
    if (brandTag) {
      let clicks = 0;
      brandTag.style.cursor = 'default';
      brandTag.addEventListener('click', (e) => {
        e.stopPropagation();
        clicks++;
        if (clicks >= 3) {
          window.location.href = 'admin.html';
        }
        setTimeout(() => { clicks = 0; }, 1800);
      });
    }

    if (typeof BroadcastChannel !== 'undefined') {
      this._syncChannel = new BroadcastChannel('dobong_archive_sync');
      this._syncChannel.onmessage = (e) => {
        if (e.data && e.data.type === 'published') {
          reloadData(true);
        }
      };
    }
  }

  updateHeaderLogo() {
    const logoImg = document.querySelector('.brand-user-logo');
    if (logoImg && this.projectInfo) {
      const customLogo = this.projectInfo.customLogoUrl;
      logoImg.src = this.safeImgUrl(customLogo || 'image/선과요소/사용/로고_crop.png');
    }
    const siteTitleEl = document.querySelector('.brand-main');
    if (siteTitleEl && this.rawData?.meta?.siteTitle) {
      const fullTitle = this.rawData.meta.siteTitle;
      const colonIdx = fullTitle.indexOf(':');
      if (colonIdx !== -1) {
        const mainPart = fullTitle.slice(0, colonIdx);
        const subPart = fullTitle.slice(colonIdx);
        siteTitleEl.innerHTML = `${mainPart}<span class="brand-main-sub">${subPart}</span>`;
      } else {
        siteTitleEl.textContent = fullTitle;
      }
    }
  }

  /**
   * ArchiveStore(data.js)의 스키마와 20개 실제 공간벡터(공간벡터-02~21.png) 및
   * 공간 사진(2026도봉꿈극-02~21.png)을 매칭하여 정규화
   */
  normalizeData() {
    const raw = this.rawData || {};
    const spacesArr = Array.isArray(raw.spaces)
      ? raw.spaces
      : Object.values(raw.spaces || {});

    const chaeumRaw =
      spacesArr.find((s) => s.id === 'chaeum') ||
      spacesArr[0] || { id: 'chaeum', name: '청소년예술공간 채움', elements: [] };
    const huinRaw =
      spacesArr.find((s) => s.id === 'huingomusin') ||
      spacesArr[1] || { id: 'huingomusin', name: '마을극장 흰고무신', elements: [] };

    const chaeumPresetList = USER_VECTOR_ASSETS.filter((a) => a.spaceId === 'chaeum');
    const huinPresetList = USER_VECTOR_ASSETS.filter((a) => a.spaceId === 'huingomusin');

    const mergeElementWithAsset = (el, preset) => {
      const num = preset.num;
      const vectorWebUrl = `image/공간/벡터/web/vec-${num}.png`;
      const vectorFullUrl = `image/공간/벡터/공간벡터-${num}.png`;
      const spaceWebUrl = `image/공간/벡터/벡터공간들/web/space-${num}.webp`;
      const spaceFullUrl = `image/공간/벡터/벡터공간들/2026도봉꿈극-${num}.png`;
      const refCompositeUrl = `image/공간/벡터/벡터공간들/벡터올린것/벡터올린것-${num}.png`;

      // 관리자가 커스텀 업로드/수정한 사진(data: 또는 idb://, image/uploaded)이 있으면 우선 반영, 없으면 도봉꿈의극단/image/공간/벡터/벡터공간들 사진 사용
      const hasCustomUpload = el && el.photoUrl && (el.photoUrl.startsWith('data:') || el.photoUrl.startsWith('idb://') || el.photoUrl.startsWith('image/uploaded/'));
      const customPhoto = hasCustomUpload ? el.photoUrl : spaceWebUrl;
      const smallPhoto = (el && (el.smallPhotoUrl || el.secondaryPhotoUrl)) ? (el.smallPhotoUrl || el.secondaryPhotoUrl) : '';

      const monologueTitle = (el && (el.monologueTitle || el.monologue?.title)) ? (el.monologueTitle || el.monologue?.title) : preset.monologueTitle;
      const monologueQuote = (el && (el.quote || el.monologue?.quote)) ? (el.quote || el.monologue?.quote) : preset.quote;
      const monologueStory = (el && (el.monologueText || el.fullStory || el.monologue?.fullStory)) ? (el.monologueText || el.fullStory || el.monologue?.fullStory) : preset.fullStory;
      const wallText = (el && (el.wallText || el.monologue?.wallText)) ? (el.wallText || el.monologue?.wallText) : preset.wallText;
      const childName = (el && el.childName) ? el.childName : preset.childName;
      const placeName = (el && el.name) ? el.name : preset.name;
      const audioUrl = (el && el.audioUrl) ? el.audioUrl : '';
      const audioFileName = (el && el.audioFileName) ? el.audioFileName : '';

      return {
        ...(el || {}),
        id: preset.id,
        spaceId: preset.spaceId,
        code: (el && el.code) || preset.code,
        name: placeName,
        childName: childName,
        monologueTitle: monologueTitle,
        quote: monologueQuote,
        monologueText: monologueStory,
        vectorNum: num,
        vectorWebUrl,
        vectorFullUrl,
        spaceWebUrl: customPhoto,
        spaceFullUrl,
        refCompositeUrl,
        photo: customPhoto,
        photoUrl: customPhoto,
        smallPhotoUrl: smallPhoto,
        audioUrl: audioUrl,
        audioFileName: audioFileName,
        mapCircle: preset.mapCircle,
        bbox: preset.bbox,
        surfaceAngle: preset.surfaceAngle,
        flowDir: preset.flowDir,
        monologue: {
          title: monologueTitle,
          quote: monologueQuote,
          fullStory: monologueStory,
          wallText: wallText,
          duration: window.MonologueAudioEngine
            ? window.MonologueAudioEngine.formatTime((el && el.audioDuration) || 40)
            : '00:40',
          voicePitch: (el && el.voicePitch) || 1.0,
          keywords:
            el && Array.isArray(el.keywords) && el.keywords.length
              ? el.keywords.map((k) => String(k).replace(/^#/, ''))
              : [placeName.split(' ')[0], childName.split(' ')[0]]
        }
      };
    };

    this.spacesMap = {
      chaeum: {
        ...chaeumRaw,
        id: 'chaeum',
        name: chaeumRaw.name || '청소년예술공간 채움',
        description:
          chaeumRaw.floorPlanDesc ||
          '도봉산역 지하철 환승통로와 광역버스환승센터에서 출발해 유리 자동문과 마젠타 복도, 주황 신발장을 거쳐 채움 무대 마루에 이르는 9개 공간 요소.',
        elements: chaeumPresetList.map((preset, idx) => {
          const el = (chaeumRaw.elements || []).find((e) => e.id === preset.id) || (chaeumRaw.elements || [])[idx];
          return mergeElementWithAsset(el, preset);
        })
      },
      huingomusin: {
        ...huinRaw,
        id: 'huingomusin',
        name: huinRaw.name || '마을극장 흰고무신',
        description:
          huinRaw.floorPlanDesc ||
          '골목길 요철 외벽과 은행나무 놀이터(벤치·시소·미끄럼틀), 야외 발코니, 사물함 벽을 지나 하얀 배경막 무대와 벽시계, 나무 액자, 피아노까지 이어지는 11개 공간 요소.',
        elements: huinPresetList.map((preset, idx) => {
          const el = (huinRaw.elements || []).find((e) => e.id === preset.id) || (huinRaw.elements || [])[idx];
          return mergeElementWithAsset(el, preset);
        })
      }
    };

    this.timeworkPages = (raw.timeworks || raw.timeworkPages || []).map((tw, idx) => {
      const chPhotos = (tw.chaeumPhotos || tw.photos || []).map((p) =>
        typeof p === 'string' ? p : p.url || p.filePath || ''
      );
      const hgPhotos = (tw.huinPhotos || tw.photos || []).map((p) =>
        typeof p === 'string' ? p : p.url || p.filePath || ''
      );
      return {
        id: tw.id || `tw-${idx + 1}`,
        pageNumber: tw.sessionNumber || tw.pageNumber || String(idx + 1).padStart(2, '0'),
        date: tw.date || '',
        title: tw.title || '',
        leadQuote: tw.summary || tw.leadQuote || '',
        keywords: (tw.keywords || []).map((k) => String(k).replace(/^#/, '')),
        paragraphs: tw.bodyParagraphs || tw.paragraphs || [],
        chaeumPhotos: chPhotos,
        huinPhotos: hgPhotos,
        chaeumPhotoLabel: tw.chaeumPhotoLabel || '청소년예술공간 채움',
        huinPhotoLabel: tw.huinPhotoLabel || '마을극장 흰고무신',
        footnotes: (tw.footnotes || []).map((fn, fIdx) => ({
          id: fn.id || `${tw.id}-fn-${fIdx + 1}`,
          marker: fn.marker || `*${fIdx + 1}`,
          title: fn.title || '기록 노트',
          body: fn.content || fn.body || '',
          author: '아카이빙 기록'
        })),
        works: (tw.works || []).map((w, wIdx) => ({
          id: w.id || `${tw.id}-wk-${wIdx + 1}`,
          spaceId: tw.spaceId || (wIdx % 2 === 0 ? 'chaeum' : 'huingomusin'),
          title: w.title || '',
          childName: w.author || w.childName || '',
          workType: w.medium || w.workType || '작업 기록',
          description: w.description || '',
          image: w.imageUrl || w.image || '',
          sizeVariant: w.sizeVariant || 'md',
          pageId: tw.id || `tw-${idx + 1}`
        }))
      };
    });

    this.projectInfo = raw.projectInfo || {};

    const defaultSlidePhotos =
      (window.DEFAULT_ARCHIVE_DATA && window.DEFAULT_ARCHIVE_DATA.monologueSlidePhotos) || [
        { id: 'ms-01', url: 'image/공간/벡터/벡터공간들/web/space-02.webp', caption: '청소년예술공간 채움 — 공간 스틸 01' },
        { id: 'ms-02', url: 'image/공간/벡터/벡터공간들/web/space-11.webp', caption: '마을극장 흰고무신 — 공간 스틸 01' },
        { id: 'ms-03', url: 'image/공간/벡터/벡터공간들/web/space-08.webp', caption: '청소년예술공간 채움 — 공간 스틸 02' },
        { id: 'ms-04', url: 'image/공간/벡터/벡터공간들/web/space-16.webp', caption: '마을극장 흰고무신 — 공간 스틸 02' },
        { id: 'ms-05', url: 'image/공간/벡터/벡터공간들/web/space-05.webp', caption: '청소년예술공간 채움 — 공간 스틸 03' },
        { id: 'ms-06', url: 'image/공간/벡터/벡터공간들/web/space-19.webp', caption: '마을극장 흰고무신 — 공간 스틸 03' }
      ];

    const rawSlides = Array.isArray(raw.monologueSlidePhotos) && raw.monologueSlidePhotos.length
      ? raw.monologueSlidePhotos
      : defaultSlidePhotos;

    this.monologueSlidePhotos = rawSlides
      .map((item, idx) => {
        if (typeof item === 'string') {
          return { id: `ms-${idx + 1}`, url: item, caption: `슬라이드 ${idx + 1}` };
        }
        return {
          id: item.id || `ms-${idx + 1}`,
          url: item.url || item.filePath || '',
          caption: item.caption || item.title || `슬라이드 ${idx + 1}`
        };
      })
      .filter((item) => Boolean(item.url));
  }

  /**
   * 도봉꿈의극단/image/선과요소/사용/지도.png 안의
   * 분홍색 원 9개(채움) + 초록색 원 11개(흰고무신) 거점 리스트 구성
   */
  buildStationsList() {
    this.stationsList = [];

    ['chaeum', 'huingomusin'].forEach((spaceKey) => {
      const sp = this.spacesMap[spaceKey];
      (sp.elements || []).forEach((el, idx) => {
        this.stationsList.push({
          globalIdx: this.stationsList.length,
          spaceId: spaceKey,
          spaceName: sp.name,
          spaceIdx: idx,
          element: el,
          cx: el.mapCircle.cx,
          cy: el.mapCircle.cy,
          r: el.mapCircle.r,
          fill: el.mapCircle.fill
        });
      });
    });
  }

  bindGlobalNav() {
    const navButtons = document.querySelectorAll('[data-nav-view]');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-nav-view');
        if (targetView) {
          this.switchView(targetView);
        }
      });
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.getAttribute('data-nav-view') === viewName);
    });

    const brandHomeBtn = document.getElementById('brandHomeBtn');
    if (brandHomeBtn) {
      brandHomeBtn.classList.toggle('active', viewName === 'project_info');
    }

    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view-${viewName}`);
    });

    if (viewName !== 'monologue' && this.audio) {
      this.audio.stop();
    }

    if (this.audio) {
      const amb = this.rawData?.ambientSettings;
      const indexCh = amb?.channels?.index;
      if (viewName === 'index') {
        if (indexCh && indexCh.audioUrl && indexCh.enabled !== false) {
          this.audio.startAmbientChannel(indexCh, amb.masterVolume ?? 0.45);
        }
      } else if (this.audio.isAmbientPlaying && this.audio.activeAmbientChannelId === 'index') {
        this.audio.stopAmbientChannel();
      }
    }
  }

  bindAudioCallbacks() {
    if (!this.audio) return;
    const pill = document.getElementById('globalSoundPill');
    const text = document.getElementById('globalSoundText');

    this.audio.onStateChange = (state) => {
      if (!pill || !text) return;
      if (state.isPlaying && state.currentElement) {
        pill.classList.add('playing');
        text.textContent = `${state.currentElement.childName} · ${state.currentElement.monologue?.title || ''}`;
      } else if (this.audio.isAmbientPlaying) {
        pill.classList.add('playing');
        text.textContent = 'AMBIENT ON';
      } else {
        pill.classList.remove('playing');
        text.textContent = 'SOUND';
      }
      this.updateVoiceButtonsUI(state);
    };

    this.audio.onProgress = (prog) => {
      const timeEl = document.getElementById('voiceProgressTime');
      if (timeEl && window.MonologueAudioEngine) {
        const cur = window.MonologueAudioEngine.formatTime(prog.currentTime || 0);
        const tot = window.MonologueAudioEngine.formatTime(prog.duration || 40);
        timeEl.textContent = `${cur} / ${tot}`;
      }
      const fillEl = document.getElementById('voiceProgressFill');
      if (fillEl) {
        fillEl.style.width = `${Math.min(100, (prog.ratio || 0) * 100)}%`;
      }
      const bars = document.querySelectorAll('#monologueWaveform .wf-bar');
      if (bars.length) {
        const activeCount = Math.floor((prog.ratio || 0) * bars.length);
        const sample = prog.sample || 0.4;
        bars.forEach((b, idx) => {
          b.classList.toggle('passed', idx <= activeCount);
          if (this.audio.isPlaying) {
            const baseH = parseFloat(b.getAttribute('data-base-h') || b.style.height || '40');
            const waveJitter = Math.sin((idx + Date.now() / 110) * 0.9) * 20 * sample;
            b.style.height = `${Math.max(14, Math.min(100, baseH + waveJitter))}%`;
          }
        });
      }
    };

    this.audio.onAmbientChange = (ambState) => {
      if (!pill || !text || this.audio.isPlaying) return;
      if (ambState.isPlaying) {
        pill.classList.add('playing');
        text.textContent = 'AMBIENT ON';
      } else {
        pill.classList.remove('playing');
        text.textContent = 'SOUND';
      }
    };

    const volSlider = document.getElementById('userAmbientVolumeSlider');
    if (volSlider) {
      const initialVol = this.rawData?.ambientSettings?.masterVolume ?? 0.45;
      volSlider.value = initialVol > 0 ? initialVol : 0.45;
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.audio.updateAmbientVolume(val);
        if (val === 0 && this.audio.isAmbientPlaying) {
          this.audio.stopAmbientChannel();
        } else if (val > 0 && !this.audio.isAmbientPlaying && !this.audio.isPlaying) {
          const ch = this.currentView === 'index'
            ? 'index'
            : (this.currentView === 'timework' ? 'timework' : (this.selectedSpaceId || 'global'));
          this.audio.toggleAmbient(ch);
        }
      });
    }

    if (pill) {
      pill.addEventListener('click', () => {
        if (this.audio.isPlaying) {
          this.activeElementId = null;
          this.audio.stop();
          this.renderMonologueView();
        } else {
          const ch = this.currentView === 'index'
            ? 'index'
            : (this.currentView === 'timework' ? 'timework' : (this.selectedSpaceId || 'global'));
          this.audio.toggleAmbient(ch);
        }
      });
    }
  }

  safeImgUrl(url) {
    if (!url) return '';
    if (url.startsWith('idb://') && window.LargeMediaDB) {
      const resolved = window.LargeMediaDB.resolveUrlSync(url);
      if (resolved && resolved !== url) return resolved;
    }
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // 웹 표준(Git/Vercel/GitHub Pages): NFC 완성형 한글 표준 적용
    try {
      const [path, query] = url.split('?');
      const nfcPath = path.normalize('NFC');
      const encoded = encodeURI(nfcPath);
      return query ? `${encoded}?${query}` : encoded;
    } catch (e) {
      return encodeURI(url);
    }
  }

  renderAllViews() {
    this.renderMonologueView();
    this.renderTimeWorkView();
    this.renderProjectInfoView();
    this.renderIndexView();
  }

  /* ==========================================================================
     1. MONOLOGUE VIEW (사용자 실제 지도.png + 실제 공간벡터-02~21.png 탐색)
     ========================================================================== */
  renderMonologueView() {
    this.renderMonologueHud();

    const mapStage = document.getElementById('monologueMapStage');
    const spaceStage = document.getElementById('monologueSpaceStage');
    if (!mapStage || !spaceStage) return;

    if (this.monologueStage === 'map') {
      mapStage.classList.remove('hidden');
      spaceStage.classList.add('hidden');
      this.renderSculpturalMap();
    } else {
      this.stopMonologueMapTimers();
      mapStage.classList.add('hidden');
      spaceStage.classList.remove('hidden');
      this.renderSpaceExplorer();
      this.renderStoryPanel();
    }
  }

  /**
   * 상단 HUD 바:
   * - 지도 보기 (지도.png)
   * - 청소년예술공간 채움 ↔ 마을극장 흰고무신 즉시 전환
   * - 불필요한 안내 문구 제거
   */
  renderMonologueHud() {
    const hud = document.getElementById('monologueHudTop');
    if (!hud) return;

    const isMap = this.monologueStage === 'map';
    const isChaeum = !isMap && this.selectedSpaceId === 'chaeum';
    const isHuin = !isMap && this.selectedSpaceId === 'huingomusin';

    hud.innerHTML = `
      <div class="hud-left-group">
        <button class="hud-pill-btn ${isMap ? 'active-map' : ''}" id="btnHudToMap">
          <span>지도 전체 보기</span>
        </button>
        <div class="hud-space-switcher" role="group" aria-label="공간 전환">
          <button class="hud-space-tab ${isChaeum ? 'active' : ''}" data-switch-space="chaeum">
            <span class="space-dot" style="background:#ff66cc;"></span>
            <span>청소년예술공간 채움</span>
          </button>
          <button class="hud-space-tab ${isHuin ? 'active' : ''}" data-switch-space="huingomusin">
            <span class="space-dot" style="background:#86e086;"></span>
            <span>마을극장 흰고무신</span>
          </button>
        </div>
        <button class="hud-pill-btn" id="btnHudToIndex">
          <span>우리들의 이야기</span>
        </button>
      </div>
    `;

    const btnToMap = document.getElementById('btnHudToMap');
    if (btnToMap) {
      btnToMap.addEventListener('click', () => {
        if (this.audio) this.audio.stop();
        this.activeElementId = null;
        this.monologueStage = 'map';
        this.renderMonologueView();
      });
    }

    const btnToIndex = document.getElementById('btnHudToIndex');
    if (btnToIndex) {
      btnToIndex.addEventListener('click', () => {
        if (this.audio) this.audio.stop();
        this.switchView('index');
      });
    }

    hud.querySelectorAll('[data-switch-space]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetSpace = btn.getAttribute('data-switch-space');
        if (!targetSpace) return;
        const firstEl = (this.spacesMap[targetSpace]?.elements || [])[0];
        this.enterSpaceInFrontOf(targetSpace, firstEl ? firstEl.id : null);
      });
    });
  }

  /* --------------------------------------------------------------------------
     Stage 1: 도봉꿈의극단/image/선과요소/사용/지도.png + 좌측(1.3/4) 확대 패닝 슬라이드
     - 좌측 약 1.3/4(32.5%) 영역: 확대된 사진이 왼쪽에서 오른쪽으로 이동하며,
       사진 길이의 중간을 조금 넘으면 다음 슬라이드로 자연스럽게 크로스페이드 전환
     - 이 사진들이 먼저 등장하고, 3초(3000ms) 후에 우측 지도.png가 페이드인으로 등장
     - 채움 지도와 흰고무신 지도는 오른쪽에 붙여 배치하며, 선 굵기(첫줄->둘째줄 꺾임 포함) 100% 온전하게 표시
     -------------------------------------------------------------------------- */
  stopMonologueMapTimers() {
    if (this._mapFadeInTimer) {
      clearTimeout(this._mapFadeInTimer);
      this._mapFadeInTimer = null;
    }
    if (this._panSlideInterval) {
      clearInterval(this._panSlideInterval);
      this._panSlideInterval = null;
    }
  }

  renderSculpturalMap() {
    const wrap = document.getElementById('mapCanvasWrap');
    if (!wrap) return;

    this.stopMonologueMapTimers();

    const hero = (this.rawData && this.rawData.monologueHero) || (this.data && this.data.monologueHero) || {
      badge: '2026 도봉꿈의극단',
      sub: '공간적 아카이브',
      title: '사람 책\n도서관',
      titleSize: '62px',
      lead: '이야기와 함께 걷기',
      desc: '지도 위의 거점(원)을 누르면 그 공간의 요소와\n아이들의 생생한 독백으로 이어집니다.',
      align: 'left'
    };

    const mapW = 3750;
    const mapH = 3400;

    const pinsHtml = this.stationsList
      .map((st, idx) => {
        const el = st.element;
        const photoUrl = this.safeImgUrl(el.spaceWebUrl || el.photo);
        const leftPct = ((st.cx / mapW) * 100).toFixed(4);
        const topPct = ((st.cy / mapH) * 100).toFixed(4);
        const widthPct = (((st.r * 2) / mapW) * 100).toFixed(4);
        const heightPct = (((st.r * 2) / mapH) * 100).toFixed(4);

        return `
          <button type="button"
                  class="map-circle-pin"
                  data-station-idx="${idx}"
                  data-space-id="${st.spaceId}"
                  data-element-id="${el.id}"
                  style="left:${leftPct}%; top:${topPct}%; width:${widthPct}%; height:${heightPct}%;"
                  aria-label="${st.spaceName}">
            <div class="map-circle-disc" style="background-color:${st.fill};">
              <img class="map-circle-photo"
                   src="${photoUrl}"
                   alt=""
                   loading="lazy" />
            </div>
          </button>
        `;
      })
      .join('');

    const formattedTitle = (hero.title || '사람 책\n도서관').replace(/\n/g, '<br />');
    const formattedDesc = (hero.desc || '').replace(/\n/g, '<br />');
    const rawSize = String(hero.titleSize || '104px').trim();
    const titleSize = /^\d+$/.test(rawSize) ? `${rawSize}px` : rawSize;

    wrap.innerHTML = `
      <div class="user-map-stage-inner">
        <!-- 상단/좌측: 과감한 크기의 타이포그래피 (관리자페이지에서 문구/크기/위치 수정 가능) -->
        <div class="monologue-hero-typo align-${hero.align || 'left'}" aria-label="2026 도봉꿈의극단 사람 책 도서관">
          <div class="mono-typo-badge">
            <span class="badge-blue-box">${hero.badge || '2026 도봉꿈의극단'}</span>
            ${hero.sub ? `<span class="mono-typo-sub">${hero.sub}</span>` : ''}
          </div>
          <h1 class="mono-typo-title" style="font-size:clamp(34px, 7.5vw, ${titleSize});">
            ${formattedTitle}
          </h1>
          <p class="mono-typo-lead">
            ${hero.lead || '이야기와 함께 걷기'}
          </p>
          <p class="mono-typo-desc">
            ${formattedDesc}
          </p>
        </div>

        <!-- 지도 영역 (타이포그래피 위 레이어에 겹쳐 배치, 1초 후 부드럽게 페이드인) -->
        <div class="monologue-right-map-wrap is-faded-in" id="monologueRightMapWrap">
          <!-- 사용자 제작 지도 (도봉꿈의극단/image/선과요소/사용/지도.png — 마우스 오버 시 쭈욱 당겨지는 텐션) -->
          <div class="user-map-board" id="userMapBoard" aria-label="사람 책 도서관 지도">
            <img class="user-map-orig-img"
                 src="${this.safeImgUrl('image/선과요소/사용/지도_crop.png')}?v=15"
                 alt="사람 책 도서관 지도" />
            ${pinsHtml}
          </div>
        </div>
      </div>
    `;

    // 처음에 지도 이미지는 웹페이지 진입 후 1초(1000ms) 뒤 천천히 페이드인 등장
    this._mapFadeInTimer = setTimeout(() => {
      const board = document.getElementById('userMapBoard');
      if (board) {
        board.classList.add('is-fade-in');
      }
    }, 1000);

    this.bindMapEvents();
  }

  /**
   * 좌측 1.3/4 슬라이드 쇼:
   * - 각 사진이 확대된 상태로 왼쪽에서 오른쪽으로 패닝(7.6초)
   * - 사진 이동 길이의 중간을 조금 넘으면(약 55% 지점 = 4.2초마다) 다음 슬라이드가 좌->우 패닝을 시작하며 자연스럽게 크로스페이드
   */
  startMonologuePanSlideshow() {
    const container = document.getElementById('monologuePanSlideshow');
    if (!container) return;
    const slides = Array.from(container.querySelectorAll('.monologue-pan-slide'));
    if (slides.length <= 1) return;

    this._currentPanSlideIdx = 0;

    this._panSlideInterval = setInterval(() => {
      const prevIdx = this._currentPanSlideIdx;
      const nextIdx = (prevIdx + 1) % slides.length;
      this._currentPanSlideIdx = nextIdx;

      const prevSlide = slides[prevIdx];
      const nextSlide = slides[nextIdx];
      if (!prevSlide || !nextSlide) return;

      // 다음 슬라이드의 패닝 애니메이션을 처음(왼쪽 끝)부터 재시작
      nextSlide.classList.remove('is-panning', 'is-exiting');
      void nextSlide.offsetWidth;
      nextSlide.classList.add('is-active', 'is-panning');

      // 이전 슬라이드는 패닝을 계속 유지한 채 서서히 페이드아웃
      prevSlide.classList.remove('is-active');
      prevSlide.classList.add('is-exiting');

      setTimeout(() => {
        if (!prevSlide.classList.contains('is-active')) {
          prevSlide.classList.remove('is-panning', 'is-exiting');
        }
      }, 1900);
    }, 4200);
  }

  bindMapEvents() {
    const board = document.getElementById('userMapBoard');

    document.querySelectorAll('.map-circle-pin').forEach((pin) => {
      pin.addEventListener('mouseenter', () => {
        if (this._isRubberAnimating || !board) return;
        const leftPct = pin.style.left || '50%';
        const topPct = pin.style.top || '50%';
        board.style.transformOrigin = `${leftPct} ${topPct}`;
        board.classList.remove('is-tension-release');
        board.classList.add('is-tension-pull');
      });

      pin.addEventListener('mouseleave', () => {
        if (this._isRubberAnimating || !board) return;
        board.classList.remove('is-tension-pull');
      });

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this._isRubberAnimating) return;

        const idx = parseInt(pin.getAttribute('data-station-idx'), 10);
        const st = this.stationsList[idx];
        if (!st) return;

        this._isRubberAnimating = true;

        // 마우스 오버로 쭈욱 당겨졌던 텐션이 원래대로 돌아가면서 세부 공간으로 진입
        if (board) {
          const leftPct = pin.style.left || '50%';
          const topPct = pin.style.top || '50%';
          board.style.transformOrigin = `${leftPct} ${topPct}`;
          board.classList.remove('is-tension-pull');
          board.classList.add('is-tension-release');
        }

        if (this.audio) this.audio.playFootstep();

        setTimeout(() => {
          if (board) {
            board.classList.remove('is-tension-release');
          }
          this._isRubberAnimating = false;
          this.enterSpaceInFrontOf(st.spaceId, st.element.id);
        }, 360);
      });
    });

    // 상단 채움 / 흰고무신 범례 버튼 클릭 시 해당 공간 첫 거점으로 스크롤 이동 또는 진입
    document.querySelectorAll('[data-jump-space]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const spId = btn.getAttribute('data-jump-space');
        const firstEl = (this.spacesMap[spId]?.elements || [])[0];
        if (!firstEl) return;

        const stage = document.getElementById('monologueMapStage');
        const isChaeum = spId === 'chaeum';
        if (stage) {
          const targetScroll = isChaeum ? 0 : stage.scrollHeight * 0.45;
          stage.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      });
    });

    // 마우스 드래그로 지도를 위아래로 부드럽게 스크롤 이동
    const mapStage = document.getElementById('monologueMapStage');
    if (mapStage && !mapStage._hasDragBinding) {
      mapStage._hasDragBinding = true;
      let isDown = false;
      let startY = 0;
      let scrollTop = 0;

      mapStage.addEventListener('mousedown', (e) => {
        if (e.target.closest('.map-circle-pin') || e.target.closest('button')) return;
        isDown = true;
        mapStage.style.cursor = 'grabbing';
        startY = e.pageY - mapStage.offsetTop;
        scrollTop = mapStage.scrollTop;
      });

      window.addEventListener('mouseup', () => {
        if (isDown) {
          isDown = false;
          mapStage.style.cursor = '';
        }
      });

      mapStage.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const y = e.pageY - mapStage.offsetTop;
        const walk = (y - startY) * 1.6;
        mapStage.scrollTop = scrollTop - walk;
      });
    }

    // 모바일(<=768px) 지도 이미지 터치 이동 시 관성 미끄러짐을 억제하고 걷는 듯한 마찰감(0.7배) 적용
    const mapWrap = document.querySelector('.monologue-right-map-wrap');
    if (mapWrap && !mapWrap._hasMobileTouchPan) {
      mapWrap._hasMobileTouchPan = true;
      let tStartX = 0;
      let tStartY = 0;
      let sLeft = 0;
      let sTop = 0;
      let isTouchPan = false;

      mapWrap.addEventListener('touchstart', (e) => {
        if (window.innerWidth > 768 || !e.touches || e.touches.length !== 1) return;
        isTouchPan = true;
        tStartX = e.touches[0].clientX;
        tStartY = e.touches[0].clientY;
        sLeft = mapWrap.scrollLeft;
        sTop = mapWrap.scrollTop;
      }, { passive: true });

      mapWrap.addEventListener('touchmove', (e) => {
        if (!isTouchPan || window.innerWidth > 768 || !e.touches || e.touches.length !== 1) return;
        const dx = (e.touches[0].clientX - tStartX) * 0.7;
        const dy = (e.touches[0].clientY - tStartY) * 0.7;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          e.preventDefault();
          mapWrap.scrollLeft = sLeft - dx;
          mapWrap.scrollTop = sTop - dy;
        }
      }, { passive: false });

      const endTouchPan = () => {
        isTouchPan = false;
      };
      mapWrap.addEventListener('touchend', endTouchPan, { passive: true });
      mapWrap.addEventListener('touchcancel', endTouchPan, { passive: true });
    }
  }

  /**
   * 지도에서 원을 누르면 바로 독백이 재생되지 않고,
   * 세부 공간요소 페이지에서 해당 벡터요소 바로 앞(frontElementId)으로 이동함.
   * 거기서 벡터요소를 한 번 더 눌러야 독백 재생 + 공간사진이 뜸.
   */
  enterSpaceInFrontOf(spaceId, elementId) {
    this.selectedSpaceId = spaceId;
    this.monologueStage = 'space';
    const elements = this.spacesMap[spaceId]?.elements || [];
    this.frontElementId = elementId || (elements[0] ? elements[0].id : null);
    this.activeElementId = null;

    if (this.audio) {
      this.audio.stop();
    }

    this.renderMonologueView();
  }

  /* --------------------------------------------------------------------------
     Stage 2 & 3: 세부 공간요소 페이지 (실제 공간벡터-02~21.png & 2026도봉꿈극-02~21.png)
     - 불필요한 위치 설명 텍스트 및 검은 캡션 블록 모두 제거
     - 중앙 벡터요소 바로 양옆에 좌우 화살표 배치 (스크롤·드래그도 함께 작동)
     - 벡터요소에 마우스를 올리면 벡터 위에 문장이 먼저 은은하게 떠오르고, 클릭하면 독백 재생 연결
     - 하단에는 지도.png의 원과 검은 선 심볼을 배치하여 현재 산책 위치 표시
     -------------------------------------------------------------------------- */
  renderSpaceExplorer() {
    const viewport = document.getElementById('architecturalRoomViewport');
    if (!viewport) return;

    const space = this.spacesMap[this.selectedSpaceId];
    const elements = space.elements || [];
    if (!elements.length) return;

    if (!this.frontElementId || !elements.some((e) => e.id === this.frontElementId)) {
      this.frontElementId = elements[0].id;
    }

    // 이미 같은 공간(chaeum 또는 huingomusin)의 트랙이 렌더링되어 있다면
    // DOM을 부수지 않고 상태와 transform만 업데이트하여 모션이 끊기지 않고 부드럽게 이어지도록 처리
    if (
      viewport.getAttribute('data-rendered-space') === this.selectedSpaceId &&
      document.getElementById('tracedShapesStrip')
    ) {
      this.updateSpaceExplorerState();
      return;
    }

    viewport.setAttribute('data-rendered-space', this.selectedSpaceId);

    const slotsHtml = elements
      .map((el, idx) => {
        const vectorUrl = this.safeImgUrl(el.vectorWebUrl);
        const spacePhotoUrl = this.safeImgUrl(el.spaceWebUrl || el.photo);
        const bbox = el.bbox || { left: 15, top: 15, width: 70, height: 70 };
        const angle = el.surfaceAngle || 0;
        const flowDir = el.flowDir || 'flow-left';

        // 관리자페이지에서 입력한 '아이들 한 줄 문구' 우선 적용
        const childQuote = (el.monologue?.quote || el.quote || '').trim();
        const isVertical = flowDir === 'flow-up' || flowDir === 'flow-down';

        let surfaceContentHtml = '';

        if (isVertical) {
          // 세로 재생: 벡터 영역을 거의 꽉 채우는 큼직한 타이포그래피
          surfaceContentHtml = `
            <div class="vector-surface-text-track vertical ${flowDir}">
              <div class="vector-vertical-stream">
                <div class="vector-vertical-unit">
                  <p class="vector-vertical-quote">“${childQuote}”</p>
                </div>
                <div class="vector-vertical-unit" aria-hidden="true">
                  <p class="vector-vertical-quote">“${childQuote}”</p>
                </div>
              </div>
            </div>
          `;
        } else {
          // 가로 재생:
          // 1) 초대형 벡터 영역 (높이 70% 이상: h-01, h-05, h-08, h-10): 3줄로 웅장하게 채워 남은 여백을 20%로 축소
          // 2) 넓은 벡터 영역 (높이 48%~70%: c-01, c-02, c-03): 2줄 큼직하게 채워 남은 여백을 20%로 축소
          // 3) 좁은 벡터 영역 (높이 48% 미만: c-07, c-08, h-02, h-03, h-04, h-06, h-09): 기존 크기 그대로 유지
          let rowCount = 1;
          let sizeClass = 'is-narrow-area';
          if (bbox.height >= 70) {
            rowCount = 3;
            sizeClass = 'is-huge-area';
          } else if (bbox.height >= 48) {
            rowCount = 2;
            sizeClass = 'is-large-area';
          }

          const phraseUnit = `<span>“${childQuote}”</span><span class="vector-surface-divider">✦</span>`;
          const rowsHtml = Array.from({ length: rowCount })
            .map((_, rIdx) => `
              <div class="vector-surface-text-row ${rowCount > 1 && rIdx % 2 === 1 ? 'row-offset' : ''}">
                ${phraseUnit}
                ${phraseUnit}
                ${phraseUnit}
                ${phraseUnit}
              </div>
            `)
            .join('');

          surfaceContentHtml = `
            <div class="vector-surface-text-track horizontal ${flowDir} ${sizeClass}">
              ${rowsHtml}
            </div>
          `;
        }

        return `
          <div class="user-vector-slot space-${el.spaceId}"
               data-slot-element-id="${el.id}"
               data-slot-idx="${idx}">
            <!-- '벡터올린것-02~21.png'와 정확히 일치하는 16:9 (8000x4500 비율) 스테이지 -->
            <div class="vector-stage-16x9">
              <!-- 1) 독백 재생 시: 그 위치에 원래 있어야 하는 사진 영역에 공간사진이 뜨고,
                      채움은 지도.png의 분홍색(#ff66cc), 흰고무신은 지도.png의 초록색(#86e086)으로 오버레이됨 -->
              <div class="vector-tinted-photo-backdrop">
                <img class="vector-space-photo-base"
                     src="${spacePhotoUrl}"
                     alt=""
                     loading="lazy" />
                <div class="vector-space-color-overlay"></div>
                <div class="vector-space-color-tint"></div>
              </div>

              <!-- 2) 재생 전 기본 상태: 사용자가 직접 따서 만든 공간벡터 PNG (공간벡터-02~21.png) -->
              <img class="vector-cutout-img"
                   src="${vectorUrl}"
                   alt=""
                   loading="lazy" />

              <!-- 마우스를 벡터 위에 올렸을 때만 미리 떠오르는 호버 문장 (독백 선택 시에는 완전히 숨겨짐) -->
              <div class="vector-hover-preview-text"
                   style="left:${bbox.left}%; top:${bbox.top}%; width:${bbox.width}%; height:${bbox.height}%;">
                <span>“${childQuote}”</span>
              </div>

              <!-- 3) 독백 재생 시: 벡터의 윤곽선은 따지 않고, 벡터 모양(mask-image) 내부에만
                      핀라이트 조명이 켜지듯 글자만 사물 표면을 따라 천천히 움직임 -->
              <div class="vector-pinlight-masked-layer"
                   style="-webkit-mask-image: url('${vectorUrl}'); mask-image: url('${vectorUrl}');">
                <div class="vector-pinlight-glow"></div>

                <!-- 벡터 내부 사물 표면을 따라 천천히 흐르는 흰 빛 타이포그래피 -->
                <div class="vector-surface-text-box ${isVertical ? 'is-vertical-box' : 'is-horizontal-box'}"
                     style="left:${bbox.left}%; top:${bbox.top}%; width:${bbox.width}%; height:${bbox.height}%;">
                  <div class="vector-surface-angle ${isVertical ? 'is-vertical-angle' : ''}" style="transform: rotate(${isVertical ? 0 : angle}deg);">
                    ${surfaceContentHtml}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // 하단 지도 심볼 (지도.png의 원과 검은 선으로 현재 산책 위치 표시)
    const isChaeum = this.selectedSpaceId === 'chaeum';
    const symbolImgUrl = isChaeum
      ? 'image/선과요소/사용/지도_chaeum_only.png'
      : 'image/선과요소/사용/지도_huin_only.png';
    const symW = 3508;
    const symH = isChaeum ? 2020 : 2140;
    const yOffset = isChaeum ? 0 : 1260;
    const xOffset = isChaeum ? 0 : 242;

    const symbolNodesHtml = elements
      .map((el) => {
        const cx = el.mapCircle.cx - xOffset;
        const cy = el.mapCircle.cy - yOffset;
        const r = el.mapCircle.r;
        const leftPct = ((cx / symW) * 100).toFixed(4);
        const topPct = ((cy / symH) * 100).toFixed(4);
        const wPct = (((r * 2) / symW) * 100).toFixed(4);
        const hPct = (((r * 2) / symH) * 100).toFixed(4);

        return `
          <button type="button"
                  class="symbol-map-node-btn"
                  data-dock-element-id="${el.id}"
                  style="left:${leftPct}%; top:${topPct}%; width:${wPct}%; height:${hPct}%;"
                  aria-label="산책 지점 이동"></button>
        `;
      })
      .join('');

    viewport.innerHTML = `
      <!-- 공간벡터 요소들이 항상 중앙에 위치하며 양옆 화살표·스크롤·드래그로 이동하는 갤러리 트랙 -->
      <div class="traced-shapes-gallery" id="tracedShapesGallery">
        <button class="vector-side-arrow prev" id="btnPrevElement" type="button" aria-label="이전 요소">←</button>
        <div class="traced-shapes-strip" id="tracedShapesStrip">
          ${slotsHtml}
        </div>
        <button class="vector-side-arrow next" id="btnNextElement" type="button" aria-label="다음 요소">→</button>
      </div>

      <!-- 하단 지도 원·선 심볼 (현재 내가 산책하며 서 있는 위치를 표시) -->
      <div class="room-symbol-map-dock">
        <div class="symbol-map-mini-board ${isChaeum ? 'symbol-chaeum' : 'symbol-huingomusin'}">
          <img class="symbol-map-mini-img"
               src="${this.safeImgUrl(symbolImgUrl)}"
               alt="산책 위치 심볼" />
          ${symbolNodesHtml}
        </div>
      </div>
    `;

    this.updateSpaceExplorerState();
    this.bindSpaceExplorerEvents();
    requestAnimationFrame(() => this.updateSpaceExplorerState());
  }

  /**
   * DOM을 재생성하지 않고 현재 중앙 요소(frontElementId)와 재생 중인 요소(activeElementId)의
   * 위치(정중앙 정렬 transform)와 하단 심볼 위치를 부드럽게 업데이트
   */
  updateSpaceExplorerState() {
    const viewport = document.getElementById('architecturalRoomViewport');
    const strip = document.getElementById('tracedShapesStrip');
    if (!viewport || !strip) return;

    const space = this.spacesMap[this.selectedSpaceId];
    const elements = space.elements || [];
    if (!elements.length) return;

    const frontIdx = Math.max(
      0,
      elements.findIndex((e) => e.id === this.frontElementId)
    );
    const activeEl = this.activeElementId
      ? elements.find((e) => e.id === this.activeElementId)
      : null;

    const isSpotlightMode = Boolean(activeEl);
    viewport.classList.toggle('spotlight-mode', isSpotlightMode);

    // scale(0.84) 왜곡이 없는 순수 레이아웃 너비(offsetWidth)를 측정하여 데스크톱·모바일 모두 정확히 정중앙에 배치
    const firstSlot = strip.querySelector('.user-vector-slot');
    const measuredW = firstSlot ? firstSlot.offsetWidth : 0;
    const slotWidth = measuredW > 0 ? measuredW : 720;
    const stripStyle = window.getComputedStyle(strip);
    const parsedGap = parseFloat(stripStyle.gap || stripStyle.columnGap || '90');
    const slotGap = !isNaN(parsedGap) ? parsedGap : 90;
    const slotStepPx = slotWidth + slotGap;
    const centerOffsetPx = -(frontIdx * slotStepPx + slotWidth / 2);

    this.currentCenterOffsetPx = centerOffsetPx;
    this.currentSlotStepPx = slotStepPx;

    strip.style.transform = `translate3d(${centerOffsetPx}px, -50%, 0)`;

    viewport.querySelectorAll('[data-slot-element-id]').forEach((slot) => {
      const elId = slot.getAttribute('data-slot-element-id');
      const isFront = elId === this.frontElementId;
      const isSpotlightOn = elId === this.activeElementId;

      slot.classList.toggle('is-front', isFront);
      slot.classList.toggle('is-spotlight-on', isSpotlightOn);
    });

    viewport.querySelectorAll('[data-dock-element-id]').forEach((btn) => {
      const elId = btn.getAttribute('data-dock-element-id');
      const isFront = elId === this.frontElementId;
      const isActive = elId === this.activeElementId;
      btn.classList.toggle('is-front-symbol', isFront);
      btn.classList.toggle('is-active-symbol', isActive);
    });
  }

  bindSpaceExplorerEvents() {
    const viewport = document.getElementById('architecturalRoomViewport');
    const strip = document.getElementById('tracedShapesStrip');
    const btnPrev = document.getElementById('btnPrevElement');
    const btnNext = document.getElementById('btnNextElement');

    const stepFrontElement = (delta) => {
      const space = this.spacesMap[this.selectedSpaceId];
      const elements = space.elements || [];
      const len = elements.length;
      if (!len) return;
      const curIdx = Math.max(
        0,
        elements.findIndex((e) => e.id === this.frontElementId)
      );
      const nextIdx = (curIdx + delta + len) % len;
      this.frontElementId = elements[nextIdx].id;
      if (this.activeElementId && this.activeElementId !== this.frontElementId) {
        this.activeElementId = null;
        if (this.audio) this.audio.stop();
      }
      if (this.audio) this.audio.playFootstep();
      this.updateSpaceExplorerState();
      this.renderStoryPanel();
    };

    if (btnPrev) btnPrev.addEventListener('click', () => stepFrontElement(-1));
    if (btnNext) btnNext.addEventListener('click', () => stepFrontElement(1));

    // 1) 마우스 휠 스크롤로 공간벡터 요소들 사이를 부드럽게 이동
    if (viewport) {
      let wheelBusy = false;
      viewport.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          if (wheelBusy) return;
          wheelBusy = true;
          const dir = e.deltaY > 0 || e.deltaX > 0 ? 1 : -1;
          stepFrontElement(dir);
          setTimeout(() => {
            wheelBusy = false;
          }, 220);
        },
        { passive: false }
      );
    }

    // 2) 마우스 드래그 및 모바일 터치 스와이프로 스트립을 좌우로 끌어 이동
    if (viewport && strip) {
      let startX = 0;
      let deltaX = 0;
      let isDown = false;

      if (this._onWindowDragMove) {
        window.removeEventListener('mousemove', this._onWindowDragMove);
      }
      if (this._onWindowDragUp) {
        window.removeEventListener('mouseup', this._onWindowDragUp);
      }
      if (this._onWindowResizeSpace) {
        window.removeEventListener('resize', this._onWindowResizeSpace);
      }
      this._onWindowResizeSpace = () => {
        if (this.currentView === 'monologue' && this.monologueStage === 'space') {
          this.updateSpaceExplorerState();
        }
      };
      window.addEventListener('resize', this._onWindowResizeSpace);

      viewport.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        isDown = true;
        startX = e.clientX;
        deltaX = 0;
        this.stripDragDeltaX = 0;
        strip.classList.add('is-dragging');
      });

      this._onWindowDragMove = (e) => {
        if (!isDown) return;
        deltaX = e.clientX - startX;
        this.stripDragDeltaX = deltaX;
        const baseOffset = this.currentCenterOffsetPx || -360;
        strip.style.transform = `translate3d(${baseOffset + deltaX}px, -50%, 0)`;
      };

      this._onWindowDragUp = () => {
        if (!isDown) return;
        isDown = false;
        strip.classList.remove('is-dragging');
        if (Math.abs(deltaX) > 70) {
          stepFrontElement(deltaX < 0 ? 1 : -1);
        } else {
          const baseOffset = this.currentCenterOffsetPx || -360;
          strip.style.transform = `translate3d(${baseOffset}px, -50%, 0)`;
        }
        setTimeout(() => {
          this.stripDragDeltaX = 0;
        }, 40);
      };

      window.addEventListener('mousemove', this._onWindowDragMove);
      window.addEventListener('mouseup', this._onWindowDragUp);

      // 모바일 터치 스와이프 및 탭 지원
      viewport.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') || !e.touches || !e.touches.length) return;
        isDown = true;
        startX = e.touches[0].clientX;
        deltaX = 0;
        this.stripDragDeltaX = 0;
        strip.classList.add('is-dragging');
      }, { passive: true });

      viewport.addEventListener('touchmove', (e) => {
        if (!isDown || !e.touches || !e.touches.length) return;
        deltaX = e.touches[0].clientX - startX;
        this.stripDragDeltaX = deltaX;
        const baseOffset = this.currentCenterOffsetPx || -180;
        strip.style.transform = `translate3d(${baseOffset + deltaX}px, -50%, 0)`;
      }, { passive: true });

      const finishTouch = () => {
        if (!isDown) return;
        isDown = false;
        strip.classList.remove('is-dragging');
        if (Math.abs(deltaX) > 45) {
          stepFrontElement(deltaX < 0 ? 1 : -1);
          setTimeout(() => {
            this.stripDragDeltaX = 0;
          }, 50);
        } else {
          const baseOffset = this.currentCenterOffsetPx || -180;
          strip.style.transform = `translate3d(${baseOffset}px, -50%, 0)`;
          this.stripDragDeltaX = 0;
        }
        deltaX = 0;
      };

      viewport.addEventListener('touchend', finishTouch, { passive: true });
      viewport.addEventListener('touchcancel', finishTouch, { passive: true });
    }

    // 3) 벡터요소 슬롯 클릭:
    //    - 중앙(is-front)에 있는 벡터요소를 클릭하면 -> 분홍/초록 오버레이 공간사진 + 핀라이트 움직이는 글자 + 우측 독백 정보창 ON/OFF
    //    - 옆에 있는 벡터요소를 클릭하면 -> 먼저 그 벡터요소가 정중앙으로 부드럽게 슬라이드 이동
    viewport.querySelectorAll('[data-slot-element-id]').forEach((slot) => {
      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (Math.abs(this.stripDragDeltaX) > 25) return;
        const elId = slot.getAttribute('data-slot-element-id');
        if (elId !== this.frontElementId) {
          this.frontElementId = elId;
          this.activeElementId = null;
          if (this.audio) this.audio.stop();
          if (this.audio) this.audio.playFootstep();
          this.updateSpaceExplorerState();
          this.renderStoryPanel();
        } else {
          this.toggleSpotlightElement(elId);
        }
      });
    });

    // 4) 하단 지도 심볼 원 클릭
    viewport.querySelectorAll('[data-dock-element-id]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const elId = btn.getAttribute('data-dock-element-id');
        if (elId !== this.frontElementId) {
          this.frontElementId = elId;
          this.activeElementId = null;
          if (this.audio) this.audio.stop();
          if (this.audio) this.audio.playFootstep();
          this.updateSpaceExplorerState();
          this.renderStoryPanel();
        } else {
          this.toggleSpotlightElement(elId);
        }
      });
    });
  }

  toggleSpotlightElement(elementId) {
    const space = this.spacesMap[this.selectedSpaceId];
    const el = (space.elements || []).find((item) => item.id === elementId);
    if (!el) return;

    this.frontElementId = elementId;

    if (this.activeElementId === elementId) {
      this.activeElementId = null;
      if (this.audio) this.audio.stop();
    } else {
      this.activeElementId = elementId;
      if (this.audio) {
        this.audio.playSpotlightCue(this.selectedSpaceId);
        this.audio.play(el);
      }
    }

    this.updateSpaceExplorerState();
    this.renderStoryPanel();
  }

  /* --------------------------------------------------------------------------
     우측 독백 패널:
     - 벡터요소를 클릭했을 때만(activeElementId가 있을 때만) 열림
     - 고유번호(c-01 등), 세부위치, 아이들 이름, 원본 사진 창 모두 제거하고
       오직 독백 제목, 음성 컨트롤, 독백 본문만 깔끔하게 표시
     -------------------------------------------------------------------------- */
  renderStoryPanel() {
    const panel = document.getElementById('monologueStoryPanel');
    const spaceStage = document.getElementById('monologueSpaceStage');
    if (!panel || !spaceStage) return;

    const space = this.spacesMap[this.selectedSpaceId];
    const elements = space.elements || [];
    const activeEl = this.activeElementId
      ? elements.find((e) => e.id === this.activeElementId)
      : null;

    if (!activeEl) {
      spaceStage.classList.remove('has-story-open');
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }

    spaceStage.classList.add('has-story-open');
    panel.classList.remove('hidden');

    const wfHeights = [26, 48, 72, 36, 88, 60, 94, 42, 76, 54, 84, 45, 68, 92, 50, 74, 38, 82, 58, 64, 40, 78, 52, 34];

    const isPlayingThis = Boolean(
      this.audio && this.audio.isPlaying && this.audio.currentElement?.id === activeEl.id
    );
    const isPausedThis = Boolean(
      this.audio && this.audio.isPaused && this.audio.currentElement?.id === activeEl.id
    );

    panel.innerHTML = `
      <div class="modular-node-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:8px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
              <span class="story-child-pill">${activeEl.childName}</span>
            </div>
            <h3 style="font-size:20px; font-weight:900; line-height:1.32; letter-spacing:-0.02em;">
              ${activeEl.monologue.title}
            </h3>
          </div>
          <button type="button" id="btnCloseStoryPanel"
                  style="font-size:16px; font-weight:900; padding:2px 6px; opacity:0.65;"
                  title="닫기">✕</button>
        </div>

        <div class="voice-controls-row" style="flex-wrap:wrap; gap:8px; align-items:center; margin:14px 0 8px;">
          ${
            activeEl.audioUrl
              ? `
            <button class="v-btn primary" id="btnToggleElementPlay" style="min-width:96px;">
              ${isPlayingThis ? '❚❚ 일시정지' : (isPausedThis ? '▶ 이어 재생' : '▶ 독백 재생')}
            </button>
            <button class="v-btn" id="btnStopElementPlay" title="독백 정지" style="${isPlayingThis || isPausedThis ? '' : 'display:none;'} padding:7px 10px;">
              ■ 정지
            </button>
            <div class="voice-vol-wrap" style="display:inline-flex; align-items:center; gap:4px; margin-left:4px;" title="독백 볼륨 조절">
              <span style="font-size:12px; user-select:none;">🔊</span>
              <input type="range" id="voiceVolumeSlider" min="0" max="1" step="0.05" value="${this.audio?.monologueVolume ?? 0.4}" style="width:64px; height:4px; accent-color:var(--c-blue); cursor:pointer;" />
            </div>
            <span id="voiceProgressTime" style="font-size:11.5px; font-weight:800; margin-left:auto; color:var(--c-blue); font-variant-numeric:tabular-nums;">
              ${window.MonologueAudioEngine ? window.MonologueAudioEngine.formatTime(isPlayingThis ? this.audio.elapsed : 0) : '00:00'} / ${activeEl.monologue.duration || '00:00'}
            </span>
          `
              : `
            <span style="font-size:12px; font-weight:800; color:var(--c-blue); opacity:0.85;">
              🎙️ 음성 파일 등록 대기 중 (텍스트 열람)
            </span>
          `
          }
        </div>

        ${
          activeEl.audioUrl
            ? `
          <div class="voice-progress-track" id="voiceProgressTrack" style="position:relative; width:100%; height:6px; background:rgba(32,185,226,0.2); border-radius:3px; margin:4px 0 8px; cursor:pointer;" title="타임라인 클릭하여 이동">
            <div class="voice-progress-fill" id="voiceProgressFill" style="position:absolute; top:0; left:0; height:100%; width:${isPlayingThis && this.audio.duration ? Math.min(100, (this.audio.elapsed / this.audio.duration) * 100) : 0}%; background:var(--c-blue); border-radius:3px; transition:width 0.08s linear;"></div>
          </div>
          <div class="waveform-bars" id="monologueWaveform" title="클릭하여 탐색">
            ${wfHeights
              .map(
                (h, idx) =>
                  `<div class="wf-bar ${idx < 5 ? 'passed' : ''}" data-base-h="${h}" data-wf-idx="${idx}" style="height:${h}%;"></div>`
              )
              .join('')}
          </div>
        `
            : ''
        }

        <p style="font-size:14.5px; font-weight:700; line-height:1.7; margin:14px 0; padding:12px; border-left:3px solid currentColor;">
          “${activeEl.monologue.quote}”
        </p>

        <p style="font-size:13.5px; font-weight:500; line-height:1.8; opacity:0.9;">
          ${activeEl.monologue.fullStory}
        </p>
      </div>
    `;

    const btnPlay = document.getElementById('btnToggleElementPlay');
    const btnStop = document.getElementById('btnStopElementPlay');
    const volSlider = document.getElementById('voiceVolumeSlider');
    const pTrack = document.getElementById('voiceProgressTrack');
    const wfContainer = document.getElementById('monologueWaveform');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (!activeEl.audioUrl || !this.audio) return;
        if (this.audio.isPlaying && this.audio.currentElement?.id === activeEl.id) {
          this.audio.pause();
        } else if (this.audio.isPaused && this.audio.currentElement?.id === activeEl.id) {
          this.audio.resume();
        } else {
          this.audio.play(activeEl);
        }
      });
    }

    if (btnStop) {
      btnStop.addEventListener('click', () => {
        if (this.audio) this.audio.stop();
      });
    }

    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        if (this.audio) this.audio.setVolume(v);
      });
    }

    if (pTrack) {
      pTrack.addEventListener('click', (e) => {
        if (!this.audio || !this.audio.currentElement) return;
        const rect = pTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.audio.seek(ratio);
      });
    }

    if (wfContainer) {
      wfContainer.addEventListener('click', (e) => {
        if (!this.audio || !this.audio.currentElement) return;
        const rect = wfContainer.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.audio.seek(ratio);
      });
    }

    const btnClose = document.getElementById('btnCloseStoryPanel');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        this.toggleSpotlightElement(activeEl.id);
      });
    }
  }

  updateVoiceButtonsUI(state) {
    const btnPlay = document.getElementById('btnToggleElementPlay');
    const btnStop = document.getElementById('btnStopElementPlay');
    if (btnPlay) {
      if (state.isPlaying && state.currentElement?.id === this.activeElementId) {
        btnPlay.textContent = '❚❚ 일시정지';
      } else if (state.isPaused && state.currentElement?.id === this.activeElementId) {
        btnPlay.textContent = '▶ 이어 재생';
      } else {
        btnPlay.textContent = '▶ 독백 재생';
      }
    }
    if (btnStop) {
      const isCur = state.currentElement?.id === this.activeElementId;
      btnStop.style.display = isCur && (state.isPlaying || state.isPaused) ? 'inline-flex' : 'none';
    }
    if (!state.isPlaying && !state.isPaused) {
      const fillEl = document.getElementById('voiceProgressFill');
      if (fillEl) fillEl.style.width = '0%';
      const timeEl = document.getElementById('voiceProgressTime');
      const activeEl = this.spacesMap[this.selectedSpaceId]?.elements?.find((e) => e.id === this.activeElementId);
      if (timeEl && activeEl) {
        timeEl.textContent = `00:00 / ${activeEl.monologue?.duration || '00:00'}`;
      }
      const bars = document.querySelectorAll('#monologueWaveform .wf-bar');
      bars.forEach((b) => {
        b.classList.remove('passed');
        const bh = b.getAttribute('data-base-h');
        if (bh) b.style.height = `${bh}%`;
      });
    }
  }

  /* ==========================================================================
     2. TIMEWORK VIEW
     - 펼쳐진 책 페이지(Book Spread) 디자인: 흰 배경(#FFFFFF) + 파란 글씨(#0052FF)
     - 사진 영역 양쪽 분할: 왼쪽(채움 10장 슬라이더) / 오른쪽(마을극장 흰고무신 10장 슬라이더)
     - 양쪽 책날 세로 책갈피 팝오버 & 제각각 다른 크기의 작업물 클릭 확대
     ========================================================================== */
  renderTimeWorkView() {
    const container = document.getElementById('timeworkViewContent');
    if (!container) return;

    const pages = this.timeworkPages || [];
    if (!pages.length) return;

    if (this.activeTimeworkPageIdx >= pages.length) {
      this.activeTimeworkPageIdx = 0;
    }

    const page = pages[this.activeTimeworkPageIdx];

    const chaeumPhotos = page.chaeumPhotos || [];
    const huinPhotos = page.huinPhotos || [];

    const chPhotoIdx = this.twChaeumPhotoIdxMap[page.id] || 0;
    const hgPhotoIdx = this.twHuinPhotoIdxMap[page.id] || 0;

    const currentChPhoto = this.safeImgUrl(
      chaeumPhotos[chPhotoIdx % Math.max(1, chaeumPhotos.length)] || ''
    );
    const currentHgPhoto = this.safeImgUrl(
      huinPhotos[hgPhotoIdx % Math.max(1, huinPhotos.length)] || ''
    );

    const displayFootnotes = page.footnotes || [];
    const displayWorks = page.works || [];

    const bmThemes = [
      { slab: 'bm-blue', pop: 'pop-bg-blue' },
      { slab: 'bm-red', pop: 'pop-bg-red' },
      { slab: 'bm-green', pop: 'pop-bg-green' },
      { slab: 'bm-yellow', pop: 'pop-bg-yellow' },
      { slab: 'bm-pink', pop: 'pop-bg-pink' },
      { slab: 'bm-dark', pop: 'pop-bg-dark' }
    ];

    const leftBookmarks = displayFootnotes.filter((_, i) => i % 2 === 0);
    const rightBookmarks = displayFootnotes.filter((_, i) => i % 2 === 1);

    const renderBookmarkSlab = (fn, idx) => {
      const theme = bmThemes[idx % bmThemes.length];
      const isOpen = this.activeBookmarkId === fn.id;
      const cleanTitle = (fn.title || '기록 노트').replace(/\s+/g, '').slice(0, 8);
      const vertChars = cleanTitle
        .split('')
        .map((c) => `<span>${c}</span>`)
        .join('');

      return `
        <div class="tw-bookmark-slab ${theme.slab} ${isOpen ? 'is-open' : ''}"
             data-bookmark-id="${fn.id}">
          <span class="tw-bookmark-marker">${fn.marker || `*${idx + 1}`}</span>
          <div class="tw-bookmark-vert-chars">${vertChars}</div>
          <span class="tw-bookmark-note-label" style="font-size:10px; font-weight:900;">NOTE</span>

          <div class="tw-footnote-popover ${theme.pop}">
            <div style="display:flex; align-items:center; margin-bottom:6px;">
              <span style="font-size:11px; font-weight:900; padding:2px 7px; border:1px solid currentColor;">
                ${fn.marker} · ${fn.author || '아카이빙 기록'}
              </span>
            </div>
            <h4>${fn.title}</h4>
            <p>${fn.body}</p>
          </div>
        </div>
      `;
    };

    const paragraphs = page.paragraphs || [];
    let leftParagraphs = [];
    let rightParagraphs = [];

    // 본문에서 빈 줄 2개 이상(두 줄 띄움)으로 구분된 경우 이를 기준으로 좌열/우열 분할
    if (page.bodyColumns && page.bodyColumns.length >= 2) {
      leftParagraphs = page.bodyColumns[0] || [];
      rightParagraphs = page.bodyColumns.slice(1).flat() || [];
    } else if (page.bodyText && /\n\s*\n\s*\n+/.test(page.bodyText)) {
      const colChunks = page.bodyText.split(/\n\s*\n\s*\n+/);
      leftParagraphs = colChunks[0].split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
      rightParagraphs = colChunks.slice(1).join('\n\n').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    } else {
      const half = Math.ceil(paragraphs.length / 2);
      leftParagraphs = paragraphs.slice(0, half);
      rightParagraphs = paragraphs.slice(half);
    }
    const midP = leftParagraphs.length;

    // 각주 번호(*n 또는 인덱스)로 풋노트 객체 찾기
    const findFootnoteByNum = (numStr) => {
      const num = parseInt(numStr, 10);
      if (isNaN(num)) return null;
      // 1) marker 내 숫자와 일치 (*3 -> 3)
      let found = displayFootnotes.find((fn) => {
        const m = String(fn.marker || '').replace(/[^\d]/g, '');
        return m !== '' && parseInt(m, 10) === num;
      });
      if (found) return found;
      // 2) 1-based 인덱스 매칭 (*3 -> displayFootnotes[2])
      if (displayFootnotes[num - 1]) {
        return displayFootnotes[num - 1];
      }
      return null;
    };

    // 본문 전체에 [*n] 형태의 명시적 각주 태그가 존재하는지 확인
    const allBodyText = paragraphs.join(' ');
    const hasExplicitFootnoteTags = /\[\*\s*\d+\s*\]/.test(allBodyText);

    const formatParagraphHtml = (paraText, pIdx) => {
      let raw = String(paraText || '');

      let formatted = raw;
      if (hasExplicitFootnoteTags) {
        // 문장 뒤의 [*n] (예: [*1], [*2], [*3])을 해당 각주 칩으로 정확히 치환
        formatted = formatted.replace(/\[\*\s*(\d+)\s*\]/g, (match, numStr) => {
          const fn = findFootnoteByNum(numStr);
          const fnId = fn ? fn.id : `fn-temp-${numStr}`;
          const markerText = fn?.marker || `*${numStr}`;
          const tipText = fn
            ? `${markerText} ${fn.title || '기록 노트'}: ${fn.body || fn.content || ''}`.replace(/"/g, '&quot;')
            : `각주 ${markerText}`;
          return `<span class="tw-inline-bm-chip" data-inline-bm="${fnId}" title="${tipText}">${markerText}</span>`;
        });
      } else {
        // 본문에 [*n] 명시 태그가 없는 기존 데이터의 경우 (문단 순회 하위 호환)
        const fn = displayFootnotes[pIdx];
        const chip = fn
          ? `<span class="tw-inline-bm-chip" data-inline-bm="${fn.id}" title="${(fn.marker + ' ' + (fn.title || '')).replace(/"/g, '&quot;')}">${fn.marker}</span>`
          : '';
        formatted = formatted.trim() + chip;
      }

      // '#'로 시작하고 '_'로 연결된 단어 또는 해시태그 볼드 표시
      formatted = formatted.replace(/(#[a-zA-Z0-9가-힣_]+)/g, '<strong class="tw-hashtag-bold">$1</strong>');

      // 문단 내 줄바꿈을 <br/>로 보존
      formatted = formatted.replace(/\n/g, '<br/>');

      return `<p>${formatted}</p>`;
    };

    const workSizeClasses = ['size-lg', 'size-sm', 'size-tall', 'size-wide', 'size-md', 'size-sm'];

    container.innerHTML = `
      <div class="timework-wrapper">
        <div class="tw-folio-nav">
          <div class="tw-folio-numbers">
            ${pages
              .map(
                (p, idx) => `
              <button class="tw-page-num-btn ${idx === this.activeTimeworkPageIdx ? 'active' : ''}"
                      data-tw-page-idx="${idx}">
                ${p.pageNumber}
              </button>
            `
              )
              .join('')}
          </div>
          <div class="tw-folio-arrows">
            <button class="tw-arrow-step-btn" id="twPrevPageBtn" aria-label="이전 쪽">←<span class="tw-arrow-label"> 이전 쪽</span></button>
            <button class="tw-arrow-step-btn" id="twNextPageBtn" aria-label="다음 쪽"><span class="tw-arrow-label">다음 쪽 </span>→</button>
          </div>
        </div>

        <div class="tw-book-spread-shell">
          <div class="tw-book-pages-main">
            <div class="tw-book-header-spread">
              <div class="tw-book-header-left">
                <div class="tw-book-folio-meta">
                  <span>P. ${page.pageNumber}</span>
                  <span>${page.date}</span>
                </div>
                <h2 class="tw-book-blue-title">${page.title}</h2>
              </div>
              <div class="tw-book-header-right">
                <p class="tw-book-blue-lead">“${page.leadQuote}”</p>
                <div class="tw-book-keywords-row">
                  ${(page.keywords || [])
                    .map((kw) => `<span class="tw-book-kw-tag">#${kw}</span>`)
                    .join('')}
                </div>
              </div>
            </div>

            <div class="tw-dual-photo-spread">
              <div class="tw-photo-half-page">
                <div class="tw-photo-space-label">
                  <span>${page.chaeumPhotoLabel || '청소년예술공간 채움'}</span>
                  <span>${chaeumPhotos.length ? `${(chPhotoIdx % chaeumPhotos.length) + 1} / ${chaeumPhotos.length}` : '0 / 0'}</span>
                </div>
                <div class="tw-photo-viewer-box">
                  ${chaeumPhotos.length ? `
                    <button class="tw-photo-arrow prev" id="twChaeumPrevBtn" aria-label="채움 이전 사진">←</button>
                    <img src="${currentChPhoto}" alt="${page.chaeumPhotoLabel || '청소년예술공간 채움'} 수업 사진" />
                    <button class="tw-photo-arrow next" id="twChaeumNextBtn" aria-label="채움 다음 사진">→</button>
                  ` : `
                    <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(32,185,226,0.65); font-size:13px; font-weight:700;">
                      등록된 사진이 없습니다.
                    </div>
                  `}
                </div>
                <div class="tw-photo-dots-row">
                  ${chaeumPhotos
                    .map(
                      (_, idx) => `
                    <span class="tw-photo-dot ${idx === chPhotoIdx % chaeumPhotos.length ? 'active' : ''}"
                          data-ch-dot-idx="${idx}"></span>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <div class="tw-photo-half-page">
                <div class="tw-photo-space-label">
                  <span>${page.huinPhotoLabel || '마을극장 흰고무신'}</span>
                  <span>${huinPhotos.length ? `${(hgPhotoIdx % huinPhotos.length) + 1} / ${huinPhotos.length}` : '0 / 0'}</span>
                </div>
                <div class="tw-photo-viewer-box">
                  ${huinPhotos.length ? `
                    <button class="tw-photo-arrow prev" id="twHuinPrevBtn" aria-label="마을극장 흰고무신 이전 사진">←</button>
                    <img src="${currentHgPhoto}" alt="${page.huinPhotoLabel || '마을극장 흰고무신'} 수업 사진" />
                    <button class="tw-photo-arrow next" id="twHuinNextBtn" aria-label="마을극장 흰고무신 다음 사진">→</button>
                  ` : `
                    <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(32,185,226,0.65); font-size:13px; font-weight:700;">
                      등록된 사진이 없습니다.
                    </div>
                  `}
                </div>
                <div class="tw-photo-dots-row">
                  ${huinPhotos
                    .map(
                      (_, idx) => `
                    <span class="tw-photo-dot ${idx === hgPhotoIdx % huinPhotos.length ? 'active' : ''}"
                          data-hg-dot-idx="${idx}"></span>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </div>

            <!-- 본문 영역: 연결되는 본문 문단이 위치한 곳 옆쪽에 책갈피 형태로 내려와 배치 -->
            <div class="tw-body-with-bookmarks-row">
              <aside class="tw-fore-edge-left">
                ${leftBookmarks.map((fn, i) => renderBookmarkSlab(fn, i * 2)).join('')}
              </aside>

              <div class="tw-book-body-spread">
                <div class="tw-book-body-col">
                  ${leftParagraphs.map((para, idx) => formatParagraphHtml(para, idx)).join('')}
                </div>
                <div class="tw-book-body-col">
                  ${rightParagraphs.map((para, idx) => formatParagraphHtml(para, midP + idx)).join('')}
                </div>
              </div>

              <aside class="tw-fore-edge-right">
                ${rightBookmarks.map((fn, i) => renderBookmarkSlab(fn, i * 2 + 1)).join('')}
              </aside>
            </div>

            <div class="tw-works-book-stage">
              ${
                this.expandedWorkId
                  ? `<div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom:16px;">
                      <button class="tw-arrow-step-btn" id="twResetWorkExpandBtn" style="color:var(--c-blue); border-color:var(--c-blue);">원래 크기로 접기</button>
                    </div>`
                  : ''
              }

              <div class="tw-works-scatter-wall ${this.expandedWorkId ? 'has-expanded' : ''}">
                ${displayWorks
                  .map((w, idx) => {
                    const sizeCls = w.sizeVariant
                      ? `size-${w.sizeVariant}`
                      : workSizeClasses[idx % workSizeClasses.length];
                    const isExpanded = this.expandedWorkId === w.id;
                    return `
                      <article class="tw-work-piece ${sizeCls} ${isExpanded ? 'is-expanded' : ''}"
                               data-work-id="${w.id}">
                        <img src="${this.safeImgUrl(w.image)}" alt="${w.title}" />
                        <div class="tw-work-mini-tag">${w.childName} · ${w.title}</div>
                        <div class="tw-work-expanded-body">
                          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-size:12px; font-weight:900;">${w.childName} · ${w.workType}</span>
                            <span style="font-size:11.5px; font-weight:800;">클릭하여 닫기 ✕</span>
                          </div>
                          <h4 style="font-size:20px; font-weight:900; margin-bottom:8px;">${w.title}</h4>
                          <p style="font-size:14px; font-weight:600; line-height:1.65;">${w.description}</p>
                        </div>
                      </article>
                    `;
                  })
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindTimeWorkEvents(page, chaeumPhotos.length, huinPhotos.length, pages.length);
  }

  bindTimeWorkEvents(page, chLen, hgLen, totalPages) {
    document.querySelectorAll('[data-tw-page-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeTimeworkPageIdx = parseInt(btn.getAttribute('data-tw-page-idx'), 10) || 0;
        this.activeBookmarkId = null;
        this.expandedWorkId = null;
        this.renderTimeWorkView();
      });
    });

    const prevPageBtn = document.getElementById('twPrevPageBtn');
    const nextPageBtn = document.getElementById('twNextPageBtn');
    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        this.activeTimeworkPageIdx = (this.activeTimeworkPageIdx - 1 + totalPages) % totalPages;
        this.activeBookmarkId = null;
        this.expandedWorkId = null;
        this.renderTimeWorkView();
      });
    }
    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        this.activeTimeworkPageIdx = (this.activeTimeworkPageIdx + 1) % totalPages;
        this.activeBookmarkId = null;
        this.expandedWorkId = null;
        this.renderTimeWorkView();
      });
    }

    const chPrev = document.getElementById('twChaeumPrevBtn');
    const chNext = document.getElementById('twChaeumNextBtn');
    if (chPrev && chLen > 0) {
      chPrev.addEventListener('click', () => {
        const cur = this.twChaeumPhotoIdxMap[page.id] || 0;
        this.twChaeumPhotoIdxMap[page.id] = (cur - 1 + chLen) % chLen;
        this.renderTimeWorkView();
      });
    }
    if (chNext && chLen > 0) {
      chNext.addEventListener('click', () => {
        const cur = this.twChaeumPhotoIdxMap[page.id] || 0;
        this.twChaeumPhotoIdxMap[page.id] = (cur + 1) % chLen;
        this.renderTimeWorkView();
      });
    }
    document.querySelectorAll('[data-ch-dot-idx]').forEach((dot) => {
      dot.addEventListener('click', () => {
        this.twChaeumPhotoIdxMap[page.id] = parseInt(dot.getAttribute('data-ch-dot-idx'), 10) || 0;
        this.renderTimeWorkView();
      });
    });

    const hgPrev = document.getElementById('twHuinPrevBtn');
    const hgNext = document.getElementById('twHuinNextBtn');
    if (hgPrev && hgLen > 0) {
      hgPrev.addEventListener('click', () => {
        const cur = this.twHuinPhotoIdxMap[page.id] || 0;
        this.twHuinPhotoIdxMap[page.id] = (cur - 1 + hgLen) % hgLen;
        this.renderTimeWorkView();
      });
    }
    if (hgNext && hgLen > 0) {
      hgNext.addEventListener('click', () => {
        const cur = this.twHuinPhotoIdxMap[page.id] || 0;
        this.twHuinPhotoIdxMap[page.id] = (cur + 1) % hgLen;
        this.renderTimeWorkView();
      });
    }
    document.querySelectorAll('[data-hg-dot-idx]').forEach((dot) => {
      dot.addEventListener('click', () => {
        this.twHuinPhotoIdxMap[page.id] = parseInt(dot.getAttribute('data-hg-dot-idx'), 10) || 0;
        this.renderTimeWorkView();
      });
    });

    document.querySelectorAll('[data-bookmark-id]').forEach((slab) => {
      slab.addEventListener('click', (e) => {
        e.stopPropagation();
        const bmId = slab.getAttribute('data-bookmark-id');
        this.activeBookmarkId = this.activeBookmarkId === bmId ? null : bmId;
        this.renderTimeWorkView();
      });
    });

    document.querySelectorAll('[data-inline-bm]').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        const bmId = chip.getAttribute('data-inline-bm');
        this.activeBookmarkId = this.activeBookmarkId === bmId ? null : bmId;
        this.renderTimeWorkView();
      });
    });

    document.querySelectorAll('[data-work-id]').forEach((card) => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const wId = card.getAttribute('data-work-id');
        this.expandedWorkId = this.expandedWorkId === wId ? null : wId;
        this.renderTimeWorkView();
      });
    });

    const resetWorkBtn = document.getElementById('twResetWorkExpandBtn');
    if (resetWorkBtn) {
      resetWorkBtn.addEventListener('click', () => {
        this.expandedWorkId = null;
        this.renderTimeWorkView();
      });
    }
  }

  /* ==========================================================================
     3. 사람 책 도서관 (PROJECT_INFO)
     - 도봉꿈의극단/image/선과요소/사용/로고.png (로고_crop.png)를 프로젝트 설명 있는 곳에도 과감하게 배치
     ========================================================================== */
  renderProjectInfoView() {
    const container = document.getElementById('projectInfoContent');
    if (!container) return;

    const info = this.projectInfo || {};
    const chaeum = this.spacesMap.chaeum;
    const huin = this.spacesMap.huingomusin;

    const conceptParagraphs = Array.isArray(info.conceptText)
      ? info.conceptText.join(' ')
      : info.leadCopy || '';

    container.innerHTML = `
      <div class="project-info-container">
        <div class="pi-hero pi-hero-bold-grid">
          <!-- 좌측: 프로젝트 설명 -->
          <div>
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <span class="badge-blue-box">2026 도봉꿈의극단</span>
            </div>
            <h1 style="font-size:clamp(28px, 3.6vw, 44px); font-weight:900; letter-spacing:-0.03em; margin-bottom:14px; color:var(--c-blue);">
              ${info.title || '사람 책 도서관: 이야기와 함께 걷기'}
            </h1>
            <p style="font-size:16px; font-weight:700; line-height:1.75; color:var(--c-blue); margin-bottom:14px;">
              ${info.leadCopy || ''}
            </p>
            <div class="pi-concept-wrap" id="piConceptWrap" style="font-size:14.5px; font-weight:500; line-height:1.85; color:var(--ink-dark);">
              ${conceptParagraphs}
            </div>
            <button type="button" class="pi-director-toggle-btn" id="btnToggleConcept">계속 보기 ▾</button>
          </div>

          <!-- 우측: 도봉꿈의극단/image/선과요소/사용/로고.png를 과감하게 배치 -->
          <div class="pi-hero-logo-wrap">
            <img src="${this.safeImgUrl('image/선과요소/사용/로고_crop.png')}"
                 alt="사람 책 도서관 로고"
                 class="pi-hero-bold-logo" />
          </div>
        </div>

        <!-- 예술감독의 여는 글 (위 프로젝트 설명 칸과 동일한 포맷의 와이드 박스) -->
        <div class="pi-hero" style="margin-bottom:24px;">
          <div class="pi-director-header" style="display:flex; align-items:center; gap:12px; margin-bottom:14px;">
            <span class="badge-blue-box">${info.directorLetterTag || '예술감독'}</span>
            <h2 style="font-size:clamp(20px, 2.2vw, 28px); font-weight:900; letter-spacing:-0.02em; color:var(--c-blue); margin:0;">
              ${info.directorLetterTitle || '예술감독의 여는 글'}
            </h2>
          </div>
          <div class="pi-director-letter-wrap" id="piDirectorLetterWrap" style="font-size:15px; font-weight:500; line-height:1.9; color:var(--ink-dark); white-space:pre-line;">
            ${info.directorLetter || `어린 배우들의 발걸음이 머물렀던 공간은 단순한 연습실을 넘어 하나의 책이 됩니다.
도봉산역 환승 통로의 노란 점자블록부터 마을극장 흰고무신의 작은 나무 액자까지, 아이들은 매일 지나치던 일상의 모퉁이에서 자신의 목소리를 길어 올렸습니다.
〈사람 책 도서관: 이야기와 함께 걷기〉는 그들이 공간의 숨결과 마주하며 써 내려간 20편의 독백을 엮은 살아있는 아카이브입니다.
이 지도 위를 천천히 걸으며, 아이들이 공간에 새겨둔 작고 단단한 마음의 소리에 귀 기울여 주시길 바랍니다.`}
          </div>
          <button type="button" class="pi-director-toggle-btn" id="btnToggleDirectorLetter">계속 보기 ▾</button>
        </div>

        <!-- 함께한 사람들 (주최·주관, 크레딧) -->
        <div class="pi-hero" style="margin-bottom:24px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <span class="badge-blue-box">CREDITS</span>
            <h3 style="font-size:18px; font-weight:900; margin:0; color:var(--c-blue);">함께한 사람들</h3>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px;">
            ${(info.credits && info.credits.length
              ? info.credits
              : [
                  { role: '주최 · 주관', value: '도봉꿈의극단' },
                  { role: '프로젝트명', value: '〈사람 책 도서관: 이야기와 함께 걷기〉' },
                  { role: '참여 사람 책 (총 20권)', value: '청소년예술공간 채움 단원 9명 · 마을극장 흰고무신 단원 11명' },
                  { role: '수업 및 기록 공간', value: '청소년예술공간 채움 · 마을극장 흰고무신' },
                  { role: '아카이빙 구성', value: '예술교육 기록가 · 공간 사진/사운드 아카이브 팀' }
                ]
            )
              .map(
                (c) => {
                  const rawVal = c.value || c.names || '';
                  const segments = String(rawVal).split('/').map((s) => s.trim()).filter(Boolean);
                  const formattedValue = segments
                    .map((seg) => {
                      const dashMatch = seg.match(/^(.*?)([\u2014\u2013\u2015\-]+)(.*)$/);
                      if (dashMatch) {
                        const rolePart = (dashMatch[1] + dashMatch[2]).trim();
                        const namePart = dashMatch[3].trim();
                        return `<div style="margin-bottom:4px; line-height:1.5;">
                          <span style="color:var(--c-blue); font-size:0.72em; font-weight:800; margin-right:5px; display:inline-block;">${rolePart}</span>
                          <span style="color:var(--ink-dark); font-weight:700;">${namePart}</span>
                        </div>`;
                      }
                      return `<div style="margin-bottom:4px; line-height:1.5; color:var(--ink-dark);">${seg}</div>`;
                    })
                    .join('');

                  return `
              <div style="padding:14px; border:1.5px solid var(--c-blue); background:#FFFFFF;">
                <div style="font-size:11.5px; font-weight:900; color:var(--c-blue); margin-bottom:6px; letter-spacing:0.02em;">${c.role}</div>
                <div style="font-size:14px; font-weight:800; color:var(--ink-dark); line-height:1.45;">${formattedValue}</div>
              </div>
            `;
                }
              )
              .join('')}
          </div>
        </div>

        <!-- 주최·주관·후원 기관 로고 (1줄: 주최/주관/후원, 2줄: 꿈의 예술단/성과/꿈의극단도봉) -->
        <div class="pi-hero pi-logos-box" style="margin-bottom:0; padding:28px 32px; background:#FFFFFF; border:2px solid var(--c-blue);">
          <!-- 1줄: 주최 / 주관 / 후원 -->
          <div class="pi-logos-row-1" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-around; gap:28px; padding-bottom:22px; border-bottom:1.5px dashed rgba(32,185,226,0.35);">
            <div class="pi-logo-group" style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:12px; font-weight:900; color:var(--c-blue); letter-spacing:0.04em;">주최</span>
              <img src="${this.safeImgUrl('image/로고/문화체육관광부.png')}" alt="문화체육관광부" onerror="this.style.display='none'" style="max-height:38px; max-width:170px; object-fit:contain;" />
            </div>
            <div class="pi-logo-group pi-logo-group-jugwan" style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:12px; font-weight:900; color:var(--c-blue); letter-spacing:0.04em;">주관</span>
              <div class="pi-logo-jugwan-imgs" style="display:flex; align-items:center; gap:12px;">
                <img src="${this.safeImgUrl('image/로고/한국문화예술교육진흥원.png')}" alt="한국문화예술교육진흥원" onerror="this.style.display='none'" style="max-height:38px; max-width:180px; object-fit:contain;" />
                <img src="${this.safeImgUrl('image/로고/도봉문화재단.png')}" alt="도봉문화재단" onerror="this.style.display='none'" style="max-height:38px; max-width:160px; object-fit:contain;" />
              </div>
            </div>
            <div class="pi-logo-group" style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:12px; font-weight:900; color:var(--c-blue); letter-spacing:0.04em;">후원</span>
              <img src="${this.safeImgUrl('image/로고/도봉구.png')}" alt="도봉구" onerror="this.style.display='none'" style="max-height:38px; max-width:120px; object-fit:contain;" />
            </div>
          </div>

          <!-- 2줄: 꿈의 예술단 / 성과 / 꿈의극단도봉 -->
          <div class="pi-logos-row-2" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:44px; padding-top:22px;">
            <img src="${this.safeImgUrl('image/로고/꿈의예술단.png')}" alt="꿈의 예술단" onerror="this.style.display='none'" style="max-height:44px; max-width:180px; object-fit:contain;" />
            <img src="${this.safeImgUrl('image/로고/성과.png')}" alt="성과" onerror="this.style.display='none'" style="max-height:44px; max-width:160px; object-fit:contain;" />
            <img src="${this.safeImgUrl('image/로고/꿈의극단도봉.png')}" alt="꿈의극단도봉" onerror="this.style.display='none'" style="max-height:44px; max-width:180px; object-fit:contain;" />
          </div>
        </div>
      </div>
    `;

    const toggleConceptBtn = document.getElementById('btnToggleConcept');
    const conceptWrap = document.getElementById('piConceptWrap');
    if (toggleConceptBtn && conceptWrap) {
      toggleConceptBtn.addEventListener('click', () => {
        const isExpanded = conceptWrap.classList.toggle('is-expanded');
        toggleConceptBtn.textContent = isExpanded ? '접기 ▴' : '계속 보기 ▾';
      });
    }

    const toggleDirectorBtn = document.getElementById('btnToggleDirectorLetter');
    const directorLetterWrap = document.getElementById('piDirectorLetterWrap');
    if (toggleDirectorBtn && directorLetterWrap) {
      toggleDirectorBtn.addEventListener('click', () => {
        const isExpanded = directorLetterWrap.classList.toggle('is-expanded');
        toggleDirectorBtn.textContent = isExpanded ? '접기 ▴' : '계속 보기 ▾';
      });
    }

    container.querySelectorAll('[data-pi-go-space]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const spId = btn.getAttribute('data-pi-go-space');
        const firstEl = (this.spacesMap[spId]?.elements || [])[0];
        this.switchView('monologue');
        this.enterSpaceInFrontOf(spId, firstEl ? firstEl.id : null);
      });
    });
  }

  /* ==========================================================================
     4. INDEX VIEW
     ========================================================================== */
  getIndexItems() {
    const items = [];
    ['chaeum', 'huingomusin'].forEach((spKey) => {
      const sp = this.spacesMap[spKey];
      (sp.elements || []).forEach((el) => {
        items.push({
          kind: 'monologue',
          spaceId: spKey,
          spaceName: sp.name,
          code: '독백',
          title: el.monologue.title,
          subtitle: el.childName || '',
          quote: el.monologue.quote,
          photo: el.spaceWebUrl || el.photo,
          elementId: el.id
        });
      });
    });

    (this.timeworkPages || []).forEach((p) => {
      (p.works || []).forEach((w) => {
        items.push({
          kind: 'work',
          spaceId: w.spaceId,
          spaceName: w.spaceId === 'chaeum' ? '청소년예술공간 채움' : '마을극장 흰고무신',
          code: w.workType || 'WORK',
          title: w.title,
          subtitle: w.childName,
          quote: w.description,
          photo: w.image,
          pageId: p.id,
          workId: w.id
        });
      });
    });

    return items.filter((it) => {
      if (this.indexFilterSpace !== 'all' && it.spaceId !== this.indexFilterSpace) return false;
      if (this.indexFilterType !== 'all' && it.kind !== this.indexFilterType) return false;
      if (this.indexSearchQuery.trim()) {
        const q = this.indexSearchQuery.trim().toLowerCase();
        const hay = `${it.code} ${it.title} ${it.subtitle} ${it.quote} ${it.spaceName}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  renderIndexView() {
    const container = document.getElementById('indexViewContent');
    if (!container) return;

    container.innerHTML = `
      <div class="index-container">
        <div class="index-controls-bar">
          <input type="text" class="index-search-input" id="indexSearchInput"
                 placeholder="단원 이름, 이야기 제목 검색..."
                 autocomplete="off" />
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="idx-filter-btn ${this.indexFilterSpace === 'all' ? 'active' : ''}" data-idx-space="all">전체 공간</button>
            <button class="idx-filter-btn ${this.indexFilterSpace === 'chaeum' ? 'active' : ''}" data-idx-space="chaeum">청소년예술공간 채움</button>
            <button class="idx-filter-btn ${this.indexFilterSpace === 'huingomusin' ? 'active' : ''}" data-idx-space="huingomusin">마을극장 흰고무신</button>
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="idx-filter-btn ${this.indexFilterType === 'all' ? 'active' : ''}" data-idx-type="all" id="idxAllCountBtn">전체 기록</button>
            <button class="idx-filter-btn ${this.indexFilterType === 'monologue' ? 'active' : ''}" data-idx-type="monologue">사람 책 독백</button>
            <button class="idx-filter-btn ${this.indexFilterType === 'work' ? 'active' : ''}" data-idx-type="work">우리의 기록</button>
          </div>
        </div>

        <div class="catalog-cards-grid" id="indexCardsGrid"></div>
      </div>
    `;

    const searchInput = document.getElementById('indexSearchInput');
    if (searchInput) {
      searchInput.value = this.indexSearchQuery || '';
      let isComposing = false;
      searchInput.addEventListener('compositionstart', () => {
        isComposing = true;
      });
      searchInput.addEventListener('compositionend', (e) => {
        isComposing = false;
        this.indexSearchQuery = e.target.value;
        this.renderIndexCards();
      });
      searchInput.addEventListener('input', (e) => {
        this.indexSearchQuery = e.target.value;
        if (!isComposing) {
          this.renderIndexCards();
        }
      });
    }

    container.querySelectorAll('[data-idx-space]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.indexFilterSpace = btn.getAttribute('data-idx-space');
        container.querySelectorAll('[data-idx-space]').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-idx-space') === this.indexFilterSpace);
        });
        this.renderIndexCards();
      });
    });

    container.querySelectorAll('[data-idx-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.indexFilterType = btn.getAttribute('data-idx-type');
        container.querySelectorAll('[data-idx-type]').forEach((b) => {
          b.classList.toggle('active', b.getAttribute('data-idx-type') === this.indexFilterType);
        });
        this.renderIndexCards();
      });
    });

    this.renderIndexCards();
  }

  renderIndexCards() {
    const grid = document.getElementById('indexCardsGrid');
    const allBtn = document.getElementById('idxAllCountBtn');
    if (!grid) return;

    const filtered = this.getIndexItems();
    if (allBtn) {
      allBtn.textContent = `전체 기록 (${filtered.length})`;
    }

    if (!filtered.length) {
      grid.innerHTML = `<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--ink-muted); font-weight:700;">검색 결과가 없습니다.</div>`;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (it, i) => `
      <article class="catalog-card" data-idx-card="${i}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:11px; font-weight:900; padding:2px 7px; background:var(--ink-black); color:#fff;">${it.code}</span>
            <span style="font-size:11.5px; font-weight:800; color:var(--ink-muted);">${it.spaceName}</span>
          </div>
          <div style="width:100%; height:160px; border:1px solid var(--ink-black); overflow:hidden; margin-bottom:12px;">
            <img src="${this.safeImgUrl(it.photo)}" alt="${it.title}" style="width:100%; height:100%; object-fit:cover;" />
          </div>
          <h4 style="font-size:17px; font-weight:900; margin-bottom:4px;">${it.title}</h4>
          <div style="font-size:12.5px; font-weight:800; color:var(--c-blue); margin-bottom:8px;">${it.subtitle}</div>
          <p style="font-size:13px; font-weight:500; line-height:1.6; color:var(--ink-dark);">${it.quote}</p>
        </div>
        <div style="margin-top:14px; padding-top:10px; border-top:1px solid rgba(17,18,21,0.12); font-size:12px; font-weight:900;">
          ${it.kind === 'monologue' ? '이 벡터요소 앞으로 가기 →' : 'TimeWork 책 페이지에서 보기 →'}
        </div>
      </article>
    `
      )
      .join('');

    grid.querySelectorAll('[data-idx-card]').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-idx-card'), 10);
        const item = filtered[idx];
        if (!item) return;
        if (item.kind === 'monologue') {
          this.switchView('monologue');
          this.enterSpaceInFrontOf(item.spaceId, item.elementId);
        } else {
          this.switchView('timework');
          const pIdx = (this.timeworkPages || []).findIndex((p) => p.id === item.pageId);
          if (pIdx >= 0) this.activeTimeworkPageIdx = pIdx;
          this.expandedWorkId = item.workId;
          this.renderTimeWorkView();
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.archiveApp = new ArchiveApp();
});
