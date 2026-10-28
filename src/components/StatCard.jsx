import React from 'react'

const TONE_STYLES = {
  green: {
    iconBg: 'bg-[#e8f4e5] text-[#2c7542]',
    badgeBg: 'bg-[#edf6eb] text-[#2c7542]',
  },
  mint: {
    iconBg: 'bg-[#e3f4ee] text-[#227a61]',
    badgeBg: 'bg-[#e7f7f1] text-[#227a61]',
  },
  rose: {
    iconBg: 'bg-[#feece9] text-[#c04d3e]',
    badgeBg: 'bg-[#feece9] text-[#c04d3e]',
  },
  amber: {
    iconBg: 'bg-[#fef3de] text-[#b87c1c]',
    badgeBg: 'bg-[#fdf3e0] text-[#b87c1c]',
  },
  lavender: {
    iconBg: 'bg-[#f0edff] text-[#6d57b5]',
    badgeBg: 'bg-[#f3f0ff] text-[#6d57b5]',
  },
}

export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'green',
  badge,
  onClick,
}) {
  const styles = TONE_STYLES[tone] || TONE_STYLES.green

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-[#e5ebe2] bg-white p-4 sm:p-5 shadow-xs transition duration-150 ${
        onClick ? 'cursor-pointer hover:border-[#cbdec4] hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconBg}`}>
          <Icon size={20} />
        </div>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-tight ${styles.badgeBg}`}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#79887b]">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#173020] tabular-nums">
        {value}
      </p>
      {detail && <p className="mt-1 text-[11px] leading-tight text-[#8c9c8e]">{detail}</p>}
    </div>
  )
}

