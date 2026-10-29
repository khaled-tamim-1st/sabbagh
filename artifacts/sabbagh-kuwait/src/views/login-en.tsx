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

export default function LoginPageEn() {
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
      setError(err?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'painter') => {
    setError(null);
    try {
      await quickDemoLogin(role);
      if (role === 'admin') {
        setLocation('/admin');
      } else {
        setLocation('/painter');
      }
    } catch (err: any) {
      setError('Demo login is temporarily unavailable.');
    }
  };

  return (
    <Layout lang="en">
      <div className="bg-[#fbf9f4] min-h-screen py-14 px-4 sm:px-6 flex items-center justify-center" dir="ltr">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#17483e]/10 text-[#17483e] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#17483e]/15">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Portal Sign In
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1.5">
              Access your verified technician profile or admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#17483e]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#17483e]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 rounded-xl bg-[#17483e] hover:bg-[#123830] text-amber-200 font-bold text-sm transition-colors shadow-sm disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block text-center mb-3">
              One-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('painter')}
                className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Paintbrush className="w-3.5 h-3.5 text-emerald-600" />
                <span>Painter Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-stone-500">
            Don’t have a painter profile yet?{' '}
            <Link href="/en/join-painter/" className="font-bold text-[#17483e] hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
