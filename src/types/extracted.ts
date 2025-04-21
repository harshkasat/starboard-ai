export interface SupplyData {
  yearlySupply: {
    year: string;
    office: number;
    retail: number;
    multifamily: number;
  }[];
  nearbyProjects: {
    name: string;
    type: string;
    size: string;
    completion: string;
    distance: number
  }[];
}

export interface LandSaleData {
  recentSales: {
    address: string;
    price: string;
    pricePSF: string;
    date: string;
    zoning: string;
    buyer:string;
  }[];
  marketTrends: {
    averagePSF: string;
    salesVolume: string;
    numberOfTransactions: number;
  };
}

export interface DemographicData {
  population: {
    year: number;
    count: number;
    projected?: boolean;
  }[];
  incomeStats: {
    medianIncome: number;
    growthRate: string;
  };
  industryBreakdown?: {
    name: string;
    value: number;
  }[];
  educationLevels?: {
    name: string;
    value: number;
  }[];
}

export interface ProximityData {
  transportation: {
    type: string;
    distance: string;
  }[];
  scores: {
    walkScore: number;
    transitScore: number;
    bikeScore: number;
  };
  employers?: {
    name: string;
    distance: string;
  }[];
  amenities?: {
    name: string;
    distance: string;
  }[];
}

export interface ZoningData {
  current: {
    designation: string;
    description: string;
    far: string;
    heightLimit: string;
  };
  allowedUses: string[];
  overlayDistricts?: string[];
  specialRequirements?: string[];
}

export interface RiskFactors{
  title: string;
  description:string;
  severity:string
}

export interface Submarket {
  submarket:string
}

export interface PropertyType {
  propertyType:string
}

export interface PropertyName {
  propertyName: string
}