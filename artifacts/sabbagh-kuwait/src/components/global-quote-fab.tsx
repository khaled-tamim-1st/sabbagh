'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { LeadQuoteSection } from './lead-quote-section';

export function GlobalQuoteFab() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!mounted) return null;

  // STRICT RULE: Hide FAB on painter profile pages, painter dashboard, admin, and login
  const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isExcluded =
    currentPath.startsWith('/painters') ||
    currentPath.startsWith('/painter') ||
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/login');

  if (isExcluded) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div
        className="global-quote-fab-wrapper"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9990,
          direction: 'rtl',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="طلب معاينة مجانية وسعر فوري"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #17483e 0%, #0c2b24 100%)',
            color: '#e9bd77',
            border: '2px solid #e9bd77',
            borderRadius: '50px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(23, 72, 62, 0.45), 0 0 16px rgba(233, 189, 119, 0.25)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(23, 72, 62, 0.6), 0 0 20px rgba(233, 189, 119, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(23, 72, 62, 0.45), 0 0 16px rgba(233, 189, 119, 0.25)';
          }}
        >
          <span>طلب معاينة</span>
        </button>
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 9999,
            direction: 'rtl',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0e2d26 0%, #17483e 100%)',
              border: '1px solid rgba(233, 189, 119, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px 20px',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
              color: '#ffffff',
            }}
          >
            {/* زر الإغلاق */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
            >
              <X size={18} />
            </button>

            {/* الهيدر الخاص بالنافذة */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                طلب معاينة
              </h3>
              <p style={{ fontSize: '13px', color: '#c4d1c6', margin: 0 }}>
                أدخل بياناتك وسيتواصل معك فني لمعاينة الموقع وتحديد التكلفة
              </p>
            </div>

            {/* محتوى الفورم السريع */}
            <LeadQuoteSection isModal={true} onSuccess={() => {}} />
          </div>
        </div>
      )}
    </>
  );
}
