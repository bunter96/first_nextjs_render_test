import { useContext, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { account } from '../../appwriteConfig';
import { 
  Home, 
  TextCursor,
  AudioLines,
  AudioWaveform,  
  Box, 
  Folder, 
  DollarSign, 
  Copy, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);

  const menuItems = [
    { href: '/', label: 'Home', icon: <Home className="w-5 h-5 mr-2" /> },
	{ href: '/browse-models', label: 'Browse Models', icon: <Box className="w-5 h-5 mr-2" /> },
    { href: '/tts', label: 'Text To Speech', icon: <AudioWaveform className="w-5 h-5 mr-2" /> },
    { href: '/voice-cloning', label: 'Voice Cloning', icon: <Copy className="w-5 h-5 mr-2" /> },	
    { href: '/pricing', label: 'Pricing', icon: <DollarSign className="w-5 h-5 mr-2" /> },

  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClass = (href) =>
    `px-4 py-2 border border-gray-300 rounded-md text-gray-600 transition hover:bg-gray-100 flex items-center ${
      router.pathname === href ? 'bg-gray-100' : ''
    }`;

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const CharacterCounter = () => (
    <div className="flex items-center mr-10 text-gray-600">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-1" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
      <span className="text-base font-bold">
        {user?.profile?.char_remaining ?? 0} chars left
      </span>
    </div>
  );

  const DesktopNavItem = ({ href, label, icon }) => (
    <li key={href}>
      <Link href={href} legacyBehavior>
        <a className={buttonClass(href)}>
          {icon}
          {label}
        </a>
      </Link>
    </li>
  );

  const MobileNavItem = ({ href, label, icon, onClick }) => (
    <li key={href}>
      <Link href={href} legacyBehavior>
        <a className="flex items-center text-gray-600 hover:text-gray-800 p-2" onClick={onClick}>
          {icon}
          {label}
        </a>
      </Link>
    </li>
  );

  const AccountDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
      <Link href="/profile" legacyBehavior>
        <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <User className="w-5 h-5 mr-2" />
          Profile
        </a>
      </Link>	
      <Link href="/my-models" legacyBehavior>
        <a className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
          <Folder className="w-5 h-5 mr-2" />
          My Models
        </a>
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
      >
        <LogOut className="w-5 h-5 inline-block mr-2" />
        Logout
      </button>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="w-1/3">
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <span className="font-bold text-xl text-gray-800">TTS Web App</span>
            </a>
          </Link>
        </div>

        <nav className="w-2/3 hidden md:flex justify-center">
          <ul className="flex space-x-2">
            {menuItems.map((item) => (
              <DesktopNavItem key={item.href} {...item} />
            ))}
          </ul>
        </nav>

        <div className="w-1/3 hidden md:flex justify-end items-center">
          {user ? (
            <>
              <CharacterCounter />
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={toggleAccountDropdown}
                  className="px-4 py-2 bg-gray-700 text-white rounded inline-flex justify-center items-center"
                >
                  <span>Account</span>
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isAccountDropdownOpen && <AccountDropdown />}
              </div>
            </>
          ) : (
            <Link href="/login" legacyBehavior>
              <a className="px-4 py-2 border border-blue-600 rounded text-blue-600 hover:bg-blue-600 hover:text-white transition">
                Login
              </a>
            </Link>
          )}
        </div>

        <div className="md:hidden ml-auto">
          <button
            onClick={toggleMobileMenu}
            className={`text-gray-600 hover:text-gray-800 focus:outline-none p-2 ${
              isMobileMenuOpen ? 'bg-gray-200 rounded' : ''
            }`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 p-4">
            {menuItems.map((item) => (
              <MobileNavItem
                key={item.href}
                {...item}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
            <li className="pt-2 border-t border-gray-200">
              <div className="flex items-center text-gray-600 p-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span>{user?.profile?.char_remaining ?? 0} characters remaining</span>
              </div>
            </li>
            <li>
              {user ? (
                <>
                  <Link href="/my-models" legacyBehavior>
                    <a className="flex items-center text-gray-600 hover:text-gray-800 p-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <Folder className="w-5 h-5 mr-2" />
                      My Models
                    </a>
                  </Link>
                  <Link href="/profile" legacyBehavior>
                    <a className="flex items-center text-gray-600 hover:text-gray-800 p-2" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="w-5 h-5 mr-2" />
                      Profile
                    </a>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center w-full text-left text-gray-600 hover:bg-gray-200 p-2"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" legacyBehavior>
                  <a className="block text-blue-600 hover:text-blue-800 p-2">Login</a>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}