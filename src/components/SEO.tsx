import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schema?: object;
}

const SITE_URL = "https://meta-heroes.co.jp";
const DEFAULT_OGP_IMAGE = `${SITE_URL}/assets/MH_OGP.png`;

export const SEO = ({ 
  title, 
  description = "株式会社MetaHeroesは、メタバース・AI・XRで社会課題を解決するインパクト・ビジネスを展開しています。教育、防災、地方創生の3本柱を軸に、日本の未来をワクワクさせるHEROを創出します。", 
  keywords = "MetaHeroes, メタバース, AI, XR, 社会課題解決, 地方創生, 防災, 教育, Hero Egg, UEFN, Society 5.0",
  image,
  url,
  type = 'website',
  schema
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = url || `${SITE_URL}${location.pathname}`;

  // 画像URLを決定（未指定・null・空文字の場合はデフォルトを使用）
  const finalImage = image || DEFAULT_OGP_IMAGE;

  // 画像URLを絶対パスに変換
  const ogImage = finalImage.startsWith('http') ? finalImage : `${SITE_URL}${finalImage.startsWith('/') ? '' : '/'}${finalImage}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta Tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // 3. Open Graph Tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', currentUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:site_name', '株式会社MetaHeroes', 'property');

    // 4. Twitter Card Tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // 5. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // 6. Robots Tag (Agency logic)
    const isAgency = location.pathname.startsWith('/agency') || location.pathname === '/agency-login';
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (isAgency) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else {
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    }

    // 7. JSON-LD Schema
    const scriptId = 'json-ld-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (schema) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(schema);
    } else if (script) {
      script.remove();
    }

  }, [title, description, keywords, image, currentUrl, type, schema, location.pathname]);

  return null;
};

const updateMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};
