import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export function HelloWave() {

  return (
      <ThemedText style={styles.text}>☕</ThemedText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
