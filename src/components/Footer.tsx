import { Leaf } from "lucide-react";
const Footer = () => {
  return <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold">EcoPilot</span>
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            <p>Smart Industrial Sustainability Solutions</p>
            <p className="mt-1">K. Ramakrishnan College of Engineering</p>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2025 EcoPilot. All rights reserved.
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;