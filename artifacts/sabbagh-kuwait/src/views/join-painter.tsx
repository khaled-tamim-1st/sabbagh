'use client';

import { useState } from 'react';
import {
  UserPlus, CheckCircle2, ShieldCheck, Zap, Phone,
  MessageCircle, Award, Star,
  BadgeCheck, Users, Sparkles, ArrowRight, Building, User,
  Check, RefreshCw, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Link } from '@/lib/nav';
import { apiClient } from '@/lib/api-client';
import { compressImageToWebP } from '@/lib/image-compressor';

export default function JoinPainterPage() {
  // 1. Account Entity Type: 'company' | 'individual'
  const [accountType, setAccountType] = useState<'company' | 'individual'>('company');

  // Form Fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [commercialLicense, setCommercialLicense] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [years, setYears] = useState('8');
  const [crewSize, setCrewSize] = useState('5');
  const [startingPrice, setStartingPrice] = useState('18');
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>(['حولي', 'العاصمة']);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'دهان داخلي',
    'معجون وتنعيم أسقف',
    'ورق جدران',
  ]);
  const [description, setDescription] = useState('');

  // Logo / Avatar (Optional)
  const [avatarDataUri, setAvatarDataUri] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id?: number;
    slug?: string;
    accountType: 'company' | 'individual';
    name: string;
    phone: string;
    governorates: string[];
  } | null>(null);

  const allServices = [
    'دهان داخلي',
    'دهان خارجي',
    'ورق جدران',
    'ترميم وعلاج رطوبة',
    'ديكورات وبديل رخام',
    'معجون وتنعيم أسقف',
    'أصباغ إيطالية وسيلك',
  ];

  const allGovs = ['العاصمة', 'حولي', 'الفروانية', 'الأحمدي', 'الجهراء', 'مبارك الكبير'];

  const toggleGov = (gov: string) => {
    setSelectedGovernorates((prev) =>
      prev.includes(gov) ? prev.filter((g) => g !== gov) : [...prev, gov]
    );
  };

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  // Avatar / Logo Handler
  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUri = await compressImageToWebP(file, { maxWidth: 600, quality: 0.88 });
      setAvatarDataUri(dataUri);
    } catch (err) {
      console.error('Avatar compression error:', err);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const displayName = accountType === 'company' ? (companyName || name) : name;
    if (!displayName.trim()) {
      setErrorMessage(accountType === 'company' ? 'يرجى إدخال اسم المؤسسة أو الورشة.' : 'يرجى إدخال اسم الصباغ المعلم.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('البريد الإلكتروني وكلمة المرور مطلوبان لإنشاء حسابك.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
      return;
    }

    if (selectedGovernorates.length === 0) {
      setErrorMessage('يرجى اختيار محافظة واحدة على الأقل لنطاق التغطية.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
        accountType,
        name: displayName.trim(),
        companyName: accountType === 'company' ? (companyName || name).trim() : undefined,
        managerName: accountType === 'company' ? managerName.trim() : undefined,
        commercialLicense: accountType === 'company' ? commercialLicense.trim() : undefined,
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        region: selectedGovernorates[0] || 'كل المناطق',
        governorates: selectedGovernorates,
        services: selectedServices,
        years: years || '5',
        crewSize: accountType === 'company' ? crewSize || '4' : '1',
        startingAt: `${startingPrice} د.ك`,
        description: description.trim() || (accountType === 'company' ? `مؤسسة متخصصة في أعمال الأصباغ والتشطيبات الحديثة في الكويت.` : `صباغ محترف بخبرة في الدهانات الداخلية والخارجية والتشطيب.`),
        avatar: avatarDataUri || undefined,
      };

      const res = await apiClient.post<any>('/auth/register-painter', payload);

      // Auto-save auth session so painter is logged in immediately
      if (res?.token && res?.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      setSubmittedData({
        id: res?.painter?.id,
        slug: res?.painter?.slug,
        accountType,
        name: displayName,
        phone,
        governorates: selectedGovernorates,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(err?.message || 'تعذر إرسال طلب الانضمام، يرجى التأكد من البيانات والمحاولة مجدداً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeNav="/join-painter">
      {/* مسار التنقل المهيأ لمحركات البحث */}
      <Breadcrumbs items={[{ label: 'انضم كصباغ أو سجّل ورشتك', isCurrent: true }]} />

      {/* هيدر الصفحة المتجاوب للهواتف */}
      <section
        style={{
          background: '#17483e',
          color: '#f6f1e6',
          padding: 'clamp(32px, 5vw, 52px) 0 clamp(24px, 4vw, 40px)',
          borderBottom: '3px solid #e9bd77',
        }}
      >
        <div style={{ width: 'min(1192px, calc(100% - 32px))', margin: 'auto' }}>
          <span className="eyebrow" style={{ color: '#d9c597' }}>بوابة انضمام الورش والمعلمين</span>
          <h1
            style={{
              fontSize: 'clamp(24px, 5.5vw, 42px)',
              margin: '12px 0 10px',
              fontWeight: 800,
              lineHeight: 1.28,
            }}
          >
            انضم كصباغ معتمد وسجّل ورشتك في منصة صباغ الكويت 🇰🇼
          </h1>
          <p
            style={{
              margin: 0,
              color: '#d2dfd7',
              fontSize: 'clamp(13px, 3.8vw, 15px)',
              maxWidth: '680px',
              lineHeight: 1.85,
            }}
          >
            احصل على طلبات معاينة مباشرة ومحادثات واتساب من سكان منطقتك بدون وسطاء أو اقتطاع عمولات. سجّل بياناتك الآن وادخل إلى لوحة تحكمك لإضافة سابقة أعمالك ومشاريعك فوراً.
          </p>
        </div>
      </section>

      {/* شريط مميزات الانضمام المتجاوب */}
      <section style={{ background: '#f5efe3', borderBottom: '1px solid #e7decd', padding: '20px 0' }}>
        <div style={{ width: 'min(1192px, calc(100% - 32px))', margin: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#17483e',
                  color: '#e9bd77',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Zap size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', color: '#17483e', fontWeight: 700 }}>طلبات مباشرة 100%</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#687063' }}>اتصال وواتساب فوري بدون أي عمولة</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#17483e',
                  color: '#e9bd77',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Award size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', color: '#17483e', fontWeight: 700 }}>لوحة تحكم ومعرض سحابي</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#687063' }}>أضف مشاريعك وصور قبل وبعد بكل سهولة</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#17483e',
                  color: '#e9bd77',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <BadgeCheck size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', color: '#17483e', fontWeight: 700 }}>توثيق رسمي من الإدارة</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#687063' }}>شارة الصباغ المعتمد تزيد ثقة العملاء</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#17483e',
                  color: '#e9bd77',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', color: '#17483e', fontWeight: 700 }}>تغطية كافة مناطق الكويت</h4>
                <p style={{ margin: 0, fontSize: '11px', color: '#687063' }}>الظهور في صفحات المحافظات والمناطق</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* المحتوى الرئيسي */}
      <div className="join-container">
        {submittedData ? (
          /* شاشة تأكيد استلام الطلب المتجاوبة */
          <div
            style={{
              background: '#fffdf8',
              border: '2px solid #00a884',
              borderRadius: '24px',
              padding: 'clamp(28px, 6vw, 48px) clamp(16px, 5vw, 32px)',
              textAlign: 'center',
              maxWidth: '680px',
              margin: 'auto',
              boxShadow: '0 12px 40px rgba(0, 168, 132, 0.1)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#e6f7f2',
                color: '#00a884',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <span
              style={{
                display: 'inline-block',
                background: 'rgba(233,189,119,0.25)',
                color: '#8f6826',
                border: '1px solid #e9bd77',
                padding: '5px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              {submittedData.accountType === 'company' ? '🏢 تم تسجيل المؤسسة / الورشة بنجاح' : '👷‍♂️ تم تسجيل الصباغ المستقل بنجاح'}
            </span>

            <h2 style={{ fontSize: 'clamp(22px, 5vw, 26px)', color: '#17483e', margin: '0 0 12px', fontWeight: 800 }}>
              أهلاً بك معنا يا {submittedData.name}! 🚀
            </h2>

            <p style={{ fontSize: '14px', color: '#555f53', lineHeight: 1.85, margin: '0 auto 22px', maxWidth: '520px' }}>
              تم إنشاء حسابك وتجهيز ملفك الشخصي في منصة صباغ الكويت. يمكنك الآن الدخول فوراً إلى <strong>لوحة التحكم</strong> الخاصة بك لإضافة معرض وسابقة أعمالك وصور مشاريعك (صور عادية أو مقارنات قبل وبعد) لتظهر مباشرة في بروفايلك أمام أهل الكويت!
            </p>

            <div
              style={{
                background: '#f8f4ea',
                borderRadius: '16px',
                padding: '16px 18px',
                margin: '0 auto 26px',
                maxWidth: '460px',
                textAlign: 'right',
                fontSize: '13px',
                color: '#4d574a',
                border: '1px solid #e6ded0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>الاسم المسجل:</span>
                <strong style={{ color: '#17483e' }}>{submittedData.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>هاتف التواصل:</span>
                <span dir="ltr" style={{ fontWeight: 600 }}>{submittedData.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>المناطق المشمولة:</span>
                <span>{submittedData.governorates.join('، ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #d5ccbe' }}>
                <span>الخطوة التالية:</span>
                <span style={{ color: '#17483e', fontWeight: 800 }}>إضافة المشاريع من لوحة التحكم 🎨</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/painter"
                style={{
                  background: '#17483e',
                  color: '#e9bd77',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(23,72,62,0.25)',
                  minHeight: '48px',
                  flex: '1 1 220px',
                }}
              >
                <span>الدخول للوحة التحكم وإضافة أعمالي</span>
                <ArrowRight size={16} />
              </Link>

              {submittedData.id && (
                <Link
                  href={`/painters/${encodeURIComponent((submittedData as any).slug || (submittedData as any).name || submittedData.id)}`}
                  style={{
                    background: '#fff',
                    color: '#17483e',
                    border: '1.5px solid #17483e',
                    padding: '14px 20px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '48px',
                    flex: '1 1 160px',
                  }}
                >
                  معاينة بروفايلي
                </Link>
              )}
            </div>
          </div>
        ) : (
          /* نموذج التسجيل المتكامل المتجاوب للهاتف */
          <div className="join-main-grid">
            {/* استمارة التسجيل */}
            <form onSubmit={handleSubmit} className="join-form-card">
              {/* الخطوة 1: اختيار الكيان (مؤسسة أو فني) */}
              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(233,189,119,0.2)',
                    color: '#8a6218',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}
                >
                  الخطوة 1 من 3
                </span>
                <h3 style={{ fontSize: 'clamp(17px, 4.5vw, 20px)', color: '#17483e', margin: '4px 0 14px', fontWeight: 800 }}>
                  حدد نوع التسجيل في المنصة
                </h3>

                <div className="account-type-grid">
                  {/* خيار مؤسسة / ورشة */}
                  <button
                    type="button"
                    onClick={() => setAccountType('company')}
                    style={{
                      background: accountType === 'company' ? '#17483e' : '#faf6ee',
                      color: accountType === 'company' ? '#fffdf7' : '#17483e',
                      border: accountType === 'company' ? '2px solid #e9bd77' : '1px solid #e4dacb',
                      borderRadius: '16px',
                      padding: '16px 14px',
                      cursor: 'pointer',
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: accountType === 'company' ? '0 6px 20px rgba(23,72,62,0.18)' : 'none',
                      transition: 'all 0.2s ease',
                      minHeight: '100px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: accountType === 'company' ? 'rgba(233,189,119,0.25)' : '#eef5f1',
                          color: accountType === 'company' ? '#e9bd77' : '#17483e',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Building size={20} />
                      </div>
                      {accountType === 'company' ? (
                        <span style={{ background: '#e9bd77', color: '#17483e', borderRadius: '50%', width: '22px', height: '22px', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 800 }}>
                          ✓
                        </span>
                      ) : (
                        <span style={{ border: '1.5px solid #d4c7b5', borderRadius: '50%', width: '20px', height: '20px' }} />
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: 800 }}>
                        مؤسسة / ورشة صباغة
                      </h4>
                      <p style={{ margin: 0, fontSize: '11px', color: accountType === 'company' ? '#d0ddd4' : '#687265', lineHeight: 1.5 }}>
                        للشركات والورش التي تمتلك طاقم عمال وسجل تجاري
                      </p>
                    </div>
                  </button>

                  {/* خيار صباغ فني مستقل */}
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    style={{
                      background: accountType === 'individual' ? '#17483e' : '#faf6ee',
                      color: accountType === 'individual' ? '#fffdf7' : '#17483e',
                      border: accountType === 'individual' ? '2px solid #e9bd77' : '1px solid #e4dacb',
                      borderRadius: '16px',
                      padding: '16px 14px',
                      cursor: 'pointer',
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: accountType === 'individual' ? '0 6px 20px rgba(23,72,62,0.18)' : 'none',
                      transition: 'all 0.2s ease',
                      minHeight: '100px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background: accountType === 'individual' ? 'rgba(233,189,119,0.25)' : '#fdf8ec',
                          color: accountType === 'individual' ? '#e9bd77' : '#8a6116',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <User size={20} />
                      </div>
                      {accountType === 'individual' ? (
                        <span style={{ background: '#e9bd77', color: '#17483e', borderRadius: '50%', width: '22px', height: '22px', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 800 }}>
                          ✓
                        </span>
                      ) : (
                        <span style={{ border: '1.5px solid #d4c7b5', borderRadius: '50%', width: '20px', height: '20px' }} />
                      )}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 3px', fontSize: '15px', fontWeight: 800 }}>
                        صباغ فني مستقل
                      </h4>
                      <p style={{ margin: 0, fontSize: '11px', color: accountType === 'individual' ? '#d0ddd4' : '#687265', lineHeight: 1.5 }}>
                        للمعلمين المحترفين والفنيين الأفراد في الكويت
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* الخطوة 2: بيانات الاتصال وحساب الدخول */}
              <div style={{ marginBottom: '24px', borderTop: '1px solid #eee6d8', paddingTop: '20px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(233,189,119,0.2)',
                    color: '#8a6218',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}
                >
                  الخطوة 2 من 3
                </span>
                <h3 style={{ fontSize: 'clamp(16px, 4.2vw, 18px)', color: '#17483e', margin: '4px 0 14px', fontWeight: 800 }}>
                  {accountType === 'company' ? 'بيانات المؤسسة وحساب الدخول' : 'بيانات الفني وحساب الدخول'}
                </h3>

                {/* الحقول الخاصة بالمؤسسة */}
                {accountType === 'company' ? (
                  <div className="form-grid-2" style={{ marginBottom: '14px' }}>
                    <div>
                      <label className="form-label" htmlFor="company-name">اسم المؤسسة أو الورشة *</label>
                      <input
                        id="company-name"
                        name="company-name"
                        required
                        className="form-input"
                        placeholder="مثال: مؤسسة لون الدار للأصباغ"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="manager-name">اسم المدير أو المشرف المسؤول *</label>
                      <input
                        id="manager-name"
                        name="manager-name"
                        required
                        className="form-input"
                        placeholder="مثال: م. أحمد المطيري"
                        value={managerName}
                        onChange={(e) => setManagerName(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: '14px' }}>
                    <label className="form-label" htmlFor="painter-name">الاسم والكنية المهنية *</label>
                    <input
                      id="painter-name"
                      name="name"
                      required
                      className="form-input"
                      placeholder="مثال: المعلم أبو خالد الكندري"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}

                {/* الرقم التجاري وحجم الطاقم أو سنوات الخبرة */}
                <div className="form-grid-2" style={{ marginBottom: '14px' }}>
                  {accountType === 'company' ? (
                    <>
                      <div>
                        <label className="form-label" htmlFor="comm-license">رقم السجل التجاري / الترخيص (اختياري)</label>
                        <input
                          id="comm-license"
                          name="commercial-license"
                          className="form-input"
                          placeholder="مثال: CR-49821-KW"
                          value={commercialLicense}
                          onChange={(e) => setCommercialLicense(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="crew-size">حجم طاقم الفنيين بالورشة *</label>
                        <input
                          id="crew-size"
                          name="crew-size"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          max="50"
                          className="form-input"
                          value={crewSize}
                          onChange={(e) => setCrewSize(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="form-label" htmlFor="exp-years">سنوات الخبرة في الكويت *</label>
                      <input
                        id="exp-years"
                        name="experience-years"
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max="40"
                        className="form-input"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* الهاتف والواتساب */}
                <div className="form-grid-2" style={{ marginBottom: '14px' }}>
                  <div>
                    <label className="form-label" htmlFor="painter-phone">رقم هاتف الاتصال المباشر (كويتي) *</label>
                    <input
                      id="painter-phone"
                      name="phone"
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="form-input"
                      dir="ltr"
                      placeholder="+965XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="painter-wa">رقم الواتساب للمحادثات المباشرة *</label>
                    <input
                      id="painter-wa"
                      name="whatsapp"
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="form-input"
                      dir="ltr"
                      placeholder="+965XXXXXXXX"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>

                {/* البريد الإلكتروني وكلمة المرور لدخول لوحة التحكم */}
                <div className="form-grid-2" style={{ marginBottom: '14px' }}>
                  <div>
                    <label className="form-label" htmlFor="login-email">البريد الإلكتروني لدخول لوحة التحكم *</label>
                    <input
                      id="login-email"
                      name="email"
                      required
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className="form-input"
                      dir="ltr"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="login-password">كلمة المرور *</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="login-password"
                        name="password"
                        required
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        minLength={6}
                        className="form-input"
                        placeholder="6 أحرف على الأقل"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: '44px' }}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          left: '2px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#7a8277',
                          cursor: 'pointer',
                          width: '42px',
                          height: '42px',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* صورة الشعار أو البروفايل الشخصي */}
                <div style={{ marginTop: '16px' }}>
                  <label className="form-label">
                    {accountType === 'company' ? 'شعار المؤسسة أو لوجو الورشة (اختياري)' : 'صورة البروفايل الشخصية (اختياري)'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {avatarDataUri ? (
                      <div
                        style={{
                          position: 'relative',
                          width: '56px',
                          height: '56px',
                          borderRadius: accountType === 'company' ? '12px' : '50%',
                          overflow: 'hidden',
                          border: '2px solid #e9bd77',
                          flexShrink: 0,
                        }}
                      >
                        <img src={avatarDataUri} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => setAvatarDataUri(null)}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: 700,
                          }}
                        >
                          تغيير
                        </button>
                      </div>
                    ) : (
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#f4ece1',
                          border: '1px solid #dcd1c2',
                          padding: '11px 16px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          color: '#17483e',
                          fontWeight: 700,
                          cursor: 'pointer',
                          minHeight: '44px',
                        }}
                      >
                        <span>📷 اختيار صورة أو شعار</span>
                        <input type="file" accept="image/*" onChange={handleAvatarSelect} style={{ display: 'none' }} />
                      </label>
                    )}
                    <span style={{ fontSize: '11px', color: '#7a8277', lineHeight: 1.5 }}>
                      يتم ضغط الصورة تلقائياً لـ WebP وتجهيزها للعرض
                    </span>
                  </div>
                </div>
              </div>

              {/* الخطوة 3: التغطية والخدمات */}
              <div style={{ marginBottom: '24px', borderTop: '1px solid #eee6d8', paddingTop: '20px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(233,189,119,0.2)',
                    color: '#8a6218',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}
                >
                  الخطوة 3 من 3
                </span>
                <h3 style={{ fontSize: 'clamp(16px, 4.2vw, 18px)', color: '#17483e', margin: '4px 0 14px', fontWeight: 800 }}>
                  المحافظات ونوع الخدمات
                </h3>

                {/* المحافظات */}
                <div style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>
                    المحافظات التي تغطيها ورشتك * ({selectedGovernorates.length} محددة)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {allGovs.map((gov) => {
                      const active = selectedGovernorates.includes(gov);
                      return (
                        <button
                          key={gov}
                          type="button"
                          role="checkbox"
                          aria-checked={active}
                          onClick={() => toggleGov(gov)}
                          className={`touch-chip${active ? ' active' : ''}`}
                        >
                          {active ? '✓ ' : '+ '} {gov}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* الخدمات */}
                <div style={{ marginBottom: '18px' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>
                    الخدمات التي تتخصص بها * ({selectedServices.length} محددة)
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {allServices.map((srv) => {
                      const active = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          role="checkbox"
                          aria-checked={active}
                          onClick={() => toggleService(srv)}
                          className={`touch-chip${active ? ' active' : ''}`}
                        >
                          {active ? '✓ ' : '+ '} {srv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* سعر البدء والنبذة */}
                <div className="form-grid-split" style={{ marginBottom: '16px' }}>
                  <div>
                    <label className="form-label" htmlFor="starting-price">سعر البدء للغرفة (د.ك) *</label>
                    <input
                      id="starting-price"
                      name="starting-price"
                      type="number"
                      inputMode="numeric"
                      min="10"
                      max="150"
                      required
                      className="form-input"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="painter-desc">نبذة تعريفية ومميزات العمل</label>
                    <input
                      id="painter-desc"
                      name="description"
                      className="form-input"
                      placeholder="مثال: دقة في المواعيد، حماية تامة للأثاث، وضمان 5 سنوات"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* تنبيه مريح: معرض الأعمال يضاف من لوحة التحكم */}
              <div
                style={{
                  background: '#fcf7ec',
                  border: '1.5px solid #f1d59f',
                  borderRadius: '16px',
                  padding: '16px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#17483e',
                    color: '#e9bd77',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '13px', color: '#17483e', fontWeight: 800 }}>
                    معرض وسابقة أعمالك يضاف بعد التسجيل فوراً 📸✨
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#687266', lineHeight: 1.65 }}>
                    حرصاً على راحتك وسرعة تسجيلك، لا يتطلب هذا النموذج رفع صور الآن. بمجرد إكمال التسجيل ستنتقل إلى لوحة التحكم الخاصة بك حيث يمكنك إضافة مشاريعك وصور أعمالك ومقارنات قبل وبعد بكل أريحية، وستظهر فوراً في ملفك الشخصي أمام العملاء!
                  </p>
                </div>
              </div>

              {/* رسالة الخطأ إن وجدت */}
              {errorMessage && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* زر الإرسال المتجاوب المريح للمس */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  minHeight: '52px',
                  background: '#17483e',
                  color: '#e9bd77',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(23,72,62,0.25)',
                  opacity: isSubmitting ? 0.75 : 1,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>جاري تسجيل حسابك وتجهيز لوحة التحكم...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={19} />
                    <span>تسجيل الحساب والانضمام للمنصة 🚀</span>
                  </>
                )}
              </button>
            </form>

            {/* العمود الجانبي للمعلومات والمساعدة (يظهر تحت النموذج على الهاتف بمرونة) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: '#f8f4ea',
                  border: '1px solid #e7dcce',
                  borderRadius: '20px',
                  padding: '20px 18px',
                }}
              >
                <h4 style={{ margin: '0 0 10px', fontSize: '15px', color: '#17483e', fontWeight: 800 }}>
                  ماذا يحدث بعد إكمال التسجيل؟
                </h4>
                <ol style={{ margin: 0, paddingRight: '18px', fontSize: '12px', color: '#555f53', lineHeight: 1.9 }}>
                  <li>يتم إنشاء حسابك فورياً وتجهيز صفحتك الشخصية في الدليل.</li>
                  <li>تنتقل مباشرة إلى <strong>لوحة تحكم الصباغ</strong> عبر بريدك وكلمة المرور.</li>
                  <li>تقوم بالضغط على <strong>"إضافة مشروع جديد"</strong> لرفع صور شغلك أو مقارنات قبل وبعد.</li>
                  <li>تظهر صور أعمالك فوراً في بروفايلك أمام زوار وأهل الكويت.</li>
                  <li>تصلك طلبات المعاينة ومحادثات الواتساب مباشرة على هاتفك وبدون وسيط!</li>
                </ol>
              </div>

              <div
                style={{
                  background: '#17483e',
                  color: '#fff9ee',
                  borderRadius: '20px',
                  padding: '20px 18px',
                  border: '1px solid #e9bd77',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheck size={18} color="#e9bd77" />
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#e9bd77', fontWeight: 800 }}>
                    ضمان الخصوصية والشفافية
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#d2dfd7', lineHeight: 1.75 }}>
                  بياناتك محمية وطلبات العملاء تأتيك مباشرة على هاتفك والواتساب. المنصة لا تأخذ أي نسبة أو عمولة من قيمة أعمالك.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
