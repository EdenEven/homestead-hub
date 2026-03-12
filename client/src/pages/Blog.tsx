import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { BookOpen, Headphones, FileText, Lock, Calendar, User, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ limit: 20 });

  const featuredPost = posts && posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts && posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.97 0.01 80)" }}>
      <Navigation />

      {/* ── PAGE HEADER ── */}
      <section
        className="relative py-16 px-4 text-center"
        style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 145) 0%, oklch(0.28 0.08 50) 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-7 h-7" style={{ color: "oklch(0.75 0.12 80)" }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "oklch(0.75 0.12 80)" }}>
              From the Field
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.02 80)" }}>
            The Homestead Journal
          </h1>
          <p className="text-base md:text-lg" style={{ color: "oklch(0.80 0.04 80)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
            Real knowledge from real homesteaders. Heritage skills, honest stories, and practical wisdom for self-reliant living.
          </p>
        </div>
      </section>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12">

        {/* ── FEATURED POST HERO BANNER ── */}
        {isLoading ? (
          <div className="rounded-xl overflow-hidden animate-pulse mb-12" style={{ background: "oklch(0.90 0.02 80)", height: 420 }} />
        ) : featuredPost ? (
          <Link href={`/blog/${featuredPost.slug}`}>
            <article
              className="group relative rounded-xl overflow-hidden mb-12 cursor-pointer"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.14)" }}
            >
              {/* Background image */}
              {featuredPost.heroImageUrl ? (
                <div className="h-[420px] md:h-[480px] overflow-hidden">
                  <img
                    src={featuredPost.heroImageUrl}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ) : (
                <div className="h-[420px] md:h-[480px] flex items-center justify-center" style={{ background: "oklch(0.22 0.07 145)" }}>
                  <BookOpen className="w-20 h-20 opacity-20" style={{ color: "oklch(0.75 0.12 80)" }} />
                </div>
              )}

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, oklch(0.12 0.05 145 / 0.95) 0%, oklch(0.12 0.05 145 / 0.55) 45%, transparent 100%)" }}
              />

              {/* Featured badge */}
              <div className="absolute top-5 left-5">
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ background: "oklch(0.68 0.12 65)", color: "oklch(0.15 0.05 145)" }}
                >
                  Featured Post
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                {/* Category + members badge */}
                <div className="flex items-center gap-3 mb-3">
                  {featuredPost.category && (
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={{ background: "oklch(0.92 0.04 145 / 0.9)", color: "oklch(0.22 0.08 145)" }}
                    >
                      {featuredPost.category}
                    </span>
                  )}
                  {!featuredPost.isFree && (
                    <span
                      className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background: "oklch(0.92 0.06 65 / 0.9)", color: "oklch(0.35 0.10 65)" }}
                    >
                      <Lock className="w-3 h-3" /> Members Only
                    </span>
                  )}
                </div>

                <h2
                  className="text-2xl md:text-4xl font-black mb-3 leading-tight group-hover:underline"
                  style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.025 85)" }}
                >
                  {featuredPost.title}
                </h2>

                {featuredPost.subtitle && (
                  <p className="text-sm md:text-base mb-4 max-w-2xl" style={{ color: "oklch(0.82 0.02 85)", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {featuredPost.subtitle}
                  </p>
                )}

                {/* Media badges + meta */}
                <div className="flex flex-wrap items-center gap-4">
                  {featuredPost.audioUrl && (
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: "oklch(0.80 0.08 220)" }}>
                      <Headphones className="w-4 h-4" /> Podcast Episode
                    </span>
                  )}
                  {featuredPost.pdfUrl && (
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: "oklch(0.80 0.08 65)" }}>
                      <FileText className="w-4 h-4" /> PDF Guide
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: "oklch(0.72 0.02 85)" }}>
                    <User className="w-4 h-4" /> {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: "oklch(0.72 0.02 85)" }}>
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span
                    className="ml-auto flex items-center gap-1.5 text-sm font-bold"
                    style={{ color: "oklch(0.68 0.12 65)" }}
                  >
                    Read Full Post <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ) : null}

        {/* ── MORE POSTS GRID ── */}
        {!isLoading && remainingPosts.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
                More from the Journal
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article
                    className="rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "white",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    }}
                  >
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

                      <h3 className="text-lg font-bold mb-2 leading-snug group-hover:underline"
                        style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.22 0.06 50)" }}>
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-sm mb-3 line-clamp-3" style={{ color: "oklch(0.45 0.04 80)" }}>
                          {post.excerpt}
                        </p>
                      )}

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
          </>
        )}

        {/* Empty state */}
        {!isLoading && (!posts || posts.length === 0) && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "oklch(0.40 0.08 145)" }} />
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.30 0.06 50)" }}>
              First Post Coming Soon
            </h2>
            <p style={{ color: "oklch(0.45 0.04 80)" }}>
              Nikki is crafting the first field report. Check back soon.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
