import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      const { user } = await signIn(email, password);
      if (user) {
        if (user.user_type === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <main className="flex bg-surface-container my-8 items-center justify-center p-4 md:p-8 lg:p-12 relative overflow-hidden rounded-xl mx-4 shadow-sm border border-outline-variant/20">
      {/* Background Editorial Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg border border-outline-variant/10 relative z-10">
        
        {/* Left Side: Editorial Context */}
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
              The Digital Curator's <br/>
              <span className="text-secondary-fixed">Sanctuary.</span>
            </h2>
            <p className="mt-6 text-on-primary-container text-lg max-w-md font-medium">
              Join an elite circle of merchants and collectors. Manage your inventory or discover curated collections with unparalleled precision.
            </p>
          </div>
          <div className="relative z-10 mt-auto">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-white font-headline font-bold text-xl">₹</div>
              <div>
                <p className="text-white font-semibold text-sm">Verified Merchant Ecosystem</p>
                <p className="text-on-primary-container text-xs">Curating excellence since 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest">
          <div className="lg:hidden mb-8">
            <span className="font-headline font-black text-2xl tracking-tighter text-primary">Bazario</span>
          </div>
          
          <div className="mb-10">
            <h1 className="font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant">Please sign in to access your account.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
              <input 
                id="email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                placeholder="curator@bazario.in" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
              </div>
              <div className="relative">
                <input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Bazario'}
            </button>
          </form>
          
          <p className="mt-10 text-center text-on-surface-variant text-sm font-medium">
            Don't have an account? 
            <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4 ml-2">Create Account</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
