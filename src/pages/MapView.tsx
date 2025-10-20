import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SustainabilityMap from "@/components/SustainabilityMap";

const MapView = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <SustainabilityMap />
      </main>
      <Footer />
    </div>
  );
};

export default MapView;
