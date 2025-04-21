import type { SupplyData, LandSaleData, DemographicData, ProximityData, ZoningData, RiskFactors, PropertyName, PropertyType, Submarket } from '@/types/extracted';

interface ExtractedSection {
    data: any;
    confidence: number;
}

export function transformSupplyPipeline(extracted: ExtractedSection): SupplyData {
    const { data } = extracted;
    return {
      yearlySupply: data.yearlySupply,
      nearbyProjects: data.nearbyProjects
    };
  }
  
export function transformLandSales(extracted: ExtractedSection): LandSaleData {
    const { data } = extracted;
    return {
      recentSales: data.recentSales,
      marketTrends: data.marketTrends
    };
}
  
export function transformDemographics(extracted: ExtractedSection): DemographicData {
    const { data } = extracted;
    return {
      population: data.population,
      incomeStats: data.incomeStats,
      industryBreakdown: data.industryBreakdown,
      educationLevels: data.educationLevels
    };
}
  
export function transformProximityInsights(extracted: ExtractedSection): ProximityData {
    const { data } = extracted;
    return {
        transportation: data.transportation,
        scores: data.scores,
        employers: data.employers,
        amenities: data.amenities
    };
}
  
export function transformZoningOverlays(extracted: ExtractedSection): ZoningData {
    const { data } = extracted;
    return {
        current: data.current,
        allowedUses: data.allowedUses,
        overlayDistricts: data.overlayDistricts,
        specialRequirements: data.specialRequirements
    };
}

export function transformRiskFactor(extracted: ExtractedSection): RiskFactors[] {
    const { data } = extracted;
    
    // Ensure data.riskFactors is an array, otherwise wrap single item in array
    return Array.isArray(data.riskFactors) ? data.riskFactors : [data];
}

export function transformSubmarket(extracted:ExtractedSection): Submarket{
    const {data} = extracted;

    return {
        submarket: data.submarket
    }
}

export function transformPropertyType(extracted:ExtractedSection): PropertyType{
    const {data} = extracted;

    return {
        propertyType: data.propertyType
    }
}

export function transformPropertyName(extracted:ExtractedSection): PropertyName{
    const {data} = extracted;

    return {
        propertyName: data.propertyName
    }
}