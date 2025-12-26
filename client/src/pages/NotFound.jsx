import { Link } from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import Heading from "../components/common/Heading";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Container>
        <div className="text-center">
          <div className="text-8xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            404
          </div>
          <Heading level={2} className="mb-4">
            Page Not Found
          </Heading>
          <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
