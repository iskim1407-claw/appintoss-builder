/**
 * 미니앱 SDK 프로젝트 Export Generator
 * Craft.js serialized JSON → 미니앱 SDK 프로젝트 파일들 생성
 */

interface NodeData {
  type: { resolvedName: string };
  props: Record<string, unknown>;
  nodes?: string[];
  linkedNodes?: Record<string, string>;
}

type NodesMap = Record<string, NodeData>;

// ── 프로젝트명 영문 변환 ──
function toEnglishName(name: string): string {
  return name
    .replace(/[가-힣]+/g, (match) => {
      const map: Record<string, string> = {
        '내': 'my', '미니앱': 'miniapp', '앱': 'app', '토스': 'toss',
        '홈': 'home', '결제': 'payment', '송금': 'transfer', '쇼핑': 'shopping',
      };
      return map[match] || 'app';
    })
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase() || 'my-miniapp';
}

// ── Craft.js JSON → JSX 변환 ──
function nodeToJSX(node: NodeData, nodes: NodesMap, indent: string): string {
  const { type, props } = node;
  const name = type?.resolvedName;

  const childIds = [...(node.nodes || []), ...Object.values(node.linkedNodes || {})];
  const childrenJSX = childIds
    .map(id => nodes[id] ? nodeToJSX(nodes[id], nodes, indent + '  ') : '')
    .filter(Boolean)
    .join('\n');

  switch (name) {
    case 'HeaderComponent': {
      const text = String(props.text || '헤더');
      const level = String(props.level || 'h2');
      const Tag = level === 'h1' ? 'h1' : level === 'h3' ? 'h3' : 'h2';
      return `${indent}<${Tag} style={{ fontSize: '${level === 'h1' ? '24' : level === 'h3' ? '18' : '20'}px', fontWeight: 700, padding: '${level === 'h1' ? '12' : level === 'h3' ? '8' : '10'}px 0' }}>${escapeJSX(text)}</${Tag}>`;
    }

    case 'TextComponent': {
      const text = String(props.text || '');
      const style: Record<string, string> = {};
      if (props.fontSize) style.fontSize = `${props.fontSize}px`;
      if (props.fontWeight) style.fontWeight = String(props.fontWeight);
      if (props.color) style.color = String(props.color);
      if (props.textAlign) style.textAlign = String(props.textAlign);
      const styleStr = Object.keys(style).length ? ` style={${JSON.stringify(style)}}` : '';
      return `${indent}<p${styleStr}>${escapeJSX(text)}</p>`;
    }

    case 'ButtonComponent': {
      const text = String(props.text || '버튼');
      const bgColor = String(props.bgColor || '#3182F6');
      const textColor = String(props.textColor || '#FFFFFF');
      const fullWidth = props.fullWidth !== false;
      const size = String(props.size || 'md');
      const pad = size === 'sm' ? '10px 16px' : size === 'lg' ? '18px 24px' : '14px 20px';
      const fs = size === 'sm' ? '14px' : size === 'lg' ? '18px' : '16px';
      return `${indent}<button style={{ background: '${bgColor}', color: '${textColor}', border: 'none', borderRadius: '12px', padding: '${pad}', fontSize: '${fs}', fontWeight: 600, cursor: 'pointer', width: ${fullWidth ? "'100%'" : "'auto'"} }}>${escapeJSX(text)}</button>`;
    }

    case 'ImageComponent': {
      const src = String(props.src || 'https://placehold.co/600x300/E5E8EB/8B95A1?text=Image');
      const alt = String(props.alt || '이미지');
      const br = Number(props.borderRadius) || 0;
      return `${indent}<div style={{ padding: '8px 0' }}>\n${indent}  <img src="${src}" alt="${escapeJSX(alt)}" style={{ width: '100%', borderRadius: '${br}px' }} />\n${indent}</div>`;
    }

    case 'CardComponent': {
      const title = String(props.title || '카드 제목');
      const desc = String(props.description || '');
      const showImage = props.showImage !== false;
      const emoji = String(props.imageEmoji || '📷');
      return `${indent}<div className="tds-card" style={{ borderRadius: '16px', border: '1px solid #E5E8EB', overflow: 'hidden', margin: '8px 0' }}>
${showImage ? `${indent}  <div style={{ height: '140px', background: 'linear-gradient(135deg, #F9FAFB, #F2F4F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>${emoji}</div>\n` : ''}${indent}  <div style={{ padding: '16px' }}>
${indent}    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>${escapeJSX(title)}</div>
${indent}    <div style={{ fontSize: '14px', color: '#8B95A1' }}>${escapeJSX(desc)}</div>
${indent}  </div>
${indent}</div>`;
    }

    case 'ListComponent': {
      const items = (props.items as string[]) || ['항목 1', '항목 2', '항목 3'];
      const icon = String(props.icon || '📌');
      const showIcon = props.showIcon !== false;
      const rows = items.map(item =>
        `${indent}  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 4px', borderBottom: '1px solid #E5E8EB' }}>
${showIcon ? `${indent}    <span>${icon}</span>\n` : ''}${indent}    <span style={{ flex: 1 }}>${escapeJSX(item)}</span>
${indent}    <span style={{ color: '#B0B8C1' }}>›</span>
${indent}  </div>`
      ).join('\n');
      return `${indent}<div style={{ margin: '8px 0' }}>\n${rows}\n${indent}</div>`;
    }

    case 'DividerComponent':
      return `${indent}<hr style={{ border: 'none', borderTop: '1px solid #E5E8EB', margin: '16px 0' }} />`;

    case 'SpacerComponent': {
      const h = Number(props.height) || 16;
      return `${indent}<div style={{ height: '${h}px' }} />`;
    }

    case 'NavigationComponent': {
      const title = String(props.title || '');
      return `${indent}<div style={{ height: '44px', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #E5E8EB' }}>
${indent}  <span>←</span>
${indent}  <span style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>${escapeJSX(title)}</span>
${indent}  <span>⋯</span>
${indent}</div>`;
    }

    case 'ListRowComponent': {
      const title = String(props.title || '');
      const subtitle = String(props.subtitle || '');
      const icon = String(props.icon || '');
      return `${indent}<div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
${icon ? `${indent}  <span style={{ fontSize: '24px' }}>${icon}</span>\n` : ''}${indent}  <div style={{ flex: 1 }}>
${indent}    <div style={{ fontWeight: 500 }}>${escapeJSX(title)}</div>
${subtitle ? `${indent}    <div style={{ fontSize: '13px', color: '#8B95A1', marginTop: '2px' }}>${escapeJSX(subtitle)}</div>\n` : ''}${indent}  </div>
${indent}  <span style={{ color: '#B0B8C1' }}>›</span>
${indent}</div>`;
    }

    case 'TabComponent': {
      const tabs = (props.tabs as string[]) || ['탭 1', '탭 2', '탭 3'];
      return `${indent}<div style={{ display: 'flex', borderBottom: '1px solid #E5E8EB' }}>
${tabs.map((t, i) => `${indent}  <button style={{ flex: 1, padding: '12px', border: 'none', background: 'none', fontWeight: ${i === 0 ? 600 : 400}, color: ${i === 0 ? "'#3182F6'" : "'#8B95A1'"}, borderBottom: ${i === 0 ? "'2px solid #3182F6'" : "'none'"} }}>${escapeJSX(t)}</button>`).join('\n')}
${indent}</div>`;
    }

    case 'TabBarComponent': {
      const tabs = (props.tabs as Array<{ icon: string; label: string }>) || [
        { icon: '🏠', label: '홈' }, { icon: '🔍', label: '검색' }, { icon: '👤', label: '마이' }
      ];
      return `${indent}<nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', background: 'white', borderTop: '1px solid #E5E8EB', paddingBottom: 'env(safe-area-inset-bottom)' }}>
${tabs.map((t, i) => `${indent}  <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 8px', gap: '4px', border: 'none', background: 'none', color: ${i === 0 ? "'#3182F6'" : "'#8B95A1'"} }}>
${indent}    <span style={{ fontSize: '22px' }}>${t.icon}</span>
${indent}    <span style={{ fontSize: '11px', fontWeight: 500 }}>${escapeJSX(t.label)}</span>
${indent}  </button>`).join('\n')}
${indent}</nav>`;
    }

    case 'TextFieldComponent':
    case 'InputComponent': {
      const label = String(props.label || '');
      const placeholder = String(props.placeholder || '');
      return `${indent}<div style={{ margin: '8px 0' }}>
${label ? `${indent}  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>${escapeJSX(label)}</label>\n` : ''}${indent}  <input type="${String(props.type || 'text')}" placeholder="${escapeJSX(placeholder)}" style={{ width: '100%', border: '1px solid #E5E8EB', borderRadius: '12px', padding: '14px 16px', fontSize: '15px', background: '#F9FAFB', outline: 'none' }} />
${indent}</div>`;
    }

    case 'SwitchComponent': {
      const label = String(props.label || '');
      const checked = Boolean(props.checked);
      return `${indent}<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
${indent}  <span>${escapeJSX(label)}</span>
${indent}  <input type="checkbox" defaultChecked={${checked}} style={{ width: '44px', height: '24px' }} />
${indent}</div>`;
    }

    case 'CheckboxComponent': {
      const label = String(props.label || '');
      const checked = Boolean(props.checked);
      return `${indent}<label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
${indent}  <input type="checkbox" defaultChecked={${checked}} />
${indent}  <span>${escapeJSX(label)}</span>
${indent}</label>`;
    }

    case 'ProgressBarComponent': {
      const value = Number(props.value) || 0;
      const max = Number(props.max) || 100;
      const label = String(props.label || '');
      const barColor = String(props.barColor || '#3182F6');
      const pct = Math.round((value / max) * 100);
      return `${indent}<div style={{ margin: '12px 0' }}>
${label ? `${indent}  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}><span>${escapeJSX(label)}</span><span>${pct}%</span></div>\n` : ''}${indent}  <div style={{ height: '8px', background: '#F2F4F6', borderRadius: '4px', overflow: 'hidden' }}>
${indent}    <div style={{ width: '${pct}%', height: '100%', background: '${barColor}', borderRadius: '4px' }} />
${indent}  </div>
${indent}</div>`;
    }

    case 'ToastComponent':
      return `${indent}{/* Toast - triggered via SDK bridge.toast() */}`;

    case 'DialogComponent': {
      const title = String(props.title || '알림');
      const message = String(props.message || '');
      return `${indent}{/* Dialog */}
${indent}<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
${indent}  <div style={{ background: 'white', borderRadius: '16px', padding: '24px', maxWidth: '300px', width: '100%', textAlign: 'center' }}>
${indent}    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>${escapeJSX(title)}</h3>
${indent}    <p style={{ fontSize: '14px', color: '#6B7684', marginBottom: '20px' }}>${escapeJSX(message)}</p>
${indent}    <button style={{ width: '100%', padding: '14px', background: '#3182F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600 }}>확인</button>
${indent}  </div>
${indent}</div>`;
    }

    case 'BottomCTAComponent': {
      const text = String(props.text || '확인');
      const bgColor = String(props.bgColor || '#3182F6');
      return `${indent}<div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', background: 'white', borderTop: '1px solid #E5E8EB' }}>
${indent}  <button style={{ width: '100%', padding: '16px', background: '${bgColor}', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>${escapeJSX(text)}</button>
${indent}</div>`;
    }

    case 'BottomSheetComponent': {
      const title = String(props.title || '');
      return `${indent}{/* BottomSheet */}
${indent}<div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '20px 20px 0 0', padding: '20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}>
${indent}  <div style={{ width: '40px', height: '4px', background: '#D1D6DB', borderRadius: '2px', margin: '0 auto 16px' }} />
${title ? `${indent}  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>${escapeJSX(title)}</h3>\n` : ''}${childrenJSX ? `${childrenJSX}\n` : ''}${indent}</div>`;
    }

    case 'PaymentComponent': {
      const title = String(props.title || '송금하기');
      const buttonText = String(props.buttonText || '송금하기');
      const buttonColor = String(props.buttonColor || '#3182F6');
      return `${indent}<div style={{ padding: '20px', margin: '8px 0' }}>
${indent}  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>${escapeJSX(title)}</h3>
${indent}  <div style={{ marginBottom: '16px' }}>
${indent}    <label style={{ display: 'block', fontSize: '14px', color: '#8B95A1', marginBottom: '8px' }}>받는 분</label>
${indent}    <input type="text" placeholder="이름 또는 계좌번호" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E8EB', borderRadius: '12px', fontSize: '15px' }} />
${indent}  </div>
${indent}  <div style={{ marginBottom: '16px' }}>
${indent}    <label style={{ display: 'block', fontSize: '14px', color: '#8B95A1', marginBottom: '8px' }}>금액</label>
${indent}    <input type="text" placeholder="0" inputMode="numeric" style={{ width: '100%', padding: '16px', border: '1px solid #E5E8EB', borderRadius: '12px', fontSize: '24px', fontWeight: 700, textAlign: 'right' }} />
${indent}  </div>
${indent}  <button style={{ width: '100%', padding: '16px', background: '${buttonColor}', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700 }}>${escapeJSX(buttonText)}</button>
${indent}</div>`;
    }

    case 'AccountComponent': {
      const title = String(props.title || '계좌 연결');
      const desc = String(props.description || '간편하게 계좌를 연결하세요');
      const buttonColor = String(props.buttonColor || '#3182F6');
      return `${indent}<div style={{ borderRadius: '16px', overflow: 'hidden', margin: '8px 0' }}>
${indent}  <div style={{ padding: '16px', background: 'linear-gradient(135deg, ${buttonColor}, ${buttonColor}dd)', color: 'white' }}>
${indent}    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>${escapeJSX(title)}</h3>
${indent}    <p style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>${escapeJSX(desc)}</p>
${indent}  </div>
${indent}  <div style={{ padding: '16px' }}>
${indent}    <input type="text" placeholder="계좌번호를 입력하세요" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E8EB', borderRadius: '12px', fontSize: '15px', marginBottom: '16px' }} />
${indent}    <button style={{ width: '100%', padding: '16px', background: '${buttonColor}', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700 }}>연결하기</button>
${indent}  </div>
${indent}</div>`;
    }

    case 'CreditScoreComponent': {
      const score = Number(props.score) || 850;
      const maxScore = Number(props.maxScore) || 1000;
      let grade = '1등급', gradeColor = '#3182F6';
      if (score >= 900) { grade = '1등급'; gradeColor = '#3182F6'; }
      else if (score >= 800) { grade = '2등급'; gradeColor = '#36B37E'; }
      else if (score >= 700) { grade = '3등급'; gradeColor = '#6554C0'; }
      else { grade = '4등급+'; gradeColor = '#FFAB00'; }
      return `${indent}<div style={{ padding: '24px', margin: '8px 0', textAlign: 'center' }}>
${indent}  <div style={{ fontSize: '48px', fontWeight: 700 }}>${score}</div>
${indent}  <div style={{ fontSize: '14px', color: '#B0B8C1' }}>/ ${maxScore}</div>
${indent}  <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '20px', background: '${gradeColor}', color: 'white', fontWeight: 700, marginTop: '12px' }}>${grade}</div>
${indent}</div>`;
    }

    case 'ProductCompareComponent': {
      const title = String(props.title || '금융상품 비교');
      const products = (props.products as Array<{ name: string; rate: string; benefit: string; recommended?: boolean }>) || [
        { name: '적금 플러스', rate: '연 4.5%', benefit: '최대 50만원 캐시백', recommended: true },
        { name: '정기예금', rate: '연 3.8%', benefit: '가입 즉시 이자 지급' },
      ];
      const accentColor = String(props.accentColor || '#3182F6');
      const cards = products.map((p, i) =>
        `${indent}    <div key={${i}} style={{ border: '1px solid ${p.recommended ? accentColor : '#E5E8EB'}', borderRadius: '16px', padding: '16px', ${p.recommended ? "background: '#EBF4FF'" : ''} }}>
${indent}      <div style={{ fontWeight: 700 }}>${escapeJSX(p.name)}</div>
${indent}      <div style={{ fontSize: '24px', fontWeight: 700, color: '${accentColor}', margin: '8px 0' }}>${escapeJSX(p.rate)}</div>
${indent}      <div style={{ fontSize: '14px', color: '#6B7684' }}>🎁 ${escapeJSX(p.benefit)}</div>
${indent}    </div>`
      ).join('\n');
      return `${indent}<div style={{ padding: '16px', margin: '8px 0' }}>
${indent}  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>${escapeJSX(title)}</h3>
${indent}  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
${cards}
${indent}  </div>
${indent}</div>`;
    }

    case 'TransactionListComponent': {
      const title = String(props.title || '거래내역');
      const txs = (props.transactions as Array<{ title: string; amount: number; type: string; date: string; icon?: string }>) || [
        { title: '토스페이 충전', amount: 500000, type: 'income', date: '02.12', icon: '💳' },
        { title: '스타벅스', amount: 6500, type: 'expense', date: '02.12', icon: '☕' },
      ];
      const rows = txs.map((tx, i) =>
        `${indent}    <div key={${i}} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid #F2F4F6' }}>
${indent}      <span style={{ fontSize: '18px' }}>${tx.icon || '📤'}</span>
${indent}      <div style={{ flex: 1 }}>
${indent}        <div style={{ fontWeight: 500 }}>${escapeJSX(tx.title)}</div>
${indent}        <div style={{ fontSize: '13px', color: '#B0B8C1' }}>${tx.date}</div>
${indent}      </div>
${indent}      <div style={{ fontWeight: 700, color: '${tx.type === 'income' ? '#3182F6' : '#191F28'}' }}>${tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}원</div>
${indent}    </div>`
      ).join('\n');
      return `${indent}<div style={{ margin: '8px 0' }}>
${indent}  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #E5E8EB' }}>
${indent}    <h3 style={{ fontWeight: 700 }}>${escapeJSX(title)}</h3>
${indent}    <span style={{ fontSize: '14px', color: '#B0B8C1' }}>전체보기 →</span>
${indent}  </div>
${rows}
${indent}</div>`;
    }

    case 'BadgeComponent': {
      const count = Number(props.count) || 0;
      const bgColor = String(props.bgColor || '#FF4757');
      return `${indent}<span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: 'white', background: '${bgColor}' }}>${count}</span>`;
    }

    case 'CarouselComponent': {
      const images = (props.images as string[]) || [
        'https://placehold.co/600x300/3182F6/FFFFFF?text=Slide+1',
        'https://placehold.co/600x300/1B64DA/FFFFFF?text=Slide+2',
      ];
      return `${indent}<div style={{ overflow: 'hidden', borderRadius: '12px', margin: '8px 0' }}>
${indent}  <div style={{ display: 'flex' }}>
${images.map((src, i) => `${indent}    <img key={${i}} src="${src}" alt="슬라이드 ${i + 1}" style={{ minWidth: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />`).join('\n')}
${indent}  </div>
${indent}</div>`;
    }

    case 'SkeletonComponent': {
      const width = String(props.width || '100%');
      const height = String(props.height || '20px');
      return `${indent}<div style={{ width: '${width}', height: '${height}', background: '#F2F4F6', borderRadius: '8px', animation: 'pulse 1.5s infinite' }} />`;
    }

    case 'Canvas':
    default:
      return childrenJSX ? `${indent}<div style={{ padding: '0 16px' }}>\n${childrenJSX}\n${indent}</div>` : '';
  }
}

function escapeJSX(text: string): string {
  return text.replace(/[{}<>&"]/g, (c) => {
    const map: Record<string, string> = { '{': '&#123;', '}': '&#125;', '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' };
    return map[c] || c;
  });
}

// ── 파일 생성 ──

function genPackageJson(appName: string, projectName: string): string {
  return JSON.stringify({
    name: appName,
    version: '1.0.0',
    description: `${projectName} - 미니앱`,
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    },
    dependencies: {
      '@apps-in-toss/web-framework': '^2.0.5',
      '@toss/tds-mobile': '^1.0.0',
      react: '^19.2.3',
      'react-dom': '^19.2.3',
    },
    devDependencies: {
      '@types/react': '^19.2.3',
      '@types/react-dom': '^19.2.3',
      '@vitejs/plugin-react': '^4.2.0',
      typescript: '^5.3.0',
      vite: '^5.0.0',
    },
  }, null, 2);
}

function genGraniteConfig(appName: string): string {
  return `import { defineConfig } from '@apps-in-toss/web-framework';

export default defineConfig({
  appName: '${appName}',
  brand: {
    primaryColor: '#3182F6',
  },
  build: {
    outDir: 'dist',
  },
});
`;
}

function genViteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
`;
}

function genTsConfig(): string {
  return JSON.stringify({
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noFallthroughCasesInSwitch: true,
    },
    include: ['src'],
    references: [{ path: './tsconfig.node.json' }],
  }, null, 2);
}

function genTsConfigNode(): string {
  return JSON.stringify({
    compilerOptions: {
      composite: true,
      skipLibCheck: true,
      module: 'ESNext',
      moduleResolution: 'bundler',
      allowSyntheticDefaultImports: true,
    },
    include: ['vite.config.ts'],
  }, null, 2);
}

function genIndexHtml(projectName: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#FFFFFF" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function genMainTsx(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
}

function genPoweredByBadge(): string {
  return `function PoweredByBadge() {
  return (
    <a
      href="https://appintoss-builder.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '8px',
        right: '8px',
        background: '#3182F6',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        textDecoration: 'none',
        opacity: 0.7,
        zIndex: 9999,
      }}
    >
      ⚡ 미니앱 빌더로 제작
    </a>
  );
}`;
}

function genAppTsx(json: string): string {
  let nodes: NodesMap;
  try {
    nodes = JSON.parse(json);
  } catch {
    nodes = { ROOT: { type: { resolvedName: 'Canvas' }, props: {}, nodes: [] } };
  }

  const root = nodes['ROOT'];
  const jsx = nodeToJSX(root, nodes, '      ');

  return `import React from 'react';

${genPoweredByBadge()}

function App() {
  return (
    <div className="app-container">
${jsx}
      <PoweredByBadge />
    </div>
  );
}

export default App;
`;
}

function genAppCss(): string {
  return `/* 미니앱 스타일 */
:root {
  --toss-blue: #3182F6;
  --toss-blue-hover: #1B64DA;
  --gray-900: #191F28;
  --gray-800: #333D4B;
  --gray-600: #6B7684;
  --gray-400: #B0B8C1;
  --gray-100: #F2F4F6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard Variable', Pretendard, Roboto, 'Noto Sans KR', 'Segoe UI', sans-serif;
  background: #FFFFFF;
  color: #191F28;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  max-width: 100%;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

.tds-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.tds-card:active {
  transform: scale(0.98);
}

button {
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.2s;
}

button:active {
  opacity: 0.85;
}

input:focus {
  border-color: var(--toss-blue) !important;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;
}

function genReadme(projectName: string, appName: string): string {
  return `# ${projectName}

미니앱 빌더로 제작된 미니앱 프로젝트입니다.

## 🚀 시작하기

### 설치

\`\`\`bash
npm install
\`\`\`

### 개발 서버

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:3000 접속

### 빌드

\`\`\`bash
npm run build
\`\`\`

\`dist/\` 폴더에 빌드 결과물이 생성됩니다.

## 미니앱 배포

1. \`npm run build\` 실행
2. [토스 미니앱 콘솔](https://apps-in-toss.toss.im) 접속
3. '새 앱 만들기' → '파일 업로드'
4. \`dist/\` 폴더의 파일들 업로드
5. 앱 정보 입력 후 심사 제출

## 🛠 기술 스택

- **React** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **@apps-in-toss/web-framework** - 미니앱 SDK
- **@toss/tds-mobile** - 토스 디자인 시스템

## 📁 프로젝트 구조

\`\`\`
${appName}/
├── index.html          # Vite 엔트리
├── package.json
├── granite.config.ts   # 미니앱 설정
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx        # React 엔트리
    ├── App.tsx         # 메인 컴포넌트
    └── App.css         # 스타일
\`\`\`

---
미니앱 빌더로 제작됨
`;
}

// ── 앱 아이콘 SVG 생성 (첫 글자 기반) ──

function genAppIconSvg(projectName: string): string {
  const firstChar = projectName.trim().charAt(0) || 'A';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" style="stop-color:#3182F6"/>
      <stop offset="100%" style="stop-color:#6C5CE7"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <text x="256" y="280" font-family="'Apple SD Gothic Neo', 'Pretendard', sans-serif" font-size="240" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="central">${firstChar}</text>
</svg>`;
}

// ── 메인 Export 함수 ──

export interface AitExportFiles {
  [path: string]: string;
}

export function generateAitProject(json: string, projectName: string): AitExportFiles {
  const appName = toEnglishName(projectName);

  return {
    'package.json': genPackageJson(appName, projectName),
    'granite.config.ts': genGraniteConfig(appName),
    'vite.config.ts': genViteConfig(),
    'tsconfig.json': genTsConfig(),
    'tsconfig.node.json': genTsConfigNode(),
    'index.html': genIndexHtml(projectName),
    'src/main.tsx': genMainTsx(),
    'src/App.tsx': genAppTsx(json),
    'src/App.css': genAppCss(),
    'public/icon.svg': genAppIconSvg(projectName),
    'README.md': genReadme(projectName, appName),
  };
}
