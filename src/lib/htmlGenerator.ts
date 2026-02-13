/**
 * Appintoss HTML Generator
 * Craft.js JSON을 완전한 정적 HTML+CSS+JS로 변환
 */

import { generateSafeAreaCSS, generateViewportMeta } from './toss/safeArea';
import { generateSDKBridgeScript } from './toss/sdkBridge';

interface NodeData {
  type: { resolvedName: string };
  props: Record<string, unknown>;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
}

type NodesMap = Record<string, NodeData>;

export interface GenerateOptions {
  darkMode?: boolean;
  projectName?: string;
  pages?: Array<{ id: string; name: string; json: string }>;
  currentPageId?: string;
  /** Toss MiniApp 심사 모드 활성화 */
  tossMode?: boolean;
}

// 토스 스타일 CSS 변수
const getTossStyles = (darkMode: boolean) => `
:root {
  --toss-blue: #3182F6;
  --toss-blue-hover: #1B64DA;
  --toss-gray-50: ${darkMode ? '#1a1a1a' : '#F9FAFB'};
  --toss-gray-100: ${darkMode ? '#262626' : '#F2F4F6'};
  --toss-gray-200: ${darkMode ? '#333333' : '#E5E8EB'};
  --toss-gray-300: ${darkMode ? '#404040' : '#D1D6DB'};
  --toss-gray-400: ${darkMode ? '#666666' : '#B0B8C1'};
  --toss-gray-500: ${darkMode ? '#888888' : '#8B95A1'};
  --toss-gray-600: ${darkMode ? '#aaaaaa' : '#6B7684'};
  --toss-gray-700: ${darkMode ? '#cccccc' : '#4E5968'};
  --toss-gray-800: ${darkMode ? '#dddddd' : '#333D4B'};
  --toss-gray-900: ${darkMode ? '#f5f5f5' : '#191F28'};
  --bg-primary: ${darkMode ? '#111111' : '#FFFFFF'};
  --bg-secondary: ${darkMode ? '#1a1a1a' : '#F9FAFB'};
  --text-primary: ${darkMode ? '#FFFFFF' : '#191F28'};
  --text-secondary: ${darkMode ? '#aaaaaa' : '#8B95A1'};
  --border-color: ${darkMode ? '#333333' : '#E5E8EB'};
}
`;

// 기본 CSS 스타일
const getBaseStyles = () => `
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard Variable', Pretendard, Roboto, 'Noto Sans KR', 'Segoe UI', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  max-width: 100%;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

.content-area {
  padding: 0 16px;
}

/* Components */
.header-h1 { font-size: 24px; font-weight: 700; padding: 12px 0; }
.header-h2 { font-size: 20px; font-weight: 700; padding: 10px 0; }
.header-h3 { font-size: 18px; font-weight: 600; padding: 8px 0; }

.text-block { padding: 8px 0; line-height: 1.6; white-space: pre-wrap; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.btn:active { transform: scale(0.98); opacity: 0.9; }
.btn-sm { padding: 10px 16px; font-size: 14px; }
.btn-md { padding: 14px 20px; font-size: 16px; }
.btn-lg { padding: 18px 24px; font-size: 18px; }
.btn-full { width: 100%; }

.image-block { padding: 8px 0; }
.image-block img { width: 100%; height: auto; display: block; }

.card {
  border-radius: 16px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  background: var(--bg-primary);
  margin: 8px 0;
}
.card-image {
  height: 140px;
  background: linear-gradient(135deg, var(--toss-gray-50), var(--toss-gray-100));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}
.card-content { padding: 16px; }
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.card-desc { font-size: 14px; color: var(--text-secondary); }

.list-container { margin: 8px 0; }
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--border-color);
}
.list-item:last-child { border-bottom: none; }
.list-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--toss-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.list-text { flex: 1; font-size: 15px; }
.list-arrow { color: var(--toss-gray-400); font-size: 14px; }

.divider { border: none; border-top: 1px solid var(--border-color); margin: 16px 0; }

.input-group { margin: 8px 0; }
.input-label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: var(--text-primary); }
.input-field {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}
.input-field:focus { border-color: var(--toss-blue); }
.input-field::placeholder { color: var(--toss-gray-400); }

/* Bottom Sheet */
.bottom-sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
}
.bottom-sheet-overlay.open { opacity: 1; visibility: visible; }
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 101;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  max-height: 80vh;
  overflow-y: auto;
}
.bottom-sheet.open { transform: translateY(0); }
.bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background: var(--toss-gray-300);
  border-radius: 2px;
  margin: 0 auto 16px;
}
.bottom-sheet-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }

/* Tab Bar */
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 50;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 8px;
  gap: 4px;
  cursor: pointer;
  transition: color 0.2s;
  color: var(--toss-gray-500);
  background: none;
  border: none;
  font-family: inherit;
}
.tab-item.active { color: var(--toss-blue); }
.tab-icon { font-size: 22px; }
.tab-label { font-size: 11px; font-weight: 500; }

/* Toast */
.toast-container {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
}
.toast {
  background: var(--toss-gray-800);
  color: white;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  white-space: nowrap;
}
.toast.show { opacity: 1; transform: translateY(0); }

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

/* Carousel */
.carousel {
  position: relative;
  overflow: hidden;
  margin: 8px 0;
  border-radius: 12px;
}
.carousel-track {
  display: flex;
  transition: transform 0.3s ease;
}
.carousel-slide {
  min-width: 100%;
  aspect-ratio: 16/9;
}
.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.carousel-dot.active { background: white; width: 20px; border-radius: 4px; }

/* Progress Bar */
.progress-container { margin: 12px 0; }
.progress-label { font-size: 14px; margin-bottom: 8px; display: flex; justify-content: space-between; }
.progress-bar {
  height: 8px;
  background: var(--toss-gray-100);
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Fintech Components - Payment */
.payment-card {
  background: var(--bg-primary);
  padding: 20px;
  margin: 8px 0;
}
.payment-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}
.payment-input-group {
  margin-bottom: 16px;
}
.payment-input-group label {
  display: block;
  font-size: 14px;
  color: var(--toss-gray-500);
  margin-bottom: 8px;
}
.payment-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}
.payment-amount-wrapper {
  position: relative;
}
.payment-amount-input {
  width: 100%;
  padding: 16px 40px 16px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 24px;
  font-weight: 700;
  text-align: right;
  background: var(--bg-secondary);
}
.payment-currency {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: var(--toss-gray-500);
}
.payment-quick-amounts {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.payment-quick-btn {
  flex: 1;
  padding: 10px;
  background: var(--toss-gray-50);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: var(--toss-gray-700);
  cursor: pointer;
}
.payment-quick-btn:active { background: var(--toss-gray-100); }
.payment-fee {
  font-size: 14px;
  color: var(--toss-gray-400);
  margin-bottom: 16px;
}
.payment-submit-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  cursor: pointer;
}
.payment-submit-btn:active { opacity: 0.9; transform: scale(0.98); }

/* Fintech Components - Account */
.account-card {
  background: var(--bg-primary);
  overflow: hidden;
  margin: 8px 0;
}
.account-header {
  padding: 16px;
  color: white;
}
.account-header h3 {
  font-size: 18px;
  font-weight: 700;
}
.account-header p {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 4px;
}
.account-content {
  padding: 16px;
}
.account-banks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.account-bank-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: var(--bg-secondary);
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.account-bank-btn:active { background: var(--toss-gray-100); }
.account-bank-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
}
.account-bank-btn span {
  font-size: 12px;
  color: var(--toss-gray-600);
}
.account-input-group {
  margin-bottom: 16px;
}
.account-input-group label {
  display: block;
  font-size: 14px;
  color: var(--toss-gray-500);
  margin-bottom: 8px;
}
.account-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  background: var(--bg-secondary);
}
.account-submit-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  cursor: pointer;
}
.account-notice {
  text-align: center;
  font-size: 12px;
  color: var(--toss-gray-400);
  margin-top: 12px;
}

/* Fintech Components - Credit Score */
.credit-card {
  background: var(--bg-primary);
  padding: 24px;
  margin: 8px 0;
}
.credit-gauge {
  position: relative;
  width: 192px;
  height: 192px;
  margin: 0 auto 16px;
}
.credit-gauge svg {
  width: 100%;
  height: 100%;
}
.credit-gauge-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.credit-score {
  font-size: 36px;
  font-weight: 700;
}
.credit-max {
  font-size: 14px;
  color: var(--toss-gray-400);
}
.credit-grade {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: fit-content;
}
.credit-grade span:nth-child(2) {
  opacity: 0.5;
}
.credit-details {
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
  margin-top: 16px;
}
.credit-detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 8px;
}
.credit-detail-row span:first-child {
  color: var(--toss-gray-500);
}
.credit-tip {
  display: flex;
  gap: 12px;
  background: #EBF4FF;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}
.credit-tip > span {
  font-size: 20px;
}
.credit-tip-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--toss-gray-800);
}
.credit-tip-desc {
  font-size: 12px;
  color: var(--toss-gray-500);
  margin-top: 4px;
}

/* Fintech Components - Product Compare */
.product-compare {
  background: var(--bg-primary);
  padding: 16px;
  margin: 8px 0;
}
.product-compare-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}
.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.product-list.horizontal {
  flex-direction: row;
  overflow-x: auto;
  padding-bottom: 8px;
}
.product-list.horizontal .product-card {
  min-width: 280px;
  flex-shrink: 0;
}
.product-card {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 16px;
  background: var(--bg-primary);
}
.product-card.recommended {
  background: #EBF4FF;
}
.product-recommend-tag {
  position: absolute;
  top: -8px;
  left: 16px;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  color: white;
}
.product-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.product-name {
  font-weight: 700;
}
.product-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}
.product-rate {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}
.product-benefit {
  font-size: 14px;
  color: var(--toss-gray-600);
  margin-bottom: 8px;
}
.product-desc {
  font-size: 12px;
  color: var(--toss-gray-400);
}
.product-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  margin-top: 16px;
  cursor: pointer;
  background: var(--toss-gray-100);
  color: var(--toss-gray-700);
}
.product-btn.primary {
  color: white;
}
.product-notice {
  text-align: center;
  font-size: 12px;
  color: var(--toss-gray-400);
  margin-top: 16px;
}

/* Fintech Components - Transaction List */
.tx-list {
  background: var(--bg-primary);
  margin: 8px 0;
}
.tx-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}
.tx-header h3 {
  font-weight: 700;
}
.tx-view-all {
  font-size: 14px;
  color: var(--toss-gray-400);
  background: none;
  border: none;
  cursor: pointer;
}
.tx-items {
  
}
.tx-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--toss-gray-50);
}
.tx-item:last-child {
  border-bottom: none;
}
.tx-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.tx-content {
  flex: 1;
  min-width: 0;
}
.tx-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tx-title {
  font-weight: 500;
}
.tx-category {
  padding: 2px 8px;
  background: var(--toss-gray-100);
  border-radius: 10px;
  font-size: 12px;
  color: var(--toss-gray-500);
}
.tx-subtitle-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}
.tx-subtitle {
  font-size: 13px;
  color: var(--toss-gray-400);
}
.tx-date {
  font-size: 13px;
  color: var(--toss-gray-300);
}
.tx-amount {
  font-weight: 700;
  flex-shrink: 0;
}
.tx-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
}
.tx-more-btn {
  width: 100%;
  padding: 12px;
  background: var(--bg-secondary);
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--toss-gray-600);
  cursor: pointer;
}

/* Quiz/Test Components */
.quiz-intro {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 70vh;
  justify-content: center;
}
.quiz-intro-emoji {
  line-height: 1;
  margin-bottom: 8px;
}
.quiz-intro-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--toss-gray-900);
  margin: 0;
  line-height: 1.3;
}
.quiz-intro-subtitle {
  font-size: 16px;
  color: var(--toss-gray-600);
  margin: 0;
  line-height: 1.6;
}
.quiz-intro-btn {
  margin-top: 16px;
  width: 100%;
  max-width: 280px;
  padding: 16px 24px;
  font-size: 17px;
  font-weight: 700;
  color: white;
  background: var(--toss-blue);
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.quiz-intro-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.quiz-question {
  padding: 24px 20px;
}
.quiz-progress {
  margin-bottom: 24px;
}
.quiz-progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--toss-gray-500);
}
.quiz-progress-bar {
  width: 100%;
  height: 6px;
  background: var(--toss-gray-100);
  border-radius: 3px;
  overflow: hidden;
}
.quiz-progress-fill {
  height: 100%;
  background: var(--toss-blue);
  border-radius: 3px;
  transition: width 0.3s ease;
}
.quiz-question-text {
  font-size: 22px;
  font-weight: 700;
  color: var(--toss-gray-900);
  line-height: 1.4;
  margin-bottom: 32px;
  text-align: center;
}
.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.quiz-option {
  width: 100%;
  padding: 18px 20px;
  font-size: 16px;
  font-weight: 500;
  color: var(--toss-gray-800);
  background: var(--toss-gray-50);
  border: 1px solid var(--toss-gray-200);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}
.quiz-option:active {
  background: var(--toss-blue);
  color: white;
  border-color: var(--toss-blue);
  transform: scale(0.98);
}
.quiz-option.selected {
  background: var(--toss-blue);
  color: white;
  border-color: var(--toss-blue);
}

.quiz-result {
  border-radius: 20px;
  overflow: hidden;
  margin: 8px;
  background: var(--bg-primary);
}
.quiz-result-header {
  padding: 32px 24px;
  text-align: center;
  color: white;
}
.quiz-result-emoji {
  font-size: 64px;
  margin-bottom: 16px;
}
.quiz-result-code {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}
.quiz-result-type {
  font-size: 24px;
  font-weight: 700;
  margin: 8px 0 0;
}
.quiz-result-content {
  padding: 24px 20px;
}
.quiz-result-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--toss-gray-900);
  margin-bottom: 12px;
  line-height: 1.4;
}
.quiz-result-desc {
  font-size: 15px;
  color: var(--toss-gray-700);
  line-height: 1.7;
  margin-bottom: 24px;
}
.quiz-result-traits {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}
.quiz-trait {
  padding: 16px;
  border-radius: 12px;
}
.quiz-strengths {
  background: #ECFDF5;
}
.quiz-strengths h3 {
  font-size: 14px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 12px;
}
.quiz-strengths li {
  font-size: 13px;
  color: #065F46;
  padding: 4px 0;
  list-style: none;
}
.quiz-weaknesses {
  background: #FEF3F2;
}
.quiz-weaknesses h3 {
  font-size: 14px;
  font-weight: 700;
  color: #DC2626;
  margin-bottom: 12px;
}
.quiz-weaknesses li {
  font-size: 13px;
  color: #991B1B;
  padding: 4px 0;
  list-style: none;
}
.quiz-trait ul {
  padding: 0;
  margin: 0;
}
.quiz-tip {
  padding: 16px;
  background: var(--toss-blue-light, #E8F3FF);
  border-radius: 12px;
  margin-bottom: 24px;
}
.quiz-tip h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--toss-blue);
  margin-bottom: 8px;
}
.quiz-tip p {
  font-size: 14px;
  color: var(--toss-gray-700);
  line-height: 1.6;
  margin: 0;
}
.quiz-result-buttons {
  display: flex;
  gap: 12px;
}
.quiz-btn-retry {
  flex: 1;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 600;
  color: var(--toss-gray-700);
  background: var(--toss-gray-100);
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.quiz-btn-retry:active {
  opacity: 0.8;
}
.quiz-btn-share {
  flex: 1;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.quiz-btn-share:active {
  opacity: 0.9;
}
`;

// 앱인토스 SDK 스텁 + bridge API
const getAppintossSDK = () => `
// Appintoss Web Framework SDK Stub
window.AppintossSDK = {
  isAppintoss: function() {
    return window.parent !== window || navigator.userAgent.includes('Toss');
  },
  
  bridge: {
    // 뒤로가기
    goBack: function() {
      if (window.AppintossSDK.isAppintoss()) {
        window.parent.postMessage({ type: 'APPINTOSS_GO_BACK' }, '*');
      } else {
        history.back();
      }
    },
    
    // 토스페이 결제
    pay: function(options) {
      return new Promise(function(resolve, reject) {
        if (window.AppintossSDK.isAppintoss()) {
          var callbackId = 'pay_' + Date.now();
          window.__appintossCallbacks = window.__appintossCallbacks || {};
          window.__appintossCallbacks[callbackId] = { resolve: resolve, reject: reject };
          window.parent.postMessage({
            type: 'APPINTOSS_PAY',
            payload: options,
            callbackId: callbackId
          }, '*');
        } else {
          console.log('[Appintoss SDK] 결제 요청:', options);
          resolve({ success: true, orderId: options.orderId });
        }
      });
    },
    
    // 토스트 메시지
    toast: function(message, duration) {
      duration = duration || 2000;
      if (window.AppintossSDK.isAppintoss()) {
        window.parent.postMessage({ type: 'APPINTOSS_TOAST', payload: { message: message, duration: duration } }, '*');
      } else {
        showToast(message, duration);
      }
    },
    
    // 사용자 정보 가져오기
    getUser: function() {
      return new Promise(function(resolve) {
        if (window.AppintossSDK.isAppintoss()) {
          var callbackId = 'user_' + Date.now();
          window.__appintossCallbacks = window.__appintossCallbacks || {};
          window.__appintossCallbacks[callbackId] = { resolve: resolve };
          window.parent.postMessage({ type: 'APPINTOSS_GET_USER', callbackId: callbackId }, '*');
        } else {
          resolve({ id: 'test_user', name: '테스트 사용자' });
        }
      });
    },
    
    // 공유하기
    share: function(options) {
      if (navigator.share) {
        return navigator.share(options);
      } else {
        console.log('[Appintoss SDK] 공유:', options);
        return Promise.resolve();
      }
    },
    
    // 링크 열기
    openLink: function(url) {
      if (window.AppintossSDK.isAppintoss()) {
        window.parent.postMessage({ type: 'APPINTOSS_OPEN_LINK', payload: { url: url } }, '*');
      } else {
        window.open(url, '_blank');
      }
    },
    
    // 푸시 알림 권한 요청
    requestPushPermission: function() {
      return new Promise(function(resolve) {
        if ('Notification' in window) {
          Notification.requestPermission().then(resolve);
        } else {
          resolve('denied');
        }
      });
    },
    
    // 클립보드 복사
    copyToClipboard: function(text) {
      return navigator.clipboard.writeText(text).then(function() {
        window.AppintossSDK.bridge.toast('복사되었습니다!');
      });
    },
    
    // 페이지 이동 (다중 페이지용)
    navigateTo: function(pageId) {
      var event = new CustomEvent('appintoss:navigate', { detail: { pageId: pageId } });
      document.dispatchEvent(event);
    }
  }
};

// 토스트 UI 함수
function showToast(message, duration) {
  duration = duration || 2000;
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  
  requestAnimationFrame(function() {
    toast.classList.add('show');
  });
  
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

// 메시지 리스너 (앱인토스 콜백용)
window.addEventListener('message', function(event) {
  var data = event.data;
  if (data && data.type && data.type.startsWith('APPINTOSS_CALLBACK_')) {
    var callbackId = data.callbackId;
    var callback = window.__appintossCallbacks && window.__appintossCallbacks[callbackId];
    if (callback) {
      if (data.error) {
        callback.reject && callback.reject(data.error);
      } else {
        callback.resolve && callback.resolve(data.result);
      }
      delete window.__appintossCallbacks[callbackId];
    }
  }
});

// 글로벌 alias
var bridge = window.AppintossSDK.bridge;
`;

// 컴포넌트별 HTML 렌더러
function renderComponent(node: NodeData, nodes: NodesMap, nodeId: string): string {
  const { type, props } = node;
  const name = type?.resolvedName;
  
  // 자식 노드 렌더링
  const childIds = [...(node.nodes || []), ...Object.values(node.linkedNodes || {})];
  const childrenHtml = childIds.map(id => {
    const childNode = nodes[id];
    return childNode ? renderComponent(childNode, nodes, id) : '';
  }).join('');

  switch (name) {
    case 'HeaderComponent': {
      const text = escapeHtml(String(props.text || '헤더'));
      const level = props.level || 'h2';
      return `<div class="header-${level}">${text}</div>${childrenHtml}`;
    }
    
    case 'TextComponent': {
      const text = escapeHtml(String(props.text || ''));
      const fontSize = props.fontSize || 16;
      const fontWeight = props.fontWeight || 'normal';
      const color = props.color || 'var(--text-primary)';
      const textAlign = props.textAlign || 'left';
      return `<div class="text-block" style="font-size:${fontSize}px;font-weight:${fontWeight};color:${color};text-align:${textAlign}">${text}</div>${childrenHtml}`;
    }
    
    case 'ButtonComponent': {
      const text = escapeHtml(String(props.text || '버튼'));
      const bgColor = props.bgColor || 'var(--toss-blue)';
      const textColor = props.textColor || '#FFFFFF';
      const size = props.size || 'md';
      const fullWidth = props.fullWidth !== false;
      const action = props.action || '';
      const actionValue = props.actionValue || '';
      
      let onclick = '';
      if (action === 'link') {
        onclick = `onclick="bridge.openLink('${escapeHtml(String(actionValue))}')"`;
      } else if (action === 'pay') {
        onclick = `onclick="bridge.pay({amount:${actionValue || 1000},orderId:'order_'+Date.now()})"`;
      } else if (action === 'share') {
        onclick = `onclick="bridge.share({title:'공유하기',url:location.href})"`;
      } else if (action === 'toast') {
        onclick = `onclick="bridge.toast('${escapeHtml(String(actionValue || '알림'))}')"`;
      } else if (action === 'back') {
        onclick = `onclick="bridge.goBack()"`;
      } else if (action === 'navigate') {
        onclick = `onclick="bridge.navigateTo('${escapeHtml(String(actionValue))}')"`;
      } else if (action === 'bottomSheet') {
        onclick = `onclick="openBottomSheet('${escapeHtml(String(actionValue))}')"`;
      }
      
      return `<div style="padding:8px 0"><button class="btn btn-${size}${fullWidth ? ' btn-full' : ''}" style="background:${bgColor};color:${textColor}" ${onclick}>${text}</button></div>${childrenHtml}`;
    }
    
    case 'ImageComponent': {
      const src = props.src || 'https://placehold.co/600x300/E5E8EB/8B95A1?text=Image';
      const alt = escapeHtml(String(props.alt || '이미지'));
      const borderRadius = props.borderRadius || 0;
      return `<div class="image-block"><img src="${src}" alt="${alt}" style="border-radius:${borderRadius}px" loading="lazy"></div>${childrenHtml}`;
    }
    
    case 'CardComponent': {
      const title = escapeHtml(String(props.title || '카드 제목'));
      const description = escapeHtml(String(props.description || ''));
      const showImage = props.showImage !== false;
      const imageEmoji = props.imageEmoji || '📷';
      
      return `<div class="card">
        ${showImage ? `<div class="card-image">${imageEmoji}</div>` : ''}
        <div class="card-content">
          <div class="card-title">${title}</div>
          <div class="card-desc">${description}</div>
        </div>
      </div>${childrenHtml}`;
    }
    
    case 'ListComponent': {
      const items = (props.items as string[]) || ['항목 1', '항목 2', '항목 3'];
      const showIcon = props.showIcon !== false;
      const icon = props.icon || '📌';
      
      const itemsHtml = items.map(item => `
        <div class="list-item">
          ${showIcon ? `<div class="list-icon">${icon}</div>` : ''}
          <span class="list-text">${escapeHtml(String(item))}</span>
          <span class="list-arrow">›</span>
        </div>
      `).join('');
      
      return `<div class="list-container">${itemsHtml}</div>${childrenHtml}`;
    }
    
    case 'DividerComponent': {
      return `<hr class="divider">${childrenHtml}`;
    }
    
    case 'InputComponent': {
      const label = props.label ? escapeHtml(String(props.label)) : '';
      const placeholder = escapeHtml(String(props.placeholder || ''));
      const inputType = props.type || 'text';
      const name = props.name || `input_${nodeId}`;
      const required = props.required ? 'required' : '';
      
      return `<div class="input-group">
        ${label ? `<label class="input-label">${label}</label>` : ''}
        <input type="${inputType}" class="input-field" placeholder="${placeholder}" name="${name}" ${required}>
      </div>${childrenHtml}`;
    }
    
    case 'BottomSheetComponent': {
      const sheetId = props.sheetId || `sheet_${nodeId}`;
      const title = escapeHtml(String(props.title || ''));
      const content = escapeHtml(String(props.content || ''));
      
      return `
        <div class="bottom-sheet-overlay" id="${sheetId}_overlay" onclick="closeBottomSheet('${sheetId}')"></div>
        <div class="bottom-sheet" id="${sheetId}">
          <div class="bottom-sheet-handle"></div>
          ${title ? `<div class="bottom-sheet-title">${title}</div>` : ''}
          <div class="bottom-sheet-content">${content}</div>
        </div>
      ${childrenHtml}`;
    }
    
    case 'TabBarComponent': {
      const tabs = (props.tabs as Array<{icon: string; label: string; pageId?: string}>) || [
        { icon: '🏠', label: '홈' },
        { icon: '🔍', label: '검색' },
        { icon: '👤', label: '마이' }
      ];
      
      const tabsHtml = tabs.map((tab, i) => `
        <button class="tab-item${i === 0 ? ' active' : ''}" data-page="${tab.pageId || ''}" onclick="handleTabClick(this, '${tab.pageId || ''}')">
          <span class="tab-icon">${tab.icon}</span>
          <span class="tab-label">${escapeHtml(tab.label)}</span>
        </button>
      `).join('');
      
      return `<nav class="tab-bar">${tabsHtml}</nav>${childrenHtml}`;
    }
    
    case 'ToastComponent': {
      // Toast는 버튼 액션으로 트리거됨, 여기서는 컨테이너만
      return `${childrenHtml}`;
    }
    
    case 'BadgeComponent': {
      const count = props.count || 0;
      const bgColor = props.bgColor || '#FF4757';
      const maxCount = props.maxCount || 99;
      const displayCount = count > maxCount ? `${maxCount}+` : count;
      
      return `<span class="badge" style="background:${bgColor}">${displayCount}</span>${childrenHtml}`;
    }
    
    case 'CarouselComponent': {
      const images = (props.images as string[]) || [
        'https://placehold.co/600x300/3182F6/FFFFFF?text=Slide+1',
        'https://placehold.co/600x300/1B64DA/FFFFFF?text=Slide+2',
        'https://placehold.co/600x300/0050B3/FFFFFF?text=Slide+3'
      ];
      const autoPlay = props.autoPlay !== false;
      const interval = props.interval || 3000;
      const carouselId = `carousel_${nodeId}`;
      
      const slidesHtml = images.map((src, i) => `
        <div class="carousel-slide">
          <img src="${src}" alt="슬라이드 ${i + 1}" loading="lazy">
        </div>
      `).join('');
      
      const dotsHtml = images.map((_, i) => `
        <button class="carousel-dot${i === 0 ? ' active' : ''}" onclick="goToSlide('${carouselId}', ${i})"></button>
      `).join('');
      
      return `<div class="carousel" id="${carouselId}" data-autoplay="${autoPlay}" data-interval="${interval}">
        <div class="carousel-track">${slidesHtml}</div>
        <div class="carousel-dots">${dotsHtml}</div>
      </div>${childrenHtml}`;
    }
    
    case 'ProgressBarComponent': {
      const value = Number(props.value) || 0;
      const max = Number(props.max) || 100;
      const label = props.label ? escapeHtml(String(props.label)) : '';
      const showPercent = props.showPercent !== false;
      const barColor = props.barColor || 'var(--toss-blue)';
      const percent = Math.round((value / max) * 100);
      
      return `<div class="progress-container">
        ${label || showPercent ? `<div class="progress-label">
          <span>${label}</span>
          ${showPercent ? `<span>${percent}%</span>` : ''}
        </div>` : ''}
        <div class="progress-bar">
          <div class="progress-fill" style="width:${percent}%;background:${barColor}"></div>
        </div>
      </div>${childrenHtml}`;
    }
    
    case 'SpacerComponent': {
      const height = props.height || 16;
      return `<div style="height:${height}px"></div>${childrenHtml}`;
    }
    
    // 핀테크 컴포넌트
    case 'PaymentComponent': {
      const title = escapeHtml(String(props.title || '송금하기'));
      const recipientLabel = escapeHtml(String(props.recipientLabel || '받는 분'));
      const recipientPlaceholder = escapeHtml(String(props.recipientPlaceholder || '이름 또는 계좌번호'));
      const buttonText = escapeHtml(String(props.buttonText || '송금하기'));
      const buttonColor = props.buttonColor || '#3182F6';
      const showQuickAmounts = props.showQuickAmounts !== false;
      const quickAmounts = (props.quickAmounts as number[]) || [10000, 50000, 100000, 500000];
      const showFee = props.showFee;
      const feeAmount = Number(props.feeAmount) || 0;
      const borderRadius = props.borderRadius || 16;
      
      const quickAmountsHtml = showQuickAmounts ? `
        <div class="payment-quick-amounts">
          ${quickAmounts.map(amt => `<button class="payment-quick-btn" onclick="addAmount(${amt})">+${(amt/10000).toFixed(0)}만</button>`).join('')}
        </div>
      ` : '';
      
      return `<div class="payment-card" style="border-radius:${borderRadius}px">
        <h3 class="payment-title">${title}</h3>
        <div class="payment-input-group">
          <label>${recipientLabel}</label>
          <input type="text" placeholder="${recipientPlaceholder}" class="payment-input">
        </div>
        <div class="payment-input-group">
          <label>금액</label>
          <div class="payment-amount-wrapper">
            <input type="text" id="paymentAmount" placeholder="0" class="payment-amount-input" inputmode="numeric">
            <span class="payment-currency">원</span>
          </div>
        </div>
        ${quickAmountsHtml}
        ${showFee && feeAmount > 0 ? `<p class="payment-fee">수수료: ${feeAmount.toLocaleString()}원</p>` : ''}
        <button class="payment-submit-btn" style="background:${buttonColor}" onclick="handlePayment()">${buttonText}</button>
      </div>${childrenHtml}`;
    }
    
    case 'AccountComponent': {
      const title = escapeHtml(String(props.title || '계좌 연결'));
      const description = escapeHtml(String(props.description || '간편하게 계좌를 연결하세요'));
      const buttonText = escapeHtml(String(props.buttonText || '연결하기'));
      const buttonColor = props.buttonColor || '#3182F6';
      const showBankLogos = props.showBankLogos !== false;
      const borderRadius = props.borderRadius || 16;
      
      const banks = [
        { code: '092', name: '토스', color: '#3182F6' },
        { code: '088', name: '신한', color: '#0046FF' },
        { code: '004', name: '국민', color: '#FFBC00' },
        { code: '020', name: '우리', color: '#0066B3' },
        { code: '003', name: '기업', color: '#004EA2' },
        { code: '011', name: '농협', color: '#00AB4E' },
        { code: '090', name: '카카오', color: '#FFE600' },
        { code: '089', name: '케이', color: '#FFB800' },
      ];
      
      const banksHtml = showBankLogos ? `
        <div class="account-banks">
          ${banks.map(b => `<button class="account-bank-btn" onclick="selectBank('${b.code}')">
            <div class="account-bank-icon" style="background:${b.color}">${b.name.charAt(0)}</div>
            <span>${b.name}</span>
          </button>`).join('')}
        </div>
      ` : '';
      
      return `<div class="account-card" style="border-radius:${borderRadius}px">
        <div class="account-header" style="background:linear-gradient(135deg,${buttonColor},${buttonColor}dd)">
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
        <div class="account-content">
          ${banksHtml}
          <div class="account-input-group">
            <label>계좌번호</label>
            <input type="text" placeholder="계좌번호를 입력하세요" class="account-input">
          </div>
          <button class="account-submit-btn" style="background:${buttonColor}">${buttonText}</button>
          <p class="account-notice">계좌 연결 시 본인인증이 필요합니다</p>
        </div>
      </div>${childrenHtml}`;
    }
    
    case 'CreditScoreComponent': {
      const score = Number(props.score) || 850;
      const maxScore = Number(props.maxScore) || 1000;
      const showGauge = props.showGauge !== false;
      const showDetails = props.showDetails !== false;
      const lastUpdated = escapeHtml(String(props.lastUpdated || '2024.02.12'));
      const borderRadius = props.borderRadius || 20;
      
      // 등급 계산
      let grade = '1등급', gradeDesc = '최우수', gradeColor = '#3182F6';
      if (score >= 900) { grade = '1등급'; gradeDesc = '최우수'; gradeColor = '#3182F6'; }
      else if (score >= 800) { grade = '2등급'; gradeDesc = '우수'; gradeColor = '#36B37E'; }
      else if (score >= 700) { grade = '3등급'; gradeDesc = '양호'; gradeColor = '#6554C0'; }
      else if (score >= 600) { grade = '4등급'; gradeDesc = '보통'; gradeColor = '#FFAB00'; }
      else if (score >= 500) { grade = '5등급'; gradeDesc = '관리 필요'; gradeColor = '#FF8B00'; }
      else { grade = '6등급'; gradeDesc = '주의'; gradeColor = '#FF5630'; }
      
      if (props.gaugeColor) gradeColor = String(props.gaugeColor);
      
      const percentage = (score / maxScore) * 100;
      const circumference = 2 * Math.PI * 80;
      const strokeDashoffset = circumference - (percentage / 100) * circumference;
      
      const gaugeHtml = showGauge ? `
        <div class="credit-gauge">
          <svg viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" fill="none" stroke="#F2F4F6" stroke-width="12"/>
            <circle cx="90" cy="90" r="80" fill="none" stroke="${gradeColor}" stroke-width="12" stroke-linecap="round" 
              stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" transform="rotate(-90 90 90)"/>
          </svg>
          <div class="credit-gauge-center">
            <span class="credit-score">${score}</span>
            <span class="credit-max">/ ${maxScore}</span>
          </div>
        </div>
      ` : '';
      
      const detailsHtml = showDetails ? `
        <div class="credit-details">
          <div class="credit-detail-row"><span>마지막 업데이트</span><span>${lastUpdated}</span></div>
          <div class="credit-detail-row"><span>조회 기관</span><span>NICE평가정보</span></div>
        </div>
      ` : '';
      
      return `<div class="credit-card" style="border-radius:${borderRadius}px">
        ${gaugeHtml}
        <div class="credit-grade" style="background:${gradeColor}">
          <span>${grade}</span><span>|</span><span>${gradeDesc}</span>
        </div>
        ${detailsHtml}
        <div class="credit-tip">
          <span>💡</span>
          <div>
            <p class="credit-tip-title">점수 올리는 방법</p>
            <p class="credit-tip-desc">정기적인 금융거래와 연체 없는 상환이 중요해요</p>
          </div>
        </div>
      </div>${childrenHtml}`;
    }
    
    case 'ProductCompareComponent': {
      const title = escapeHtml(String(props.title || '금융상품 비교'));
      const accentColor = props.accentColor || '#3182F6';
      const showBadge = props.showBadge !== false;
      const cardStyle = props.cardStyle || 'vertical';
      const borderRadius = props.borderRadius || 16;
      
      const products = (props.products as Array<{name: string; badge?: string; rate: string; benefit: string; description: string; recommended?: boolean}>) || [
        { name: '적금 플러스', badge: '인기', rate: '연 4.5%', benefit: '최대 50만원 캐시백', description: '자유적금 · 비대면 가입', recommended: true },
        { name: '정기예금', rate: '연 3.8%', benefit: '가입 즉시 이자 지급', description: '1년 만기 · 중도해지 가능' },
        { name: '파킹통장', badge: '신규', rate: '연 2.5%', benefit: '매일 이자 지급', description: '수시입출금 · 한도무제한' },
      ];
      
      const productsHtml = products.map(p => `
        <div class="product-card ${p.recommended ? 'recommended' : ''}" style="border-color:${p.recommended ? accentColor : '#E5E8EB'}">
          ${p.recommended ? `<div class="product-recommend-tag" style="background:${accentColor}">추천</div>` : ''}
          <div class="product-name-row">
            <span class="product-name">${escapeHtml(p.name)}</span>
            ${showBadge && p.badge ? `<span class="product-badge" style="background:${p.badge === '인기' ? '#FF6B6B' : accentColor}">${escapeHtml(p.badge)}</span>` : ''}
          </div>
          <div class="product-rate" style="color:${accentColor}">${escapeHtml(p.rate)}</div>
          <div class="product-benefit">🎁 ${escapeHtml(p.benefit)}</div>
          <p class="product-desc">${escapeHtml(p.description)}</p>
          <button class="product-btn ${p.recommended ? 'primary' : ''}" style="${p.recommended ? `background:${accentColor}` : ''}">${p.recommended ? '바로 가입하기' : '자세히 보기'}</button>
        </div>
      `).join('');
      
      return `<div class="product-compare" style="border-radius:${borderRadius}px">
        <h3 class="product-compare-title">${title}</h3>
        <div class="product-list ${cardStyle === 'horizontal' ? 'horizontal' : ''}">${productsHtml}</div>
        <p class="product-notice">* 금리는 변동될 수 있으며, 세전 기준입니다</p>
      </div>${childrenHtml}`;
    }
    
    case 'TransactionListComponent': {
      const title = escapeHtml(String(props.title || '거래내역'));
      const showDate = props.showDate !== false;
      const showCategory = props.showCategory !== false;
      const showIcon = props.showIcon !== false;
      const incomeColor = props.incomeColor || '#3182F6';
      const expenseColor = props.expenseColor || '#191F28';
      const borderRadius = props.borderRadius || 16;
      
      const transactions = (props.transactions as Array<{id: string; title: string; subtitle?: string; amount: number; date: string; type: 'income' | 'expense'; category?: string; icon?: string}>) || [
        { id: '1', title: '토스페이 충전', subtitle: '신한은행', amount: 500000, date: '02.12', type: 'income', category: '충전', icon: '💳' },
        { id: '2', title: '스타벅스', subtitle: '카드결제', amount: 6500, date: '02.12', type: 'expense', category: '카페', icon: '☕' },
        { id: '3', title: '월급', subtitle: '(주)회사', amount: 3500000, date: '02.10', type: 'income', category: '급여', icon: '💰' },
      ];
      
      const txHtml = transactions.map(tx => {
        const amountStr = tx.type === 'income' ? `+${tx.amount.toLocaleString()}` : `-${tx.amount.toLocaleString()}`;
        const amountColor = tx.type === 'income' ? incomeColor : expenseColor;
        return `<div class="tx-item">
          ${showIcon ? `<div class="tx-icon">${tx.icon || (tx.type === 'income' ? '📥' : '📤')}</div>` : ''}
          <div class="tx-content">
            <div class="tx-title-row">
              <span class="tx-title">${escapeHtml(tx.title)}</span>
              ${showCategory && tx.category ? `<span class="tx-category">${escapeHtml(tx.category)}</span>` : ''}
            </div>
            <div class="tx-subtitle-row">
              ${tx.subtitle ? `<span class="tx-subtitle">${escapeHtml(tx.subtitle)}</span>` : ''}
              ${showDate ? `<span class="tx-date">· ${tx.date}</span>` : ''}
            </div>
          </div>
          <div class="tx-amount" style="color:${amountColor}">${amountStr}원</div>
        </div>`;
      }).join('');
      
      return `<div class="tx-list" style="border-radius:${borderRadius}px">
        <div class="tx-header">
          <h3>${title}</h3>
          <button class="tx-view-all">전체보기 →</button>
        </div>
        <div class="tx-items">${txHtml}</div>
        <div class="tx-footer">
          <button class="tx-more-btn">더보기</button>
        </div>
      </div>${childrenHtml}`;
    }
    
    // 퀴즈/테스트 컴포넌트
    case 'QuizIntroComponent': {
      const title = escapeHtml(String(props.title || '나는 어떤 유형일까?'));
      const subtitle = escapeHtml(String(props.subtitle || '간단한 질문에 답하고\n나의 유형을 알아보세요')).replace(/\n/g, '<br>');
      const emoji = props.emoji || '🧠';
      const buttonText = escapeHtml(String(props.buttonText || '테스트 시작하기'));
      const nextPageId = props.nextPageId || '';
      const emojiSize = Number(props.emojiSize) || 80;
      
      const onclick = nextPageId 
        ? `onclick="quizStart(); bridge.navigateTo('${escapeHtml(String(nextPageId))}')"` 
        : `onclick="quizStart()"`;
      
      return `<div class="quiz-intro">
        <div class="quiz-intro-emoji" style="font-size:${emojiSize}px">${emoji}</div>
        <h1 class="quiz-intro-title">${title}</h1>
        <p class="quiz-intro-subtitle">${subtitle}</p>
        <button class="quiz-intro-btn" ${onclick}>${buttonText}</button>
      </div>${childrenHtml}`;
    }
    
    case 'QuizQuestionComponent': {
      const questionNumber = Number(props.questionNumber) || 1;
      const totalQuestions = Number(props.totalQuestions) || 5;
      const questionText = escapeHtml(String(props.questionText || '질문'));
      const showProgress = props.showProgress !== false;
      const options = (props.options as Array<{text: string; scoreKey: string; scoreValue: number; nextPageId?: string}>) || [];
      const progress = (questionNumber / totalQuestions) * 100;
      
      const progressHtml = showProgress ? `
        <div class="quiz-progress">
          <div class="quiz-progress-label">
            <span>Q${questionNumber}</span>
            <span>${questionNumber} / ${totalQuestions}</span>
          </div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width:${progress}%"></div>
          </div>
        </div>
      ` : '';
      
      const optionsHtml = options.map((opt) => {
        const optText = escapeHtml(opt.text);
        const nextPage = opt.nextPageId || '';
        return `<button class="quiz-option" onclick="selectAnswer('${escapeHtml(opt.scoreKey)}', ${opt.scoreValue}, '${escapeHtml(nextPage)}')">${optText}</button>`;
      }).join('');
      
      return `<div class="quiz-question" data-question="${questionNumber}">
        ${progressHtml}
        <h2 class="quiz-question-text">${questionText}</h2>
        <div class="quiz-options">${optionsHtml}</div>
      </div>${childrenHtml}`;
    }
    
    case 'QuizResultComponent': {
      const typeCode = escapeHtml(String(props.typeCode || 'INFP'));
      const typeName = escapeHtml(String(props.typeName || '유형명'));
      const emoji = props.emoji || '🦋';
      const title = escapeHtml(String(props.title || '당신의 유형'));
      const description = escapeHtml(String(props.description || ''));
      const strengths = (props.strengths as string[]) || [];
      const weaknesses = (props.weaknesses as string[]) || [];
      const tip = escapeHtml(String(props.tip || ''));
      const accentColor = props.accentColor || '#6366F1';
      const showShare = props.showShare !== false;
      const showRetry = props.showRetry !== false;
      const retryPageId = props.retryPageId || '';
      
      const strengthsHtml = strengths.map(s => `<li>• ${escapeHtml(s)}</li>`).join('');
      const weaknessesHtml = weaknesses.map(w => `<li>• ${escapeHtml(w)}</li>`).join('');
      
      const retryOnclick = retryPageId 
        ? `onclick="quizReset(); bridge.navigateTo('${escapeHtml(String(retryPageId))}')"` 
        : `onclick="quizReset(); location.reload()"`;
      
      return `<div class="quiz-result" data-type-code="${typeCode}">
        <div class="quiz-result-header" style="background:${accentColor}">
          <div class="quiz-result-emoji">${emoji}</div>
          <div class="quiz-result-code">${typeCode}</div>
          <h1 class="quiz-result-type">${typeName}</h1>
        </div>
        <div class="quiz-result-content">
          <h2 class="quiz-result-title">${title}</h2>
          <p class="quiz-result-desc">${description}</p>
          <div class="quiz-result-traits">
            <div class="quiz-trait quiz-strengths">
              <h3>💪 강점</h3>
              <ul>${strengthsHtml}</ul>
            </div>
            <div class="quiz-trait quiz-weaknesses">
              <h3>😅 약점</h3>
              <ul>${weaknessesHtml}</ul>
            </div>
          </div>
          ${tip ? `<div class="quiz-tip"><h3>💡 꿀팁</h3><p>${tip}</p></div>` : ''}
          <div class="quiz-result-buttons">
            ${showRetry ? `<button class="quiz-btn-retry" ${retryOnclick}>다시 하기</button>` : ''}
            ${showShare ? `<button class="quiz-btn-share" style="background:${accentColor}" onclick="shareResult()">공유하기 📤</button>` : ''}
          </div>
          <a href="https://appintoss-builder.vercel.app?ref=quiz" target="_blank" 
             style="display:block;text-align:center;margin-top:16px;font-size:13px;color:var(--toss-gray-400);text-decoration:none;">
            나도 만들어보기 →
          </a>
        </div>
      </div>${childrenHtml}`;
    }
    
    case 'GridComponent': {
      const columns = Number(props.columns) || 3;
      const gap = Number(props.gap) || 8;
      const items = (props.items as Array<{text: string; emoji?: string; bgColor?: string; onClick?: string}>) || [];
      const cellHeight = Number(props.cellHeight) || 80;
      const cellBorderRadius = Number(props.cellBorderRadius) || 12;
      const cellBgColor = props.cellBgColor || '#F2F4F6';
      const cellTextColor = props.cellTextColor || '#191F28';
      const fontSize = Number(props.fontSize) || 14;
      const selectable = !!props.selectable;
      const selectedBgColor = props.selectedBgColor || '#3182F6';
      const selectedTextColor = props.selectedTextColor || '#FFFFFF';
      const gridId = `grid_${nodeId}`;

      const cellsHtml = items.map((item, i) => {
        const bg = item.bgColor || cellBgColor;
        const onclick = selectable
          ? `onclick="toggleGridCell('${gridId}', ${i}, '${bg}', '${cellTextColor}', '${selectedBgColor}', '${selectedTextColor}')"`
          : item.onClick ? `onclick="${escapeHtml(String(item.onClick))}"` : '';
        return `<div class="grid-cell" id="${gridId}_${i}" style="height:${cellHeight}px;border-radius:${cellBorderRadius}px;background:${bg};color:${cellTextColor};font-size:${fontSize}px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:${selectable ? 'pointer' : 'default'};transition:all 0.2s ease;user-select:none;gap:4px" ${onclick}>
          ${item.emoji ? `<span style="font-size:${fontSize + 4}px">${item.emoji}</span>` : ''}
          <span style="font-weight:500">${escapeHtml(item.text)}</span>
        </div>`;
      }).join('');

      return `<div style="padding:8px 0">
        <div id="${gridId}" style="display:grid;grid-template-columns:repeat(${columns},1fr);gap:${gap}px">
          ${cellsHtml}
        </div>
      </div>${childrenHtml}`;
    }

    case 'Canvas':
    default:
      return `<div class="content-area">${childrenHtml}</div>`;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 인터랙션 스크립트
const getInteractionScript = () => `
// Bottom Sheet
function openBottomSheet(sheetId) {
  var sheet = document.getElementById(sheetId);
  var overlay = document.getElementById(sheetId + '_overlay');
  if (sheet) sheet.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeBottomSheet(sheetId) {
  var sheet = document.getElementById(sheetId);
  var overlay = document.getElementById(sheetId + '_overlay');
  if (sheet) sheet.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

// Tab Bar
function handleTabClick(tabEl, pageId) {
  document.querySelectorAll('.tab-item').forEach(function(t) {
    t.classList.remove('active');
  });
  tabEl.classList.add('active');
  if (pageId) {
    bridge.navigateTo(pageId);
  }
}

// Carousel
var carousels = {};

function initCarousels() {
  document.querySelectorAll('.carousel').forEach(function(carousel) {
    var id = carousel.id;
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var autoPlay = carousel.dataset.autoplay === 'true';
    var interval = parseInt(carousel.dataset.interval) || 3000;
    
    carousels[id] = {
      current: 0,
      total: slides.length,
      track: track,
      dots: dots,
      interval: null
    };
    
    if (autoPlay && slides.length > 1) {
      carousels[id].interval = setInterval(function() {
        goToSlide(id, (carousels[id].current + 1) % carousels[id].total);
      }, interval);
    }
    
    // Touch support
    var startX = 0;
    var isDragging = false;
    
    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    carousel.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(id, Math.min(carousels[id].current + 1, carousels[id].total - 1));
        } else {
          goToSlide(id, Math.max(carousels[id].current - 1, 0));
        }
      }
      isDragging = false;
    });
  });
}

function goToSlide(carouselId, index) {
  var c = carousels[carouselId];
  if (!c) return;
  c.current = index;
  c.track.style.transform = 'translateX(-' + (index * 100) + '%)';
  c.dots.forEach(function(dot, i) {
    dot.classList.toggle('active', i === index);
  });
}

// Page Navigation (다중 페이지용)
var pages = {};
var currentPageId = null;

function registerPage(pageId, content) {
  pages[pageId] = content;
}

function showPage(pageId) {
  var container = document.getElementById('app-content');
  if (pages[pageId] && container) {
    container.innerHTML = pages[pageId];
    currentPageId = pageId;
    initCarousels();
    window.scrollTo(0, 0);
  }
}

document.addEventListener('appintoss:navigate', function(e) {
  showPage(e.detail.pageId);
});

// Grid toggle
var gridSelected = {};
function toggleGridCell(gridId, index, defaultBg, defaultColor, selectedBg, selectedColor) {
  var key = gridId + '_' + index;
  var cell = document.getElementById(key);
  if (!cell) return;
  gridSelected[key] = !gridSelected[key];
  if (gridSelected[key]) {
    cell.style.background = selectedBg;
    cell.style.color = selectedColor;
  } else {
    cell.style.background = defaultBg;
    cell.style.color = defaultColor;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initCarousels();
});

// Fintech: Payment
var paymentAmount = 0;

function addAmount(amt) {
  paymentAmount += amt;
  var input = document.getElementById('paymentAmount');
  if (input) {
    input.value = paymentAmount.toLocaleString();
  }
}

function handlePayment() {
  if (paymentAmount <= 0) {
    bridge.toast('금액을 입력해주세요');
    return;
  }
  bridge.pay({
    amount: paymentAmount,
    orderId: 'payment_' + Date.now(),
    orderName: '송금'
  }).then(function(result) {
    bridge.toast('송금이 완료되었습니다!');
    paymentAmount = 0;
    var input = document.getElementById('paymentAmount');
    if (input) input.value = '';
  });
}

// Fintech: Account
var selectedBankCode = null;

function selectBank(code) {
  selectedBankCode = code;
  document.querySelectorAll('.account-bank-btn').forEach(function(btn) {
    btn.style.border = btn.querySelector('[onclick*="' + code + '"]') ? '2px solid var(--toss-blue)' : 'none';
  });
}

// Quiz/Test Logic
var quizScores = {};

function quizStart() {
  quizScores = {};
  console.log('[Quiz] Started');
}

function selectAnswer(scoreKey, scoreValue, nextPageId) {
  // 점수 누적
  if (!quizScores[scoreKey]) {
    quizScores[scoreKey] = 0;
  }
  quizScores[scoreKey] += scoreValue;
  console.log('[Quiz] Score:', scoreKey, '+', scoreValue, '| Total:', quizScores);
  
  // 선택 피드백 (선택한 버튼 하이라이트)
  var btn = event.target;
  btn.classList.add('selected');
  
  // 다음 페이지로 이동 (약간의 딜레이)
  if (nextPageId) {
    setTimeout(function() {
      bridge.navigateTo(nextPageId);
    }, 200);
  }
}

function quizReset() {
  quizScores = {};
  console.log('[Quiz] Reset');
}

function getQuizResult() {
  // 가장 높은 점수 키 찾기
  var maxKey = null;
  var maxScore = -Infinity;
  for (var key in quizScores) {
    if (quizScores[key] > maxScore) {
      maxScore = quizScores[key];
      maxKey = key;
    }
  }
  return { key: maxKey, score: maxScore, all: quizScores };
}

function shareResult() {
  var resultEl = document.querySelector('.quiz-result');
  var typeCode = resultEl ? resultEl.dataset.typeCode : '';
  var typeName = resultEl ? resultEl.querySelector('.quiz-result-type').textContent : '';
  
  var shareText = '나의 유형은 ' + typeCode + ' - ' + typeName + '!';
  
  if (navigator.share) {
    navigator.share({
      title: shareText,
      text: shareText + ' 나도 테스트 해보기 👇',
      url: location.href
    }).catch(function() {});
  } else {
    // 클립보드 복사 fallback
    navigator.clipboard.writeText(shareText + ' ' + location.href).then(function() {
      bridge.toast('링크가 복사되었습니다!');
    });
  }
}

// 퀴즈 결과 조건부 표시 (점수 기반)
function showResultByScore(scoreMapping) {
  // scoreMapping: { 'E': 'result_E', 'I': 'result_I', ... }
  var result = getQuizResult();
  if (result.key && scoreMapping[result.key]) {
    bridge.navigateTo(scoreMapping[result.key]);
  }
}
`;

export function generateHTML(json: string, options: GenerateOptions = {}): string {
  const { darkMode = false, projectName = '앱인토스 미니앱', tossMode = false } = options;
  
  let nodes: NodesMap;
  try {
    nodes = JSON.parse(json);
  } catch {
    return '<!-- Invalid JSON -->';
  }
  
  const contentHtml = renderComponent(nodes['ROOT'], nodes, 'ROOT');
  
  // Toss 모드용 viewport meta
  const viewportContent = tossMode 
    ? generateViewportMeta()
    : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  
  // Toss 모드용 추가 CSS
  const tossModeCSS = tossMode ? generateSafeAreaCSS() : '';
  
  // Toss 모드용 SDK 브릿지
  const tossModeScript = tossMode ? generateSDKBridgeScript() : '';
  
  // 컨테이너 클래스
  const containerClass = tossMode ? 'toss-app-container' : 'app-container';
  
  // Toss 모드 주석
  const tossModeComment = tossMode 
    ? `<!--
  ========================================
  🎯 Toss MiniApp 심사 대응 모드
  ========================================
  - Safe-area CSS 적용됨
  - Toss SDK 브릿지 포함
  - viewport-fit=cover 활성화
  ========================================
-->\n` 
    : '';
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="${viewportContent}">
  <meta name="theme-color" content="${darkMode ? '#111111' : '#FFFFFF'}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="${darkMode ? 'black-translucent' : 'default'}">
  <title>${escapeHtml(projectName)}</title>
  ${tossModeComment}<style>
    ${getTossStyles(darkMode)}
    ${getBaseStyles()}
    ${tossModeCSS}
  </style>
</head>
<body>
  <div class="${containerClass}" id="app-content">
    ${contentHtml}
  </div>
  
  <div class="toast-container"></div>
  
  <!-- Powered by 앱인토스 빌더 -->
  <a href="https://appintoss-builder.vercel.app" target="_blank" 
     style="position:fixed;bottom:8px;right:8px;background:#3182F6;color:white;
            padding:4px 8px;border-radius:12px;font-size:11px;text-decoration:none;
            opacity:0.7;z-index:9999;">
    ⚡ 앱인토스 빌더로 제작
  </a>
  
  <script>
    ${tossModeScript}
    ${getAppintossSDK()}
    ${getInteractionScript()}
  </script>
</body>
</html>`;
}

// 다중 페이지용 HTML 생성
export function generateMultiPageHTML(pages: Array<{ id: string; name: string; json: string }>, options: GenerateOptions = {}): string {
  const { darkMode = false, projectName = '앱인토스 미니앱', tossMode = false } = options;
  
  // 각 페이지의 콘텐츠를 미리 렌더링
  const pagesContent = pages.map(page => {
    let nodes: NodesMap;
    try {
      nodes = JSON.parse(page.json);
    } catch {
      return { id: page.id, content: '<!-- Invalid JSON -->' };
    }
    return {
      id: page.id,
      name: page.name,
      content: renderComponent(nodes['ROOT'], nodes, 'ROOT')
    };
  });
  
  const firstPage = pagesContent[0];
  const pagesScript = pagesContent.map(p => 
    `registerPage('${p.id}', ${JSON.stringify(p.content)});`
  ).join('\n  ');
  
  // Toss 모드용 viewport meta
  const viewportContent = tossMode 
    ? generateViewportMeta()
    : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
  
  // Toss 모드용 추가 CSS
  const tossModeCSS = tossMode ? generateSafeAreaCSS() : '';
  
  // Toss 모드용 SDK 브릿지
  const tossModeScript = tossMode ? generateSDKBridgeScript() : '';
  
  // 컨테이너 클래스
  const containerClass = tossMode ? 'toss-app-container' : 'app-container';
  
  // Toss 모드 주석
  const tossModeComment = tossMode 
    ? `<!--
  ========================================
  🎯 Toss MiniApp 심사 대응 모드
  ========================================
  - Safe-area CSS 적용됨
  - Toss SDK 브릿지 포함
  - viewport-fit=cover 활성화
  ========================================
-->\n` 
    : '';
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="${viewportContent}">
  <meta name="theme-color" content="${darkMode ? '#111111' : '#FFFFFF'}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="${darkMode ? 'black-translucent' : 'default'}">
  <title>${escapeHtml(projectName)}</title>
  ${tossModeComment}<style>
    ${getTossStyles(darkMode)}
    ${getBaseStyles()}
    ${tossModeCSS}
  </style>
</head>
<body>
  <div class="${containerClass}" id="app-content">
    ${firstPage?.content || ''}
  </div>
  
  <div class="toast-container"></div>
  
  <!-- Powered by 앱인토스 빌더 -->
  <a href="https://appintoss-builder.vercel.app" target="_blank" 
     style="position:fixed;bottom:8px;right:8px;background:#3182F6;color:white;
            padding:4px 8px;border-radius:12px;font-size:11px;text-decoration:none;
            opacity:0.7;z-index:9999;">
    ⚡ 앱인토스 빌더로 제작
  </a>
  
  <script>
    ${tossModeScript}
    ${getAppintossSDK()}
    ${getInteractionScript()}
    
    // Register all pages
    ${pagesScript}
    currentPageId = '${firstPage?.id || ''}';
  </script>
</body>
</html>`;
}
