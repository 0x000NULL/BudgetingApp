import React from 'react';
import { Platform } from 'react-native';
import styled from '@emotion/styled';
import { colors } from '../../theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  border-radius: 8px;
  border: none;
  padding: ${props => 
    props.size === 'sm' ? '8px 16px' : 
    props.size === 'lg' ? '16px 32px' : 
    '12px 24px'
  };
  background-color: ${props => 
    props.variant === 'primary' ? colors.primary[500] :
    props.variant === 'secondary' ? colors.grey[200] :
    'transparent'
  };
  border: ${props => 
    props.variant === 'outline' ? `2px solid ${colors.primary[500]}` : 'none'
  };
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onPress,
  children,
}) => {
  const Component = Platform.select({
    web: StyledButton,
    default: StyledButton.withComponent('div'),
  });

  return (
    <Component
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onPress}
    >
      {children}
    </Component>
  );
}; 