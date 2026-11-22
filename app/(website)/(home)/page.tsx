import BannerSection from "./_components/banner"
import CommunitySection from "./_components/community-section"
import FeaturedTuitions from "./_components/featured-tuitions"
import HowItWorks from "./_components/how-it-works"
import PricingSection from "./_components/pricing-section"

export default function HomePage() {
  return (
    <div className="home-page space-y-10 bg-[#f0f7ff] px-3 py-6 sm:space-y-12 sm:px-5 sm:py-8">
      <BannerSection />
      <FeaturedTuitions />
      <PricingSection />
      <HowItWorks />
      <CommunitySection />
    </div>
  )
}
