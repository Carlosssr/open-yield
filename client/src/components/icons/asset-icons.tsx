interface AssetIconProps {
  symbol: string;
  className?: string;
}

export function AssetIcon({ symbol, className = "w-8 h-8" }: AssetIconProps) {
  switch (symbol.toUpperCase()) {
    case "ETH":
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
    case "USDC":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#2775CA" />
          <path
            d="M20.5 18.5c0-2-1.2-2.7-3.5-3-.8-.1-1.5-.3-1.5-1s.5-1 1.5-1c.8 0 1.3.3 1.5.8.1.2.2.2.4.2h1c.2 0 .4-.2.3-.4-.2-1-1-1.8-2.2-2v-1.1c0-.2-.2-.4-.4-.4h-.8c-.2 0-.4.2-.4.4v1c-1.6.3-2.6 1.3-2.6 2.6 0 2 1.2 2.7 3.5 3 .8.1 1.5.4 1.5 1s-.6 1.1-1.6 1.1c-1 0-1.5-.4-1.7-1-.1-.2-.2-.3-.4-.3h-1c-.2 0-.4.2-.3.4.3 1.2 1.2 1.9 2.5 2.1v1.2c0 .2.2.4.4.4h.8c.2 0 .4-.2.4-.4v-1.2c1.6-.2 2.6-1.3 2.6-2.7Z"
            fill="#fff"
          />
          <path
            d="M13 24.5c-4.7-1.7-7-7-5.3-11.6 1-2.7 3.2-4.6 5.8-5.3.2-.1.3-.2.3-.4v-.9c0-.2-.1-.4-.4-.3-4.8 1.1-8 5.8-6.9 10.8.7 3 3 5.4 5.9 6.1.2.1.4-.1.4-.3v-.9c0-.1-.2-.3-.4-.4-.1 0-.3.1-.4.2Z"
            fill="#fff"
          />
          <path
            d="M19 5c-.2-.1-.4.1-.4.3v.9c0 .2.1.3.4.4 4.7 1.7 7 7 5.3 11.6-1 2.7-3.2 4.6-5.8 5.3-.2.1-.3.2-.3.4v.9c0 .2.1.4.4.3 4.8-1.1 8-5.8 6.9-10.8-.7-3-3-5.4-5.9-6.1-.2-.1-.4.1-.4.3-.1 0 0-.1-.2-.5Z"
            fill="#fff"
          />
        </svg>
      );
    case "DAI":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#F5AC37" />
          <path d="M16 6 8 16l8 10 8-10L16 6Z" fill="#fff" />
          <path d="M16 6v20M8 16h16" stroke="#F5AC37" strokeWidth="1.5" />
        </svg>
      );
    case "WBTC":
      return (
        <svg className={className} viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path
            d="M21.5 14c.3-2-1.3-3.1-3.4-3.8l.7-2.8-1.7-.4-.7 2.7c-.4-.1-.9-.2-1.4-.3l.7-2.8-1.7-.4-.7 2.8-3.4-.8-.5 1.8s1.3.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c.1 0 .1 0 .2.1l-.2-.1-1.1 4.5c-.1.2-.3.6-.8.4 0 0-1.2-.3-1.2-.3l-.8 2 3.2.8-.7 2.8 1.7.4.7-2.8c.5.1.9.2 1.4.3l-.7 2.8 1.7.4.7-2.8c3 .6 5.2.3 6.1-2.4.8-2.1 0-3.4-1.6-4.2 1.1-.3 2-1 2.2-2.6Zm-4 5.6c-.5 2.1-4.2 1-5.4.7l1-3.9c1.2.3 5 .9 4.4 3.2Zm.6-5.6c-.5 1.9-3.5.9-4.5.7l.9-3.5c1 .2 4.1.7 3.6 2.8Z"
            fill="#fff"
          />
        </svg>
      );
    default:
      return (
        <div
          className={`${className} rounded-full bg-muted flex items-center justify-center`}
        >
          <span className="text-xs font-medium text-muted-foreground">
            {symbol.slice(0, 2)}
          </span>
        </div>
      );
  }
}
