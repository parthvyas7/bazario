import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { sellerService } from '../../utils/services';

const StoreSetupContent = ({ onSignOut }) => {
  const { profile, updateUserProfile } = useAuthStore();
  
  const [storeName, setStoreName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | 'saving' | null

  useEffect(() => {
    if (profile) {
      setStoreName(profile.store_name || '');
      setLogoUrl(profile.logo_url || '');
      setDescription(profile.description || '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    try {
      if (!profile?.seller_id) {
        throw new Error('Seller profile ID not found.');
      }
      
      const updatedProfile = await sellerService.updateSellerProfile(profile.seller_id, {
        store_name: storeName,
        logo_url: logoUrl,
        description: description
      });

      if (updatedProfile) {
        updateUserProfile({
          store_name: storeName,
          logo_url: logoUrl,
          description: description
        });
        setSaveStatus('success');
      } else {
        throw new Error('Failed to update seller profile.');
      }
    } catch (error) {
      console.error('Error updating storefront:', error);
      setSaveStatus('error');
    }
  };

  const handleReset = () => {
    if (profile) {
      setStoreName(profile.store_name || '');
      setLogoUrl(profile.logo_url || '');
      setDescription(profile.description || '');
      setSaveStatus(null);
    }
  };

  return (
    <div className="flex-1 p-8 min-h-screen">
      <section className="flex-grow flex items-center justify-center p-6 md:p-16">
        <div className="max-w-xl w-full">
          <header className="mb-12 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-plus-jakarta font-extrabold text-primary tracking-tight">
                Storefront Setup
              </h2>
              <p className="text-on-surface-variant mt-2 font-medium">
                How should the world see your brand?
              </p>
            </div>
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="md:hidden px-4 py-2 text-xs font-bold bg-[#f1edeb] text-error hover:bg-error/10 hover:text-error rounded-full flex items-center gap-2 border border-outline-variant/25 transition-all"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Sign Out</span>
              </button>
            )}
          </header>

          {saveStatus === 'success' && (
            <div className="mb-6 p-4 bg-tertiary-container/10 border border-tertiary-container/20 text-tertiary-container rounded-xl font-medium text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-container">check_circle</span>
              <span>Storefront details updated successfully!</span>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mb-6 p-4 bg-error-container/10 border border-error-container/20 text-error rounded-xl font-medium text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-error">error</span>
              <span>Failed to update storefront details. Please try again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 group">
                <label className="block text-sm font-plus-jakarta font-bold text-primary mb-2 tracking-tight">
                  Store Name
                </label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg px-5 py-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all duration-200"
                  placeholder="e.g. The Indigo Artisan"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-plus-jakarta font-bold text-primary mb-2 tracking-tight">
                    Store Logo URL
                  </label>
                  <input
                    className="w-full bg-surface-container-highest border-none rounded-lg px-5 py-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all duration-200"
                    placeholder="https://example.com/logo.png"
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/10">
                  <img
                    alt="Logo Preview"
                    className="w-16 h-16 rounded-full object-cover border border-outline-variant/30 shadow-sm bg-white"
                    src={logoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBi3Dho0MjP66VJu4kYQ9V0ijWPW9C5s8-p1Ntzj6VJgQGtb4hs7-TASXK2ABMsNn7iK-GLslbFHHFgWLHrscR6rcUkUFr6Y0pXRGlAQdPO6vXUnZsXx3CPSuow23PnWqu7l6kKOYLw6ixDWa03Z9YJ5JvUKw_ybpxxQBnXrdWpvDtvic8xqi4A6Pg-jCqhb8j2r1haIkju6fl6gzEaZAGNvlc6MeBZyDPyUSVI2_H0RRbnRlGCePXfirnuofmvhbd4GzoExZindOk"}
                    onError={(e) => {
                      e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBi3Dho0MjP66VJu4kYQ9V0ijWPW9C5s8-p1Ntzj6VJgQGtb4hs7-TASXK2ABMsNn7iK-GLslbFHHFgWLHrscR6rcUkUFr6Y0pXRGlAQdPO6vXUnZsXx3CPSuow23PnWqu7l6kKOYLw6ixDWa03Z9YJ5JvUKw_ybpxxQBnXrdWpvDtvic8xqi4A6Pg-jCqhb8j2r1haIkju6fl6gzEaZAGNvlc6MeBZyDPyUSVI2_H0RRbnRlGCePXfirnuofmvhbd4GzoExZindOk";
                    }}
                  />
                  <div>
                    <h5 className="font-plus-jakarta font-bold text-sm text-primary">Store Logo Preview</h5>
                    <p className="text-[10px] text-on-surface-variant font-medium">Valid URL shows store icon immediately</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 flex flex-col justify-center p-6 bg-primary-container/10 rounded-xl">
                <span className="material-symbols-outlined text-primary mb-3">
                  storefront
                </span>
                <h4 className="font-plus-jakarta font-bold text-primary text-sm mb-1">
                  Brand Identity
                </h4>
                <p className="text-xs text-on-primary-fixed-variant leading-relaxed">
                  Your store name, logo, and story represent your brand to all customers on Bazario. Authentic and recognizable branding helps drive customer loyalty and repeat visits.
                </p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-plus-jakarta font-bold text-primary mb-2 tracking-tight">
                  Store Description
                </label>
                <textarea
                  className="w-full bg-surface-container-highest border-none rounded-lg px-5 py-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all duration-200"
                  placeholder="Tell your brand's story..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="pt-8 flex flex-col md:flex-row items-center gap-4">
              <button
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-plus-jakarta font-extrabold text-sm tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                type="submit"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save'}
              </button>
              <button
                className="w-full md:w-auto px-10 py-4 text-primary font-plus-jakarta font-bold text-sm hover:bg-surface-container-low rounded-full transition-colors"
                type="button"
                onClick={handleReset}
              >
                Reset Changes
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default StoreSetupContent;
