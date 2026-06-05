/*
 * ElevenLabsAudioPlayer — Homestead Hub
 * Powered by ElevenLabs AI Voice Technology
 * Affiliate: https://try.elevenlabs.io/lhgu4tpm0stc
 *
 * A "Listen to this" audio player that converts page text to speech
 * using the ElevenLabs API via our secure server-side proxy.
 *
 * Usage:
 *   <ElevenLabsAudioPlayer text="The text you want read aloud..." title="Gardening Guide" />
 */
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Square, Volume2, Loader2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Props {
  /** The text content to be converted to speech */
  text: string;
  /** Display title shown in the player (e.g. "Gardening Guide") */
  title?: string;
  /** Optional ElevenLabs voice ID override */
  voiceId?: string;
}

type PlayerState = "idle" | "loading" | "playing" | "paused" | "error";

const AFFILIATE_LINK = "https://try.elevenlabs.io/lhgu4tpm0stc";

export default function ElevenLabsAudioPlayer({ text, title, voiceId }: Props) {
  const [playerState, setPlayerState] = useState<PlayerState>("idle");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ttsMutation = trpc.tts.speak.useMutation({
    onSuccess: (data) => {
      // Convert base64 audio to a Blob URL and play it
      const byteChars = atob(data.audioBase64);
      const byteNums = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNums[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([byteNums], { type: data.mimeType });
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.onended = () => {
        setPlayerState("idle");
        setProgress(0);
        clearProgressInterval();
      };

      audio.onerror = () => {
        setPlayerState("error");
        setErrorMsg("Audio playback failed. Please try again.");
        clearProgressInterval();
      };

      audio.play();
      setPlayerState("playing");
      startProgressInterval(audio);
    },
    onError: (err) => {
      setPlayerState("error");
      setErrorMsg(
        err.message.includes("API key")
          ? "ElevenLabs is not yet configured on this server."
          : "Could not generate audio. Please try again."
      );
    },
  });

  const startProgressInterval = (audio: HTMLAudioElement) => {
    clearProgressInterval();
    progressIntervalRef.current = setInterval(() => {
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    }, 200);
  };

  const clearProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearProgressInterval();
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  const handlePlay = () => {
    if (playerState === "paused" && audioRef.current) {
      audioRef.current.play();
      setPlayerState("playing");
      startProgressInterval(audioRef.current);
      return;
    }

    if (playerState === "playing") return;

    setPlayerState("loading");
    setErrorMsg("");
    setProgress(0);

    // Trim text to 4500 chars to stay under API limit
    const trimmedText = text.slice(0, 4500);

    ttsMutation.mutate({
      text: trimmedText,
      voiceId: voiceId ?? "EXAVITQu4vr4xnSDxMaL",
      modelId: "eleven_flash_v2_5",
    });
  };

  const handlePause = () => {
    if (audioRef.current && playerState === "playing") {
      audioRef.current.pause();
      setPlayerState("paused");
      clearProgressInterval();
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayerState("idle");
    setProgress(0);
    clearProgressInterval();
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTime = audioRef.current
    ? audioRef.current.currentTime
    : 0;

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{
        border: "1px solid oklch(0.72 0.08 145)",
        backgroundColor: "oklch(0.22 0.06 145)",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{ backgroundColor: "oklch(0.18 0.07 145)", borderBottom: "1px solid oklch(0.28 0.06 145)" }}
      >
        <Volume2 className="w-3.5 h-3.5" style={{ color: "oklch(0.68 0.12 65)" }} />
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          Listen — Powered by ElevenLabs AI
        </span>
      </div>

      {/* Player body */}
      <div className="px-4 py-3">
        {/* Title */}
        {title && (
          <p
            className="text-sm font-semibold mb-3 truncate"
            style={{ color: "oklch(0.92 0.025 85)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </p>
        )}

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Play / Pause button */}
          <button
            onClick={playerState === "playing" ? handlePause : handlePlay}
            disabled={playerState === "loading"}
            className="flex items-center justify-center w-9 h-9 rounded-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)" }}
            aria-label={playerState === "playing" ? "Pause" : "Play"}
          >
            {playerState === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : playerState === "playing" ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Stop button */}
          {(playerState === "playing" || playerState === "paused") && (
            <button
              onClick={handleStop}
              className="flex items-center justify-center w-7 h-7 rounded-sm transition-all hover:opacity-80"
              style={{ backgroundColor: "oklch(0.30 0.06 145)", color: "oklch(0.75 0.03 85)" }}
              aria-label="Stop"
            >
              <Square className="w-3 h-3" />
            </button>
          )}

          {/* Progress bar */}
          <div className="flex-1">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "oklch(0.30 0.05 145)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "oklch(0.68 0.12 65)",
                }}
              />
            </div>
            {/* Time display */}
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: "oklch(0.60 0.03 85)", fontFamily: "monospace" }}>
                {formatTime(currentTime)}
              </span>
              <span className="text-xs" style={{ color: "oklch(0.60 0.03 85)", fontFamily: "monospace" }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Status messages */}
        {playerState === "loading" && (
          <p className="text-xs mt-2" style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Generating audio with ElevenLabs AI...
          </p>
        )}
        {playerState === "error" && (
          <p className="text-xs mt-2" style={{ color: "oklch(0.65 0.12 25)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {errorMsg}
          </p>
        )}
      </div>

      {/* Affiliate footer */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: "oklch(0.16 0.06 145)", borderTop: "1px solid oklch(0.26 0.05 145)" }}
      >
        <span className="text-xs" style={{ color: "oklch(0.50 0.03 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          AI voice by ElevenLabs
        </span>
        <a
          href={AFFILIATE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs hover:opacity-80 transition-opacity"
          style={{ color: "oklch(0.68 0.12 65)", fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          Try ElevenLabs free
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
}
