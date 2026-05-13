import Link from 'next/link';
import { getAllPosts } from '../../lib/blog';
import Logo from '../../components/Logo';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog - Dinesh Kumar',
  description: 'Writings on architecture, AI, and scalable systems.',
};

export default function BlogList() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen text-slate-100" style={{ background: "#0b1326", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          background: "rgba(11,19,38,0.75)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo compact width={300} />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-slate-400 hover:text-[#8aebff] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>Home</Link>
            <span className="text-sm text-[#8aebff] border-b border-[#8aebff]/50 pb-[3px]" style={{ fontFamily: "'Inter', sans-serif" }}>Blog</span>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="mb-16">
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", letterSpacing: "0.1em", color: "#8aebff", textTransform: "uppercase", marginBottom: "16px" }}>
            // technical writings
          </p>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f1f5f9" }}>
            The Blog
          </h1>
        </div>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group" style={{ textDecoration: 'none' }}>
              <div 
                className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-8 transition-all duration-300 group-hover:bg-white/[0.05] group-hover:-translate-y-1 group-hover:border-[#8aebff]/30 group-hover:shadow-[0_0_30px_rgba(138,235,255,0.1)]"
              >
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#8aebff", marginBottom: "12px" }}>
                  {post.date}
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#f1f5f9", marginBottom: "12px" }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: "1.6", marginBottom: "20px" }}>
                  {post.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#8aebff] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Read Article <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-slate-400">No posts found. Create a .md file in the content/blog directory.</p>
          )}
        </div>
      </div>
    </div>
  );
}
