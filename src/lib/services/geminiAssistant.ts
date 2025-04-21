import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { SECTION_EXTRACTORS } from '@/lib/services/prompts/analysisPrompts';
import { validateSectionData } from '@/lib/utils/validationUtils';

const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export class AIValidationError extends Error {
  constructor(public errors: { field: string; message: string }[], message: string) {
    super(message);
    this.name = 'AIValidationError';
  }
}

export async function processFileWithGemini(fileBuffer: ArrayBuffer, section: keyof typeof SECTION_EXTRACTORS) {
  try {
    // Convert PDF to base64
    const base64Data = arrayBufferToBase64(fileBuffer);

    // Create the model instance
    const model = gemini.getGenerativeModel({ 
      model: "gemini-2.5-flash-preview-04-17",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
      generationConfig : {
        temperature: 2.0
      }
      
    });

    // Prepare a more structured prompt to ensure exact schema matching
    const prompt = `You are a real estate data extraction expert. Please analyze this PDF and extract ${section} information.
    
    YOUR RESPONSE MUST BE VALID JSON AND EXACTLY MATCH THIS STRUCTURE - NO ADDITIONAL TEXT OR FORMATTING:

    ${SECTION_EXTRACTORS[section].prompt}

    IMPORTANT REQUIREMENTS:
    1. Return ONLY the JSON object, no other text
    2. All number fields must be actual numbers, not strings (except for formatted prices)
    3. Use consistent formatting:
       - Prices must include $ symbol
       - Distances must include units (miles)
       - Dates should be in consistent format
       - Percentages must include % symbol
    4. Arrays must have at least one item
    5. If specific data is missing, infer values using logical deduction from the document 
    (e.g., "Amazon logistics facility completed in 2022" = industrial-type supply in 2022).
    6. Do not return empty arrays—include at least one item per array, even if some values must be estimated from context.

    Text to analyze:`;

    // Generate content with the proper structure
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf"
        }
      },
      prompt
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Parse and validate the response
    let parsedData;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\n?(.*)\n?```/s) || text.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
      parsedData = JSON.parse(jsonStr.trim());
    } catch (e) {
      throw new AIValidationError(
        [{ field: 'format', message: 'AI response was not valid JSON' }],
        'Failed to parse AI response as JSON'
      );
    }

    // Validate the parsed data against our schema
    const validation = validateSectionData(section, parsedData);
    if (!validation.isValid) {
      throw new AIValidationError(
        validation.errors,
        'AI response did not match required schema'
      );
    }

    return {
      text: JSON.stringify(parsedData),
      confidence: 0.95,
      // metadata: {
      //   model: 'gemini-2.0-flash',
      //   section,
      //   processingTimestamp: new Date().toISOString()
      // }
    };

  } catch (error) {
    console.error('Error processing file with Gemini:', error);
    if (error instanceof AIValidationError) {
      throw error; // Re-throw validation errors to be handled by the UI
    }
    throw error;
  }
}