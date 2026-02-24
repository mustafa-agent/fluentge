import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu() {
  const { currentUser, userProfile, logout, isGuest } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isGuest) {
    return (
      <div className="text-xs text-[#C8C8C0]">
        სტუმარი
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return null;
  }

  async function handleLogout() {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:text-white transition-colors"
      >
        {userProfile.photoURL ? (
          <img
            src={userProfile.photoURL}
            alt={userProfile.displayName}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-xs font-bold">
            {userProfile.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-[#C8C8C0] hidden sm:inline">{userProfile.displayName}</span>
        <svg 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`text-[#C8C8C0] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-[#242426] rounded-xl border border-white/10 shadow-2xl z-20">
            {/* User Info */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {userProfile.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center text-white font-bold">
                    {userProfile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{userProfile.displayName}</p>
                  <p className="text-xs text-[#C8C8C0] truncate">{userProfile.email}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4 border-b border-white/10">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-[#007AFF]">{userProfile.level}</div>
                  <div className="text-xs text-[#C8C8C0]">დონე</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#FF9500]">{userProfile.streak}</div>
                  <div className="text-xs text-[#C8C8C0]">სერია</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-medium text-center">{userProfile.totalXP} XP</div>
                <div className="h-2 bg-[#1C1C1E] rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-[#007AFF] rounded-full transition-all duration-300"
                    style={{ width: `${(userProfile.totalXP % 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Premium Status */}
            <div className="p-4 border-b border-white/10">
              {userProfile.isPremium ? (
                <div className="flex items-center gap-2 text-amber-400">
                  <span className="text-xs">👑</span>
                  <span className="text-sm font-medium">პრემიუმ მომხმარებელი</span>
                </div>
              ) : (
                <a
                  href="/premium/"
                  className="flex items-center gap-2 text-[#C8C8C0] hover:text-amber-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xs">🔒</span>
                  <span className="text-sm">პრემიუმზე განახლება</span>
                </a>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-3 py-2 text-sm text-[#C8C8C0] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                📊 სტატისტიკა
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-3 py-2 text-sm text-[#C8C8C0] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                ⚙️ პარამეტრები
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                🚪 გასვლა
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}