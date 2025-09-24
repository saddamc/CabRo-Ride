import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ILocation } from '@/redux/features/ride/ride.api';
import { LocateFixed, MapPin, Navigation } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface LocationSearchProps {
  pickupLocation: ILocation | null;
  dropoffLocation: ILocation | null;
  pickupInput: string;
  destinationInput: string;
  onPickupInputChange: (value: string) => void;
  onDestinationInputChange: (value: string) => void;
  onPickupSelect: (location: ILocation) => void;
  onDestinationSelect: (location: ILocation) => void;
  onGetCurrentLocation: (isPickup: boolean) => void;
  onSeeDetails: () => void;
  showSeeDetails: boolean;
  userRole?: string;
}

export default function LocationSearch({
  pickupLocation: _pickupLocation, // eslint-disable-line @typescript-eslint/no-unused-vars
  dropoffLocation: _dropoffLocation, // eslint-disable-line @typescript-eslint/no-unused-vars
  pickupInput,
  destinationInput,
  onPickupInputChange,
  onDestinationInputChange,
  onPickupSelect,
  onDestinationSelect,
  onGetCurrentLocation,
  onSeeDetails,
  showSeeDetails,
  userRole
}: LocationSearchProps) {
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  // State for dropdown suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState<Array<{name: string, address: string, coords: [number, number]}>>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{name: string, address: string, coords: [number, number]}>>([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [pickupSelectedIndex, setPickupSelectedIndex] = useState(-1);
  const [destinationSelectedIndex, setDestinationSelectedIndex] = useState(-1);

  // Enhanced location suggestions for Dhaka - expanded database
  const dhakaLocations: Array<{
    name: string;
    address: string;
    coords: [number, number];
  }> = [
    // Popular residential areas
    { name: "Dhanmondi", address: "Dhanmondi, Dhaka", coords: [90.3742, 23.7461] },
    { name: "Gulshan", address: "Gulshan, Dhaka", coords: [90.4152, 23.7925] },
    { name: "Banani", address: "Banani, Dhaka", coords: [90.4066, 23.7937] },
    { name: "Uttara", address: "Uttara, Dhaka", coords: [90.3984, 23.8759] },
    { name: "Mirpur", address: "Mirpur, Dhaka", coords: [90.3654, 23.8223] },
    { name: "Mohammadpur", address: "Mohammadpur, Dhaka", coords: [90.3563, 23.7574] },
    { name: "Shahbag", address: "Shahbag, Dhaka", coords: [90.3944, 23.7387] },
    { name: "Lalmatia", address: "Lalmatia, Dhaka", coords: [90.3724, 23.7541] },
    { name: "Azimpur", address: "Azimpur, Dhaka", coords: [90.3854, 23.7273] },
    { name: "Badda", address: "Badda, Dhaka", coords: [90.4289, 23.7809] },

    // Commercial areas and landmarks
    { name: "Motijheel", address: "Motijheel Commercial Area, Dhaka", coords: [90.4175, 23.7289] },
    { name: "Old Dhaka", address: "Old City, Dhaka", coords: [90.4040, 23.7073] },
    { name: "Bashundhara City", address: "Bashundhara City Shopping Mall, Dhaka", coords: [90.4300, 23.7500] },
    { name: "Jamuna Future Park", address: "Jamuna Future Park, Dhaka", coords: [90.4332, 23.8103] },
    { name: "Wari", address: "Wari, Dhaka", coords: [90.4136, 23.7167] },
    { name: "Sadarghat", address: "Sadarghat Launch Terminal, Dhaka", coords: [90.4136, 23.7000] },

    // Educational institutions
    { name: "University of Dhaka", address: "University of Dhaka, Dhaka", coords: [90.3994, 23.7268] },
    { name: "Dhaka University", address: "Dhaka University Campus, Dhaka", coords: [90.3994, 23.7268] },
    { name: "BUET", address: "Bangladesh University of Engineering & Technology, Dhaka", coords: [90.4074, 23.7268] },
    { name: "North South University", address: "North South University, Dhaka", coords: [90.3984, 23.8151] },
    { name: "BRAC University", address: "BRAC University, Dhaka", coords: [90.4074, 23.7809] },

    // Hospitals and medical centers
    { name: "Apollo Hospital", address: "Apollo Hospital Dhaka, Dhaka", coords: [90.4142, 23.8042] },
    { name: "Square Hospital", address: "Square Hospital, Dhaka", coords: [90.4142, 23.8042] },
    { name: "United Hospital", address: "United Hospital, Dhaka", coords: [90.4142, 23.8042] },
    { name: "Dhaka Medical College", address: "Dhaka Medical College Hospital, Dhaka", coords: [90.3886, 23.7250] },

    // Transportation hubs
    { name: "Dhaka Airport", address: "Hazrat Shahjalal International Airport, Dhaka", coords: [90.3978, 23.8433] },
    { name: "Gabtoli Bus Terminal", address: "Gabtoli Bus Terminal, Dhaka", coords: [90.3450, 23.7800] },
    { name: "Saydabad Bus Terminal", address: "Saydabad Bus Terminal, Dhaka", coords: [90.4000, 23.7167] },
    { name: "Kamalapur Railway Station", address: "Kamalapur Railway Station, Dhaka", coords: [90.4294, 23.7268] },

    // Parks and recreational areas
    { name: "Ramna Park", address: "Ramna Park, Dhaka", coords: [90.3994, 23.7333] },
    { name: "Suhrawardy Udyan", address: "Suhrawardy Udyan, Dhaka", coords: [90.3994, 23.7333] },
    { name: "Dhaka Zoo", address: "Dhaka Zoo, Dhaka", coords: [90.3925, 23.8125] },
    { name: "Fantasy Kingdom", address: "Fantasy Kingdom, Dhaka", coords: [90.4200, 23.8200] },

    // More residential areas
    { name: "Tejgaon", address: "Tejgaon, Dhaka", coords: [90.3854, 23.7625] },
    { name: "Farmgate", address: "Farmgate, Dhaka", coords: [90.3875, 23.7569] },
    { name: "Panthapath", address: "Panthapath, Dhaka", coords: [90.3825, 23.7500] },
    { name: "Kawran Bazar", address: "Kawran Bazar, Dhaka", coords: [90.3944, 23.7500] },
    { name: "New Market", address: "New Market, Dhaka", coords: [90.3800, 23.7333] },
    { name: "Elephant Road", address: "Elephant Road, Dhaka", coords: [90.3854, 23.7333] },
    { name: "Hatirjheel", address: "Hatirjheel, Dhaka", coords: [90.4225, 23.7809] },
    { name: "Kuril", address: "Kuril, Dhaka", coords: [90.4200, 23.8200] },
    { name: "Khilkhet", address: "Khilkhet, Dhaka", coords: [90.3200, 23.8300] },
    { name: "Savar", address: "Savar, Dhaka", coords: [90.2667, 23.8500] }
  ];

  // Filter locations based on input
  const filterLocations = (input: string) => {
    if (input.length < 1) return [];
    return dhakaLocations.filter(loc =>
      loc.name.toLowerCase().includes(input.toLowerCase()) ||
      loc.address.toLowerCase().includes(input.toLowerCase())
    );
  };

  // Handle input changes with real-time filtering
  const handlePickupInputChange = (value: string) => {
    onPickupInputChange(value);
    const filtered = filterLocations(value);
    setPickupSuggestions(filtered);
    setShowPickupDropdown(filtered.length > 0 && value.length > 0);
    setPickupSelectedIndex(-1);
  };

  const handleDestinationInputChange = (value: string) => {
    onDestinationInputChange(value);
    const filtered = filterLocations(value);
    setDestinationSuggestions(filtered);
    setShowDestinationDropdown(filtered.length > 0 && value.length > 0);
    setDestinationSelectedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: {name: string, address: string, coords: [number, number]}, isPickup: boolean) => {
    console.log('Suggestion selected:', suggestion, 'isPickup:', isPickup);

    const locationData: ILocation = {
      id: `suggestion-${Date.now()}`,
      name: suggestion.name,
      address: suggestion.address,
      coordinates: suggestion.coords,
      type: 'suggestion'
    };

    if (isPickup) {
      console.log('Setting pickup location:', locationData);
      onPickupSelect(locationData);
      onPickupInputChange(suggestion.name);
      setShowPickupDropdown(false);
      setPickupSelectedIndex(-1);
    } else {
      console.log('Setting destination location:', locationData);
      onDestinationSelect(locationData);
      onDestinationInputChange(suggestion.name);
      setShowDestinationDropdown(false);
      setDestinationSelectedIndex(-1);
    }
  };


  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, suggestions: Array<{name: string, address: string, coords: [number, number]}>, isPickup: boolean) => {
    if (!suggestions.length) return;

    const currentIndex = isPickup ? pickupSelectedIndex : destinationSelectedIndex;
    const setIndex = isPickup ? setPickupSelectedIndex : setDestinationSelectedIndex;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[currentIndex], isPickup);
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (isPickup) {
          setShowPickupDropdown(false);
          setPickupSelectedIndex(-1);
        } else {
          setShowDestinationDropdown(false);
          setDestinationSelectedIndex(-1);
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside pickup container
      const pickupContainer = pickupInputRef.current?.parentElement;
      if (pickupContainer && !pickupContainer.contains(event.target as Node)) {
        setShowPickupDropdown(false);
        setPickupSelectedIndex(-1);
      }

      // Check if click is outside destination container
      const destinationContainer = destinationInputRef.current?.parentElement;
      if (destinationContainer && !destinationContainer.contains(event.target as Node)) {
        setShowDestinationDropdown(false);
        setDestinationSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-4 bg-white border-b sticky top-0 z-10 flex flex-col gap-4">
      {/* Pickup location input */}
      <div className="flex items-center relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600 pointer-events-none" />
        <div className="relative">
          <Input
            ref={pickupInputRef}
            type="text"
            placeholder="Enter pickup location (e.g., Dhanmondi, Gulshan)"
            value={pickupInput}
            onChange={e => handlePickupInputChange(e.target.value)}
            onKeyDown={e => handleKeyDown(e, pickupSuggestions, true)}
            className="pl-11 text-base h-12 border-2 border-gray-200 focus:border-green-400"
          />
          {showPickupDropdown && pickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] max-h-60 overflow-y-auto pointer-events-auto">
              {pickupSuggestions.slice(0, 6).map((suggestion, index) => (
                <div
                  key={suggestion.name}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    index === pickupSelectedIndex ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={(e) => {
                    console.log('Pickup suggestion clicked:', suggestion.name);
                    e.preventDefault();
                    e.stopPropagation();
                    handleSuggestionSelect(suggestion, true);
                  }}
                  onMouseDown={(e) => {
                    // Prevent blur event from firing before click
                    e.preventDefault();
                  }}
                >
                  <div className="font-medium text-gray-900">{suggestion.name}</div>
                  <div className="text-sm text-gray-600">{suggestion.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-md text-gray-500 hover:text-green-600 hover:border-green-400 transition-colors p-2 disabled:opacity-50 shadow-sm"
          onClick={() => onGetCurrentLocation(true)}
          tabIndex={-1}
          aria-label="Use current location"
        >
          <LocateFixed size={20} />
        </button>
      </div>

      {/* Popular locations hint */}
      <div className="text-xs text-gray-500 text-center">
        Popular areas: Dhanmondi, Gulshan, Banani, Uttara, Mirpur, Mohammadpur
      </div>

      {/* Destination location input and See Details button */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center relative">
          <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500 pointer-events-none" />
          <div className="relative w-full">
            <Input
              ref={destinationInputRef}
              type="text"
              placeholder="Enter destination (e.g., Bashundhara City, Shahbag)"
              value={destinationInput}
              onChange={e => handleDestinationInputChange(e.target.value)}
              onKeyDown={e => handleKeyDown(e, destinationSuggestions, false)}
              className="pl-11 pr-12 text-base h-12 border-2 border-gray-200 focus:border-red-400"
            />
            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[200] max-h-60 overflow-y-auto pointer-events-auto">
                {destinationSuggestions.slice(0, 6).map((suggestion, index) => (
                  <div
                    key={suggestion.name}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                      index === destinationSelectedIndex ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={(e) => {
                      console.log('Destination suggestion clicked:', suggestion.name);
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionSelect(suggestion, false);
                    }}
                    onMouseDown={(e) => {
                      // Prevent blur event from firing before click
                      e.preventDefault();
                    }}
                  >
                    <div className="font-medium text-gray-900">{suggestion.name}</div>
                    <div className="text-sm text-gray-600">{suggestion.address}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-md text-gray-500 hover:text-red-600 hover:border-red-400 transition-colors p-2 shadow-sm"
            onClick={() => onGetCurrentLocation(false)}
            tabIndex={-1}
            aria-label="Use current location for destination"
          >
            <LocateFixed size={20} />
          </button>
        </div>

        {/* See Details button directly under destination input */}
        {showSeeDetails && (
          <Button
            onClick={onSeeDetails}
            disabled={userRole === 'driver'}
            className={`w-full h-12 font-semibold text-base shadow-lg transition-all duration-200 ${
              userRole === 'driver'
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl'
            }`}
          >
            {userRole === 'driver' ? '🚫 Booking Not Available for Drivers' : '🚗 See Route & Details'}
          </Button>
        )}
      </div>

      {/* Location search tips */}
      {/* <div className="text-xs text-gray-400 text-center space-y-1">

      </div> */}
    </div>
  );
}