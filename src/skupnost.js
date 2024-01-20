
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import SearchBar from './searchBar';
import UploadPhotoModale from './uploadPhoto.js';


const Skupnost = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SearchBar/> 
      
      <Button title="NEW POST" onPress={toggleModal} />
      <UploadPhotoModale isVisible={isModalVisible} onClose={toggleModal}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flexGrow: 1,
  },
});

export default Skupnost;