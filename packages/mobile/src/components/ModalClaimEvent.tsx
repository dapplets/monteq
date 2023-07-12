import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, TouchableHighlight, Text, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export type ModalClaimEventType = {
  isClaimEvent: boolean;
  claimedEvent: any;
  name: string;
  img: any;
  from: string;
  time: string;
  description: string;
  closeClaimEventModal: any;
};

const ModalClaimEvent = ({
  isClaimEvent,
  claimedEvent,
  name,
  img,
  from,
  time,
  description,
  closeClaimEventModal,
}: ModalClaimEventType) => {
  const transformAnim = new Animated.Value(350);
  useEffect(() => {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      // delay: 1000,
    }).start();

    return () => {
      Animated.timing(transformAnim, {
        toValue: 350,
        duration: 500,
        useNativeDriver: true,
        // delay: 1000,
      }).start();
    };
  }, [transformAnim]);
  return (
    <Modal
      animationType="none"
      transparent
      visible={isClaimEvent}
      onRequestClose={closeClaimEventModal}>
      <View style={styles.modalClaimMain}>
        <TouchableHighlight
          onPress={closeClaimEventModal}
          style={styles.centeredViewShareModalClaimMain}>
          <></>
        </TouchableHighlight>
        <Animated.View
          style={[
            styles.modalViewShareModalClaimMain,
            {
              transform: [{ translateY: transformAnim }],
            },
          ]}>
          <Text style={styles.modalClaimMainTitle}>Claim {name}</Text>
          <View style={styles.modalClaimMainContentBlockBg}>
            <View style={styles.modalClaimMainImgBlock}>
              <Image style={styles.claimMaimImg} resizeMode="cover" source={img} />
            </View>
            <View style={styles.modalClaimMainInfoBlock}>
              <View style={styles.modalClaimMainInfoBlockTop}>
                <Text style={styles.eventsFrom}>{from}</Text>
                <Text style={styles.eventsTime}>{time}</Text>
              </View>
              <Text style={styles.eventsDescriptionMainModal}>{description}</Text>
            </View>
          </View>

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.linearGradientModalClaimMain}
            colors={['#0dd977', '#1da4ac', '#14c48c']}>
            <TouchableHighlight
              underlayColor="transparent"
              activeOpacity={0.5}
              style={styles.primaryButtonShareModalClaimMain}
              onPress={claimedEvent}>
              <Text style={styles.primaryButtonModalTextClaimMain}>Claim NFT</Text>
            </TouchableHighlight>
          </LinearGradient>

          <Text style={styles.eventsDescription}>It will be burned in 120 min if not used.</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalClaimMain: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredViewShareModalClaimMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  modalViewShareModalClaimMain: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },
  modalClaimMainTitle: {
    color: '#222',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  modalClaimMainContentBlockBg: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
  },

  modalClaimMainImgBlock: {
    width: '100%',
    height: 120,
    borderRadius: 4,
    marginBottom: 5,
  },
  claimMaimImg: {
    width: '100%',
    height: 120,
    objectFit: 'scale-down',
    borderRadius: 4,
  },
  modalClaimMainInfoBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  modalClaimMainInfoBlockTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventsDescriptionMainModal: {
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 12,
    fontWeight: '400',
    color: '#777',
  },
  linearGradientModalClaimMain: {
    display: 'flex',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: '100%',
    marginBottom: 10,
  },
  primaryButtonShareModalClaimMain: {
    display: 'flex',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  primaryButtonModalTextClaimMain: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  eventsTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FF3E3E',
  },
  eventsDescription: {
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 12,
    fontWeight: '400',
    color: '#777',
    marginBottom: 5,
    paddingRight: 5,
  },
  eventsFrom: {
    fontSize: 10,
    fontWeight: '400',
    color: '#777',
  },
});
export default ModalClaimEvent;
