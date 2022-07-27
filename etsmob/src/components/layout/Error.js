import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, Pressable } from 'react-native';

import { throwError } from '../../actions';

const Error = ({ error, throwError }) => {
  if (!error) {
    return null;
  }

  return (
    <Pressable style={styles.error} onPress={() => throwError(null)}>
      <Text style={styles.text}>{error}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  error: {
    backgroundColor: 'rgb(238, 31, 31)',
    height: 25,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 25,
  },
});

const mapStateToProps = state => {
  return {
    error: state.error.error,
  };
};

export default connect(mapStateToProps, { throwError })(Error);
