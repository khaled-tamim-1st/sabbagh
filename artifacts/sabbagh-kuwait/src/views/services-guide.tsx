'use client';

import { useState } from 'react';
import {
  BookOpen, Sparkles, Sun, ShieldAlert, CheckCircle2,
  Layers, Clock, HelpCircle, ArrowLeft, Paintbrush,
  Flame, Droplets, Wind, Calculator, Phone
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { KUWAIT_SERVICES_DATA, KUWAIT_PAINTING_MARKET_TIPS, type KuwaitService } from '@/data/services-data';
import { Link } from '@/lib/nav';

export default function ServicesGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeServiceModal, setActiveServiceModal] = useState<KuwaitService | null>(null);

  const categories = [
    { id: 'all', label: 'كافة الخدمات (12)' },
    { id: 'interior', label: 'أصباغ داخلية' },
    { id: 'exterior', label: 'واجهات وسيجما' },
    { id: 'decorative', label: 'أصباغ ديكورية وميكروسمنت' },
    { id: 'cladding', label: 'بديل رخام وجبس بورد' },
    { id: 'wallpaper', label: 'ورق جدران' },
    { id: 'flooring', label: 'أرضيات إيبوكسي' },
    { id: 'woodwork', label: 'صبغ أبواب وخشب' },
    { id: 'insulation', label: 'عوازل أسطح' },
    { id: 'repair', label: 'معالجة الرطوبة والنش' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? KUWAIT_SERVICES_DATA
    : KUWAIT_SERVICES_DATA.filter((s) => s.category === selectedCategory);

  return (
    <Layout activeNav="/services-guide">
      {/* مسار التنقل المهيأ لمحركات البحث */}
      <Breadcrumbs
        items={[
          { label: 'دليل الأصباغ والديكورات', isCurrent: true },
        ]}
      />

      {/* هيدر الصفحة */}
      <section style={{ background: '#17483e', color: '#f6f1e6', padding: '52px 0 42px', borderBottom: '3px solid #e9bd77' }}>
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <span className="eyebrow" style={{ color: '#d9c597' }}>الدليل الشامل للتشطيبات</span>
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', margin: '14px 0 10px', fontWeight: 700 }}>
            دليل الأصباغ والديكورات في الكويت
          </h1>
          <p style={{ margin: 0, color: '#d2dfd7', fontSize: '15px', maxWidth: '640px', lineHeight: 1.9 }}>
            تعرّف على أنواع الأصباغ الموصى بها لمناخ وطقس الكويت، ونطاقات الأسعار التقريبية بالدينار الكويتي، وأفضل الماركات المعتمدة (جوتن، همبل، كابارول).
          </p>
        </div>
      </section>

      {/* قسم خصوصية مناخ الكويت: الحرارة والغبار والرطوبة */}
      <section style={{ background: '#f5efe3', borderBottom: '1px solid #e7decd', padding: '34px 0' }}>
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', color: '#c7664f', fontWeight: 700 }}>نصائح الخبراء لطبيعة البناء الكويتي</span>
            <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '4px 0' }}>كيف تختار الصبغ المناسب لطقس الكويت؟</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            
            <div style={{ background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Flame size={20} color="#c7664f" />
                <strong style={{ color: '#17483e', fontSize: '14px' }}>حرارة الصيف وأشعة UV</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#687063', lineHeight: 1.8 }}>
                للواجهات الخارجية، احرص على دهان <strong>جوتن جوتاشيلد إكستريم (Jotashield Extreme)</strong> العاكس للحرارة، لتقليل امتصاص الجدران للحرارة وتوفير استهلاك التكييف بنسبة تصل إلى 15%.
              </p>
            </div>

            <div style={{ background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Droplets size={20} color="#3b6465" />
                <strong style={{ color: '#17483e', fontSize: '14px' }}>رطوبة السواحل ونش المكيفات</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#687063', lineHeight: 1.8 }}>
                في المناطق الساحلية (السالمية، الفنطاس، الخيران)، يجب عزل الطوفة ببرايمر مائي مانع للأملاح قبل الدهان، واستخدام صبغ ربع لمعة قابل للمسح والغسيل المتكرر.
              </p>
            </div>

            <div style={{ background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Wind size={20} color="#b08d53" />
                <strong style={{ color: '#17483e', fontSize: '14px' }}>الغبار ومقاومة الأتربة (السافي)</strong>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#687063', lineHeight: 1.8 }}>
                اختر أصباغاً ذات تركيبة نانوية تقلل من التصاق الغبار، وتجنب الأصباغ ذات الملمس الخشن جداً في الطوابق الأرضية لأنها تحبس الأتربة وتصعب تنظيفها.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* بطاقات الخدمات والدليل */}
      <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: '40px auto 80px' }}>
        
        {/* فلاتر تصنيف الخدمات */}
        <div className="filters" style={{ marginBottom: '26px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip${selectedCategory === cat.id ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* شبكة بطاقات الخدمات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
          {filteredServices.map((service) => (
            <article
              key={service.id}
              id={service.slug}
              style={{
                background: '#fffdf8',
                border: '1px solid #e8e1d3',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="tag" style={{ background: '#f2eee5', color: '#17483e', fontWeight: 600 }}>
                    {service.categoryLabelAr}
                  </span>
                  <span style={{ fontSize: '11px', color: '#888b7d' }}>{service.executionTime}</span>
                </div>

                <h3 style={{ fontSize: '18px', color: '#1d4038', margin: '0 0 8px', fontWeight: 700 }}>
                  {service.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#687165', lineHeight: 1.8, margin: '0 0 16px' }}>
                  {service.description}
                </p>

                {/* الماركات الموصى بها */}
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ fontSize: '11px', color: '#7a7f74', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    الماركات المعتمدة في الكويت:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {service.popularBrands.map((b, i) => (
                      <span key={i} className="tag" style={{ background: '#f8f5ee', border: '1px solid #e6ded0', fontSize: '10px' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ميزات الخدمة */}
                <ul style={{ margin: '0 0 18px', paddingRight: '18px', fontSize: '12px', color: '#555e53', lineHeight: 1.8 }}>
                  {service.features.slice(0, 3).map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              {/* بطاقة السعر بالدينار الكويتي وزر التفاصيل */}
              <div style={{ borderTop: '1px solid #eee8dc', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#828378', display: 'block' }}>نطاق السعر الإرشادي</span>
                    <strong style={{ fontSize: '17px', color: '#17483e' }}>
                      {service.price.fromKWD} - {service.price.toKWD} د.ك
                    </strong>
                    <span style={{ fontSize: '11px', color: '#6d746a' }}> ({service.price.unit})</span>
                  </div>

                  <span className="tag" style={{ background: '#eaf4ee', color: '#275347', fontWeight: 700 }}>
                    {service.price.includesMaterials ? 'شامل المواد' : 'مصنعية فقط'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="detail-button"
                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'grid', placeItems: 'center' }}
                  >
                    صفحة الخدمة والأسعار
                  </Link>

                  <Link
                    href={`/request-quote?service=${encodeURIComponent(service.id)}`}
                    className="contact-button"
                    style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'grid', placeItems: 'center' }}
                  >
                    طلب عرض سعر
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* جدول مقارنة الأسعار الاسترشادي العام */}
        <section style={{ marginTop: '50px', background: '#fffdf8', border: '1px solid #e8e1d3', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '0 0 8px' }}>
            جدول متوسط أسعار الأصباغ والديكورات في الكويت (KWD)
          </h2>
          <p style={{ fontSize: '13px', color: '#72776d', margin: '0 0 20px' }}>
            دليل إرشادي محدث لمتوسط التكاليف بالسوق الكويتي شامل الصبغ الأصلي والعمالة.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'right' }}>
              <thead>
                <tr style={{ background: '#f5efe1', borderBottom: '2px solid #e1d7c5', color: '#17483e' }}>
                  <th style={{ padding: '12px 14px' }}>نوع الخدمة</th>
                  <th style={{ padding: '12px 14px' }}>وحدة القياس</th>
                  <th style={{ padding: '12px 14px' }}>نطاق السعر</th>
                  <th style={{ padding: '12px 14px' }}>المتوسط التقديري</th>
                  <th style={{ padding: '12px 14px' }}>المواد المشمولة</th>
                </tr>
              </thead>
              <tbody>
                {KUWAIT_SERVICES_DATA.map((srv, idx) => (
                  <tr key={srv.id} style={{ borderBottom: '1px solid #eee8dc', background: idx % 2 === 0 ? '#fff' : '#fcfaf6' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#23483e' }}>{srv.shortName}</td>
                    <td style={{ padding: '12px 14px', color: '#687063' }}>{srv.price.unit}</td>
                    <td style={{ padding: '12px 14px', color: '#17483e', fontWeight: 700 }}>
                      {srv.price.fromKWD} - {srv.price.toKWD} د.ك
                    </td>
                    <td style={{ padding: '12px 14px', color: '#c7664f', fontWeight: 700 }}>~ {srv.price.averageKWD} د.ك</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="tag" style={{ background: srv.price.includesMaterials ? '#eaf4ee' : '#f2eee5', color: srv.price.includesMaterials ? '#215045' : '#687063' }}>
                        {srv.price.includesMaterials ? 'شامل الصبغ والمعجون' : 'مصنعية فقط'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* نافذة تفاصيل خطوات الخدمة والنصائح (Service Modal) */}
      {activeServiceModal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setActiveServiceModal(null); }}
        >
          <div className="modal" role="dialog" aria-modal="true" style={{ width: 'min(620px, 100%)' }}>
            <div className="modal-head">
              <div>
                <h3 className="modal-title">{activeServiceModal.title}</h3>
                <p className="modal-subtitle">{activeServiceModal.tagline}</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setActiveServiceModal(null)}
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div style={{ background: '#f5efe1', padding: '14px', borderRadius: '12px', marginBottom: '18px', fontSize: '13px', color: '#4d574b', lineHeight: 1.8 }}>
                <strong>خصوصية الخدمة في الكويت:</strong> {activeServiceModal.whyInKuwait}
              </div>

              <h4 style={{ color: '#17483e', fontSize: '14px', margin: '0 0 10px' }}>خطوات التنفيذ الاحترافية:</h4>
              <ol style={{ paddingRight: '20px', margin: '0 0 20px', fontSize: '12px', color: '#555e53', lineHeight: 2 }}>
                {activeServiceModal.executionSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>

              <h4 style={{ color: '#17483e', fontSize: '14px', margin: '0 0 10px' }}>نصائح الخبير قبل البدء:</h4>
              <ul style={{ paddingRight: '20px', margin: '0 0 20px', fontSize: '12px', color: '#555e53', lineHeight: 2 }}>
                {activeServiceModal.expertAdvice.map((adv, idx) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/request-quote"
                  className="contact-button modal-action"
                  style={{ textAlign: 'center', textDecoration: 'none', display: 'grid', placeItems: 'center', margin: 0 }}
                  onClick={() => setActiveServiceModal(null)}
                >
                  احسب تكلفة بيتك الآن
                </Link>
                <button
                  type="button"
                  className="detail-button"
                  style={{ padding: '0 20px' }}
                  onClick={() => setActiveServiceModal(null)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
