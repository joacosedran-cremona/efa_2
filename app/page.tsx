"use client";

export default function Home() {
  return (
    <section className="flex flex-col h-full w-full py-6 px-6 gap-6">
      <div className="bg-background2  p-6 rounded-lg w-full h-full text-center flex">
        Background 2
        <div className="bg-background3  p-6 rounded-lg w-full h-full text-center flex">
          Background 3
          <div className="bg-background4  p-6 rounded-lg w-full h-full text-center flex">
            Background 4
            <div className="bg-background5  p-6 rounded-lg w-full h-full text-center flex">
              Background 5
              <div className="bg-background6  p-6 rounded-lg w-full h-full text-center flex">
                Background 6
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
