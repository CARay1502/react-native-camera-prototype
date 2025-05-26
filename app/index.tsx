import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { useRef } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionResponse, requestPermissionLibrary] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true, 
        });
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert('Photo Taken!', asset.uri);
        console.log('Photo URI:', asset.uri);
      } catch (err) {
        console.error('Failed to take picture:', err);
      }
    }
  };

  if (!permission?.granted) {
    return <Button title="Enable camera" onPress={requestPermission} />;
  }

  if (!permissionResponse?.granted) {
    return <Button title="Enable library access" onPress={requestPermissionLibrary} />;
  }
  return (
    <View style={styles.container}>
      <CameraView
      ref={cameraRef}
      style={styles.container}
      facing="back"
      />
      <View style={styles.container}>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#ffffffaa',
    borderRadius: 8,
    paddingHorizontal: 20, 
  },
});