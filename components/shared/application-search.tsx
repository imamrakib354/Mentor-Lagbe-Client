import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Submits application search terms as URL parameters.
export function ApplicationSearch({ search, status }: { search: string; status: string }) {
  return (
    <form className="flex w-full gap-2 sm:w-auto">
      <input type="hidden" name="status" value={status} />
      <Input key={search} name="search" defaultValue={search} aria-label="Search applications" placeholder="Search applications..." className="h-10 min-w-0 rounded-xl border-blue-100 sm:w-60" />
      <Button type="submit" className="h-10 bg-blue-600 text-white hover:bg-blue-700">Search</Button>
    </form>
  )
}
