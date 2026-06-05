import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Headphones, FileText, Calendar, User, Tag } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ElevenLabsAudioPlayer from "@/components/ElevenLabsAudioPlayer";

function renderContent(content: string) {
  // Convert the plain text with markdown-style formatting into JSX sections
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // Section headers (numbered like "1. Title" or "## Title")
    if (/^\d+\.\s/.test(line) || line.startsWith("## ")) {
      const text = line.replace(/^\d+\.\s/, "").replace(/^## /, "");
      elements.push(
        <h2 key={i} className="text-2xl font-bold mt-8 mb-3"
          style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)", borderBottom: "2px solid oklch(0.85 0.06 80)", paddingBottom: "0.5rem" }}>
          {text}
        </h2>
      );
    } else if (line.startsWith("### ") || /^[A-Z][A-Za-z\s:]+$/.test(line) && line.length < 60 && !line.includes(".")) {
      const text = line.replace(/^### /, "");
      elements.push(
        <h3 key={i} className="text-lg font-bold mt-6 mb-2"
          style={{ color: "oklch(0.30 0.08 145)" }}>
          {text}
        </h3>
      );
    } else if (line.startsWith("* ") || line.startsWith("- ")) {
      // Collect list items
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("* ") || lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("  * "))) {
        items.push(lines[i].trim().replace(/^[\*\-]\s+/, "").replace(/^  \*\s+/, "  "));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-3 space-y-1 pl-5">
          {items.map((item, idx) => (
            <li key={idx} className="text-base" style={{ color: "oklch(0.35 0.04 50)", listStyleType: "disc" }}>
              {item.includes(":") ? (
                <>
                  <strong style={{ color: "oklch(0.25 0.06 50)" }}>{item.split(":")[0]}:</strong>
                  {item.split(":").slice(1).join(":")}
                </>
              ) : item}
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\.\s/.test(line) && lines[i + 1] && /^\d+\.\s/.test(lines[i + 1]?.trim() || "")) {
      // Numbered list
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-3 space-y-1 pl-5 list-decimal">
          {items.map((item, idx) => (
            <li key={idx} className="text-base" style={{ color: "oklch(0.35 0.04 50)" }}>{item}</li>
          ))}
        </ol>
      );
      continue;
    } else if (line.includes("\t") || (line.includes("  ") && line.split("  ").length >= 3)) {
      // Table-like content
      elements.push(
        <div key={i} className="my-4 p-4 rounded-lg text-sm font-mono"
          style={{ background: "oklch(0.95 0.02 80)", color: "oklch(0.35 0.04 50)", whiteSpace: "pre-wrap" }}>
          {line}
        </div>
      );
    } else if (line.startsWith("Pro-Tip:") || line.startsWith("Butcher's Note:") || line.startsWith("Master Butcher Tip:") || line.startsWith("Stewardship Note:")) {
      elements.push(
        <blockquote key={i} className="my-4 p-4 rounded-lg border-l-4"
          style={{ background: "oklch(0.95 0.06 80)", borderColor: "oklch(0.65 0.12 80)", color: "oklch(0.30 0.06 50)" }}>
          <strong>{line.split(":")[0]}:</strong>{line.split(":").slice(1).join(":")}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={i} className="text-base leading-relaxed mb-3" style={{ color: "oklch(0.35 0.04 50)" }}>
          {line}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug: slug || "" }, { enabled: !!slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.97 0.01 80)" }}>
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 rounded mb-4 mx-auto" style={{ background: "oklch(0.88 0.02 80)" }} />
            <div className="h-4 w-96 rounded mx-auto" style={{ background: "oklch(0.88 0.02 80)" }} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.97 0.01 80)" }}>
        <Navigation />
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.30 0.06 50)" }}>
              Post Not Found
            </h1>
            <Link href="/blog" className="underline" style={{ color: "oklch(0.40 0.10 145)" }}>
              ← Back to the Journal
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.97 0.01 80)" }}>
      <Navigation />

      {/* Hero image */}
      {post.heroImageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden relative">
          <img src={post.heroImageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, oklch(0.97 0.01 80) 100%)" }} />
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-10 w-full flex-1">
        {/* Back link */}
        <Link href="/blog" className="flex items-center gap-2 text-sm mb-6 hover:underline" style={{ color: "oklch(0.40 0.10 145)" }}>
          <ArrowLeft className="w-4 h-4" /> Back to the Journal
        </Link>

        {/* Category + badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: "oklch(0.92 0.04 145)", color: "oklch(0.30 0.08 145)" }}>
              {post.category}
            </span>
          )}

        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
          {post.title}
        </h1>
        {post.subtitle && (
          <p className="text-lg mb-4" style={{ color: "oklch(0.45 0.04 80)" }}>{post.subtitle}</p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: "oklch(0.88 0.03 80)" }}>
          <div className="flex items-center gap-1 text-sm" style={{ color: "oklch(0.50 0.04 80)" }}>
            <User className="w-4 h-4" /> {post.author}
          </div>
          <div className="flex items-center gap-1 text-sm" style={{ color: "oklch(0.50 0.04 80)" }}>
            <Calendar className="w-4 h-4" />
            {new Date(post.publishedAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </div>
          {post.tags && (
            <div className="flex items-center gap-1 text-sm" style={{ color: "oklch(0.50 0.04 80)" }}>
              <Tag className="w-4 h-4" /> {post.tags}
            </div>
          )}
        </div>

        {/* ElevenLabs AI Read-Aloud Player */}
        <div className="mb-8">
          <ElevenLabsAudioPlayer
            title={post.title}
            text={[
              post.title + ". ",
              post.subtitle ? post.subtitle + ". " : "",
              post.content,
            ].join(" ").slice(0, 4500)}
          />
        </div>

        {/* Audio player */}
        {post.audioUrl && (
          <div className="mb-8 p-5 rounded-xl" style={{ background: "oklch(0.25 0.07 145)", color: "white" }}>
            <div className="flex items-center gap-3 mb-3">
              <Headphones className="w-5 h-5" style={{ color: "oklch(0.75 0.12 80)" }} />
              <span className="font-semibold">Listen to the Podcast Episode</span>
            </div>
            <audio controls className="w-full" style={{ accentColor: "oklch(0.65 0.12 80)" }}>
              <source src={post.audioUrl} type="audio/mp4" />
              <source src={post.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Content */}
        <article className="prose-custom">
          {renderContent(post.content)}
        </article>

        {/* PDF download */}
        {post.pdfUrl && (
          <div className="mt-10 p-5 rounded-xl flex items-center gap-4"
            style={{ background: "oklch(0.95 0.04 25)", border: "1px solid oklch(0.85 0.06 25)" }}>
            <FileText className="w-8 h-8 flex-shrink-0" style={{ color: "oklch(0.50 0.10 25)" }} />
            <div className="flex-1">
              <div className="font-semibold mb-1" style={{ color: "oklch(0.30 0.08 25)" }}>
                {post.pdfTitle || "Download the Full Guide (PDF)"}
              </div>
              <div className="text-sm" style={{ color: "oklch(0.50 0.06 25)" }}>
                Printable reference guide — save it for the field
              </div>
            </div>
            <a href={post.pdfUrl} download target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg font-semibold text-white text-sm"
              style={{ background: "oklch(0.45 0.10 25)" }}>
              Download PDF
            </a>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
