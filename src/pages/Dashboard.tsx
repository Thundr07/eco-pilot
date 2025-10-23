import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Droplet, Trash2, Car, Leaf, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card as UICard, CardHeader as UICardHeader, CardTitle as UICardTitle, CardContent as UICardContent } from "@/components/ui/card";
import { Factory, Leaf, Cloud, Droplet } from "lucide-react";
import { api } from "@/lib/utils";

interface Assessment {
  id: string;
  name: string;
  eco_score: number;
  energy_usage: number;
  water_usage: number;
  waste_generation: number;
  transportation: string;
  diet_type: string;
  recommendations: any;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [cityCards, setCityCards] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your dashboard",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    fetchAssessments();
  };

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('sustainability_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssessments(data || []);
      if (data && data.length > 0) {
        setSelectedAssessment(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Smart City Dashboard metrics
    (async () => {
      try {
        const res = await api<any>("/citydata");
        const insights: Record<string, string> = (res as any).insights || {};
        const metrics = (res as any).data || [];
        const cards = metrics.map((m: any) => ({
          city: m.city,
          items: [
            { key: "CO₂ Emissions", value: m.co2, icon: Cloud },
            { key: "AQI", value: m.aqi, icon: Factory },
            { key: "Water Stress", value: m.water_stress, icon: Droplet },
            { key: "Green Cover", value: m.green_cover + "%", icon: Leaf },
          ],
          insight: insights[m.city] || "",
        }));
        setCityCards(cards);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sustainability_assessments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assessment deleted successfully",
      });

      fetchAssessments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = selectedAssessment ? [
    { name: 'Energy', value: selectedAssessment.energy_usage, color: 'hsl(142, 76%, 36%)' },
    { name: 'Water', value: selectedAssessment.water_usage / 10, color: 'hsl(200, 95%, 45%)' },
    { name: 'Waste', value: selectedAssessment.waste_generation * 10, color: 'hsl(0, 84%, 60%)' },
  ] : [];

  const scoreData = assessments.map((a) => ({
    date: new Date(a.created_at).toLocaleDateString(),
    score: a.eco_score,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">Your Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {assessments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Leaf className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Assessments Yet</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Get started by taking your first sustainability assessment
              </p>
              <Button onClick={() => navigate("/insights")}>
                Take Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Smart City Dashboard */}
            {cityCards.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Smart City Dashboard</h2>
                <div className="grid gap-4">
                  {cityCards.map((c) => (
                    <div key={c.city} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold">{c.city}</h3>
                        <span className="text-sm text-muted-foreground">{c.insight}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {c.items.map((it: any) => (
                          <UICard key={it.key}>
                            <UICardHeader className="pb-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <it.icon className="w-4 h-4" />
                                <span>{it.key}</span>
                              </div>
                            </UICardHeader>
                            <UICardContent>
                              <div className="text-2xl font-semibold">{it.value}</div>
                            </UICardContent>
                          </UICard>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Score Overview */}
            {selectedAssessment && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Eco Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{selectedAssessment.eco_score}</span>
                      <span className="text-muted-foreground">/100</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Energy Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{selectedAssessment.energy_usage}</span>
                      <span className="text-muted-foreground text-sm">kWh/mo</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Droplet className="w-4 h-4" />
                      Water Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{selectedAssessment.water_usage}</span>
                      <span className="text-muted-foreground text-sm">gal/mo</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Waste Generated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{selectedAssessment.waste_generation}</span>
                      <span className="text-muted-foreground text-sm">lbs/wk</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eco Score History</CardTitle>
                  <CardDescription>Track your progress over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={scoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="hsl(142, 76%, 36%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage Breakdown</CardTitle>
                  <CardDescription>Current assessment distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            {selectedAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                  <CardDescription>
                    Personalized insights from your latest assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {selectedAssessment.recommendations?.analysis || "No recommendations available"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assessment History */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment History</CardTitle>
                <CardDescription>View and manage your past assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAssessment(assessment)}
                    >
                      <div>
                        <h3 className="font-semibold">{assessment.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(assessment.created_at).toLocaleDateString()} • Score: {assessment.eco_score}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(assessment.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;