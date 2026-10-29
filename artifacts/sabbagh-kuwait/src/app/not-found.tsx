'use client';

import React from 'react';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf6ee] p-4" dir="rtl">
      <div className="max-w-md w-full bg-white border border-[#e5d9c7] rounded-2xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-[#fbeae5] text-[#c7664f] flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-[#17483e] mb-2">عذراً، الصفحة غير موجودة (404)</h1>
        <p className="text-sm text-[#687266] mb-6 leading-relaxed">
          الصفحة التي تبحث عنها قد تم نقلها أو أن الرابط غير صحيح. يمكنك العودة إلى الدليل الرئيسي للعثور على صباغين في منطقتك.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#17483e] text-[#fff8eb] font-bold py-3 px-6 rounded-xl hover:bg-[#123830] transition-colors w-full"
        >
          <Home size={18} />
          <span>العودة للصفحة الرئيسية</span>
        </a>
      </div>
    </div>
  );
}
