'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

export function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // First try health check endpoint
        const response = await fetch('http://localhost:8080/health');
        if (response.ok) {
          const data = await response.json();
          console.log('Backend health check:', data);
          setStatus('connected');
        } else {
          throw new Error(`Health check failed: ${response.status}`);
        }
      } catch (err: any) {
        setStatus('error');
        if (err.message.includes('fetch')) {
          setError('Backend not running on port 8080');
        } else if (err.message.includes('CORS')) {
          setError('CORS configuration issue');
        } else {
          setError(err.message || 'Failed to connect to backend');
        }
      }
    };

    checkBackend();
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg">
        Checking backend connection...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg max-w-sm">
        <div className="font-bold">Backend Error</div>
        <div className="text-sm">{error}</div>
        <div className="text-xs mt-1">Make sure your Go backend is running on port 8080</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
      Backend connected ✓
    </div>
  );
}