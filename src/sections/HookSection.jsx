import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const HookSection = ({ data }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. حماية الكود: البحث عن العنوان في title أو workflowName، وإن لم يوجد نضع عنواناً افتراضياً
  const rawTitle = data?.title || data?.workflowName || "Awesome Tech Tip!";
  
  // 2. التأكد من أن العنوان عبارة عن نص (String) لتجنب خطأ length
  const titleString = typeof rawTitle === 'string' ? rawTitle : String(rawTitle);
  
  // 3. تقسيم النص إلى كلمات لعمل أنيميشن
  const words = titleString.split(' ');

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '80px' }}>
      <h1 style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
        {words.map((word, index) => {
          // أنيميشن لظهور كل كلمة بشكل متتالٍ
          const scale = spring({
            fps,
            frame: frame - index * 5,
            config: { damping: 12 },
          });
          
          return (
            <span key={index} style={{ 
              transform: `scale(${scale})`, 
              display: 'inline-block',
              fontSize: '110px',
              color: 'white',
              fontWeight: 'bold',
              textShadow: '4px 4px 10px rgba(0,0,0,0.5)'
            }}>
              {word}
            </span>
          );
        })}
      </h1>
    </AbsoluteFill>
  );
};
