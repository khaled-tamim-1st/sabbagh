'use client';

import React from 'react';
import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface CustomLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>, NextLinkProps {
  children: React.ReactNode;
}

export const Link: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
};

export function useLocation(): [string, (to: string) => void] {
  const pathname = usePathname() || '/';
  const router = useRouter();
  return [pathname, (to: string) => router.push(to)];
}

export function useRoute<T extends Record<string, string> = Record<string, string>>(pattern: string): [boolean, T] {
  const pathname = usePathname() || '';
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
