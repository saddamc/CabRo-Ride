import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Car, Loader2 } from "lucide-react";
import { useState } from "react";

interface UpdateDriverProfileModalProps {
  driverData: any;
  isLoading: boolean;
  onConfirm: (data: any) => Promise<void>;
  children: React.ReactNode;
}

export default function UpdateDriverProfileModal({
  driverData,
  isLoading,
  onConfirm,
  children
}: UpdateDriverProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: driverData?.vehicleType?.category || 'CAR',
    vehicleModel: driverData?.vehicleType?.model || '',
    vehicleYear: driverData?.vehicleType?.year || '',
    vehicleColor: driverData?.vehicleType?.color || '',
    licensePlate: driverData?.vehicleType?.plateNumber || '',
    licenseNumber: driverData?.licenseNumber || '',
    // Load existing document values or empty strings
    driverLicense: driverData?.documents?.licenseImage || '',
    vehicleRegistration: driverData?.documents?.vehicleRegistration || '',
    insurance: driverData?.documents?.insurance || '',
    // Load additional information if available
    experience: driverData?.additionalInfo?.experience || '',
    references: driverData?.additionalInfo?.references || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    const applicationData = {
      licenseNumber: formData.licenseNumber,
      vehicleType: {
        category: formData.vehicleType,
        make: formData.vehicleType, // Using category as make for now
        model: formData.vehicleModel,
        year: parseInt(formData.vehicleYear),
        plateNumber: formData.licensePlate,
        color: formData.vehicleColor,
      },
      location: {
        coordinates: [90.4125, 23.7928], // Default to Gulshan, Dhaka
        address: "Dhaka, Bangladesh",
        lastUpdated: new Date(),
      },
      documents: {
        licenseImage: formData.driverLicense,
        vehicleRegistration: formData.vehicleRegistration,
        insurance: formData.insurance,
      },
      additionalInfo: {
        experience: formData.experience,
        references: formData.references
      }
    };

    await onConfirm(applicationData);
    // Close the dialog after successful update
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-black/80 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Car className="h-5 w-5" />
            Update Driver Profile
          </DialogTitle>
          <DialogDescription className="text-white">
            Complete or update your driver profile information to start accepting rides.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Vehicle Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Vehicle Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  focus:ring-primary focus:border-transparent"
                  required
                >
                  <option className="text-black" value="CAR">Car</option>
                  <option className="text-black" value="BIKE">Bike</option>
                </select>
              </div>

              <div>
                <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                <Input
                  id="vehicleModel"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  placeholder="e.g., Camry"
                  required
                />
              </div>

              <div>
                <Label htmlFor="vehicleYear">Vehicle Year *</Label>
                <Input
                  id="vehicleYear"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <Label htmlFor="vehicleColor">Vehicle Color *</Label>
                <Input
                  id="vehicleColor"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleInputChange}
                  placeholder="e.g., White"
                  required
                />
              </div>

              <div>
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="POI655555"
                  required
                />
              </div>

              <div>
                <Label htmlFor="licensePlate">Number Plate *</Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC-1234"
                  required
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Required Documents</h3>
            <p className="text-sm text-gray-600">Please provide links or upload your documents</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="driverLicense">Driver's License *</Label>
                <Input
                  id="driverLicense"
                  name="driverLicense"
                  value={formData.driverLicense}
                  onChange={handleInputChange}
                  placeholder="Upload or enter document URL"
                  required
                />
              </div>

              <div>
                <Label htmlFor="vehicleRegistration">Vehicle Registration *</Label>
                <Input
                  id="vehicleRegistration"
                  name="vehicleRegistration"
                  value={formData.vehicleRegistration}
                  onChange={handleInputChange}
                  placeholder="Upload or enter document URL"
                  required
                />
              </div>

              <div>
                <Label htmlFor="insurance">Insurance Document *</Label>
                <Input
                  id="insurance"
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleInputChange}
                  placeholder="Upload or enter document URL"
                  required
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>

            <div>
              <Label htmlFor="experience">Driving Experience (Optional)</Label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Describe your driving experience, years of service, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <Label htmlFor="references">References (Optional)</Label>
              <textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleInputChange}
                placeholder="Contact information for professional references"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}