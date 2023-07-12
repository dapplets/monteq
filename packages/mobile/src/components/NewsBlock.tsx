import React from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';

import { FontFamily } from '../GlobalStyles';

export interface NewsProps {
  img: any;
  count: string;
  name: string;
}

export type NewsBlockType = {
  news: NewsProps[];
};

const NewsBlock = ({ news }: NewsBlockType) => {
  return (
    <View style={styles.profileNews}>
      {news.map((x, i) => (
        <View style={styles.newsItem} key={i}>
          <View style={styles.newsImgBlock}>
            <Image style={styles.newsImg} resizeMode="contain" source={x.img} />
            <View style={styles.newsBlockCounter}>
              <Text style={styles.newsCounter}>{x.count}</Text>
            </View>
          </View>
          <View style={styles.newsBlockLabel}>
            <Text style={styles.newsLabel}>{x.name}</Text>
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
  newsItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    width: '30%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginRight: 'auto',
    marginLeft: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#14C58B',
    marginBottom: 10,
    alignItems: 'center',
  },
  newsImgBlock: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 40,
    height: 40,
  },
  newsImg: {
    width: 40,
    height: 40,
    objectFit: 'scale-down',
    borderRadius: 20,
  },
  newsBlockCounter: {
    position: 'absolute',
    width: 18,
    height: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#14C58B',
    top: 0,
    right: -5,
  },
  newsCounter: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
    color: '#fff',
  },
  newsBlockLabel: {
    maxWidth: 74,
    minWidth: 'auto',
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  newsLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? undefined : FontFamily.robotoBold,
    fontWeight: '600',
    color: '#222',
  },
});
export default NewsBlock;
