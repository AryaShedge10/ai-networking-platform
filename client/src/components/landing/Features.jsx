import Container from "../common/Container";
import Section from "../common/Section";
import Heading from "../common/Heading";

const Features = () => {
  const features = [
    {
      title: "AI-Powered Matching",
      description:
        "Advanced cosine similarity algorithms analyze your interests, skills, and goals to find your perfect conversation partners.",
      icon: "🎯",
      highlight: true,
    },
    {
      title: "Smart Conversation Starters",
      description:
        "Gemini AI generates personalized conversation starters based on shared interests and current topics.",
      icon: "💡",
      highlight: true,
    },
    {
      title: "Real-Time Chat",
      description:
        "Seamless messaging experience with typing indicators, read receipts, and instant notifications.",
      icon: "⚡",
      highlight: false,
    },
    {
      title: "Reputation System",
      description:
        "Build trust through community ratings and verified achievements in your areas of expertise.",
      icon: "⭐",
      highlight: false,
    },
    {
      title: "Safety & Moderation",
      description:
        "AI-powered content moderation and reporting system ensures a safe, respectful environment.",
      icon: "🛡️",
      highlight: false,
    },
    {
      title: "Resource Sharing",
      description:
        "Share articles, tools, and learning resources with your network to foster collaborative growth.",
      icon: "📚",
      highlight: false,
    },
  ];

  return (
    <Section id="features" className="bg-slate-800/30">
      <Container>
        <div className="text-center mb-16">
          <Heading level={2} className="mb-4">
            Powerful Features for Better Connections
          </Heading>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to build meaningful professional relationships
            and learn from others
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl border transition-all duration-300 hover:transform hover:scale-105 ${
                feature.highlight
                  ? "bg-linear-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/50 shadow-lg shadow-indigo-500/20"
                  : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {feature.highlight && (
                <div className="mt-4 inline-flex items-center text-sm text-indigo-400 font-medium">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  AI-Powered
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Features;
