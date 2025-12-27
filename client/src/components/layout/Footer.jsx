import Container from "../common/Container";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <Container>
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                ConnectAI
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Meaningful conversations powered by AI
              </p>
            </div>

            <div className="text-slate-400 text-sm">
              © 2024 ConnectAI. Building better connections.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
