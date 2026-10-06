'use client';

import { TableFeatureClient } from '@payloadcms/richtext-lexical/client';

/**
 * Stock TableFeatureClient with a Vietnamese menu label ("Bảng") and search
 * keywords, so "/bảng", "/bang" and "/table" all find it in the slash menu.
 * Server side: src/cms/lexical/tableVi.ts.
 */
type Item = { key?: string; label?: unknown; keywords?: string[] };
type Group = { key?: string; items?: Item[] };
type FeatureLike = {
  slashMenu?: { groups?: Group[] };
  toolbarFixed?: { groups?: Group[] };
  toolbarInline?: { groups?: Group[] };
};

const label = ({ i18n }: { i18n?: { language?: string } }) => (i18n?.language === 'en' ? 'Table' : 'Bảng');

const relabel = (groups: Group[] | undefined): Group[] | undefined =>
  groups?.map((g) => ({
    ...g,
    items: g.items?.map((item) =>
      item.key === 'table'
        ? { ...item, label, keywords: ['table', 'bảng', 'bang', 'bảng biểu', 'ke bang'] }
        : item,
    ),
  }));

export const TableFeatureClientVi: typeof TableFeatureClient = (props) => {
  const provider = TableFeatureClient(props);
  const feature = provider.feature as unknown;
  if (feature && typeof feature === 'object') {
    const f = feature as FeatureLike;
    provider.feature = {
      ...f,
      slashMenu: f.slashMenu ? { ...f.slashMenu, groups: relabel(f.slashMenu.groups) } : f.slashMenu,
      toolbarFixed: f.toolbarFixed ? { ...f.toolbarFixed, groups: relabel(f.toolbarFixed.groups) } : f.toolbarFixed,
      toolbarInline: f.toolbarInline ? { ...f.toolbarInline, groups: relabel(f.toolbarInline.groups) } : f.toolbarInline,
    } as typeof provider.feature;
  }
  return provider;
};

export default TableFeatureClientVi;
