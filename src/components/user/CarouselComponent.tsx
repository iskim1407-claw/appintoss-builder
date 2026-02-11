"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { SettingsPanel } from "./shared";

interface CarouselProps {
  images?: string[];
  autoPlay?: boolean;
  interval?: number;
  borderRadius?: number;
}

const defaultImages = [
  "https://placehold.co/600x300/3182F6/FFFFFF?text=Slide+1",
  "https://placehold.co/600x300/1B64DA/FFFFFF?text=Slide+2",
  "https://placehold.co/600x300/0050B3/FFFFFF?text=Slide+3",
];

export const CarouselComponent = ({
  images = defaultImages,
  autoPlay = true,
  interval = 3000,
  borderRadius = 12,
}: CarouselProps) => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({ selected: s.events.selected }));
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const touchStart = React.useRef(0);

  React.useEffect(() => {
    if (!autoPlay || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  return (
    <div 
      ref={(ref) => { if (ref) connect(drag(ref)); }} 
      className={`px-3 py-2 ${selected ? "outline outline-2 outline-[#3182F6] rounded-lg" : ""}`}
    >
      <div 
        className="relative overflow-hidden"
        style={{ borderRadius }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="min-w-full aspect-video">
              <img 
                src={src} 
                alt={`슬라이드 ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === i 
                  ? "w-5 bg-white" 
                  : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CarouselSettings = () => {
  const { actions: { setProp }, props } = useNode((n) => ({ props: n.data.props }));
  const images = (props.images as string[]) || defaultImages;

  const updateImage = (index: number, value: string) => {
    setProp((p: CarouselProps) => {
      const newImages = [...(p.images || defaultImages)];
      newImages[index] = value;
      p.images = newImages;
    });
  };

  const addImage = () => {
    setProp((p: CarouselProps) => {
      const newImages = [...(p.images || defaultImages)];
      newImages.push(`https://placehold.co/600x300/6366F1/FFFFFF?text=Slide+${newImages.length + 1}`);
      p.images = newImages;
    });
  };

  const removeImage = (index: number) => {
    setProp((p: CarouselProps) => {
      const newImages = [...(p.images || defaultImages)];
      newImages.splice(index, 1);
      p.images = newImages;
    });
  };

  return (
    <SettingsPanel title="캐러셀">
      <div className="space-y-2 mb-3">
        {images.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input 
              className="flex-1 border rounded-lg p-2 text-xs" 
              placeholder="이미지 URL"
              value={url}
              onChange={(e) => updateImage(i, e.target.value)}
            />
            {images.length > 1 && (
              <button 
                onClick={() => removeImage(i)}
                className="text-red-400 hover:text-red-600 text-sm px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      
      {images.length < 10 && (
        <button 
          onClick={addImage}
          className="w-full py-2 text-sm text-[#3182F6] border border-[#3182F6] rounded-lg hover:bg-blue-50 mb-3"
        >
          + 이미지 추가
        </button>
      )}

      <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
      <input 
        type="range" 
        min={0} 
        max={24} 
        value={props.borderRadius || 12}
        onChange={(e) => setProp((p: CarouselProps) => (p.borderRadius = Number(e.target.value)))}
        className="w-full mb-1"
      />
      <span className="text-xs text-gray-400">{props.borderRadius || 12}px</span>

      <label className="flex items-center gap-2 text-sm mt-3">
        <input 
          type="checkbox" 
          checked={props.autoPlay ?? true} 
          onChange={(e) => setProp((p: CarouselProps) => (p.autoPlay = e.target.checked))} 
        />
        자동 재생
      </label>

      {props.autoPlay && (
        <>
          <label className="block text-xs text-gray-500 mb-1 mt-3">재생 간격 (ms)</label>
          <input 
            type="number"
            className="w-full border rounded-lg p-2 text-sm" 
            value={props.interval || 3000}
            step={500}
            min={1000}
            max={10000}
            onChange={(e) => setProp((p: CarouselProps) => (p.interval = Number(e.target.value)))}
          />
        </>
      )}
    </SettingsPanel>
  );
};

CarouselComponent.craft = {
  props: { images: defaultImages, autoPlay: true, interval: 3000, borderRadius: 12 },
  related: { settings: CarouselSettings },
  displayName: "캐러셀",
};
