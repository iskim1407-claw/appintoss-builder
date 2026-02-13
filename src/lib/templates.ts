export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  data: string;
}

// Helper to create serialized craft.js JSON
function makeTemplate(components: Array<{ type: string; props: Record<string, unknown> }>): string {
  const nodes: Record<string, unknown> = {};
  const childIds: string[] = [];

  components.forEach((comp, i) => {
    const id = `node_${i}`;
    childIds.push(id);
    nodes[id] = {
      type: { resolvedName: comp.type },
      isCanvas: false,
      props: comp.props,
      displayName: comp.type,
      custom: {},
      hidden: false,
      nodes: [],
      linkedNodes: {},
      parent: "ROOT",
    };
  });

  nodes["ROOT"] = {
    type: { resolvedName: "Canvas" },
    isCanvas: true,
    props: {},
    displayName: "Canvas",
    custom: {},
    hidden: false,
    nodes: childIds,
    linkedNodes: {},
  };

  return JSON.stringify(nodes);
}

export const templates: Template[] = [
  {
    id: "shopping",
    name: "쇼핑몰",
    description: "실제 상품 카드, 가격, 장바구니가 있는 프리미엄 쇼핑몰",
    icon: "🛍️",
    category: "커머스",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "TOSS SHOP", showBack: false, showMenu: true } },
      { type: "CarouselComponent", props: { 
        images: [
          "https://placehold.co/600x280/3182F6/FFFFFF?text=WINTER+SALE+50%25+OFF",
          "https://placehold.co/600x280/FF6B35/FFFFFF?text=NEW+ARRIVAL+✨",
          "https://placehold.co/600x280/6366F1/FFFFFF?text=FREE+SHIPPING+🚚"
        ],
        autoPlay: true,
        borderRadius: 0
      }},
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "TextComponent", props: { text: "⏰ 타임세일 마감까지", fontSize: 13, color: "#FF6B35", fontWeight: "600", textAlign: "center" } },
      { type: "ProgressBarComponent", props: { value: 72, max: 100, label: "남은 수량", showPercent: false, barColor: "#FF6B35", height: 6 } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "HeaderComponent", props: { text: "🔥 베스트 상품", level: "h2" } },
      { type: "SpacerComponent", props: { height: 4 } },
      { type: "ImageComponent", props: { src: "https://placehold.co/600x300/F8F9FA/191F28?text=AirPods+Pro+2", borderRadius: 12, aspectRatio: "4/3" } },
      { type: "TextComponent", props: { text: "Apple 에어팟 프로 2세대", fontSize: 16, fontWeight: "600", color: "#191F28" } },
      { type: "TextComponent", props: { text: "359,000원", fontSize: 13, color: "#8B95A1" } },
      { type: "BadgeComponent", props: { text: "40% OFF", bgColor: "#FF6B35" } },
      { type: "HeaderComponent", props: { text: "219,000원", level: "h2" } },
      { type: "ButtonComponent", props: { text: "🛒 장바구니 담기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "toast", actionValue: "장바구니에 담았습니다!" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "ImageComponent", props: { src: "https://placehold.co/600x300/F8F9FA/191F28?text=Galaxy+Watch+6", borderRadius: 12, aspectRatio: "4/3" } },
      { type: "TextComponent", props: { text: "삼성 갤럭시 워치 6 클래식", fontSize: 16, fontWeight: "600", color: "#191F28" } },
      { type: "TextComponent", props: { text: "419,000원", fontSize: 13, color: "#8B95A1" } },
      { type: "BadgeComponent", props: { text: "35% OFF", bgColor: "#FF6B35" } },
      { type: "HeaderComponent", props: { text: "272,000원", level: "h2" } },
      { type: "ButtonComponent", props: { text: "🛒 장바구니 담기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "toast", actionValue: "장바구니에 담았습니다!" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "ImageComponent", props: { src: "https://placehold.co/600x300/F8F9FA/191F28?text=Nike+Air+Max", borderRadius: 12, aspectRatio: "4/3" } },
      { type: "TextComponent", props: { text: "나이키 에어맥스 97", fontSize: 16, fontWeight: "600", color: "#191F28" } },
      { type: "BadgeComponent", props: { text: "무료배송", bgColor: "#10B981" } },
      { type: "HeaderComponent", props: { text: "179,000원", level: "h2" } },
      { type: "ButtonComponent", props: { text: "🛒 장바구니 담기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "toast", actionValue: "장바구니에 담았습니다!" } },
      { type: "SpacerComponent", props: { height: 20 } },
      { type: "BottomCTAComponent", props: { text: "💳 장바구니 보기 (3)" } },
      { type: "TabBarComponent", props: { tabs: [
        { icon: "🏠", label: "홈", pageId: "home" },
        { icon: "🔍", label: "검색", pageId: "search" },
        { icon: "🛒", label: "장바구니", pageId: "cart" },
        { icon: "👤", label: "마이", pageId: "my" }
      ]}},
    ]),
  },
  {
    id: "booking",
    name: "예약 서비스",
    description: "날짜와 시간을 선택하여 예약하는 서비스",
    icon: "📅",
    category: "서비스",
    data: makeTemplate([
      { type: "HeaderComponent", props: { text: "예약하기", level: "h1" } },
      { type: "TextComponent", props: { text: "원하는 날짜와 시간을 선택해주세요", fontSize: 14, color: "#8B95A1" } },
      { type: "ProgressBarComponent", props: { value: 33, max: 100, label: "예약 진행", showPercent: true, barColor: "#3182F6" } },
      { type: "DividerComponent", props: {} },
      { type: "InputComponent", props: { label: "이름", placeholder: "이름을 입력하세요", required: true, name: "name" } },
      { type: "InputComponent", props: { label: "전화번호", placeholder: "010-0000-0000", type: "tel", required: true, name: "phone" } },
      { type: "InputComponent", props: { label: "날짜", placeholder: "2024-01-01", name: "date" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "예약 가능 시간", fontSize: 15, fontWeight: "500" } },
      { type: "ListComponent", props: { items: ["10:00", "11:00", "13:00", "14:00", "15:00"], showIcon: false, showArrow: true } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "예약 확인", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "toast", actionValue: "예약이 완료되었습니다!" } },
    ]),
  },
  {
    id: "portfolio",
    name: "포트폴리오",
    description: "자기소개와 작업물을 보여주는 포트폴리오",
    icon: "💼",
    category: "개인",
    data: makeTemplate([
      { type: "ImageComponent", props: { src: "https://placehold.co/600x200/3182F6/FFFFFF?text=PORTFOLIO", borderRadius: 12, aspectRatio: "16/9" } },
      { type: "HeaderComponent", props: { text: "안녕하세요, 김토스입니다 👋", level: "h1" } },
      { type: "TextComponent", props: { text: "UI/UX 디자이너 | 3년 경력\n사용자 중심의 디자인을 추구합니다.", fontSize: 14, color: "#8B95A1" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "BadgeComponent", props: { count: 42, text: "프로젝트", bgColor: "#3182F6" } },
      { type: "DividerComponent", props: {} },
      { type: "HeaderComponent", props: { text: "주요 프로젝트", level: "h2" } },
      { type: "CardComponent", props: { title: "토스 리디자인 컨셉", description: "2024년 토스 앱 리디자인 프로젝트", showImage: true } },
      { type: "CardComponent", props: { title: "쇼핑몰 UX 개선", description: "전환율 40% 향상 달성", showImage: true } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "📤 공유하기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "share" } },
      { type: "ButtonComponent", props: { text: "연락하기", bgColor: "#FFFFFF", textColor: "#3182F6", fullWidth: true, action: "link", actionValue: "mailto:hello@example.com", borderRadius: 12 } },
    ]),
  },
  {
    id: "event",
    name: "이벤트 페이지",
    description: "카운트다운, CTA 버튼, 비주얼이 있는 프리미엄 이벤트 페이지",
    icon: "🎉",
    category: "마케팅",
    data: makeTemplate([
      { type: "ImageComponent", props: { src: "https://placehold.co/600x350/6366F1/FFFFFF?text=🎉+GRAND+OPENING+EVENT", borderRadius: 0, aspectRatio: "16/9" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "TextComponent", props: { text: "✨ 오픈 기념 특별 이벤트 ✨", fontSize: 22, fontWeight: "700", textAlign: "center", color: "#191F28" } },
      { type: "TextComponent", props: { text: "지금 가입하면 최대 30,000원 혜택!", fontSize: 15, color: "#6366F1", textAlign: "center", fontWeight: "500" } },
      { type: "SpacerComponent", props: { height: 12 } },

      { type: "CardComponent", props: { title: "⏰ 이벤트 마감까지", description: "D-7 | 2024.02.28 자정 마감", showImage: false, bgColor: "#FEF2F2" } },
      { type: "ProgressBarComponent", props: { value: 78, max: 100, label: "참여 현황 (7,832명 참여 중)", showPercent: true, barColor: "#EF4444", height: 10 } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "HeaderComponent", props: { text: "🎁 혜택 안내", level: "h2" } },
      { type: "SpacerComponent", props: { height: 8 } },

      { type: "CardComponent", props: { title: "1️⃣ 신규 가입", description: "가입 즉시 10,000원 웰컴 쿠폰 지급", showImage: false, bgColor: "#EFF6FF" } },
      { type: "BadgeComponent", props: { text: "전원 지급", bgColor: "#3182F6" } },
      { type: "SpacerComponent", props: { height: 8 } },

      { type: "CardComponent", props: { title: "2️⃣ 친구 초대", description: "친구 1명당 5,000원 · 최대 5명", showImage: false, bgColor: "#F0FDF4" } },
      { type: "BadgeComponent", props: { text: "최대 25,000원", bgColor: "#10B981" } },
      { type: "SpacerComponent", props: { height: 8 } },

      { type: "CardComponent", props: { title: "3️⃣ 첫 구매 보너스", description: "첫 주문 시 무료배송 + 10% 할인", showImage: false, bgColor: "#FFF7ED" } },
      { type: "BadgeComponent", props: { text: "중복 가능", bgColor: "#FF6B35" } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "HeaderComponent", props: { text: "🏆 추첨 경품", level: "h2" } },
      { type: "ListComponent", props: { items: ["🥇 1등: 아이패드 프로 (1명)", "🥈 2등: 에어팟 맥스 (3명)", "🥉 3등: 스타벅스 5만원권 (50명)", "🎖️ 참가상: 아메리카노 쿠폰 (500명)"], showIcon: false, showArrow: false } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "CarouselComponent", props: { 
        images: [
          "https://placehold.co/600x250/10B981/FFFFFF?text=🏆+PRIZE+1",
          "https://placehold.co/600x250/3182F6/FFFFFF?text=🎧+PRIZE+2",
          "https://placehold.co/600x250/FF6B35/FFFFFF?text=☕+PRIZE+3"
        ],
        autoPlay: true,
        borderRadius: 12
      }},
      { type: "SpacerComponent", props: { height: 20 } },

      { type: "ButtonComponent", props: { text: "🎁 지금 바로 참여하기", bgColor: "#6366F1", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "toast", actionValue: "이벤트에 참여되었습니다! 🎉" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "📤 친구에게 공유하기", bgColor: "#FFFFFF", textColor: "#6366F1", fullWidth: true, action: "share" } },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "BottomSheetComponent", props: { sheetId: "rules", title: "이벤트 유의사항", content: "• 이벤트 기간: 2024.02.01 ~ 2024.02.28\n• 기간 내 1회만 참여 가능합니다.\n• 부정 참여 시 혜택이 취소됩니다.\n• 경품 추첨은 2024.03.05 발표\n• 문의: event@example.com", triggerText: "📋 유의사항 보기" } },
    ]),
  },
  {
    id: "survey",
    name: "설문조사",
    description: "진행률 표시, 깔끔한 폼이 있는 고급 설문조사",
    icon: "📝",
    category: "폼",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "고객 만족도 조사", showBack: true, showMenu: false } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ProgressBarComponent", props: { value: 33, max: 100, label: "1 / 3 단계", showPercent: true, barColor: "#10B981", height: 8 } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "TextComponent", props: { text: "📝 고객 만족도 조사", fontSize: 22, fontWeight: "700", color: "#191F28" } },
      { type: "TextComponent", props: { text: "더 나은 서비스를 위해 소중한 의견을 들려주세요.\n약 2분 소요 · 응답은 익명 처리됩니다.", fontSize: 14, color: "#8B95A1" } },
      { type: "BadgeComponent", props: { text: "🎁 완료 시 커피 쿠폰 증정", bgColor: "#10B981" } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "CardComponent", props: { title: "Step 1. 기본 정보", description: "간단한 인적 사항을 입력해주세요", showImage: false, bgColor: "#F0FDF4" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "InputComponent", props: { label: "이름 (선택)", placeholder: "이름을 입력하세요", name: "name" } },
      { type: "InputComponent", props: { label: "이메일", placeholder: "example@email.com", type: "email", required: true, name: "email", helpText: "쿠폰 발송에 사용됩니다" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "연령대", fontSize: 14, fontWeight: "600", color: "#191F28" } },
      { type: "ListComponent", props: { items: ["10대", "20대", "30대", "40대", "50대 이상"], showIcon: false, showArrow: true } },

      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "CardComponent", props: { title: "Step 2. 서비스 평가", description: "서비스 이용 경험을 알려주세요", showImage: false, bgColor: "#EFF6FF" } },
      { type: "SpacerComponent", props: { height: 8 } },

      { type: "TextComponent", props: { text: "서비스 이용 빈도", fontSize: 14, fontWeight: "600", color: "#191F28" } },
      { type: "ListComponent", props: { items: ["매일", "주 2~3회", "주 1회", "월 1~2회", "거의 안 씀"], showIcon: false, showArrow: true } },
      { type: "SpacerComponent", props: { height: 8 } },

      { type: "TextComponent", props: { text: "전반적 만족도", fontSize: 14, fontWeight: "600", color: "#191F28" } },
      { type: "ListComponent", props: { items: ["⭐⭐⭐⭐⭐ 매우 만족", "⭐⭐⭐⭐ 만족", "⭐⭐⭐ 보통", "⭐⭐ 불만족", "⭐ 매우 불만족"], showIcon: false, showArrow: true } },
      { type: "SpacerComponent", props: { height: 8 } },

      { type: "TextComponent", props: { text: "가장 좋았던 점 (복수 선택 가능)", fontSize: 14, fontWeight: "600", color: "#191F28" } },
      { type: "CheckboxComponent", props: { label: "사용이 편리하다", name: "good_1" } },
      { type: "CheckboxComponent", props: { label: "디자인이 깔끔하다", name: "good_2" } },
      { type: "CheckboxComponent", props: { label: "가격이 합리적이다", name: "good_3" } },
      { type: "CheckboxComponent", props: { label: "고객 응대가 좋다", name: "good_4" } },
      { type: "CheckboxComponent", props: { label: "배송이 빠르다", name: "good_5" } },

      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "CardComponent", props: { title: "Step 3. 자유 의견", description: "개선 사항이나 건의 사항을 알려주세요", showImage: false, bgColor: "#FFF7ED" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "InputComponent", props: { label: "개선해주셨으면 하는 점", placeholder: "자유롭게 작성해주세요", name: "improvement", helpText: "최소 10자 이상 작성 시 추첨 확률 UP!" } },
      { type: "InputComponent", props: { label: "추가 의견 (선택)", placeholder: "기타 건의 사항이 있다면 알려주세요", name: "extra" } },

      { type: "SpacerComponent", props: { height: 20 } },
      { type: "ButtonComponent", props: { text: "✅ 설문 제출하기", bgColor: "#10B981", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "toast", actionValue: "설문이 제출되었습니다! 커피 쿠폰이 이메일로 발송됩니다 ☕" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "제출된 응답은 서비스 개선 목적으로만 사용되며,\n개인정보는 안전하게 보호됩니다.", fontSize: 12, color: "#ADB5BD", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 16 } },
    ]),
  },
  {
    id: "restaurant",
    name: "레스토랑 메뉴",
    description: "음식점 메뉴와 주문 페이지",
    icon: "🍽️",
    category: "커머스",
    data: makeTemplate([
      { type: "ImageComponent", props: { src: "https://placehold.co/600x250/FF6B35/FFFFFF?text=🍽️+MENU", borderRadius: 0, aspectRatio: "16/9" } },
      { type: "HeaderComponent", props: { text: "오늘의 메뉴", level: "h1" } },
      { type: "TextComponent", props: { text: "신선한 재료로 만든 요리를 즐겨보세요", fontSize: 14, color: "#8B95A1" } },
      { type: "DividerComponent", props: {} },
      { type: "HeaderComponent", props: { text: "🍜 면류", level: "h3" } },
      { type: "CardComponent", props: { title: "짜장면", description: "8,000원 | 춘장과 야채의 조화", showImage: true } },
      { type: "CardComponent", props: { title: "짬뽕", description: "9,000원 | 얼큰한 해물 짬뽕", showImage: true } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "HeaderComponent", props: { text: "🍚 밥류", level: "h3" } },
      { type: "CardComponent", props: { title: "볶음밥", description: "9,000원 | 고슬고슬 볶음밥", showImage: true } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "💳 주문하기", bgColor: "#FF6B35", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "pay", actionValue: "17000" } },
      { type: "TabBarComponent", props: { tabs: [
        { icon: "🏠", label: "홈" },
        { icon: "📋", label: "메뉴" },
        { icon: "🛒", label: "장바구니" },
        { icon: "👤", label: "마이" }
      ]}},
    ]),
  },
  {
    id: "fitness",
    name: "피트니스 트래커",
    description: "운동 기록과 목표 달성 현황",
    icon: "🏃",
    category: "서비스",
    data: makeTemplate([
      { type: "HeaderComponent", props: { text: "오늘의 운동 기록 🏃", level: "h1" } },
      { type: "TextComponent", props: { text: "2024년 1월 15일 월요일", fontSize: 14, color: "#8B95A1" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ProgressBarComponent", props: { value: 7500, max: 10000, label: "걸음 수", showPercent: false, barColor: "#10B981", height: 12 } },
      { type: "TextComponent", props: { text: "7,500 / 10,000 걸음", fontSize: 14, color: "#10B981", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ProgressBarComponent", props: { value: 350, max: 500, label: "칼로리 소모", showPercent: true, barColor: "#FF6B35" } },
      { type: "ProgressBarComponent", props: { value: 45, max: 60, label: "운동 시간 (분)", showPercent: true, barColor: "#3182F6" } },
      { type: "DividerComponent", props: {} },
      { type: "HeaderComponent", props: { text: "오늘의 운동", level: "h2" } },
      { type: "ListComponent", props: { items: ["🏃 러닝 30분", "💪 웨이트 15분", "🧘 스트레칭 10분"], showIcon: false, showArrow: true } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "📤 기록 공유하기", bgColor: "#10B981", textColor: "#FFFFFF", fullWidth: true, action: "share" } },
    ]),
  },
  {
    id: "coupon",
    name: "쿠폰 페이지",
    description: "할인 쿠폰 목록과 사용",
    icon: "🎟️",
    category: "마케팅",
    data: makeTemplate([
      { type: "HeaderComponent", props: { text: "🎟️ 내 쿠폰함", level: "h1" } },
      { type: "BadgeComponent", props: { count: 3, text: "사용 가능한 쿠폰", bgColor: "#3182F6" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "CardComponent", props: { title: "신규 가입 쿠폰", description: "5,000원 할인 | 1만원 이상 구매 시", showImage: false, bgColor: "#EFF6FF" } },
      { type: "CardComponent", props: { title: "첫 구매 쿠폰", description: "10% 할인 | 전 상품", showImage: false, bgColor: "#FEF3C7" } },
      { type: "CardComponent", props: { title: "생일 축하 쿠폰", description: "3,000원 할인 | 이번 달 사용", showImage: false, bgColor: "#FCE7F3" } },
      { type: "DividerComponent", props: {} },
      { type: "TextComponent", props: { text: "쿠폰 코드 입력", fontSize: 15, fontWeight: "500" } },
      { type: "InputComponent", props: { label: "", placeholder: "쿠폰 코드를 입력하세요", name: "coupon_code" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "쿠폰 등록", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "toast", actionValue: "쿠폰이 등록되었습니다!" } },
    ]),
  },
  {
    id: "meeting-bingo",
    name: "회의 빙고",
    description: "직장인 공감 회의 빙고 게임",
    icon: "🎯",
    category: "유틸리티",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "회의 빙고 🎯", showBack: true, showMenu: false } },
      { type: "SpacerComponent", props: { height: 4 } },
      { type: "TextComponent", props: { text: "오늘 회의에서 겪은 상황을 체크하세요!", fontSize: 14, color: "#8B95A1", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 4 } },
      { type: "ProgressBarComponent", props: { value: 0, max: 25, label: "빙고 진행률", showPercent: true, barColor: "#3182F6" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "BadgeComponent", props: { text: "0 / 25 체크", bgColor: "#3182F6" } },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "TextComponent", props: { text: "🗣️ 말 관련", fontSize: 15, fontWeight: "700", color: "#191F28" } },
      { type: "CheckboxComponent", props: { label: "\"다들 의견 있으면 말해봐\" → 침묵", name: "b1" } },
      { type: "CheckboxComponent", props: { label: "\"간단하게 하겠습니다\" → 1시간", name: "b2" } },
      { type: "CheckboxComponent", props: { label: "아무도 안 듣는데 계속 말하는 사람", name: "b3" } },
      { type: "CheckboxComponent", props: { label: "\"제가 아까 말씀드렸듯이...\"", name: "b4" } },
      { type: "CheckboxComponent", props: { label: "회의 주제와 전혀 다른 이야기", name: "b5" } },
      { type: "DividerComponent", props: {} },
      { type: "TextComponent", props: { text: "💻 행동 관련", fontSize: 15, fontWeight: "700", color: "#191F28" } },
      { type: "CheckboxComponent", props: { label: "노트북으로 몰래 딴짓", name: "b6" } },
      { type: "CheckboxComponent", props: { label: "카메라 끄고 밥 먹기 (온라인)", name: "b7" } },
      { type: "CheckboxComponent", props: { label: "화면 공유 실수로 카톡 노출", name: "b8" } },
      { type: "CheckboxComponent", props: { label: "\"마이크 안 켜져 있어요\"", name: "b9" } },
      { type: "CheckboxComponent", props: { label: "고개만 끄덕이다 끝", name: "b10" } },
      { type: "DividerComponent", props: {} },
      { type: "TextComponent", props: { text: "⏰ 시간 관련", fontSize: 15, fontWeight: "700", color: "#191F28" } },
      { type: "CheckboxComponent", props: { label: "회의 시작 5분 전 급하게 소집", name: "b11" } },
      { type: "CheckboxComponent", props: { label: "끝나야 할 시간에 새 주제 등장", name: "b12" } },
      { type: "CheckboxComponent", props: { label: "\"이건 다음에 다시 논의합시다\"", name: "b13" } },
      { type: "CheckboxComponent", props: { label: "이메일로 될 걸 회의로 함", name: "b14" } },
      { type: "CheckboxComponent", props: { label: "회의 끝나고 또 회의 잡힘", name: "b15" } },
      { type: "DividerComponent", props: {} },
      { type: "TextComponent", props: { text: "😂 레전드", fontSize: 15, fontWeight: "700", color: "#191F28" } },
      { type: "CheckboxComponent", props: { label: "팀장님 혼자 30분 독백", name: "b16" } },
      { type: "CheckboxComponent", props: { label: "결론 없이 \"각자 생각해봅시다\"", name: "b17" } },
      { type: "CheckboxComponent", props: { label: "발표자가 자료를 안 가져옴", name: "b18" } },
      { type: "CheckboxComponent", props: { label: "\"이거 누가 하기로 했죠?\" 서로 눈치", name: "b19" } },
      { type: "CheckboxComponent", props: { label: "회의실 예약 안 해서 복도에서 대기", name: "b20" } },
      { type: "DividerComponent", props: {} },
      { type: "TextComponent", props: { text: "🏆 보너스", fontSize: 15, fontWeight: "700", color: "#191F28" } },
      { type: "CheckboxComponent", props: { label: "회의 중 택배 도착", name: "b21" } },
      { type: "CheckboxComponent", props: { label: "\"이건 오프라인에서 합시다\" (온라인인데)", name: "b22" } },
      { type: "CheckboxComponent", props: { label: "PPT 글자 너무 작아서 안 보임", name: "b23" } },
      { type: "CheckboxComponent", props: { label: "\"다음 회의는 언제가 좋을까요?\"", name: "b24" } },
      { type: "CheckboxComponent", props: { label: "회의 끝나고 진짜 회의 시작", name: "b25" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "CardComponent", props: { title: "📊 내 빙고 결과", description: "체크한 항목이 많을수록 회의 생존자!\n0~5: 럭키 직장인 🍀\n6~10: 평범한 직장인 😐\n11~15: 회의 생존자 💪\n16~20: 회의 전문가 🎖️\n21~25: 회의 레전드 👑", showImage: false, bgColor: "#F0F4FF" } },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "ButtonComponent", props: { text: "📸 결과 캡처해서 공유하기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "share" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "🔄 다시 하기", bgColor: "#F2F4F6", textColor: "#4E5968", fullWidth: true, action: "toast", actionValue: "체크박스를 초기화해주세요!" } },
      { type: "SpacerComponent", props: { height: 24 } },
    ]),
  },
  {
    id: "worker-type-test",
    name: "직장인 유형 테스트",
    description: "나는 어떤 유형의 직장인일까? 심리테스트",
    icon: "🧑‍💼",
    category: "퀴즈",
    data: makeTemplate([
      { type: "QuizIntroComponent", props: { 
        title: "나는 어떤 직장인?", 
        subtitle: "12문항으로 알아보는 나의 직장 생활 유형",
        buttonText: "테스트 시작하기",
        bgColor: "#3182F6",
        emoji: "🧑‍💼"
      }},
      { type: "QuizQuestionComponent", props: { 
        questionNumber: 1, 
        totalQuestions: 5, 
        question: "월요일 아침, 알람이 울린다. 당신의 반응은?",
        options: [
          "벌써 일어나서 운동하고 옴 💪",
          "알람 끄고 5분만... (30분 후 기상) 😴",
          "침대에서 오늘 할 일 정리 📝",
          "출근 1시간 전에 여유롭게 커피 ☕"
        ],
        optionScores: [3, 0, 2, 1]
      }},
      { type: "QuizQuestionComponent", props: { 
        questionNumber: 2, 
        totalQuestions: 5, 
        question: "점심시간, 동료가 맛집을 추천한다. 당신은?",
        options: [
          "이미 도시락 싸왔는데... 🍱",
          "무조건 가자! 맛집은 참을 수 없어 🤤",
          "메뉴판 먼저 보내줘, 분석 좀 할게 🧐",
          "아무거나~ 다 좋아~ 😊"
        ],
        optionScores: [2, 0, 3, 1]
      }},
      { type: "QuizQuestionComponent", props: { 
        questionNumber: 3, 
        totalQuestions: 5, 
        question: "갑자기 야근이 잡혔다. 당신의 머릿속은?",
        options: [
          "오히려 좋아, 집중할 시간 생겼다 🔥",
          "...퇴사각? 😤",
          "야근 수당 계산 시작 💰",
          "동료들이랑 같이니까 괜찮아 🤝"
        ],
        optionScores: [3, 0, 2, 1]
      }},
      { type: "QuizQuestionComponent", props: { 
        questionNumber: 4, 
        totalQuestions: 5, 
        question: "연차 사용, 당신의 스타일은?",
        options: [
          "연초에 이미 다 계획함 📅",
          "금요일 붙여서 3일 연휴 만들기 🏖️",
          "아껴두다가 연말에 몰아쓰기 📊",
          "아파야 쓰는 거 아닌가...? 🤒"
        ],
        optionScores: [3, 1, 2, 0]
      }},
      { type: "QuizQuestionComponent", props: { 
        questionNumber: 5, 
        totalQuestions: 5, 
        question: "퇴근 후, 당신의 루틴은?",
        options: [
          "자기계발 (운동, 공부, 사이드 프로젝트) 📚",
          "넷플릭스 + 치킨 = 행복 🍗",
          "내일 업무 미리 정리하고 자기 🗂️",
          "친구/동료 만나서 수다 떨기 🗣️"
        ],
        optionScores: [3, 0, 2, 1]
      }},
      { type: "QuizResultComponent", props: { 
        results: [
          { 
            minScore: 0, maxScore: 4, 
            title: "🍀 워라밸의 신", 
            description: "일은 일, 삶은 삶! 칼퇴는 기본이고 연차는 당연한 권리. 회사에서 가장 행복한 사람은 바로 당신. 동료들이 부러워하는 워라밸의 달인!" 
          },
          { 
            minScore: 5, maxScore: 8, 
            title: "🤝 분위기 메이커", 
            description: "팀의 윤활유 같은 존재! 회식 자리를 빛내고, 팀 분위기를 살리는 당신. 업무 능력도 좋지만 사람 관계가 진짜 재산. 모두가 당신과 일하고 싶어해요." 
          },
          { 
            minScore: 9, maxScore: 12, 
            title: "📊 전략적 직장인", 
            description: "철저한 계획과 분석의 달인! 연차도 전략적으로, 업무도 체계적으로. 승진 로드맵이 이미 머릿속에 있는 당신은 미래의 임원감!" 
          },
          { 
            minScore: 13, maxScore: 15, 
            title: "🔥 열정 만수르", 
            description: "일이 곧 삶, 삶이 곧 일! 야근도 자기계발의 일부라 생각하는 열정 가득한 당신. 동료들은 존경하지만 가끔은 쉬어도 괜찮아요 😊" 
          }
        ],
        shareText: "나의 직장인 유형은? 🧑‍💼",
        retryText: "다시 테스트하기"
      }},
    ]),
  },
  {
    id: "salary-timer",
    name: "월급루팡 계산기",
    description: "연봉을 초단위로 환산, 회의 비용 계산, 재미있는 환산",
    icon: "💰",
    category: "유틸리티",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "월급루팡 계산기 💰", showBack: true, showMenu: false } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "내 연봉", fontSize: 14, color: "#6B7684", fontWeight: "500" } },
      { type: "HeaderComponent", props: { text: "5,000만원", level: "h1" } },
      { type: "ProgressBarComponent", props: { value: 25, color: "#3182F6", label: "2,000만 ~ 2억 범위" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "TextComponent", props: { text: "💰 급여 환산", fontSize: 16, fontWeight: "700", color: "#191F28" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ListRowComponent", props: { title: "시급", description: "근무시간 기준 (주 40시간)", hasArrow: false, prefix: "⏰" } },
      { type: "BadgeComponent", props: { text: "₩24,038", bgColor: "#3182F6" } },
      { type: "ListRowComponent", props: { title: "분급", description: "1분에 버는 금액", hasArrow: false, prefix: "⏱" } },
      { type: "BadgeComponent", props: { text: "₩401", bgColor: "#1B64DA" } },
      { type: "ListRowComponent", props: { title: "초급", description: "1초에 버는 금액", hasArrow: false, prefix: "⚡" } },
      { type: "BadgeComponent", props: { text: "₩6.68", bgColor: "#0F4C99" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "CardComponent", props: { title: "🔥 오늘 번 돈", description: "출근 9시 기준 · 5시간 15분 경과", showImage: false, bgColor: "#FFF7ED" } },
      { type: "HeaderComponent", props: { text: "₩126,495", level: "h1" } },
      { type: "TextComponent", props: { text: "지금 이 순간에도 돈을 벌고 있어요!", fontSize: 13, color: "#6B7684" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "TextComponent", props: { text: "🏢 회의 비용 계산기", fontSize: 16, fontWeight: "700", color: "#191F28" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ListRowComponent", props: { title: "참석자 5명 · 평균 연봉 5,000만원", description: "1시간 회의 기준", hasArrow: false, prefix: "👥" } },
      { type: "CardComponent", props: { title: "이 회의 비용", description: "1분마다 ₩2,003가 날아갑니다 🔥", showImage: false, bgColor: "#FEF2F2" } },
      { type: "HeaderComponent", props: { text: "₩120,192", level: "h2" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "TextComponent", props: { text: "🛍️ 연봉으로 살 수 있는 것들", fontSize: 16, fontWeight: "700", color: "#191F28" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ListRowComponent", props: { title: "☕ 스타벅스 아아", description: "4,500원 × 11,111잔", hasArrow: false } },
      { type: "ListRowComponent", props: { title: "🍗 치킨", description: "20,000원 × 2,500마리", hasArrow: false } },
      { type: "ListRowComponent", props: { title: "📱 아이폰 16", description: "1,500,000원 × 33대", hasArrow: false } },
      { type: "ListRowComponent", props: { title: "✈️ 제주도 왕복", description: "100,000원 × 500번", hasArrow: false } },
      { type: "ListRowComponent", props: { title: "🍜 짜장면", description: "7,000원 × 7,142그릇", hasArrow: false } },
      { type: "ListRowComponent", props: { title: "🚗 테슬라 모델3", description: "55,000,000원 × 0.9대", hasArrow: false } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "BadgeComponent", props: { text: "연봉 5,000만원 기준", bgColor: "#6B7684" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "BottomCTAComponent", props: { text: "📸 결과 공유하기" } },
    ]),
  },
  {
    id: "burnout-check",
    name: "번아웃 온도계",
    description: "직장인 번아웃 자가진단 체크리스트 — 20개 항목 체크로 번아웃 온도 측정",
    icon: "🌡️",
    category: "건강",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "번아웃 온도계", showBack: true } },
      { type: "TextComponent", props: { text: "🌡️ 나의 번아웃 온도는?", fontSize: 24, fontWeight: "700", textAlign: "center" } },
      { type: "TextComponent", props: { text: "해당하는 항목을 체크해주세요", fontSize: 14, color: "#8B95A1", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "ProgressBarComponent", props: { value: 0, max: 100, label: "번아웃 온도", showPercent: true, barColor: "#4CAF50" } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "CardComponent", props: { title: "🏃 신체 증상", description: "몸이 보내는 경고 신호" } },
      { type: "CheckboxComponent", props: { label: "만성 피로를 느낀다", name: "body_1" } },
      { type: "CheckboxComponent", props: { label: "수면 장애가 있다", name: "body_2" } },
      { type: "CheckboxComponent", props: { label: "두통/몸살이 잦다", name: "body_3" } },
      { type: "CheckboxComponent", props: { label: "식욕에 변화가 생겼다", name: "body_4" } },
      { type: "CheckboxComponent", props: { label: "면역력이 떨어졌다", name: "body_5" } },
      { type: "DividerComponent", props: {} },

      { type: "CardComponent", props: { title: "💔 감정 변화", description: "마음이 보내는 SOS" } },
      { type: "CheckboxComponent", props: { label: "무기력하고 공허하다", name: "emotion_1" } },
      { type: "CheckboxComponent", props: { label: "짜증이 쉽게 폭발한다", name: "emotion_2" } },
      { type: "CheckboxComponent", props: { label: "냉소적인 태도가 늘었다", name: "emotion_3" } },
      { type: "CheckboxComponent", props: { label: "자존감이 떨어졌다", name: "emotion_4" } },
      { type: "CheckboxComponent", props: { label: "감정 기복이 심하다", name: "emotion_5" } },
      { type: "DividerComponent", props: {} },

      { type: "CardComponent", props: { title: "💼 업무 능력", description: "일에서 나타나는 변화" } },
      { type: "CheckboxComponent", props: { label: "집중력이 떨어졌다", name: "work_1" } },
      { type: "CheckboxComponent", props: { label: "실수가 늘었다", name: "work_2" } },
      { type: "CheckboxComponent", props: { label: "의욕을 잃었다", name: "work_3" } },
      { type: "CheckboxComponent", props: { label: "업무를 자꾸 미룬다", name: "work_4" } },
      { type: "CheckboxComponent", props: { label: "성과가 눈에 띄게 하락했다", name: "work_5" } },
      { type: "DividerComponent", props: {} },

      { type: "CardComponent", props: { title: "🤝 대인 관계", description: "사람과의 거리감" } },
      { type: "CheckboxComponent", props: { label: "사람 만나기가 싫다", name: "rel_1" } },
      { type: "CheckboxComponent", props: { label: "대화가 줄었다", name: "rel_2" } },
      { type: "CheckboxComponent", props: { label: "갈등이 늘었다", name: "rel_3" } },
      { type: "CheckboxComponent", props: { label: "외로움과 고립감을 느낀다", name: "rel_4" } },
      { type: "CheckboxComponent", props: { label: "공감 능력이 떨어졌다", name: "rel_5" } },

      { type: "SpacerComponent", props: { height: 20 } },
      { type: "ButtonComponent", props: { text: "🌡️ 번아웃 온도 확인하기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "toast", actionValue: "체크한 항목 수 × 5 = 나의 번아웃 온도!" } },
      { type: "SpacerComponent", props: { height: 12 } },

      { type: "CardComponent", props: { title: "결과 등급 안내", description: "0~20% 🟢 건강 | 21~40% 🟡 주의 | 41~60% 🟠 경고 | 61~80% 🔴 위험 | 81~100% 🚨 긴급" } },
      { type: "BadgeComponent", props: { text: "결과는 참고용이며 전문 상담을 권장합니다", bgColor: "#F2F4F6" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "📤 결과 공유하기", bgColor: "#FFFFFF", textColor: "#3182F6", fullWidth: true, action: "share" } },
    ]),
  },
  {
    id: "mbti-personality-test",
    name: "MBTI 성격 테스트",
    description: "12문항으로 알아보는 나의 연애 유형 테스트 — 결과 카드 + 공유",
    icon: "💕",
    category: "퀴즈",
    data: makeTemplate([
      { type: "QuizIntroComponent", props: {
        title: "나의 연애 유형은?",
        subtitle: "12문항으로 알아보는 연애 스타일 테스트\n약 3분 소요 · 200만명이 참여했어요!",
        buttonText: "테스트 시작하기 💕",
        bgColor: "#E91E63",
        emoji: "💕"
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 1, totalQuestions: 12,
        question: "주말에 연인과 시간을 보낸다면?",
        options: ["새로운 맛집이나 전시회 탐방 🗺️", "집에서 넷플릭스 정주행 🛋️", "같이 운동하거나 야외 활동 🏃", "각자 시간 보내다가 저녁에 만남 📱"],
        optionScores: [2, 1, 3, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 2, totalQuestions: 12,
        question: "연인과 싸웠을 때 나의 스타일은?",
        options: ["바로 대화로 해결하자고 함 🗣️", "시간을 두고 혼자 정리한 뒤 연락 ⏰", "먼저 사과하고 분위기 풀기 🤗", "감정을 글로 정리해서 보냄 💌"],
        optionScores: [3, 0, 1, 2]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 3, totalQuestions: 12,
        question: "이상형의 가장 중요한 조건은?",
        options: ["유머 감각 😂", "안정적인 직업과 경제력 💼", "나를 이해해주는 공감력 🤝", "비주얼 / 패션 센스 ✨"],
        optionScores: [1, 2, 3, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 4, totalQuestions: 12,
        question: "연인의 카톡 답장이 3시간째 없다면?",
        options: ["바쁜가보다 하고 내 할 일 함 🧘", "읽씹인지 안읽씹인지 확인 👀", "무슨 일 있나 걱정됨 😟", "나도 답장 느리게 해야지 😤"],
        optionScores: [3, 1, 2, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 5, totalQuestions: 12,
        question: "기념일에 대한 나의 생각은?",
        options: ["100일, 200일 다 챙기는 편 🎂", "1주년 같은 큰 기념일만 챙김 🎉", "기념일보다 일상의 작은 서프라이즈 🎁", "기념일? 그게 뭐가 중요해 🤷"],
        optionScores: [1, 2, 3, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 6, totalQuestions: 12,
        question: "연인에게 고민을 이야기할 때?",
        options: ["솔직하게 다 오픈함 📖", "핵심만 간단하게 말함 📝", "분위기 봐서 적당히 말함 🎭", "고민은 혼자 해결하는 편 🧠"],
        optionScores: [3, 2, 1, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 7, totalQuestions: 12,
        question: "애인 친구들과의 모임에 초대받았다면?",
        options: ["적극적으로 참여! 친해지고 싶어 🙋", "가긴 하는데 조용히 있을 듯 🤐", "좀 부담스럽지만 가야지 😅", "둘이 보내는 시간이 더 좋은데... 🥺"],
        optionScores: [3, 1, 2, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 8, totalQuestions: 12,
        question: "연인이 이직을 고민 중이라면?",
        options: ["같이 장단점 리스트 만들어봐 📊", "네가 하고 싶은 대로 해, 응원할게 💪", "현실적인 조건부터 따져보자 💰", "결정은 네 몫이야, 물어보면 답해줄게 🤔"],
        optionScores: [2, 3, 1, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 9, totalQuestions: 12,
        question: "연인에게 가장 많이 하는 스킨십은?",
        options: ["손잡기 / 팔짱 🤝", "포옹 🤗", "볼 뽀뽀 / 이마 뽀뽀 😘", "스킨십은 별로... 😳"],
        optionScores: [2, 3, 1, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 10, totalQuestions: 12,
        question: "여행 계획을 세울 때 나는?",
        options: ["분 단위 완벽 계획표 작성 📋", "숙소만 잡고 나머지는 현지에서 🎒", "연인이 세운 계획에 따라감 😊", "여행? 집이 최고인데... 🏠"],
        optionScores: [2, 3, 1, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 11, totalQuestions: 12,
        question: "연인이 울고 있다면?",
        options: ["안아주면서 다 들어줌 🫂", "왜 우는지 원인부터 파악 🔍", "같이 울어버림 😭", "어색하지만 옆에 있어줌 🧍"],
        optionScores: [3, 2, 1, 0]
      }},
      { type: "QuizQuestionComponent", props: {
        questionNumber: 12, totalQuestions: 12,
        question: "이별 후 나의 모습은?",
        options: ["바로 자기계발에 올인 📚", "한동안 감정 정리 시간이 필요함 😢", "친구들 만나면서 극복 🍻", "다음 연애 상대를 찾아봄 👀"],
        optionScores: [2, 3, 1, 0]
      }},
      { type: "QuizResultComponent", props: {
        results: [
          { minScore: 0, maxScore: 9, title: "🐱 독립적인 고양이형", description: "혼자만의 시간이 중요한 당신! 연애도 하지만 나만의 공간은 절대 포기 못 해요. 서로 존중하며 자유로운 연애를 추구하는 타입. 잘 맞는 유형: 강아지형, 여우형" },
          { minScore: 10, maxScore: 18, title: "🦊 센스 있는 여우형", description: "상황 판단이 빠르고 연애에도 전략적인 당신! 밀당의 고수이지만 진심이 담기면 누구보다 다정해요. 잘 맞는 유형: 곰형, 고양이형" },
          { minScore: 19, maxScore: 27, title: "🧸 다정한 곰형", description: "따뜻하고 포근한 연애를 하는 당신! 연인에게 헌신적이고 안정적인 관계를 중시해요. 가끔은 너무 퍼주는 게 단점. 잘 맞는 유형: 여우형, 강아지형" },
          { minScore: 28, maxScore: 36, title: "🐶 열정적인 강아지형", description: "사랑 앞에 솔직하고 적극적인 당신! 표현력이 좋고 연인에게 에너지를 불어넣어 줘요. 가끔 과한 애정표현이 부담될 수도? 잘 맞는 유형: 고양이형, 곰형" }
        ],
        shareText: "나의 연애 유형 테스트 결과는? 💕",
        retryText: "다시 테스트하기"
      }},
    ]),
  },
  {
    id: "daily-quiz",
    name: "데일리 퀴즈",
    description: "매일 1문제! 오늘의 상식 퀴즈 — 정답 확인 + 스트릭",
    icon: "📚",
    category: "퀴즈",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "오늘의 퀴즈", showBack: false, showMenu: true } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "2024년 2월 13일 목요일", fontSize: 13, color: "#8B95A1", textAlign: "center" } },
      { type: "TextComponent", props: { text: "📚 오늘의 상식 퀴즈", fontSize: 24, fontWeight: "700", textAlign: "center", color: "#191F28" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "CardComponent", props: { title: "🔥 나의 스트릭", description: "연속 정답 7일째! 대단해요!", showImage: false, bgColor: "#FFF7ED" } },
      { type: "ProgressBarComponent", props: { value: 7, max: 30, label: "이번 달 출석", showPercent: false, barColor: "#FF6B35", height: 8 } },
      { type: "TextComponent", props: { text: "7 / 30일 참여", fontSize: 12, color: "#8B95A1", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "BadgeComponent", props: { text: "Q. 오늘의 문제", bgColor: "#3182F6" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "세계에서 가장 깊은 호수는?", fontSize: 20, fontWeight: "700", color: "#191F28" } },
      { type: "TextComponent", props: { text: "힌트: 러시아에 있으며, 세계 담수의 20%를 보유하고 있어요.", fontSize: 14, color: "#8B95A1" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "① 카스피해", bgColor: "#F2F4F6", textColor: "#191F28", fullWidth: true, action: "toast", actionValue: "❌ 오답! 카스피해는 세계에서 가장 큰 호수예요." } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "② 바이칼 호수", bgColor: "#F2F4F6", textColor: "#191F28", fullWidth: true, action: "toast", actionValue: "🎉 정답! 바이칼 호수는 최대 수심 1,642m입니다!" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "③ 탕가니카 호수", bgColor: "#F2F4F6", textColor: "#191F28", fullWidth: true, action: "toast", actionValue: "❌ 오답! 탕가니카는 세계에서 두 번째로 깊은 호수예요." } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "④ 빅토리아 호수", bgColor: "#F2F4F6", textColor: "#191F28", fullWidth: true, action: "toast", actionValue: "❌ 오답! 빅토리아 호수는 아프리카에서 가장 큰 호수예요." } },
      { type: "SpacerComponent", props: { height: 20 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "CardComponent", props: { title: "💡 알고 계셨나요?", description: "바이칼 호수는 약 2,500만년 전에 형성된 세계에서 가장 오래된 호수이기도 합니다. 1,700종 이상의 동식물이 서식하며 그 중 2/3가 고유종이에요!", showImage: false, bgColor: "#EFF6FF" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "TextComponent", props: { text: "📊 전체 참여자 정답률", fontSize: 14, fontWeight: "600", color: "#191F28" } },
      { type: "ProgressBarComponent", props: { value: 43, max: 100, label: "43%가 맞혔어요", showPercent: true, barColor: "#10B981" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "📤 친구에게 퀴즈 공유하기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "share" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "내일 새로운 퀴즈가 출제됩니다 ⏰", fontSize: 13, color: "#8B95A1", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 16 } },
    ]),
  },
  {
    id: "vote-battle",
    name: "이것 vs 저것 투표",
    description: "두 선택지 투표 배틀 — 실시간 투표율 + 결과 공유",
    icon: "⚔️",
    category: "소셜",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "오늘의 투표 ⚔️", showBack: false, showMenu: true } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "BadgeComponent", props: { text: "🔥 실시간 투표 중", bgColor: "#EF4444" } },
      { type: "TextComponent", props: { text: "12,847명 참여 중", fontSize: 13, color: "#8B95A1", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "TextComponent", props: { text: "🍗 치킨 vs 🍕 피자", fontSize: 26, fontWeight: "800", textAlign: "center", color: "#191F28" } },
      { type: "TextComponent", props: { text: "야식으로 먹을 수 있는 건 딱 하나!", fontSize: 15, color: "#6B7684", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 20 } },

      { type: "GridComponent", props: {
        columns: 2, gap: 12,
        children: []
      }},
      { type: "CardComponent", props: { title: "🍗 치킨", description: "바삭한 후라이드\n맥주와 환상 조합\n야식의 정석", showImage: false, bgColor: "#FFF7ED" } },
      { type: "ButtonComponent", props: { text: "🍗 치킨에 투표!", bgColor: "#FF6B35", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "toast", actionValue: "🍗 치킨에 투표했습니다!" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "CardComponent", props: { title: "🍕 피자", description: "치즈가 쭉~\n다양한 토핑\n배달의 왕", showImage: false, bgColor: "#FEF2F2" } },
      { type: "ButtonComponent", props: { text: "🍕 피자에 투표!", bgColor: "#EF4444", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "toast", actionValue: "🍕 피자에 투표했습니다!" } },

      { type: "SpacerComponent", props: { height: 20 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "TextComponent", props: { text: "📊 실시간 투표 현황", fontSize: 16, fontWeight: "700", color: "#191F28" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "🍗 치킨 (57%)", fontSize: 15, fontWeight: "600", color: "#FF6B35" } },
      { type: "ProgressBarComponent", props: { value: 57, max: 100, label: "7,323표", showPercent: false, barColor: "#FF6B35", height: 12 } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "🍕 피자 (43%)", fontSize: 15, fontWeight: "600", color: "#EF4444" } },
      { type: "ProgressBarComponent", props: { value: 43, max: 100, label: "5,524표", showPercent: false, barColor: "#EF4444", height: 12 } },

      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },

      { type: "TextComponent", props: { text: "🗳️ 지난 투표 결과", fontSize: 16, fontWeight: "700", color: "#191F28" } },
      { type: "ListRowComponent", props: { title: "☕ 아아 vs 🧋 따아", description: "아아 62% 승리 · 9,231명 참여", hasArrow: true, prefix: "🏆" } },
      { type: "ListRowComponent", props: { title: "🐶 강아지 vs 🐱 고양이", description: "고양이 51% 승리 · 15,892명 참여", hasArrow: true, prefix: "🏆" } },
      { type: "ListRowComponent", props: { title: "🏖️ 바다 vs 🏔️ 산", description: "바다 58% 승리 · 11,204명 참여", hasArrow: true, prefix: "🏆" } },

      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "📤 투표 결과 공유하기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "share" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "매일 새로운 투표가 올라옵니다!", fontSize: 13, color: "#8B95A1", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 16 } },
    ]),
  },
  {
    id: "ranking-list",
    name: "맛집 랭킹 Top 10",
    description: "사용자 투표 기반 맛집 랭킹 리스트 — 투표로 순위 변동",
    icon: "🏆",
    category: "소셜",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "맛집 랭킹 🏆", showBack: false, showMenu: true } },
      { type: "CarouselComponent", props: {
        images: [
          "https://placehold.co/600x250/FF6B35/FFFFFF?text=🥇+1위+을지로+노가리+골목",
          "https://placehold.co/600x250/3182F6/FFFFFF?text=🥈+2위+성수동+브런치+카페",
          "https://placehold.co/600x250/10B981/FFFFFF?text=🥉+3위+이태원+타코+맛집"
        ],
        autoPlay: true, borderRadius: 0
      }},
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "TextComponent", props: { text: "🔥 서울 맛집 TOP 10", fontSize: 22, fontWeight: "800", color: "#191F28", textAlign: "center" } },
      { type: "TextComponent", props: { text: "34,521명이 투표한 리얼 맛집 랭킹", fontSize: 14, color: "#8B95A1", textAlign: "center" } },
      { type: "BadgeComponent", props: { text: "매주 월요일 업데이트", bgColor: "#3182F6" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },

      { type: "ListRowComponent", props: { title: "🥇 을지로 노가리 골목", description: "을지로 3가 · 레트로 감성 · 노가리+맥주", hasArrow: true, prefix: "1" } },
      { type: "ProgressBarComponent", props: { value: 95, max: 100, showPercent: false, barColor: "#FFD700", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "🥈 성수동 브런치 카페", description: "성수 · 인스타 감성 · 팬케이크 맛집", hasArrow: true, prefix: "2" } },
      { type: "ProgressBarComponent", props: { value: 89, max: 100, showPercent: false, barColor: "#C0C0C0", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "🥉 이태원 타코 맛집", description: "이태원 · 정통 멕시칸 · 매운맛 주의", hasArrow: true, prefix: "3" } },
      { type: "ProgressBarComponent", props: { value: 84, max: 100, showPercent: false, barColor: "#CD7F32", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "4위 망원동 국수집", description: "망원 · 칼국수 · 줄서는 맛집", hasArrow: true } },
      { type: "ProgressBarComponent", props: { value: 78, max: 100, showPercent: false, barColor: "#3182F6", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "5위 연남동 파스타", description: "연남 · 수제 파스타 · 와인 페어링", hasArrow: true } },
      { type: "ProgressBarComponent", props: { value: 72, max: 100, showPercent: false, barColor: "#3182F6", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "6위 광장시장 마약김밥", description: "종로 · 전통시장 · 가성비 최고", hasArrow: true } },
      { type: "ProgressBarComponent", props: { value: 68, max: 100, showPercent: false, barColor: "#3182F6", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "7위 합정 수제버거", description: "합정 · 더블패티 · SNS 핫플", hasArrow: true } },
      { type: "ProgressBarComponent", props: { value: 63, max: 100, showPercent: false, barColor: "#3182F6", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "8위 종로 삼계탕", description: "종로 · 전통 보양식 · 여름 필수", hasArrow: true } },
      { type: "ProgressBarComponent", props: { value: 57, max: 100, showPercent: false, barColor: "#3182F6", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "9위 익선동 한옥 카페", description: "익선동 · 전통차 · 한옥 감성", hasArrow: true } },
      { type: "ProgressBarComponent", props: { value: 51, max: 100, showPercent: false, barColor: "#3182F6", height: 6 } },
      { type: "SpacerComponent", props: { height: 4 } },

      { type: "ListRowComponent", props: { title: "10위 건대 양꼬치", description: "건대 · 중화풍 · 칭따오 세트", hasArrow: true } },
      { type: "ProgressBarComponent", props: { value: 45, max: 100, showPercent: false, barColor: "#3182F6", height: 6 } },

      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "TextComponent", props: { text: "내가 아는 맛집도 추천해주세요!", fontSize: 15, fontWeight: "600", color: "#191F28", textAlign: "center" } },
      { type: "ButtonComponent", props: { text: "🗳️ 맛집 추천 투표하기", bgColor: "#FF6B35", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "toast", actionValue: "투표 페이지로 이동합니다!" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "📤 랭킹 공유하기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "share" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "TabBarComponent", props: { tabs: [
        { icon: "🏆", label: "랭킹", pageId: "ranking" },
        { icon: "🗳️", label: "투표", pageId: "vote" },
        { icon: "📍", label: "지도", pageId: "map" },
        { icon: "👤", label: "마이", pageId: "my" }
      ]}},
    ]),
  },
  {
    id: "fortune-tarot",
    name: "오늘의 운세/타로",
    description: "타로 카드 뽑기 + 오늘의 운세 — 결과 공유",
    icon: "🔮",
    category: "퀴즈",
    data: makeTemplate([
      { type: "NavigationComponent", props: { title: "오늘의 타로 🔮", showBack: false, showMenu: false } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ImageComponent", props: { src: "https://placehold.co/600x300/1A1A2E/E0B0FF?text=✨+TODAY'S+TAROT+✨", borderRadius: 0, aspectRatio: "16/9" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "TextComponent", props: { text: "오늘의 타로 카드", fontSize: 24, fontWeight: "700", textAlign: "center", color: "#191F28" } },
      { type: "TextComponent", props: { text: "카드 한 장이 오늘 하루를 알려줄 거예요", fontSize: 14, color: "#8B95A1", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "TextComponent", props: { text: "🃏 카드를 선택하세요", fontSize: 16, fontWeight: "600", textAlign: "center", color: "#6B7684" } },
      { type: "SpacerComponent", props: { height: 12 } },
      { type: "GridComponent", props: { columns: 3, gap: 8, children: [] } },
      { type: "ButtonComponent", props: { text: "🃏 1번", bgColor: "#1A1A2E", textColor: "#E0B0FF", fullWidth: true, action: "toast", actionValue: "🌟 THE STAR — 희망과 영감의 카드! 오늘은 새로운 가능성이 열리는 날이에요." } },
      { type: "ButtonComponent", props: { text: "🃏 2번", bgColor: "#1A1A2E", textColor: "#E0B0FF", fullWidth: true, action: "toast", actionValue: "☀️ THE SUN — 성공과 활력의 카드! 오늘 하루가 밝고 에너지 넘칠 거예요." } },
      { type: "ButtonComponent", props: { text: "🃏 3번", bgColor: "#1A1A2E", textColor: "#E0B0FF", fullWidth: true, action: "toast", actionValue: "🌙 THE MOON — 직감과 상상력의 카드! 오늘은 감성이 예민해지는 날이에요." } },

      { type: "SpacerComponent", props: { height: 20 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 16 } },

      { type: "TextComponent", props: { text: "✨ 오늘의 운세", fontSize: 20, fontWeight: "700", color: "#191F28" } },
      { type: "SpacerComponent", props: { height: 12 } },

      { type: "CardComponent", props: { title: "💕 연애운", description: "⭐⭐⭐⭐☆\n소중한 인연을 만날 수 있는 날. 적극적으로 다가가 보세요!", showImage: false, bgColor: "#FCE7F3" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "CardComponent", props: { title: "💰 금전운", description: "⭐⭐⭐☆☆\n큰 지출은 피하세요. 소소한 행운이 찾아올 수 있어요.", showImage: false, bgColor: "#FEF3C7" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "CardComponent", props: { title: "💼 직장운", description: "⭐⭐⭐⭐⭐\n능력을 인정받는 날! 중요한 프레젠테이션이나 미팅에 좋아요.", showImage: false, bgColor: "#EFF6FF" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "CardComponent", props: { title: "🍀 건강운", description: "⭐⭐⭐⭐☆\n가벼운 운동으로 활력을 충전하세요. 스트레칭 추천!", showImage: false, bgColor: "#F0FDF4" } },

      { type: "SpacerComponent", props: { height: 16 } },
      { type: "DividerComponent", props: {} },
      { type: "SpacerComponent", props: { height: 12 } },

      { type: "TextComponent", props: { text: "🎯 오늘의 럭키 아이템", fontSize: 16, fontWeight: "600", color: "#191F28" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ListRowComponent", props: { title: "럭키 컬러", description: "파란색 💙", hasArrow: false, prefix: "🎨" } },
      { type: "ListRowComponent", props: { title: "럭키 넘버", description: "7", hasArrow: false, prefix: "🔢" } },
      { type: "ListRowComponent", props: { title: "럭키 푸드", description: "크림파스타 🍝", hasArrow: false, prefix: "🍽️" } },
      { type: "ListRowComponent", props: { title: "럭키 방향", description: "남동쪽", hasArrow: false, prefix: "🧭" } },

      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "📤 오늘의 운세 공유하기", bgColor: "#6366F1", textColor: "#FFFFFF", fullWidth: true, size: "large", action: "share" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "🔮 다시 뽑기", bgColor: "#F2F4F6", textColor: "#4E5968", fullWidth: true, action: "toast", actionValue: "내일 다시 뽑을 수 있어요! ⏰" } },
      { type: "SpacerComponent", props: { height: 16 } },
    ]),
  },
];
