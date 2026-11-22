// Pricing previews shared by the home section and pricing page.
export const pricingPlans = [
  {
    role: "tutor",
    audience: "Tutors",
    description: "Create, manage, and grow your tutoring presence.",
    free: {
      name: "Tutor Free",
      price: 0,
      features: [
        "Up to 2 tuition posts",
        "Basic batch management",
        "Appear in search results",
        "Basic profile and visibility",
      ],
    },
    pro: {
      name: "Tutor Pro",
      price: 15,
      badge: "Popular",
      features: [
        "Unlimited tuition posts",
        "Verified tutor badge",
        "Priority search placement",
        "Advanced batch management",
        "Priority support",
      ],
    },
  },
  {
    role: "student",
    audience: "Students",
    description: "Discover tutors, manage your learning, and get support.",
    free: {
      name: "Student Free",
      price: 0,
      features: [
        "Browse and view all listings",
        "Contact tutors",
        "Join approved batches",
        "Basic account access",
      ],
    },
    pro: {
      name: "Student Pro",
      price: 10,
      badge: "Best Value",
      features: [
        "Saved tuition tools",
        "Priority support",
        "Better tutor discovery",
        "Early access to new features",
      ],
    },
  },
] as const
