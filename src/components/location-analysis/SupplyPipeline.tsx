import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Building, AlertCircle } from "lucide-react";
import type { SupplyData } from "@/types/extracted";

interface SupplyPipelineProps {
  data?: SupplyData;
}

const SupplyPipeline = ({ data }: SupplyPipelineProps) => {
  // Use extracted data or fallback to default data
  const supplyData = data?.yearlySupply || [
    {
      year: "2024",
      office: 120000,
      retail: 45000,
      multifamily: 85000,
    },
    {
      year: "2025",
      office: 210000,
      retail: 60000,
      multifamily: 150000,
    },
    {
      year: "2026",
      office: 180000,
      retail: 75000,
      multifamily: 230000,
    },
    {
      year: "2027",
      office: 90000,
      retail: 50000,
      multifamily: 190000,
    },
  ];

  const nearbyDevelopments = data?.nearbyProjects || [
    {
      id: 1,
      name: "Portland Tech Center",
      type: "Office",
      size: "350,000 SF",
      completion: "Q2 2025",
      distance: "0.4 miles"
    },
    {
      id: 2,
      name: "Pearl District Apartments",
      type: "Multifamily",
      size: "220 units",
      completion: "Q4 2024",
      distance: "0.8 miles"
    },
    {
      id: 3,
      name: "Waterfront Commons",
      type: "Mixed Use",
      size: "180,000 SF",
      completion: "Q3 2025",
      distance: "1.2 miles"
    },
    {
      id: 4,
      name: "Urban Retail Plaza",
      type: "Retail",
      size: "75,000 SF",
      completion: "Q1 2026",
      distance: "0.9 miles"
    },
  ];

  // Calculate total office supply to determine if there's high supply growth
  const totalOfficeSupply = supplyData.reduce((acc, curr) => acc + curr.office, 0);
  const hasHighOfficeSupply = totalOfficeSupply > 500000; // Example threshold

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-md font-medium text-gray-800">
            New Development by Property Type (SF)
          </h3>
          {hasHighOfficeSupply && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-amber-100 text-amber-700 rounded">
              <AlertCircle size={14} />
              <span className="text-xs">High supply growth in office</span>
            </div>
          )}
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={supplyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="office" name="Office" fill="#3b82f6" />
              <Bar dataKey="retail" name="Retail" fill="#10b981" />
              <Bar dataKey="multifamily" name="Multifamily" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-md font-medium text-gray-800 mb-3">
          Nearby Development Pipeline
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nearbyDevelopments.map((dev, index) => (
                <tr key={dev.id || index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dev.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Building size={14} className="mr-1 text-gray-400" />
                      <span>{dev.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {dev.size}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {dev.completion}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {dev.distance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplyPipeline;
