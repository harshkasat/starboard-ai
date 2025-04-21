import type { SupplyData, LandSaleData, DemographicData, ProximityData, ZoningData } from '@/types/extracted';

interface ValidationError {
  field: string;
  message: string;
}

export function validateSupplyData(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.yearlySupply || !Array.isArray(data.yearlySupply)) {
    errors.push({ field: 'yearlySupply', message: 'Missing or invalid yearly supply data' });
  } else {
    data.yearlySupply.forEach((supply: any, index: number) => {
      if (typeof supply.year !== 'string') {
        errors.push({ field: `yearlySupply[${index}].year`, message: 'Year must be a string' });
      }
      if (typeof supply.office !== 'number') {
        errors.push({ field: `yearlySupply[${index}].office`, message: 'Office must be a number' });
      }
      if (typeof supply.retail !== 'number') {
        errors.push({ field: `yearlySupply[${index}].retail`, message: 'Retail must be a number' });
      }
      if (typeof supply.multifamily !== 'number') {
        errors.push({ field: `yearlySupply[${index}].multifamily`, message: 'Multifamily must be a number' });
      }
    });
  }

  if (!data.nearbyProjects || !Array.isArray(data.nearbyProjects)) {
    errors.push({ field: 'nearbyProjects', message: 'Missing or invalid nearby projects data' });
  } else {
    data.nearbyProjects.forEach((project: any, index: number) => {
      if (typeof project.name !== 'string') {
        errors.push({ field: `nearbyProjects[${index}].name`, message: 'Project name must be a string' });
      }
      if (typeof project.type !== 'string') {
        errors.push({ field: `nearbyProjects[${index}].type`, message: 'Project type must be a string' });
      }
      if (typeof project.size !== 'string') {
        errors.push({ field: `nearbyProjects[${index}].size`, message: 'Project size must be a string' });
      }
      if (typeof project.completion !== 'string') {
        errors.push({ field: `nearbyProjects[${index}].completion`, message: 'Completion date must be a string' });
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateLandSaleData(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.recentSales || !Array.isArray(data.recentSales)) {
    errors.push({ field: 'recentSales', message: 'Missing or invalid recent sales data' });
  } else {
    data.recentSales.forEach((sale: any, index: number) => {
      if (typeof sale.address !== 'string') {
        errors.push({ field: `recentSales[${index}].address`, message: 'Address must be a string' });
      }
      if (typeof sale.price !== 'string') {
        errors.push({ field: `recentSales[${index}].price`, message: 'Price must be a string' });
      }
      if (typeof sale.pricePSF !== 'string') {
        errors.push({ field: `recentSales[${index}].pricePSF`, message: 'Price per square foot must be a string' });
      }
      if (typeof sale.date !== 'string') {
        errors.push({ field: `recentSales[${index}].date`, message: 'Date must be a string' });
      }
    });
  }

  if (!data.marketTrends) {
    errors.push({ field: 'marketTrends', message: 'Missing market trends data' });
  } else {
    if (typeof data.marketTrends.averagePSF !== 'string') {
      errors.push({ field: 'marketTrends.averagePSF', message: 'Average price per square foot must be a string' });
    }
    if (typeof data.marketTrends.salesVolume !== 'string') {
      errors.push({ field: 'marketTrends.salesVolume', message: 'Sales volume must be a string' });
    }
    if (typeof data.marketTrends.numberOfTransactions !== 'number') {
      errors.push({ field: 'marketTrends.numberOfTransactions', message: 'Number of transactions must be a number' });
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function validateDemographicData(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.population || !Array.isArray(data.population)) {
    errors.push({ field: 'population', message: 'Missing or invalid population data' });
  } else {
    data.population.forEach((pop: any, index: number) => {
      if (typeof pop.year !== 'number') {
        errors.push({ field: `population[${index}].year`, message: 'Year must be a number' });
      }
      if (typeof pop.count !== 'number') {
        errors.push({ field: `population[${index}].count`, message: 'Count must be a number' });
      }
    });
  }

  if (!data.incomeStats) {
    errors.push({ field: 'incomeStats', message: 'Missing income statistics data' });
  } else {
    if (typeof data.incomeStats.medianIncome !== 'number') {
      errors.push({ field: 'incomeStats.medianIncome', message: 'Median income must be a number' });
    }
    if (typeof data.incomeStats.growthRate !== 'string') {
      errors.push({ field: 'incomeStats.growthRate', message: 'Growth rate must be a string' });
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function validateProximityData(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.transportation || !Array.isArray(data.transportation)) {
    errors.push({ field: 'transportation', message: 'Missing or invalid transportation data' });
  } else {
    data.transportation.forEach((trans: any, index: number) => {
      if (typeof trans.type !== 'string') {
        errors.push({ field: `transportation[${index}].type`, message: 'Transportation type must be a string' });
      }
      if (typeof trans.distance !== 'string') {
        errors.push({ field: `transportation[${index}].distance`, message: 'Distance must be a string' });
      }
    });
  }

  if (!data.scores) {
    errors.push({ field: 'scores', message: 'Missing scores data' });
  } else {
    if (typeof data.scores.walkScore !== 'number') {
      errors.push({ field: 'scores.walkScore', message: 'Walk score must be a number' });
    }
    if (typeof data.scores.transitScore !== 'number') {
      errors.push({ field: 'scores.transitScore', message: 'Transit score must be a number' });
    }
    if (typeof data.scores.bikeScore !== 'number') {
      errors.push({ field: 'scores.bikeScore', message: 'Bike score must be a number' });
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function validateZoningData(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data.current) {
    errors.push({ field: 'current', message: 'Missing current zoning data' });
  } else {
    if (typeof data.current.designation !== 'string') {
      errors.push({ field: 'current.designation', message: 'Designation must be a string' });
    }
    if (typeof data.current.far !== 'string') {
      errors.push({ field: 'current.far', message: 'FAR must be a string' });
    }
    if (typeof data.current.heightLimit !== 'string') {
      errors.push({ field: 'current.heightLimit', message: 'Height limit must be a string' });
    }
  }

  if (!data.allowedUses || !Array.isArray(data.allowedUses)) {
    errors.push({ field: 'allowedUses', message: 'Missing or invalid allowed uses data' });
  } else {
    data.allowedUses.forEach((use: any, index: number) => {
      if (typeof use !== 'string') {
        errors.push({ field: `allowedUses[${index}]`, message: 'Allowed use must be a string' });
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateRiskFactors(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!Array.isArray(data.riskFactors)) {
    errors.push({ field: 'riskFactors', message: 'Risk factors must be an array' });
  } else {
    data.riskFactors.forEach((risk: any, index: number) => {
      if (typeof risk.title !== 'string') {
        errors.push({ field: `riskFactors[${index}].title`, message: 'Risk title must be a string' });
      }
      if (typeof risk.description !== 'string') {
        errors.push({ field: `riskFactors[${index}].description`, message: 'Risk description must be a string' });
      }
      if (!['high', 'medium', 'low'].includes(risk.severity.toLowerCase())) {
        errors.push({ field: `riskFactors[${index}].severity`, message: 'Severity must be high, medium, or low' });
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateSubmarket(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (typeof data.submarket !== 'string' || !data.submarket.trim()) {
    errors.push({ field: 'submarket', message: 'Submarket must be a non-empty string' });
  }

  return { isValid: errors.length === 0, errors };
}

export function validatePropertyType(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (typeof data.propertyType !== 'string' || !data.propertyType.trim()) {
    errors.push({ field: 'propertyType', message: 'Property type must be a non-empty string' });
  }

  return { isValid: errors.length === 0, errors };
}

export function validatePropertyName(data: any): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (typeof data.propertyName !== 'string' || !data.propertyName.trim()) {
    errors.push({ field: 'propertyName', message: 'Property name must be a non-empty string' });
  }

  return { isValid: errors.length === 0, errors };
}

export function validateSectionData(section: string, data: any): { isValid: boolean; errors: ValidationError[] } {
  switch (section) {
    case 'supplyPipeline':
      return validateSupplyData(data);
    case 'landSales':
      return validateLandSaleData(data);
    case 'demographics':
      return validateDemographicData(data);
    case 'proximityInsights':
      return validateProximityData(data);
    case 'zoningOverlays':
      return validateZoningData(data);
    case 'riskFactors':
      return validateRiskFactors(data);
    case 'submarket':
      return validateSubmarket(data);
    case 'propertyType':
      return validatePropertyType(data);
    case 'propertyName':
      return validatePropertyName(data);
    default:
      return { isValid: false, errors: [{ field: 'section', message: 'Invalid section type' }] };
  }
}