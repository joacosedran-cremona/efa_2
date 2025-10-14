"use client";

import dynamic from "next/dynamic";

const DesmoldeoLayout = dynamic(() => import("./desmoldeo-client"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col w-full p-5 gap-5">
      <p>Loading...</p>
    </div>
  ),
});

export default function DesmoldeoClient() {
  return <DesmoldeoLayout />;
}
