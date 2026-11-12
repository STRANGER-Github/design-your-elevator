import React, { useState } from 'react';
import { RotateCcw, Share2, Check, Download, FileText, ArrowUpRight } from 'lucide-react';
import { ElevatorConfiguration } from '../../types/elevator';
import ascensorLogo from '../../assets/ascensor-logo.png';

interface HeaderProps {
  config: ElevatorConfiguration;
  onReset: () => void;
  onOpenQuote: () => void;
  onDownloadPdf: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onReset,
  onOpenQuote,
  onDownloadPdf,
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Ascensor Brand Identity */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0 border border-stone-200/90 p-1">
          <img
            src={ascensorLogo}
            alt="Ascensor Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-stone-900 tracking-wider text-base sm:text-lg font-sans uppercase">
              Ascensor
            </span>
            <span className="text-[10px] font-barlow tracking-widest uppercase font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              Highest Quality Performance
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs sm:text-sm font-semibold text-stone-900 font-sans tracking-tight">
              <span className="text-stone-500 font-normal mr-1.5 font-barlow text-xs uppercase tracking-wider">
                Presents —
              </span>
              Design Your Elevator
            </p>
            <span className="text-stone-300 hidden sm:inline">·</span>
            <p className="text-[11px] text-stone-500 font-barlow hidden sm:inline">
              Ref: <span className="font-mono text-stone-700 font-medium">{config.configId}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Reset Confirmation */}
        {confirmReset ? (
          <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-300 px-2.5 py-1.5 rounded-lg text-xs font-barlow">
            <span className="text-stone-700 text-xs font-medium">Reset to defaults?</span>
            <button
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
              className="px-2 py-0.5 rounded bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition"
            >
              Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 rounded-lg transition flex items-center gap-1.5 font-barlow"
            title="Reset configuration to baseline defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline">Reset</span>
          </button>
        )}

        {/* Share configuration */}
        <button
          onClick={handleShare}
          className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 rounded-lg transition flex items-center gap-1.5 font-barlow"
          title="Share design link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
          <span className="hidden md:inline">{copied ? 'Link Copied' : 'Share'}</span>
        </button>

        {/* Download architectural spec sheet */}
        <button
          onClick={onDownloadPdf}
          className="p-2 sm:px-3.5 sm:py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition flex items-center gap-1.5 font-barlow"
          title="Download complete technical specification PDF"
        >
          <FileText className="w-3.5 h-3.5 text-stone-600" />
          <span className="hidden sm:inline">Spec Sheet PDF</span>
        </button>

        {/* Request Project Quote */}
        <button
          onClick={onOpenQuote}
          className="px-3.5 sm:px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition shadow-sm flex items-center gap-1.5 active:scale-95 font-sans tracking-wide"
        >
          <span>Request Quote</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-stone-300" />
        </button>
      </div>
    </header>
  );
};
