import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

//app logic
export default function App() {
  //camera photo logic 
  const [permission, requestPermission] = useCameraPermissions();
  const [permissionResponse, requestPermissionLibrary] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  //camera facing set to default 'back' camera
  const [facing, setFacing] = useState<CameraType>('back');
  //func to flip camera and pass CameraType to takePhoto 
  const flipCamera = () => {
    setFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  //func to capture photo from cameraRef and pass to MediaLibrary to be saved on device library
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          skipProcessing: true, 
        });
        //passes photo.uri to asset.uri to be saved in device media library
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert('Photo Taken!', asset.uri);
        console.log('Photo URI:', asset.uri);
        //error handling in case camera doesn't work/open/save
      } catch (err) {
        Alert.alert('Photo not taken! Please check camera permissions.');
        console.error('Failed to take picture:', err);
      }
    }
  };

  //basic camera permission
  if (!permission?.granted) {
    return <Button title="Enable camera" onPress={requestPermission} />;
  }
  //basic device media library permission
  if (!permissionResponse?.granted) {
    return <Button title="Enable library access" onPress={requestPermissionLibrary} />;
  }

  //App() view render
  return (
    <View style={styles.container}>
      <CameraView
      ref={cameraRef}
      style={styles.camera}
      facing={facing}
      />
      <View style={styles.buttonContainer}>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Flip Camera" onPress={flipCamera} />
      </View>
    </View>
  );
}

//styling for App()
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