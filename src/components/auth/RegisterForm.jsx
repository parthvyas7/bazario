import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: 'buyer', // Default role
    storeName: '',
    storeDescription: ''
  });
  
  const { signUp, user, profile, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      if (profile?.user_type === 'seller') {
        navigate('/seller-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, profile, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'confirmPassword' || name === 'password') {
      if (name === 'confirmPassword' && value !== formData.password) {
        setPasswordError('Passwords do not match');
      } else if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.role,
        {
          name: formData.name,
          full_name: formData.name,
          storeName: formData.storeName,
          storeDescription: formData.storeDescription
        }
      );
      
      navigate(`/login${location.search}`);
    } catch (err) {
      // Error is handled by the store
    }
  };
  
  return (
    <main className="flex bg-surface-container my-8 items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden rounded-xl mx-4 shadow-sm border border-outline-variant/20">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg border border-outline-variant/10 relative z-10">
        
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_JzgF4uAhdzPsBrTV6uyaW6LaV62_tR1UPJbET6Z3nSe3l0wqUlpsV08sZkapGffiaZO6ASMUdEtraLE1_jKPsLmE4b4RhCDaOmiuHBSaHdkUyuBYfHSUD_2weDnjOqplIy_Inu0hGmkj7q-cAraGb7wJ7PZrYh9W6jcmPMnZC7PEaJ_-GcJsHNzVCSh6zHQT6kgLM74f6voOHhsxMOfHfiFTI_JFvOZd8-KJg5iQZAe-EPzzPCqSMZw1wYgt8tukNlS4P-a9QjU')",
              backgroundSize: 'cover'
            }}
          ></div>
          <div className="relative z-10">
            <span className="font-headline font-black text-3xl tracking-tighter text-white">Bazario</span>
            <h2 className="mt-20 font-headline font-extrabold text-5xl text-white leading-tight tracking-tight">
              Build Your <br/>
              <span className="text-secondary-fixed">Collection.</span>
            </h2>
            <p className="mt-6 text-on-primary-container text-lg max-w-md font-medium">
              Join an elite circle of merchants and collectors. Create your account to start managing your inventory or discovering unique products.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest max-h-[80vh] overflow-y-auto">
          <div className="lg:hidden mb-8">
            <span className="font-headline font-black text-2xl tracking-tighter text-primary">Bazario</span>
          </div>
          
          <div className="mb-8">
            <h1 className="font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">Create Account</h1>
            <p className="text-on-surface-variant">Please enter your details to register.</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                formData.role === 'buyer' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-transparent bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 0"}}>shopping_bag</span>
              <span className="text-sm">I am a Buyer</span>
            </button>
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, role: 'seller' }))}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                formData.role === 'seller' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-transparent bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 0"}}>storefront</span>
              <span className="text-sm">I am a Seller</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="name">Name</label>
                <input 
                  id="name" name="name" type="text" required
                  value={formData.name} onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email</label>
                <input 
                  id="email" name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="password">Password</label>
                <input 
                  id="password" name="password" type="password" required
                  value={formData.password} onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  id="confirmPassword" name="confirmPassword" type="password" required
                  value={formData.confirmPassword} onChange={handleChange}
                  className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                />
                {passwordError && <p className="text-xs text-error font-medium pl-1">{passwordError}</p>}
              </div>
            </div>

            {formData.role === 'seller' && (
              <div className="space-y-4 pt-2 border-t border-outline-variant/20 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="storeName">Store Name</label>
                  <input 
                    id="storeName" name="storeName" type="text" required={formData.role === 'seller'}
                    value={formData.storeName} onChange={handleChange}
                    className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="storeDescription">Store Description</label>
                  <textarea 
                    id="storeDescription" name="storeDescription" rows="2"
                    value={formData.storeDescription} onChange={handleChange}
                    className="w-full px-5 py-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                  />
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading || !!passwordError}
              className="w-full py-4 mt-6 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Or sign up with</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="relative group">
                <button
                  type="button"
                  className="w-full flex items-center justify-center py-3 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-xl transition-all cursor-help"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.36-2.89-6.36-6.47s2.85-6.47 6.36-6.47c1.5 0 2.87.53 3.96 1.58L21 4.12C18.66 1.96 15.65.8 12.24.8 5.92.8 1 5.6 1 12s4.92 11.2 11.24 11.2c6.22 0 11-4.38 11-11.2 0-.69-.08-1.35-.24-1.92l-10.76.005z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 pointer-events-none transition-all duration-300 bg-neutral-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg z-50 whitespace-nowrap border border-white/10">
                  Coming soon...
                </div>
              </div>
              
              <div className="relative group">
                <button
                  type="button"
                  className="w-full flex items-center justify-center py-3 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-xl transition-all cursor-help"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 pointer-events-none transition-all duration-300 bg-neutral-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg z-50 whitespace-nowrap border border-white/10">
                  Coming soon...
                </div>
              </div>

              <div className="relative group">
                <button
                  type="button"
                  className="w-full flex items-center justify-center py-3 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-xl transition-all cursor-help"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.1.08.21.08.31.08.88 0 2-.6 2.5-1.41z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 pointer-events-none transition-all duration-300 bg-neutral-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg z-50 whitespace-nowrap border border-white/10">
                  Coming soon...
                </div>
              </div>

              <div className="relative group">
                <button
                  type="button"
                  className="w-full flex items-center justify-center py-3 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-xl transition-all cursor-help"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.437 22 12.017 22 6.484 17.522 2 12 2z"/>
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 pointer-events-none transition-all duration-300 bg-neutral-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg z-50 whitespace-nowrap border border-white/10">
                  Coming soon...
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-center text-on-surface-variant text-sm font-medium">
            Already have an account? 
            <Link to={`/login${location.search}`} className="text-primary font-bold hover:underline underline-offset-4 ml-2">Sign In</Link>
          </p>
          <div className="mt-4 text-center text-xs text-on-surface-variant border-t border-outline-variant/10 pt-4">
            Just visiting? <Link to={`/login${location.search}`} className="text-secondary font-bold hover:underline underline-offset-4">Try Instant Guest Access</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterForm;