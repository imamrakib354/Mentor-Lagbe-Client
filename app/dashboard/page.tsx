import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-blue-50 p-5">
      <Card className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white py-8 text-blue-950 shadow-lg ring-0 shadow-blue-950/5">
        <CardContent className="px-6 text-center">
          <Badge className="bg-blue-100 text-blue-700">Coming soon</Badge>
          <h1 className="mt-5 text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your dashboard will be built in the next part of MentorLagbe.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="mt-6 h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
