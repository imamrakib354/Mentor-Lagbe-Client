import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
]

const socialLinks = [
  {
    label: "Facebook",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.025 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.49 0-1.956.931-1.956 1.887v2.263h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.099 24 12.073Z",
  },
  {
    label: "X",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933Zm-1.29 19.49h2.039L6.487 3.24H4.3l13.31 17.403Z",
  },
  {
    label: "Instagram",
    path: "M7 0C3.134 0 0 3.134 0 7v10c0 3.866 3.134 7 7 7h10c3.866 0 7-3.134 7-7V7c0-3.866-3.134-7-7-7H7Zm0 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm11 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-6 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z",
  },
  {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z",
  },
]

export function Footer() {
  return (
    <footer className="w-full overflow-hidden rounded-3xl bg-linear-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
      <div className="grid gap-10 px-6 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1fr] lg:gap-12 lg:px-10 lg:py-12">
        <div>
          <Link
            href="/"
            aria-label="MentorLagbe home"
            className="inline-block rounded-xl bg-white px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span className="flex h-12 w-48 items-center overflow-hidden">
              <Image
                src="/images/Mentor_logo.png"
                alt="MentorLagbe"
                width={2172}
                height={724}
                sizes="192px"
                className="h-auto w-48 shrink-0"
              />
            </span>
          </Link>
          <p className="mt-5 max-w-64 text-sm leading-7 text-blue-100">
            The right mentor. A brighter future. Connecting students with tutors
            and mentorship across Bangladesh.
          </p>
        </div>

        <nav aria-labelledby="footer-links-heading">
          <h2
            id="footer-links-heading"
            className="text-xs font-semibold tracking-widest uppercase"
          >
            Quick links
          </h2>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm text-sm text-blue-100 transition-colors hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase">
            Get in touch
          </h2>
          {/* Sample contact information for this UI preview. */}
          <address className="mt-5 space-y-4 text-sm text-blue-100 not-italic">
            <p className="flex items-center gap-3">
              <Mail aria-hidden="true" className="size-4 shrink-0" />
              <span className="break-all">hello@mentorlagbe.com</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone aria-hidden="true" className="size-4 shrink-0" />
              <span>+880 1700-000000</span>
            </p>
            <p className="flex items-center gap-3">
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </p>
          </address>
        </div>

        <div>
          <h2 className="text-xs font-semibold tracking-widest uppercase">
            Stay connected
          </h2>
          <p className="mt-5 max-w-60 text-sm leading-7 text-blue-100">
            Study tips, tutor stories, and a little inspiration for your next
            step.
          </p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map((social) => (
              <button
                key={social.label}
                type="button"
                disabled
                aria-label={`${social.label} (coming soon)`}
                title={`${social.label} — coming soon`}
                className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-4"
                >
                  <path d={social.path} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-white/20 px-6 py-5 text-xs leading-6 text-blue-100 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
        <p>Made for learning. Built for your future.</p>
      </div>
    </footer>
  )
}
