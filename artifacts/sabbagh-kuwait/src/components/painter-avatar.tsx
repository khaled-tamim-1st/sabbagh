'use client';

import React, { useState } from 'react';

export interface PainterAvatarProps {
  painter: {
    id?: number;
    name?: string;
    avatarUrl?: string | null;
    initials?: string;
    tone?: string;
  };
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Universal Painter Avatar with graceful fallback.
 * If avatarUrl 404s or fails to load over network, automatically switches
 * to the painter initials badge with brand styling, preventing broken image icons.
 */
export function PainterAvatar({
  painter,
  size,
  className = '',
  style = {},
}: PainterAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials =
    painter.initials ||
    (painter.name
      ? painter.name
          .trim()
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
      : 'صب');

  const toneClass = painter.tone || 'ochre';

  if (painter.avatarUrl && !imgFailed) {
    return (
      <div
        className={`avatar ${className}`}
        style={{
          padding: 0,
          overflow: 'hidden',
          background: '#f8f4ea',
          border: '2px solid #e9bd77',
          width: size ? `${size}px` : undefined,
          height: size ? `${size}px` : undefined,
          ...style,
        }}
        aria-hidden="true"
      >
        <img
          src={painter.avatarUrl}
          alt={painter.name || 'الصباغ'}
          onError={() => setImgFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'inherit',
            display: 'block',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`avatar ${toneClass} ${className}`}
      style={{
        width: size ? `${size}px` : undefined,
        height: size ? `${size}px` : undefined,
        fontSize: size && size > 65 ? '26px' : undefined,
        ...style,
      }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
