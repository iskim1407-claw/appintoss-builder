import type { ValidationItem } from '@/types/submit';
import { TDS_COMPONENTS, TDS_USAGE_THRESHOLD } from '../constants';

interface NodeInfo {
  type?: {
    resolvedName?: string;
  };
}

type NodesMap = Record<string, NodeInfo>;

/** TDS 컴포넌트 사용률 계산 */
export function calculateTDSUsage(nodes: NodesMap): number {
  const allComponents = Object.values(nodes).filter(
    (n) => n.type?.resolvedName && n.type.resolvedName !== 'Canvas'
  );

  if (allComponents.length === 0) return 100;

  const tdsComponents = allComponents.filter((n) =>
    TDS_COMPONENTS.includes(n.type?.resolvedName ?? '')
  );

  return (tdsComponents.length / allComponents.length) * 100;
}

/** TDS 사용률 검증 */
export function checkTDSUsage(nodes: NodesMap): ValidationItem {
  const usage = calculateTDSUsage(nodes);
  const rounded = Math.round(usage);

  if (usage >= TDS_USAGE_THRESHOLD) {
    return {
      id: 'REC-001',
      name: 'TDS 컴포넌트 사용률',
      status: 'pass',
      message: `TDS 사용률 ${rounded}% (권장 ${TDS_USAGE_THRESHOLD}% 이상)`,
    };
  }

  return {
    id: 'REC-001',
    name: 'TDS 컴포넌트 사용률',
    status: 'warning',
    message: `TDS 사용률 ${rounded}% (권장 ${TDS_USAGE_THRESHOLD}% 이상)`,
    fix: 'TDS 컴포넌트를 더 사용하면 심사 통과 확률이 높아집니다.',
  };
}
