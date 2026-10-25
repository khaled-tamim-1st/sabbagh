'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  X,
  RefreshCw,
  Camera,
} from 'lucide-react';

interface AvatarCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedWebpBase64: string) => Promise<void> | void;
  isSaving?: boolean;
}

export const AvatarCropperModal: React.FC<AvatarCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  isSaving = false,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset adjustments whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Live mini preview rendering
  const renderPreview = useCallback(() => {
    if (!imageRef.current || !previewCanvasRef.current || !imageLoaded) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 100;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = '#17483e';
    ctx.fillRect(0, 0, size, size);

    // Transform
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x * (size / 280), offset.y * (size / 280));

    const img = imageRef.current;
    const aspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = size;
    let drawHeight = size;

    if (aspect >= 1) {
      drawHeight = size;
      drawWidth = size * aspect;
    } else {
      drawWidth = size;
      drawHeight = size / aspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }, [imageLoaded, zoom, rotation, offset]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  // Mouse / Touch handlers for dragging (Pan)
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(3, Math.max(1, prev + delta)));
  };

  // Generate final high-res cropped WebP
  const handleConfirmCrop = async () => {
    if (!imageRef.current) return;
    const img = imageRef.current;

    const outputSize = 600; // 600x600 high resolution WebP
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Transform mapping from 280px display circle to 600px output canvas
    const scaleFactor = outputSize / 280;

    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);

    const aspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = outputSize;
    let drawHeight = outputSize;

    if (aspect >= 1) {
      drawHeight = outputSize;
      drawWidth = outputSize * aspect;
    } else {
      drawWidth = outputSize;
      drawHeight = outputSize / aspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    // Export as optimized WebP
    const webpDataUrl = canvas.toDataURL('image/webp', 0.88);
    await onCropComplete(webpDataUrl);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(11, 20, 26, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          background: '#111b21',
          border: '1px solid #233138',
          borderRadius: '24px',
          width: 'min(480px, 100%)',
          color: '#e9edef',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #202c33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#00a88420',
                color: '#00a884',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#e9edef' }}>
                تحديد وضبط صورة البروفايل
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#8696a0' }}>
                اسحب وحرّك لتوسيط الوجه داخل الدائرة (مثل واتساب)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8696a0',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewport Area */}
        <div
          style={{
            padding: '24px',
            background: '#0c1317',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            userSelect: 'none',
          }}
        >
          {/* Circular Cropping Viewport */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => {
              if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchMove={(e) => {
              if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
            }}
            onTouchEnd={handleEnd}
            style={{
              width: '280px',
              height: '280px',
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 0 9999px rgba(11, 20, 26, 0.75), 0 0 0 2px #00a884',
              cursor: isDragging ? 'grabbing' : 'grab',
              background: '#182229',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* The Image to be transformed */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="الصورة للتعديل"
              onLoad={() => setImageLoaded(true)}
              draggable={false}
              style={{
                maxWidth: 'none',
                maxHeight: 'none',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                pointerEvents: 'none',
                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
            />

            {/* Grid overlay for rule of thirds */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                border: '1px dashed rgba(255, 255, 255, 0.35)',
                borderRadius: '50%',
                opacity: isDragging ? 0.9 : 0.4,
                transition: 'opacity 0.2s',
              }}
            />
          </div>

          {/* Hint text */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '16px',
              fontSize: '11px',
              color: '#8696a0',
            }}
          >
            <Move size={13} />
            <span>اسحب الصورة لتحريكها • استخدم العجلة أو الشريط للتكبير</span>
          </div>
        </div>

        {/* Controls Bar */}
        <div style={{ padding: '18px 24px', background: '#111b21', borderTop: '1px solid #202c33' }}>
          {/* Zoom Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(1, prev - 0.15))}
              style={{
                background: '#202c33',
                border: 'none',
                color: '#e9edef',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
              title="تصغير"
            >
              <ZoomOut size={16} />
            </button>

            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              style={{
                flex: 1,
                accentColor: '#00a884',
                cursor: 'pointer',
                height: '6px',
              }}
            />

            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, prev + 0.15))}
              style={{
                background: '#202c33',
                border: 'none',
                color: '#e9edef',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
              title="تكبير"
            >
              <ZoomIn size={16} />
            </button>

            <span style={{ fontSize: '12px', color: '#00a884', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Action Tools (Rotate, Reset, Mini Preview) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleRotate}
                style={{
                  background: '#202c33',
                  border: '1px solid #2a3942',
                  color: '#e9edef',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <RotateCw size={14} />
                <span>تدوير 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: '#202c33',
                  border: '1px solid #2a3942',
                  color: '#8696a0',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} />
                <span>إعادة ضبط</span>
              </button>
            </div>

            {/* Live circular preview thumbnail */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#8696a0' }}>المعاينة:</span>
              <canvas
                ref={previewCanvasRef}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid #00a884',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              />
            </div>
          </div>

          {/* Bottom Confirmation Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={isSaving}
              style={{
                flex: 1,
                background: '#00a884',
                color: '#111b21',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isSaving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 168, 132, 0.35)',
                opacity: isSaving ? 0.75 : 1,
              }}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>جاري معالجة ورفع WebP...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>قص وتعيين الصورة (WebP)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              style={{
                background: '#202c33',
                color: '#8696a0',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
