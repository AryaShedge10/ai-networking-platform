import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Container from "../common/Container";
import Section from "../common/Section";
import Heading from "../common/Heading";
import Button from "../common/Button";

const CTA = () => {
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

  return (
    <Section className="bg-linear-to-r from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-600/20 to-purple-600/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <Heading level={2} className="mb-6">
            Ready to Transform Your Networking?
          </Heading>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Join thousands of professionals who are building meaningful
            connections and advancing their careers through AI-powered
            conversations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="w-full sm:w-auto text-lg px-12"
              onClick={handleGetStarted}
            >
              {/* FIX: Show different text based on auth state */}
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-400">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Free to start
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              No credit card required
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Setup in 2 minutes
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CTA;
