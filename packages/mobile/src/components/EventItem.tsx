import React from 'react';
import { StyleSheet, View, Image, TouchableHighlight, Text } from 'react-native';

export type EventItemType = {
  img: any;
  name: string;
  time: string;
  description: string;
  from: string;
  openClaimEventModal: any;
};

const EventItem = ({ img, name, time, description, from, openClaimEventModal }: EventItemType) => {
  return (
    <TouchableHighlight
      underlayColor="fff"
      onPress={openClaimEventModal}
      activeOpacity={0.5}
      style={styles.eventsItem}>
      <>
        <View style={styles.eventsImgBlock}>
          <Image style={styles.eventsImg} resizeMode="contain" source={img} />
        </View>
        <View style={styles.eventsBlockRight}>
          <View style={styles.eventsBlockLabel}>
            <Text style={styles.eventsLabel}>{name}</Text>
            <Text style={styles.eventsTime}>{time}</Text>
          </View>
          <View style={styles.eventsBlockDescription}>
            <Text style={styles.eventsDescription}>{description}</Text>
            <Text style={styles.eventsFrom}>{from}</Text>
          </View>
        </View>
      </>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
  eventsItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 10,
  },
  eventsImgBlock: {
    marginRight: 5,
    borderRadius: 4,
  },
  eventsImg: {
    width: 80,
    height: 80,
    objectFit: 'scale-down',
    borderRadius: 4,
  },
  eventsBlockRight: {
    display: 'flex',
    width: '100%',
    flex: 1,

    flexDirection: 'column',
  },
  eventsBlockLabel: {
    display: 'flex',

    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: 5,
  },
  eventsTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FF3E3E',
  },

  eventsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },

  eventsBlockDescription: {
    display: 'flex',
    flexDirection: 'column',
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
export default EventItem;
