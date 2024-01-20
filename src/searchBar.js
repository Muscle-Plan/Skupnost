import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableHighlight } from 'react-native';

import Profile from './profile';


import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://vnkgwghprktqduindnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2d3Z2hwcmt0cWR1aW5kbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjM2NzcsImV4cCI6MjAxNTE5OTY3N30.VQuyv1K8Z2XZXoYfGByktdUnyPQ33H-rXfeiENti7Sw';
const supabase = createClient(supabaseUrl, supabaseKey);
const myUsername = 'Fiki'; //POL NAREDI DINAMIČNO DODELITEV!

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const pickImage = () => {
  ImagePicker.showImagePicker(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const imageURI = response.uri;
      
    }
  });
};



const SearchBar = () => {
    const [inputText, setInputText] = useState('');
    const [userData, setUserData] = useState([]);
    const [displayedName, setDisplayedName] = useState(myUsername);
    
    const getUsersByUsername = async (name) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username', 'full_name')
          .ilike('username', name)
          .limit(5);
  
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setUserData(data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const handleInputChange = (text) => {
      setInputText(text);
      let buffer = text + '%';
      if(text !== ''){
        getUsersByUsername(buffer);
        }else{setUserData([])}
    };

    const handleNamePress = (name) =>{
        setDisplayedName(name);
    }
    const goToMyProfile = () => {
        setDisplayedName(myUsername)
    }
    
  
    return (
      <View style={styles.container}>
        <View style={styles.dropdown}>
            <View style={styles.input_container}>
                <TextInput
                style={styles.input}
                placeholder="Search friends"
                onChangeText={handleInputChange}
                value={inputText}
                />
                <Button title='ME' style={styles.myProfileButton} onPress={() => goToMyProfile()}/>
            </View>
            <View>
            {userData.map((user, index) => (
                <TouchableHighlight onPress={() => handleNamePress(user.username)} underlayColor="rgb(255, 0, 255)" key={index}>
                    <Text style={styles.dropdown_item} >{user.username}</Text>
                </TouchableHighlight>
            ))}
            </View>
        </View>

        <View style={styles.profile_display}>
            <Profile username={displayedName}/>
        </View>

      </View>
    );
  };
  

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        flex:1,
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        margin:10,
        borderWidth: 1,

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
    dropdown: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width:'100%',
        padding:10,
        borderWidth: 1,
    },
    dropdown_item: {
        justifyContent:'center',
        alignItems: 'flex-start',
        margin:0,
        
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
      },
    profile_display:{
        width: '100%', 
        flex:1,
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        margin:0,
        borderWidth:0,
    },
    input_container:{
        width: '100%', 
        flex:1,
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'flex-start',
        margin:0,
        borderWidth:0,
    },
    myProfileButton:{
        //TODO
    }
});

export default SearchBar;