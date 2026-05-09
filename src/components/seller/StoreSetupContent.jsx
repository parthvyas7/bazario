import React from 'react';

const StoreSetupContent = () => {
  return (
    <div className="flex-1 p-8 min-h-screen">


<aside className="hidden lg:flex lg:w-2/5 p-12 flex-col justify-between bg-surface-container-low sticky top-0 h-screen">
<div className="space-y-8">
<div className="font-plus-jakarta font-extrabold text-3xl tracking-tighter text-primary">Bazario</div>
<div className="space-y-4">
<h1 className="font-plus-jakarta text-5xl font-extrabold tracking-tight text-primary leading-tight">
                        Define your <span className="text-secondary">creative</span> footprint.
                    </h1>
<p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                        Join an elite circle of merchants. We treat every storefront like a digital gallery. Start curating your space today.
                    </p>
</div>
</div>

<div className="relative mt-12 group">
<div className="absolute -top-12 -left-6 bg-secondary text-white px-6 py-3 rounded-full font-plus-jakarta font-bold text-sm tracking-widest uppercase z-10 shadow-xl">
                    Elite Tier
                </div>
<div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500">
<img alt="Boutique Display" className="w-full h-80 object-cover" data-alt="Close-up of a high-end minimalist boutique interior with designer leather bags displayed on elegant white stone pedestals" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVyAuNSfI7jG39EDclUglPPUMPQZct3QQQ5lCyKtWftIdaEmIoQfNCl_ck0S0v4Bj0xcbsog3BZy97mGoLLp9UejLbt05l-mwZsNa0q64ul2vgweYrtRu2-9ezpkde-Z-a55QJUE0KDHzY-M4vYD3rlbOCmFmN9buvaJ0sFXVLzo2tL8UUvrHXS1egEry7U_-j6Kfr5fzIvf1sdsfILyzpJUo6sdAkI4ZdBUOl5FrLnddxf0bi_jjFl6bAGgV8Gm0kNJB3qhgY9nA"/>
<div className="p-6">
<div className="flex justify-between items-end">
<div>
<p className="text-xs font-plus-jakarta font-bold uppercase tracking-widest text-primary/40">Inspiration</p>
<h3 className="text-2xl font-plus-jakarta font-bold text-primary">The Studio Look</h3>
</div>
<span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
</div>
</div>
</div>
</div>
<div className="flex gap-4 items-center opacity-60 text-xs font-medium uppercase tracking-widest">
<span>01. Identity</span>
<span className="w-8 h-px bg-primary/20"></span>
<span>02. Gallery</span>
<span className="w-8 h-px bg-primary/20"></span>
<span>03. Launch</span>
</div>
</aside>

<section className="flex-grow flex items-center justify-center p-6 md:p-16">
<div className="max-w-xl w-full">

<header className="mb-12">
<div className="flex items-center gap-2 mb-4">
<span className="px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full uppercase tracking-tighter">Step 1 of 3</span>
<div className="h-1 flex-grow bg-surface-container-high rounded-full overflow-hidden">
<div className="w-1/3 h-full bg-primary"></div>
</div>
</div>
<h2 className="text-3xl font-plus-jakarta font-extrabold text-primary tracking-tight">Storefront Setup</h2>
<p className="text-on-surface-variant mt-2 font-medium">How should the world see your brand?</p>
</header>
<form className="space-y-8">

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="col-span-2 md:col-span-2 group">
<label className="block text-sm font-plus-jakarta font-bold text-primary mb-2 tracking-tight">Store Name</label>
<input className="w-full bg-surface-container-highest border-none rounded-lg px-5 py-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all duration-200" placeholder="e.g. The Indigo Artisan" type="text"/>
</div>

<div className="col-span-2 md:col-span-1">
<label className="block text-sm font-plus-jakarta font-bold text-primary mb-2 tracking-tight">Brand Mark (Logo)</label>
<div className="relative h-48 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant flex flex-col items-center justify-center group hover:bg-surface-container-high cursor-pointer transition-colors">
<span className="material-symbols-outlined text-4xl text-primary/40 mb-2">add_photo_alternate</span>
<p className="text-xs font-inter font-medium text-on-surface-variant">Click to Upload</p>
<p className="text-[10px] text-outline mt-1">PNG, JPG up to 5MB</p>
</div>
</div>

<div className="col-span-2 md:col-span-1 flex flex-col justify-center p-6 bg-primary-container/10 rounded-xl">
<span className="material-symbols-outlined text-primary mb-3">lightbulb</span>
<h4 className="font-plus-jakarta font-bold text-primary text-sm mb-1">Curation Tip</h4>
<p className="text-xs text-on-primary-fixed-variant leading-relaxed">A clean, minimalist logo increases customer trust by up to 40%. Avoid busy patterns.</p>
</div>

<div className="col-span-2">
<label className="block text-sm font-plus-jakarta font-bold text-primary mb-2 tracking-tight">Store Description</label>
<textarea className="w-full bg-surface-container-highest border-none rounded-lg px-5 py-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline transition-all duration-200" placeholder="Tell your brand's story..." rows="4"></textarea>
</div>

<div className="col-span-2 space-y-4">
<label className="block text-sm font-plus-jakarta font-bold text-primary mb-2 tracking-tight">Connect Channels</label>
<div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl">
<div className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-lg">
<span className="material-symbols-outlined text-primary">public</span>
</div>
<input className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-inter" placeholder="instagram.com/yourbrand" type="text"/>
</div>
<div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl">
<div className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-lg">
<span className="material-symbols-outlined text-primary">link</span>
</div>
<input className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-inter" placeholder="yourwebsite.com" type="text"/>
</div>
</div>
</div>

<div className="pt-8 flex flex-col md:flex-row items-center gap-4">
<button className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-plus-jakarta font-extrabold text-sm tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" type="submit">
                            Save &amp; Continue
                        </button>
<button className="w-full md:w-auto px-10 py-4 text-primary font-plus-jakarta font-bold text-sm hover:bg-surface-container-low rounded-full transition-colors" type="button">
                            Skip for now
                        </button>
</div>
</form>
</div>
</section>

    </div>
  );
};
export default StoreSetupContent;
