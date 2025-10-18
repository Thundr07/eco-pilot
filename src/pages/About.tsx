import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Lightbulb, Rocket } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            About Our Project
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Bridging technology and sustainability for a better tomorrow
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Target className="w-10 h-10 text-primary mb-2" />
                <CardTitle>The Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Climate change demands immediate action, but most people lack personalized,
                  data-driven guidance to make meaningful sustainable choices in their daily lives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="w-10 h-10 text-secondary mb-2" />
                <CardTitle>Existing Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Current solutions offer generic advice without considering individual contexts.
                  There's a lack of real-time, AI-powered tools that make sustainability accessible
                  and actionable for everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Rocket className="w-10 h-10 text-primary mb-2" />
                <CardTitle>Our Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We leverage cutting-edge AI and machine learning to analyze lifestyle patterns
                  and deliver personalized sustainability recommendations with measurable impact.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Our AI-Powered Approach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Machine Learning Analysis</h3>
                <p className="text-muted-foreground">
                  Our system uses advanced neural networks trained on environmental data to understand
                  the complex relationships between daily habits and ecological impact. The AI model
                  processes multiple data points including energy consumption, water usage, waste generation,
                  transportation patterns, and dietary choices.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Personalized Recommendations</h3>
                <p className="text-muted-foreground">
                  Rather than generic tips, our AI generates context-aware suggestions tailored to your
                  specific situation. It considers your current habits, local resources, and realistic
                  goals to provide actionable steps you can implement immediately.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Impact Visualization</h3>
                <p className="text-muted-foreground">
                  We transform complex environmental data into clear, understandable visuals. Track your
                  eco-score, carbon footprint reduction, and progress over time with interactive charts
                  and insights that keep you motivated.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Continuous Learning</h3>
                <p className="text-muted-foreground">
                  Our AI model continuously improves by learning from aggregated user data (while
                  maintaining privacy). This means recommendations become more accurate and relevant
                  as more people join the platform.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Frontend</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• React with TypeScript</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• Recharts for data visualization</li>
                    <li>• Responsive design for all devices</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Backend</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Supabase for database</li>
                    <li>• Edge Functions for serverless logic</li>
                    <li>• Real-time data synchronization</li>
                    <li>• Secure authentication system</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI/ML</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Lovable AI Gateway</li>
                    <li>• Google Gemini 2.5 Flash</li>
                    <li>• Natural language processing</li>
                    <li>• Predictive analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Deployment</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Cloud-native architecture</li>
                    <li>• Scalable infrastructure</li>
                    <li>• Continuous deployment</li>
                    <li>• 99.9% uptime guarantee</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;