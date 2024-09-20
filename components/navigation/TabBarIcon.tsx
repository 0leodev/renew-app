import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  const platformSpecificStyle = {
    marginBottom: Platform.OS === 'web' ? 0 : -15,
  };

  return <Ionicons size={28} style={[platformSpecificStyle, style]} {...rest} />;
}
