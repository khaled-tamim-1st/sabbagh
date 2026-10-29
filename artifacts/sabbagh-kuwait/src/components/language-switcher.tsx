'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import NextLink from 'next/link';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'text' | 'compact';
}

export function LanguageSwitcher({ className = '', variant = 'pill' }: LanguageSwitcherProps) {
  let pathname = '/';
  try {
    pathname = usePathname() || '/';
  } catch {
    pathname = '/';
  }
  const isEn = pathname === '/en' || pathname.startsWith('/en/');

  // Compute opposite path
  let targetPath = '/';
  if (isEn) {
    // English -> Arabic
    targetPath = pathname.replace(/^\/en(\/|$)/, '/');
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }
  } else {
    // Arabic -> English
    targetPath = '/en' + (pathname === '/' ? '' : pathname);
  }

  // Ensure trailing slash consistency if needed
  if (!targetPath.endsWith('/') && !targetPath.includes('.')) {
    targetPath += '/';
  }

  const label = isEn ? 'العربية' : 'English';
  const ariaLabel = isEn ? 'التبديل إلى اللغة العربية' : 'Switch to English';

  if (variant === 'compact') {
    return (
      <NextLink
        href={targetPath}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors ${
          isEn
            ? 'bg-[#17483e] text-[#f5efdf] border-[#17483e] hover:bg-[#123830]'
            : 'bg-white/90 text-[#17483e] border-emerald-200 hover:bg-emerald-50'
        } ${className}`}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        <Globe size={13} className="shrink-0" />
        <span>{label}</span>
      </NextLink>
    );
  }

  return (
    <NextLink
      href={targetPath}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg border shadow-xs transition-all duration-200 ${
        isEn
          ? 'bg-amber-500/10 text-amber-900 border-amber-300 hover:bg-amber-500/20'
          : 'bg-[#17483e]/10 text-[#17483e] border-[#17483e]/20 hover:bg-[#17483e]/15'
      } ${className}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Globe size={15} className="shrink-0 text-[#17483e]" />
      <span>{label}</span>
    </NextLink>
  );
}

export default LanguageSwitcher;
