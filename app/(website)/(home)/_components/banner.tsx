"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, GraduationCap, Layers, Users } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

const highlights = [
  { label: "Subject-wise tutors", icon: GraduationCap },
  { label: "Structured batches", icon: Layers },
  { label: "Student friendly", icon: Users },
]

export default function BannerSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="banner-heading"
      className="relative isolate overflow-hidden rounded-3xl border border-blue-100 bg-blue-50"
    >
      <Image
        src="/images/banner_background.png"
        alt=""
        fill
        loading="eager"
        sizes="100vw"
        className="-z-20 object-cover object-right-bottom"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-blue-50/95 via-blue-50/85 to-transparent lg:bg-none"
      />

      <div className="grid lg:min-h-144 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10 px-5 pt-10 sm:px-10 sm:pt-14 lg:py-14 lg:pr-0 lg:pl-12 xl:pl-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-100/90 px-3 py-2 text-xs font-semibold text-blue-800 sm:gap-3 sm:px-5 sm:text-sm">
            <GraduationCap aria-hidden="true" className="size-5 shrink-0" />
            <span>Learn</span>
            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-blue-600"
            />
            <span>Teach</span>
            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-blue-600"
            />
            <span>Grow Together</span>
          </div>

          <h1
            id="banner-heading"
            className="mt-6 max-w-3xl text-3xl leading-[1.12] font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-[clamp(2.75rem,3.5vw,4.5rem)]"
          >
            Find Your Ideal Tutor or{" "}
            <span className="block text-blue-700">Mentorship Batch Today</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Discover qualified tutors, join structured mentorship batches, and
            take your learning to the next level — all in one trusted platform
            for students and tutors.
          </p>

          <Link
            href="/tuitions"
            className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/15 transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:px-7"
          >
            Browse Tuitions
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform motion-safe:group-hover:translate-x-1"
            />
          </Link>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4 sm:mt-10">
            {highlights.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-xs font-medium text-slate-700 sm:text-sm"
              >
                <Icon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-blue-600 sm:size-6"
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}
          className="relative mx-auto mt-4 h-96 w-full max-w-md sm:h-112 lg:mt-0 lg:h-auto lg:min-h-144 lg:max-w-none"
        >
          <motion.div
            initial={false}
            animate={reduceMotion ? { y: 0 } : { y: [0, -5, 0] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 7,
                    delay: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            className="absolute inset-x-0 top-5 -bottom-2 lg:top-6 lg:right-6"
          >
            <Image
              src="/images/Banner_Image.png"
              alt="A smiling student holding blue notebooks and carrying a backpack."
              fill
              preload
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 448px, 100vw"
              className="object-contain object-bottom lg:object-left-bottom"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
