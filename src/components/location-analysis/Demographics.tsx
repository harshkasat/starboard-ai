import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ArrowUpRight, Briefcase, GraduationCap } from "lucide-react";
import type { DemographicData } from "@/types/extracted";

interface DemographicsProps {
  data?: DemographicData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Demographics = ({ data }: DemographicsProps) => {
  // Use extracted data or fallback to default data
  const populationData = data?.population || [
    { year: 2020, count: 652500 },
    { year: 2021, count: 661000 },
    { year: 2022, count: 669500 },
    { year: 2023, count: 678000 },
    { year: 2024, count: 686500 },
    { year: 2025, count: 695000, projected: true }
  ];

  const incomeStats = data?.incomeStats || {
    medianIncome: 72500,
    growthRate: '11.9%'
  };

  const industryData = data?.industryBreakdown || [
    { name: "Healthcare", value: 22 },
    { name: "Technology", value: 18 },
    { name: "Education", value: 14 },
    { name: "Finance", value: 12 },
    { name: "Manufacturing", value: 10 },
    { name: "Retail", value: 9 },
    { name: "Government", value: 8 },
    { name: "Other", value: 7 }
  ];

  const educationData = data?.educationLevels || [
    { name: "High School", value: 18 },
    { name: "Some College", value: 22 },
    { name: "Associate's", value: 10 },
    { name: "Bachelor's", value: 32 },
    { name: "Graduate", value: 18 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Population Trends */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-800">Population Growth</h3>
            <div className="flex items-center text-green-600 text-sm">
              <span className="font-medium">+4.7% YoY</span>
              <ArrowUpRight size={16} className="ml-1" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={populationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => {
                    if (typeof value === 'number') {
                      return value.toLocaleString();
                    }
                    return value;
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Population"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-sm text-gray-600">
            Portland has seen consistent population growth, with a notable influx of residents in the healthcare and technology sectors. Projections indicate continued growth through 2025.
          </p>
        </div>

        {/* Income Trends */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-800">Median Household Income</h3>
            <div className="flex items-center text-green-600 text-sm">
              <span className="font-medium">{incomeStats.growthRate} YoY</span>
              <ArrowUpRight size={16} className="ml-1" />
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis />
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="median"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-sm text-gray-600">
            Median household income has grown steadily, outpacing national averages. 
            Current median income: ${incomeStats.medianIncome.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Workforce Composition */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-md font-medium text-gray-800">Industry Breakdown</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industryData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 80,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="%" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Education Levels */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-md font-medium text-gray-800">Education Levels</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={educationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981">
                  {educationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Portland's workforce is highly educated, with 50% of adults holding a bachelor's degree or higher. This contributes to the area's strength in technology and healthcare sectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demographics;
