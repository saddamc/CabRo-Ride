import { cn } from '@/lib/utils';
import type { IDriver, ILocation } from '@/redux/features/rides/ride.api';
import { Icon, LatLng, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';

interface MapViewProps {
  pickupLocation: ILocation | null;
  dropoffLocation: ILocation | null;
  matchedDriver: IDriver | null;
  mapCenter: [number, number];
  bookingPhase: string;
  isExpanded?: boolean;
}

// Enhanced custom icons with better styling
const createCustomIcon = (iconUrl: string, className: string = '') => {
  return new Icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: `custom-marker ${className}`,
  });
};

const pickupIcon = createCustomIcon('/pickup-marker.png', 'pickup-marker');
const dropoffIcon = createCustomIcon('/dropoff-marker.png', 'dropoff-marker');
const driverIcon = createCustomIcon('/driver-marker.png', 'driver-marker');

// Component to handle map centering and route display
function MapController({
  pickupLocation,
  dropoffLocation,
  mapCenter
}: {
  pickupLocation: ILocation | null;
  dropoffLocation: ILocation | null;
  mapCenter: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      // Create bounds that include both pickup and dropoff points
      const bounds = new LatLngBounds([
        [pickupLocation.coordinates[1], pickupLocation.coordinates[0]],
        [dropoffLocation.coordinates[1], dropoffLocation.coordinates[0]]
      ]);

      // Fit map to show both points with padding
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
        animate: true
      });
    } else if (mapCenter) {
      // Center on mapCenter if no route to show
      map.setView(mapCenter, 14, { animate: true });
    }
  }, [map, pickupLocation, dropoffLocation, mapCenter]);

  return null;
}

// Component for route visualization
function RouteLine({
  pickupLocation,
  dropoffLocation
}: {
  pickupLocation: ILocation | null;
  dropoffLocation: ILocation | null;
}) {
  const routePoints = useMemo(() => {
    if (!pickupLocation || !dropoffLocation) return [];

    // Create a curved route line between points
    const start = new LatLng(pickupLocation.coordinates[1], pickupLocation.coordinates[0]);
    const end = new LatLng(dropoffLocation.coordinates[1], dropoffLocation.coordinates[0]);

    // Simple straight line for now - could be enhanced with routing API later
    return [start, end];
  }, [pickupLocation, dropoffLocation]);

  if (routePoints.length < 2) return null;

  return (
    <Polyline
      positions={routePoints}
      pathOptions={{
        color: '#3B82F6',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10',
      }}
    />
  );
}

export default function MapView({
  pickupLocation,
  dropoffLocation,
  matchedDriver,
  mapCenter,
  bookingPhase,
  isExpanded = false
}: MapViewProps) {
  // Enhanced map center calculation
  const calculatedCenter: [number, number] = useMemo(() => {
    if (pickupLocation) {
      return [pickupLocation.coordinates[1], pickupLocation.coordinates[0]];
    }
    return mapCenter;
  }, [pickupLocation, mapCenter]);

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out bg-white rounded-lg overflow-hidden shadow-sm w-full",
      isExpanded ? "flex-grow min-h-[500px]" : "h-full min-h-[400px]"
    )}>
      <MapContainer
        center={calculatedCenter}
        zoom={14}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "8px"
        }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        className="map-container"
      >
        {/* Tile layer with better styling */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Map controller for centering and bounds */}
        <MapController
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          mapCenter={mapCenter}
        />

        {/* Route visualization */}
        {pickupLocation && dropoffLocation && (
          <RouteLine pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
        )}

        {/* Pickup location marker */}
        {pickupLocation && (
          <Marker
            position={[pickupLocation.coordinates[1], pickupLocation.coordinates[0]]}
            icon={pickupIcon}
          >
            <Popup className="custom-popup">
              <div className="text-sm">
                <div className="font-semibold text-green-600 flex items-center gap-1">
                  📍 Pickup Location
                </div>
                <div className="text-gray-600 mt-1">{pickupLocation.name}</div>
                <div className="text-xs text-gray-500 mt-1">{pickupLocation.address}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dropoff location marker */}
        {dropoffLocation && (
          <Marker
            position={[dropoffLocation.coordinates[1], dropoffLocation.coordinates[0]]}
            icon={dropoffIcon}
          >
            <Popup className="custom-popup">
              <div className="text-sm">
                <div className="font-semibold text-red-600 flex items-center gap-1">
                  🎯 Dropoff Location
                </div>
                <div className="text-gray-600 mt-1">{dropoffLocation.name}</div>
                <div className="text-xs text-gray-500 mt-1">{dropoffLocation.address}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Driver location marker */}
        {matchedDriver && bookingPhase !== 'completed' && (
          <Marker
            position={[
              matchedDriver.currentLocation.coordinates[1],
              matchedDriver.currentLocation.coordinates[0]
            ]}
            icon={driverIcon}
          >
            <Popup className="custom-popup">
              <div className="text-sm">
                <div className="font-semibold text-blue-600 flex items-center gap-1">
                  🚗 {matchedDriver.name}
                </div>
                <div className="text-gray-600 mt-1">
                  ⭐ {matchedDriver.rating} • {matchedDriver.vehicleInfo.make} {matchedDriver.vehicleInfo.model}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {matchedDriver.vehicleInfo.licensePlate}
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

    </div>
  );
}