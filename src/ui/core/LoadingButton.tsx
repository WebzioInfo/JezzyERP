"use client";

import React from 'react';
import { Button, ButtonProps } from './Button';

interface LoadingButtonProps extends Omit<ButtonProps, 'loading'> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function LoadingButton({
  children,
  isLoading,
  loadingText,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={isLoading || disabled}
      loading={isLoading}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{isLoading && loadingText ? loadingText : children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Button>
  );
}
