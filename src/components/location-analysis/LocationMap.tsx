import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { geocodeAddress } from "@/lib/services/geocoding";
import type { LocationAnalysisData } from "@/types/pdf";

// Fix for default marker icon in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  address: string;
  lat: number;
  lng: number;
  price?: string;
  pricePSF?: string;
  date?: string;
}

interface LocationMapProps {
  data?: LocationAnalysisData;
}

const LocationMap = ({ data }: LocationMapProps) => {
  const [landSalesLocations, setLandSalesLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([45.523064, -122.676483]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function geocodeLocations() {
      try {
        if (!data?.landSales?.recentSales) {
          setIsLoading(false);
          return;
        }

        // Geocode land sales locations
        const salesPromises = data.landSales.recentSales.map(async sale => {
          const geo = await geocodeAddress(sale.address);
          if (geo.success) {
            return {
              address: sale.address,
              price: sale.price,
              pricePSF: sale.pricePSF,
              date: sale.date,
              lat: geo.lat,
              lng: geo.lng
            };
          }
          return null;
        });

        const salesResults = (await Promise.all(salesPromises)).filter(
          (result): result is Location => result !== null
        );
        
        setLandSalesLocations(salesResults);
        // Set map center to first location
        if (salesResults.length > 0) {
          setCenter([salesResults[0].lat, salesResults[0].lng]);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setError("Failed to load map locations");
      } finally {
        setIsLoading(false);
      }
    }

    geocodeLocations();
  }, [data]);

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading map locations...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Land Sales Map View</h2>
      
      <div className="mt-4 h-[60vh] rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {landSalesLocations.map((location, index) => (
            <Marker 
              key={`sales-${index}`} 
              position={[location.lat, location.lng]}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-medium">{location.address}</div>
                  <div className="text-sm text-gray-600">Price: {location.price}</div>
                  <div className="text-sm text-gray-600">Price/SF: {location.pricePSF}</div>
                  <div className="text-sm text-gray-600">Date: {location.date}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Legend</h3>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-600 mr-2"></div>
          <span className="text-sm">Land Sale Location</span>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;
