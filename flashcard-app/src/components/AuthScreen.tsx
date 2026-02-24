import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  onBack: () => void;
}

export default function AuthScreen({ onBack }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register, loginWithGoogle, continueAsGuest } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError('სახელი აუცილებელია');
          setLoading(false);
          return;
        }
        await register(email, password, displayName.trim());
      }
      onBack(); // Go back to main screen after successful auth
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await loginWithGoogle();
      onBack(); // Go back to main screen after successful auth
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError('Google შესვლა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  }

  function handleContinueAsGuest() {
    continueAsGuest();
    onBack();
  }

  function getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'არასწორი ელ-ფოსტა ან პაროლი';
      case 'auth/email-already-in-use':
        return 'ეს ელ-ფოსტა უკვე გამოყენებულია';
      case 'auth/weak-password':
        return 'პაროლი ძალიან სუსტია (მინიმუმ 6 სიმბოლო)';
      case 'auth/invalid-email':
        return 'არასწორი ელ-ფოსტის ფორმატი';
      case 'auth/network-request-failed':
        return 'ქსელის შეცდომა. შეამოწმეთ ინტერნეტ კავშირი';
      default:
        return 'შეცდომა მოხდა. თავიდან სცადეთ';
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E] text-white">
      {/* Header */}
      <header className="px-4 py-4 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#C8C8C0] hover:text-white text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            უკან
          </button>
        </div>
      </header>

      <div className="px-4 py-8 max-w-sm mx-auto">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            <span className="text-[#007AFF]">Fluent</span>Ge
          </h1>
          <p className="text-[#C8C8C0] text-sm">
            {isLogin ? 'შედით თქვენს ანგარიშში' : 'შექმენით ახალი ანგარიში'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 mb-6">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-[#C8C8C0] mb-2">
                სახელი
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#C8C8C0]/50 focus:outline-none focus:border-[#007AFF] transition-colors"
                placeholder="თქვენი სახელი"
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#C8C8C0] mb-2">
              ელ-ფოსტა
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#242426] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#C8C8C0]/50 focus:outline-none focus:border-[#007AFF] transition-colors"
              placeholder="example@gmail.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#C8C8C0] mb-2">
              პაროლი
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#242426] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#C8C8C0]/50 focus:outline-none focus:border-[#007AFF] transition-colors"
              placeholder="მინიმუმ 6 სიმბოლო"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007AFF] hover:bg-[#0056CC] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 font-semibold text-white transition-colors"
          >
            {loading ? '⏳ დაელოდეთ...' : isLogin ? 'შესვლა' : 'რეგისტრაცია'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[#C8C8C0] text-sm px-4">ან</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-[#242426] hover:bg-[#2A2A2C] border border-white/10 rounded-xl py-3 flex items-center justify-center gap-3 font-semibold text-white transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google-ით შესვლა
        </button>

        {/* Continue as Guest */}
        <button
          onClick={handleContinueAsGuest}
          disabled={loading}
          className="w-full mt-4 text-[#C8C8C0] hover:text-white text-sm py-2 transition-colors disabled:opacity-50"
        >
          სტუმრად გაგრძელება
        </button>

        {/* Toggle Login/Register */}
        <div className="text-center mt-6">
          <span className="text-[#C8C8C0] text-sm">
            {isLogin ? 'არ გაქვთ ანგარიში? ' : 'უკვე გაქვთ ანგარიში? '}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setEmail('');
              setPassword('');
              setDisplayName('');
            }}
            disabled={loading}
            className="text-[#007AFF] hover:text-[#0056CC] text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLogin ? 'რეგისტრაცია' : 'შესვლა'}
          </button>
        </div>

        {/* Free tier info */}
        <div className="mt-8 p-4 bg-[#242426]/50 rounded-xl border border-white/5">
          <h3 className="font-semibold text-sm mb-2 text-[#C8C8C0]">უფასო ხელმისაწვდომობა:</h3>
          <ul className="text-xs text-[#C8C8C0]/80 space-y-1">
            <li>• 3 უფასო დეკი (მისალმება, რიცხვები, საკვები)</li>
            <li>• მიღწევების თვალყურეზ აღბა მხოლოდ რეგისტრირებული მომხმარებლებისთვის</li>
            <li>• სტუმრების პროგრესი არ ინახება</li>
          </ul>
        </div>
      </div>
    </div>
  );
}