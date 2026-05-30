import { useState } from "react";

type Props = {
  src: string;
  rotate: number;
};

/** Foto bergaya polaroid (tanpa caption) dengan fallback gradient. */
export default function PolaroidPhoto({ src, rotate }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="select-none rounded-sm bg-white p-3 pb-4 shadow-2xl"
      style={{ rotate: `${rotate}deg` }}
    >
      <div className="relative aspect-[4/5] w-64 overflow-hidden rounded-sm bg-rose/30 sm:w-72">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-merah via-rose to-tirai text-4xl">
            ❤️
          </div>
        ) : (
          <img
            src={src}
            alt=""
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
