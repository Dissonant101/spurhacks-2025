"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  Edit3,
  Save,
  X,
  Plus,
  Briefcase,
  Phone,
  Mail,
  DollarSign,
  Clock,
} from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  description: string;
  founded?: number;
  specialties: string[];
  employees: number;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export default function CompanyDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    id: "1",
    name: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    description: "",
    founded: undefined,
    specialties: [],
    employees: 0,
    phone: "",
    email: "",
  });
  const [tempData, setTempData] = useState<CompanyData>(companyData);
  const [newSpecialty, setNewSpecialty] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.accountType !== "company")) {
      router.push("/dashboard");
    } else if (user && user.accountType === "company") {
      // Load company data from user profile or mock data
      const mockData: CompanyData = {
        id: user.id,
        name: user.companyName || "",
        industry: user.companyIndustry || "",
        size: user.companySize || "",
        location: user.companyLocation || "",
        website: user.companyWebsite || "",
        description: user.companyDescription || "",
        founded: user.companyFounded,
        specialties: user.companySpecialties || [],
        employees: user.companyEmployees || 0,
        phone: user.phone || "",
        email: user.email || "",
      };
      setCompanyData(mockData);
      setTempData(mockData);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.accountType !== "company") {
    return null;
  }

  const handleSave = () => {
    setCompanyData(tempData);
    setIsEditing(false);
    // Here you would typically save to your backend
    alert("Company information updated successfully!");
  };

  const handleCancel = () => {
    setTempData(companyData);
    setIsEditing(false);
    setNewSpecialty("");
  };

  const addSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !tempData.specialties.includes(newSpecialty.trim())
    ) {
      setTempData({
        ...tempData,
        specialties: [...tempData.specialties, newSpecialty.trim()],
      });
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    setTempData({
      ...tempData,
      specialties: tempData.specialties.filter((_, i) => i !== index),
    });
  };

  const updateField = (field: keyof CompanyData, value: any) => {
    setTempData({ ...tempData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Company Dashboard</h1>
            <p className="mt-2 text-gray-300">
              Manage your company profile and information
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 flex items-center transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter company name"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.name || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Technology, Healthcare"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.industry || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Size
                  </label>
                  {isEditing ? (
                    <select
                      value={tempData.size}
                      onChange={(e) => updateField("size", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select company size</option>
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="51-200 employees">51-200 employees</option>
                      <option value="201-1000 employees">
                        201-1000 employees
                      </option>
                      <option value="1000+ employees">1000+ employees</option>
                    </select>
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.size || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Founded
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempData.founded || ""}
                      onChange={(e) =>
                        updateField(
                          "founded",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 2020"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.founded || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Employees
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempData.employees || ""}
                      onChange={(e) =>
                        updateField("employees", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 50"
                      min="0"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.employees || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., San Francisco, CA"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.location || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Description
                </label>
                {isEditing ? (
                  <textarea
                    value={tempData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your company, mission, and values..."
                  />
                ) : (
                  <p className="text-white bg-gray-700 px-3 py-2 rounded-lg min-h-[100px]">
                    {companyData.description || "No description provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Specialties & Technologies
              </h2>

              {isEditing && (
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a specialty or technology"
                  />
                  <button
                    onClick={addSpecialty}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {(isEditing
                  ? tempData.specialties
                  : companyData.specialties
                ).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-900 text-blue-200 text-sm rounded-full flex items-center"
                  >
                    {specialty}
                    {isEditing && (
                      <button
                        onClick={() => removeSpecialty(index)}
                        className="ml-2 text-blue-300 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
                {(isEditing ? tempData.specialties : companyData.specialties)
                  .length === 0 && (
                  <p className="text-gray-400 text-sm">
                    No specialties added yet
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={tempData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://your-website.com"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.website ? (
                        <a
                          href={companyData.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {companyData.website}
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="contact@company.com"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.email || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-white bg-gray-700 px-3 py-2 rounded-lg">
                      {companyData.phone || "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post New Job
                </button>
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition-colors">
                  <Users className="w-4 h-4 mr-2" />
                  View Applications
                </button>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interviews
                </button>
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-gray-800 rounded-lg shadow border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Company Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Active Job Postings</span>
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Applications</span>
                  <span className="text-white font-semibold">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Profile Views</span>
                  <span className="text-white font-semibold">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Followers</span>
                  <span className="text-white font-semibold">23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
