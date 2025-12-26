import Container from "../common/Container";
import Section from "../common/Section";
import Heading from "../common/Heading";

const WhyUs = () => {
  const benefits = [
    {
      title: "Reduced Social Anxiety",
      description:
        "Know you have common ground before starting conversations. AI provides context and suggested topics.",
      stat: "85%",
      statLabel: "less anxiety reported",
    },
    {
      title: "Better Collaboration",
      description:
        "Connect with people who complement your skills and share your professional interests.",
      stat: "3x",
      statLabel: "more meaningful connections",
    },
    {
      title: "Continuous Learning",
      description:
        "Discover new perspectives, share knowledge, and grow together in a supportive community.",
      stat: "92%",
      statLabel: "learn something new",
    },
  ];

  return (
    <Section
      id="why-us"
      className="bg-linear-to-br from-slate-900 via-indigo-900/20 to-slate-900"
    >
      <Container>
        <div className="text-center mb-16">
          <Heading level={2} gradient className="mb-4">
            Why Choose ConnectAI?
          </Heading>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience the difference of human-centered, AI-enhanced networking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="mb-8">
                <div className="text-5xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {benefit.stat}
                </div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">
                  {benefit.statLabel}
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-4">
                {benefit.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Join a Community That Gets It
            </h3>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              We understand that meaningful connections take more than just
              matching profiles. Our platform is built by people who value deep
              conversations and genuine learning.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default WhyUs;
