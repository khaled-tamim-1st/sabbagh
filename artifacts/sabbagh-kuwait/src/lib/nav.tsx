'use client';

import React from 'react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface CustomLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>, NextLinkProps {
  children: React.ReactNode;
}

function normalizeTrailingSlash(href: any): any {
  if (typeof href !== 'string') return href;
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  
  // Extract path vs hash/query
  const match = href.match(/^([^?#]+)([?#].*)?$/);
  if (!match) return href;
  const path = match[1];
  const rest = match[2] || '';

  // Exclude root and static files with extensions (.png, .xml, .txt, etc.)
  if (path === '/' || /\.[a-zA-Z0-9]{2,5}$/.test(path)) {
    return href;
  }

  if (!path.endsWith('/')) {
    return `${path}/${rest}`;
  }
  return href;
}

export const Link: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  const normalizedHref = normalizeTrailingSlash(href);
  return (
    <NextLink href={normalizedHref} {...props}>
      {children}
    </NextLink>
  );
};

export function useLocation(): [string, (to: string) => void] {
  let pathname = '/';
  try {
    pathname = usePathname() || '/';
  } catch {
    pathname = '/';
  }
  let push = (to: string) => {};
  try {
    const router = useRouter();
    if (router && typeof router.push === 'function') {
      push = (to: string) => router.push(normalizeTrailingSlash(to));
    }
  } catch {}
  return [pathname, push];
}

export function useRoute<T extends Record<string, string> = Record<string, string>>(pattern: string): [boolean, T] {
  let pathname = '';
  try {
    pathname = usePathname() || '';
  } catch {
    pathname = '';
  }
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return [false, {} as T];
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      const key = patternParts[i].slice(1);
      params[key] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return [false, {} as T];
    }
  }

  return [true, params as T];
}
