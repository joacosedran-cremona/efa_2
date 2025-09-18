"use client";

import dynamic from "next/dynamic";

const DesmoldeoLayout = dynamic(() => import("./desmoldeo-client"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col w-full p-5 gap-5">
      <h1>Loading...</h1>
    </div>
  ),
});

export default function DesmoldeoClient() {
  return <DesmoldeoLayout />;
}
