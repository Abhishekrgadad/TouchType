import { useState, useEffect, useCallback } from 'react';
import { TypingStats, TestSettings } from '../types';

const getRandomText = async (wordCount: number) => {
  try {
    const response = await fetch(`https://api.quotable.io/random?minLength=${wordCount * 4}&maxLength=${wordCount * 7}`);
    const data = await response.json();
    return data.content;
  } catch (error) {
    return "The quick brown fox jumps over the lazy dog. This is a fallback text in case the API fails to respond.";
  }
};

export const useTypingTest = (settings: TestSettings) => {
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    cpm: 0,
    accuracy: 100,
    errors: 0,
    streak: 0,
    rawWpm: 0,
  });

  const calculateStats = useCallback(() => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const words = currentIndex / 5; // standard word length
    const errors = [...text.slice(0, currentIndex)].filter((char, i) => 
      text[i] !== text[i]).length;
    
    const wpm = Math.round(words / timeElapsed);
    const cpm = Math.round(currentIndex / timeElapsed);
    const accuracy = Math.round(((currentIndex - errors) / currentIndex) * 100) || 100;

    setStats({
      wpm,
      cpm,
      accuracy,
      errors,
      streak: errors === 0 ? stats.streak + 1 : 0,
      rawWpm: Math.round(currentIndex / 5 / timeElapsed),
    });
  }, [currentIndex, text, startTime, stats.streak]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isRunning) return;

    if (currentIndex < text.length && event.key === text[currentIndex]) {
      setCurrentIndex(prev => prev + 1);
      calculateStats();
    }
  }, [isRunning, currentIndex, text, calculateStats]);

  useEffect(() => {
    if (isRunning) {
      window.addEventListener('keypress', handleKeyPress);
      return () => window.removeEventListener('keypress', handleKeyPress);
    }
  }, [isRunning, handleKeyPress]);

  useEffect(() => {
    if (isRunning && settings.mode === 'time' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
        calculateStats();
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isRunning, timeLeft, settings.mode, calculateStats]);

  const startTest = useCallback(async () => {
    const wordCount = settings.timeLimit ? settings.timeLimit * 3 : 30; // Approximate words based on time
    const newText = await getRandomText(wordCount);
    setText(newText);
    setCurrentIndex(0);
    setIsRunning(true);
    setStartTime(Date.now());
    if (settings.mode === 'time') {
      setTimeLeft(settings.timeLimit!);
    } else {
      setTimeLeft(0);
    }
  }, [settings]);

  return {
    text,
    currentIndex,
    isRunning,
    timeLeft,
    stats,
    startTest,
  };
};