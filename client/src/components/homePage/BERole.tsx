"use client";
import { useEffect, useRef, useState } from "react";
import { FaReact, FaJs, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { SiTypescript, SiTailwindcss } from "react-icons/si";
type Tag = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  icon: React.ReactNode;
  label: string;
  className: string;
};
const TAG_SIZE = 40;
const NUM_TAGS = 6;
const SPEED = 0.5;

export default function BERole() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [hover, setHover] = useState(false);

  // init tags
  useEffect(() => {
    const techs = [
      {
        icon: <FaJs />,
        label: "JavaScript",
        className: "text-yellow-400",
      },
      {
        icon: <FaReact />,
        label: "React",
        className: "text-cyan-400",
      },
      {
        icon: <SiTypescript />,
        label: "TypeScript",
        className: "text-blue-500",
      },
      {
        icon: <FaHtml5 />,
        label: "HTML",
        className: "text-orange-500",
      },
      {
        icon: <FaCss3Alt />,
        label: "CSS",
        className: "text-blue-400",
      },
      {
        icon: <SiTailwindcss />,
        label: "Tailwind",
        className: "text-sky-400",
      },
    ];

    const initial: Tag[] = techs.map((tech, i) => ({
      id: i,
      x: Math.random() * 300,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      ...tech,
    }));

    setTags(initial);
  }, []);

  // animation loop
  useEffect(() => {
    let frame: number;

    const animate = () => {
      setTags((prev) => {
        if (!containerRef.current) return prev;

        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        let next = prev.map((t) => {
          let nx = t.x + t.vx;
          let ny = t.y + t.vy;
          let vx = t.vx;
          let vy = t.vy;

          // wall collision
          if (nx <= 0 || nx + TAG_SIZE >= width) vx *= -1;
          if (ny <= 0 || ny + TAG_SIZE >= height) vy *= -1;

          return {
            ...t,
            x: nx,
            y: ny,
            vx,
            vy,
          };
        });

        // tag-to-tag collision
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i];
            const b = next[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < TAG_SIZE) {
              // simple bounce swap
              [a.vx, b.vx] = [b.vx, a.vx];
              [a.vy, b.vy] = [b.vy, a.vy];
            }
          }
        }

        return [...next];
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  const centerRef = useRef<HTMLDivElement>(null);
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateCenter = () => {
      if (!containerRef.current || !centerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const centerRect = centerRef.current.getBoundingClientRect();

      setCenterPos({
        x: centerRect.left - containerRect.left + centerRect.width / 2,
        y: centerRect.top - containerRect.top + centerRect.height / 2,
      });
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, []);
  return (
    <div
      ref={containerRef}
      className="relative w-full md:w-1/2 h-[400px] border overflow-hidden "
    >
      {/* SVG lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {tags.map((tag) => {
          const tagCenterX = tag.x + TAG_SIZE / 2;
          const tagCenterY = tag.y + TAG_SIZE / 2;

          return (
            <line
              key={tag.id}
              x1={centerPos.x}
              y1={centerPos.y}
              x2={tagCenterX}
              y2={tagCenterY}
              stroke="#999"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* center circle */}
      <div
        ref={centerRef}
        className="absolute w-24 h-24 rounded-full bg-black text-white flex items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Center
        {hover && (
          <div className="absolute top-full mt-2 px-3 py-1 bg-white text-black text-sm rounded shadow">
            go github
          </div>
        )}
      </div>

      {/* tags */}
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="absolute flex items-center justify-center group border border-gray-400 rounded-md"
          style={{
            width: TAG_SIZE,
            height: TAG_SIZE,
            transform: `translate(${tag.x}px, ${tag.y}px)`,
          }}
        >
          {/* icon */}
          <div
            className={`w-full h-full flex items-center text-3xl justify-center rounded-md bg-white ${tag.className}`}
          >
            {tag.icon}
          </div>

          {/* tooltip */}
          <div className="absolute top-full mt-1 px-2 py-1 text-xs bg-white text-black rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            {tag.label}
          </div>
        </div>
      ))}
    </div>
  );
}
