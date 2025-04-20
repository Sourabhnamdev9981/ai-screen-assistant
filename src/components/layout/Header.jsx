import { useEffect, useState } from "react";
import { Sun, Moon, MonitorSmartphone } from "lucide-react";

const Header = ({ onCapture }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="w-full px-4 py-3 flex justify-between items-center bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      {/* Logo & Title */}
      <div className="flex items-center space-x-3">
        <MonitorSmartphone className="text-primary dark:text-white" size={24} />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
          AI Screen Assistant
        </h1>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center space-x-4">
        {/* Trigger screen capture */}
        {onCapture && (
          <button
            onClick={onCapture}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition shadow-sm"
          >
            Capture Screen
          </button>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
