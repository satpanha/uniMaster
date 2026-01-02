"use client";

import { useState, useMemo } from "react";
import { User, Mail, Phone, Calendar, MapPin, Trophy, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { FormData,FormErrors, RegistrationType } from "@/src/types/registration";
import { validateForm } from "@/src/lib/validation/validators";
import { useRegister } from "@/src/services/useRegister";
import { provinces as provincesData, sports as sportsData } from "@/lib/data/loaders/dataLoader";
import Image from 'next/image';
import { FormInput, FormSelect, FormSection } from "@/components/common/";
import { Card, SectionHeader, Button } from "@/components/ui";

interface RegistrationFormProps {
  registrationType: RegistrationType;
}

export default function RegistrationForm({
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    province: null,
    department: null,
    eventType: null,
    typeOfSport: null,
    selectedSport: null,
    firstName: "",
    lastName: "",
    firstNameKh: "",
    lastNameKh: "",
    nationalID: "",
    dateOfBirth: "",
    gender: "male",
    email: "",
    position: null,
    phoneNumber: "",
    photoUpload: null,
    sportCategory: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { submitRegistration, loading, error: submitError, success } = useRegister();

  // Get unique sport categories from sports data
  const sportCategories = useMemo(() => {
    const categories = [...new Set(sportsData.map(sport => sport.category))];
    return categories.sort();
  }, []);

  // Filter sports by selected category
  const filteredSports = useMemo(() => {
    if (!formData.sportCategory) return [];
    return sportsData.filter(sport => sport.category === formData.sportCategory);
  }, [formData.sportCategory]);

  const handleChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value } as FormData));
    
    // Handle photo preview
    if (field === "photoUpload" && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else if (field === "photoUpload" && !value) {
      setPhotoPreview(null);
    }
    
    // Reset selected sport when category changes
    if (field === "sportCategory") {
      setFormData((prev) => ({ ...prev, sportCategory: value as string, selectedSport: null } as FormData));
    }
    
    // Clear error for this field when user starts typing
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await submitRegistration(formData);
      } catch (err) {
        // Error is handled by the hook
        console.error('Registration submission failed:', err);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      province: null,
      department: null,
      eventType: null,
      typeOfSport: null,
      selectedSport: null,
      firstName: "",
      lastName: "",
      firstNameKh: "",
      lastNameKh: "",
      nationalID: "",
      dateOfBirth: "",
      gender: "male",
      email: "",
      position: null,
      phoneNumber: "",
      photoUpload: null,
      sportCategory: null,
    });
    setErrors({});
    setPhotoPreview(null);
  };

  return (
    <div className="w-full">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-border">
          <SectionHeader
            title="Athlete Registration"
            subtitle="Complete the form below to register for sports competitions"
            icon={User}
            variant="primary"
          />
        </div>

        {/* Status Messages */}
        {success && (
          <div className="mx-8 mt-6">
            <Card className="p-4 border-2 card-success">
              <div className="flex items-center gap-3 text-success-600">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold">Registration Successful!</p>
                  <p className="text-sm">Your registration has been approved and added to the system.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {submitError && (
          <div className="mx-8 mt-6">
            <Card className="p-4 border-2 card-error">
              <div className="flex items-center gap-3 text-warning-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold">Registration Failed</p>
                  <p className="text-sm">{submitError}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-surface">
          {/* Personal Information Section */}
          <FormSection icon={User} title="Personal Information">
            <FormInput
              label="First Name (English)"
              value={formData.firstName}
              onChange={(value) => handleChange("firstName", value)}
              placeholder="Enter first name in English"
              required
              error={errors.firstName}
            />

            <FormInput
              label="Last Name (English)"
              value={formData.lastName}
              onChange={(value) => handleChange("lastName", value)}
              placeholder="Enter last name in English"
              required
              error={errors.lastName}
            />

            <FormInput
              label="នាមត្រកូល (First Name Khmer)"
              value={formData.firstNameKh}
              onChange={(value) => handleChange("firstNameKh", value)}
              placeholder="បញ្ចូលនាមត្រកូលជាភាសាខ្មែរ"
              required
            />

            <FormInput
              label="នាមខ្លួន (Last Name Khmer)"
              value={formData.lastNameKh}
              onChange={(value) => handleChange("lastNameKh", value)}
              placeholder="បញ្ចូលនាមខ្លួនភាសាខ្មែរ"
              required
            />

            <FormInput
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(value) => handleChange("dateOfBirth", value)}
              type="date"
              required
              error={errors.dateOfBirth}
              icon={Calendar}
            />

            <FormSelect
              label="Gender"
              value={formData.gender || "male"}
              onChange={(value) => handleChange("gender", value || "male")}
              options={[
                { value: "male", label: "Male / ប្រុស" },
                { value: "female", label: "Female / ស្រី" },
              ]}
              required
            />

            <FormInput
              label="National ID / អត្តសញ្ញាណប័ណ្ណ"
              value={formData.nationalID}
              onChange={(value) => handleChange("nationalID", value)}
              placeholder="Enter national ID number"
              required
              error={errors.nationalID}
              colSpan={2}
            />
          </FormSection>

          {/* Location Section */}
          <FormSection icon={MapPin} title="Location Details / ទីតាំង">
            <FormSelect
              label="Province / ខេត្ត"
              value={formData.province} 
              onChange={(value) => handleChange("province", value)}
              options={provincesData.map((province) => ({
                value: province.name,
                label: `${province.name}${province.khmerName ? ` (${province.khmerName})` : ''}`,
              }))}
              placeholder="Select province / ជ្រើសរើសខេត្ត"
              required
              error={errors.province}
              icon={MapPin}
            />

            <FormSelect
              label="Department / នាយកដ្ឋាន"
              value={formData.department}
              onChange={(value) => handleChange("department", value)}
              options={[
                { value: "Youth Affairs", label: "Youth Affairs / កិច្ចការយុវជន" },
                { value: "Sports Development", label: "Sports Development / អភិវឌ្ឍន៍កីឡា" },
                { value: "Physical Education", label: "Physical Education / អប់រំកាយ" },
                { value: "Elite Athletes", label: "Elite Athletes / កីឡាករជម្រើស" },
              ]}
              placeholder="Select department (optional)"
            />
          </FormSection>

          {/* Contact Information Section */}
          <FormSection icon={Mail} title="Contact Information / ព័ត៌មានទំនាក់ទំនង">
            <FormInput
              label="Email Address / អ៊ីមែល"
              value={formData.email || ""}
              onChange={(value) => handleChange("email", value)}
              placeholder="example@email.com"
              type="email"
              required
              error={errors.email}
              icon={Mail}
            />

            <FormInput
              label="Phone Number / លេខទូរស័ព្ទ"
              value={formData.phoneNumber}
              onChange={(value) => handleChange("phoneNumber", value)}
              placeholder="+855 12 345 678"
              type="tel"
              required
              error={errors.phoneNumber}
              icon={Phone}
            />
          </FormSection>

          {/* Sports Selection Section */}
          <fieldset className="space-y-5">
            <legend className="w-full">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary-100">
                  <Trophy className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Sport Selection / ការជ្រើសរើសកីឡា
                </h3>
              </div>
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-1">
              <FormSelect
                label="Sport Category / ប្រភេទកីឡា"
                value={formData.sportCategory}
                onChange={(value) => handleChange("sportCategory", value)}
                options={sportCategories.map((category) => ({
                  value: category,
                  label: category,
                }))}
                placeholder="Select category / ជ្រើសរើសប្រភេទ"
                required
                error={errors.selectedSport && !formData.sportCategory ? errors.selectedSport : undefined}
              />

              <FormSelect
                label="Select Sport / ជ្រើសរើសកីឡា"
                value={formData.selectedSport}
                onChange={(value) => handleChange("selectedSport", value)}
                options={filteredSports.map((sport) => ({
                  value: sport.name,
                  label: sport.name,
                }))}
                placeholder={formData.sportCategory 
                  ? `Choose a sport from ${formData.sportCategory}` 
                  : 'First select a category'}
                required
                error={errors.selectedSport}
                disabled={!formData.sportCategory}
              />

              {/* Sports in Selected Category - Visual Display */}
              {formData.sportCategory && filteredSports.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Available Sports in {formData.sportCategory}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {filteredSports.map((sport) => (
                      <button
                        key={sport.id}
                        type="button"
                        onClick={() => handleChange("selectedSport", sport.name)}
                        className={`p-3 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${
                          formData.selectedSport === sport.name
                            ? 'bg-primary/10 ring-2 ring-primary/30'
                            : 'border-border hover:border-primary/50 bg-card'
                        }`}

                      >
                        <div className="font-semibold text-foreground text-sm">
                          {sport.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {sport.status === 'ongoing' ? '🟢 Ongoing' : sport.status === 'upcoming' ? '🟡 Upcoming' : '⚪ Completed'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <FormSelect
                label="Position/Role / តួនាទី"
                value={formData.position}
                onChange={(value) => handleChange("position", value)}
                options={[
                  { value: "Athlete", label: "Athlete / កីឡាករ" },
                  { value: "Coach", label: "Coach / គ្រូបង្វឹក" },
                  { value: "Team Leader", label: "Team Leader / ប្រធានក្រុម" },
                  { value: "Manager", label: "Manager / អ្នកគ្រប់គ្រង" },
                  { value: "Referee", label: "Referee / អាជ្ញាកណ្ដាល" },
                ]}
                placeholder="Select position (optional)"
              />

              <FormSelect
                label="Event Type / ប្រភេទព្រឹត្តិការណ៍"
                value={formData.eventType}
                onChange={(value) => handleChange("eventType", value)}
                options={[
                  { value: "National Championship", label: "National Championship / ជើងឯកជាតិ" },
                  { value: "Regional Competition", label: "Regional Competition / ការប្រកួតក្នុងតំបន់" },
                  { value: "Provincial Games", label: "Provincial Games / ប្រកួតកីឡាខេត្ត" },
                  { value: "School Sports", label: "School Sports / កីឡាសាលា" },
                  { value: "Youth Festival", label: "Youth Festival / មហោស្រពយុវជន" },
                ]}
                placeholder="Select event type (optional)"
              />
            </div>

            {/* Photo Upload */}
            <div className="md:col-span-2 pt-2">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Profile Photo
              </label>
              
              <div className="flex items-start gap-6">
                {/* Photo Preview */}
                <div className="shrink-0">
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center">
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Profile preview"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">No photo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Input */}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange("photoUpload", e.target.files?.[0] || null)}
                    className="w-full h-12 px-4 border border-border rounded-lg bg-card text-foreground file:mr-4 file:h-full file:py-0 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:text-white hover:file:opacity-90 cursor-pointer file-primary"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload a recent photo (optional). Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                  {formData.photoUpload && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border bg-success-50 border-success-200 text-success-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">{formData.photoUpload.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChange("photoUpload", null)}
                        className="text-sm font-medium hover:opacity-80 text-error-600"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <Button
              type="button"
              onClick={handleReset}
              disabled={loading}
              variant="outline"
              size="lg"
              fullWidth
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              size="lg"
              fullWidth
              icon={CheckCircle}
              loading={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
