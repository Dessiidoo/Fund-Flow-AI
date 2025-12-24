import { z } from 'zod';
import { insertInvestorSchema, insertCampaignSchema, insertMatchSchema, investors, campaigns, matches } from './schema';

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
  investors: {
    list: {
      method: 'GET' as const,
      path: '/api/investors',
      input: z.object({
        search: z.string().optional(),
        focus: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof investors.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/investors/:id',
      responses: {
        200: z.custom<typeof investors.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    import: {
      method: 'POST' as const,
      path: '/api/investors/import', // For CSV parsing
      responses: {
        200: z.object({ count: z.number() }),
      },
    }
  },
  campaigns: {
    list: {
      method: 'GET' as const,
      path: '/api/campaigns',
      responses: {
        200: z.array(z.custom<typeof campaigns.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/campaigns',
      input: insertCampaignSchema,
      responses: {
        201: z.custom<typeof campaigns.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/campaigns/:id',
      responses: {
        200: z.custom<typeof campaigns.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getMatches: {
      method: 'GET' as const,
      path: '/api/campaigns/:id/matches',
      responses: {
        200: z.array(z.custom<typeof matches.$inferSelect & { investor: typeof investors.$inferSelect }>()),
      },
    },
    generateMatches: {
      method: 'POST' as const,
      path: '/api/campaigns/:id/matches/generate',
      responses: {
        200: z.object({ count: z.number() }),
      },
    }
  },
  matches: {
    update: {
      method: 'PATCH' as const,
      path: '/api/matches/:id',
      input: insertMatchSchema.partial(),
      responses: {
        200: z.custom<typeof matches.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    generateEmail: {
      method: 'POST' as const,
      path: '/api/matches/:id/email',
      responses: {
        200: z.object({ content: z.string() }),
      },
    }
  }
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
