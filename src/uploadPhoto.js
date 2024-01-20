import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
//import Modal from 'react-native-modal';


import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://vnkgwghprktqduindnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2d3Z2hwcmt0cWR1aW5kbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjM2NzcsImV4cCI6MjAxNTE5OTY3N30.VQuyv1K8Z2XZXoYfGByktdUnyPQ33H-rXfeiENti7Sw';
const supabase = createClient(supabaseUrl, supabaseKey);

import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


const logedInUserId = '190d3131-abd5-4cb8-bfdf-7b2ea0341dc8';


const imageUriToBase64 = async (uri) => {
  try {
    const base64Content = await RNFS.readFile(uri, 'base64');
    return base64Content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
};

const uploadPhoto = async (base64String) => {
  try {
    // Upload the file to Supabase storage
    const fileName = `${uuidv4()}.png`;
    const { data, error } = await supabase
      .storage
      .from('uploads')
      .upload(fileName, decode(base64String), {
        contentType: 'image/png'
      });

    if (error) {
      console.error('Error uploading to Supabase storage:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data);
    return fileName;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};



const uploadPost = async (caption, profileId) =>{
  try {
    const id = uuidv4();
    const { data, error } = await supabase
      .from('posts')
      .insert([{ 
        id: id,
        caption: caption ,
        profile_id: profileId

      }]);

    if (error) {
      console.error('Error submitting Post:', error);
    } else {
      console.log('Post submitted', data);
      return id;
    }
  } catch (error) {
    console.error('Error Post:', error.message, 'Data: ', text, postId);
  }
};

const uploadPostMedia = async (post_id, name) =>{
  try {
    const id = uuidv4();
    const { data, error } = await supabase
      .from('post_media')
      .insert([{ 
        post_id: post_id,
        name: name

      }]);

    if (error) {
      console.error('Error submitting postMedia:', error);
    } else {
      console.log('postMedia submitted', data);
      return id;
    }
  } catch (error) {
    console.error('Error postmedia:', error.message);
  }
};



const UploadPhotoModale = ({ isVisible, onClose }) => {
  const [caption, setCaption] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
   
  const appendBase64 = (base64String) => {
    setSelectedPhotos((prevArray) => [...prevArray, base64String]);
  };

  const handleInputChange = (text) => {
    setCaption(text);
  };

  const handleModalClose = () => {
    setCaption(''); // Clear input on close
    setSelectedPhotos([]);
    onClose();
  };

  const handleSubmit = async () =>{
    const postId = await uploadPost(caption, logedInUserId);

    for(photoString of selectedPhotos){
        let photoName = await uploadPhoto(photoString);
        uploadPostMedia(postId, photoName);
    }
    handleModalClose();
  }

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
  
    launchImageLibrary(options,async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        let base64String = await imageUriToBase64(imageUri);
        appendBase64(base64String);
        //return base64String;
      }
    });
  };


  return (
    <Modal visible={isVisible} onBackdropPress={handleModalClose}>
    <View style={styles.container}>
      <Text style={styles.captionText}>Enter Caption:</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleInputChange}
        value={caption}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={openImagePicker}>
        <Text style={styles.uploadButtonText}>UPLOAD IMAGE</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="Cancel" onPress={handleModalClose} />
        <Button style={styles.button} title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    width: '70%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 0,
    marginRight: '5%',
  },
  uploadButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    margin: '3%',
  },
  buttonContainer: {
    flexDirection: 'row',
    height: '5%', // Adjust the height as needed
    margin: '3%'
  },
});

export default UploadPhotoModale;