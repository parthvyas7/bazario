import React from 'react';

const AddProductContent = ({ newProduct, setNewProduct, handleAddProduct, editingProduct, handleCancelEdit }) => {
  return (
    <div className="flex-1 p-8 min-h-screen bg-surface-bright">

<header className="mb-10 flex justify-between items-end">
<div>
<nav className="flex items-center gap-2 text-on-surface-variant text-xs mb-2 font-medium uppercase tracking-wider">
<span>Inventory</span>
<span className="material-symbols-outlined text-[12px]">chevron_right</span>
<span className="text-primary font-bold">List Product</span>
</nav>
<h1 className="text-4xl font-headline font-extrabold text-primary tracking-tighter">Add New Product</h1>
<p className="text-on-surface-variant mt-2 font-body text-sm">Create a high-impact listing for your curated collection.</p>
</div>
<div className="flex gap-4">
<button onClick={handleCancelEdit} className="px-6 py-2.5 rounded-full font-jakarta font-semibold text-primary hover:bg-surface-container-low transition-colors">Discard Draft</button>
<button onClick={handleAddProduct} className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-jakarta font-bold shadow-lg hover:shadow-primary/20 transition-all">{editingProduct ? "Save Changes" : "Publish Listing"}</button>
</div>
</header>
<div className="grid grid-cols-12 gap-8">

<div className="col-span-12 lg:col-span-5 space-y-6">
<section className="bg-surface-container-lowest p-6 rounded-xl space-y-4">
<div className="flex items-center justify-between">
<h2 className="font-jakarta font-bold text-lg text-primary">Product Visuals</h2>
<span className="text-xs text-on-surface-variant font-medium">Recommended: 1080x1080px</span>
</div>
<div className="relative aspect-square rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 text-center p-8 group hover:border-primary/50 transition-colors">
<div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm text-primary transition-transform group-hover:scale-110">
<span className="material-symbols-outlined text-3xl">upload_file</span>
</div>
<div>
<p className="font-jakarta font-bold text-on-surface">Drop high-res images here</p>
<p className="text-xs text-on-surface-variant mt-1">PNG, JPG or WEBP (Max 5MB)</p>
</div>
<button className="px-4 py-2 bg-surface-container-high rounded-lg text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors">Browse Files</button>
</div>
<div className="grid grid-cols-4 gap-3">
<div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/20 overflow-hidden relative group">
<img alt="Placeholder" className="w-full h-full object-cover grayscale opacity-40" data-alt="Clean minimal studio photography of a handcrafted ceramic vase with soft directional light shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABAPbYtghm_ZDfx-Qb1fgQAHOK4hgjHBZfAwsD2wflEwH1Roq6IZoTLb00B-gSwPUwZQ0KNkY3k6JsTeyt9_yCsBRMbjrvqAmhRwiy0cPIJAbTPwmnEv2Sw82NxoP_BR542cdtAQcoLgs_K9fau0WunjSoUEbgw3CI7aAso4rDu_hCi10_iSHShKilFS1de-GVqcKJHYkaJEL3arcfIt6higO_zqkQnbgwHhHCG4taPNVLqljBx-c95k8DIfziMao9pyWjn2oo1Fc"/>
<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/10 transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-primary">add</span>
</div>
</div>
<div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/20 overflow-hidden relative group">
<img alt="Placeholder" className="w-full h-full object-cover grayscale opacity-40" data-alt="Close up texture shot of organic linen fabric with natural sunlight and shadow patterns" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPTcKX_L75cXfFLGciqZSc-4shYmxfsch1f7YzoJ_G4CQ7LMxUi971mmeJcyEfOxVoxI9l5RIO2wNWHIMu2TuXp_N8hIZkd5CLlr3ZgsAYAt8jdjJralKfZpNMkbxTf5LYsej3c_GYFgwRFuEigAJN2ohs7a-Zu_vCbR_VAmpxAS-_ZnFP4wPIwcKu_NgmiKGkbXdUjXUCgywxcU-2XzQ4X_d-rCboZH7xFVPyjbqqgQeSnujYc1FR0CzVwJ-yICwzhX-70h482IY"/>
<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/10 transition-opacity cursor-pointer">
<span className="material-symbols-outlined text-primary">add</span>
</div>
</div>
<div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
<span className="material-symbols-outlined text-outline-variant">image_search</span>
</div>
<div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
<span className="material-symbols-outlined text-outline-variant">more_horiz</span>
</div>
</div>
</section>
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
<input checked="" className="text-secondary focus:ring-secondary w-5 h-5" name="visibility" type="radio"/>
</label>
<label className="flex items-center justify-between p-3 rounded-lg border border-outline-variant/20 cursor-pointer hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant">visibility_off</span>
<div className="text-sm">
<div className="font-bold text-on-surface">Private</div>
<div className="text-xs text-on-surface-variant">Only visible via direct link</div>
</div>
</div>
<input className="text-secondary focus:ring-secondary w-5 h-5" name="visibility" type="radio"/>
</label>
</div>
</section>
</div>

<div className="col-span-12 lg:col-span-7 space-y-6">
<section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
<h2 className="font-jakarta font-bold text-xl text-primary mb-6 flex items-center gap-2">
<span className="material-symbols-outlined">info</span>
                        General Information
                    </h2>
<div className="space-y-5">

<div>
  <label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Image URL</label>
  <input className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface" placeholder="https://..." type="text" value={newProduct.image_url} onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})} />
</div>
<div>
<label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Product Title</label>
<input className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface placeholder:text-outline/50" placeholder="e.g. Handcrafted Indigo Ceramic Vase" type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required/>
</div>
<div>
<label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Description</label>
<textarea className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface placeholder:text-outline/50" placeholder="Tell the story behind this piece..." rows="6" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} required></textarea>
</div>
<div className="grid grid-cols-2 gap-6">
<div>
<label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Category</label>
<select className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface appearance-none">
<option>Home &amp; Living</option>
<option>Apparel</option>
<option>Accessories</option>
<option>Art &amp; Decor</option>
</select>
</div>
<div>
<label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">Stock Quantity</label>
<div className="flex items-center bg-surface-container-highest rounded-xl overflow-hidden px-2">
<button className="p-2 text-primary hover:bg-surface-container-low rounded-lg transition-colors">
<span className="material-symbols-outlined">remove</span>
</button>
<input className="w-full bg-transparent border-none text-center focus:ring-0 font-bold text-primary" type="number" value="1"/>
<button className="p-2 text-primary hover:bg-surface-container-low rounded-lg transition-colors">
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
<input className="w-full bg-surface-container-highest border-none rounded-xl pl-12 pr-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-2xl font-bold text-on-surface" placeholder="0.00" type="number" step="0.01" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required/>
</div>
<p className="text-[10px] text-on-surface-variant mt-2 px-1">Taxes will be calculated at checkout.</p>
</div>
<div>
<label className="block text-sm font-bold text-on-surface-variant mb-2 font-jakarta">SKU (Optional)</label>
<input className="w-full bg-surface-container-highest border-none rounded-xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-jakarta text-on-surface" placeholder="BZ-HOME-001" type="text"/>
<p className="text-[10px] text-on-surface-variant mt-2 px-1">Unique internal stock keeping unit.</p>
</div>
</div>
<div className="mt-8 pt-6 border-t border-outline-variant/10">
<div className="flex items-center justify-between">
<div>
<h3 className="font-jakarta font-bold text-on-surface">Shipping Profile</h3>
<p className="text-xs text-on-surface-variant font-medium">Standard 3-5 day regional shipping</p>
</div>
<button className="text-primary text-sm font-bold underline-offset-4 hover:underline">Change Profile</button>
</div>
</div>
</section>
<section className="grid grid-cols-2 gap-4">
<div className="bg-tertiary-container text-white p-5 rounded-xl flex items-start gap-4">
<div className="p-2 bg-on-tertiary-container/20 rounded-lg">
<span className="material-symbols-outlined text-white">bolt</span>
</div>
<div>
<div className="font-jakarta font-bold">Smart Pricing</div>
<p className="text-xs text-tertiary-fixed opacity-80 leading-relaxed mt-1">Automatically adjust prices based on market trends to stay competitive.</p>
</div>
</div>
<div className="bg-surface-container-high p-5 rounded-xl flex items-start gap-4">
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

    </div>
  );
};
export default AddProductContent;
