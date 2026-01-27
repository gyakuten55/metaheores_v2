import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: 'g07uki3u26',
  apiKey: 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi',
});

// バナー(ピックアップニュース)の型定義
export interface Banner {
  id: string;
  title: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface BannerResponse {
  contents: Banner[];
  totalCount: number;
  offset: number;
  limit: number;
}

// ピックアップニュースを5件取得
export const getPickups = async (): Promise<BannerResponse> => {
  return await client.get<BannerResponse>({
    endpoint: 'news',
    queries: {
      filters: 'category[equals]pickup',
      limit: 5,
      orders: '-publishedAt',
    },
  });
};

// カテゴリの型定義
export interface Category {
  id: string;
  name: string;
}

// ブログ記事の型定義
export interface Blog {
  id: string;
  title: string;
  content?: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  category?: Category;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  contents: Blog[];
  totalCount: number;
  offset: number;
  limit: number;
}

// ブログ記事一覧を取得
export const getBlogs = async (
  limit: number = 10,
  memberId?: string,
  filters?: {
    categoryId?: string;
    excludeCategoryId?: string;
    year?: string;
    keyword?: string;
  },
  offset: number = 0
): Promise<BlogResponse> => {
  const queries: any = {
    limit,
    offset,
    orders: '-publishedAt',
  };

  const filterConditions: string[] = [];

  if (memberId) {
    // memberIdのフィルタリングが必要な場合
    // filterConditions.push(`member[equals]${memberId}`);
  }

  if (filters?.categoryId) {
    filterConditions.push(`category[equals]${filters.categoryId}`);
  }

  if (filters?.excludeCategoryId) {
    filterConditions.push(`category[not_equals]${filters.excludeCategoryId}`);
  }

  if (filters?.year) {
    filterConditions.push(`publishedAt[begins_with]${filters.year}`);
  }

  if (filterConditions.length > 0) {
    queries.filters = filterConditions.join('[and]');
  }

  if (filters?.keyword) {
    queries.q = filters.keyword;
  }

  return await client.get<BlogResponse>({
    endpoint: 'news',
    queries,
  });
};

// ブログ記事を単一取得
export const getBlogById = async (blogId: string): Promise<Blog> => {
  return await client.get<Blog>({
    endpoint: 'news',
    contentId: blogId,
  });
};

// お知らせを取得
export const getAnnouncements = async (limit: number = 5): Promise<BlogResponse> => {
  return await client.get<BlogResponse>({
    endpoint: 'news',
    queries: {
      filters: 'category[equals]announcement',
      limit,
      orders: '-publishedAt',
      fields: 'id,title,publishedAt,category', // 軽量化のため必要なフィールドのみ取得
    },
  });
};
