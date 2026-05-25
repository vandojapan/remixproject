import type { AppLoadContext } from "@remix-run/node";

type MicroCMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type Blog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  revisedAt?: string;
  title: string;
  content?: string;
  description?: string;
  eyecatch?: {
    url: string;
    height?: number;
    width?: number;
  };
};

type GetListOptions = {
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: string;
};

type MicroCMSBindings = {
  MICROCMS_SERVICE_DOMAIN?: string;
  MICROCMS_API_KEY?: string;
};

type CloudflareLoadContext = AppLoadContext & {
  cloudflare?: {
    env?: MicroCMSBindings;
  };
};

const BLOG_ENDPOINT = "blogs";

function getMicroCMSConfig(context: AppLoadContext) {
  const env = (context as CloudflareLoadContext).cloudflare?.env;
  const serviceDomain = env?.MICROCMS_SERVICE_DOMAIN;
  const apiKey = env?.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) {
    throw new Error(
      "MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY must be set in Cloudflare Pages environment variables.",
    );
  }

  return { serviceDomain, apiKey };
}

async function request<T>(
  context: AppLoadContext,
  endpoint: string,
  params?: URLSearchParams,
) {
  const { serviceDomain, apiKey } = getMicroCMSConfig(context);
  const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${endpoint}`);

  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url, {
    headers: {
      "X-MICROCMS-API-KEY": apiKey,
    },
  });

  if (!response.ok) {
    throw new Response("Failed to fetch microCMS content.", {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return response.json() as Promise<T>;
}

export const microcmsClient = {
  getList<T>(
    context: AppLoadContext,
    endpoint: string,
    options: GetListOptions = {},
  ) {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    });

    return request<MicroCMSListResponse<T>>(context, endpoint, params);
  },
  getListDetail<T>(
    context: AppLoadContext,
    endpoint: string,
    contentId: string,
  ) {
    return request<T>(context, `${endpoint}/${contentId}`);
  },
};

export function getBlogs(context: AppLoadContext, options?: GetListOptions) {
  return microcmsClient.getList<Blog>(context, BLOG_ENDPOINT, {
    limit: 20,
    orders: "-publishedAt",
    ...options,
  });
}

export function getBlog(context: AppLoadContext, id: string) {
  return microcmsClient.getListDetail<Blog>(context, BLOG_ENDPOINT, id);
}
