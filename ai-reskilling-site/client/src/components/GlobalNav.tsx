/**
 * GlobalNav v3 — 完全修正版
 * - 全ページ共通リンク設計統一
 * - 他ページからトップanchorへの正確な遷移
 * - SPメニュー: drawer閉じる・背景スクロールロック解除
 * - ページactive state表示
 * Design: Enterprise Depth — Dark Navy × Purple/Pink
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { asset, url } from "@/lib/paths";

// Check if current page is home (location is base-relative thanks to <Router base>)
function isHomePage(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

// Scroll to anchor with offset for sticky header + category bar
function scrollToAnchor(id: string, extraOffset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerH = 64; // GlobalNav height
  const offset = headerH + extraOffset + 16;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

const navItems = [
  { label: "AIで変わる仕事", anchor: "outcomes", page: "/" },
  { label: "業種から探す", href: "/curriculum-industry/" },
  { label: "職種から探す", href: "/curriculum-job/" },
  { label: "研修の特徴", anchor: "features", page: "/" },
  { label: "助成金", href: "/subsidy" },
];

export default function GlobalNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock/unlock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Handle hash on page load (for direct URL access with hash)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace("#", "");
      // Wait for page render
      const timer = setTimeout(() => scrollToAnchor(id), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // Determine active page for nav highlighting
  const isHome = isHomePage(location);
  const isJobPage = location.includes("curriculum-job");
  const isIndustryPage = location.includes("curriculum-industry");
  const isSubsidyPage = location.includes("subsidy");

  function getNavItemActive(item: typeof navItems[0]): boolean {
    if (item.href === "/curriculum-industry/" && isIndustryPage) return true;
    if (item.href === "/curriculum-job/" && isJobPage) return true;
    if (item.href === "/subsidy/" && isSubsidyPage) return true;
    return false;
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) {
    e.preventDefault();
    setMenuOpen(false);

    if (item.anchor) {
      // Anchor link — navigate to home then scroll
      if (isHome) {
        scrollToAnchor(item.anchor);
      } else {
        // Navigate to home with hash — use window.location for full navigation
        window.location.href = `${url("/")}#${item.anchor}`;
      }
    } else if (item.href) {
      // Page link
      const resolved = url(item.href);
      // For page links (no anchor), always navigate to TOP of page
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.location.href = resolved;
    }
  }

  function handleConsultationClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setMenuOpen(false);
    if (isHome) {
      scrollToAnchor("consultation");
    } else {
      window.location.href = `${url("/")}#consultation`;
    }
  }

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setMenuOpen(false);
    window.location.href = url("/");
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#172554]/95 backdrop-blur-xl shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href={url("/")} onClick={handleLogoClick} className="group flex shrink-0 items-center" aria-label="Meta Heroes AI Reskilling トップへ">
          <img
            src={asset("/images/meta-heroes-reskilling-logo.png")}
            alt="Meta Heroes AI Reskilling"
            className="h-8 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 sm:h-9"
            width="160"
            height="36"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const active = getNavItemActive(item);
            return (
              <a key={item.label}
                href={item.href ? url(item.href) : `${url("/")}#${item.anchor}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "text-white border-b border-[#A3377B] pb-0.5"
                    : "text-white/75 hover:text-white"
                }`}>
                {item.label}
              </a>
            );
          })}
          <a href={`${url("/")}#consultation`} onClick={handleConsultationClick} className="btn-primary text-sm py-2.5 px-5">
            無料相談
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2 flex flex-col justify-center w-8 h-8"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニューを開く"
          aria-expanded={menuOpen}
        >
          <div className={`w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <div className={`w-5 h-0.5 bg-white mt-[5px] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-white mt-[5px] transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#172554]/98 backdrop-blur-xl border-t border-white/10">
          <nav className="container py-3 flex flex-col gap-0.5">
            {navItems.map((item) => {
              const active = getNavItemActive(item);
              return (
                <a key={item.label}
                  href={item.href ? url(item.href) : `${url("/")}#${item.anchor}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`py-2.5 text-sm font-medium border-b border-white/5 last:border-0 ${
                    active ? "text-[#e879b8]" : "text-white/80 hover:text-white"
                  }`}>
                  {item.label}
                </a>
              );
            })}
            <a href={`${url("/")}#consultation`} onClick={handleConsultationClick}
              className="btn-primary mt-3 justify-center py-3 text-sm">
              無料でカリキュラム相談する
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
