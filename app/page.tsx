import { AiGenerator } from "@/components/ai-generator";
import { SectionHeader } from "@/components/section-header";
import { UseCaseCard } from "@/components/use-case-card";

const useCases = [
  {
    title: "AI Sales Forecasting",
    description:
      "Forecast revenue trends using historical performance, seasonality, and market signals to improve planning confidence."
  },
  {
    title: "Intelligent Document Processing",
    description:
      "Automate extraction and classification of invoices, contracts, and forms to reduce operational overhead and errors."
  },
  {
    title: "AI Customer Support Automation",
    description:
      "Deploy AI-powered assistants to handle routine support requests while escalating complex cases to human teams."
  }
];

export default function HomePage() {
  return (
    <main className="pb-16">
      <section className="border-b bg-gradient-to-b from-blue-50/60 to-transparent">
        <div className="container py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-primary">Chiacon</p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Transforming Business with AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Chiacon partners with forward-looking organizations to design and implement practical AI solutions that improve
            efficiency, drive growth, and create competitive advantage.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <SectionHeader
          eyebrow="About AI"
          title="From strategy to deployment, we accelerate enterprise AI adoption"
          description="Chiacon helps businesses adopt AI through workflow automation, predictive analytics, and intelligent systems that integrate with existing operations."
        />
      </section>

      <section className="container py-8 md:py-12">
        <SectionHeader
          eyebrow="AI Use Cases"
          title="Proven opportunities for measurable outcomes"
          description="Example solution areas where Chiacon delivers value across sales, operations, and customer experience."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {useCases.map((useCase) => (
            <UseCaseCard key={useCase.title} title={useCase.title} description={useCase.description} />
          ))}
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <SectionHeader
          eyebrow="AI Demo"
          title="Chat with Chiacon AI about your business challenge"
          description="Use the interactive assistant to discuss a real-world problem and receive structured recommendations instantly."
        />
        <div className="mt-8 max-w-3xl">
          <AiGenerator />
        </div>
      </section>
    </main>
  );
}
