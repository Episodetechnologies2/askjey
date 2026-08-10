import Link from 'next/link';
;
import { ArrowUpRight } from "lucide-react";
const jey = '/assets/Anand Jey.jpg';


const jobOpenings = [
  {
    title: "Designer",
    details: ["UI/UX Design", "Graphic Design", "Branding"],
  },
  {
    title: "Developer",
    details: ["MongoDB", "Express.js", "React.js", "Node.js"],
  },
  {
    title: "Writer",
    details: ["SEO", "Social Media", "Content Strategy"],
  },
  {
    title: "Executive Assistant",
    details: [
      "Schedule Management",
      "Client Communication",
      "Document Preparation",
    ],
  },
  {
    title: "Business Development",
    details: ["Lead Generation", "Client Relations", "Sales Strategy"],
  },
];

const Careers = () => {
  return (
    <section id="career" className="bg-black py-24 text-white">
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="font-display text-5xl font-bold uppercase leading-none lg:text-7xl">
                Join the <br />
                <span className="text-primary">Collective</span>
              </h2>
              <p className="mt-6 max-w-md font-body text-lg text-white/60">
                Jey is building a creative lab for problem solvers and
                storytellers. If you crave inventive challenges, we want to hear
                from you.
              </p>
            </div>

            <div className="mt-10 w-full max-w-md lg:max-w-[550px] flex-1 min-h-[450px] overflow-hidden">
              <img
                src={jey}
                alt="Jey Anand"
                className="w-full h-full object-cover object-[50%_20%] transition-all"
              />
            </div>
          </div>

          <div className="space-y-6 lg:mt-44 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl uppercase tracking-widest text-white/40">
                Open Positions
              </h3>
              <div className="mt-6 space-y-4">
                {jobOpenings.map((job, index) => (
                  <Link href="/career"
                    key={index}
                    className="group block relative overflow-hidden border border-white/10 bg-white/5 p-8 transition-all hover:border-primary/50 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display text-2xl font-bold uppercase text-white">
                          {job.title}
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.details.map((detail, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-white/10 px-3 py-1 font-body text-xs text-white/70"
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowUpRight className="h-6 w-6 text-white/40 transition-colors group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center lg:text-left">
              <Link href="/contact"
                className="font-body text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:text-white"
              >
                Apply via Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;
