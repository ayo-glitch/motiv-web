import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { EventListWrapper as EventList } from "@/components/EventListWrapper";
import { FilterButtons } from "@/components/FilterButtons";
import { AboutSection } from "@/components/AboutSection";
import { CreateRaveSection } from "@/components/CreateRaveSection";
import { FAQCard } from "@/components/FAQCard";
import { NewsletterSubscription } from "@/components/NewsletterSubscription";
import { Footer } from "@/components/Footer";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { BackendStatus } from "@/components/BackendStatus";
import { FilterProvider } from "@/lib/contexts/FilterContext";

// Removed mock data - now using real API data

const faqData = [
  {
    question: "Do I need to sign up?",
    answer:
      "No sign up required. You can explore and book events directly without creating an account.",
  },
  {
    question: "Where are these raves happening?",
    answer:
      "Everywhere in Lagos, from Island rooftops to underground Mainland events. Use filters to find your vibe.",
  },
  {
    question: "Can I buy tickets on Motiv?",
    answer:
      "Yes. You can buy tickets directly on the platform. Quick, secure, and no more stress.",
  },
  {
    question: "How often are events updated?",
    answer:
      "Daily. We keep the list fresh, so you never miss what's popping tonight or this weekend.",
  },
];

export default function HomePage() {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <Header />
        <HeroSection />

        {/* Popular Raves Section */}
        <ScrollAnimation>
          <section className="px-4 md:px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Popular Raves in Lagos
              </h2>

              <FilterButtons />

              {/* Real Events from API */}
              <EventList />
            </div>
          </section>
        </ScrollAnimation>

      <ScrollAnimation delay={200}>
        <AboutSection />
      </ScrollAnimation>

      <ScrollAnimation delay={300}>
        <CreateRaveSection />
      </ScrollAnimation>

      {/* FAQ Section */}
      <ScrollAnimation delay={200}>
        <section className="px-4 md:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Frequently Asked Questions.
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqData.map((faq, index) => (
                <ScrollAnimation key={index} delay={index * 150}>
                  <FAQCard question={faq.question} answer={faq.answer} />
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Newsletter Subscription */}
      {/* <ScrollAnimation delay={300}>
        <NewsletterSubscription />
      </ScrollAnimation> */}

        <Footer />
      </div>
    </FilterProvider>
  );
}
