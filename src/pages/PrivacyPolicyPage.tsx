import React from 'react';
import { PageHero } from '../components/PageHero';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <PageHero 
        titleEn="PRIVACY POLICY" 
        titleJa="プライバシーポリシー"
      />

      <section className="py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-24">
            <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto text-sm">
              株式会社MetaHeroes（以下「当社」）は、当サイトにおいて提供するサービスにおける、ユーザーの個人情報の取り扱いについて、以下の通りプライバシーポリシーを定めます。
            </p>
          </div>

          <div className="space-y-24">
            <PolicyBlock title="（１）個人情報の取得について">
              当社は、ユーザーが当サイトを利用する際に、必要に応じて個人情報を取得します。取得する情報には、氏名、住所、電話番号、メールアドレスなどが含まれます。
            </PolicyBlock>

            <PolicyBlock title="（２）個人情報の利用目的">
              <p className="mb-6">当社は、取得した個人情報を以下の目的で利用します。</p>
              <ul className="space-y-4 list-none pl-0 inline-block text-left">
                {[
                  'ご注文の確認、発送、アフターサービスの提供',
                  'お問い合わせへの対応',
                  'メールマガジン、キャンペーン情報の配信',
                  'サービス向上のためのアンケート調査',
                  '法令に基づく対応'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-500">
                    <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </PolicyBlock>

            <PolicyBlock title="（３）個人情報の管理">
              <div className="space-y-6">
                <p>当社は、個人情報の正確性及び安全性を確保するため、適切なセキュリティ対策を講じます。</p>
                <p>個人情報の漏洩、紛失、改ざん、不正アクセスを防止するために、必要かつ適切な措置を実施します。</p>
              </div>
            </PolicyBlock>

            <PolicyBlock title="（４）個人情報の適用範囲">
              本プライバシーポリシーは、当ウェブサイト（<a href="https://meta-heroes.co.jp" className="text-blue-500 border-b border-blue-100 hover:border-blue-500 transition-colors">https://meta-heroes.co.jp</a>）においてのみ適用されます。
            </PolicyBlock>

            <PolicyBlock title="（５）個人情報の第三者提供">
              <p className="mb-6">当社は、以下の場合を除き、個人情報を第三者に提供することはありません。</p>
              <ul className="space-y-4 list-none pl-0 inline-block text-left">
                {['ユーザーの同意がある場合', '法令に基づく場合', '人の生命、身体、財産の保護に必要な場合'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-500">
                    <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </PolicyBlock>

            <PolicyBlock title="（６）クッキー（Cookie）の使用について">
              当サイトでは、ユーザーの利便性向上のためにクッキーを使用しています。クッキーの使用を拒否することも可能ですが、その場合、当サイトの一部機能が利用できなくなることがあります。
            </PolicyBlock>

            <PolicyBlock title="（７）プライバシーポリシーの変更">
              当社は、法令の変更やサービスの改善に伴い、本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載された時点で効力を生じるものとします。
            </PolicyBlock>

            <PolicyBlock title="（８）免責事項 - サイトポリシー">
              当サイトに掲載されている情報には万全を期していますが、当サイトの情報を利用することによって生じた損害に対して一切の責任（間接損害・特別損害・結果的損害及び付随的損害）を負うものではありません。情報の利用に関しましては全て最終自己責任で行って頂くようお願い申し上げます。
            </PolicyBlock>

            <div className="pt-24 mt-24 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
              <p className="text-gray-300 font-medium text-[10px] tracking-[0.4em] uppercase">Issued on December 3, 2021</p>
              <div className="w-8 h-px bg-gray-200" />
              <p className="text-gray-900 font-bold tracking-widest text-sm">株式会社MetaHeroes</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const PolicyBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="flex flex-col items-center text-center">
    <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">
      {title}
    </h2>
    <div className="text-gray-600 leading-loose font-medium text-sm md:text-base max-w-2xl text-justify md:text-center">
      {children}
    </div>
  </section>
);