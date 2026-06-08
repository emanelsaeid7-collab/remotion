import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img } from 'remotion';
import { COLORS, FONTS, SHADOWS, VIDEO_TYPE_GRADIENTS } from '../styles';

export const CTASection = ({ data }) => {
  const frame = useCurrentFrame();
  const videoType = data?.videoType || 'fix';
  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const logoBase64 = data?.logoBase64 || null;

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const contentY = interpolate(frame, [5, 20], [80, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const contentOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = interpolate(frame, [15, 28], [0.7, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.7)) });
  const logoScale = interpolate(frame, [0, 15], [0.5, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 36,
      fontFamily: FONTS.body,
      padding: '80px 50px',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 800,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${gradient[0]}12 0%, ${gradient[1]}08 50%, transparent 70%)`,
        filter: 'blur(100px)',
        opacity: bgOpacity,
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
        backgroundSize: '50px 50px',
        zIndex: 1,
      }} />

      {/* Logo + Brand */}
      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px) scale(${logoScale})`,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>
        {logoBase64 ? (
          <Img src={logoBase64} style={{
            width: 100, height: 100, borderRadius: 28, objectFit: 'contain',
            filter: `drop-shadow(0 12px 30px ${gradient[0]}50)`,
          }} />
        ) : (
          <div style={{
            width: 100, height: 100, borderRadius: 28,
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, boxShadow: SHADOWS.lg,
          }}>🚀</div>
        )}
        <span style={{
          fontFamily: FONTS.heading, fontSize: 44, fontWeight: 800,
          color: COLORS.text, letterSpacing: -1,
          textShadow: `0 0 40px ${gradient[0]}30`,
        }}>
          SmartRemoteGigs
        </span>
      </div>

      {/* Headline */}
      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px)`,
        textAlign: 'center',
        zIndex: 10,
        maxWidth: 800,
      }}>
        <h2 style={{
          margin: 0,
          fontSize: 56,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.15,
          fontFamily: FONTS.heading,
          letterSpacing: -1,
          textShadow: `0 2px 20px ${gradient[0]}20`,
        }}>
          {data?.ctaTitle || 'Work Smarter, Not Harder'}
        </h2>
        <p style={{
          margin: '24px 0 0',
          fontSize: 26,
          color: COLORS.textMuted,
          lineHeight: 1.5,
          fontWeight: 400,
        }}>
          {data?.ctaSubtitle || 'Join thousands of digital workers solving problems with AI & modern tools.'}
        </p>
      </div>

      {/* CTA Button */}
      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px) scale(${buttonScale})`,
        zIndex: 10,
        marginTop: 8,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          color: COLORS.white,
          padding: '24px 56px',
          borderRadius: 20,
          fontSize: 26,
          fontWeight: 700,
          fontFamily: FONTS.heading,
          boxShadow: `0 10px 40px ${gradient[0]}50, 0 0 0 1px rgba(255,255,255,0.1)`,
          letterSpacing: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          {logoBase64 && (
            <Img src={logoBase64} style={{
              width: 36, height: 36, borderRadius: 10, objectFit: 'contain',
            }} />
          )}
          {data?.ctaText || '👉 Visit SmartRemoteGigs.com'}
        </div>
      </div>

      {/* Trust indicators */}
      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px)`,
        display: 'flex',
        gap: 32,
        marginTop: 20,
        zIndex: 10,
      }}>
        {['AI Tools', 'Productivity', 'Freelancing'].map((tag, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 17, color: COLORS.textMuted, fontWeight: 600,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: COLORS.success,
              boxShadow: `0 0 8px ${COLORS.success}60`,
            }} />
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
