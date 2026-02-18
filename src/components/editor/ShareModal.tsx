"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Copy, Check, MessageCircle, Twitter, AlertTriangle } from "lucide-react";
import { compressToEncodedURIComponent } from "lz-string";

interface ShareModalProps {
  serializedJson: string;
  projectName: string;
  onClose: () => void;
}

export const ShareModal = ({ serializedJson, projectName, onClose }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [tooLong, setTooLong] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const compressed = compressToEncodedURIComponent(serializedJson);
    // lz-string uses '+' which gets decoded as space by URLSearchParams, so encode it
    const safeCompressed = compressed.replace(/\+/g, '%2B');
    const url = `https://appintoss-builder.vercel.app/preview?d=${safeCompressed}`;
    setShareUrl(url);
    setTooLong(url.length > 2000);
  }, [serializedJson]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakao = () => {
    window.open(`https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${projectName} - 미니앱 빌더로 만든 앱을 확인해보세요! 🚀`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 md:p-8 max-w-lg w-full mx-4 shadow-2xl border border-white/40 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">공유하기</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100/60 text-gray-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Warning */}
        {tooLong && (
          <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200/60 rounded-2xl flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-700">프로젝트가 너무 큽니다</p>
              <p className="text-amber-600 text-xs mt-0.5">URL이 {shareUrl.length.toLocaleString()}자로, 일부 플랫폼에서 공유가 제한될 수 있습니다.</p>
            </div>
          </div>
        )}

        {/* URL */}
        <div className="mb-5">
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">공유 링크</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-gray-100/60 border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm text-gray-700 font-mono truncate outline-none focus:border-blue-300"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-[#3182F6] text-white hover:bg-[#1B64DA] active:scale-[0.97]"
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mb-5">
          <label className="text-xs font-medium text-gray-500 mb-2 block">SNS 공유</label>
          <div className="flex gap-2">
            <button
              onClick={handleKakao}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FEE500] text-[#3C1E1E] font-semibold text-sm hover:brightness-95 active:scale-[0.97] transition-all"
            >
              <MessageCircle size={18} />
              카카오톡
            </button>
            <button
              onClick={handleTwitter}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-black text-white font-semibold text-sm hover:bg-gray-800 active:scale-[0.97] transition-all"
            >
              <Twitter size={18} />
              X (트위터)
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center">
          <label className="text-xs font-medium text-gray-500 mb-3 block">QR 코드</label>
          <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <img
              ref={qrRef}
              src={qrUrl}
              alt="QR Code"
              width={160}
              height={160}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
