/** 앱 이름/설명에 포함 불가한 금지 키워드 */
export const BANNED_KEYWORDS: string[] = [
  'toss',
  '토스',
  'apps-in-toss',
  '앱인토스',
];

/** 앱인토스에서 허용하지 않는 카테고리 */
export const BANNED_CATEGORIES: string[] = [
  '가상자산',
  '사행성',
  '데이팅',
];

/** TDS 컴포넌트 목록 (사용률 계산용) */
export const TDS_COMPONENTS: string[] = [
  'ButtonComponent',
  'CardComponent',
  'ListRowComponent',
  'TabComponent',
  'TabBarComponent',
  'NavigationComponent',
  'BottomSheetComponent',
  'InputComponent',
  'TextFieldComponent',
  'ProgressBarComponent',
  'BadgeComponent',
  'ToastComponent',
  'DividerComponent',
  'PaymentComponent',
  'AccountComponent',
  'CreditScoreComponent',
  'ProductCompareComponent',
  'TransactionListComponent',
];

/** appName 형식: 소문자 시작, 소문자+숫자+하이픈만 허용 */
export const APPNAME_REGEX = /^[a-z][a-z0-9-]*$/;

/** 부제 최대 길이 */
export const SUBTITLE_MAX_LENGTH = 20;

/** TDS 사용률 권장 기준 (%) */
export const TDS_USAGE_THRESHOLD = 80;

/** 허용 카테고리 목록 */
export const CATEGORIES: Record<string, string[]> = {
  '생활': ['일상', '기타'],
  '금융': ['자산관리', '결제', '보험'],
  '쇼핑': ['종합몰', '전문몰'],
  '푸드': ['배달', '예약'],
  '교통': ['이동', '주차'],
  '여행': ['숙박', '항공'],
  '엔터테인먼트': ['미디어', '음악'],
  '교육': ['학습', '자격증'],
  '건강': ['운동', '의료'],
  '비즈니스': ['업무', '협업'],
};

/** 비게임 카테고리만 허용 */
export const ALLOWED_APP_TYPE = '비게임' as const;
