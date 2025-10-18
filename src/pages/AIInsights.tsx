import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const AIInsights = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    energyUsage: "",
    waterUsage: "",
    wasteGeneration: "",
    transportation: "",
    dietType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save your assessment",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Call the AI analysis function
      const { data: analysisData, error: functionError } = await supabase.functions.invoke(
        'analyze-sustainability',
        {
          body: {
            name: formData.name,
            energyUsage: parseFloat(formData.energyUsage),
            waterUsage: parseFloat(formData.waterUsage),
            wasteGeneration: parseFloat(formData.wasteGeneration),
            transportation: formData.transportation,
            dietType: formData.dietType,
          }
        }
      );

      if (functionError) {
        throw functionError;
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('sustainability_assessments')
        .insert({
          user_id: session.user.id,
          name: formData.name,
          energy_usage: parseFloat(formData.energyUsage),
          water_usage: parseFloat(formData.waterUsage),
          waste_generation: parseFloat(formData.wasteGeneration),
          transportation: formData.transportation,
          diet_type: formData.dietType,
          input_data: analysisData.inputData,
          eco_score: analysisData.ecoScore,
          recommendations: { analysis: analysisData.analysis },
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Analysis Complete!",
        description: "Your sustainability assessment has been saved",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Analysis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get Your Sustainability Score
            </h1>
            <p className="text-xl text-muted-foreground">
              Answer a few questions and let our AI analyze your environmental impact
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Assessment</CardTitle>
              <CardDescription>
                Provide information about your daily habits for personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="energy">Energy Usage (kWh/month)</Label>
                    <Input
                      id="energy"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 900"
                      value={formData.energyUsage}
                      onChange={(e) => setFormData({ ...formData, energyUsage: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water">Water Usage (gallons/month)</Label>
                    <Input
                      id="water"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 3000"
                      value={formData.waterUsage}
                      onChange={(e) => setFormData({ ...formData, waterUsage: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waste">Waste Generation (lbs/week)</Label>
                  <Input
                    id="waste"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 15"
                    value={formData.wasteGeneration}
                    onChange={(e) => setFormData({ ...formData, wasteGeneration: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transportation">Primary Transportation</Label>
                  <Select
                    value={formData.transportation}
                    onValueChange={(value) => setFormData({ ...formData, transportation: value })}
                    required
                  >
                    <SelectTrigger id="transportation">
                      <SelectValue placeholder="Select transportation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car-gas">Gas Car</SelectItem>
                      <SelectItem value="car-electric">Electric Car</SelectItem>
                      <SelectItem value="public-transport">Public Transport</SelectItem>
                      <SelectItem value="bicycle">Bicycle</SelectItem>
                      <SelectItem value="walking">Walking</SelectItem>
                      <SelectItem value="mixed">Mixed Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet">Diet Type</Label>
                  <Select
                    value={formData.dietType}
                    onValueChange={(value) => setFormData({ ...formData, dietType: value })}
                    required
                  >
                    <SelectTrigger id="diet">
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="omnivore">Omnivore</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="pescatarian">Pescatarian</SelectItem>
                      <SelectItem value="flexitarian">Flexitarian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-4 h-4" />
                      Get AI Analysis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIInsights;