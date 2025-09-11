"use client";

export default function Home() {
  return (
    <section className="flex flex-col h-full w-full py-6 px-6 gap-6">
      <div className="bg-background2 text-texto p-6 rounded-lg w-full h-full text-center flex">
        Background 2
        <div className="bg-background3 text-texto p-6 rounded-lg w-full h-full text-center flex">
          Background 3
          <div className="bg-background4 text-texto p-6 rounded-lg w-full h-full text-center flex">
            Background 4
            <div className="bg-background5 text-texto p-6 rounded-lg w-full h-full text-center flex">
              Background 5
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
