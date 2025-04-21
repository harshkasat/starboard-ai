interface PromptConfig {
  prompt: string;
  dataSchema: string;
}

interface SectionPrompts {
  [key: string]: PromptConfig;
}

export const SECTION_EXTRACTORS: SectionPrompts = {
    supplyPipeline: {
        prompt: `If exact data is not explicitly stated in the document, use logical deduction and contextual clues to provide realistic estimates based on:
            1. Market trends mentioned in the document
            2. Regional development patterns
            3. Historical data points referenced
            4. Comparable properties or developments mentioned
            5. Geographic and economic context provided

            Extract information focusing on:
            - New development projects by property type (office, retail, multifamily) with square footage numbers
            - Development timeline for upcoming years
            - Nearby development projects within 2 miles with specific details

            For any values not explicitly stated, provide reasonable estimates based on:
            - Mentioned market conditions (e.g., if "high demand" is noted for multifamily, estimate higher supply)
            - Referenced property values or market dynamics
            - Regional development patterns suggested in the document
            - Comparable project sizes mentioned

            The response MUST match this exact structure:
            {
            "yearlySupply": [
                {
                "year": "string (e.g., '2024')",
                "office": number (square feet),
                "retail": number (square feet),
                "multifamily": number (square feet)
                }
            ],
            "nearbyProjects": [
                {
                "name": "string",
                "type": "string (e.g., 'Office', 'Retail', 'Multifamily')",
                "size": "string (e.g., '350,000 SF' or '220 units')",
                "completion": "string (e.g., 'Q2 2025')",
                "distance": "number (miles)"
                }
            ]
            }

            IMPORTANT:
            - All number fields must be actual numbers, not strings
            - Supply reasonable estimates if exact figures aren't provided
            - If development trends or market conditions are mentioned, use them to infer reasonable supply values
            - Include nearby projects that could logically exist in the area based on mentioned infrastructure, population trends, or economic indicators
            - For nearby projects, if exact completion dates aren't provided, estimate based on typical construction timelines for the area`,
        dataSchema: 'SupplyData interface structure'
    },

    landSales: {
        prompt: `You are a commercial real estate data extraction specialist with expertise in land sales and transaction analysis. Extract or infer detailed land sale comparable information from the document with precision.
            If exact transaction data is not explicitly stated in every field, use logical deduction and contextual clues to provide realistic estimates based on:
            1. Any comparable sales information present in the document
            2. Market trends and pricing patterns mentioned
            3. Related property transactions and their metrics
            4. Geographic location context and submarket specifics
            5. Property type and zoning considerations mentioned

            Extract information focusing on:
            - Recent land sale transactions with complete property details (address, location, transaction dates)
            - Sale prices with price per square foot (PSF) metrics
            - Market trend analysis including total dollar volume, average metrics, and transaction counts

            For any values not explicitly stated, provide reasonable estimates based on:
            - Similar transactions mentioned in the document
            - Regional pricing benchmarks suggested in the text
            - Pricing ratios between different property types or locations
            - Historical transaction data if referenced

            The response MUST match this exact structure:
            {
            "recentSales": [
                {
                "address": "string",
                "price": "string (with $ symbol)",
                "pricePSF": "string (with $ symbol)",
                "zoning": "string",
                "buyer": "string",
                "date": "string"
                }
            ],
            "marketTrends": {
                "averagePSF": "string (with $ symbol)",
                "salesVolume": "string (with $ symbol)",
                "numberOfTransactions": number
            }
            }

            IMPORTANT:
            - recentSales address must follow this format [Street Number] [Street Name], [City], [State Abbreviation or Full Name], [Country]
            - All transaction data must include the $ symbol for monetary values
            - Format all dates consistently (e.g., "Month YYYY" or "MM/DD/YYYY")
            - Calculate averages across transactions if possible
            - If specific transactions aren't labeled as "land sales" but context suggests they are land or development site transactions, include them
            - For market trends, calculate values based on the transactions you identify, or infer from market context
            - If the document mentions transactions without specific dates, place them in a logical chronological order based on contextual clues
            - Include at minimum 5 and maximum 7 transactions in the recentSales array if possible, using available data and reasonable inference
            - Zoning Definitions e.g 
                CX: Central Commercial
                High-density commercial development with residential allowed
                EX: Central Employment
                Mixed-use industrial, commercial and residential`,
        dataSchema: 'LandSaleData interface structure'
    },

    demographics: {
        prompt: `You are a demographic data analyst specializing in real estate market intelligence. Extract or infer detailed demographic information from the document with precision and completeness.
            If exact demographic data is not explicitly stated in every field, use logical deduction and contextual clues to provide realistic estimates based on:
            1. Any demographic statistics mentioned directly or indirectly in the document
            2. Regional demographic patterns suggested by the property's location
            3. Comparable market statistics for similar neighborhoods
            4. Economic indicators that correlate with demographic trends
            5. Household income figures, spending patterns, or affluence levels mentioned
            6. References to population density, consumer base, or residential characteristics

            Extract information focusing on:
            - Historical population data and projected growth patterns
            - Income statistics including median household income and growth rates
            - Employment breakdown by industry sectors relevant to the area
            - Educational attainment levels that characterize the local population

            For any values not explicitly stated, provide reasonable inferences based on:
            - Mentioned consumer spending power or household income metrics
            - References to population counts, density, or demographic characteristics
            - Descriptions of the local workforce, employment base, or industry presence
            - Mentions of educational institutions, professional demographics, or skill levels
            - Comparable neighborhood statistics if referenced

            The response MUST match this exact structure:
            {
            "population": [
                {
                "year": number,
                "count": number,
                "projected": boolean (optional)
                }
            ],
            "incomeStats": {
                "medianIncome": number,
                "growthRate": "string (with % symbol)"
            },
            "industryBreakdown": [
                {
                "name": "string",
                "value": number (percentage)
                }
            ],
            "educationLevels": [
                {
                "name": "string",
                "value": number (percentage)
                }
            ]
            }

            IMPORTANT:
            - Include at least 3 years of population data (past, present, and projected future)
            - All count and income values must be actual numbers without commas or currency symbols
            - Growth rates must include the % symbol
            - Industry breakdown percentages must sum to approximately 100%
            - Education level percentages must sum to approximately 100%
            - If the document mentions specific demographic traits (e.g., "affluent area" or "highly educated workforce"), ensure your numerical estimates reflect these characteristics
            - If specific neighborhoods or zip codes are mentioned, tailor your estimates to align with those specific areas rather than broader regional statistics
            - When the document references consumer spending, household counts, or population metrics, incorporate these into your demographic analysis`,
        dataSchema: 'DemographicData interface structure'
    },

    proximityInsights: {
        prompt: `You are a location intelligence specialist with expertise in urban logistics and commercial real estate accessibility analysis. Extract or infer detailed proximity information from the document with precision and relevance to the property.
            If exact location data is not explicitly stated in every field, use logical deduction and contextual clues to provide realistic estimates based on:
            1. Any mentioned distances, travel times, or accessibility features in the document
            2. Geographic references to nearby landmarks, neighborhoods, or infrastructure
            3. Statements about the property's strategic location or positioning
            4. References to transportation corridors, transit options, or connectivity advantages
            5. Mentions of nearby employers, commercial centers, or business districts
            6. Area characteristics that would logically influence walkability, transit, or bikeability

            Extract information focusing on:
            - All transportation infrastructure within reasonable proximity (airports, highways, rail, subway, bus, ports)
            - Walkability, transit accessibility, and bike-friendliness metrics
            - Major employers and commercial entities in the surrounding area
            - Urban amenities, services, and facilities that enhance the location's value

            For any values not explicitly stated, provide reasonable inferences based on:
            - The property's described location (urban core, suburban, waterfront, etc.)
            - References to accessibility, connectivity, or logistical advantages
            - Mentions of nearby business activity, corporate presence, or employment centers
            - Urban characteristics implied by the property's use and market positioning

            The response MUST match this exact structure:
            {
            "transportation": [
                {
                "type": "string",
                "distance": "string (with units)"
                }
            ],
            "scores": {
                "walkScore": number (0-100),
                "transitScore": number (0-100),
                "bikeScore": number (0-100)
            },
            "employers": [
                {
                "name": "string",
                "distance": "string (with units)"
                }
            ],
            "amenities": [
                {
                "name": "string",
                "distance": "string (with units)"
                }
            ]
            }

            IMPORTANT:
            - Include at least 5 transportation options with prioritization based on relevance to the property type
            - For urban properties, ensure walkability scores reflect neighborhood density and mixed-use characteristics
            - For industrial/logistics properties, emphasize proximity to highways, ports, and distribution infrastructure
            - Scores should realistically reflect the property's actual location context (urban cores typically 70+, suburban areas 30-60)
            - Include all specifically mentioned employers, plus logical major employers for the area based on location context
            - For amenities, include those relevant to the property type (retail/dining for office, logistics infrastructure for industrial)
            - All distances must include appropriate units (miles, feet, blocks)
            - If the document mentions travel times instead of distances, convert these to approximate distances using reasonable assumptions`,
        dataSchema: 'ProximityData interface structure'
    },

    zoningOverlays: {
        prompt: `You are an urban planning and zoning specialist with expertise in commercial real estate development regulations. Extract or infer detailed zoning information from the document with precision and regulatory accuracy.
            If exact zoning data is not explicitly stated in every field, use logical deduction and contextual clues to provide realistic estimates based on:
            1. Any direct or indirect references to zoning classification, land use, or development regulations
            2. Property characteristics that would indicate specific zoning categories (building type, height, density)
            3. Location context and typical zoning patterns for that area or neighborhood
            4. References to permitted uses, activities, or operations at the property
            5. Mentions of development constraints, entitlements, or regulatory considerations
            6. Property history, improvements, or future development potential

            Extract information focusing on:
            - Current zoning designation with Floor Area Ratio (FAR) and height restrictions
            - All permitted uses and specific prohibited uses or restrictions
            - Any overlay districts, special purpose districts, or zoning modifications
            - Special requirements, variances, conditions, or regulatory considerations

            For any values not explicitly stated, provide reasonable inferences based on:
            - The property's current use and physical characteristics
            - Building dimensions, lot coverage, or density metrics mentioned
            - References to similar properties and their zoning in the area
            - Typical zoning patterns for the property's location and use type
            - Any mentioned compliance issues, entitlements, or development potential

            The response MUST match this exact structure:
            {
            "current": {
                "designation": "string",
                "description": "string";
                "far": "string",
                "heightLimit": "string"
            },
            "allowedUses": ["string"],
            "overlayDistricts": ["string"],
            "specialRequirements": ["string"]
            }

            IMPORTANT:
            - Zoning designation should include both the code (e.g., "M1-1") and description (e.g., "Light Manufacturing")
            - Zoning description should with some breif about the project like what things this zone proivde, urban and intense area, all which variety of uses including  office, retail, institutional, and residential, with high building coverage and no required setbacks.
              did you what i mean of this
            - FAR should be expressed as a numerical ratio (e.g., "3.0") or range if applicable
            - Height limit should include units (feet or stories)
            - Include at least 3 allowed uses that align with the property's actual use and zoning designation
            - If industrial or logistics property, include relevant shipping, warehousing, and distribution uses
            - If the document mentions specific zoning limitations or requirements, prioritize these in your response
            - When inferring overlay districts, consider waterfront, historic, transit-oriented, or special economic zones based on location context
            - For special requirements, include any mentioned permit processes, environmental considerations, or unique regulatory factors`,
        dataSchema: 'ZoningData interface structure'
    },
    riskFactors: {
        prompt: `You are a real estate risk assessment specialist with deep expertise in commercial property investment analysis. Extract or infer detailed risk factors from the offering memorandum with precision and investment relevance.
            If exact risk information is not explicitly stated, use logical deduction and contextual clues to identify potential risks based on:
            1. Any mentioned challenges, limitations, or concerns in the document
            2. Property characteristics that could present investment risks
            3. Market conditions or trends that might impact future performance
            4. Tenant-specific risks or lease structure considerations
            5. Location-based risks (environmental, regulatory, demographic)
            6. Financing structure risks or capital markets considerations

            Extract information focusing on:
            - Clearly identified risk factors with descriptive titles
            - Detailed explanations of each risk's nature and potential impact
            - Assessment of risk severity based on likelihood and potential financial impact

            For any values not explicitly stated, provide reasonable inferences based on:
            - Property type and its typical risk profile
            - Tenant credit quality and lease structure
            - Market conditions described in the document
            - Regulatory environment and potential changes
            - Property age, condition, and capital requirements

            The response MUST match this exact structure:
            {
            "riskFactors": [
                {
                "title": "string",
                "description": "string",
                "severity": "string (high, medium, low) (don't use / it must be one only)"
                }
            ]
            }

            IMPORTANT:
            - Include at Maximun 3 distinct risk factors relevant to the property
            - Risk titles should be concise but descriptive
            - Risk descriptions should explain both the nature of the risk and its potential impact
            - Severity ratings must be "High," "Medium," or "Low" based on potential financial impact
            - Include both property-specific risks and broader market risks
            - Consider tenant concentration risk for single-tenant properties
            - Include capital markets and refinancing risk if relevant`,
        dataSchema:"RiskFactor interface structure"
    },
    submarket:{
        prompt:`You are a commercial real estate submarket specialist with expertise in metropolitan market segmentation. Extract or infer the precise submarket classification from the offering memorandum.
            If the exact submarket name is not explicitly stated, use logical deduction and contextual clues to determine the submarket based on:
            1. Any direct or indirect references to neighborhood, district, or submarket names
            2. Geographic descriptions, landmarks, or boundaries mentioned
            3. Comparable properties and their stated submarkets
            4. References to local infrastructure or development zones
            5. Proximity to major urban features or transportation corridors

            Extract information focusing on:
            - The specific named submarket where the property is located
            - Consistent use of official or industry-recognized submarket nomenclature

            For any values not explicitly stated, provide reasonable inferences based on:
            - The property's exact location coordinates or address
            - References to nearby neighborhoods or commercial districts
            - Local market terminology used in the document
            - Metropolitan hierarchy (CBD, urban core, suburban, etc.)

            The response MUST match this exact structure:
            {
            "submarket": "string"
            }

            IMPORTANT:
            - The submarket should be specific, not just the city name (e.g., "Red Hook, Brooklyn" not just "Brooklyn")
            - Use official broker-recognized submarket names when possible
            - Include relevant geographic qualifiers if needed (North, South, Central, etc.)
            - For industrial properties, reference the specific logistics/industrial submarket`,
        dataSchema: "Submarket interface structure"
    },
    propertyType:{
        prompt:`You are a commercial real estate classification specialist with expertise in property type taxonomy. Extract or infer the precise property type category from the offering memorandum.
            If the exact property type is not explicitly stated, use logical deduction and contextual clues to determine the property classification based on:
            1. Any direct or indirect references to the building's use, function, or design
            2. Physical characteristics described (clear heights, loading docks, etc.)
            3. Tenant activities or operations conducted at the property
            4. Comparable properties and their stated classifications
            5. Industry-specific terminology used to describe the property

            Extract information focusing on:
            - The specific standardized property type category
            - Appropriate level of specificity (e.g., "Last-Mile Logistics Facility" rather than just "Industrial")

            For any values not explicitly stated, provide reasonable inferences based on:
            - Building specifications and technical features mentioned
            - Tenant use descriptions and operational requirements
            - Location characteristics typical for certain property types
            - Market positioning and comparables referenced

            The response MUST match this exact structure:
            {
            "propertyType": "string"
            }

            IMPORTANT:
            - Use industry-standard property type classifications
            - Be as specific as possible while remaining accurate
            - For industrial properties, specify the appropriate subtype (distribution center, manufacturing, flex, last-mile, etc.)
            - For mixed-use properties, identify the predominant use`,
        dataSchema: "PropertyType interface structure"
    },
    propertyName:{
        prompt:`You are a commercial real estate identification specialist with expertise in property naming conventions. Extract or infer the precise property name from the offering memorandum.
            If the exact property name is not explicitly stated, use logical deduction and contextual clues to determine the property name based on:
            1. Any direct references to the property's branded or marketing name
            2. The property address or street number used as identification
            3. Project names or development identifiers
            4. References to how the property is known in the market
            5. Naming conventions used for similar properties

            Extract information focusing on:
            - The official or marketed name of the property
            - Consistent use of the property's identity throughout the document

            For any values not explicitly stated, provide reasonable inferences based on:
            - Address-based naming conventions (street number + street name)
            - Tenant-based naming if single-tenant (e.g., "Amazon Logistics Center at Richards")
            - Development or project names referenced
            - How the property is primarily identified in the offering materials

            The response MUST match this exact structure:
            {
            "propertyName": "string"
            }

            IMPORTANT:
            - Include any branded elements of the name (numbers, proper nouns, etc.)
            - If the property is consistently referred to by its address, use that formatted appropriately
            - For newly developed properties, include development project names if applicable
            - If multiple names are used, prioritize the most prominently featured name`,
        dataSchema: "PropertyName interface structure"
    },
};