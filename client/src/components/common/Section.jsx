const Section = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`py-16 lg:py-24 ${className}`}>
      {children}
    </section>
  );
};

export default Section;
