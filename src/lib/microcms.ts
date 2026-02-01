import { createClient } from 'microcms-js-sdk';

// 既存のアカウント (ニュース・実績)
export const client = createClient({
  serviceDomain: 'g07uki3u26',
  apiKey: 'cONapSqFkKcDF9MqPltOcuntceBifMmKQqQi',
});

// メンバーブログ用のアカウント
export const memberClient = createClient({
  serviceDomain: 'tsrozu3k55',
  apiKey: '3cEPye52LNlCwgRRAydNRajAvav3lR9EOCmU',
});

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
  category_new?: string[];
  category?: Category; // メンバーブログ用の単一カテゴリ
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

// メンバーブログの取得
export const getMemberBlogs = async (
  limit: number = 10,
  filters?: {
    categoryId?: string;
    keyword?: string;
  },
  offset: number = 0
): Promise<BlogResponse> => {
  const queries: any = {
    limit,
    offset,
    orders: '-publishedAt',
  };

  if (filters?.categoryId) {
    queries.filters = `category[equals]${filters.categoryId}`;
  }

  if (filters?.keyword) {
    queries.q = filters.keyword;
  }

  return await memberClient.get<BlogResponse>({
    endpoint: 'blogs',
    queries,
  });
};

// メンバーブログのカテゴリ（人物）取得
export const getMemberCategories = async (): Promise<Category[]> => {
  try {
    const res = await memberClient.get({ endpoint: 'categories' });
    return res.contents;
  } catch (e) {
    console.error('Failed to fetch member categories:', e);
    return [];
  }
};

// メンバーブログを単一取得
export const getMemberBlogById = async (blogId: string): Promise<Blog> => {
  return await memberClient.get<Blog>({
    endpoint: 'blogs',
    contentId: blogId,
  });
};

// microCMSの「カテゴリ_new」セレクトフィールドに設定されている全選択肢のマスターリスト
const CATEGORY_MASTER: Category[] = [
  { id: 'ピックアップ', name: 'ピックアップ' },
  { id: 'プレスリリース', name: 'プレスリリース' },
  { id: 'インフォメーション', name: 'インフォメーション' },
  { id: 'ナレッジ', name: 'ナレッジ' },
  { id: 'XRソリューション', name: 'XRソリューション' },
  { id: 'holoshare', name: 'holoshare' },
  { id: 'HERO AIVO', name: 'HERO AIVO' },
  { id: 'AI人材育成研修', name: 'AI人材育成研修' },
  { id: '防災メタバース', name: '防災メタバース' },
  { id: '防災万博 / こども防災万博', name: '防災万博 / こども防災万博' },
  { id: 'ゲームメイキングキャンプ', name: 'ゲームメイキングキャンプ' },
  { id: 'Hero Egg', name: 'Hero Egg' },
  { id: 'GLOBAL HERO SUMMIT', name: 'GLOBAL HERO SUMMIT' },
  { id: 'EGG JAM', name: 'EGG JAM' },
  { id: 'AI MONDAY', name: 'AI MONDAY' },
  { id: 'ゲーム × イベント', name: 'ゲーム × イベント' },
  { id: 'Meta Heroes Guild', name: 'Meta Heroes Guild' },
  { id: 'PRtimes', name: 'PRtimes' },
  { id: 'セミナー・ウェビナー・講演・登壇 実績', name: 'セミナー・ウェビナー・講演・登壇 実績' },
  { id: 'メタバース開発実績', name: 'メタバース開発実績' },
  { id: 'Hero Egg 実績', name: 'Hero Egg 実績' },
  { id: 'AI / 開発 実績', name: 'AI / 開発 実績' },
  { id: 'イベント実績', name: 'イベント実績' },
  { id: '事業領域 [ 防災 ]', name: '事業領域 [ 防災 ]' },
  { id: '事業領域 [ 教育 ]', name: '事業領域 [ 教育 ]' },
  { id: '事業領域 [ 地方創生 ]', name: '事業領域 [ 地方創生 ]' },
  { id: 'セミナー・ウェビナー・講演・登壇', name: 'セミナー・ウェビナー・講演・登壇' },
  { id: 'ブース出展', name: 'ブース出展' }
];

// ニュースのデータから実際に使用されているカテゴリの選択肢を抽出する
export const getCategoryOptions = async (): Promise<Category[]> => {
  return CATEGORY_MASTER;
};

// バナー(ピックアップニュース)の型定義
export interface Banner {
  id: string;
  title: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  category_new?: string[];
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
      filters: 'category_new[contains]ピックアップ',
      limit: 5,
      orders: '-publishedAt',
    },
  });
};

// ブログ記事一覧を取得
export const getBlogs = async (
  limit: number = 10,
  _memberId?: string, // 互換性のために残しています
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

  if (filters?.categoryId) {
    filterConditions.push(`category_new[contains]${filters.categoryId}`);
  }

  if (filters?.excludeCategoryId) {
    filterConditions.push(`category_new[not_contains]${filters.excludeCategoryId}`);
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
      filters: 'category_new[contains]お知らせ',
      limit,
      orders: '-publishedAt',
      fields: 'id,title,publishedAt,category_new',
    },
  });
};
