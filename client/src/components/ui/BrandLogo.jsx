import React from 'react';

export default function BrandLogo({ size = 'md' }) {
  const dim = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11';

  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br from-[#FFF8EC] to-[#FBEBD0] border-2 border-[#C8961E] shadow-[0_4px_12px_rgba(230,81,0,0.18)] flex items-center justify-center shrink-0 p-1.5`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Sacred Diya Flame */}
        <path
          d="M32 7C32 7 25.5 14.5 25.5 19.5C25.5 23.1 28.4 26 32 26C35.6 26 38.5 23.1 38.5 19.5C38.5 14.5 32 7 32 7Z"
          fill="#E65100"
        />
        <path
          d="M32 13C32 13 29 17 29 19.5C29 21.2 30.3 22.5 32 22.5C33.7 22.5 35 21.2 35 19.5C35 17 32 13 32 13Z"
          fill="#FFF8EC"
        />

        {/* Mango Leaves / Lotus Petals */}
        <path
          d="M20 31C16 26 12 27 11 31C14 33 17 34 21 33L20 31Z"
          fill="#C8961E"
        />
        <path
          d="M44 31C48 26 52 27 53 31C50 33 47 34 43 33L44 31Z"
          fill="#C8961E"
        />

        {/* Sacred Kalash Pot */}
        <path
          d="M23 31H41L39.5 35.5C43.5 38 45.5 42.2 44.5 46.8C43.5 51.5 38.8 55 32 55C25.2 55 20.5 51.5 19.5 46.8C18.5 42.2 20.5 38 24.5 35.5L23 31Z"
          fill="#E65100"
          stroke="#4A1C0C"
          strokeWidth="1.5"
        />
        {/* Kalash Neck & Tilak Band */}
        <rect x="22" y="29" width="20" height="3.5" rx="1.75" fill="#C8961E" />
        <path
          d="M25.5 43.5C29.5 45.5 34.5 45.5 38.5 43.5"
          stroke="#FFF8EC"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="40" r="1.8" fill="#FFF8EC" />
      </svg>
    </div>
  );
}
