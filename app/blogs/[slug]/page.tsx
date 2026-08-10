import prisma from "@/lib/prisma";
import { Metadata } from "next";
import BlogArticle from "@/components/pages/BlogArticle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await prisma.update.findUnique({
      where: { slug }
    });

    if (!article) {
      return {
        title: "Article Not Found | Jey Anand",
      };
    }

    return {
      title: `${article.title} | AskJey Updates`,
      description: article.shortDescription,
      openGraph: {
        title: article.title,
        description: article.shortDescription,
        images: [{ url: article.thumbnail }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.shortDescription,
        images: [article.thumbnail],
      },
      alternates: {
        canonical: `/blogs/${article.slug}`,
      }
    };
  } catch (e) {
    return {
      title: "Update Article | Jey Anand",
    };
  }
}

export default function Page() {
  return <BlogArticle />;
}
