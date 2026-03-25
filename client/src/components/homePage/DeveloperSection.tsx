import React from 'react'
import FERole from './FERole'
import BERole from './BERole'

const DeveloperSection = () => {
  return (
    <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10
      [background-size:40px_40px]
      md:[background-size:60px_60px]
      lg:[background-size:80px_80px]"
          style={{
            backgroundImage: `
        linear-gradient(to right, oklch(95.1% 0.15 154.449) 1px, transparent 1px),
        linear-gradient(to bottom, oklch(95.1% 0.15 154.449) 1px, transparent 1px)
      `,
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 30%)",
            maskImage: "linear-gradient(to bottom, transparent, black 30%)",
          }}
        />

        <div className="text-center md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-600">
            Nhà phát triển
          </h1>
          <p className="text-lg text-gray-600">và công nghệ trong hệ thống</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          <FERole />
          <BERole />
        </div>
      </div>
  )
}

export default DeveloperSection