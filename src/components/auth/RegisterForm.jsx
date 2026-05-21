import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
          username: formData.username,
          storeName: formData.storeName,
          storeDescription: formData.storeDescription
        }
      );
      
      navigate('/login');
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
              Curate Your <br/>
              <span className="text-secondary-fixed">Collection.</span>
            </h2>
            <p className="mt-6 text-on-primary-container text-lg max-w-md font-medium">
              Join an elite circle of merchants and collectors. Create your account to start managing your inventory or discovering curated products.
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
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="username">Username</label>
                <input 
                  id="username" name="username" type="text" required
                  value={formData.username} onChange={handleChange}
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
          
          <p className="mt-8 text-center text-on-surface-variant text-sm font-medium">
            Already have an account? 
            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-2">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterForm;