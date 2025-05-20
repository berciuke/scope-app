"use client";
import Image from "next/image";

export default function ProfilePicture({ src, alt, size }) {
  const style = size < 144 ? "profile-picture-small" : "profile-picture";
  return (
      <Image
        src={src || "/profile-picture.jpg"}
        alt={alt || "Zdjęcie profilowe"}
        width={size || 144}
        height={size || 144}
        className={style}
      />
  );
}