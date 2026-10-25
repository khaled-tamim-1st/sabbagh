'use client';

import { useState, useMemo } from 'react';
import {
  Calculator, Home, Building2, Paintbrush, Layers,
  Calendar, Phone, CheckCircle2, ShieldCheck, MapPin,
  Clock, Sparkles, AlertCircle, ArrowLeft, Send
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { KUWAIT_GOVERNORATES } from '@/data/kuwait-areas';
import { Link } from '@/lib/nav';
import { apiClient } from '@/lib/api-client';

export default function RequestQuotePage() {
  // اختيارات النموذج
  const [propertyType, setPropertyType] = useState<'apartment' | 'villa' | 'qasima' | 'building' | 'commercial'>('apartment');
  const [workType, setWorkType] = useState<'interior' | 'exterior' | 'wallpaper' | 'decorative' | 'repair'>('interior');
  const [roomsCount, setRoomsCount] = useState<number>(3);
  const [includeMaterials, setIncludeMaterials] = useState<boolean>(true);
  const [paintQuality, setPaintQuality] = useState<'jotun-standard' | 'jotun-fenomastic' | 'caparol'>('jotun-fenomastic');
  const [selectedGovId, setSelectedGovId] = useState<string>('hawalli');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('al-salmiya');
  const [preferredDate, setPreferredDate] = useState<string>('morning');
  
  // بيانات العميل
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // حساب التكلفة التقديرية الفورية بالدينار الكويتي (KWD)
  const calculation = useMemo(() => {
    let baseRatePerRoom = 22; // تكلفة أساسية لصبغ الغرفة الواحدة
    
    // تعديل بناءً على نوع العمل
    if (workType === 'interior') baseRatePerRoom = 24;
    else if (workType === 'wallpaper') baseRatePerRoom = 28;
    else if (workType === 'decorative') baseRatePerRoom = 35;
    else if (workType === 'repair') baseRatePerRoom = 26;
    else if (workType === 'exterior') baseRatePerRoom = 75; // للواجهات

    // تعديل بناءً على نوع العقار
    let propertyMultiplier = 1;
    if (propertyType === 'villa' || propertyType === 'qasima') propertyMultiplier = 1.15;
    else if (propertyType === 'building') propertyMultiplier = 0.9; // خصم كميات

    // تكلفة المواد
    let materialCostPerRoom = 0;
    if (includeMaterials) {
      if (paintQuality === 'jotun-fenomastic') materialCostPerRoom = 14;
      else if (paintQuality === 'caparol') materialCostPerRoom = 12;
      else materialCostPerRoom = 10;
    }

    const totalMin = Math.round((baseRatePerRoom * 0.85 + materialCostPerRoom) * roomsCount * propertyMultiplier);
    const totalMax = Math.round((baseRatePerRoom * 1.25 + materialCostPerRoom * 1.15) * roomsCount * propertyMultiplier);
    const average = Math.round((totalMin + totalMax) / 2);

    // المدة التقديرية للأيام
    let daysEstimate = Math.ceil(roomsCount * 0.8);
    if (workType === 'exterior') daysEstimate = Math.max(5, roomsCount * 2);

    return {
      minKWD: totalMin,
      maxKWD: totalMax,
      averageKWD: average,
      laborEstimate: Math.round(average * (includeMaterials ? 0.6 : 1.0)),
      materialsEstimate: includeMaterials ? Math.round(average * 0.4) : 0,
      days: daysEstimate,
    };
  }, [propertyType, workType, roomsCount, includeMaterials, paintQuality]);

  // قائمة المناطق التابعة للمحافظة المختارة
  const currentGovernorate = useMemo(() => {
    return KUWAIT_GOVERNORATES.find((g) => g.id === selectedGovId) || KUWAIT_GOVERNORATES[0];
  }, [selectedGovId]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      setSubmitError('يرجى إدخال رقم الهاتف للتواصل وتأكيد موعد المعاينة.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await apiClient.post('/public/quotes', {
        customerName: customerName.trim() || 'عميل',
        customerPhone: customerPhone.trim(),
        customerNotes,
        propertyType,
        workType,
        roomsCount,
        includeMaterials,
        paintQuality,
        governorateId: selectedGovId,
        areaId: selectedAreaId,
        preferredDate,
        estimatedMinKwd: calculation.minKWD,
        estimatedMaxKwd: calculation.maxKWD,
        estimatedAverageKwd: calculation.averageKWD,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('API submission error:', err);
      setSubmitError(err?.message || 'تعذر إرسال الطلب حالياً، يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeNav="/request-quote">
      {/* مسار التنقل المهيأ لمحركات البحث */}
      <Breadcrumbs
        items={[
          { label: 'اطلب عرض سعر ومعاينة', isCurrent: true },
        ]}
      />

      {/* هيدر الصفحة الكلاسيكي */}
      <section style={{ background: '#17483e', color: '#f6f1e6', padding: '44px 0 36px', borderBottom: '3px solid #e9bd77' }}>
        <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: 'auto' }}>
          <span className="eyebrow" style={{ color: '#d9c597' }}>حاسبة التكلفة الميدانية</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', margin: '12px 0 8px', fontWeight: 700 }}>
            اطلب عرض سعر / معاينة فورية لبيتك
          </h1>
          <p style={{ margin: 0, color: '#d2dfd7', fontSize: '15px', maxWidth: '620px', lineHeight: 1.8 }}>
            حدد مواصفات منزلك وشاهد التكلفة الإرشادية بالدينار الكويتي في ثوانٍ، مع إمكانية حجز موعد معاينة مجاني مع أفضل صباغي منطقتك.
          </p>
        </div>
      </section>

      {/* المحتوى الرئيسي للنموذج والحاسبة */}
      <div style={{ width: 'min(1192px, calc(100% - 48px))', margin: '36px auto 70px' }}>
        
        {isSubmitted ? (
          <div
            style={{
              background: '#fffdf8',
              border: '1px solid #e8e1d3',
              borderRadius: '20px',
              padding: '48px 24px',
              textAlign: 'center',
              maxWidth: '650px',
              margin: 'auto',
              boxShadow: '0 8px 30px rgba(23,72,62,0.06)',
            }}
          >
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: '#eaf4ee',
                color: '#17483e',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '24px', color: '#17483e', margin: '0 0 12px' }}>تم استلام طلب المعاينة وعرض السعر!</h2>
            <p style={{ fontSize: '14px', color: '#687165', lineHeight: 1.9, margin: '0 auto 24px', maxWidth: '480px' }}>
              شكراً لك يا <strong>{customerName || 'عزيزنا العميل'}</strong>. متوسط التكلفة التقديرية لطلبك هو <strong>{calculation.averageKWD} د.ك</strong>.
              تم توجيه طلبك لأفضل صباغي منطقة <strong>{currentGovernorate.nameAr}</strong> للتنسيق معك على الرقم <strong>{customerPhone}</strong>.
            </p>

            <div style={{ background: '#f8f4ea', borderRadius: '12px', padding: '16px', margin: '0 auto 26px', maxWidth: '400px', textAlign: 'right', fontSize: '12px', color: '#596356' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>نطاق التكلفة التقديري:</span>
                <strong style={{ color: '#17483e' }}>{calculation.minKWD} - {calculation.maxKWD} د.ك</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>عدد الغرف / المساحات:</span>
                <span>{roomsCount} مساحات</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>الموعد المفضل للمعاينة:</span>
                <span>{preferredDate === 'morning' ? 'الفترة الصباحية (9ص - 1م)' : 'الفترة المسائية (4م - 8م)'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="contact-button" style={{ padding: '12px 24px', fontSize: '13px' }}>
                العودة لدليل الصباغين
              </Link>
              <button
                type="button"
                className="detail-button"
                onClick={() => setIsSubmitted(false)}
                style={{ padding: '12px 24px', fontSize: '13px' }}
              >
                تعديل الحسابات وطلب جديد
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'flex-start' }}>
            
            {/* العمود الأيمن: نموذج طلب السعر والتفاصيل */}
            <form
              onSubmit={handleSubmit}
              style={{
                background: '#fffdf8',
                border: '1px solid #e8e1d3',
                borderRadius: '20px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
            >
              {submitError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{submitError}</span>
                </div>
              )}
              <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '0 0 4px' }}>١. مواصفات المنزل ونوع العمل</h2>
              <p style={{ fontSize: '12px', color: '#7a7f74', margin: '0 0 20px' }}>اختر التفاصيل بدقة لتحصل على أفضل تقدير فوري</p>

              {/* نوع العقار */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label">نوع العقار</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'apartment', label: 'شقة' },
                    { id: 'villa', label: 'فيلا' },
                    { id: 'qasima', label: 'قسيمة' },
                    { id: 'building', label: 'عمارة' },
                    { id: 'commercial', label: 'مكتب / محل' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`filter-chip${propertyType === item.id ? ' active' : ''}`}
                      style={{ textAlign: 'center', justifyContent: 'center' }}
                      onClick={() => setPropertyType(item.id as any)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* نوع العمل */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label">نوع العمل المطلوب</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'interior', label: 'دهان داخلي كامل' },
                    { id: 'wallpaper', label: 'ورق جدران وديكور' },
                    { id: 'decorative', label: 'بديل رخام وخشب' },
                    { id: 'exterior', label: 'دهان خارجي واجهات' },
                    { id: 'repair', label: 'ترميم وعلاج رطوبة' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`filter-chip${workType === item.id ? ' active' : ''}`}
                      style={{ textAlign: 'center', justifyContent: 'center' }}
                      onClick={() => setWorkType(item.id as any)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* عدد الغرف / المساحات */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>عدد الغرف أو المساحات المراد صبغها</label>
                  <strong style={{ color: '#17483e', fontSize: '15px' }}>{roomsCount} مساحات / غرف</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRoomsCount(num)}
                      style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: roomsCount === num ? '#17483e' : '#ddd6c8',
                        background: roomsCount === num ? '#17483e' : '#fffdfa',
                        color: roomsCount === num ? '#fff9ee' : '#23483e',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* خيار المواد */}
              <div style={{ marginBottom: '24px', padding: '16px', background: '#f9f6ee', borderRadius: '12px', border: '1px solid #eee5d4' }}>
                <label className="form-label" style={{ marginTop: 0 }}>خيارات توفير المواد والأصباغ</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIncludeMaterials(true)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: includeMaterials ? '#17483e' : '#dcd5c7',
                      background: includeMaterials ? '#17483e' : '#fff',
                      color: includeMaterials ? '#fff' : '#45594e',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    شامل المواد والصبغ الأصلي
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeMaterials(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: !includeMaterials ? '#17483e' : '#dcd5c7',
                      background: !includeMaterials ? '#17483e' : '#fff',
                      color: !includeMaterials ? '#fff' : '#45594e',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}
                  >
                    مصنعية وعمالة فقط (أنا أوفر الصبغ)
                  </button>
                </div>

                {includeMaterials && (
                  <div>
                    <span style={{ fontSize: '11px', color: '#6e7668', display: 'block', marginBottom: '6px' }}>الماركة المفضلة:</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { id: 'jotun-fenomastic', label: 'جوتن فينوماستيك (الموصى به)' },
                        { id: 'caparol', label: 'كابارول ألماني' },
                        { id: 'jotun-standard', label: 'جوتن اقتصادي' },
                      ].map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setPaintQuality(q.id as any)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid',
                            borderColor: paintQuality === q.id ? '#c7664f' : '#d6cebe',
                            background: paintQuality === q.id ? '#fcf0ed' : '#fff',
                            color: paintQuality === q.id ? '#c7664f' : '#61675a',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <h2 style={{ fontSize: '20px', color: '#1d4038', margin: '26px 0 4px', borderTop: '1px solid #eee8dd', paddingTop: '20px' }}>
                ٢. موقع العقار وموعد المعاينة
              </h2>
              <p style={{ fontSize: '12px', color: '#7a7f74', margin: '0 0 16px' }}>لإرسال الصباغ الأقرب إلى منطقتك</p>

              {/* اختيار المحافظة والمنطقة */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" htmlFor="select-gov">المحافظة</label>
                  <select
                    id="select-gov"
                    className="form-input"
                    value={selectedGovId}
                    onChange={(e) => {
                      setSelectedGovId(e.target.value);
                      const gov = KUWAIT_GOVERNORATES.find((g) => g.id === e.target.value);
                      if (gov && gov.areas.length > 0) setSelectedAreaId(gov.areas[0].id);
                    }}
                  >
                    {KUWAIT_GOVERNORATES.map((g) => (
                      <option key={g.id} value={g.id}>{g.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="select-area">المنطقة</label>
                  <select
                    id="select-area"
                    className="form-input"
                    value={selectedAreaId}
                    onChange={(e) => setSelectedAreaId(e.target.value)}
                  >
                    {currentGovernorate.areas.map((area) => (
                      <option key={area.id} value={area.id}>{area.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* موعد المعاينة المفضل */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label">الموعد المفضل لزيارة المعاينة</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setPreferredDate('morning')}
                    className={`filter-chip${preferredDate === 'morning' ? ' active' : ''}`}
                    style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  >
                    صباحاً (٩ ص إلى ١ ظهراً)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredDate('evening')}
                    className={`filter-chip${preferredDate === 'evening' ? ' active' : ''}`}
                    style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}
                  >
                    مساءً (٤ م إلى ٨ مساءً)
                  </button>
                </div>
              </div>

              {/* بيانات الاتصال */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label" htmlFor="cust-name">الاسم الكريم</label>
                  <input
                    id="cust-name"
                    required
                    className="form-input"
                    placeholder="مثال: ناصر العبدلي"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="cust-phone">رقم الهاتف أو الواتساب</label>
                  <input
                    id="cust-phone"
                    required
                    type="tel"
                    className="form-input"
                    placeholder="مثال: 9XXXXXXX أو 6XXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label className="form-label" htmlFor="cust-notes">ملاحظات إضافية (اختياري)</label>
                <textarea
                  id="cust-notes"
                  className="form-textarea"
                  placeholder="أي تفاصيل عن حالة الطوفة، ألوان محددة، أو وقت البدء المناسب..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  style={{ minHeight: '65px' }}
                />
              </div>

              <button
                type="submit"
                className="contact-button"
                style={{ width: '100%', height: '48px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={16} />
                <span>تأكيد طلب المعاينة وعرض السعر الميداني</span>
              </button>
              <p className="form-note">المعاينة بدون أي التزام ولا يتم فرض أي رسوم للزيارة الميدانية الأولى.</p>
            </form>

            {/* العمود الأيسر: بطاقة الحاسبة الفورية الإرشادية */}
            <aside
              style={{
                position: 'sticky',
                top: '20px',
                background: '#fffdf8',
                border: '2px solid #e8e1d3',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 8px 30px rgba(23,72,62,0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#17483e', color: '#e9bd77', display: 'grid', placeItems: 'center' }}>
                  <Calculator size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#17483e' }}>الحاسبة التقديرية الفورية</h3>
                  <span style={{ fontSize: '11px', color: '#7a7d72' }}>وفق مؤشرات أسعار السوق الكويتي</span>
                </div>
              </div>

              {/* بطاقة السعر بالدينار الكويتي */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #17483e 0%, #205c50 100%)',
                  color: '#fff9ee',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '20px',
                  boxShadow: '0 6px 18px rgba(23,72,62,0.25)',
                }}
              >
                <span style={{ fontSize: '12px', color: '#d9c597', display: 'block', marginBottom: '4px' }}>التكلفة المتوقعة الإجمالية</span>
                <div style={{ fontSize: '34px', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {calculation.minKWD} - {calculation.maxKWD} <span style={{ fontSize: '16px', fontWeight: 600 }}>د.ك</span>
                </div>
                <span style={{ fontSize: '11px', color: '#b8d2c4', display: 'block', marginTop: '6px' }}>
                  متوسط تقديري: <strong>{calculation.averageKWD} دينار كويتي</strong>
                </span>
              </div>

              {/* تفاصيل التكلفة */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#555e53', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee8dc' }}>
                  <span>تقدير المصنعية والعمالة:</span>
                  <strong style={{ color: '#17483e' }}>~ {calculation.laborEstimate} د.ك</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee8dc' }}>
                  <span>تكلفة المواد والصبغ:</span>
                  <strong style={{ color: '#17483e' }}>{includeMaterials ? `~ ${calculation.materialsEstimate} د.ك` : 'على العميل'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #eee8dc' }}>
                  <span>المدة الزمنية المتوقعة:</span>
                  <strong style={{ color: '#17483e' }}>{calculation.days} أيام عمل تقريباً</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>الضمان الميداني:</span>
                  <strong style={{ color: '#4b8064' }}>سنتان على جودة الالتصاق</strong>
                </div>
              </div>

              {/* نصائح توفير التكلفة */}
              <div style={{ background: '#f5efe1', borderRadius: '12px', padding: '14px', fontSize: '11px', color: '#687063', lineHeight: 1.8 }}>
                <strong style={{ color: '#c7664f', display: 'block', marginBottom: '4px' }}>💡 نصيحة خبير صباغ الكويت:</strong>
                صبغ الشقة أو البيت بالكامل في زيارة واحدة يوفر لك ما يقارب <strong>20% إلى 25%</strong> مقارنة بصبغ كل غرفة بشكل منفصل، بسبب تقليل تكلفة تحريك السقالات والعمالة.
              </div>
            </aside>
          </div>
        )}

      </div>
    </Layout>
  );
}
