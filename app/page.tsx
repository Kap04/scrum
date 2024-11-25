import { Button } from "@/components/ui/button"
import AnimatedGrid from "@/components/ui/animated-grid-pattern"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ShinyButton from "@/components/ui/shiny-button"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
        
        <AnimatedGrid
          className={cn(
            "bg-gradient-to-b",
            "inset-x-0 inset-y-[-30%] w-full h-[150%] skew-y-12",
          )}
          width={70}
          height={100}
          strokeDasharray={2}
          numSquares={10}
          maxOpacity={0.2}
          duration={3}
        />
        <div className="z-10">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-sm text-gray-300 md:text-6xl lg:text-9xl">
            Welcome to <span className="text-zinc-200">Scrum</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Streamline your workflow and boost productivity with our intuitive task management solution.
            Scrum helps you stay organized, prioritize tasks, and collaborate with ease, ensuring that your team stays on track.
          </p>

          <div className="mt-10 flex justify-center  gap-4">

            <Link href='/sign-up' ><ShinyButton>Get Started</ShinyButton></Link>

          </div>
        </div>
      </section>

      {/* bg-secondary/50 */}
      <section className="flex flex-col items-center justify-center min-h-screen z-0 bg-gray-950 px-4">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
          Why Choose Scrum?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
          {[
            { title: "Intuitive Interface", description: "Easy-to-use design that simplifies task management." },
            { title: "Real-time Collaboration", description: "Work seamlessly with your team, anytime, anywhere." },
            { title: "Customizable Workflows", description: "Tailor Scrum to fit your unique project needs." },
            { title: "Detailed Analytics", description: "Gain insights to optimize your team's performance." },
            { title: "Integration Friendly", description: "Connects with your favorite tools for a smooth workflow." },
            { title: "Secure & Reliable", description: "Your data is protected with enterprise-grade security." },
          ].map((item, index) => (
            <div key={index} className="bg-background/50 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-3xl font-bold text-zinc-200  tracking-tight sm:text-4xl md:text-6xl mb-6 text-center">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl text-center mb-10">
          Join thousands of users already using Scrum to streamline workflows, boost efficiency, and drive productivity. Transform how you work and stay ahead of the competition.
        </p>
        <Button className="bg-zinc-300" asChild size="lg">
          <Link href="/sign-up">Start Now!</Link>
        </Button>
      </section>
    </main>
  )
}

