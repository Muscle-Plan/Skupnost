import React, { useState, useEffect  } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import PostsDisplayer from './postsDisplayer';
const PostPacket = require('./PostClass');
const supabaseUrl = 'https://vnkgwghprktqduindnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2d3Z2hwcmt0cWR1aW5kbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjM2NzcsImV4cCI6MjAxNTE5OTY3N30.VQuyv1K8Z2XZXoYfGByktdUnyPQ33H-rXfeiENti7Sw';
const supabase = createClient(supabaseUrl, supabaseKey);


const logedInId = "190d3131-abd5-4cb8-bfdf-7b2ea0341dc8";
const getImageURL = async (imagePath) => { //to dela samo za ime slike
  try {
    const { data, error } =  supabase
      .storage
      .from('uploads')
      .getPublicUrl(imagePath)

    if (error) {
      throw error;
    }

    return data.publicUrl || null;
  } catch (error) {
      console.error('Error fetching image URL:', error?.message || error);
    return null;
  }
}

function daysDifference(startTime) {

  const startDate = new Date(startTime);
  const currentDate = new Date();
  const differenceInMs = currentDate - startDate;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const differenceInDays = Math.floor(differenceInMs / millisecondsPerDay);

  return differenceInDays;
}

const iAmFollowing = async (userId) => { //dobiš id-je ljudi ki jih followa user iz parametra
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('follows_profile_id')
      .eq('following_profile_id', userId)

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
      console.error('Error fetching image URL:', error?.message || error);
    return null;
  }
}

const iFollowHim = async (logedInUser, userId) => {
  try {
    const follows = await iAmFollowing(logedInUser);

    let ret = false;
    for (let user of follows) {
      if (user.follows_profile_id === userId) {
        ret = true;
        break; // If found, no need to continue looping
      }
    }
    
    console.log('Follow status: ', ret);
    return ret;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false; // Return default value in case of an error
  }
};

const follow = async (logedInUser, userId) =>{
    try {
      const { data, error } = await supabase
        .from('follows')
        .insert([{ 
          following_profile_id: logedInUser ,
          follows_profile_id: userId

        }]);
  
      if (error) {
        console.error('Error submitting comment:', error);
      } else {
        console.log('Comment submitted', data);
      }
    } catch (error) {
      console.error('Error commenting:', error.message, 'Data: ', text, postId);
    }
}

const unfollow = async (logedInUser, userId) => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .delete()
      .eq('following_profile_id', logedInUser)
      .eq('follows_profile_id', userId)

    if (error) {
      console.error('Error deleting row:', error.message);
      return null;
    }

    console.log('Row deleted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error deleting row:', error.message);
    return null;
  }
};

const getPostData = async (user_id) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id, caption, profile_id, created_at')
      .eq('profile_id', user_id);
    if(error){
        console.error('Error fetching Post data')
    }
    else{
        console.log('POST DATA:', data)
        return data  || [];
        
    }
  } catch (error) {
    console.error('Error fetching Post data:', error);
  }
};

const getPostMedia = async (post_id) => {
  try {
    const { data, error } = await supabase
      .from('post_media')
      .select('name')
      .eq('post_id', post_id);

    if (error) {
      console.error('Error fetching Post Media data');
      return null;
    } else {
      
      let media = [];
      for(let i = 0; i< data.length; i++){
        media.push(getImageURL(data[i].name))
        console.log('IMEE: ', getImageURL(data[i].name))
      }
      console.log('POST MEDIA2:', media);
      return media || []; 
    }
  } catch (error) {
    console.error('Error fetching Post Media', error);
    return null;
  }
};
async function fillMap(user_id) {
  return new Promise(async (resolve, reject) => {
    try {
      let postsMap = new Map();
      let postData = await getPostData(user_id);

      if (postData && postData.length > 0) {
        for (let i = 0; i < postData.length; i++) {
          const postMedia = await getPostMedia(postData[i].id);

          console.log("Data id: ", postData[i].id, 'i: ', i);
          if (postMedia) {
            postsMap.set(i, new PostPacket(postData[i], postMedia));
          }
        }
        resolve(postsMap);
      } else {
        console.log('No post data found.');
        resolve(null);
      }
    } catch (error) {
      console.error('Error:', error.message);
      reject(error);
    }
  });
}

async function fillMapFollowing(user_id) {

  return new Promise(async (resolve, reject) => {
    try{
      let following = await iAmFollowing(user_id);
      let postsMap = new Map();

      let postData = [];
      //tu poberemo vse objave ljudi ko jim sledim
      for(let followedUser of following){
        let postDataBuffer = await getPostData(followedUser.follows_profile_id);
        postData = [...postData, ...postDataBuffer];

      }
      for(let i = 0; i< postData.length; i++){ //tu spučem vse starejše od 2 dni

        if(daysDifference(postData[i].created_at) > 2){
          postData.splice(i, 1)
        }
      };

      //dodelimo postMedia
      if (postData && postData.length > 0) {
        for (let i = 0; i < postData.length; i++) {
          const postMedia = await getPostMedia(postData[i].id);

          console.log("Data id: ", postData[i].id, 'i: ', i);
          if (postMedia) {
            postsMap.set(i, new PostPacket(postData[i], postMedia));
          }
        }
        resolve(postsMap);
      } else {
        console.log('No post data found.');
        resolve(null);
      }
      //console.log('Jaz FOLLOWAMMM: ', postData);
  }catch (error) {
    console.error('Error:', error.message);
    reject(error);
  }
  });
}



const Posts = (props) => {
    const {user_id} = props;
    const [postMap, setPostMap] = useState(new Map());
    const [anyPosts, setAnyPosts] = useState(false);
    const [followStatus, setFollowStatus] = useState('Follow');

    const feedClick = async () =>{
      const feedMap = await fillMapFollowing(logedInId); //TU NAREDI DINAMIČNOOO 
      if(feedMap){
        setPostMap(feedMap);
      }
    }
    const exitFeed = async() =>{
      const map = await fillMap(user_id);
      if (map){
        setPostMap(map);
      }

    }

    const followButtonClick = () =>{
        if(followStatus == 'Follow'){
          follow(logedInId, user_id)
          setFollowStatus('Unfollow')
        }else{
          unfollow(logedInId, user_id)
          setFollowStatus('Follow')
        }
    }

    useEffect( () => {
        const fetchPostMap =  async () =>{
          try{
            const map = await fillMap(user_id);
            if (map){
              setAnyPosts(true);
              setPostMap(map);
            }else{
              
              console.log("No data fount");
              return null;
            }
          }catch(error){
            console.error('Error: ', error);
          }

        };

        const checkFollowStatus = async () => {
          try {
            const follows = await iFollowHim(logedInId, user_id);
            if (follows) {
              setFollowStatus('Unfollow');
            } else {
              setFollowStatus('Follow');
            }
          } catch (error) {
            console.error('Error checking follow status:', error);
          }
        };


        fetchPostMap();
        checkFollowStatus();
    
      }, [user_id]);
      
    if (anyPosts){
      return (
          <View>
            <View>
              <TouchableOpacity onPress={feedClick}>
                  <Text>FEED</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={exitFeed}>
                  <Text>EXIT FEED</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={followButtonClick}>
                  <Text>{followStatus}</Text>
              </TouchableOpacity>
            </View>
            <PostsDisplayer postMap = {postMap}/>
          </View>
      );
    }else{
      return(
        <View>
          <Text>No posts</Text>
        </View>
      );
    };
};

const styles = StyleSheet.create({
  
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'left'
  },
  
});

export default Posts;