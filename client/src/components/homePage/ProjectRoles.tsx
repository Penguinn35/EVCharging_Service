"use client";

interface Tech {
  name: string;
}

interface RoleSection {
  role: string;
  github: string;
  avatar: string;
  techs: Tech[];
}

const projectStack: RoleSection[] = [
  {
    role: "Frontend Developer",
    github: "https://github.com/your-fe",
    avatar: "https://i.pravatar.cc/100?img=1",
    techs: [
      { name: "React" },
      { name: "Tailwind" },
      { name: "TypeScript" },
    ],
  },
  {
    role: "Backend Developer",
    github: "https://github.com/your-be",
    avatar: "https://i.pravatar.cc/100?img=2",
    techs: [
      { name: "Node.js" },
      { name: "Express" },
      { name: "MongoDB" },
    ],
  },
];

export default function ProjectRoles() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {projectStack.map((section, index) => (
          <div
            key={index}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:scale-[1.02] transition"
          >
            {/* Avatar + Role */}
            <div className="flex items-center gap-4 mb-6">
              <a href={section.github} target="_blank">
                <img
                  src={section.avatar}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border-2 border-white/20 hover:border-blue-400 transition"
                />
              </a>

              <h3 className="text-lg font-semibold text-white">
                {section.role}
              </h3>
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-4">
              {section.techs.map((tech, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2"
                >
                  {/* icon placeholder */}
                  <div className="w-12 h-12 bg-gray-300/30 rounded-lg" />

                  <span className="text-xs text-gray-300">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>

            {/* decorative glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          </div>
        ))}
      </div>
    </div>
  );
}