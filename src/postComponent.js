import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import PostComments from './postComments';

import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://vnkgwghprktqduindnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2d3Z2hwcmt0cWR1aW5kbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjM2NzcsImV4cCI6MjAxNTE5OTY3N30.VQuyv1K8Z2XZXoYfGByktdUnyPQ33H-rXfeiENti7Sw';
const supabase = createClient(supabaseUrl, supabaseKey);

function formatTimeStringToDate(timeString) {
    const date = new Date(timeString);
  
  
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); 
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);
  
   
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }


const handleCommentSubmit = async (text, postId) =>{
    console.log('Comment input4: ', text);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ 
          comment: text ,
          post_id: postId
  
        }]);
  
      if (error) {
        console.error('Error submitting comment:', error);
      } else {
        console.log('Comment submitted', data);
      }
    } catch (error) {
      console.error('Error commenting:', error.message, 'Data: ', text, postId);
    }
    //setCommentInput('');
  };


const PostComponent = ({ postId, postPacket, handlePostClick}) => {
  const postImages = postPacket.postMedia;
  const data = postPacket.postData;

  const [commentInput, setCommentInput] = useState('');

  const handleComentChange = (text) => {
    setCommentInput(text);
  };

  return (
    <View>
      <TouchableOpacity key={`post-${postId}`} onPress={() => handlePostClick(postId)}>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text>Post {postId}</Text>
          <Text>{formatTimeStringToDate(data.created_at)}</Text>
          <Image
            source={{ uri: postImages.length > 0 ? postImages[0]._j : null }}
            style={{ width: 200, height: 200, marginVertical: 10 }}
            onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
          />
          <Text>{data.caption}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.commentContainer}>
        <TextInput
          placeholder='Comment: '
          onChangeText={handleComentChange}
          style={styles.comentField}
        />
        <TouchableOpacity
          style={styles.commentSubmit}
          onPress={() => handleCommentSubmit(commentInput.toString(), data.id)}
          key={`Submit-${postId}`}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <PostComments postId={data.id} />
    </View>
  );
};

const styles = StyleSheet.create({
    commentSubmit: {
      backgroundColor: '#ffffff',
      width: '20%',
      marginLeft: '5%'
    },
    commentContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    comentField:{
      width: '60%'
    },
    showComments:{
      width: '60%',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

export default PostComponent;