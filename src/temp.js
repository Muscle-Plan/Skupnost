useEffect(() => {
    const updateAllPosts = () => {
      let allPostsBuffer = [];
      for (let i = 0; i < postMap.size; i++) {
        let Packet = postMap.get(i);
        let onePostBuffer = [];
        onePostBuffer.push(<Text key={`post-${i}`}>{Packet.postData.created_at}</Text>);
        onePostBuffer.push(<Text key={`caption-${i}`}>{Packet.postData.caption}</Text>)
  
        for (let k = 0; k < Packet.postMedia.length; k++) {
            console.log('DEPLOYMENT URL:',Packet.postMedia[k]._j)
            onePostBuffer.push(
            <Image key={`image-${i}-${k}`}
             source={{ uri: Packet.postMedia[k]._j }} 
             style={{ width: 200, height: 200 }}
             onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
            />
          );
         
        }
        const wrappedPost = <View key={`wrapped-post-${i}`}>{onePostBuffer}</View>;
        allPostsBuffer.push(wrappedPost);
      }
      setAllPosts(allPostsBuffer);
    };
  
    updateAllPosts();
  }, [postMap]);