import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Building, CircleAlert, ArrowUpRight, Download,
  ExternalLink, PanelTop, Map, ArrowRight, X,
  AlertCircle, Upload
} from "lucide-react";
import { extractLocationAnalysis, PDFExtractionError } from "@/lib/services/pdfExtractor";
import type { LocationAnalysisData } from "@/types/pdf";
import type { SupplyData, LandSaleData, DemographicData, ProximityData, ZoningData, RiskFactors } from "@/types/extracted";
import SupplyPipeline from "./SupplyPipeline";
import LandSales from "./LandSales";
import Demographics from "./Demographics";
import ProximityInsights from "./ProximityInsights";
import ZoningInfo from "./ZoningInfo";
import { Button } from "@/components/ui/button";
import LocationMap from "./LocationMap";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const LocationAnalysisTab = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("supply");
  const [showMap, setShowMap] = useState(false);
  const [showRiskFactors, setShowRiskFactors] = useState(false);
  const [analysisData, setAnalysisData] = useState<LocationAnalysisData | null>(null);
  const [error, setError] = useState<PDFExtractionError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processPdfMutation = useMutation({
    mutationFn: (file: File) => extractLocationAnalysis(file),
    onSuccess: (data) => {
      setAnalysisData(data);
      toast.success("PDF processed successfully", {
        description: "Location analysis data has been extracted"
      });
    },
    onError: (error: Error) => {
      if (error instanceof PDFExtractionError) {
        setError(error);
      } else {
        toast.error("Failed to process PDF", {
          description: error.message
        });
      }
    }
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleExport = () => {
    if (!analysisData) {
      toast.error("No data to export", {
        description: "Please process a PDF file first"
      });
      return;
    }

    // Initialize PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Title
    doc.setFontSize(20);
    doc.text('Location Analysis Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });

    // Property Info
    doc.setFontSize(16);
    doc.text('Property Information', 20, 45);
    autoTable(doc, {
      startY: 50,
      head: [['Property Name', 'Property Type', 'Submarket']],
      body: [[
        analysisData.propertyName?.propertyName || 'N/A',
        analysisData.propertyType?.propertyType || 'N/A',
        analysisData.submarket?.submarket || 'N/A'
      ]],
    });

    // Supply Pipeline
    if (analysisData.supplyPipeline) {
      doc.setFontSize(16);
      doc.text('Supply Pipeline', 20, (doc as any).lastAutoTable.finalY + 20);

      // Yearly Supply
      if (analysisData.supplyPipeline.yearlySupply?.length > 0) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 25,
          head: [['Year', 'Office', 'Retail', 'Multifamily']],
          body: analysisData.supplyPipeline.yearlySupply.map(supply => [
            supply.year,
            supply.office.toLocaleString(),
            supply.retail.toLocaleString(),
            supply.multifamily.toLocaleString()
          ]),
        });
      }

      // Nearby Projects
      if (analysisData.supplyPipeline.nearbyProjects?.length > 0) {
        doc.text('Nearby Projects', 20, (doc as any).lastAutoTable.finalY + 15);
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 20,
          head: [['Project', 'Type', 'Size', 'Completion']],
          body: analysisData.supplyPipeline.nearbyProjects.map(project => [
            project.name,
            project.type,
            project.size,
            project.completion
          ]),
        });
      }
    }

    // Land Sales
    if (analysisData.landSales) {
      doc.setFontSize(16);
      doc.text('Land Sales', 20, (doc as any).lastAutoTable.finalY + 20);

      // Recent Sales
      if (analysisData.landSales.recentSales?.length > 0) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 25,
          head: [['Address', 'Price', 'Price PSF', 'Date']],
          body: analysisData.landSales.recentSales.map(sale => [
            sale.address,
            sale.price,
            sale.pricePSF,
            sale.date
          ]),
        });
      }

      // Market Trends
      const trends = analysisData.landSales.marketTrends;
      if (trends) {
        doc.text('Market Trends', 20, (doc as any).lastAutoTable.finalY + 15);
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 20,
          body: [
            ['Average PSF', trends.averagePSF],
            ['Sales Volume', trends.salesVolume],
            ['Number of Transactions', trends.numberOfTransactions.toString()]
          ],
        });
      }
    }

    // Demographics
    if (analysisData.demographics) {
      doc.setFontSize(16);
      doc.text('Demographics', 20, (doc as any).lastAutoTable.finalY + 20);

      // Population
      if (analysisData.demographics.population?.length > 0) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 25,
          head: [['Year', 'Population', 'Type']],
          body: analysisData.demographics.population.map(pop => [
            pop.year.toString(),
            pop.count.toLocaleString(),
            pop.projected ? 'Projected' : 'Historical'
          ]),
        });
      }

      // Income Stats
      if (analysisData.demographics.incomeStats) {
        doc.text('Income Statistics', 20, (doc as any).lastAutoTable.finalY + 15);
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 20,
          body: [
            ['Median Income', `$${analysisData.demographics.incomeStats.medianIncome.toLocaleString()}`],
            ['Growth Rate', analysisData.demographics.incomeStats.growthRate]
          ],
        });
      }
    }

    // Proximity Insights
    if (analysisData.proximityInsights) {
      doc.setFontSize(16);
      doc.text('Proximity Insights', 20, (doc as any).lastAutoTable.finalY + 20);

      // Transportation
      if (analysisData.proximityInsights.transportation?.length > 0) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 25,
          head: [['Type', 'Distance']],
          body: analysisData.proximityInsights.transportation.map(transport => [
            transport.type,
            transport.distance
          ]),
        });
      }

      // Scores
      if (analysisData.proximityInsights.scores) {
        doc.text('Location Scores', 20, (doc as any).lastAutoTable.finalY + 15);
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 20,
          body: [
            ['Walk Score', analysisData.proximityInsights.scores.walkScore.toString()],
            ['Transit Score', analysisData.proximityInsights.scores.transitScore.toString()],
            ['Bike Score', analysisData.proximityInsights.scores.bikeScore.toString()]
          ],
        });
      }
    }

    // Risk Factors
    if (analysisData.riskFactors && analysisData.riskFactors.length > 0) {
      doc.setFontSize(16);
      doc.text('Risk Factors', 20, (doc as any).lastAutoTable.finalY + 20);
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 25,
        head: [['Risk', 'Severity', 'Description']],
        body: analysisData.riskFactors.map(risk => [
          risk.title,
          risk.severity.toUpperCase(),
          risk.description
        ]),
      });
    }

    // Save the PDF
    doc.save(`location-analysis-${new Date().toISOString().split('T')[0]}.pdf`);

    toast.success("Report exported successfully", {
      description: "The location analysis report has been downloaded as PDF"
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error("Invalid file type", {
          description: "Please upload a PDF file"
        });
        return;
      }
      
      setIsLoading(true);
      setError(null);
      try {
        const data = await extractLocationAnalysis(file);
        setAnalysisData(data);
      } catch (err) {
        if (err instanceof PDFExtractionError) {
          setError(err);
        } else {
          console.error('Unexpected error:', err);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Extraction Error</AlertTitle>
        <AlertDescription>
          <div className="space-y-2">
            <p>{error.message}</p>
            <div className="space-y-1">
              {error.errors.map((sectionError, index) => (
                <div key={index} className="text-sm">
                  <strong>{sectionError.section}:</strong>
                  <ul className="list-disc list-inside pl-4">
                    {sectionError.errors.map((err, errIndex) => (
                      <li key={errIndex}>{err.message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              onClick={() => setError(null)}
              className="mt-2"
            >
              Try Another File
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  const defaultRiskFactors: RiskFactors[] = [
    {
      title: "Supply Risk",
      description: "High volume of competitive office supply coming online in 2025-2026 may impact absorption and rental rates.",
      severity: "high"
    },
    {
      title: "Zoning Restriction",
      description: "Recent zoning updates limit building height to 120 feet, potentially reducing maximum development capacity.",
      severity: "medium"
    }
  ];

  const riskFactors = analysisData?.riskFactors ?? defaultRiskFactors

  return (
    <div className="space-y-6">
      {renderError()}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Location Analysis</h1>
          <p className="text-gray-500">
            Analysis of surrounding market, development risks, and regional dynamics
          </p>
        </div>
        <div className="flex space-x-3">
          <label className="cursor-pointer">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              asChild
              disabled={isLoading}
            >
              <div>
                <Upload className="h-4 w-4" />
                <span>{isLoading ? "Processing..." : "Upload PDF"}</span>
              </div>
            </Button>
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </label>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={toggleMap}
          >
            {showMap ? (
              <>
                <X className="h-4 w-4" />
                <span>Close Map</span>
              </>
            ) : (
              <>
                <Map className="h-4 w-4" />
                <span>View on Map</span>
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {showMap ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[70vh]">
          <LocationMap data={analysisData} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">Property Type</h3>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {analysisData?.propertyType?.propertyType ?? 'Office'}
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PanelTop className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">Submarket</h3>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {analysisData?.submarket?.submarket ?? 'Central Business District'}
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowRiskFactors(true)}
              >
                <div className="flex items-center">
                  <CircleAlert className="h-5 w-5 text-amber-500 mr-2" />
                  <h3 className="font-medium">Risk Factors</h3>
                </div>
                <div className="flex items-center text-amber-500">
                  <span className="text-sm">{analysisData?.riskFactors?.length?? '2'} Identified</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection("supply")}
              >
                <h2 className="text-lg font-medium text-gray-800">Supply Pipeline</h2>
                <span className={`transition-transform ${expandedSection === "supply" ? "rotate-90" : ""}`}>
                  <ArrowRight />
                </span>
              </div>
              {expandedSection === "supply" && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <SupplyPipeline data={analysisData?.supplyPipeline} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection("landsales")}
              >
                <h2 className="text-lg font-medium text-gray-800">Land Sale Comparables</h2>
                <span className={`transition-transform ${expandedSection === "landsales" ? "rotate-90" : ""}`}>
                  <ArrowRight />
                </span>
              </div>
              {expandedSection === "landsales" && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <LandSales data={analysisData?.landSales} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection("demographics")}
              >
                <h2 className="text-lg font-medium text-gray-800">Demographic Trends</h2>
                <span className={`transition-transform ${expandedSection === "demographics" ? "rotate-90" : ""}`}>
                  <ArrowRight />
                </span>
              </div>
              {expandedSection === "demographics" && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <Demographics data={analysisData?.demographics} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection("proximity")}
              >
                <h2 className="text-lg font-medium text-gray-800">Proximity Insights</h2>
                <span className={`transition-transform ${expandedSection === "proximity" ? "rotate-90" : ""}`}>
                  <ArrowRight />
                </span>
              </div>
              {expandedSection === "proximity" && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <ProximityInsights data={analysisData?.proximityInsights} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection("zoning")}
              >
                <h2 className="text-lg font-medium text-gray-800">Zoning Overlays</h2>
                <span className={`transition-transform ${expandedSection === "zoning" ? "rotate-90" : ""}`}>
                  <ArrowRight />
                </span>
              </div>
              {expandedSection === "zoning" && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <ZoningInfo data={analysisData?.zoningOverlays} />
                </div>
              )}
            </div>
          </div>

          {/* Risk Factors Dialog */}
          <Dialog open={showRiskFactors} onOpenChange={setShowRiskFactors}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  Risk Factors
                </DialogTitle>
                <DialogDescription>
                  Identified risks for this location
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <div className={`h-3 w-3 rounded-full mr-2 ${
                        risk.severity.toLowerCase() === 'high' ? 'bg-red-500' : 
                        risk.severity.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-yellow-500'
                      }`}></div>
                      <h3 className="font-medium">{risk.title}</h3>
                      <span className="ml-2 text-xs capitalize px-2 py-0.5 rounded bg-gray-100">
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{risk.description}</p>
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default LocationAnalysisTab;
