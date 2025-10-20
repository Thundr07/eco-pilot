import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Brain, TrendingUp, Users, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const Home = () => {
  const features = [{
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms analyze your lifestyle patterns"
  }, {
    icon: TrendingUp,
    title: "Personalized Insights",
    description: "Get custom recommendations based on your unique data"
  }, {
    icon: Leaf,
    title: "Eco-Friendly Tips",
    description: "Practical, actionable steps to reduce your carbon footprint"
  }, {
    icon: Sparkles,
    title: "Real-Time Results",
    description: "Instant analysis and visual feedback on your impact"
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full">
            <span className="text-sm font-medium text-accent-foreground">
              🌍 AI for a Greener Tomorrow
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
            Empowering Sustainability
            <br />Through AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Make eco-friendly decisions with confidence. Our AI analyzes your lifestyle
            and provides personalized recommendations for a sustainable future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/insights">
              <Button size="lg" className="w-full sm:w-auto group">
                Try It Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent system transforms your lifestyle data into actionable sustainability insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <Card key={index} className="border-2 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground overflow-hidden relative">
            <CardContent className="p-12 text-center relative z-10">
              <Users className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">Making smarter, greener choices every day</p>
              <Link to="/insights">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Home;