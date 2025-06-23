import React from "react";

export function Avatar({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

export function AvatarFallback({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`flex items-center justify-center bg-gray-400 text-white ${className}`}>
      {children}
    </div>
  );
}
