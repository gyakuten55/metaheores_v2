import React from 'react';
import { PageHero } from '../components/PageHero';

export const ContactPrivacyPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <PageHero 
        titleEn="CONTACT PRIVACY" 
        titleJa="お問い合わせにおける個人情報の取り扱い"
      />

      <section className="py-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-24">
            <p className="text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto text-sm">
              お問い合わせにあたっては、以下の事項にご同意いただいた上で、情報を送信してください。
            </p>
          </div>

          <div className="space-y-24">
            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（１）組織の名称又は氏名</h2>
              <div className="text-gray-600 font-medium">株式会社 Meta Heroes</div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（２）個人情報保護管理者（若しくはその代理人）の氏名又は職名、所属及び連絡先</h2>
              <div className="text-gray-600 font-medium">
                <p>個人情報保護管理者：周藤 剛</p>
                <p>連絡先：06-7777-3593</p>
              </div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（３）個人情報の利用目的</h2>
              <div className="text-gray-600 font-medium">お問い合わせいただいた内容に回答するため</div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（４）個人情報の第三者提供について</h2>
              <div className="text-gray-600 font-medium">取得した個人情報は、法令等による場合を除いて第三者に提供しません。</div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（５）個人情報の取扱いの委託について</h2>
              <div className="text-gray-600 font-medium">取得した個人情報の取扱いの全部又は、一部を委託することはありません。</div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（６）個人情報を与えなかった場合に生じる結果</h2>
              <div className="text-gray-600 font-medium text-justify md:text-center">個人情報を与えることは任意です。個人情報に関する情報の一部をご提供いただけない場合は、お問い合わせ内容に回答できない可能性があります。</div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（７）保有個人データの開示等および問い合わせ窓口について</h2>
              <div className="text-gray-600 font-medium text-justify md:text-center">
                ご本人からの求めにより、当社が保有する保有個人データに関する開示、利用目的の通知、内容の訂正・追加または削除、利用停止、消去、第三者提供の停止および第三者提供記録の開示（以下、開示等という）に応じます。<br /><br />
                開示等に応ずる窓口は、下記「当社の個人情報の取扱いに関する苦情、相談等の問合せ先」を参照してください。
              </div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（８）本人が容易に認識できない方法による個人情報の取得</h2>
              <div className="text-gray-600 font-medium text-justify md:text-center">クッキーやウェブビーコン等を用いるなどして、本人が容易に認識できない方法による個人情報の取得を行っておりません。</div>
            </section>

            <section className="flex flex-col items-center text-center">
              <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-6">（９）個人情報保護方針</h2>
              <div className="text-gray-600 font-medium">
                当社ホームページの個人情報保護方針をご覧ください。
              </div>
            </section>

            <section className="pt-16 border-t border-gray-100 mt-32 text-center">
              <h2 className="text-sm font-bold text-gray-900 tracking-[0.2em] mb-12">（１０）当社の個人情報の取扱いに関する苦情、相談等の問合せ先</h2>
              <div className="grid md:grid-cols-2 gap-12 text-gray-700">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase block mb-2">Service Name</label>
                    <p className="text-sm font-bold">個人情報問合せ窓口</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase block mb-2">Officer</label>
                    <p className="text-sm font-bold">お問い合わせ窓口担当：周藤 剛</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase block mb-2">Telephone</label>
                    <p className="text-sm font-bold">06-7777-3593</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase block mb-2">Address</label>
                    <p className="text-sm font-bold leading-relaxed">
                      〒530-0027<br />
                      大阪府大阪市北区堂山町1-5 三共梅田ビル8F
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-24 mt-24 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
              <p className="text-gray-300 font-medium text-[10px] tracking-[0.4em] uppercase">Issued on November 4, 2025</p>
              <div className="w-8 h-px bg-gray-200" />
              <p className="text-gray-900 font-bold tracking-widest text-sm">株式会社MetaHeroes</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};