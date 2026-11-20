import BannerSection from "./_components/banner"
import CommunitySection from "./_components/community-section"
import FeaturedTuitions from "./_components/featured-tuitions"
import HowItWorks from "./_components/how-it-works"
import PricingSection from "./_components/pricing-section"

export default function HomePage() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <BannerSection />
      <FeaturedTuitions />
      <PricingSection />
      <HowItWorks />
      <CommunitySection />
    </div>
  )
}
