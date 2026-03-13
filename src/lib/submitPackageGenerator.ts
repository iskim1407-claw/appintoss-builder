/**
 * 앱인토스 제출 패키지 Generator
 * Craft.js JSON → 앱인토스 SDK 프로젝트 ZIP (JSZip)
 */

import JSZip from 'jszip';
import { generateAitProject } from './aitExportGenerator';
import type { AppInfo } from '@/types/submit';

export interface SubmitPackageOptions {
  canvasJson: string;
  appInfo: AppInfo;
  projectName: string;
  logoBase64?: string;
}

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

function genSubmitPackageJson(appId: string, projectName: string): string {
  return JSON.stringify({
    name: appId,
    version: '1.0.0',
    description: `${projectName} - 미니앱`,
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      'ait:build': 'ait build',
      'ait:deploy': 'ait deploy',
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

function genGraniteConfig(appId: string): string {
  return `import { defineConfig } from '@apps-in-toss/web-framework';

export default defineConfig({
  appName: '${appId}',
  brand: {
    primaryColor: '#3182F6',
  },
  build: {
    outDir: 'dist',
  },
});
`;
}

function genPrivacyPage(appInfo: AppInfo): string {
  const date = new Date().toISOString().split('T')[0];
  return `import React from 'react';

function PrivacyPolicy() {
  return (
    <div style={{ padding: '24px 16px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px' }}>개인정보처리방침</h1>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>1. 개인정보의 수집 및 이용 목적</h2>
        <p style={{ fontSize: '14px', color: '#6B7684', lineHeight: 1.6 }}>
          "${appInfo.name}" (이하 "앱")은 서비스 제공을 위해 최소한의 개인정보를 수집합니다.
        </p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>2. 수집하는 개인정보 항목</h2>
        <p style={{ fontSize: '14px', color: '#6B7684', lineHeight: 1.6 }}>
          본 앱은 별도의 개인정보를 수집하지 않습니다. 토스 미니앱 플랫폼에서 제공하는 사용자 식별 정보만을 활용합니다.
        </p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>3. 개인정보의 보유 및 이용 기간</h2>
        <p style={{ fontSize: '14px', color: '#6B7684', lineHeight: 1.6 }}>
          서비스 이용 기간 동안 보유하며, 서비스 종료 시 즉시 파기합니다.
        </p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>4. 개인정보의 제3자 제공</h2>
        <p style={{ fontSize: '14px', color: '#6B7684', lineHeight: 1.6 }}>
          수집된 개인정보는 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>5. 문의</h2>
        <p style={{ fontSize: '14px', color: '#6B7684', lineHeight: 1.6 }}>
          개인정보처리방침에 대한 문의사항은 앱 내 고객센터를 이용해 주시기 바랍니다.
        </p>
      </section>

      <p style={{ fontSize: '13px', color: '#B0B8C1', marginTop: '40px' }}>
        시행일: ${date}
      </p>
    </div>
  );
}

export default PrivacyPolicy;
`;
}

function genAppTsxWithRouting(mainAppTsx: string): string {
  const withoutImports = mainAppTsx
    .replace(/^import .*;\n/gm, '')
    .replace(/^export default App;\s*$/gm, '')
    .replace('function App()', 'function MainApp()');

  return `import React, { useState, useEffect } from 'react';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';

${withoutImports.trim()}

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route === '#/privacy') {
    return <PrivacyPolicy />;
  }

  return <MainApp />;
}

export default App;
`;
}

function genSubmitReadme(appInfo: AppInfo, projectName: string): string {
  const appId = appInfo.appName || toEnglishName(projectName);
  return `# ${projectName}

미니앱 빌더로 제작된 미니앱 프로젝트입니다.

## 앱 정보

| 항목 | 값 |
|------|-----|
| **앱 이름** | ${appInfo.name || projectName} |
| **앱 ID** | ${appId} |
| **카테고리** | ${appInfo.category || '미설정'} |
| **부제** | ${appInfo.subtitle || '미설정'} |

## 🚀 빌드 & 배포

\`\`\`bash
# 1. 의존성 설치
npm install

# 2. (선택) 로컬 개발
npm run dev

# 3. AIT 로그인 - 토스앱 QR 스캔
npx ait login

# 4. 빌드 (SDK 2.0.5+)
ait build

# 5. 배포
ait deploy
\`\`\`

## 📁 프로젝트 구조

\`\`\`
${appId}/
├── index.html
├── package.json
├── granite.config.ts
├── vite.config.ts
├── tsconfig.json
├── logo.png
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    └── pages/
        └── PrivacyPolicy.tsx
\`\`\`

---
*미니앱 빌더로 자동 생성됨*
`;
}

export async function generateSubmitPackage(options: SubmitPackageOptions): Promise<Blob> {
  const { canvasJson, appInfo, projectName, logoBase64 } = options;
  const appId = appInfo.appName || toEnglishName(projectName);

  const baseFiles = generateAitProject(canvasJson, projectName);
  const zip = new JSZip();
  const folder = zip.folder(appId)!;

  // Add base files, skip ones we override
  for (const [path, content] of Object.entries(baseFiles)) {
    if (['package.json', 'granite.config.ts', 'README.md', 'src/App.tsx'].includes(path)) continue;
    folder.file(path, content);
  }

  // Submit-specific overrides
  folder.file('package.json', genSubmitPackageJson(appId, projectName));
  folder.file('granite.config.ts', genGraniteConfig(appId));
  folder.file('README.md', genSubmitReadme(appInfo, projectName));
  folder.file('src/pages/PrivacyPolicy.tsx', genPrivacyPage(appInfo));

  const originalAppTsx = baseFiles['src/App.tsx'] || '';
  folder.file('src/App.tsx', genAppTsxWithRouting(originalAppTsx));

  if (logoBase64) {
    const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, '');
    folder.file('logo.png', base64Data, { base64: true });
  }

  folder.file('.gitignore', 'node_modules/\ndist/\n.DS_Store\n*.local\n');

  return zip.generateAsync({ type: 'blob' });
}

export function generateMetadataText(appInfo: AppInfo, projectName: string): string {
  return `앱 이름: ${appInfo.name || projectName}
앱 ID (appName): ${appInfo.appName || toEnglishName(projectName)}
카테고리: ${appInfo.category || ''}
부제: ${appInfo.subtitle || ''}
설명: ${appInfo.description || ''}
개인정보처리방침: 앱 내 #/privacy 경로에 포함되어 있습니다.`;
}
