import React from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';

export type ImgProfileType = {
  pickImage: any;
  image?: any;
  resetImg: any;
};

const ImgProfile = ({ pickImage, image, resetImg }: ImgProfileType) => {
  return (
    <View style={styles.profileImgBlock}>
      {!image && (
        <TouchableHighlight
          underlayColor="#fff"
          activeOpacity={0.5}
          style={styles.buttonChoiseProfileImg}
          onPress={pickImage}>
          <Image
            style={styles.choiseProfileImg}
            resizeMode="cover"
            source={require('../assets/camera.png')}
          />
        </TouchableHighlight>
      )}

      {image && (
        <View style={styles.choiseImgBlock}>
          <Image resizeMode="cover" source={{ uri: image }} style={styles.profileImg} />
          <View style={styles.deleteImgLayer1}>
            <TouchableHighlight
              underlayColor="#fff"
              activeOpacity={0.5}
              style={styles.deleteImgLayer2}
              onPress={resetImg}>
              <Image
                style={styles.deleteImg}
                resizeMode="cover"
                source={require('../assets/trash.png')}
              />
            </TouchableHighlight>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  profileImgBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    minHeight: 68,
    maxHeight: 180,
    justifyContent: 'center',
    marginBottom: 10,
  },
  linearGradientProfileImg: {
    display: 'flex',
    borderRadius: 50,
    width: '100%',
  },
  buttonChoiseProfileImg: {
    backgroundColor: '#fff',
    width: 180,
    height: 180,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 90,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  choiseProfileImg: {
    width: 50,
    height: 42,
  },
  buttonTextProfileImg: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    color: '#ffffff',
  },
  choiseImgBlock: {
    width: 180,
    height: 180,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 90,
  },

  profileImg: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  deleteImgLayer1: {
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 25,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  deleteImgLayer2: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#000000',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2,
    elevation: 2,
  },
  deleteImg: {
    width: 24,
    height: 24,
  },
});
export default ImgProfile;
