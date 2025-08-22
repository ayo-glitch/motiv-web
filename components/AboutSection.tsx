import Image from "next/image";

export function AboutSection() {
  return (
    <section className="px-4 md:px-6 py-10 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D72638] via-transparent to-[#D72638] transform rotate-12 scale-150"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-[400px_1fr] gap-16 items-center">
          <div className="relative group">
            <Image
              src="https://res.cloudinary.com/dkuphcizs/image/upload/v1753716187/kyle-kioko-lFlkYTrTriM-unsplash_j0ejvh.png"
              alt="Atmospheric nightlife scene"
              width={400}
              height={400}
              className="rounded-lg object-cover w-full h-[400px] shadow-xl group-hover:scale-102 transition-transform duration-300"
            />
          </div>

          <div className="space-y-6 lg:pl-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              About us
            </h2>
            <div className="space-y-5 text-gray-300 text-base leading-relaxed">
              <p className="relative pl-4">
                <span className="absolute left-0 top-2 w-2 h-2 bg-[#D72638] rounded-full"></span>
                MOTIV is building the future of nightlife in Lagos.
              </p>
              <p className="relative pl-4">
                <span className="absolute left-0 top-2 w-2 h-2 bg-[#D72638] rounded-full"></span>
                We make discovering and attending raves simple, fast and
                cashless. Whether you're looking for a hidden rooftop party, a
                packed club or the latest underground scene, MOTIV helps you
                find the best events without the stress.
              </p>
              <p className="relative pl-4">
                <span className="absolute left-0 top-2 w-2 h-2 bg-[#D72638] rounded-full"></span>
                We're here to connect the city's energy with the people who live
                for it. One rave at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
