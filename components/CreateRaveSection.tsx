import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CreateRaveSection() {
  return (
    <section className="px-4 md:px-6 py-10 text-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D72638]/5 via-transparent to-[#B91E2F]/5 animate-pulse"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-[#D72638]/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#B91E2F]/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-geist bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          Create a Rave
          <br />
          with Motiv
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Got a rave with a great experience? Partner with us & get listed on Motiv
        </p>
        <Button className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
          <Calendar className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          <span className="group-hover:translate-x-1 transition-transform duration-300">Create Rave</span>
        </Button>
      </div>
    </section>
  )
}