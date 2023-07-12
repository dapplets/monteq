import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export interface PerksProps {
  title: string;
  name: string;
  img: any;
  time: string;
  count?: string;
}

export type PerksType = {
  perks: PerksProps[];
};

const PerksBlock = ({ perks }: PerksType) => {
  return (
    <View style={styles.profileNews}>
      {perks.map((x, i) => (
        <View style={styles.perksItem} key={i}>
          <View style={styles.perksImgBlock}>
            <Image style={styles.perksImg} resizeMode="contain" source={x.img} />
            {x.count ? (
              <View style={styles.perksBlockCounter}>
                <Text style={styles.perksCounter}>x{x.count}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.perksBlockInfo}>
            <Text style={styles.perksLabel}>{x.title}</Text>
            <Text style={styles.perksName}>{x.name}</Text>
            <Text style={styles.perksTime}>{x.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  profileNews: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  },
  perksItem: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    width: '47%',
    height: 68,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginRight: 'auto',
    marginLeft: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#14C58B',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  perksImgBlock: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  perksImg: {
    width: 40,
    height: 40,
    objectFit: 'scale-down',
    borderRadius: 20,
  },
  perksBlockCounter: {
    position: 'absolute',
    width: 30,
    height: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: '#14C58B',
    top: -10,
    left: -10,
  },
  perksCounter: {
    fontSize: 12,

    fontWeight: '600',
    color: '#fff',
  },
  perksBlockInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginRight: 'auto',
    marginLeft: 5,
  },
  perksLabel: {
    fontSize: 14,

    fontWeight: '600',
    color: '#222',
    lineHeight: 16,
  },
  perksName: {
    fontSize: 12,

    fontWeight: '400',
    color: '#777',
    lineHeight: 14,
    marginTop: 2,
    marginBottom: 2,
  },
  perksTime: {
    fontSize: 12,

    fontWeight: '400',
    color: '#ff3e3e',
    lineHeight: 14,
  },
});
export default PerksBlock;
