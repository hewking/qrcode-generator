import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 尝试从 localStorage 获取已存在的 userId
    const storedUserId = localStorage.getItem('qr_user_id');
    
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // 如果不存在，生成新的 userId 并存储
      const newUserId = uuidv4();
      localStorage.setItem('qr_user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  return userId;
}; 