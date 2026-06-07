/**
 * ElevenLabsSetupModal
 * Guides Schoolhouse Pro users through connecting their own ElevenLabs account
 * so Miss Hazel can speak. Uses Nikki's affiliate link throughout.
 *
 * Steps:
 *   1. Intro — what this unlocks
 *   2. Get ElevenLabs account (affiliate link)
 *   3. Paste API key + validate
 *   4. Success
 */
import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Volume2, ExternalLink, Key, CheckCircle, Loader2, X, ArrowRight, Copy } from "lucide-react";
import { toast } from "sonner";

const AFFILIATE_LINK = "https://try.elevenlabs.io/lhgu4tpm0stc";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "intro" | "get-account" | "paste-key" | "success";

export default function ElevenLabsSetupModal({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>("intro");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const saveKey = trpc.elevenLabs.saveKey.useMutation({
    onSuccess: () => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    },
    onError: (err) => {
      setError(err.message || "Could not validate key. Please check it and try again.");
    },
  });

  function handleSaveKey() {
    setError("");
    const trimmed = apiKey.trim();
    if (!trimmed || trimmed.length < 10) {
      setError("Please paste your full ElevenLabs API key.");
      return;
    }
    saveKey.mutate({ key: trimmed });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step: Intro */}
        {step === "intro" && (
          <div className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-[oklch(0.93_0.04_80)] flex items-center justify-center mb-5">
              <Volume2 className="w-7 h-7 text-[oklch(0.45_0.08_80)]" />
            </div>
            <h2 className="text-2xl font-bold text-[oklch(0.20_0.05_50)] mb-3">
              Activate Miss Hazel's Voice
            </h2>
            <p className="text-[oklch(0.45_0.05_50)] leading-relaxed mb-6">
              Miss Hazel can read your lessons aloud and answer questions in her own voice — powered by ElevenLabs, the world's most natural AI voice technology.
            </p>
            <div className="bg-[oklch(0.96_0.02_80)] rounded-xl p-4 mb-6 space-y-2">
              {[
                "Lessons read aloud in Miss Hazel's warm voice",
                "Voice Q&A — speak your question, hear the answer",
                "You use your own ElevenLabs account (free to start)",
                "Your API key stays private on our servers",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[oklch(0.35_0.05_50)]">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("get-account")}
              className="w-full bg-[oklch(0.25_0.06_50)] hover:bg-[oklch(0.30_0.08_60)] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: Get ElevenLabs account */}
        {step === "get-account" && (
          <div className="p-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[oklch(0.55_0.08_80)] uppercase tracking-widest">Step 1 of 2</span>
            </div>
            <h2 className="text-xl font-bold text-[oklch(0.20_0.05_50)] mb-3">
              Create Your Free ElevenLabs Account
            </h2>
            <p className="text-[oklch(0.45_0.05_50)] text-sm leading-relaxed mb-5">
              ElevenLabs offers a free tier with 10,000 characters/month — enough for several lessons. Click the button below to sign up. It's free, no credit card required to start.
            </p>

            <a
              href={AFFILIATE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[oklch(0.68_0.12_65)] hover:bg-[oklch(0.60_0.12_65)] text-[oklch(0.18_0.06_145)] font-bold py-3.5 rounded-xl transition-colors mb-4"
            >
              <ExternalLink className="w-4 h-4" />
              Sign Up for ElevenLabs (Free)
            </a>

            <div className="bg-[oklch(0.96_0.03_80)] rounded-xl p-4 mb-5 text-sm text-[oklch(0.45_0.05_50)]">
              <p className="font-semibold text-[oklch(0.30_0.05_50)] mb-2">After signing up:</p>
              <ol className="space-y-1.5 list-decimal list-inside">
                <li>Click your profile icon (top right on ElevenLabs)</li>
                <li>Go to <strong>Profile + API Key</strong></li>
                <li>Copy your API key</li>
                <li>Come back here and paste it in the next step</li>
              </ol>
            </div>

            <button
              onClick={() => setStep("paste-key")}
              className="w-full border-2 border-[oklch(0.88_0.03_80)] hover:border-[oklch(0.65_0.08_50)] text-[oklch(0.35_0.05_50)] font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              I Already Have an Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step: Paste API key */}
        {step === "paste-key" && (
          <div className="p-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[oklch(0.55_0.08_80)] uppercase tracking-widest">Step 2 of 2</span>
            </div>
            <h2 className="text-xl font-bold text-[oklch(0.20_0.05_50)] mb-3">
              Paste Your API Key
            </h2>
            <p className="text-[oklch(0.45_0.05_50)] text-sm leading-relaxed mb-5">
              Your key is stored securely on our server and is never visible in the browser. We'll validate it with a quick test call before saving.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[oklch(0.30_0.05_50)] mb-2">
                ElevenLabs API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.65_0.05_50)]" />
                <input
                  ref={inputRef}
                  type="password"
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setError(""); }}
                  placeholder="sk_..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-[oklch(0.88_0.03_80)] focus:border-[oklch(0.55_0.08_50)] rounded-xl text-sm font-mono outline-none transition-colors"
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-800">
              <strong>Privacy note:</strong> Your API key is stored encrypted on our server. It is only used to make voice requests on your behalf and is never shared or logged.
            </div>

            <button
              onClick={handleSaveKey}
              disabled={saveKey.isPending || !apiKey.trim()}
              className="w-full bg-[oklch(0.25_0.06_50)] hover:bg-[oklch(0.30_0.08_60)] text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveKey.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Validating key…</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Validate & Save Key</>
              )}
            </button>

            <button
              onClick={() => setStep("get-account")}
              className="w-full mt-3 text-sm text-[oklch(0.55_0.05_50)] hover:text-[oklch(0.35_0.05_50)] transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-[oklch(0.20_0.05_50)] mb-3">
              Miss Hazel Can Speak!
            </h2>
            <p className="text-[oklch(0.45_0.05_50)] leading-relaxed">
              Your ElevenLabs key is connected. Look for the <strong>🔊 Listen</strong> button on any lesson to hear Miss Hazel read it aloud.
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600 font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              Activating voice features…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
