import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, Lightbulb, Heart } from 'lucide-react';
import { useState } from 'react';

interface IndustryResultsProps {
  results: any;
}

const IndustryResults = ({ results }: IndustryResultsProps) => {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isNarrativeOpen, setIsNarrativeOpen] = useState(true);
  
  if (!results) return null;

  const impactData = [
    { category: 'CO2 Emissions', value: results.emissionsScore || 0 },
    { category: 'Water Usage', value: results.waterScore || 0 },
    { category: 'Waste Management', value: results.wasteScore || 0 },
    { category: 'Energy Efficiency', value: results.energyScore || 0 },
  ];

  const sustainabilityData = [
    { subject: 'Environmental', score: results.environmentalScore || 70 },
    { subject: 'Social', score: results.socialScore || 80 },
    { subject: 'Economic', score: results.economicScore || 75 },
    { subject: 'Innovation', score: results.innovationScore || 65 },
    { subject: 'Compliance', score: results.complianceScore || 85 },
  ];

  const comparisonData = [
    { name: 'Proposed Industry', value: results.overallScore || 0 },
    { name: 'Industry Average', value: 65 },
    { name: 'Best Practice', value: 90 },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  const getSuitabilityColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSuitabilityText = (score: number) => {
    if (score >= 75) return 'Highly Suitable';
    if (score >= 50) return 'Moderately Suitable';
    return 'Not Recommended';
  };

  return (
    <div className="space-y-6">
      {/* City Narrative - Emotional AI Interface */}
      {results.cityNarrative && (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <Collapsible open={isNarrativeOpen} onOpenChange={setIsNarrativeOpen}>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-primary" />
                    <CardTitle className="text-left">The City Speaks</CardTitle>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isNarrativeOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-lg italic text-foreground/90 leading-relaxed">
                    {results.cityNarrative}
                  </p>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Sustainability Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">
                {results.overallScore || 0}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <Badge className={getSuitabilityColor(results.overallScore || 0)}>
                {getSuitabilityText(results.overallScore || 0)}
              </Badge>
            </div>
            <div className="w-[200px] h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: results.overallScore || 0 },
                      { value: 100 - (results.overallScore || 0) },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#10b981" name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sustainability Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={sustainabilityData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value">
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Policy Advisor - Generative Policy Designer */}
      {results.policyRecommendations && (
        <Card className="border-2 border-accent">
          <Collapsible open={isPolicyOpen} onOpenChange={setIsPolicyOpen}>
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 text-accent-foreground" />
                    <CardTitle>AI Policy Advisor</CardTitle>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isPolicyOpen ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-sm text-muted-foreground text-left mt-1">
                  Data-driven policy recommendations with cost-benefit analysis
                </p>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg">
                      {results.policyRecommendations}
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Sustainability Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm">{results.recommendations || 'No recommendations available.'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Location Suitability */}
      <Card>
        <CardHeader>
          <CardTitle>Location Suitability Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Key Factors:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Proximity to pollution zones: {results.pollutionProximity || 'Moderate'}</li>
                <li>Infrastructure availability: {results.infrastructure || 'Good'}</li>
                <li>Environmental compliance: {results.compliance || 'Meeting standards'}</li>
                <li>Community impact: {results.communityImpact || 'Positive'}</li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Final Recommendation:</p>
              <p className="text-sm mt-2">{results.finalRecommendation || 'Based on the analysis, this location shows promise for sustainable industrial development with proper environmental controls.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryResults;
