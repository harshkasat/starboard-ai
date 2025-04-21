import type { 
  SupplyData, LandSaleData, DemographicData, 
  ProximityData, ZoningData, RiskFactors,
  Submarket, PropertyType, PropertyName 
} from '@/types/extracted';

export interface LocationAnalysisData {
  supplyPipeline: SupplyData;
  landSales: LandSaleData;
  demographics: DemographicData;
  proximityInsights: ProximityData;
  zoningOverlays: ZoningData;
  riskFactors: RiskFactors[];
  submarket: Submarket;
  propertyType: PropertyType;
  propertyName: PropertyName;
}