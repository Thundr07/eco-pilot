import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface IndustryMetricsFormProps {
  onResultsReceived: (results: any) => void;
}

const IndustryMetricsForm = ({ onResultsReceived }: IndustryMetricsFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    industryName: '',
    industryType: '',
    location: '',
    expectedEmissions: '',
    wasteOutput: '',
    waterUsage: '',
    energySource: '',
    employeeCount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('evaluate-industry', {
        body: formData,
      });

      if (error) throw error;

      onResultsReceived(data);
      
      toast({
        title: 'Analysis Complete',
        description: 'Industry evaluation results are ready',
      });
    } catch (error) {
      console.error('Error evaluating industry:', error);
      toast({
        title: 'Error',
        description: 'Failed to evaluate industry metrics',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Industry Metrics Evaluation</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter industry details to get AI-powered sustainability assessment
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industryName">Industry Name</Label>
              <Input
                id="industryName"
                required
                value={formData.industryName}
                onChange={(e) => setFormData({ ...formData, industryName: e.target.value })}
                placeholder="e.g., Green Tech Manufacturing"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industryType">Industry Type</Label>
              <Select
                required
                value={formData.industryType}
                onValueChange={(value) => setFormData({ ...formData, industryType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                  <SelectItem value="food">Food Processing</SelectItem>
                  <SelectItem value="renewable">Renewable Energy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Proposed Location</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Chennai Industrial Park"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedEmissions">Expected CO2 Emissions (tons/year)</Label>
              <Input
                id="expectedEmissions"
                type="number"
                required
                value={formData.expectedEmissions}
                onChange={(e) => setFormData({ ...formData, expectedEmissions: e.target.value })}
                placeholder="e.g., 500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wasteOutput">Waste Output (tons/year)</Label>
              <Input
                id="wasteOutput"
                type="number"
                required
                value={formData.wasteOutput}
                onChange={(e) => setFormData({ ...formData, wasteOutput: e.target.value })}
                placeholder="e.g., 200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waterUsage">Water Usage (gallons/day)</Label>
              <Input
                id="waterUsage"
                type="number"
                required
                value={formData.waterUsage}
                onChange={(e) => setFormData({ ...formData, waterUsage: e.target.value })}
                placeholder="e.g., 5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="energySource">Primary Energy Source</Label>
              <Select
                required
                value={formData.energySource}
                onValueChange={(value) => setFormData({ ...formData, energySource: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solar">Solar</SelectItem>
                  <SelectItem value="wind">Wind</SelectItem>
                  <SelectItem value="hydro">Hydroelectric</SelectItem>
                  <SelectItem value="grid">Grid (Mixed)</SelectItem>
                  <SelectItem value="coal">Coal</SelectItem>
                  <SelectItem value="natural-gas">Natural Gas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">Expected Employee Count</Label>
              <Input
                id="employeeCount"
                type="number"
                required
                value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                placeholder="e.g., 150"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Evaluate Industry Impact'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IndustryMetricsForm;
