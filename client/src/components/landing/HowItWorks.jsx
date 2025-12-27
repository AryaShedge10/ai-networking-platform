import Container from "../common/Container";
import Section from "../common/Section";
import Heading from "../common/Heading";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Take a Short Quiz",
      description:
        "Tell us about your interests, learning goals, communication style, and what you're looking to discuss.",
      icon: "📝",
    },
    {
      number: "02",
      title: "AI Finds Your Matches",
      description:
        "Our AI uses cosine similarity to connect you with people who share your interests and complement your conversation style.",
      icon: "🤖",
    },
    {
      number: "03",
      title: "Start Meaningful Conversations",
      description:
        "Get AI-generated conversation starters, join curated chat rooms, and build lasting professional relationships.",
      icon: "💬",
    },
  ];

  return (
    <Section
      id="how-it-works"
      className="bg-linear-to-b from-slate-900 to-slate-800"
    >
      <Container>
        <div className="text-center mb-16">
          <Heading level={2} gradient className="mb-4">
            How It Works
          </Heading>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Three simple steps to transform your networking experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-indigo-500 to-transparent transform translate-x-4"></div>
              )}

              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-2xl">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border-2 border-indigo-500">
                  <span className="text-xs font-bold text-indigo-400">
                    {step.number}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default HowItWorks;
