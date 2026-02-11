/**
 * Appintoss HTML Generator
 * Craft.js JSON을 완전한 정적 HTML+CSS+JS로 변환
 */

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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initCarousels();
});
`;

export function generateHTML(json: string, options: GenerateOptions = {}): string {
  const { darkMode = false, projectName = '앱인토스 미니앱' } = options;
  
  let nodes: NodesMap;
  try {
    nodes = JSON.parse(json);
  } catch {
    return '<!-- Invalid JSON -->';
  }
  
  const contentHtml = renderComponent(nodes['ROOT'], nodes, 'ROOT');
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="${darkMode ? '#111111' : '#FFFFFF'}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="${darkMode ? 'black-translucent' : 'default'}">
  <title>${escapeHtml(projectName)}</title>
  <style>
    ${getTossStyles(darkMode)}
    ${getBaseStyles()}
  </style>
</head>
<body>
  <div class="app-container" id="app-content">
    ${contentHtml}
  </div>
  
  <div class="toast-container"></div>
  
  <script>
    ${getAppintossSDK()}
    ${getInteractionScript()}
  </script>
</body>
</html>`;
}

// 다중 페이지용 HTML 생성
export function generateMultiPageHTML(pages: Array<{ id: string; name: string; json: string }>, options: GenerateOptions = {}): string {
  const { darkMode = false, projectName = '앱인토스 미니앱' } = options;
  
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
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="${darkMode ? '#111111' : '#FFFFFF'}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="${darkMode ? 'black-translucent' : 'default'}">
  <title>${escapeHtml(projectName)}</title>
  <style>
    ${getTossStyles(darkMode)}
    ${getBaseStyles()}
  </style>
</head>
<body>
  <div class="app-container" id="app-content">
    ${firstPage?.content || ''}
  </div>
  
  <div class="toast-container"></div>
  
  <script>
    ${getAppintossSDK()}
    ${getInteractionScript()}
    
    // Register all pages
    ${pagesScript}
    currentPageId = '${firstPage?.id || ''}';
  </script>
</body>
</html>`;
}
