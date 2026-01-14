import React from 'react';
import { PageHero } from '../components/PageHero';

export const RecruitPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <PageHero 
        titleEn="RECRUIT" 
        titleJa="採用情報"
      />
      
      {/* Video Section */}
      <section className="w-full overflow-hidden leading-[0]">
        <div className="w-full aspect-video md:aspect-[21/9] relative">
          <video 
            src="/assets/recruit/brand-movie.mp4"
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Message Image Section */}
      <section className="w-full overflow-hidden leading-[0]">
        <img 
          src="/assets/recruit/message.png" 
          alt="Message" 
          className="w-full h-auto object-cover"
        />
      </section>
    </main>
  );
};
