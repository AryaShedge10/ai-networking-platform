import Container from "../common/Container";
import Section from "../common/Section";
import Heading from "../common/Heading";

const Problem = () => {
  const problems = [
    {
      icon: "🎲",
      title: "Random Connections",
      description:
        "Most platforms match you randomly, leading to awkward conversations and wasted time.",
    },
    {
      icon: "😰",
      title: "Social Anxiety",
      description:
        "Starting conversations with strangers feels overwhelming without proper context or common ground.",
    },
    {
      icon: "📱",
      title: "Shallow Interactions",
      description:
        "Social media focuses on followers and likes, not meaningful dialogue and learning.",
    },
    {
      icon: "⏰",
      title: "Time Wasted",
      description:
        "Hours spent scrolling through incompatible profiles instead of having quality conversations.",
    },
  ];

  return (
    <Section className="bg-slate-800/50">
      <Container>
        <div className="text-center mb-16">
          <Heading level={2} className="mb-4">
            The Problem with Current Platforms
          </Heading>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Traditional networking and social platforms leave you feeling
            disconnected and frustrated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{problem.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {problem.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Problem;
