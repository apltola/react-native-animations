import React, { useState, useEffect } from 'react';
import { View, PanResponder, Animated, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.33 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = ({data, renderCard, onSwipeLeft, onSwipeRight}) => {

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

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0}
    }).start(() => onSwipeComplete(direction));
  }

  const onSwipeComplete = (direction) => {
    direction === 'right' ? onSwipeRight() : onSwipeLeft();
  }

  const forceSwipe = direction => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x: x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start();
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
    return data.map((item, idx) => {
      if (idx === 0) {
        return (
          <Animated.View
            key={item.id}
            style={getCardStyle()}
            {...panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }

      return renderCard(item);
    })
  }

  return (
    <View>
      {renderCards()}
    </View>
  );
}

export default Deck;