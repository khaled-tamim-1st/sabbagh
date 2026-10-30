'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from '@/lib/nav';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldCheck,
  Paintbrush,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  UserCheck,
  AlertCircle,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { Layout } from '@/components/layout';

export default function LoginPage() {
  const { user, login, quickDemoLogin, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setLocation('/admin');
      } else if (user.role === 'painter') {
        setLocation('/painter');
      }
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/painter');
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'painter') => {
    setError(null);
    setIsSubmitting(true);
    try {
      const loggedUser = await quickDemoLogin(role);
      if (loggedUser.role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/painter');
      }
    } catch (err: any) {
      setError(err?.message || 'تعذر تسجيل الدخول التجريبي');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout activeNav="/login">
      <div
        dir="rtl"
        style={{
          minHeight: '80vh',
          background: 'linear-gradient(180deg, #f5efe3 0%, #ebe2d1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            background: '#fffdf9',
            borderRadius: '24px',
            border: '1px solid #e2d7c5',
            boxShadow: '0 12px 40px rgba(23, 72, 62, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Top Decorative Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #17483e 0%, #0d2e27 100%)',
              color: '#fff9ee',
              padding: '32px 24px 28px',
              textAlign: 'center',
              borderBottom: '4px solid #e9bd77',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(233, 189, 119, 0.15)',
                border: '1px solid #e9bd77',
                color: '#e9bd77',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 14px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <Lock size={26} />
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#e9bd77',
                letterSpacing: '0.05em',
                background: 'rgba(233, 189, 119, 0.12)',
                padding: '4px 12px',
                borderRadius: '999px',
                display: 'inline-block',
                marginBottom: '8px',
              }}
            >
              بوابة الوصول المعتمدة
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 6px', letterSpacing: '-0.02em' }}>
              تسجيل الدخول إلى صباغ الكويت
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#c7d6ce', lineHeight: 1.6 }}>
              لوحة تحكم إدارة المنصة ومساحة عمل الصباغين المعتمدين
            </p>
          </div>

          <div style={{ padding: '28px 24px' }}>
            {/* Admin Management Quick Access */}
            <div
              style={{
                background: '#faf6ee',
                border: '1px solid #e4d7c3',
                borderRadius: '16px',
                padding: '14px 16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#17483e" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#17483e' }}>
                  دخول لوحة تحكم الإدارة:
                </span>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleQuickLogin('admin')}
                style={{
                  background: '#17483e',
                  color: '#e9bd77',
                  border: '0',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>دخول الإدارة</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#fdf2f0',
                  border: '1px solid #f2c7c0',
                  color: '#b83226',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} aria-label="تسجيل الدخول إلى منصة صباغ الكويت" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  htmlFor="login-email"
                  style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#23483e', marginBottom: '6px' }}
                >
                  البريد الإلكتروني
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-label="البريد الإلكتروني"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@sabbagh-kuwait.com"
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 14px',
                      borderRadius: '12px',
                      border: '1px solid #dcd4c6',
                      background: '#fff',
                      fontSize: '14px',
                      color: '#17483e',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <Mail
                    size={18}
                    color="#4a5649"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#23483e', marginBottom: '6px' }}
                >
                  كلمة المرور
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-label="كلمة المرور"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 14px',
                      borderRadius: '12px',
                      border: '1px solid #dcd4c6',
                      background: '#fff',
                      fontSize: '14px',
                      color: '#17483e',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <KeyRound
                    size={18}
                    color="#4a5649"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                aria-label="تسجيل الدخول إلى لوحة التحكم"
                disabled={isSubmitting}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  background: '#17483e',
                  color: '#fff9ee',
                  border: '0',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(23,72,62,0.2)',
                }}
              >
                <span>{isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Bottom Links */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #eee5d7',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
              }}
            >
              <Link href="/join-painter" style={{ color: '#9c3b24', fontWeight: 600, textDecoration: 'none' }}>
                لست مسجلاً؟ انضم كصباغ
              </Link>
              <Link href="/" style={{ color: '#4a5649', textDecoration: 'none' }}>
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
