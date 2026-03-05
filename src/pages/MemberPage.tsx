import { useRef, useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroSection } from '../components/HeroSection';
import { PhilosophySection } from '../components/PhilosophySection';
import { SkillsSection } from '../components/SkillsSection';
import { CareerSection } from '../components/CareerSection';
import { QASection } from '../components/QASection';
import { ScheduleSection } from '../components/ScheduleSection';
import { BlogSection } from '../components/BlogSection';
import { OtherMembersSection } from '../components/OtherMembersSection';
import { allMembers } from '../data/members';
import { SEO } from '../components/SEO';

export const MemberPage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const member = allMembers.find(m => m.id === memberId);
  
  const philosophyRef = useRef<HTMLDivElement>(null);
  const [philosophyHeight, setPhilosophyHeight] = useState(0);

  // Scroll to top when member changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [memberId]);

  // Measure philosophy section height
  useEffect(() => {
    if (philosophyRef.current) {
      const updateHeight = () => {
        if (philosophyRef.current) {
          setPhilosophyHeight(philosophyRef.current.offsetHeight);
        }
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      
      // Delay to ensure content is rendered
      const timeoutId = setTimeout(updateHeight, 100);
      
      return () => {
        window.removeEventListener('resize', updateHeight);
        clearTimeout(timeoutId);
      };
    }
  }, [member]);

  const { scrollY } = useScroll();
  
  // Delay the reveal effect until the user has scrolled a bit.
  const revealStart = 400;
  const revealEnd = revealStart + ((philosophyHeight || 1) * 0.5);

  const skillsY = useTransform(
    scrollY, 
    [revealStart, revealEnd], 
    [-philosophyHeight, 0]
  );

  if (!member) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="relative">
      <SEO 
        title={`${member.name} | メンバー紹介 | 株式会社MetaHeroes`}
        description={`${member.name}のプロフィール、経歴、哲学について。株式会社MetaHeroesのプロフェッショナルメンバーをご紹介します。`}
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": member.name,
          "jobTitle": member.role,
          "worksFor": {
            "@type": "Organization",
            "name": "株式会社MetaHeroes"
          },
          "image": member.heroImage
        }}
      />
      <div className="relative z-20">
        <HeroSection member={member} />
      </div>
      
      <div ref={philosophyRef} className="relative z-0">
        <PhilosophySection philosophy={member.philosophy} />
      </div>

      <motion.div 
        className="relative z-30"
        style={{ y: skillsY }}
      >
        <SkillsSection skills={member.skills} caseStudy={member.caseStudy} />
        <CareerSection career={member.career} />
        <QASection qa={member.qa} />
        <ScheduleSection schedule={member.schedule} />
        <BlogSection memberId={member.id} memberName={member.name} />
        <OtherMembersSection currentMemberId={member.id} allMembers={allMembers} />
      </motion.div>
    </main>
  );
};
