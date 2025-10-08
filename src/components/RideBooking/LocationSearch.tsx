import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { role } from "@/constants/role";
import { dhakaLocations } from "@/data/dhakaLocations";
import type { ILocation } from "@/redux/features/rides/ride.api";


import { Car, LocateFixed, MapPin, Navigation } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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
  userRole?: string;
}

export default function LocationSearch({
  pickupLocation,
  dropoffLocation,
  pickupInput,
  destinationInput,
  onPickupInputChange,
  onDestinationInputChange,
  onPickupSelect,
  onDestinationSelect,
  onGetCurrentLocation,
  onSeeDetails,
  userRole,
}: LocationSearchProps) {
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  // State for dropdown suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState<
    Array<{ name: string; address: string; coords: [number, number] }>
  >([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    Array<{ name: string; address: string; coords: [number, number] }>
  >([]);
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [pickupSelectedIndex, setPickupSelectedIndex] = useState(-1);
  const [destinationSelectedIndex, setDestinationSelectedIndex] = useState(-1);

  // Using the enhanced locations from the external file

  // Filter locations based on input using the imported dhakaLocations
  const filterLocations = (input: string) => {
    if (input.length < 1) return [];
    return dhakaLocations.filter(
      (loc) =>
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
  const handleSuggestionSelect = (
    suggestion: { name: string; address: string; coords: [number, number] },
    isPickup: boolean
  ) => {
    console.log("Suggestion selected:", suggestion, "isPickup:", isPickup);

    const locationData: ILocation = {
      id: `suggestion-${Date.now()}`,
      name: suggestion.name,
      address: suggestion.address,
      coordinates: suggestion.coords,
      type: "suggestion",
    };

    if (isPickup) {
      console.log("Setting pickup location:", locationData);
      onPickupSelect(locationData);
      onPickupInputChange(suggestion.name);
      setShowPickupDropdown(false);
      setPickupSelectedIndex(-1);
    } else {
      console.log("Setting destination location:", locationData);
      onDestinationSelect(locationData);
      onDestinationInputChange(suggestion.name);
      setShowDestinationDropdown(false);
      setDestinationSelectedIndex(-1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (
    e: React.KeyboardEvent,
    suggestions: Array<{
      name: string;
      address: string;
      coords: [number, number];
    }>,
    isPickup: boolean
  ) => {
    if (!suggestions.length) return;

    const currentIndex = isPickup
      ? pickupSelectedIndex
      : destinationSelectedIndex;
    const setIndex = isPickup
      ? setPickupSelectedIndex
      : setDestinationSelectedIndex;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (currentIndex >= 0 && currentIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[currentIndex], isPickup);
        }
        break;
      case "Escape":
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
      if (
        destinationContainer &&
        !destinationContainer.contains(event.target as Node)
      ) {
        setShowDestinationDropdown(false);
        setDestinationSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-6 pb-8 backdrop-blur-lg sticky z-10 flex flex-col gap-4 ">
      {/* Pickup location input */}
      <div className="flex items-center gap-3">
        <div className="pl-2">
          <Car className="h-6 w-6 text-black dark:text-black" />
        </div>
        <span className="text-2xl text-black dark:text-black font-bold">
          Get Your Ride
        </span>
      </div>

      <div className="flex items-center">
        <div className="h-12 w-12 flex items-center justify-center bg-white dark:bg-gray-700 rounded-l-lg border-r border-gray-200 dark:border-gray-600">
          <MapPin className="h-5 w-5 text-green-600" />
        </div>
        <div className="relative w-full">
          <Input
            ref={pickupInputRef}
            type="text"
            placeholder="Enter pickup location "
            value={pickupInput}
            onChange={(e) => handlePickupInputChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, pickupSuggestions, true)}
            className="pl-4 text-gray-900 dark:text-white h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-green-400 bg-white dark:bg-gray-700 rounded-l-none"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md text-gray-500 dark:text-gray-300 hover:text-green-600 hover:border-green-400 transition-colors p-2 disabled:opacity-50 shadow-sm"
            onClick={() => onGetCurrentLocation(true)}
            tabIndex={-1}
            aria-label="Use current location"
            style={{ zIndex: 10 }}
          >
            <LocateFixed size={20} />
          </button>
          {showPickupDropdown && pickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-600 rounded-lg shadow-lg z-[200] max-h-60 overflow-y-auto pointer-events-auto">
              {pickupSuggestions.slice(0, 6).map((suggestion, index) => (
                <div
                  key={suggestion.name}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors ${
                    index === pickupSelectedIndex
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700"
                      : ""
                  }`}
                  onClick={(e) => {
                    console.log("Pickup suggestion clicked:", suggestion.name);
                    e.preventDefault();
                    e.stopPropagation();
                    handleSuggestionSelect(suggestion, true);
                  }}
                  onMouseDown={(e) => {
                    // Prevent blur event from firing before click
                    e.preventDefault();
                  }}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {suggestion.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {suggestion.address}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Destination location input and See Details button */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center">
          <div className="h-12 w-12 flex items-center justify-center bg-white dark:bg-gray-700 rounded-l-lg border-r border-gray-200 dark:border-gray-600">
            <Navigation className="h-5 w-5 text-red-500" />
          </div>
          <div className="relative w-full">
            <Input
              ref={destinationInputRef}
              type="text"
              placeholder="Enter destination location"
              value={destinationInput}
              onChange={(e) => handleDestinationInputChange(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, destinationSuggestions, false)}
              className="pl-4 text-gray-900 dark:text-white h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-red-400 bg-white dark:bg-gray-700 rounded-l-none"
            />
            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-600 rounded-lg shadow-lg z-[200] max-h-60 overflow-y-auto pointer-events-auto">
                {destinationSuggestions.slice(0, 6).map((suggestion, index) => (
                  <div
                    key={suggestion.name}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors ${
                      index === destinationSelectedIndex
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700"
                        : ""
                    }`}
                    onClick={(e) => {
                      console.log(
                        "Destination suggestion clicked:",
                        suggestion.name
                      );
                      e.preventDefault();
                      e.stopPropagation();
                      handleSuggestionSelect(suggestion, false);
                    }}
                    onMouseDown={(e) => {
                      // Prevent blur event from firing before click
                      e.preventDefault();
                    }}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {suggestion.address}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* See Details button directly under destination input - Always visible with glass design */}
        <Button
          onClick={onSeeDetails}
          disabled={(userRole === role.driver || userRole === role.admin || userRole === role.super_admin) || !pickupInput || !destinationInput || !pickupLocation || !dropoffLocation}
          className={`w-full h-12 font-semibold text-base shadow-lg transition-all duration-200 backdrop-blur-md ${
            (userRole === role.driver || userRole === role.admin || userRole === role.super_admin)
              ? "bg-gray-400/80 cursor-not-allowed text-gray-600"
              : !pickupInput || !destinationInput || !pickupLocation || !dropoffLocation
              ? "bg-black text-white cursor-not-allowed"
              : "bg-black hover:bg-black-600/90 text-white hover:shadow-xl"
          }`}
        >
          {(userRole === role.driver || userRole === role.admin || userRole === role.super_admin)
            ? "🚫 Booking Not Available"
            : !pickupInput || !destinationInput || !pickupLocation || !dropoffLocation
            ? "Select Locations to Continue"
            : "Check Price"}
        </Button>
      </div>

      {/* Location search tips */}
      {/* <div className="text-xs text-gray-400 text-center space-y-1">

      </div> */}
    </div>
  );
}
