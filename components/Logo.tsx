import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
  G,
  Rect
} from 'react-native-svg';

interface LogoProps {
  size?: number;
  variant?: 'default' | 'white' | 'dark' | 'splash';
}

/**
 * SmartBachat Logo Component
 *
 * Design concept: A shield containing the Indian Rupee symbol (₹) with an
 * upward growth arrow, representing secure savings and financial growth.
 *
 * Elements:
 * - Shield: Security and protection of savings
 * - Rupee (₹): Indian currency / money
 * - Upward Arrow: Growth and smart investments
 * - Green: Money, growth, prosperity
 * - Gold: Wealth, value, premium
 */
export const Logo: React.FC<LogoProps> = ({ size = 40, variant = 'default' }) => {
  // Color schemes based on variant
  const colors = {
    default: {
      background: '#2e7d32',     // Green background
      shield: '#ffffff',         // White shield
      rupee: '#2e7d32',          // Green rupee
      arrow: '#f1c40f',          // Gold arrow
      accent: '#1b5e20',         // Dark green accent
    },
    white: {
      background: 'transparent',
      shield: '#ffffff',
      rupee: '#ffffff',
      arrow: '#ffffff',
      accent: 'rgba(255,255,255,0.7)',
    },
    dark: {
      background: '#1a1a2e',
      shield: '#ffffff',
      rupee: '#1a1a2e',
      arrow: '#f1c40f',
      accent: '#16213e',
    },
    splash: {
      background: '#f1c40f',     // Gold background for splash
      shield: '#ffffff',
      rupee: '#2e7d32',
      arrow: '#2e7d32',
      accent: '#1b5e20',
    },
  };

  const c = colors[variant];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          {/* Gradient for background */}
          <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={c.background} />
            <Stop offset="100%" stopColor={c.accent} />
          </LinearGradient>

          {/* Gradient for arrow */}
          <LinearGradient id="arrowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor={c.arrow} />
            <Stop offset="100%" stopColor="#ffd700" />
          </LinearGradient>
        </Defs>

        {/* Background Circle */}
        {variant !== 'white' && (
          <Circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />
        )}

        {/* Shield Shape - represents security */}
        <Path
          d="M50 12 L78 24 L78 50 C78 70 50 88 50 88 C50 88 22 70 22 50 L22 24 Z"
          fill={c.shield}
          opacity={variant === 'white' ? 1 : 0.95}
        />

        {/* Inner shield border */}
        <Path
          d="M50 18 L72 28 L72 48 C72 64 50 80 50 80 C50 80 28 64 28 48 L28 28 Z"
          fill="none"
          stroke={c.rupee}
          strokeWidth="1.5"
          opacity={0.3}
        />

        {/* Rupee Symbol (₹) - represents Indian currency/savings */}
        <G>
          {/* Top horizontal line */}
          <Path
            d="M38 32 L62 32"
            stroke={c.rupee}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Second horizontal line */}
          <Path
            d="M38 42 L62 42"
            stroke={c.rupee}
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Vertical stem with diagonal */}
          <Path
            d="M44 32 C52 32 56 36 56 42 C56 48 52 52 44 52"
            stroke={c.rupee}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Diagonal leg of rupee */}
          <Path
            d="M38 42 L56 68"
            stroke={c.rupee}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </G>

        {/* Growth Arrow - represents financial growth */}
        <G>
          {/* Arrow shaft */}
          <Path
            d="M68 72 L68 52"
            stroke="url(#arrowGrad)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Arrow head */}
          <Path
            d="M60 60 L68 50 L76 60"
            stroke="url(#arrowGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logo;

