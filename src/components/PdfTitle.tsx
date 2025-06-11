import React from "react";

export default function PdfTitle({ title }: { title: string }) {
  return (
    <div className="bg-[#660000] text-white px-6 py-2 border-b-4 mt-4">
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}
