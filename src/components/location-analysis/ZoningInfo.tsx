import { FileText, ExternalLink, Check, X, Search } from "lucide-react";
import type { ZoningData } from "@/types/extracted";
import { useEffect, useState } from "react";
import { searchLocationInfo } from "@/lib/services/locationSearch";

interface ZoningInfoProps {
  data?: ZoningData;
  propertyLocation?: string;
}

interface SearchResult {
  title: string;
  url: string;
  description: string;
  source: 'government' | 'realEstate' | 'forum' | 'other';
  relevanceScore: number;
}

const defaultZoning = {
  current: {
    designation: "CX: Central Commercial",
    description: "The property is zoned which provides for commercial development within Portland's most urban and intense areas.",
    far: "9:1 base (12:1 max)",
    heightLimit: "250 feet"
  },
  allowedUses: [
    "Commercial Office",
    "Retail Sales and Service",
    "Residential",
    "Institutional Uses"
  ],
  overlayDistricts: [
    "Design Overlay Zone",
    "Central City Plan District"
  ],
  specialRequirements: [
    "Ground Floor Active Uses Required",
    "60% Window Glazing on Ground Floor",
    "Pedestrian-Oriented Design"
  ]
};

const ZoningInfo = ({ data, propertyLocation }: ZoningInfoProps) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!data?.current?.designation && !propertyLocation) return;
      
      setIsLoading(true);
      try {
        const results = await searchLocationInfo({
          location: propertyLocation,
          zoning: data?.current?.designation,
        });
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setIsLoading(false);
    };

    fetchSearchResults();
  }, [data?.current?.designation, propertyLocation]);

  // Use extracted data or fallback to defaults
  const zoning = {
    current: data?.current || defaultZoning.current,
    allowedUses: data?.allowedUses || defaultZoning.allowedUses,
    overlayDistricts: data?.overlayDistricts || defaultZoning.overlayDistricts,
    specialRequirements: data?.specialRequirements || defaultZoning.specialRequirements
  };

  // Determine prohibited uses (anything not in allowedUses)
  // const prohibitedUses = ["Heavy Industrial", "Auto-Oriented Uses"];

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-md border border-gray-200">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-medium">
            {zoning.current.designation}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {zoning.current.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Key Zoning Parameters</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-gray-600">Floor Area Ratio (FAR)</span>
                <span className="font-medium text-gray-800">{zoning.current.far}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">Height Limit</span>
                <span className="font-medium text-gray-800">{zoning.current.heightLimit}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">Required Setbacks</span>
                <span className="font-medium text-gray-800">None</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-600">Ground Floor Active Use</span>
                <span className="font-medium text-gray-800">Required on major streets</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Allowed Uses</h4>
            <ul className="space-y-2 text-sm">
              {zoning.allowedUses.map((use, index) => (
                <li key={index} className="flex items-start">
                  <Check size={16} className="text-green-500 mt-0.5 mr-2" />
                  <span>{use}</span>
                </li>
              ))}
              {/* {prohibitedUses.map((use, index) => (
                <li key={`prohibited-${index}`} className="flex items-start">
                  <X size={16} className="text-red-500 mt-0.5 mr-2" />
                  <span>{use}</span>
                </li>
              ))} */}
            </ul>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium text-gray-800 mb-3">Zoning Information Resources</h3>
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {searchResults.map((result, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
                  <div className="flex items-center flex-1 mr-4">
                    <Search size={18} className={
                      result.source === 'government' ? "text-green-600" :
                      result.source === 'realEstate' ? "text-blue-600" :
                      result.source === 'forum' ? "text-purple-600" : "text-gray-600"
                    } />
                    <div className="ml-2">
                      <div className="text-gray-800 font-medium">{result.title}</div>
                      <div className="text-sm text-gray-600">{result.description}</div>
                    </div>
                  </div>
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 flex items-center shrink-0"
                  >
                    <span className="text-sm">View</span>
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              ))}

              {/* <div className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <FileText size={18} className="text-blue-600 mr-2" />
                  <span className="text-gray-800">Portland Zoning Code - Chapter 33.510 Central City</span>
                </div>
                <a 
                  href="https://www.portland.gov/code/33/510" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span className="text-sm">View</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <FileText size={18} className="text-blue-600 mr-2" />
                  <span className="text-gray-800">Portland Maps - Zoning Information</span>
                </div>
                <a 
                  href="https://www.portlandmaps.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span className="text-sm">View</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
                <div className="flex items-center">
                  <FileText size={18} className="text-blue-600 mr-2" />
                  <span className="text-gray-800">Portland Design Guidelines</span>
                </div>
                <a 
                  href="https://www.portland.gov/bds/design-review" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span className="text-sm">View</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div> */}
            </>
          )}
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
        <h4 className="font-medium text-amber-800 mb-2">Zoning Notes</h4>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start">
            <span className="font-medium mr-2">•</span>
            <span>This property is subject to Design Review for any major exterior alterations or new construction.</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">•</span>
            <span>A Floor Area Ratio (FAR) bonus may be available through the provision of affordable housing or public amenities.</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium mr-2">•</span>
            <span>The site is within a Transit-Oriented Development overlay, which may reduce parking requirements.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ZoningInfo;
