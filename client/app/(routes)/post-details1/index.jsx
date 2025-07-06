import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Video } from "expo-av";

export default function PostDetails() {
  const { id } = useLocalSearchParams(); 
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `https://abe-dash.netlify.app/api/posts/${id}`
        );
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Loading details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.description}>{post.description}</Text>

      {post.img && post.img[0] && (
        <Video
          source={{ uri: post.img[0] }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          useNativeControls
          style={styles.video}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "justify",
  },
  video: {
    width: "100%",
    height: 250,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#000",
  },
});
