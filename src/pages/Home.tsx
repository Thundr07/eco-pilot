import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Factory, MapPin, LineChart, Lightbulb, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "AI-powered analysis to find optimal locations for industrial installations"
    },
    {
      icon: LineChart,
      title: "Impact Assessment",
      description: "Comprehensive environmental and sustainability metrics evaluation"
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Data-driven suggestions to maximize sustainability and minimize impact"
    },
    {
      icon: Factory,
      title: "Industry-Specific",
      description: "Tailored insights for different types of industrial operations"
    }
  ];

  const benefits = [
    "Reduce environmental impact with data-driven decisions",
    "Identify optimal locations based on pollution zones",
    "Get actionable sustainability improvement strategies",
    "Comply with environmental regulations effortlessly",
    "Visualize metrics with comprehensive charts and graphs"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full">
            <span className="text-sm font-medium text-accent-foreground">
              🏭 AI-Powered Industrial Sustainability
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
            Choose the Best Location
            <br />Maximize Sustainability
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in">
            EcoPilot helps companies make informed decisions about industrial installations. 
            Analyze locations, evaluate environmental impact, and receive AI-powered recommendations 
            for maximum sustainability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/industry">
              <Button size="lg" className="w-full sm:w-auto group">
                Analyze Your Industry
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/insights">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Get AI Insights
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How EcoPilot Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent platform combines location data, environmental metrics, 
              and AI analysis to guide your sustainability decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose EcoPilot?
              </h2>
              <p className="text-muted-foreground mb-8">
                Make strategic decisions backed by comprehensive data analysis 
                and AI-powered insights. EcoPilot transforms complex environmental 
                data into actionable recommendations.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2">
              <CardContent className="p-0">
                <Factory className="w-16 h-16 text-primary mb-6" />
                <h3 className="text-2xl font-bold mb-4">
                  Interactive Industry Analysis
                </h3>
                <p className="text-muted-foreground mb-6">
                  Explore interactive maps showing pollution zones and industry-friendly areas. 
                  Input your metrics and receive detailed visualizations with charts, graphs, 
                  and location-specific recommendations.
                </p>
                <Link to="/industry">
                  <Button className="w-full">
                    Start Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground overflow-hidden relative">
            <CardContent className="p-12 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Sustainably?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join forward-thinking companies using EcoPilot to make environmentally 
                responsible industrial decisions
              </p>
              <Link to="/industry">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
