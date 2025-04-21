import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
});

interface SearchResult {
  title: string;
  url: string;
  description: string;
  source: 'government' | 'realEstate' | 'forum' | 'other';
  relevanceScore: number;
}

interface SearchConfig {
  maxResults?: number;
  searchTypes?: ('government' | 'realEstate' | 'forum' | 'other')[];
}

export async function searchLocationInfo(
  propertyInfo: {
    address?: string;
    location?: string;
    zoning?: string;
  }, 
  config: SearchConfig = { maxResults: 10 }
): Promise<SearchResult[]> {
  try {
    const searchPrompt = `
    Search for relevant information about this property:
    Address/Location: ${propertyInfo.address || propertyInfo.location}
    Zoning: ${propertyInfo.zoning}
    
    Find ${config.searchTypes ? config.searchTypes.join(', ') : 'government resources, real estate forums, and local development information'}.
    Focus on:
    1. Official zoning documents and regulations
    2. Property records and permits
    3. Local development plans
    4. Real estate market analysis
    5. Community discussions about development
    5. We only want 3 search only
    
    Format results as JSON array with structure:
    {
      "results": [{
        "title": string,
        "url": string,
        "description": string,
        "source": "government|realEstate|forum|other",
        "relevanceScore": number (0-1)
      }]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [searchPrompt],
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    // Parse the results and any search metadata
    try {
      const results: SearchResult[] = [];
      
      // Try to parse direct JSON response
      try {
        let parsedData;
        const responseText = response.text;
        // const jsonResponse = typeof responseText === 'string' ? JSON.parse(responseText) : null;
        const jsonMatch = responseText.match(/```json\n?(.*)\n?```/s) || responseText.match(/{[\s\S]*}/);
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
        parsedData = JSON.parse(jsonStr.trim());
        if (parsedData?.results) {
          results.push(...parsedData.results);
        }
      } catch (e) {
        console.log('Response was not in JSON format, checking search metadata');
      }

      // Check search metadata if available
      const searchContent = response.candidates?.[0]?.groundingMetadata?.searchEntryPoint?.renderedContent;
      if (searchContent && typeof searchContent === 'object') {
        // Process each search result into our format
        Object.values(searchContent).forEach((result: any) => {
          if (result && typeof result === 'object') {
            results.push({
              title: result.title || 'Unknown Title',
              url: result.url || '#',
              description: result.snippet || result.description || '',
              source: determineSource(result.url || ''),
              relevanceScore: 0.8 // Default high score for direct search results
            });
          }
        });
      }

      return results
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, config.maxResults);

    } catch (e) {
      console.error('Failed to parse search results:', e);
      return [];
    }

  } catch (error) {
    console.error('Error searching location info:', error);
    return [];
  }
}

function determineSource(url: string): 'government' | 'realEstate' | 'forum' | 'other' {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('.gov') || urlLower.includes('government')) {
    return 'government';
  }
  if (urlLower.includes('zillow') || urlLower.includes('realtor') || urlLower.includes('redfin')) {
    return 'realEstate';
  }
  if (urlLower.includes('forum') || urlLower.includes('discuss') || urlLower.includes('community')) {
    return 'forum';
  }
  return 'other';
}