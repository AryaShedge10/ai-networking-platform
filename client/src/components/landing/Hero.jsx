import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "../common/Container";
import Section from "../common/Section";
import Heading from "../common/Heading";
import Button from "../common/Button";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    // FIX: Respect auth state - redirect to dashboard if logged in
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section className="pt-32 pb-16 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Heading level={1} gradient className="mb-6">
            Meaningful Conversations
            <br />
            Powered by AI
          </Heading>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Skip the small talk and social anxiety. Our AI connects you with
            compatible people based on shared interests, learning goals, and
            conversation styles for deeper, more meaningful interactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleGetStarted}
            >
              {/* FIX: Show different text based on auth state */}
              {user ? "Go to Dashboard" : "Get Started"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleHowItWorks}
            >
              How It Works
            </Button>
          </div>

          <div className="mt-12 text-sm text-slate-400">
            Join thousands building better connections
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
