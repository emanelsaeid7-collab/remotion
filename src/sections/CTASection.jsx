import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, Img } from 'remotion';
import { COLORS, FONTS, SHADOWS, VIDEO_TYPE_GRADIENTS } from '../styles';

export const CTASection = ({ data }) => {
  const frame = useCurrentFrame();
  const videoType = data?.videoType || 'fix';
  const gradient = VIDEO_TYPE_GRADIENTS[videoType] || VIDEO_TYPE_GRADIENTS.default;
  const logoBase64 = data?.logoBase64 || null;

  const bgOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const contentY = interpolate(frame, [5, 20], [60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const contentOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = interpolate(frame, [15, 25], [0.8, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.7)) });
  const logoScale = interpolate(frame, [0, 15], [0.5, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  return (
    <AbsoluteFill style={{
      backgroundColor: COLORS.bg,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: 32,
      fontFamily: FONTS.body,
      padding: '60px',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 700,
        height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${gradient[0]}18 0%, ${gradient[1]}10 50%, transparent 70%)`,
        filter: 'blur(80px)',
        opacity: bgOpacity,
      }} />

      {/* Logo + Brand */}
      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px) scale(${logoScale})`,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        {logoBase64 ? (
          <Img
            src={logoBase64}
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              objectFit: 'contain',
              filter: `drop-shadow(0 8px 20px ${gradient[0]}40)`,
            }}
          />
        ) : (
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            boxShadow: SHADOWS.md,
          }}>
            🚀
          </div>
        )}
        <span style={{
          fontFamily: FONTS.heading,
          fontSize: 40,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: -1,
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
          fontSize: 52,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.2,
          fontFamily: FONTS.heading,
          letterSpacing: -1,
        }}>
          {data?.ctaTitle || 'Work Smarter, Not Harder'}
        </h2>
        <p style={{
          margin: '20px 0 0',
          fontSize: 24,
          color: COLORS.muted,
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
        marginTop: 16,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          color: COLORS.white,
          padding: '22px 52px',
          borderRadius: 16,
          fontSize: 24,
          fontWeight: 700,
          fontFamily: FONTS.heading,
          boxShadow: `0 10px 30px ${gradient[0]}40, ${SHADOWS.md}`,
          letterSpacing: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          {logoBase64 && (
            <Img
              src={logoBase64}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                objectFit: 'contain',
              }}
            />
          )}
          {data?.ctaText || '👉 Visit SmartRemoteGigs.com'}
        </div>
      </div>

      {/* Trust indicators */}
      <div style={{
        opacity: contentOpacity,
        transform: `translateY(${contentY}px)`,
        display: 'flex',
        gap: 28,
        marginTop: 24,
        zIndex: 10,
      }}>
        {['AI Tools', 'Productivity', 'Freelancing'].map((tag, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 16,
            color: COLORS.muted,
            fontWeight: 600,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: COLORS.success,
            }} />
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
