export type MediaType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  type: MediaType;
  thumbnail?: string; // YouTubeの場合は自動取得も可能だが、指定があればそれを使う
  videoUrl?: string; // ローカル動画パス
  youtubeUrl?: string; // YouTubeのURL (例: https://www.youtube.com/watch?v=...)
  title: string;
  category: string;
  description?: string;
}

// マニュアルで追加するアイテム（YouTube動画など）
// ここにYouTubeのリンクを追加してください
const manualItems: GalleryItem[] = [
  {
    id: 'yt-1',
    type: 'video',
    title: '【教育イベント】みらいのたからばこ ゲームクリエイター体験',
    category: 'Education',
    youtubeUrl: 'https://www.youtube.com/watch?v=ytvh4r0n_Qw'
  },
  {
    id: 'yt-2',
    type: 'video',
    title: '【Fortnite map PV】メタバースときわ公園',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=wQJ0_xIUAys'
  },
  {
    id: 'yt-3',
    type: 'video',
    title: '【Fortnite map PV】美山ビレッジ',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=v5IVC9ESJKc'
  },
  {
    id: 'yt-4',
    type: 'video',
    title: '【サービス紹介】EGG JAM CM',
    category: 'Service',
    youtubeUrl: 'https://www.youtube.com/watch?v=k2NCdmsgN74'
  },
  {
    id: 'yt-5',
    type: 'video',
    title: '【Fortnite map PV】GOKO PARKOUR',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=dEAwzx_hSm0'
  },
  {
    id: 'yt-6',
    type: 'video',
    title: '【Fortnite map PV】FALAMENT',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=YPlRJPGy7ro'
  },
  {
    id: 'yt-7',
    type: 'video',
    title: '【オープニングムービー】防災万博',
    category: 'Event',
    youtubeUrl: 'https://www.youtube.com/watch?v=W3zB9PV5NeM'
  },
  {
    id: 'yt-8',
    type: 'video',
    title: '【Fortnite map PV】THE YOn - Collect Coordinates',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=S8IJB3TQv2c'
  },
  {
    id: 'yt-9',
    type: 'video',
    title: '【Fortnite map PV】地震シミュレーション',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=bChkWguO_kQ'
  },
  {
    id: 'yt-10',
    type: 'video',
    title: '【Fortnite map PV】阪神・淡路大震災を知ろう ～防災メタバース～',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=_mklyapz8xI'
  },
  {
    id: 'yt-11',
    type: 'video',
    title: '【Fortnite】ステージに！',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=Q-H-lOIYyYc'
  },
  {
    id: 'yt-12',
    type: 'video',
    title: '【Fortnite map PV】少年と犬',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=OVLleuQW2Uc'
  },
  {
    id: 'yt-13',
    type: 'video',
    title: '【Fortnite map PV】SO.ON project LaV Music Live in Fortnite',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=FsFAqNp41Hc'
  },
  {
    id: 'yt-14',
    type: 'video',
    title: '【防災イベント】防災万博 大阪・関西万博',
    category: 'Event',
    youtubeUrl: 'https://www.youtube.com/watch?v=7thymifNrbE'
  },
  {
    id: 'yt-15',
    type: 'video',
    title: '【Fortnite map PV】Yuki World race & openworld',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=6-St2Ubn0zs'
  },
  {
    id: 'yt-16',
    type: 'video',
    title: '【ブランドムービー】Meta Heroes防災メタバース',
    category: 'Brand',
    youtubeUrl: 'https://www.youtube.com/watch?v=5VnxVYHR4A4'
  },
  {
    id: 'yt-17',
    type: 'video',
    title: '【キャラクター紹介】Hero Egg オリジナルキャラクター 紹介トレイラー',
    category: 'Brand',
    youtubeUrl: 'https://www.youtube.com/watch?v=M4SG299zjBE'
  },
  {
    id: 'yt-18',
    type: 'video',
    title: 'Hero Egg紹介ライブ配信',
    category: 'Live',
    youtubeUrl: 'https://www.youtube.com/watch?v=HojGyNoUmJc'
  },
  {
    id: 'yt-19',
    type: 'video',
    title: '【予告PV】Yuki Tsunoda official Fortnite map',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=gRX9h4TsDoE'
  },
  {
    id: 'yt-20',
    type: 'video',
    title: '【Fortnite map PV】MoriZakura もり桜',
    category: 'Metaverse',
    youtubeUrl: 'https://www.youtube.com/watch?v=QryyaVyBYHo'
  }
];

// Viteの機能を使ってディレクトリ内のファイルを一括取得
const imageModules = import.meta.glob('/src/assets/gallery/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' });

// データ変換ロジック (画像のみ自動取得)
const generateItemsFromAssets = (): GalleryItem[] => {
  const items: GalleryItem[] = [];

  // 画像の処理
  Object.entries(imageModules).forEach(([path, url]) => {
    const fileName = path.split('/').pop()?.split('.')[0] || 'Unknown';
    const [category, ...titleParts] = fileName.includes('_') ? fileName.split('_') : ['Other', fileName];
    const title = titleParts.join('_') || fileName;

    items.push({
      id: path,
      type: 'image',
      thumbnail: url as string,
      title: title.replace(/-/g, ' '),
      category: category,
      description: 'プロジェクトの詳細説明テキスト。'
    });
  });

  return items;
};

const assetItems = generateItemsFromAssets();

// マニュアル追加アイテム + 自動取得アイテム
export const galleryItems: GalleryItem[] = [...manualItems, ...assetItems];