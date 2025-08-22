import { Card } from "@/components/ui/card"

interface FAQCardProps {
  question: string
  answer: string
}

export function FAQCard({ question, answer }: FAQCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] border-[#333] p-6 hover:border-gray-500 transition-all duration-300 hover:shadow-md group cursor-pointer">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors duration-300">
          {question}
        </h3>
        <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
          {answer}
        </p>
      </div>
    </Card>
  )
}