// Helper to calculate distance between two coordinates in km using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

// 1. K-Means Clustering for Orders
export const clusterOrders = (orders, maxOrdersPerCluster = 20) => {
    if (!orders || orders.length === 0) return [];

    const numOrders = orders.length;
    // Calculate required number of clusters K based on capacity
    const k = Math.max(1, Math.ceil(numOrders / maxOrdersPerCluster));

    // Initialize k centroids randomly from the existing order locations
    let centroids = [];
    let usedIndices = new Set();
    while (centroids.length < k && centroids.length < numOrders) {
        let randomIndex = Math.floor(Math.random() * numOrders);
        if (!usedIndices.has(randomIndex)) {
            centroids.push({ ...orders[randomIndex].location });
            usedIndices.add(randomIndex);
        }
    }

    let clusters = Array.from({ length: k }, () => []);
    let iterations = 0;
    const maxIterations = 50;
    let changed = true;

    while (changed && iterations < maxIterations) {
        changed = false;
        clusters = Array.from({ length: k }, () => []);

        // Assignment step: assign each order to the nearest centroid
        // *Basic implementation: doesn't strictly enforce max capacity during iteration, 
        // we'll balance it afterwards if needed for simplicity
        orders.forEach(order => {
            let minDistance = Infinity;
            let closestCentroidIndex = 0;
            
            centroids.forEach((centroid, index) => {
                const dist = calculateDistance(order.location.lat, order.location.lng, centroid.lat, centroid.lng);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestCentroidIndex = index;
                }
            });
            clusters[closestCentroidIndex].push(order);
        });

        // Rebalancing step (Capacitated constraint)
        let overloadedClusters = [];
        let underloadedClusters = [];
        clusters.forEach((cluster, i) => {
            if (cluster.length > maxOrdersPerCluster) overloadedClusters.push(i);
            if (cluster.length < maxOrdersPerCluster) underloadedClusters.push(i);
        });

        for (let overIndex of overloadedClusters) {
            while (clusters[overIndex].length > maxOrdersPerCluster) {
                // Find order furthest from its centroid
                let furthestOrderIdx = -1;
                let maxDist = -1;
                clusters[overIndex].forEach((order, idx) => {
                    const dist = calculateDistance(order.location.lat, order.location.lng, centroids[overIndex].lat, centroids[overIndex].lng);
                    if (dist > maxDist) {
                        maxDist = dist;
                        furthestOrderIdx = idx;
                    }
                });

                const orderToMove = clusters[overIndex].splice(furthestOrderIdx, 1)[0];
                
                // Move to the nearest underloaded cluster
                let nearestUnderloadedIdx = underloadedClusters[0] || overIndex;
                let minDist = Infinity;
                underloadedClusters.forEach(underIndex => {
                    if (clusters[underIndex].length < maxOrdersPerCluster) {
                        const dist = calculateDistance(orderToMove.location.lat, orderToMove.location.lng, centroids[underIndex].lat, centroids[underIndex].lng);
                        if (dist < minDist) {
                            minDist = dist;
                            nearestUnderloadedIdx = underIndex;
                        }
                    }
                });
                clusters[nearestUnderloadedIdx].push(orderToMove);
            }
        }


        // Update centroids step
        const newCentroids = clusters.map(cluster => {
            if (cluster.length === 0) return { lat: 0, lng: 0 }; // Should not happen often
            let sumLat = 0;
            let sumLng = 0;
            cluster.forEach(order => {
                sumLat += order.location.lat;
                sumLng += order.location.lng;
            });
            return {
                lat: sumLat / cluster.length,
                lng: sumLng / cluster.length
            };
        });

        // Check if centroids moved
        for (let i = 0; i < k; i++) {
            if (centroids[i] && newCentroids[i]) {
                const dist = calculateDistance(centroids[i].lat, centroids[i].lng, newCentroids[i].lat, newCentroids[i].lng);
                if (dist > 0.001) { // Threshold for convergence
                    changed = true;
                }
            }
        }
        centroids = newCentroids;
        iterations++;
    }

    return clusters.filter(c => c.length > 0);
}

// 2. Nearest Neighbor TSP Routing
export const calculateShortestPath = (warehouseLocation, ordersInCluster) => {
    let unvisited = [...ordersInCluster];
    let route = [];
    let currentLocation = warehouseLocation;
    let totalDistance = 0;

    while (unvisited.length > 0) {
        let nearestIdx = -1;
        let minDistance = Infinity;

        unvisited.forEach((order, index) => {
            const dist = calculateDistance(currentLocation.lat, currentLocation.lng, order.location.lat, order.location.lng);
            if (dist < minDistance) {
                minDistance = dist;
                nearestIdx = index;
            }
        });

        const nearestOrder = unvisited.splice(nearestIdx, 1)[0];
        route.push(nearestOrder);
        totalDistance += minDistance;
        currentLocation = nearestOrder.location;
    }

    // Optional: add distance to return to warehouse
    const returnDistance = calculateDistance(currentLocation.lat, currentLocation.lng, warehouseLocation.lat, warehouseLocation.lng);
    totalDistance += returnDistance;

    return {
        route,
        totalDistance: totalDistance.toFixed(2)
    };
}
