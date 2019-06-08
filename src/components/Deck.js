import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Deck = ({data, renderCard}) => {
  
  const renderCards = () => {
    return data.map(item => {
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