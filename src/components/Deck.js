import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.33 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = ({data, renderCard, onSwipeLeft, onSwipeRight, renderNoMoreCards}) => {
  if (!onSwipeLeft) onSwipeLeft = () => {};
  if (!onSwipeRight) onSwipeRight = () => {};

  const pos = new Animated.ValueXY();
  const pr = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    }
  });

  const [panResponder, setPanResponder] = useState(pr);
  const [position, setPosition] = useState(pos);
  const [index, setIndex] = useState(0);

  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  LayoutAnimation.spring();

  useEffect(() => {
    setIndex(0);
    return () => {};
  }, [data])

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0}
    }).start();
  }

  const onSwipeComplete = (direction) => {
    const item = data[index];
    if (direction === 'right') {
      onSwipeRight(item);
    } else {
      onSwipeLeft(item)
    }
    
    setIndex(prev => prev + 1);
    position.setValue({ x: 0, y: 0 });
  }

  const forceSwipe = direction => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.1 : -SCREEN_WIDTH * 1.1;
    Animated.timing(position, {
      toValue: { x: x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => onSwipeComplete(direction));
  }

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-33deg', '0deg', '33deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate: rotate }]
    }
  }

  const renderCards = () => {
    if (index >= data.length) {
      return renderNoMoreCards(() => setIndex(0));
    }

    return data.map((item, i) => {
      if (i < index) return null;

      if (i === index) {
        return (
          <Animated.View
            key={item.id}
            style={[getCardStyle(), styles.cardStyle]}
            {...panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }

      else return (
        <Animated.View 
          key={item.id}
          style={[styles.cardStyle, {top: 5 * (i - index)}]}
        >
          {renderCard(item)}
        </Animated.View>
      )
    }).reverse();
  }

  return (
    <View>
      {renderCards()}
    </View>
  );
}

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  }
});

export default Deck;