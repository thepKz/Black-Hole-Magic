import { EXPERIMENTAL_TableFeature, type FeatureProviderServer } from '@payloadcms/richtext-lexical';
import type { Field } from 'payload';

/**
 * EXPERIMENTAL_TableFeature with Vietnamese UI. The stock feature hard-codes
 * English: slash-menu / toolbar item "Table" (so typing "/bảng" found nothing)
 * and the "Rows" / "Columns" fields of the insert drawer. Same nodes, same
 * stored JSON - only the labels change:
 * - server: field labels of the insert drawer (schema map entry `fields`);
 * - client: src/cms/admin/lexical/TableFeatureClientVi.tsx (menu labels +
 *   Vietnamese search keywords), wraps the stock TableFeatureClient.
 * The drawer title "Create Table" is translated by the admin provider
 * (src/cms/admin/EditorHints.tsx).
 */
const LABELS: Record<string, { vi: string; en: string }> = {
  rows: { vi: 'Số hàng', en: 'Rows' },
  columns: { vi: 'Số cột', en: 'Columns' },
};

type AnyFeature = Awaited<ReturnType<Extract<FeatureProviderServer['feature'], (...args: never[]) => unknown>>>;

export const TableFeatureVi = (): FeatureProviderServer => {
  const base = EXPERIMENTAL_TableFeature() as FeatureProviderServer;
  const original = base.feature;
  return {
    ...base,
    feature: async (args) => {
      const resolved = (typeof original === 'function' ? await original(args) : original) as AnyFeature;
      const generateSchemaMap = resolved.generateSchemaMap;
      return {
        ...resolved,
        ClientFeature: '/cms/admin/lexical/TableFeatureClientVi#TableFeatureClientVi',
        generateSchemaMap: generateSchemaMap
          ? (schemaArgs: Parameters<NonNullable<AnyFeature['generateSchemaMap']>>[0]) => {
              const map = generateSchemaMap(schemaArgs);
              const entry = map?.get('fields') as { fields?: Field[] } | undefined;
              for (const field of entry?.fields ?? []) {
                if ('name' in field && LABELS[field.name]) {
                  (field as { label?: unknown }).label = LABELS[field.name];
                }
              }
              return map;
            }
          : undefined,
      } as AnyFeature;
    },
  };
};
