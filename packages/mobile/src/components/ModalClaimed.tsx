import React, { useEffect } from 'react';
import { StyleSheet, View, Image, TouchableHighlight, Text, Modal, Animated } from 'react-native';

export type ModalClaimedType = {
  isClaimed: boolean;
  closeIsClamedModal: any;
  name: string;
  img: any;
  from: string;
  time: string;
};

const ModalClaimed = ({
  isClaimed,
  closeIsClamedModal,
  name,
  img,
  from,
  time,
}: ModalClaimedType) => {
  const transformAnim = new Animated.Value(350);
  useEffect(() => {
    Animated.timing(transformAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      delay: 200,
    }).start();

    return () => {
      Animated.timing(transformAnim, {
        toValue: 350,
        duration: 500,
        useNativeDriver: true,
        delay: 0,
      }).start();
    };
  }, [transformAnim]);
  return (
    <Modal animationType="fade" transparent visible={isClaimed} onRequestClose={closeIsClamedModal}>
      <TouchableHighlight onPress={closeIsClamedModal} style={styles.modalClaimMain}>
        <View style={styles.centeredViewShareModalClaimMain}>
          <Animated.View
            style={[
              styles.modalViewShareModalClaimMain,
              {
                transform: [{ translateY: transformAnim }],
              },
            ]}>
            <Text style={styles.modalTitleClaimSecondary}>{name} claimed!</Text>
            <View style={styles.blockInfoClaimSecondary}>
              <View style={styles.claimSecondaryImgBlock}>
                <Image style={styles.claimSecondaryImg} resizeMode="cover" source={img} />
              </View>
              <View style={styles.eventsBlockRight}>
                <View style={styles.eventsBlockLabelModalSecondary}>
                  <Text style={styles.eventsLabel}>{name}</Text>
                  <Text style={styles.eventsTime}>{time}</Text>
                </View>
                <Text style={styles.eventsDescriptionModalSecondary}>{from}</Text>
                <Text style={styles.eventsFrom}>It will be burned in 120 min if not used.</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableHighlight>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalClaimMain: {
    width: '100%',
    height: '100%',
  },
  centeredViewShareModalClaimMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
  modalTitleClaimSecondary: {
    color: '#14C58B',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  blockInfoClaimSecondary: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#14C58B',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  claimSecondaryImgBlock: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  claimSecondaryImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    objectFit: 'scale-down',
  },
  eventsBlockRight: {
    display: 'flex',
    width: '100%',
    flex: 1,

    flexDirection: 'column',
  },
  eventsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  eventsTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FF3E3E',
  },
  eventsFrom: {
    fontSize: 10,
    fontWeight: '400',
    color: '#777',
  },
  eventsBlockLabelModalSecondary: {
    display: 'flex',

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  eventsDescriptionModalSecondary: {
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: 12,
    fontWeight: '400',
    color: '#777',

    marginBottom: 2,
  },
});
export default ModalClaimed;
