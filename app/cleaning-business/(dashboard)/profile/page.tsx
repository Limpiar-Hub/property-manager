"use client";


import React, { useState, useEffect } from 'react';
import { CleaningBusiness, fetchCleaners } from "@/cleaningBusiness/lib/services/cleanerService";
import { useAppSelector } from "@/hooks/useReduxHooks";

const CleaningBusinessProfile = () => {
  const [businessData, setBusinessData] = useState<CleaningBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        setLoading(true);
        if (!user || !user._id || !token) {
          throw new Error('User or token not found');
        }
        const data = await fetchCleaners(user._id, token);
        setBusinessData(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch business data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadBusinessData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading business profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Profile</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No business data available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'verified':
        return '✓';
      case 'pending_verification':
        return '⏳';
      default:
        return '○';
    }
  };

  const completedTasks = businessData.cleaners?.reduce((total, cleaner) => {
    return total + cleaner.tasks.filter(task => task.status === 'Done').length;
  }, 0) || 0;

  const totalTasks = businessData.tasks?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {businessData.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {businessData.fullName}
                    </h1>
                    <p className="text-gray-600 mt-1">{businessData.email}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(businessData.status)}`}>
                    <span className="mr-1">{getStatusIcon(businessData.status)}</span>
                    {businessData.status.replace('_', ' ').toUpperCase()}
                  </span>
                  
                  {businessData.isVerified && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      ✓ Verified Business
                    </span>
                  )}
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${businessData.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {businessData.availability ? '● Available' : '● Unavailable'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 lg:ml-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">{businessData.cleaners?.length || 0}</div>
                    <div className="text-sm text-blue-600">Team Members</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                    <div className="text-sm text-green-600">Completed Tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Business Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-gray-900">{businessData.phoneNumber}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operating City</label>
                    <p className="text-gray-900">{businessData.businessInfo?.operatingCity || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                    <p className="text-gray-900">
                      {businessData.businessInfo?.address && (
                        <>
                          {businessData.businessInfo.address}<br />
                          {businessData.businessInfo.city}, {businessData.businessInfo.state} {businessData.businessInfo.zipCode}
                        </>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                    <p className="text-gray-900">{businessData.businessInfo?.howManyTeamMembersDoYouHave || 'Not specified'} members</p>
                  </div>
                  
                  {businessData.businessInfo?.website && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <a 
                        href={businessData.businessInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {businessData.businessInfo.website}
                      </a>
                    </div>
                  )}
                  
                  {businessData.businessInfo?.referenceSource && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                      <p className="text-gray-900 capitalize">{businessData.businessInfo.referenceSource}</p>
                    </div>
                  )}
                </div>
                
                {businessData.businessInfo?.servicesYouProvide && businessData.businessInfo.servicesYouProvide.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Services Provided</label>
                    <div className="flex flex-wrap gap-2">
                      {businessData.businessInfo.servicesYouProvide.map((service, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Team Members */}
            {businessData.cleaners && businessData.cleaners.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border mt-8">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                </div>
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {businessData.cleaners.map((cleaner) => (
                      <div key={cleaner._id} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {cleaner.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{cleaner.fullName}</h3>
                            <p className="text-sm text-gray-600">{cleaner.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phone:</span>
                            <span className="text-gray-900">{cleaner.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${cleaner.availability ? 'text-green-600' : 'text-red-600'}`}>
                              {cleaner.availability ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tasks:</span>
                            <span className="text-gray-900">{cleaner.tasks?.length || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                            <span className={`px-2 py-1 rounded text-xs ${cleaner.temporary ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                              {/* {cleaner.temporary ? 'Temporary' : 'Permanent'} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-medium text-gray-900">{totalTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Tasks</span>
                  <span className="font-medium text-green-600">{completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Cleaners</span>
                  <span className="font-medium text-blue-600">
                    {businessData.cleaners?.filter(c => c.availability).length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Properties Assigned</span>
                  <span className="font-medium text-gray-900">{businessData.assignedProperties?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-gray-900">Account Status</h3>
              </div>
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className={`text-sm font-medium ${businessData.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {businessData.isVerified ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Onboarding</span>
                  <span className={`text-sm font-medium ${businessData.onboardingChecklist ? 'text-green-600' : 'text-yellow-600'}`}>
                    {businessData.onboardingChecklist ? '✓ Complete' : '⏳ Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-sm text-gray-900">
                    {new Date(businessData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Access Control */}
            {businessData.settings?.accessControl && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-semibold text-gray-900">Permissions</h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Can Edit</span>
                    <span className={`text-sm font-medium ${businessData.settings.accessControl.canEdit ? 'text-green-600' : 'text-red-600'}`}>
                      {businessData.settings.accessControl.canEdit ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Can Delete</span>
                    <span className={`text-sm font-medium ${businessData.settings.accessControl.canDelete ? 'text-green-600' : 'text-red-600'}`}>
                      {businessData.settings.accessControl.canDelete ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Can Add</span>
                    <span className={`text-sm font-medium ${businessData.settings.accessControl.canAdd ? 'text-green-600' : 'text-red-600'}`}>
                      {businessData.settings.accessControl.canAdd ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningBusinessProfile;