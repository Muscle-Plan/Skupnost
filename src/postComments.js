import React, { useState, useEffect  } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';

import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://vnkgwghprktqduindnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2d3Z2hwcmt0cWR1aW5kbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjM2NzcsImV4cCI6MjAxNTE5OTY3N30.VQuyv1K8Z2XZXoYfGByktdUnyPQ33H-rXfeiENti7Sw';
const supabase = createClient(supabaseUrl, supabaseKey);


const displayComments = (comments) => {
    return (
      <View>
        {comments.map((comment, index) => (
          <Text key={`comment-${index}-${Math.random().toString(36).substr(2, 9)}`}>
            {comment.comment}
          </Text>
        ))}
      </View>
    );
  };




const PostComments = (props) => {
    const {postId} = props;
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);

    const toggleComments = () => {
        setShowComments(!showComments);
      };

    const [commentInput, setCommentInput] = useState('');
  
    const fetchComments = async (postId) => {
      try {
        console.log('Post id: ', postId);
        const { data, error } = await supabase
          .from('comments')
          .select('comment', 'profile_id', 'id')
          .eq('post_id', postId);
  
        if (error) {
          console.error('Error fetching comments:', error);
        } else {
          setComments(data || []);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    useEffect(() =>{
    fetchComments(postId);
    },[postId]);

  
  
    return (
        
      <View>
        <TouchableOpacity key={`showComment-${postId}`} onPress={toggleComments}>
            <Text>{showComments ? 'Hide comments' : 'Show comments'}</Text>
        </TouchableOpacity>
        
        {showComments && (
            <View>
            {displayComments(comments)}
            </View>
        )}
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
  
  export default PostComments;