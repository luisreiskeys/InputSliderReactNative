import React from 'react';
import { View, StyleSheet, Text, Dimensions, TextInput } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
const ATextInput = Animated.createAnimatedComponent(TextInput);
const WIDTH = Dimensions.get('window').width - 40;
const KONBSIZE = 20;
const MAXWIDTH = WIDTH - KONBSIZE / 2 + 6;
// import { Container } from './styles';

const InputSliderV2 = ({ min = 0, max = 100, steps = 1, title = '', zeroSufix = '' }) => {
  const x = useSharedValue(0);
  const x2 = useSharedValue(MAXWIDTH);
  const sc = useSharedValue(1);
  const sc2 = useSharedValue(1);

  const gestureHandler1 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      x.value =
        ctx.startX + event.translationX < 0
          ? 0
          : ctx.startX + event.translationX > x2.value
          ? x2.value
          : ctx.startX + event.translationX;
      sc.value = 1.3;
    },
    onEnd: () => {
      sc.value = 1;
    },
  });

  const gestureHandler2 = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x2.value;
    },
    onActive: (event, ctx) => {
      x2.value =
        ctx.startX + event.translationX < x.value
          ? x.value
          : ctx.startX + event.translationX > MAXWIDTH
          ? MAXWIDTH
          : ctx.startX + event.translationX;
      sc2.value = 1.3;
    },
    onEnd: () => {
      sc2.value = 1;
    },
  });

  const styleLine = useAnimatedStyle(() => {
    return {
      backgroundColor: 'orange',
      height: 3,
      marginTop: -3,
      borderRadius: 3,
      width: x2.value - x.value,
      transform: [{ translateX: x.value }],
    };
  });
  const knobStyle1 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          scale: sc.value,
        },
        { rotate: '45deg' },
      ],
    };
  });
  const knobStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x2.value,
        },
        {
          scale: sc2.value,
        },
        { rotate: '45deg' },
      ],
    };
  });

  const animatedLabel1 = useAnimatedProps(() => {
    return {
      text:
        x.value === 0
          ? `${min} ${zeroSufix}`
          : `${Math.round((min + (x.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
    };
  });
  const animatedLabel2 = useAnimatedProps(() => {
    return {
      text: `${Math.round((min + (x2.value / MAXWIDTH) * (max - min)) / steps) * steps}`,
    };
  });
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.labelsContainer}>
          <ATextInput
            defaultValue={'0'}
            editable={false}
            style={styles.label}
            animatedProps={animatedLabel1}
          />
          <ATextInput
            defaultValue={'0'}
            editable={false}
            style={styles.label}
            animatedProps={animatedLabel2}
          />
        </View>
        <View style={styles.track} />
        <Animated.View style={styleLine} />
        <View>
          <PanGestureHandler onGestureEvent={gestureHandler1}>
            <Animated.View style={[styles.knob, knobStyle1]} />
          </PanGestureHandler>
          <PanGestureHandler onGestureEvent={gestureHandler2}>
            <Animated.View style={[styles.knob, knobStyle2]} />
          </PanGestureHandler>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderColor: '#cccdb2',
    borderBottomWidth: 1,
  },
  header: {
    backgroundColor: '#eee',
    borderTopWidth: 1,
    borderColor: '#cccdb2',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    color: '#777',
    fontSize: 12,
  },

  track: {
    height: 3,
    backgroundColor: '#cccdb2',
    borderRadius: 3,
  },
  labelsContainer: {
    width: WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  label: {
    color: '#333',
    fontSize: 12,
  },

  knob: {
    position: 'absolute',
    height: KONBSIZE,
    width: KONBSIZE,
    borderRadius: KONBSIZE / 2,
    borderColor: '#9c44dc',
    borderWidth: 2,
    backgroundColor: '#fff',
    marginTop: -KONBSIZE + 8,
    marginLeft: -8,
  },
  currentValue: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
});
export default InputSliderV2;
