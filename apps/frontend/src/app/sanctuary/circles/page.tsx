import CirclesList from "@/components/sanctuary/circles-list"

export default function CirclesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-primary">Find Your Circle</h1>
      <p className="text-muted-foreground mb-8">Join communities that resonate with your journey.</p>
      <CirclesList />
    </div>
  )
}
