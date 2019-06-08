import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

/* class Ball extends Component {
  
  componentWillMount() {
    this.position = new Animated.ValueXY(0, 0);
  
    Animated.spring(this.position, {
      toValue: { x: 200, y: 500 }
    }).start();
  }
  
  render() {
    return (
      <Animated.View style={this.position.getLayout()}>
        <View style={styles.ballStyle} />
      </Animated.View>
    )
  }
} */

const Ball = () => {
  let position = new Animated.ValueXY({x: 150, y: 0});

  useEffect(() => {
  
    Animated.spring(position, {
      toValue: { x: 150, y: 400 }
    }).start();

  }, []);

  return (
    <Animated.View style={position.getLayout()}>
      <View style={styles.ballStyle} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ballStyle: {
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#0070f3',
  }
})

export default Ball;