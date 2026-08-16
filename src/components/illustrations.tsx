export function BooksHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      width="200"
      height="168"
      viewBox="0 0 200 168"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Plant behind books */}
      <ellipse cx="42" cy="148" rx="16" ry="6" fill="#CBD5E1" opacity="0.5" />
      <rect x="34" y="128" width="16" height="18" rx="3" fill="#F59E0B" />
      <rect x="32" y="124" width="20" height="8" rx="2" fill="#D97706" />
      <path
        d="M42 124C42 124 28 108 22 96C28 100 36 112 42 118C42 108 38 90 42 78C46 90 42 108 42 118C48 112 56 100 62 96C56 108 42 124 42 124Z"
        fill="#34D399"
      />
      <path
        d="M42 118C42 118 34 104 30 92C36 98 40 110 42 116C44 104 50 88 56 84C48 98 42 116 42 118Z"
        fill="#10B981"
      />

      {/* Book stack */}
      <rect x="58" y="118" width="112" height="18" rx="4" fill="#93C5FD" />
      <rect x="62" y="122" width="28" height="4" rx="2" fill="#DBEAFE" />
      <rect x="54" y="100" width="116" height="18" rx="4" fill="#60A5FA" />
      <rect x="58" y="104" width="32" height="4" rx="2" fill="#BFDBFE" />
      <rect x="50" y="82" width="120" height="18" rx="4" fill="#3B82F6" />
      <rect x="54" y="86" width="36" height="4" rx="2" fill="#93C5FD" />

      {/* Mug */}
      <rect
        x="118"
        y="42"
        width="42"
        height="40"
        rx="8"
        fill="white"
        stroke="#3B82F6"
        strokeWidth="2.5"
      />
      <path
        d="M160 52C168 52 172 60 168 70C165 76 160 76 160 76"
        stroke="#3B82F6"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Heart */}
      <path
        d="M133 68C133 64.5 136.5 62.5 139 65.5C141.5 62.5 145 64.5 145 68C145 72.5 139 77 139 77C139 77 133 72.5 133 68Z"
        fill="#3B82F6"
      />
      {/* Steam */}
      <path
        d="M128 34C128 34 126 26 130 22"
        stroke="#93C5FD"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M139 32C139 32 137 22 141 18"
        stroke="#93C5FD"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M150 34C150 34 148 26 152 22"
        stroke="#93C5FD"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloudMascot({ className }: { className?: string }) {
  return (
    <svg
      width="128"
      height="110"
      viewBox="0 0 128 110"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Soft shadow */}
      <ellipse cx="62" cy="100" rx="38" ry="7" fill="#93C5FD" opacity="0.35" />

      {/* Cloud body */}
      <ellipse cx="40" cy="62" rx="28" ry="24" fill="#93C5FD" />
      <ellipse cx="86" cy="60" rx="30" ry="26" fill="#7DD3FC" />
      <ellipse cx="62" cy="52" rx="34" ry="28" fill="#BFDBFE" />
      <ellipse cx="62" cy="72" rx="42" ry="26" fill="#93C5FD" />
      <ellipse cx="62" cy="66" rx="38" ry="22" fill="#BAE6FD" />

      {/* Blush */}
      <ellipse cx="40" cy="70" rx="7" ry="4" fill="#F9A8D4" opacity="0.55" />
      <ellipse cx="86" cy="70" rx="7" ry="4" fill="#F9A8D4" opacity="0.55" />

      {/* Glasses */}
      <circle cx="46" cy="64" r="13" fill="white" fillOpacity="0.55" stroke="#1E3A8A" strokeWidth="2.2" />
      <circle cx="80" cy="64" r="13" fill="white" fillOpacity="0.55" stroke="#1E3A8A" strokeWidth="2.2" />
      <path d="M59 64H67" stroke="#1E3A8A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M33 62C30 58 28 58 26 60" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />
      <path d="M93 62C96 58 98 58 100 60" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" />

      {/* Eyes */}
      <circle cx="46" cy="64" r="3.2" fill="#1E3A8A" />
      <circle cx="80" cy="64" r="3.2" fill="#1E3A8A" />
      <circle cx="47.2" cy="62.8" r="1.1" fill="white" />
      <circle cx="81.2" cy="62.8" r="1.1" fill="white" />

      {/* Smile */}
      <path
        d="M56 78C58.5 82 67.5 82 70 78"
        stroke="#1E3A8A"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Pencil */}
      <g transform="rotate(28 104 42)">
        <rect x="98" y="18" width="10" height="8" rx="2" fill="#F472B6" />
        <rect x="98" y="26" width="10" height="4" fill="#CBD5E1" />
        <rect x="98" y="30" width="10" height="28" rx="1" fill="#FBBF24" />
        <path d="M98 58H108L103 68L98 58Z" fill="#F59E0B" />
        <path d="M101 64L103 68L105 64H101Z" fill="#1E293B" />
      </g>
    </svg>
  );
}

export function PottedPlant({ className }: { className?: string }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="28" cy="52" rx="12" ry="3" fill="#CBD5E1" opacity="0.6" />
      <path d="M18 36H38L35 50H21L18 36Z" fill="#F59E0B" />
      <rect x="16" y="32" width="24" height="6" rx="2" fill="#D97706" />
      <path
        d="M28 32C28 32 16 20 12 10C18 14 24 24 28 28C28 18 24 6 28 0C32 6 28 18 28 28C32 24 38 14 44 10C40 20 28 32 28 32Z"
        fill="#34D399"
      />
      <path
        d="M28 28C28 28 22 16 18 8C24 12 26 22 28 26C30 16 36 4 42 2C34 12 28 26 28 28Z"
        fill="#10B981"
      />
    </svg>
  );
}

export function QuizMarkIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M7.6 8.4C7.6 6.1 9.4 4.6 11.3 4.6C13.3 4.6 15 6 15 8.2C15 9.9 14.1 10.8 12.7 11.6C12 12 11.5 12.5 11.5 13.4V14.2"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="11.5" cy="17.4" r="1.35" fill="white" />
    </svg>
  );
}

export function CardsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="13" height="11" rx="2.5" stroke="white" strokeWidth="1.8" />
      <rect x="7" y="3" width="13" height="11" rx="2.5" fill="white" />
    </svg>
  );
}

export function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 9.5V14.5H7.5L12 19V5L7.5 9.5H4Z"
        fill="currentColor"
      />
      <path
        d="M16 8.5C17.2 9.7 17.9 11.3 17.9 13C17.9 14.7 17.2 16.3 16 17.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.5 6C20.5 8 21.7 10.4 21.7 13C21.7 15.6 20.5 18 18.5 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5L14.6 9.1L20.8 9.8L16.2 14L17.5 20.1L12 17L6.5 20.1L7.8 14L3.2 9.8L9.4 9.1L12 3.5Z"
        fill={filled ? "#FBBF24" : "none"}
        stroke={filled ? "#FBBF24" : "#94A3B8"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
