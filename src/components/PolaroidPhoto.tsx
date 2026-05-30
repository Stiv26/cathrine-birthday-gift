import { useState } from "react";

type Props = {
  src: string;
  caption: string;
  index: number;
  rotate: number;
};

/** Foto bergaya polaroid dengan fallback gradient bila gambar gagal load. */
export default function PolaroidPhoto({ src, caption, index, rotate }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="select-none rounded-sm bg-white p-3 pb-5 shadow-2xl"
      style={{ rotate: `${rotate}deg` }}
    >
      <div className="relative aspect-[4/5] w-64 overflow-hidden rounded-sm bg-rose/30 sm:w-72">
        {failed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-merah via-rose to-tirai">
            <span className="font-hand text-3xl text-krem drop-shadow">
              Foto {index + 1}
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={caption}
            draggable={false}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <p className="mt-3 text-center font-hand text-2xl leading-tight text-ink">
        {caption}
      </p>
    </div>
  );
}
