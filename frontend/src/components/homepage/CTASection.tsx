import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Ready to Transform Your Leave Management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Join hundreds of companies that have streamlined their HR operations with LeaveHub. Start your free trial
            today with no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-base">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-transparent">
              Schedule a Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            No credit card required. Setup takes less than 5 minutes. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
