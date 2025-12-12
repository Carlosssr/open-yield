interface NetworkIconProps {
  network: string;
  className?: string;
}

export function NetworkIcon({ network, className = "w-5 h-5" }: NetworkIconProps) {
  switch (network.toLowerCase()) {
    case "ethereum":
    case "eth":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <path d="M16.498 4v8.87l7.497 3.35L16.498 4Z" fill="#fff" fillOpacity=".6" />
          <path d="M16.498 4L9 16.22l7.498-3.35V4Z" fill="#fff" />
          <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352Z" fill="#fff" fillOpacity=".6" />
          <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.38Z" fill="#fff" />
          <path d="m16.498 20.573 7.497-4.353-7.497-3.348v7.7Z" fill="#fff" fillOpacity=".2" />
          <path d="m9 16.22 7.498 4.353v-7.7L9 16.22Z" fill="#fff" fillOpacity=".6" />
        </svg>
      );
    case "arbitrum":
    case "arb":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#2D374B" />
          <path d="M16.7 11.2 21.6 20h-2.4l-2.5-4.6-2.5 4.6h-2.4l4.9-8.8Z" fill="#28A0F0" />
          <path d="m13.2 20 2.8-5.1 1.5 2.7-1.3 2.4h-3Z" fill="#fff" />
          <path d="M19.8 20h3l-4.9-8.8-1.5 2.7L19.8 20Z" fill="#fff" />
        </svg>
      );
    case "optimism":
    case "op":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#FF0420" />
          <path
            d="M11.5 20.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5S16 13.5 16 16s-2 4.5-4.5 4.5Zm0-7c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5S14 17.4 14 16s-1.1-2.5-2.5-2.5Z"
            fill="#fff"
          />
          <path
            d="M22.5 20.5h-2V16c0-1.4-1.1-2.5-2.5-2.5h-1v-2h1c2.5 0 4.5 2 4.5 4.5v4.5Z"
            fill="#fff"
          />
        </svg>
      );
    case "base":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#0052FF" />
          <path
            d="M16 26c-5.5 0-10-4.5-10-10S10.5 6 16 6c4.9 0 8.9 3.5 9.8 8h-5.3c-.8-1.8-2.5-3-4.5-3-2.8 0-5 2.2-5 5s2.2 5 5 5c2 0 3.7-1.2 4.5-3h5.3c-.9 4.5-4.9 8-9.8 8Z"
            fill="#fff"
          />
        </svg>
      );
    default:
      return (
        <div className={`${className} rounded-full bg-muted flex items-center justify-center`}>
          <span className="text-xs text-muted-foreground">?</span>
        </div>
      );
  }
}
