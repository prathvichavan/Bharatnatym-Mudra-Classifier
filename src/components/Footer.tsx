export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 bg-card border-t border-border">
      <div className="container mx-auto text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Bharatanatyam Mudra Classifier. Built as a Deep Learning project.
        </p>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          Made with <span className="text-primary">♥</span> for Indian classical dance and AI
        </p>
      </div>
    </footer>
  );
};
