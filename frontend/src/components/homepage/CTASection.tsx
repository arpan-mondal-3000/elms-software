import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section id="join" className="py-20 md:py-32 bg-linear-to-r from-primary/10 via-accent/5 to-primary/10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Ready to Transform Your Leave Management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Join hundreds of companies that have streamlined their HR operations with ProLeave. Start tracking your leaves now.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-base">
            Start tracking employee leave
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <p className="text-sm text-muted-foreground mt-8">
            Easily manage employee leave and get analytics based on that
          </p>
        </div>
      </div>
    </section>
  )
}
