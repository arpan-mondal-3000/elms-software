import { Card } from "../ui/card"
import { TrendingUp, Users, Zap } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      stat: "70%",
      title: "Faster Processing",
      description: "Reduce leave approval time and eliminate manual paperwork",
    },
    {
      icon: Users,
      stat: "100%",
      title: "Team Visibility",
      description: "Know who is available and when with at-a-glance",
    },
    {
      icon: TrendingUp,
      stat: "50%",
      title: "Cost Savings",
      description: "Reduce HR administrative overhead and operational costs",
    },
  ]

  return (
    <section id="benefits" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Measurable Results</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            See the impact ProLeave can have on your organization
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card
                key={index}
                className="border-border bg-linear-to-br from-card to-muted/20 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{benefit.stat}</div>
                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
