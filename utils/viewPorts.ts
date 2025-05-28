// /utils/viewports.ts

export type ViewportType = 'desktop' | 'laptop' | 'tablet' | 'mobile';

const allViewports: Record<ViewportType, { width: number; height: number }> = {
  desktop: { width: 1800, height: 1000 },
  laptop: { width: 1440, height: 1000 },
  tablet: { width: 768, height: 1000 },
  mobile: { width: 360, height: 1000 }
};

export function getEnabledViewports(countOrKeys: number | ViewportType[]) {
  if (Array.isArray(countOrKeys)) {
    return Object.fromEntries(countOrKeys.map(k => [k, allViewports[k]])) as Record<ViewportType, { width: number; height: number }>;
  }

  const ordered: ViewportType[] = ['desktop', 'laptop', 'tablet', 'mobile'];
  const selected = ordered.slice(0, countOrKeys);
  return Object.fromEntries(selected.map(k => [k, allViewports[k]])) as Record<ViewportType, { width: number; height: number }>;
}
