import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img } from 'remotion';
import { COLORS, FONTS, SHADOWS, VIDEO_TYPE_GRADIENTS } from '../styles';

export const CTASection = ({ data }) => {
  const frame = useCurrentFrame();
  const videoType = data?.videoType || 'fix';
  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const logoBase64 = data?.logoBase64 || null;

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const contentY = interpolate(frame, [5, 22], [100, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const contentOpacity = interpolate(frame, [5, 22], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = interpolate(frame, [18, 30], [0.6, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.7)) });
  const logoScale = interpolate(frame, [0, 18], [0.4, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 40,
      fontFamily: FONTS.body,
      padding: '100px 50px',
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        inset: -100,
        background: `radial-gradient(circle at 50% 50%, ${gradient[0]}20 0%, ${gradient[1]}10 40%, ${COLORS.bg} 80%)`,
        filter: 'blur(80px)',
        opacity: bgOpacity,
        zIndex: 0,
      }} />

      {/* Floating orbs */}
      {[0, 1].map((i) => {
        const t = ((frame + i * 200) % (30 * 10)) / (30 * 10);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${20 + Math.sin(t * Math.PI * 2 + i * 3) * 30}%`,
            top: `${20 + Math.cos(t * Math.PI * 2 + i * 2) * 20}%`,
            width: 300 + i * 200,
            height: 300 + i * 200,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${gradient[i % 2]}${15 + i * 10} 0%, transparent 70%)`,
            filter: 'blur(50px)',
            zIndex: 1,
            transform: 'translate(-50%, -50%)',
          }} />
        );
      })}

      {/* Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`,
        backgroundSize: '50px 50px',
        zIndex: 1,
      }} />

      {/* Logo */}
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
            width: 110, height: 110, borderRadius: 28, objectFit: 'contain',
            filter: `drop-shadow(0 16px 40px ${gradient[0]}60)`,
          }} />
        ) : (
          <div style={{
            width: 110, height: 110, borderRadius: 28,
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 52, boxShadow: SHADOWS.glow,
          }}>🚀</div>
        )}
        <span style={{
          fontFamily: FONTS.heading, fontSize: 42, fontWeight: 800,
          color: COLORS.text, letterSpacing: -1,
          textShadow: `0 0 60px ${gradient[0]}40`,
        }}>SmartRemoteGigs</span>
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
          fontSize: 58,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.15,
          fontFamily: FONTS.heading,
          letterSpacing: -1,
          textShadow: `0 4px 30px ${gradient[0]}30`,
        }}>
          {data?.ctaTitle || 'Work Smarter, Not Harder'}
        </h2>
        <p style={{
          margin: '28px 0 0',
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
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          color: COLORS.white,
          padding: '26px 60px',
          borderRadius: 20,
          fontSize: 26,
          fontWeight: 700,
          fontFamily: FONTS.heading,
          boxShadow: SHADOWS.button,
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
        gap: 36,
        marginTop: 16,
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
              boxShadow: `0 0 10px ${COLORS.success}60`,
            }} />
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
