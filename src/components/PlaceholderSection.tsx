interface PlaceholderSectionProps {
  title: string;
  description: string;
  id?: string;
}

const PlaceholderSection = ({ title, description, id }: PlaceholderSectionProps) => {
  return (
    <section id={id} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block mb-4">
          <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
        </div>
        
        <h2 className="heading-font text-4xl sm:text-5xl font-medium text-foreground mb-6 tracking-tight">
          {title}
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        {/* Placeholder Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="aspect-square bg-muted rounded-sm shadow-soft hover:shadow-hover transition-all duration-500 animate-fade-in hover:-translate-y-2"
              style={{ animationDelay: `${item * 100}ms` }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground/50 heading-font text-2xl">
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlaceholderSection;
