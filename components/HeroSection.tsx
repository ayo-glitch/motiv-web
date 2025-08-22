import { Button } from "@/components/ui/button"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="px-4 md:px-6 py-6 md:py-8 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D72638]/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="grid lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto relative">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight font-geist bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-pulse-subtle">
            TONIGHT IS
            <br />
            FOR THE
            <br />
            RAVERS
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-md leading-relaxed">
            Unfiltered Lagos nightlife. Curated raves, no tickets lost, just vibes.
          </p>
          <Button className="bg-gradient-to-r from-[#D72638] to-[#B91E2F] hover:from-[#B91E2F] hover:to-[#A01A2A] text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-[#D72638]/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
            <span className="group-hover:translate-x-1 transition-transform duration-300">Get Started</span>
          </Button>
        </div>

        <div className="relative group">
          <Image
            src="https://res.cloudinary.com/dkuphcizs/image/upload/v1753716187/frankie-cordoba-Mhjk0TZ6tnw-unsplash_yi1j3i.png"
            alt="Rave party with vibrant lighting and crowd"
            width={600}
            height={400}
            className="rounded-lg object-cover w-full shadow-xl group-hover:scale-102 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  )
}