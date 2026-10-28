import React from 'react'

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5b8761]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#173020]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#738375]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

