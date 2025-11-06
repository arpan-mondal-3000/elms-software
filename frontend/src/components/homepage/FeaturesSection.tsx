import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckSquare, Clock, BarChart3, Bell, Lock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Easy Leave Application",
      description: "Employees can apply for leave in just a few clicks with an intuitive, user-friendly interface.",
    },
    {
      icon: CheckSquare,
      title: "Smart Approvals",
      description: "Streamline the approval process with automated workflows and manager dashboards.",
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Keep track of leave balances and pending requests in real-time across your organization.",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Reports",
      description: "Generate detailed reports on leave patterns, team availability, and compliance.",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated reminders and notifications for approvals, updates, and important deadlines.",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Role-based access control and data encryption to keep your employee data safe.",
    },
  ]

  return (
    <section id="features" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Powerful Features Built for Your Needs</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Everything you need to manage employee leave efficiently and transparently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
