import type { Reflection, Template } from "../backend";
import { useGetCallerUserProfile } from "../hooks/queries/useUserProfile";
import { derivePosterContent } from "../lib/poster/derivePosterContent";

interface PosterPreviewProps {
  reflection: Reflection;
  template: Template;
}

export default function PosterPreview({
  reflection,
  template,
}: PosterPreviewProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const { excerpt, attribution } = derivePosterContent(reflection, userProfile);

  return (
    <div id="poster-preview" className="mx-auto max-w-md">
      <div
        className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-xl"
        style={{
          backgroundImage: `url(${template.previewImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="relative h-full flex flex-col justify-between p-8 text-white">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold leading-tight drop-shadow-lg">
              {reflection.title}
            </h2>
            <p className="text-sm leading-relaxed drop-shadow-md opacity-95">
              {excerpt}
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-px bg-white/30" />
            <p className="text-xs font-medium drop-shadow-md">{attribution}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
