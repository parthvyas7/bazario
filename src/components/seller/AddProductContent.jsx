import React, { useState, useRef } from 'react';
import supabase from '../../utils/supabase';

const AddProductContent = ({ newProduct, setNewProduct, handleAddProduct, editingProduct, handleCancelEdit }) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }
  const fileInputRef = useRef(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    // Scroll to top to see notification
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Auto-dismiss notifications after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please upload a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size exceeds the 5MB limit.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setNewProduct(prev => ({
        ...prev,
        image_url: publicUrl
      }));

      showNotification('success', 'Image uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      showNotification('error', `Failed to upload image: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setNewProduct(prev => ({
      ...prev,
      image_url: ''
    }));
    showNotification('success', 'Image removed.');
  };

  const selectPresetImage = (url) => {
    setNewProduct(prev => ({
      ...prev,
      image_url: url
    }));
    showNotification('success', 'Selected preset image.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProduct.image_url) {
      showNotification('error', 'Please upload a product image or provide an Image URL.');
      return;
    }

    try {
      const res = await handleAddProduct(e);
      if (res && !res.success) {
        showNotification('error', `Failed to save product: ${res.error}`);
      } else {
        showNotification('success', editingProduct ? 'Product updated successfully!' : 'Product published successfully!');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', `Unexpected error: ${err.message || 'Unknown error'}`);
    }
  };

  // Predefined image options for quick testing
  const presets = [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuABAPbYtghm_ZDfx-Qb1fgQAHOK4hgjHBZfAwsD2wflEwH1Roq6IZoTLb00B-gSwPUwZQ0KNkY3k6JsTeyt9_yCsBRMbjrvqAmhRwiy0cPIJAbTPwmnEv2Sw82NxoP_BR542cdtAQcoLgs_K9fau0WunjSoUEbgw3CI7aAso4rDu_hCi10_iSHShKilFS1de-GVqcKJHYkaJEL3arcfIt6higO_zqkQnbgwHhHCG4taPNVLqljBx-c95k8DIfziMao9pyWjn2oo1Fc",
      alt: "Ceramic Vase"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPTcKX_L75cXfFLGciqZSc-4shYmxfsch1f7YzoJ_G4CQ7LMxUi971mmeJcyEfOxVoxI9l5RIO2wNWHIMu2TuXp_N8hIZkd5CLlr3ZgsAYAt8jdjJralKfZpNMkbxTf5LYsej3c_GYFgwRFuEigAJN2ohs7a-Zu_vCbR_VAmpxAS-_ZnFP4wPIwcKu_NgmiKGkbXdUjXUCgywxcU-2XzQ4X_d-rCboZH7xFVPyjbqqgQeSnujYc1FR0CzVwJ-yICwzhX-70h482IY",
      alt: "Organic Linen"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0G2qogz1tBuRZacCbcn7MKAiGDoY4liwTunmSMGuyyaCUOY0hqLqC6-MiiyGg1qYorGSk2itkSZCNDaM-nvSbfqP2ZoVwwSW8T5zBSp05RhCaa6W6XC7AlJSEMrIhxWelxIXcZmleKaGvBppZ6it1MHqnKTABfvqujrW4ktJNuTpedPQ8b6wkQjXCXz1ipnrWoT3ZJ5BqKrK2bEV_CDE05bEzUlH3OA6BWkqKI3Z13_YaJ3EHdzLH1aqwbwJCyrmMDQdVgtd-OaI",
      alt: "Earthware Ceramics"
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaQJADG-XcNboh__rQpU-QSbI0TJDANopJLXGRqnOaRNrzsJLrCD3tJh8M5MpWs4l3Rrpg3W5QqYT4mJxMPAT9dYKqhPQVncN-WbOJkNEh5TuzPod_c0Y6J3Xoq7RyOVRdODUmhAlNo1qaDsKpVOywmQqedJwh_Mby6GJjW8WgAo8eMkcTsuRz_jzvicKiiVOnLMu4m-OOj58C_aaNe-u0vkBX_JAggZBs05m8H2xpFeqNQMTLOBQuFTa8GpEqbDkxCxqf67XhPuQ",
      alt: "Brass Lamp"
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex-1 p-8 min-h-screen bg-surface-bright">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Notifications */}
      {notification && (
        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm font-semibold shadow-md transition-all ${
          notification.type === 'success' 
            ? 'bg-secondary/15 text-secondary border border-secondary/20' 
            : 'bg-error/15 text-error border border-error/20'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">
              {notification.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span>{notification.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="hover:opacity-75"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      <header className="mb-10 flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant text-xs mb-2 font-medium uppercase tracking-wider">
            <span>Inventory</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary font-bold">List Product</span>
          </nav>
          <h1 className="text-4xl font-headline font-extrabold text-primary tracking-tighter">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-on-surface-variant mt-2 font-body text-sm">Create a high-impact listing for your curated collection.</p>
        </div>
        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={handleCancelEdit} 
            className="px-6 py-2.5 rounded-full font-jakarta font-semibold text-primary hover:bg-surface-container-low transition-colors"
          >
            Discard Draft
          </button>
          <button 
            type="submit" 
            className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-jakarta font-bold shadow-lg hover:shadow-primary/20 transition-all"
          >
            {editingProduct ? "Save Changes" : "Publish Listing"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Side: Images & Visibility */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <section className="bg-surface-container-lowest p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-jakarta font-bold text-lg text-primary">Product Visuals</h2>
              <span className="text-xs text-on-surface-variant font-medium">Recommended: 1080x1080px</span>
            </div>

            {/* Upload Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 text-center p-8 transition-all overflow-hidden ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : newProduct.image_url 
                    ? 'border-outline-variant' 
                    : 'bg-surface-container-low border-outline-variant hover:border-primary/50'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  <p className="text-sm font-semibold text-primary mt-2">Uploading image...</p>
                </div>
              ) : newProduct.image_url ? (
                <div className="absolute inset-0 w-full h-full group">
                  <img 
                    src={newProduct.image_url} 
                    alt="Uploaded Product Visual" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-5 py-2.5 bg-error text-white font-bold rounded-full text-xs shadow-lg hover:bg-red-700 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm text-primary transition-transform hover:scale-110">
                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                  </div>
                  <div>
                    <p className="font-jakarta font-bold text-on-surface">Drop high-res images here</p>
                    <p className="text-xs text-on-surface-variant mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-surface-container-high rounded-lg text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors"
                  >
                    Browse Files
                  </button>
                </>
              )}
            </div>

            {/* Presets Gallery */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-on-surface-variant font-jakarta">Or choose a preset image:</p>
              <div className="grid grid-cols-4 gap-3">
                {presets.map((preset, index) => (
                  <div 
                    key={index}
                    onClick={() => selectPresetImage(preset.url)}
                    className={`aspect-square rounded-lg bg-surface-container-high border overflow-hidden relative group cursor-pointer transition-all ${
                      newProduct.image_url === preset.url 
                        ? 'border-primary ring-2 ring-primary/20 scale-95' 
                        : 'border-outline-variant/20 hover:scale-105'
                    }`}
                  >
                    <img 
                      alt={preset.alt} 
                      className={`w-full h-full object-cover transition-all ${newProduct.image_url === preset.url ? '' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'}`}
                      src={preset.url}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/10 transition-opacity">
                      <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Visibility Section */}
          <section className="bg-surface-container-lowest p-6 rounded-xl space-y-4">
            <h2 className="font-jakarta font-bold text-lg text-primary">Visibility</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">public</span>
                  <div className="text-sm">
                    <div className="font-bold text-on-surface">Listed</div>
                    <div className="text-xs text-on-surface-variant">Visible to all Bazario shoppers</div>
                  </div>
                </div>
                <input 
                  checked={newProduct.visibility === 'Listed'} 
                  onChange={() => setNewProduct({...newProduct, visibility: 'Listed'})}
                  className="text-secondary focus:ring-secondary w-5 h-5 cursor-pointer" 
                  name="visibility" 
                  type="radio"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">visibility_off</span>
                  <div className="text-sm">
                    <div className="font-bold text-on-surface">Private</div>
                    <div className="text-xs text-on-surface-variant">Only visible via direct link</div>
                  </div>
                </div>
                <input 
                  checked={newProduct.visibility === 'Private'} 
                  onChange={() => setNewProduct({...newProduct, visibility: 'Private'})}
                  className="text-secondary focus:ring-secondary w-5 h-5 cursor-pointer" 
                  name="visibility" 
                  type="radio"
                />
              </label>
            </div>
          </section>
        </div>

        {/* Right Side: General Info & Pricing/Logistics */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
            <h2 className="font-jakarta font-bold text-xl text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">info</span>
              General Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Image URL</label>
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface" 
                  placeholder="https://..." 
                  type="url" 
                  value={newProduct.image_url || ''} 
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta font-semibold">Product Title</label>
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface placeholder:text-outline/50" 
                  placeholder="e.g. Handcrafted Indigo Ceramic Vase" 
                  type="text" 
                  value={newProduct.name || ''} 
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Description</label>
                <textarea 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface placeholder:text-outline/50" 
                  placeholder="Tell the story behind this piece..." 
                  rows="6" 
                  value={newProduct.description || ''} 
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Category</label>
                  <select 
                    value={newProduct.category || 'Home & Living'}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface appearance-none"
                  >
                    <option value="Home & Living">Home &amp; Living</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Art & Decor">Art &amp; Decor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Stock Quantity</label>
                  <div className="flex items-center bg-surface-container-highest rounded-xl overflow-hidden px-2">
                    <button 
                      type="button" 
                      onClick={() => setNewProduct({...newProduct, stock_quantity: Math.max(0, (newProduct.stock_quantity || 0) - 1)})}
                      className="p-2 text-primary hover:bg-surface-container-low rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <input 
                      className="w-full bg-transparent border-none text-center focus:ring-0 font-bold text-primary" 
                      type="number" 
                      min="0"
                      value={newProduct.stock_quantity ?? 1}
                      onChange={(e) => setNewProduct({...newProduct, stock_quantity: Math.max(0, parseInt(e.target.value) || 0)})}
                    />
                    <button 
                      type="button"
                      onClick={() => setNewProduct({...newProduct, stock_quantity: (newProduct.stock_quantity || 0) + 1})}
                      className="p-2 text-primary hover:bg-surface-container-low rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-l-4 border-secondary">
            <h2 className="font-jakarta font-bold text-xl text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">payments</span>
              Pricing &amp; Logistics
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Base Price</label>
                <div className="relative flex items-center">
                  <span className="absolute left-5 font-jakarta font-bold text-secondary text-lg">₹</span>
                  <input 
                    className="w-full bg-surface-container-highest border-none rounded-xl pl-12 pr-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-2xl font-bold text-on-surface" 
                    placeholder="0.00" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    value={newProduct.price || ''} 
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                    required
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant mt-2 px-1">Taxes will be calculated at checkout.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">SKU (Optional)</label>
                <input 
                  className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface" 
                  placeholder="BZ-HOME-001" 
                  type="text"
                  value={newProduct.sku || ''}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                />
                <p className="text-[10px] text-on-surface-variant mt-2 px-1">Unique internal stock keeping unit.</p>
              </div>
            </div>
            
            {/* Shipping Profile */}
            <div className="mt-8 pt-6 border-t border-outline-variant/10">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-jakarta font-bold text-on-surface">Shipping Profile</h3>
                  <p className="text-xs text-on-surface-variant font-medium mb-3">Define the fulfillment speed and regions</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Profile Type</label>
                    <select
                      value={newProduct.shipping_profile || 'Standard'}
                      onChange={(e) => setNewProduct({...newProduct, shipping_profile: e.target.value})}
                      className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface text-sm appearance-none"
                    >
                      <option value="Standard">Standard Shipping</option>
                      <option value="Express">Express Shipping</option>
                      <option value="Free">Free Shipping</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Delivery Time (Days)</label>
                    <input 
                      className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface text-sm" 
                      type="number" 
                      min="1"
                      max="60"
                      value={newProduct.shipping_days ?? 5}
                      onChange={(e) => setNewProduct({...newProduct, shipping_days: parseInt(e.target.value) || 5})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="relative group cursor-help bg-tertiary-container text-white p-5 rounded-xl flex items-start gap-4">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
                <div className="bg-neutral-900/95 text-white text-xs font-semibold font-jakarta py-2 px-3.5 rounded-lg shadow-xl backdrop-blur-sm border border-white/10 whitespace-nowrap flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-amber-400" style={{fontVariationSettings: "'FILL' 1"}}>info</span>
                  Coming soon...
                </div>
                <div className="w-2 h-2 bg-neutral-900/95 rotate-45 border-r border-b border-white/10 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>

              <div className="p-2 bg-on-tertiary-container/20 rounded-lg">
                <span className="material-symbols-outlined text-white">bolt</span>
              </div>
              <div>
                <div className="font-jakarta font-bold">Smart Pricing</div>
                <p className="text-xs text-tertiary-fixed opacity-80 leading-relaxed mt-1">Automatically adjust prices based on market trends to stay competitive.</p>
              </div>
            </div>
            <div className="relative group cursor-help bg-surface-container-high p-5 rounded-xl flex items-start gap-4">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-50">
                <div className="bg-neutral-900/95 text-white text-xs font-semibold font-jakarta py-2 px-3.5 rounded-lg shadow-xl backdrop-blur-sm border border-white/10 whitespace-nowrap flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-amber-400" style={{fontVariationSettings: "'FILL' 1"}}>info</span>
                  Coming soon...
                </div>
                <div className="w-2 h-2 bg-neutral-900/95 rotate-45 border-r border-b border-white/10 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
              </div>

              <div className="p-2 bg-on-surface-variant/10 rounded-lg">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
              </div>
              <div>
                <div className="font-jakarta font-bold text-on-surface">AI Optimizer</div>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">Let Bazario AI optimize your product title and description for higher SEO reach.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};

export default AddProductContent;
