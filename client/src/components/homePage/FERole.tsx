"use client";
import { useEffect, useRef, useState } from "react";
import { FaHtml5, FaCss3Alt, FaGithub } from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiLeaflet,
  SiOpenstreetmap,
} from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import Image from "next/image";

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
const TAG_SIZE = 60;
const SPEED = 0.5;

export default function FERole() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [hover, setHover] = useState(false);

  // init tags
  useEffect(() => {
    const techs = [
      {
        icon: <RiNextjsFill />,
        label: "NextJs",
        className: "",
      },
      {
        icon: <SiTypescript />,
        label: "TypeScript",
        className: "text-blue-600",
      },
      {
        icon: <SiLeaflet />,
        label: "NextJs",
        className: "text-green-500",
      },
      {
        icon: <SiOpenstreetmap />,
        label: "openStreetMap",
        className: "text-emerald-700",
      },
      {
        icon: <FaHtml5 />,
        label: "HTML",
        className: "text-orange-500",
      },
      {
        icon: <FaCss3Alt />,
        label: "CSS",
        className: "text-blue-500",
      },
      {
        icon: <SiTailwindcss />,
        label: "Tailwind",
        className: "text-sky-400",
      },
    ];

    const getSafePosition = (existing: Tag[]) => {
  let tries = 0;

  while (tries < 100) {
    const x = Math.random() * 300;
    const y = Math.random() * 300;

    //  get center rect (relative to container)
    let isInsideCenter = false;

    if (containerRef.current && centerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const centerRect = centerRef.current.getBoundingClientRect();

      const cx = centerRect.left - containerRect.left;
      const cy = centerRect.top - containerRect.top;
      const cw = centerRect.width;
      const ch = centerRect.height;

      if (
        x < cx + cw &&
        x + TAG_SIZE > cx &&
        y < cy + ch &&
        y + TAG_SIZE > cy
      ) {
        isInsideCenter = true;
      }
    }

    // ❗ check overlap with other tags
    const isOverlapping = existing.some((t) => {
      const dx = t.x - x;
      const dy = t.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < TAG_SIZE;
    });

    if (!isOverlapping && !isInsideCenter) {
      return { x, y };
    }

    tries++;
  }

  // fallback (rare)
  return { x: Math.random() * 300, y: Math.random() * 300 };
};

    const initial: Tag[] = [];

    techs.forEach((tech, i) => {
      const pos = getSafePosition(initial);

      initial.push({
        id: i,
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        ...tech,
      });
    });

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

          if (centerRef.current) {
            const containerRect = containerRef.current!.getBoundingClientRect();
            const centerRect = centerRef.current.getBoundingClientRect();

            const cx = centerRect.left - containerRect.left;
            const cy = centerRect.top - containerRect.top;
            const cw = centerRect.width;
            const ch = centerRect.height;

            // AABB collision check
            if (
              nx < cx + cw &&
              nx + TAG_SIZE > cx &&
              ny < cy + ch &&
              ny + TAG_SIZE > cy
            ) {
              // detect which side collision
              const overlapX = Math.min(nx + TAG_SIZE - cx, cx + cw - nx);
              const overlapY = Math.min(ny + TAG_SIZE - cy, cy + ch - ny);

              if (overlapX < overlapY) {
                vx *= -1;
                nx = t.x; // revert X
              } else {
                vy *= -1;
                ny = t.y; // revert Y
              }
            }
          }

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
    <div className="w-full p-4 md:p-8  scale-75 md:scale-85 lg:scale-100 rounded-2xl shadow-xl bg-white  md:mx-12 md:mb-12">
      <div
        ref={containerRef}
        className="relative w-full  h-[400px]  overflow-hidden  "
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
                stroke="#22c55e"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        {/* center  */}
        <div
          ref={centerRef}
          className="absolute w-72 h-36 rounded-2xl bg-white border border-gray-300 flex items-center px-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer "
        >
          <div>
            <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0">
              <Image
                width={100}
                height={100}
                className="w-16 h-16 rounded-full"
                src="/FEAvatar.png"
                alt=""
              />
            </div>
            <p className="text-center font-bold text-sm "> Nguyễn Sỹ Công</p>
          </div>

          <div className="ml-4 flex flex-col justify-center">
            <h3 className="text-gray-800 font-semibold text-sm">
              Frontend developer
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              "Dream become second life, if you can remember it"
            </p>
          </div>

          <a
            href="https://github.com/Penguinn35"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <FaGithub className="w-8 h-8" />
          </a>
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
              className={`w-full h-full flex items-center text-5xl justify-center rounded-md bg-white ${tag.className}`}
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
    </div>
  );
}
