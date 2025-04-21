import { processFileWithGemini, AIValidationError } from './geminiAssistant';
import { SECTION_EXTRACTORS } from '@/lib/services/prompts/analysisPrompts';
import type { LocationAnalysisData } from '@/types/pdf';
import type { SupplyData, LandSaleData, DemographicData, ProximityData, ZoningData } from '@/types/extracted';
import  { transformSupplyPipeline, transformDemographics, 
  transformLandSales, transformProximityInsights, 
  transformZoningOverlays, transformRiskFactor,
  transformPropertyName, transformPropertyType,
  transformSubmarket }  from "@/lib/services/transformData"

interface ExtractedSection {
  data: any;
  confidence: number;
}

interface ExtractionError {
  section: string;
  errors: { field: string; message: string }[];
}

export class PDFExtractionError extends Error {
  constructor(public errors: ExtractionError[], message: string) {
    super(message);
    this.name = 'PDFExtractionError';
  }
}

export async function extractLocationAnalysis(file: File): Promise<LocationAnalysisData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const fileBuffer = event.target?.result as ArrayBuffer;
        const extractionErrors: ExtractionError[] = [];
        
        // Process each section with error collection
        const [
          supplyPipelineResult,
          landSalesResult,
          demographicsResult,
          proximityResult,
          zoningResult,
          riskFactorsResult,
          submarketResult,
          propertyTypeResult,
          propertyNameResult
        ] = await Promise.allSettled([
          extractSection(fileBuffer, 'supplyPipeline'),
          extractSection(fileBuffer, 'landSales'),
          extractSection(fileBuffer, 'demographics'),
          extractSection(fileBuffer, 'proximityInsights'),
          extractSection(fileBuffer, 'zoningOverlays'),
          extractSection(fileBuffer, 'riskFactors'),
          extractSection(fileBuffer, 'submarket'),
          extractSection(fileBuffer, 'propertyType'),
          extractSection(fileBuffer, 'propertyName')
        ]);

        // Handle results and collect errors
        function handleResult(result: PromiseSettledResult<ExtractedSection>, section: string) {
          if (result.status === 'rejected') {
            if (result.reason instanceof AIValidationError) {
              extractionErrors.push({
                section,
                errors: result.reason.errors
              });
            } else {
              extractionErrors.push({
                section,
                errors: [{ field: 'unknown', message: result.reason.message }]
              });
            }
            return null;
          }
          return result.value;
        }

        const supplyPipelineData = handleResult(supplyPipelineResult, 'supplyPipeline');
        const landSalesData = handleResult(landSalesResult, 'landSales');
        const demographicsData = handleResult(demographicsResult, 'demographics');
        const proximityData = handleResult(proximityResult, 'proximityInsights');
        const zoningData = handleResult(zoningResult, 'zoningOverlays');
        const riskFactorsData = handleResult(riskFactorsResult, 'riskFactors');
        const submarketData = handleResult(submarketResult, 'submarket');
        const propertyTypeData = handleResult(propertyTypeResult, 'propertyType');
        const propertyNameData = handleResult(propertyNameResult, 'propertyName');

        // If there are any errors, throw a PDFExtractionError
        if (extractionErrors.length > 0) {
          throw new PDFExtractionError(
            extractionErrors,
            'Failed to extract some sections from the PDF. Please check the data quality and try uploading again.'
          );
        }

        // Combine and validate the extracted data
        const analysisData: LocationAnalysisData = {
          supplyPipeline: transformSupplyPipeline(supplyPipelineData!),
          landSales: transformLandSales(landSalesData!),
          demographics: transformDemographics(demographicsData!),
          proximityInsights: transformProximityInsights(proximityData!),
          zoningOverlays: transformZoningOverlays(zoningData!),
          riskFactors: transformRiskFactor(riskFactorsData!),
          submarket: transformSubmarket(submarketData!),
          propertyType: transformPropertyType(propertyTypeData!),
          propertyName:transformPropertyName(propertyNameData!)
        };

        resolve(analysisData);
      } catch (error) {
        if (error instanceof PDFExtractionError) {
          reject(error); // Propagate validation errors to be handled by UI
        } else {
          reject(new Error('Failed to process PDF: ' + error));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };

    reader.readAsArrayBuffer(file);
  });
}

async function extractSection(fileBuffer: ArrayBuffer, section: keyof typeof SECTION_EXTRACTORS): Promise<ExtractedSection> {
  const result = await processFileWithGemini(fileBuffer, section);
  return {
    data: JSON.parse(result.text),
    confidence: result.confidence
  };
}

// function transformSupplyPipeline(extracted: ExtractedSection): SupplyData {
//   const { data } = extracted;
//   return {
//     yearlySupply: data.yearlySupply,
//     nearbyProjects: data.nearbyProjects
//   };
// }

// function transformLandSales(extracted: ExtractedSection): LandSaleData {
//   const { data } = extracted;
//   return {
//     recentSales: data.recentSales,
//     marketTrends: data.marketTrends
//   };
// }

// function transformDemographics(extracted: ExtractedSection): DemographicData {
//   const { data } = extracted;
//   return {
//     population: data.population,
//     incomeStats: data.incomeStats,
//     industryBreakdown: data.industryBreakdown,
//     educationLevels: data.educationLevels
//   };
// }

// function transformProximityInsights(extracted: ExtractedSection): ProximityData {
//   const { data } = extracted;
//   return {
//     transportation: data.transportation,
//     scores: data.scores,
//     employers: data.employers,
//     amenities: data.amenities
//   };
// }

// function transformZoningOverlays(extracted: ExtractedSection): ZoningData {
//   const { data } = extracted;
//   return {
//     current: data.current,
//     allowedUses: data.allowedUses,
//     overlayDistricts: data.overlayDistricts,
//     specialRequirements: data.specialRequirements
//   };
// }