import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IndustryMap from "@/components/IndustryMap";
import IndustryMetricsForm from "@/components/IndustryMetricsForm";
import IndustryResults from "@/components/IndustryResults";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/utils";
import EcoChat from "@/components/EcoChat";
import { Factory } from "lucide-react";

// Chennai industry data with real locations
const chennaiIndustries = [
  { name: "Ford India Manufacturing", type: "Automotive", lat: 12.8184, lng: 80.0466, emissions: 75 },
  { name: "Royal Enfield Plant", type: "Automotive", lat: 13.0443, lng: 80.1735, emissions: 68 },
  { name: "Ashok Leyland", type: "Automotive", lat: 12.9485, lng: 80.1533, emissions: 72 },
  { name: "Hyundai Motor India", type: "Automotive", lat: 12.7513, lng: 80.0305, emissions: 70 },
  { name: "Renault-Nissan Plant", type: "Automotive", lat: 12.7235, lng: 79.9792, emissions: 65 },
  { name: "Chennai Petroleum", type: "Petrochemical", lat: 13.1632, lng: 80.3043, emissions: 85 },
  { name: "Manali Petrochemicals", type: "Petrochemical", lat: 13.1643, lng: 80.3155, emissions: 82 },
  { name: "TI Cycles", type: "Manufacturing", lat: 13.0389, lng: 80.2072, emissions: 55 },
  { name: "Saint-Gobain Glass", type: "Manufacturing", lat: 12.9823, lng: 80.2244, emissions: 60 },
  { name: "Ennore Thermal Power Station", type: "Energy", lat: 13.2156, lng: 80.3152, emissions: 90 },
  { name: "North Chennai Thermal", type: "Energy", lat: 13.1883, lng: 80.2958, emissions: 88 },
  { name: "Avadi Heavy Vehicles", type: "Defense", lat: 13.1143, lng: 80.1018, emissions: 62 },
  { name: "Foxconn Electronics", type: "Electronics", lat: 12.8347, lng: 79.7085, emissions: 50 },
  { name: "Delphi TVS Technologies", type: "Automotive Parts", lat: 12.9342, lng: 79.8753, emissions: 58 },
  { name: "Sundaram Fasteners", type: "Manufacturing", lat: 13.0247, lng: 80.2419, emissions: 52 }
];

const Industry = () => {
  const [industryResults, setIndustryResults] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string; created_at?: string }[]>([]);
  const [draft, setDraft] = useState("");

  const sendChat = async () => {
    if (!draft.trim()) return;
    try {
      setChatLoading(true);
      const res = await api<{ messages: { role: string; content: string; created_at?: string }[] }>(`/chat`, {
        method: 'POST',
        body: JSON.stringify({ user_id: 'anon', city: 'Chennai', industry: 'Textile', message: draft })
      });
      setChatMessages(res.messages);
      setDraft("");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 mt-8">
            <div className="inline-block mb-4 px-4 py-2 bg-accent rounded-full">
              <span className="text-sm font-medium text-accent-foreground">
                <Factory className="w-4 h-4 inline mr-2" />
                Chennai Industrial Zone Analysis
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Industry Sustainability Assessment
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore existing industries, evaluate your metrics, and discover optimal locations 
              for sustainable industrial development in Chennai
            </p>
          </div>

          {/* Interactive Map */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Interactive Industrial Map</h2>
              <p className="text-muted-foreground mb-4">
                View existing industries (markers), pollution zones (red), and industry-friendly areas (green). 
                Click on markers to see industry details.
              </p>
              <IndustryMap industries={chennaiIndustries} />
            </CardContent>
          </Card>

          {/* Metrics Form */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Evaluate Your Industry</h2>
              <p className="text-muted-foreground mb-6">
                Fill in your industry metrics to receive AI-powered sustainability analysis, 
                location recommendations, and improvement strategies
              </p>
              <IndustryMetricsForm onResultsReceived={setIndustryResults} />
            </CardContent>
          </Card>

          {/* Results with Visualizations */}
          {industryResults && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Your Sustainability Analysis Results
              </h2>
              <IndustryResults results={industryResults} />
            </div>
          )}
          {/* EcoChat Assistant */}
          <EcoChat userId="anon" city="Chennai" industry="Textile" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Industry;
