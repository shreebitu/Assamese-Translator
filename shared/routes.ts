import { z } from 'zod';
import { translations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  translations: {
    list: {
      method: 'GET' as const,
      path: '/api/translations' as const,
      responses: {
        200: z.array(z.custom<typeof translations.$inferSelect>()),
      },
    },
    translate: {
      method: 'POST' as const,
      path: '/api/translate' as const,
      input: z.object({
        text: z.string().min(1, "Please enter text to translate"),
      }),
      responses: {
        200: z.object({
          translatedText: z.string(),
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type TranslateInput = z.infer<typeof api.translations.translate.input>;
export type TranslateResponse = z.infer<typeof api.translations.translate.responses[200]>;
export type TranslationItem = z.infer<typeof api.translations.list.responses[200]>[number];
