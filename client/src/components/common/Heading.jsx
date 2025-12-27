const Heading = ({ level = 2, children, className = "", gradient = false }) => {
  const Tag = `h${level}`;

  const baseClasses = "font-bold text-white leading-tight";
  const gradientClasses = gradient
    ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
    : "";

  const sizes = {
    1: "text-4xl md:text-5xl lg:text-6xl",
    2: "text-3xl md:text-4xl lg:text-5xl",
    3: "text-2xl md:text-3xl lg:text-4xl",
    4: "text-xl md:text-2xl lg:text-3xl",
    5: "text-lg md:text-xl lg:text-2xl",
    6: "text-base md:text-lg lg:text-xl",
  };

  return (
    <Tag
      className={`${baseClasses} ${gradientClasses} ${sizes[level]} ${className}`}
    >
      {children}
    </Tag>
  );
};

export default Heading;
