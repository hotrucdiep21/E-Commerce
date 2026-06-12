export const geocodeAddress = async (address) => {
    try {
        if (!address || address === "Not Provided") {
            return null;
        }

        // Clean up the address string (e.g. remove ", Phone: 0987372123, Postal: 00084")
        // because OpenStreetMap will fail if the address contains extra phone/postal strings
        const cleanAddress = address.split(', Phone:')[0].trim();

        // OpenStreetMap Nominatim API requires a valid User-Agent
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanAddress)}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'ECommerceThesisApp/1.0'
            }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};
