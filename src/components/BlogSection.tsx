import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Blog, getBlogs } from '../lib/microcms';

interface BlogSectionProps {
  memberId: string;
  memberName: string;
}

export const BlogSection = ({ memberId, memberName }: BlogSectionProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getBlogs(6, memberId);
        setBlogs(response.contents);
      } catch (err) {
        console.error('ブログ記事の取得に失敗しました:', err);
        setError('ブログ記事の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [memberId]);

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-8 lg:px-24 max-w-6xl">
        {/* ラベル */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-4 h-4 bg-cyan-500 rounded-full"></span>
          <span className="text-cyan-500 font-bold">ブログ</span>
        </div>

        {/* タイトル */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12">
          {memberName}のブログ記事
        </h2>

        {/* ローディング */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
          </div>
        )}

        {/* エラー */}
        {error && (
          <div className="text-center py-12 text-gray-500">
            {error}
          </div>
        )}

        {/* 記事がない場合 */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            まだブログ記事がありません
          </div>
        )}

        {/* ブログ記事一覧 */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow block"
              >
                {/* アイキャッチ画像 */}
                {blog.eyecatch ? (
                  <img
                    src={blog.eyecatch.url}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">B</span>
                  </div>
                )}

                {/* コンテンツ */}
                <div className="p-6">
                  <time className="text-sm text-gray-400">
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </time>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2">
                    {blog.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
