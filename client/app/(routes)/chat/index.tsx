import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const Chat = () => {
 

 
  return (
    <View style={styles.container}>
      <WebView source={{uri:"https://tawk.to/chat/682c59806e36731916f0915e/1irmjr7m7"}}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatBox: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default Chat;
