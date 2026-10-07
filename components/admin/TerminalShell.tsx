"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Terminal, CheckCircle2, Lock } from "lucide-react";
import CyberMacroBar from "./CyberMacroBar";
import { authenticateAdmin } from "@/server/actions/auth.actions";

export default function TerminalShell() {
  const router = useRouter();
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING SECURE PROTOCOL...",
    "NODE :: VAULT-01 / SECTOR-ALPHA",
    "STATUS :: RESTRICTED ACCESS. SYSTEM AUDIT ENABLED.",
    "ENTER 'auth --key <MASTER_KEY>' OR KEY DIRECTLY.",
  ]);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleExecute = async () => {
    if (lockoutSeconds > 0 || verifying || !inputVal.trim()) return;

    const trimmed = inputVal.trim();
    setLogs((prev) => [...prev, `> ${"*".repeat(Math.min(trimmed.length, 20))}`]);
    setVerifying(true);
    setInputVal("");

    let keyToTest = trimmed;
    if (trimmed.startsWith("auth --key ")) {
      keyToTest = trimmed.replace("auth --key ", "").trim();
    }

    try {
      const result = await authenticateAdmin(keyToTest);

      if (result.success) {
        setLogs((prev) => [
          ...prev,
          "[VERIFYING CRYPTOGRAPHIC PROOF...]",
          "[ACCESS GRANTED :: SESSION TOKEN SIGNED]",
          "REDIRECTING TO ARCHIVE CONTROLLER...",
        ]);
        setAuthenticated(true);
        setTimeout(() => router.push("/admin/dashboard"), 1200);
      } else if (result.error === "TOO_MANY_ATTEMPTS" && result.lockoutUntil) {
        const secsLeft = Math.ceil((result.lockoutUntil - Date.now()) / 1000);
        setLockoutSeconds(secsLeft);
        setLogs((prev) => [
          ...prev,
          "[ACCESS DENIED :: RATE LIMIT EXCEEDED]",
          "SECURITY BREACH THRESHOLD REACHED.",
          `[TERMINAL LOCKED :: SERVER LOCK ACTIVE ${formatLockoutTime(secsLeft)}]`,
        ]);
      } else {
        setLogs((prev) => [
          ...prev,
          "[ACCESS DENIED]",
          "INVALID SIGNATURE. RECORD TRANSMITTED TO AUDIT LOG.",
        ]);
      }
    } catch {
      setLogs((prev) => [...prev, "[ERROR :: PROTOCOL HANDSHAKE FAILED]"]);
    } finally {
      setVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleExecute();
    }
  };

  // Mobile macro actions
  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputVal(text);
    } catch {
      setLogs((prev) => [...prev, "[CLIPBOARD READ FAILED: PERMISSION DENIED]"]);
    }
  };

  const handleClear = () => {
    setInputVal("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-lg border border-[#1d1b18] bg-[#1d1b18] text-[#f4f0e8] shadow-2xl overflow-hidden font-mono flex flex-col min-h-[480px]">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-[#262420] border-b border-[#f4f0e8]/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#d67b5a]" aria-hidden="true" />
          <span className="text-xs text-[#f4f0e8]/80 tracking-wider">
            DOSSIER_CORE :: KONSOL OTENTIKASI
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lockoutSeconds > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/60 border border-red-700/40 text-[10px] text-red-300">
              <Lock className="w-3 h-3" aria-hidden="true" />
              <span>TERKUNCI {formatLockoutTime(lockoutSeconds)}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#bd4b2a]/15 border border-[#bd4b2a]/30 text-[10px] text-[#d67b5a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bd4b2a] animate-pulse" />
              <span>PORT 443 :: SIAP</span>
            </span>
          )}
        </div>
      </div>

      {/* Terminal Output Log Area */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[320px] text-xs sm:text-sm space-y-2 text-[#f4f0e8]/85">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className={`leading-relaxed ${
              log.includes("DENIED") || log.includes("LOCKED")
                ? "text-red-400"
                : log.includes("GRANTED")
                ? "text-emerald-400 font-semibold"
                : log.startsWith(">")
                ? "text-[#f4f0e8] font-medium"
                : "text-[#f4f0e8]/70"
            }`}
          >
            {log}
          </div>
        ))}
        {verifying && (
          <div className="text-[#d67b5a] animate-pulse">
            [MEMVALIDASI TANDA TANGAN KRIPTOGRAFIS...]
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Authenticated Success View */}
      {authenticated && (
        <div className="p-6 bg-[#262420] border-t border-emerald-500/30 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" aria-hidden="true" />
          <p className="font-mono text-sm text-emerald-400 font-semibold">
            OTENTIKASI TERKONFIRMASI.
          </p>
          <p className="text-xs text-[#f4f0e8]/60 mt-1">
            Sesi aktif. Mengalihkan ke pengelola arsip...
          </p>
        </div>
      )}

      {/* Input Prompt */}
      {!authenticated && (
        <div className="p-4 bg-[#141311] border-t border-[#f4f0e8]/10 flex items-center gap-2">
          <span className="text-[#d67b5a] select-none text-sm font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="password"
            disabled={lockoutSeconds > 0 || verifying}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              lockoutSeconds > 0
                ? `TERKUNCI: Coba lagi dalam ${formatLockoutTime(lockoutSeconds)}`
                : "auth --key [masukkan master key]"
            }
            className="flex-1 bg-transparent border-none text-[#f4f0e8] font-mono text-sm placeholder:text-[#f4f0e8]/25 focus:outline-none focus:ring-0 disabled:opacity-40"
          />
          <button
            type="button"
            disabled={lockoutSeconds > 0 || verifying || !inputVal.trim()}
            onClick={handleExecute}
            className="hidden sm:inline-flex items-center px-4 py-1.5 rounded bg-[#bd4b2a] text-[#f8f3e9] text-xs font-semibold hover:bg-[#a83f21] disabled:opacity-30 transition-colors"
          >
            [EKSEKUSI]
          </button>
        </div>
      )}

      {/* Mobile Cyber Macro Bar (Sticky bottom on mobile) */}
      {!authenticated && (
        <CyberMacroBar
          onAuth={handleExecute}
          onPasteKey={handlePasteKey}
          onExec={handleExecute}
          onClear={handleClear}
          disabled={lockoutSeconds > 0 || verifying}
        />
      )}
    </div>
  );
}
