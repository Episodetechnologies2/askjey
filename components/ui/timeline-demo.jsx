import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Timeline } from "./timeline";

export function TimelineDemo() {
  const data = [
    {
      title: "2026",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-6">
            Expanded Ask Jey with high-impact mentorship, content, and brand
            strategy initiatives.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80"
              alt="Team planning"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1000&q=80"
              alt="Product and code"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80"
              alt="Workspace setup"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80"
              alt="Business collaboration"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-6">
            Built stronger systems for content operations, mentorship workflows,
            and audience growth.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-6">
            Focused on consistency, rapid execution, and quality delivery across
            digital touchpoints.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80"
              alt="Strategy meeting"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80"
              alt="Business analysis"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
              alt="Team workshop"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80"
              alt="Growth planning"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Milestones",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Core outcomes delivered across ventures and collaborations:
          </p>
          <div className="mb-8 space-y-2">
            {[
              "Brand identity frameworks launched",
              "Mentorship cohorts structured and deployed",
              "Content strategy pipelines optimized",
              "Booking and conversion journey streamlined",
              "Cross-functional execution playbooks created",
            ].map((item) => (
              <div
                key={item}
                className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80"
              alt="Presentation"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1000&q=80"
              alt="Planning board"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80"
              alt="Team discussion"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80"
              alt="Creative work"
              className="rounded-lg object-cover h-24 md:h-44 lg:h-60 w-full"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <Timeline data={data} />
    </div>
  );
}



