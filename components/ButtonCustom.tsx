import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, GestureResponderEvent } from 'react-native';

interface FlatButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

const FlatButton: React.FC<FlatButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 13,
    paddingVertical: 18,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.512)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
    textAlign: 'left',
    paddingLeft: 15,
  },
});

export default FlatButton;
