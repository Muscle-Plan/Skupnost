import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Button, TextInput, StyleSheet } from 'react-native';
import PostComments from './postComments';
import PostComponent from './postComponent';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = 'https://vnkgwghprktqduindnsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2d3Z2hwcmt0cWR1aW5kbnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2MjM2NzcsImV4cCI6MjAxNTE5OTY3N30.VQuyv1K8Z2XZXoYfGByktdUnyPQ33H-rXfeiENti7Sw';
const supabase = createClient(supabaseUrl, supabaseKey);


const PostPacket = require('./PostClass');

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



const PostsDisplayer = (props) => {

  

  const { postMap } = props;
  const [commentInput, setCommentInput] = useState('');
  const handleComentChange = (text) => {
    setCommentInput(text);
  };
  /**
  const [posting, setPosting] = useState(0);
  const incrementPosting = () =>{
    setPosting(prevPosting => prevPosting +1)
  } */

  const createPostComponent = (postId, postPacket) => { //tu pazi pri toti funkciji! postId parameter ne dela prav
    const postImages = postPacket.postMedia;            //brez njega crkne se mi zdi (včasih je)
    const data = postPacket.postData;                    //če rabiš dejanski post id ga dobiš tak: ID =  data.id
  
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

        <View style = {styles.commentContainer}>
          <TextInput
            placeholder='Comment: '
            onChangeText={handleComentChange}
            style= {styles.comentField}
          />
          <TouchableOpacity
                  style={styles.commentSubmit}
                  onPress={() => 
                    {
                      //incrementPosting()
                      handleCommentSubmit(commentInput.toString(), data.id)
                    }
                  }
                  key={`Submit-${postId}`}
          >
                <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
        <PostComments postId={data.id}/>

      </View>
    );
  }

  const [allPosts, setAllPosts] = useState([]);
  

  const [initialPosts, setInitialPosts] = useState([]);

  useEffect(() => {
    const updateAllPosts = () => {
      const postsBuffer = [];
      const initialPostsBuffer = [];


      for (let [postId, postPacket] of postMap) {
        
        //const initialImage = createPostComponent(postId, postPacket)
        const initialImage = (
          <PostComponent
              postId={postId}
              postPacket={postPacket}
              handlePostClick={handlePostClick}
          />
        )
        postsBuffer.push(initialImage); 
        initialPostsBuffer.push(initialImage);
      }

      setAllPosts(postsBuffer);
      setInitialPosts(initialPostsBuffer); 
    };

    updateAllPosts();
  }, [postMap]);


  const handlePostClick = (postId) => {
    const postPacket = postMap.get(postId);
    if (postPacket) {
      const postImages = postPacket.postMedia.map((image, index) => (
        <Image
          key={`image-${postId}-${index}`}
          source={{ uri: image._j }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
          onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
        />
      ));


      setAllPosts([
        <ScrollView key={`scroll-view-${postId}`}>
          {postImages}
        </ScrollView>,
        
      ]);
    }
  };

  return <View>{allPosts}</View>;
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


export default PostsDisplayer;
