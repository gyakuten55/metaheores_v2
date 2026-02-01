import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Blog, getBlogById, getBlogs, getMemberBlogById, getMemberBlogs } from '../lib/microcms';
import { SEO } from '../components/SEO';

const PLACEHOLDER_IMAGE = '/assets/top/business_bg.png';

export const BlogDetailPage = () => {
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMemberBlog = location.pathname.startsWith('/member-blog');
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!blogId) return;

      try {
        setLoading(true);
        
        let blogData;
        let relatedData;

        if (isMemberBlog) {
          [blogData, relatedData] = await Promise.all([
            getMemberBlogById(blogId),
            getMemberBlogs(6)
          ]);
        } else {
          [blogData, relatedData] = await Promise.all([
            getBlogById(blogId),
            getBlogs(6) 
          ]);
        }
        
        setBlog(blogData);
        // 表示中の記事を除外し、最大3件を表示
        setRelatedBlogs(relatedData.contents.filter(b => b.id !== blogId).slice(0, 3));
      } catch (err) {
        console.error('ブログ記事の取得に失敗しました:', err);
        setError('ブログ記事の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId, isMemberBlog]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  // SEO用の本文クレンジング処理
  const getPureText = (html: string) => {
    return html
      .replace(/<[^>]*>?/gm, '') // タグ除去
      .replace(/\s+/g, ' ')      // 改行・空白の整理
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-blue-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-4">記事が見つかりませんでした</h1>
          <button
            onClick={() => navigate('/news')}
            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors"
          >
            ニュース一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  // カテゴリ名をキーワードに変換
  const blogKeywords = [
    ...(blog.category_new || []),
    ...(isMemberBlog && (blog as any).category ? [((blog as any).category as any).name] : []),
    "MetaHeroes", "メタバース", "AI", "XR"
  ].join(', ');

  const description = blog.content 
    ? getPureText(blog.content).slice(0, 160) + '...'
    : `${blog.title}に関する株式会社MetaHeroesの最新情報をお届けします。`;

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${blog.title} | 株式会社MetaHeroes`}
        description={description}
        keywords={blogKeywords}
        image={blog.eyecatch?.url}
        type="article"
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blog.title,
          "description": description,
          "image": blog.eyecatch?.url || PLACEHOLDER_IMAGE,
          "datePublished": blog.publishedAt || blog.createdAt,
          "dateModified": blog.updatedAt || blog.publishedAt || blog.createdAt,
          "author": {
            "@type": "Organization",
            "name": "株式会社MetaHeroes",
            "url": "https://meta-heroes.co.jp/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "株式会社MetaHeroes",
            "logo": {
              "@type": "ImageObject",
              "url": "https://meta-heroes.co.jp/assets/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://meta-heroes.co.jp${location.pathname}`
          }
        }}
      />
      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 sm:px-8 pt-40 pb-20 max-w-4xl">
        
        {/* ヘッダーエリア: タイトル・日付・カテゴリ */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <time className="text-xs font-bold text-gray-400 tracking-widest font-mono">
              {formatDate(blog.publishedAt || blog.createdAt)}
            </time>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-relaxed tracking-tight">
            {blog.title}
          </h1>
        </div>

        {/* アイキャッチ画像 */}
        <div className="relative aspect-video w-full overflow-hidden mb-16 bg-gray-100 shadow-sm">
            <img
            src={blog.eyecatch?.url || PLACEHOLDER_IMAGE}
            alt={blog.title}
            className="w-full h-full object-cover"
            />
        </div>

        {/* 本文 */}
        {blog.content && (
          <article
            className="
              prose prose-lg max-w-none
              prose-headings:font-black prose-headings:text-gray-900 prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mt-16 prose-h1:mb-8
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
              prose-p:text-gray-700 prose-p:leading-loose prose-p:mb-8
              prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-black
              prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
              prose-img:rounded-sm prose-img:shadow-md
              prose-li:text-gray-700
            "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )}

        {/* カテゴリ一覧セクション */}
        {(blog.category_new || (isMemberBlog && blog.category)) && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 justify-center">
              {/* 通常ブログの複数カテゴリ */}
              {blog.category_new?.map((cat) => (
                <span 
                  key={cat}
                  className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-gray-200"
                >
                  {cat}
                </span>
              ))}
              {/* メンバーブログの単一カテゴリ（人物名） */}
              {isMemberBlog && blog.category && (
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase rounded-full border border-blue-100">
                  {(blog.category as any).name}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ギャラリーボタン */}
        <div className="mt-12 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <span className="tracking-widest">GALLERY</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </Link>
        </div>

        {/* 戻るボタン */}
        <div className="mt-20 pt-10 border-t border-gray-100 text-center">
          <Link
            to={isMemberBlog ? "/members/blog" : "/news"}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            一覧に戻る
          </Link>
        </div>
      </main>

      {/* 関連ニュースセクション */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50 py-24 border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <span className="text-xs font-bold tracking-[0.3em] text-blue-600 block mb-2 uppercase">RELATED</span>
                    <h2 className="text-3xl font-black text-gray-900">関連記事</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedBlogs.map((item) => (
                        <Link key={item.id} to={isMemberBlog ? `/member-blog/${item.id}` : `/blog/${item.id}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-video overflow-hidden bg-gray-200">
                                <img 
                                    src={item.eyecatch?.url || PLACEHOLDER_IMAGE} 
                                    alt="" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                            <div className="p-6">
                                <time className="text-[10px] font-bold text-gray-400 tracking-widest font-mono block mb-3">
                                    {formatDate(item.publishedAt)}
                                </time>
                                <h3 className="text-gray-900 text-base font-bold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
      )}
    </div>
  );
};
