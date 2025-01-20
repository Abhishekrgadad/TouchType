import React, { useState } from 'react';
import { Settings, Type } from 'lucide-react';
import { TestSettings, TimeOption } from '../types';
import { useTypingTest } from '../hooks/useTypingTest';

const TypingTest: React.FC = () => {
  const [settings, setSettings] = useState<TestSettings>({
    mode: 'time',
    timeLimit: 60,
    language: 'english',
    includeCaps: true,
    includePunctuation: true,
    includeNumbers: false,
    includeSpecialChars: false,
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { text, currentIndex, isRunning, timeLeft, stats, startTest } = useTypingTest(settings);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-800'
    } transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Type className="w-8 h-8" />
            <h1 className="text-2xl font-bold">TypeMaster</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                settings.mode === 'time'
                  ? theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSettings({ ...settings, mode: 'time' })}
            >
              Time
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                settings.mode === 'words'
                  ? theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSettings({ ...settings, mode: 'words' })}
            >
              Words
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                settings.mode === 'custom'
                  ? theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                  : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSettings({ ...settings, mode: 'custom' })}
            >
              Custom
            </button>
          </div>

          {settings.mode === 'time' && (
            <div className="flex justify-center space-x-4">
              {[15, 30, 60, 120].map((time) => (
                <button
                  key={time}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    settings.timeLimit === time
                      ? theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setSettings({ ...settings, timeLimit: time as TimeOption })}
                >
                  {time}s
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between mb-4">
            <div className="flex space-x-8">
              <div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>WPM</span>
                <p className="text-2xl font-bold">{stats.wpm}</p>
              </div>
              <div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</span>
                <p className="text-2xl font-bold">{stats.accuracy}%</p>
              </div>
              <div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</span>
                <p className="text-2xl font-bold">{timeLeft}s</p>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-lg mb-8 font-mono text-xl leading-relaxed ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            {text.split('').map((char, index) => (
              <span
                key={index}
                className={
                  index === currentIndex
                    ? 'bg-indigo-500 text-white'
                    : index < currentIndex
                    ? theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    : theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }
              >
                {char}
              </span>
            ))}
          </div>

          <button
            className={`mt-4 px-8 py-3 rounded-lg font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
            onClick={startTest}
            disabled={isRunning}
          >
            {isRunning ? 'Test in progress...' : 'Start Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TypingTest;