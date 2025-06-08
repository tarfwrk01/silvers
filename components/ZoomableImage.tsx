import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    View
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ZoomableImageProps {
  source: { uri: string };
  style?: any;
}

export default function ZoomableImage({ source, style }: ZoomableImageProps) {
  return (
    <View style={[styles.container, style]}>
      <ImageZoom
        cropWidth={screenWidth}
        cropHeight={screenHeight}
        imageWidth={screenWidth * 0.9}
        imageHeight={screenHeight * 0.7}
        enableSwipeDown={false}
        enableCenterFocus={true}
        enableDoubleClickZoom={true}
        doubleClickInterval={250}
        maxScale={3}
        minScale={1}
        useNativeDriver={true}
        panToMove={true}
        pinchToZoom={true}
        clickDistance={10}
        style={styles.imageZoom}
      >
        <Image
          source={source}
          style={styles.image}
          resizeMode="contain"
        />
      </ImageZoom>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageZoom: {
    flex: 1,
  },
  image: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
  },
});
