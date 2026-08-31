import Image from "next/image";
import type { SiteSettings } from "@/types/domain";

type BrandSettings = Pick<SiteSettings, "brandName" | "brandDisplayType" | "logo">;

export function BrandMark({
  settings,
  textClassName = "",
  logoClassName = "h-8 w-auto max-w-full",
  priority = false,
}: {
  settings: BrandSettings;
  textClassName?: string;
  logoClassName?: string;
  priority?: boolean;
}) {
  if (settings.brandDisplayType === "logo" && settings.logo?.url) {
    return (
      <Image
        src={settings.logo.url}
        alt={settings.logo.alt || `${settings.brandName} logo`}
        width={settings.logo.width || 480}
        height={settings.logo.height || 160}
        className={`object-contain ${logoClassName}`}
        priority={priority}
      />
    );
  }

  return <span className={`wordmark ${textClassName}`}>{settings.brandName}</span>;
}
