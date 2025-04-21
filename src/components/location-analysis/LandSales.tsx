import { ExternalLink } from "lucide-react";
import type { LandSaleData } from "@/types/extracted";

interface LandSalesProps {
  data?: LandSaleData;
}

const defaultSales = [
  {
    id: 1,
    address: "1250 NW Broadway",
    date: "Dec 2023",
    size: "2.3 acres",
    price: "$12.5M",
    pricePSF: "$125",
    zoning: "CX: Central Commercial",
    buyer: "Portland Development Group"
  },
  {
    id: 2,
    address: "825 SE Morrison St",
    date: "Oct 2023",
    size: "1.8 acres",
    price: "$9.2M",
    pricePSF: "$117",
    zoning: "EX: Central Employment",
    buyer: "Morrison Street Partners"
  },
  {
    id: 3,
    address: "450 N Williams Ave",
    date: "Aug 2023",
    size: "3.5 acres",
    price: "$18.7M",
    pricePSF: "$123",
    zoning: "EX: Central Employment",
    buyer: "Williams Development LLC"
  },
  {
    id: 4,
    address: "2120 NW Flanders St",
    date: "July 2023",
    size: "1.2 acres",
    price: "$6.8M",
    pricePSF: "$130",
    zoning: "EX: Central Employment",
    buyer: "Pearl District Investors"
  },
  {
    id: 5,
    address: "535 SE Grand Ave",
    date: "May 2023",
    size: "2.7 acres",
    price: "$14.3M",
    pricePSF: "$122",
    zoning: "IG1: General Industrial",
    buyer: "Central Eastside Holdings"
  }
];

const LandSales = ({ data }: LandSalesProps) => {
  // Use extracted data or fallback to default data
  const landSales = data?.recentSales?.map((sale, index) => ({
    id: index + 1,
    ...sale,
    size: sale.size || defaultSales[index]?.size || "N/A",
    zoning: sale.zoning || defaultSales[index]?.zoning || "N/A",
    buyer: sale.buyer || defaultSales[index]?.buyer || "N/A"
  })) || defaultSales;

  const marketTrends = data?.marketTrends || {
    averagePSF: "$123",
    salesVolume: "$61.5M",
    numberOfTransactions: 5
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Recent land sales in Portland's central business district show an average price of{" "}
          <span className="font-semibold">{marketTrends.averagePSF} per square foot</span>, 
          with most transactions involving parcels zoned for commercial and mixed-use development.
          Total sales volume of {marketTrends.salesVolume} across {marketTrends.numberOfTransactions} transactions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/SF</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zoning</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {landSales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{sale.address}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{sale.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{sale.size}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{sale.price}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{sale.pricePSF}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {sale.zoning.split(":")[0]}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{sale.buyer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium text-gray-700 mb-2">Zoning Definitions</h4>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="font-medium text-gray-600">CX: Central Commercial</dt>
            <dd className="text-gray-500">High-density commercial development with residential allowed</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">EX: Central Employment</dt>
            <dd className="text-gray-500">Mixed-use industrial, commercial and residential</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">IG1: General Industrial</dt>
            <dd className="text-gray-500">Industrial uses with limited commercial</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default LandSales;
