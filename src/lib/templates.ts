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
    description: "상품 목록과 구매 버튼이 있는 간단한 쇼핑몰",
    icon: "🛍️",
    category: "커머스",
    data: makeTemplate([
      { type: "HeaderComponent", props: { text: "✨ 오늘의 특가", level: "h1" } },
      { type: "TextComponent", props: { text: "매일 새로운 할인 상품을 만나보세요", fontSize: 14, color: "#8B95A1" } },
      { type: "CarouselComponent", props: { 
        images: [
          "https://placehold.co/600x300/3182F6/FFFFFF?text=SALE+50%25",
          "https://placehold.co/600x300/FF6B35/FFFFFF?text=NEW+ARRIVAL",
          "https://placehold.co/600x300/6366F1/FFFFFF?text=FREE+SHIPPING"
        ],
        autoPlay: true,
        borderRadius: 12
      }},
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "CardComponent", props: { title: "프리미엄 무선 이어폰", description: "49,900원 → 29,900원 (40% OFF)", showImage: true } },
      { type: "CardComponent", props: { title: "스마트 워치 밴드", description: "19,900원 → 12,900원 (35% OFF)", showImage: true } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ButtonComponent", props: { text: "💳 바로 구매하기", bgColor: "#3182F6", textColor: "#FFFFFF", fullWidth: true, action: "pay", actionValue: "29900" } },
      { type: "SpacerComponent", props: { height: 16 } },
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
    description: "프로모션 이벤트를 홍보하는 페이지",
    icon: "🎉",
    category: "마케팅",
    data: makeTemplate([
      { type: "CarouselComponent", props: { 
        images: [
          "https://placehold.co/600x300/FF6B35/FFFFFF?text=🎉+GRAND+EVENT",
          "https://placehold.co/600x300/3182F6/FFFFFF?text=UP+TO+50%25+OFF"
        ],
        autoPlay: true,
        borderRadius: 16
      }},
      { type: "HeaderComponent", props: { text: "🎁 신규 가입 이벤트!", level: "h1" } },
      { type: "TextComponent", props: { text: "지금 가입하면 5,000원 즉시 지급!\n기간: 2024.1.1 ~ 2024.1.31", fontSize: 15, color: "#191F28", textAlign: "center" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "ProgressBarComponent", props: { value: 78, max: 100, label: "참여 현황", showPercent: true, barColor: "#FF6B35" } },
      { type: "DividerComponent", props: {} },
      { type: "ListComponent", props: { items: ["✅ 신규 가입 시 5,000원 지급", "✅ 친구 초대 시 추가 3,000원", "✅ 첫 구매 시 10% 할인"], showIcon: false, showArrow: false } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "지금 참여하기 🎁", bgColor: "#FF6B35", textColor: "#FFFFFF", fullWidth: true, size: "lg", action: "toast", actionValue: "이벤트에 참여되었습니다!" } },
      { type: "BottomSheetComponent", props: { sheetId: "rules", title: "이벤트 유의사항", content: "• 이벤트 기간 내 1회만 참여 가능합니다.\n• 부정 참여 시 혜택이 취소될 수 있습니다.\n• 자세한 내용은 공지사항을 확인해주세요.", triggerText: "유의사항 보기" } },
    ]),
  },
  {
    id: "survey",
    name: "설문조사",
    description: "간단한 설문조사 폼",
    icon: "📝",
    category: "폼",
    data: makeTemplate([
      { type: "HeaderComponent", props: { text: "📝 고객 만족도 조사", level: "h1" } },
      { type: "TextComponent", props: { text: "더 나은 서비스를 위해 의견을 들려주세요.\n소요시간: 약 1분", fontSize: 14, color: "#8B95A1" } },
      { type: "ProgressBarComponent", props: { value: 25, max: 100, label: "진행률", showPercent: true, barColor: "#10B981" } },
      { type: "DividerComponent", props: {} },
      { type: "InputComponent", props: { label: "이름 (선택)", placeholder: "이름을 입력하세요", name: "name" } },
      { type: "InputComponent", props: { label: "이메일", placeholder: "example@email.com", type: "email", required: true, name: "email" } },
      { type: "SpacerComponent", props: { height: 8 } },
      { type: "TextComponent", props: { text: "서비스 이용 빈도는 어떻게 되나요?", fontSize: 15, fontWeight: "500" } },
      { type: "ListComponent", props: { items: ["매일", "주 2-3회", "주 1회", "월 1-2회", "거의 안 씀"], showIcon: false, showArrow: true } },
      { type: "InputComponent", props: { label: "개선 의견", placeholder: "자유롭게 작성해주세요", name: "feedback", helpText: "솔직한 의견을 들려주세요" } },
      { type: "SpacerComponent", props: { height: 16 } },
      { type: "ButtonComponent", props: { text: "제출하기", bgColor: "#10B981", textColor: "#FFFFFF", fullWidth: true, action: "toast", actionValue: "설문이 제출되었습니다. 감사합니다!" } },
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
      { type: "ButtonComponent", props: { text: "💳 주문하기", bgColor: "#FF6B35", textColor: "#FFFFFF", fullWidth: true, size: "lg", action: "pay", actionValue: "17000" } },
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
];
