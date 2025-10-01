import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useApplyDriverMutation } from "@/redux/features/driver/driver.api";
import { Car, Upload } from "lucide-react";
import { useState } from "react";

interface DriverApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DriverApplicationModal({
  isOpen,
  onClose,
}: DriverApplicationModalProps) {
  const [applyDriver, { isLoading }] = useApplyDriverMutation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Vehicle Information
    vehicleType: "CAR" as "CAR" | "BIKE",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    licensePlate: "",
    licenseNumber: "",

    // Documents (URLs or file paths)
    driverLicense: "",
    vehicleRegistration: "",
    insurance: "",

    // Optional fields
    experience: "",
    references: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would upload the file to a server and get back a URL
      // For now, we'll just store the filename as a placeholder
      setFormData(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const applicationData = {
        licenseNumber: formData.licenseNumber,
        vehicleType: {
          category: formData.vehicleType,
          make: formData.vehicleType, // Using category as make for now - can be improved later
          model: formData.vehicleModel,
          year: parseInt(formData.vehicleYear),
          plateNumber: formData.licensePlate,
          color: formData.vehicleColor,
        },
        location: {
          coordinates: [90.4125, 23.7928] as [number, number], // Default to Gulshan, Dhaka
          address: "Dhaka, Bangladesh",
          lastUpdated: new Date(),
        },
      };

      await applyDriver(applicationData).unwrap();

      toast({
        title: "Application Submitted!",
        description: "Your driver application has been submitted successfully. We'll review it and get back to you soon.",
      });

      // Reset form and close modal
      setFormData({
        vehicleType: "CAR",
        vehicleModel: "",
        vehicleYear: "",
        vehicleColor: "",
        licensePlate: "",
        licenseNumber: "",
        driverLicense: "",
        vehicleRegistration: "",
        insurance: "",
        experience: "",
        references: "",
      });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error?.data?.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleType: "CAR",
      vehicleModel: "",
      vehicleYear: "",
      vehicleColor: "",
      licensePlate: "",
      licenseNumber: "",
      driverLicense: "",
      vehicleRegistration: "",
      insurance: "",
      experience: "",
      references: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[999] bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Car className="h-5 w-5" />
            Apply to Become a Driver
          </DialogTitle>
          <DialogDescription className="text-gray-200">
            Fill out this form to apply for a driver position. All fields are required unless marked as optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-white">Vehicle Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicleType" className="text-white">Vehicle Type *</Label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="CAR">Car</option>
                  <option value="BIKE">Bike</option>
                </select>
              </div>

              <div>
                <Label htmlFor="vehicleModel" className="text-white">Vehicle Model *</Label>
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
                <Label htmlFor="vehicleYear" className="text-white">Vehicle Year *</Label>
                <Input
                  id="vehicleYear"
                  name="vehicleYear"
                  type="number"
                  value={formData.vehicleYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>

              <div>
                <Label htmlFor="vehicleColor" className="text-white">Vehicle Color *</Label>
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
                <Label htmlFor="licenseNumber" className="text-white">License Number *</Label>
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
                <Label htmlFor="licensePlate" className="text-white">Number Plate *</Label>
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
            <h3 className="text-lg font-semibold border-b pb-2 text-white">Required Documents</h3>
            <p className="text-sm text-gray-200">Please upload or provide links to your documents</p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="driverLicense" className="text-white">Driver's License *</Label>
                <div className="flex gap-2">
                  <Input
                    id="driverLicense"
                    name="driverLicense"
                    value={formData.driverLicense}
                    onChange={handleInputChange}
                    placeholder="Upload or enter document URL"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('driverLicenseFile')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  id="driverLicenseFile"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'driverLicense')}
                />
              </div>

              <div>
                <Label htmlFor="vehicleRegistration" className="text-white">Vehicle Registration *</Label>
                <div className="flex gap-2">
                  <Input
                    id="vehicleRegistration"
                    name="vehicleRegistration"
                    value={formData.vehicleRegistration}
                    onChange={handleInputChange}
                    placeholder="Upload or enter document URL"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('vehicleRegistrationFile')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  id="vehicleRegistrationFile"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'vehicleRegistration')}
                />
              </div>

              <div>
                <Label htmlFor="insurance" className="text-white">Insurance Document *</Label>
                <div className="flex gap-2">
                  <Input
                    id="insurance"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleInputChange}
                    placeholder="Upload or enter document URL"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('insuranceFile')?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  id="insuranceFile"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'insurance')}
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-white">Additional Information</h3>

            <div>
              <Label htmlFor="experience" className="text-white">Driving Experience (Optional)</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Describe your driving experience, years of service, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="references" className="text-white">References (Optional)</Label>
              <Textarea
                id="references"
                name="references"
                value={formData.references}
                onChange={handleInputChange}
                placeholder="Contact information for professional references"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="text-white border" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white text-white"></div>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}