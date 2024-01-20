import React, { useState, useEffect  } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Posts from './posts.js'

import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://vnkgwghprktqduindnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2d3Z2hwcmt0cWR1aW5kbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjM2NzcsImV4cCI6MjAxNTE5OTY3N30.VQuyv1K8Z2XZXoYfGByktdUnyPQ33H-rXfeiENti7Sw';
const supabase = createClient(supabaseUrl, supabaseKey);

function calculateAge(birthdate) {
    const dob = new Date(birthdate);
    const now = new Date(); 
  

    const diffMs = now - dob;
  
    const ageDate = new Date(diffMs); 
    const age = Math.abs(ageDate.getUTCFullYear() - 1970); 
  
    return age;
  }


const Profile = (props) => {
    const { username } = props;
    const [userData, setUserData] = useState([]);
  
    useEffect(() => {
      const getProfileData = async (username) => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username);

            console.log('userData:', data);
          if (error) {
            console.error('Error fetching data:', error);
          } else {
            setUserData(data || []);
            //console.log('userData:', data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      getProfileData(username);
    }, [username]);
    
    const user = userData[0] || {};
    console.log('Dada od userja:', userData);
    return (
    <View>
      <Text style={styles.username_text}>{user.username} - {user.full_name}</Text>
      <Text>{calculateAge(user.birth_date)}y</Text>
      <Text>{user.height}cm</Text>
      <Text>{'\n'}</Text>
      <Text>{user.bio} </Text>
      <Posts user_id = {user.id}/>
      
    </View>
    
    );
  };
  const styles = StyleSheet.create({
    profile_text:{
        fontSize: 18,
    },
    username_text:{
        fontSize: 18,
        fontWeight: 'bold',
    }
  });
  
export default Profile;