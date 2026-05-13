import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '../../../lib/blog';
import Logo from '../../../components/Logo';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} - Dinesh Kumar`,
    description: post.description,
  };
}

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen text-slate-100 flex items-center justify-center" style={{ background: "#0b1326" }}>
        <h1>Post Not Found</h1>
      </div>
    );
  }

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
            <Link href="/blog" className="text-sm text-[#8aebff] hover:text-[#8aebff] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>Blog</Link>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <div className="mb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#8aebff] mb-8 hover:underline">
            ← Back to Blog
          </Link>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "12px", color: "#8aebff", marginBottom: "16px" }}>
            {post.date}
          </p>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: "24px" }}>
            {post.title}
          </h1>
          <div className="h-px w-full bg-white/10" />
        </div>

        <article className="prose prose-invert prose-cyan max-w-none prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-headings:font-semibold prose-a:text-[#8aebff] hover:prose-a:text-cyan-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
