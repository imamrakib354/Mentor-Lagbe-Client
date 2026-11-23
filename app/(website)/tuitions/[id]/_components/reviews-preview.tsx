"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowDownUp, CalendarDays, Check, ChevronLeft, ChevronRight, Pencil, Send, Star, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

import { createReview, deleteReview, getMyReview, getReviews } from "@/lib/actions/reviews"
import type { Review, ReviewListing } from "@/lib/types/review"

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} aria-hidden="true" className={`size-4 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-300 text-slate-300 dark:fill-slate-600 dark:text-slate-600"}`} />
      ))}
    </span>
  )
}

function ReviewComment({ comment }: { comment: string }) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const element = textRef.current
    if (!element) return
    function checkOverflow() {
      if (!expanded && element) setOverflows(element.scrollHeight > element.clientHeight)
    }
    checkOverflow()
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(element)
    return () => observer.disconnect()
  }, [comment, expanded])

  return (
    <div className="mt-3">
      <p ref={textRef} className={`${expanded ? "" : "line-clamp-3"} break-words whitespace-pre-line text-sm leading-6 text-[#364962] dark:text-[#d9e4f5]`}>{comment}</p>
      {(overflows || expanded) && (
        <button type="button" onClick={() => setExpanded(!expanded)} className="mt-1 text-sm font-semibold text-[#245be8] hover:underline dark:text-[#a8c4ff]">
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  )
}

function ReviewCard({ review, own }: { review: Review; own?: boolean }) {
  const initials = review.studentName?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "S"
  return (
    <article className="rounded-2xl border border-[#d4e1f3] bg-[#ffffff] p-4 dark:border-[#3a5079] dark:bg-[#192a49]">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9ff] text-sm font-bold text-[#245be8] dark:bg-[#264b91] dark:text-[#e3edff]">{initials}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-[#10204c] dark:text-[#f4f7ff]">{review.studentName || "Student"}</h4>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e4efff] px-2 py-1 text-[10px] font-semibold text-[#245be8] dark:bg-[#254789] dark:text-[#d8e6ff]"><Check aria-hidden="true" className="size-3" /> {own ? "Your review" : "Student review"}</span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-[#687b98] dark:text-[#aabddc]"><CalendarDays aria-hidden="true" className="size-3" /> {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Dhaka" })}</p>
            </div>
            <div className="flex items-center gap-2"><RatingStars rating={review.rating} /><span className="text-xs font-semibold text-[#536682] dark:text-[#c2d1e9]">{review.rating}.0 / 5</span></div>
          </div>
          <ReviewComment comment={review.comment} />
        </div>
      </div>
    </article>
  )
}

export function ReviewsPreview({
  tuitionId,
  signedIn,
  isStudent,
  eligible,
  eligibilityCheckFailed,
  initialReviews,
  initialMyReview,
  initialMyReviewCheckFailed,
}: {
  tuitionId: string
  signedIn: boolean
  isStudent: boolean
  eligible: boolean
  eligibilityCheckFailed: boolean
  initialReviews: ReviewListing | null
  initialMyReview: Review | null
  initialMyReviewCheckFailed: boolean
}) {
  const [listing, setListing] = useState(initialReviews)
  const [myReview, setMyReview] = useState(initialMyReview)
  const [myReviewFailed, setMyReviewFailed] = useState(initialMyReviewCheckFailed)
  const [sort, setSort] = useState("newest")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [busy, setBusy] = useState(false)

  async function loadReviews(page: number, selectedSort: string) {
    try {
      setListing(await getReviews(tuitionId, page, selectedSort))
    } catch {
      setListing(null)
      toast.error("Could not load reviews. Please try again.")
    }
  }

  async function loadMyReview() {
    try {
      setMyReview(await getMyReview(tuitionId))
      setMyReviewFailed(false)
    } catch {
      setMyReviewFailed(true)
    }
  }

  async function handleListChange(page: number, selectedSort: string) {
    setBusy(true)
    setSort(selectedSort)
    await loadReviews(page, selectedSort)
    setBusy(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!rating || !comment.trim()) {
      toast.error("Choose a rating and enter a review.")
      return
    }
    setBusy(true)
    try {
      await createReview(tuitionId, rating, comment.trim())
      setRating(0)
      setComment("")
      toast.success("Review submitted successfully.")
      await Promise.all([loadReviews(1, sort), loadMyReview()])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your review.")
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!myReview) return
    setBusy(true)
    try {
      await deleteReview(myReview._id)
      setMyReview(null)
      toast.success("Review deleted successfully.")
      await Promise.all([loadReviews(1, sort), loadMyReview()])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete your review.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section aria-labelledby="reviews-heading" className="rounded-3xl border border-[#d8e5fa] bg-[#f8fbff] p-5 shadow-sm sm:p-7 dark:border-[#344a75] dark:bg-[#101d38]">
      <div className="flex flex-col gap-5 border-b border-[#d8e5fa] pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-[#344a75]">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#dceafe] text-[#245be8] dark:bg-[#254789] dark:text-[#d8e6ff]"><Star aria-hidden="true" className="size-6" /></span>
          <div>
            <h2 id="reviews-heading" className="text-xl font-bold text-[#10204c] dark:text-[#f4f7ff]">Student Feedback &amp; Reviews</h2>
            <p className="mt-1 text-sm leading-6 text-[#536682] dark:text-[#b4c4e2]">Students with accepted applications can share their learning experience.</p>
          </div>
        </div>
        {listing && (
          <div className="flex shrink-0 items-center gap-3 sm:border-l sm:border-[#d8e5fa] sm:pl-5 dark:sm:border-[#344a75]">
            <span className="text-3xl font-bold text-[#10204c] dark:text-[#f4f7ff]">{listing.averageRating.toFixed(1)}<span className="text-sm font-medium text-[#687b98] dark:text-[#aabddc]"> / 5</span></span>
            <div><RatingStars rating={listing.averageRating} /><p className="text-xs text-[#687b98] dark:text-[#aabddc]">{listing.total} {listing.total === 1 ? "review" : "reviews"}</p></div>
          </div>
        )}
      </div>

      {signedIn && (
        <div className="mt-5 rounded-2xl border border-[#bcd2f7] bg-[#eef5ff] p-4 sm:p-5 dark:border-[#426bc3] dark:bg-[#172b50]">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#d9e9ff] text-[#245be8] dark:bg-[#254789] dark:text-[#d8e6ff]"><Pencil aria-hidden="true" className="size-5" /></span>
            <div>
              <h3 className="text-lg font-bold text-[#10204c] dark:text-[#f4f7ff]">Your Review</h3>
              <p className="mt-1 text-sm text-[#536682] dark:text-[#b4c4e2]">
                {myReviewFailed ? "Could not load your review. Please try again." : myReview ? "You have reviewed this tuition." : eligibilityCheckFailed ? "We couldn't check your application status. Please refresh and try again." : eligible ? "Share your experience with this tuition." : "You are not eligible to rate and review now. An accepted application is required."}
              </p>
            </div>
          </div>
          {myReviewFailed && isStudent && (
            <button type="button" disabled={busy} onClick={async () => { setBusy(true); await loadMyReview(); setBusy(false) }} className="mt-3 text-sm font-semibold text-[#245be8] hover:underline dark:text-[#a8c4ff]">Try again</button>
          )}
          {!myReviewFailed && myReview && (
            <div className="mt-4 space-y-3">
              <ReviewCard review={myReview} own />
              <button type="button" disabled={busy} onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl border border-[#b8cae5] bg-[#f7faff] px-4 py-2.5 text-sm font-semibold text-[#536682] hover:bg-[#e4edfc] disabled:opacity-50 dark:border-[#526c9a] dark:bg-[#203456] dark:text-[#d8e6ff] dark:hover:bg-[#304b77]"><Trash2 aria-hidden="true" className="size-4" /> Delete Review</button>
            </div>
          )}
          {!myReviewFailed && !myReview && eligible && !eligibilityCheckFailed && (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <fieldset disabled={busy} className="flex flex-wrap items-center gap-3">
                <legend className="mb-2 text-sm font-semibold text-[#10204c] dark:text-[#f4f7ff]">Your Rating <span className="text-red-500">*</span></legend>
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer">
                    <input type="radio" name="rating" value={star} checked={rating === star} onChange={() => setRating(star)} className="peer sr-only" />
                    <Star aria-hidden="true" className={`size-7 rounded peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-[#91a2bb] dark:text-[#8097bd]"}`} />
                    <span className="sr-only">{star} {star === 1 ? "star" : "stars"}</span>
                  </label>
                ))}
                <span className="text-xs text-[#536682] dark:text-[#b4c4e2]">{rating ? `${rating} out of 5` : "Choose a rating"}</span>
              </fieldset>
              <div>
                <label htmlFor="review-comment" className="text-sm font-semibold text-[#10204c] dark:text-[#f4f7ff]">Your Review <span className="text-red-500">*</span></label>
                <textarea id="review-comment" required maxLength={500} value={comment} onChange={(event) => setComment(event.target.value)} disabled={busy} placeholder="Share your learning experience..." className="mt-2 min-h-24 w-full rounded-xl border border-[#b8cae5] bg-[#ffffff] p-3 text-sm text-[#10204c] placeholder:text-[#788aa4] focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-[#526c9a] dark:bg-[#203456] dark:text-[#f4f7ff] dark:placeholder:text-[#aabddc]" />
                <p className="text-right text-xs text-[#687b98] dark:text-[#aabddc]">{comment.length} / 500</p>
              </div>
              <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-[#315fe0] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#244fc3] disabled:opacity-50"><Send aria-hidden="true" className="size-4" /> {busy ? "Please wait..." : "Submit Review"}</button>
            </form>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[#10204c] dark:text-[#f4f7ff]">Student Reviews{listing ? ` (${listing.total})` : ""}</h3>
        <label className="inline-flex items-center gap-2 rounded-lg border border-[#c8d8ee] bg-[#f2f7ff] px-3 py-2 text-sm text-[#536682] dark:border-[#40577e] dark:bg-[#1a2d4d] dark:text-[#c2d1e9]">
          <ArrowDownUp aria-hidden="true" className="size-4" />
          <span className="sr-only">Sort reviews</span>
          <select value={sort} disabled={busy} onChange={(event) => handleListChange(1, event.target.value)} className="bg-transparent outline-none">
            <option value="newest">Newest</option><option value="oldest">Oldest</option>
          </select>
        </label>
      </div>
      <div className="mt-4 space-y-3" aria-live="polite">
        {busy && <p className="text-sm text-[#536682] dark:text-[#b4c4e2]">Updating reviews...</p>}
        {!listing ? (
          <p className="text-sm text-[#536682] dark:text-[#b4c4e2]">Could not load reviews. <button type="button" disabled={busy} onClick={() => handleListChange(1, sort)} className="font-semibold text-[#245be8] hover:underline dark:text-[#a8c4ff]">Try again</button></p>
        ) : listing.reviews.length === 0 ? (
          <p className="text-sm text-[#536682] dark:text-[#b4c4e2]">No reviews yet.</p>
        ) : listing.reviews.map((review) => <ReviewCard key={review._id} review={review} own={review._id === myReview?._id} />)}
      </div>
      {listing && listing.totalPages > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#687b98] dark:text-[#aabddc]">
          <button type="button" disabled={busy || listing.page <= 1} onClick={() => handleListChange(listing.page - 1, sort)} aria-label="Previous page" className="rounded-lg border border-[#c8d8ee] p-2 disabled:opacity-40 dark:border-[#40577e]"><ChevronLeft aria-hidden="true" className="size-4" /></button>
          <span>{listing.page} of {listing.totalPages}</span>
          <button type="button" disabled={busy || listing.page >= listing.totalPages} onClick={() => handleListChange(listing.page + 1, sort)} aria-label="Next page" className="rounded-lg border border-[#c8d8ee] p-2 disabled:opacity-40 dark:border-[#40577e]"><ChevronRight aria-hidden="true" className="size-4" /></button>
        </div>
      )}
    </section>
  )
}
