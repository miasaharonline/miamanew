import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  MessageSquare,
  Mic,
  Calendar,
  Bot,
  Cpu,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful AI Assistant Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our WhatsApp AI assistant combines cutting-edge GPT models with
              practical features to handle conversations autonomously.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Bot className="w-6 h-6" />,
                title: "Multi-Account Support",
                description:
                  "Manage multiple WhatsApp accounts from a single dashboard",
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: "GPT-4/4o Integration",
                description:
                  "Powered by OpenAI's most advanced language models",
              },
              {
                icon: <Mic className="w-6 h-6" />,
                title: "Voice Transcription",
                description: "Convert voice notes to text using Whisper AI",
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Calendar Management",
                description: "Create events and reminders automatically",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-whatsapp-darkgreen mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Set up your autonomous WhatsApp assistant in minutes with our
              intuitive dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: "01",
                title: "Connect Account",
                description:
                  "Link your WhatsApp account to our secure dashboard",
              },
              {
                number: "02",
                title: "Configure AI",
                description:
                  "Customize GPT model, response style, and smart features",
              },
              {
                number: "03",
                title: "Go Autonomous",
                description:
                  "Let your AI assistant handle conversations while you monitor",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-bold text-whatsapp-green/30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-whatsapp-darkgreen text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-whatsapp-lightgreen">
                Always-On Assistant
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-whatsapp-lightgreen">
                WhatsApp Compatible
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">GPT-4o</div>
              <div className="text-whatsapp-lightgreen">Powered by OpenAI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Smart Assistant Capabilities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From customer support to personal assistance, our AI can handle a
              wide range of tasks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Intelligent Conversations",
                description:
                  "Natural, context-aware responses that maintain conversation history and understand user intent",
              },
              {
                icon: <Mic className="w-6 h-6" />,
                title: "Voice Note Processing",
                description:
                  "Transcribe and understand voice messages for seamless audio-to-text communication",
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Smart Scheduling",
                description:
                  "Extract event details from messages and automatically create calendar entries and reminders",
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Human Handoff",
                description:
                  "Seamlessly transition from AI to human operator when complex situations require personal attention",
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="text-whatsapp-darkgreen mr-3">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                </div>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Deploy Your AI Assistant?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get started with your autonomous WhatsApp AI assistant today and
            transform how you handle conversations.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-whatsapp-darkgreen rounded-lg hover:bg-whatsapp-green transition-colors"
          >
            Launch Dashboard
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
