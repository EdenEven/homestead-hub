import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { BookOpen, Headphones, FileText, Lock, Calendar, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ limit: 20 });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.97 0.01 80)" }}>
      <Navigation />

      {/* Hero */}
      <section
        className="relative py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 145) 0%, oklch(0.28 0.08 50) 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" style={{ color: "oklch(0.75 0.12 80)" }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "oklch(0.75 0.12 80)" }}>
              From the Field
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.02 80)" }}>
            The Homestead Journal
          </h1>
          <p className="text-lg" style={{ color: "oklch(0.80 0.04 80)" }}>
            Real knowledge from real homesteaders. Heritage skills, honest stories, and practical wisdom for self-reliant living.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 w-full">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: "oklch(0.92 0.02 80)", height: 340 }} />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "oklch(0.40 0.08 145)" }} />
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.30 0.06 50)" }}>
              First Post Coming Soon
            </h2>
            <p style={{ color: "oklch(0.45 0.04 80)" }}>
              Nikki is crafting the first field report. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article
                  className="rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "white",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Hero image */}
                  {post.heroImageUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.heroImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center" style={{ background: "oklch(0.25 0.07 145)" }}>
                      <BookOpen className="w-12 h-12 opacity-40" style={{ color: "oklch(0.75 0.12 80)" }} />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Category + free/paid badge */}
                    <div className="flex items-center justify-between mb-2">
                      {post.category && (
                        <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background: "oklch(0.92 0.04 145)", color: "oklch(0.30 0.08 145)" }}>
                          {post.category}
                        </span>
                      )}
                      {!post.isFree && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ background: "oklch(0.92 0.06 65)", color: "oklch(0.40 0.10 65)" }}>
                          <Lock className="w-3 h-3" /> Members
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold mb-2 leading-snug group-hover:underline"
                      style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="text-sm mb-3 line-clamp-3" style={{ color: "oklch(0.45 0.04 80)" }}>
                        {post.excerpt}
                      </p>
                    )}

                    {/* Media indicators */}
                    <div className="flex items-center gap-3 mb-3">
                      {post.audioUrl && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.45 0.08 220)" }}>
                          <Headphones className="w-3 h-3" /> Podcast
                        </span>
                      )}
                      {post.pdfUrl && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.45 0.08 25)" }}>
                          <FileText className="w-3 h-3" /> PDF Guide
                        </span>
                      )}
                    </div>

                    {/* Author + date */}
                    <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "oklch(0.90 0.02 80)" }}>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.55 0.04 80)" }}>
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "oklch(0.55 0.04 80)" }}>
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
