"use client";

import React from "react";
import { KeyRound, Clipboard, Play, RotateCcw } from "lucide-react";

interface CyberMacroBarProps {
  onAuth: () => void;
  onPasteKey: () => void;
  onExec: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function CyberMacroBar({
  onAuth,
  onPasteKey,
  onExec,
  onClear,
  disabled = false,
}: CyberMacroBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2.5 bg-[#1d1b18]/95 backdrop-blur-md border-t border-[#f4f0e8]/15 sm:hidden flex items-center justify-between gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={onPasteKey}
        className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-[#262420] border border-[#f4f0e8]/15 active:border-[#d67b5a] text-[11px] font-mono text-[#d67b5a] disabled:opacity-40 transition-colors"
        title="Tempel kunci dari clipboard"
      >
        <Clipboard className="w-3.5 h-3.5" aria-hidden="true" />
        <span>TEMPEL</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onClear}
        className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-[#262420] border border-[#f4f0e8]/15 active:border-[#f4f0e8]/30 text-[11px] font-mono text-[#f4f0e8]/70 disabled:opacity-40 transition-colors"
        title="Hapus input saat ini"
      >
        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        <span>BERSIH</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onExec}
        className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-[#262420] border border-[#f4f0e8]/15 active:border-[#bd4b2a] text-[11px] font-mono text-[#f4f0e8] disabled:opacity-40 transition-colors"
        title="Eksekusi perintah"
      >
        <Play className="w-3.5 h-3.5" aria-hidden="true" />
        <span>EKSEKUSI</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onAuth}
        className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded bg-[#bd4b2a] text-[#f8f3e9] font-bold text-[11px] font-mono active:scale-95 transition-all disabled:opacity-40"
        title="Otentikasi langsung"
      >
        <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
        <span>LOGIN</span>
      </button>
    </div>
  );
}
