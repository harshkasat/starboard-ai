import { Car, Train, Ship, Building2, MapPin } from "lucide-react";
import type { ProximityData } from "@/types/extracted";

interface ProximityInsightsProps {
  data?: ProximityData;
}

const defaultProximityData = [
  {
    category: "Transportation",
    items: [
      { name: "Interstate 5", distance: "0.8 miles", icon: <Car size={16} /> },
      { name: "Portland International Airport", distance: "9.5 miles", icon: <Car size={16} /> },
      { name: "Union Station", distance: "1.2 miles", icon: <Train size={16} /> },
      { name: "Port of Portland", distance: "7.4 miles", icon: <Ship size={16} /> }
    ]
  },
  {
    category: "Major Employers",
    items: [
      { name: "Oregon Health & Science University", distance: "3.2 miles", icon: <Building2 size={16} /> },
      { name: "Nike World Headquarters", distance: "8.7 miles", icon: <Building2 size={16} /> },
      { name: "Intel Ronler Acres Campus", distance: "14.5 miles", icon: <Building2 size={16} /> },
      { name: "Providence Health & Services", distance: "4.1 miles", icon: <Building2 size={16} /> }
    ]
  },
  {
    category: "Amenities",
    items: [
      { name: "Pioneer Courthouse Square", distance: "0.5 miles", icon: <MapPin size={16} /> },
      { name: "Washington Park", distance: "2.3 miles", icon: <MapPin size={16} /> },
      { name: "Portland State University", distance: "1.0 miles", icon: <MapPin size={16} /> },
      { name: "Providence Park", distance: "1.5 miles", icon: <MapPin size={16} /> }
    ]
  }
];

const ProximityInsights = ({ data }: ProximityInsightsProps) => {
  // Transform AI-extracted data to match our component's format
  const proximityData = data ? [
    {
      category: "Transportation",
      items: data.transportation.map(t => ({
        name: t.type,
        distance: t.distance,
        icon: getIconForTransportType(t.type)
      }))
    },
    {
      category: "Major Employers",
      items: (data.employers || []).map(e => ({
        name: e.name,
        distance: e.distance,
        icon: <Building2 size={16} />
      }))
    },
    {
      category: "Amenities",
      items: (data.amenities || []).map(a => ({
        name: a.name,
        distance: a.distance,
        icon: <MapPin size={16} />
      }))
    }
  ] : defaultProximityData;

  // Use extracted scores or fallback to defaults
  const accessibilityScores = data?.scores || {
    walkScore: 92,
    transitScore: 87,
    bikeScore: 94
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 mb-4">
        This property benefits from its central location with excellent access to major transportation routes, employers, and urban amenities.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proximityData.map((category, index) => (
          <div key={index} className="space-y-3">
            <h3 className="text-md font-medium text-gray-800">{category.category}</h3>
            <div className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className="flex justify-between items-center p-3 rounded-md border border-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-blue-600">
                      {item.icon}
                    </div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">{item.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-md">
        <h4 className="font-medium text-gray-800 mb-2">Accessibility Score</h4>
        <div className="flex space-x-6">
          <div>
            <p className="text-sm text-gray-600">Walk Score</p>
            <p className="text-xl font-medium text-gray-800">{accessibilityScores.walkScore}<span className="text-sm text-gray-500 ml-1">/ 100</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Transit Score</p>
            <p className="text-xl font-medium text-gray-800">{accessibilityScores.transitScore}<span className="text-sm text-gray-500 ml-1">/ 100</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bike Score</p>
            <p className="text-xl font-medium text-gray-800">{accessibilityScores.bikeScore}<span className="text-sm text-gray-500 ml-1">/ 100</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get the appropriate icon based on transportation type
function getIconForTransportType(type: string) {
  const typeLC = type.toLowerCase();
  if (typeLC.includes('airport')) return <Car size={16} />;
  if (typeLC.includes('train') || typeLC.includes('station')) return <Train size={16} />;
  if (typeLC.includes('port')) return <Ship size={16} />;
  return <Car size={16} />; // Default to car for other types
}

export default ProximityInsights;
