import React from "react";

const PageLoader = ({ message, fullScreen = false, className = "" }) => {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-6",
        fullScreen ? "min-h-screen w-full" : "min-h-[50vh] w-full py-16",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center">
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(167, 139, 250, 0.35), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 rounded-full border-[3px] border-white/[0.07]" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-violet-400 border-r-fuchsia-500 animate-spin" />
        <div className="absolute inset-[7px] rounded-full border-2 border-transparent border-b-cyan-400/80 border-l-purple-400/80 animate-[spin_0.7s_linear_infinite_reverse]" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_24px_rgba(192,132,252,0.75)]" />
      </div>
      {message ? (
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/40">
          {message}
        </p>
      ) : null}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default PageLoader;
