import prisma from "@/lib/prisma";
import { Metadata } from "next";
import WorkDetail from "@/components/pages/WorkDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const work = await prisma.work.findUnique({
      where: { slug }
    });

    if (!work) {
      return {
        title: "Work Not Found | Jey Anand",
      };
    }

    return {
      title: `${work.title} | AskJey Portfolio`,
      description: work.shortDescription,
      openGraph: {
        title: work.title,
        description: work.shortDescription,
        images: [{ url: work.featuredImage }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: work.title,
        description: work.shortDescription,
        images: [work.featuredImage],
      },
      alternates: {
        canonical: `/work/${work.slug}`,
      }
    };
  } catch (e) {
    return {
      title: "Portfolio Work | Jey Anand",
    };
  }
}

export default function Page() {
  return <WorkDetail />;
}
