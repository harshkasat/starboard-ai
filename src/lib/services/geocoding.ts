// Rate limit helper to ensure we don't exceed API limits
const queue: Array<() => Promise<any>> = [];
let lastRequestTime = 0;
const MIN_REQUEST_DELAY = 2000; // Increased to 1 second between requests

interface GeocodingResult {
  lat: number;
  lng: number;
  success: boolean;
}

// Default to Portland coordinates if geocoding fails
// const DEFAULT_COORDINATES = {
//   lat: 45.523064,
//   lng: -122.676483
// };

interface MapsCoResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult> {
  return new Promise((resolve) => {
    queue.push(async () => {
      try {
        const apiKey = import.meta.env.VITE_GEOCODING_API_KEY;
        const encodedAddress = encodeURIComponent(address);        
        const response = await fetch(`https://geocode.maps.co/search?q=${encodedAddress}&api_key=${apiKey}`);
        if (!response.ok) {
          throw new Error(`Geocoding request failed: ${response.text}`);
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
          console.log(`Geocoding success for ${address}:`, {
            lat: data[0].lat,
            lon: data[0].lon,
            display_name: data[0].display_name
          });
          resolve({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            success: true
          });
        } else {
          return resolve({
            lat: 0,
            lng: 0,
            success: false
          });
          console.warn(`No results found for address: ${address}`);
          // Simply return default coordinates if no results found
        //   resolve({
        //     ...DEFAULT_COORDINATES,
        //     success: false
        //   });
        }
      } catch (error) {
        console.error(`Geocoding error for ${address}:`, error);
        return resolve({
            lat:0,
            lng:0,
            success: false
        })
        // Fallback to default coordinates
        // resolve({
        //   ...DEFAULT_COORDINATES,
        //   success: false
        // });
      }
    });
    
    processQueue();
  });
}

async function processQueue() {
  if (!queue.length) return;

  while (queue.length > 0) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_DELAY) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_DELAY - timeSinceLastRequest));
    }
    
    const nextRequest = queue.shift();
    if (nextRequest) {
      lastRequestTime = Date.now();
      try {
        await nextRequest();
      } catch (error) {
        console.error('Error processing queue request:', error);
      }
      // Ensure we wait between requests even if there was an error
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_DELAY));
    }
  }
}