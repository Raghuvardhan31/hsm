import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet } from "react-native";

import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
  const logoScale = useSharedValue(0.5);
  const logoOpacity = useSharedValue(0);
  const logoFloat = useSharedValue(0);

  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const screenOpacity = useSharedValue(1);

  // Bubble animations
  const bubble1 = useSharedValue(height);
  const bubble2 = useSharedValue(height);
  const bubble3 = useSharedValue(height);

  useEffect(() => {
    // Logo intro
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 6, stiffness: 120 });

    // Floating logo
    logoFloat.value = withDelay(
      1200,
      withRepeat(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );

    // Text animation
    titleOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    subtitleOpacity.value = withDelay(1400, withTiming(1, { duration: 800 }));

    // Bubble animations
    // bubble1.value = withRepeat(
    //   withTiming(-100, { duration: 1000, easing: Easing.linear }),
    //   -1,
    // );

    // bubble2.value = withDelay(
    //   1000,
    //   withRepeat(
    //     withTiming(-120, { duration: 7000, easing: Easing.linear }),
    //     -1,
    //   ),
    // );

    // bubble3.value = withDelay(
    //   1000,
    //   withRepeat(
    //     withTiming(-150, { duration: 8000, easing: Easing.linear }),
    //     -1,
    //   ),
    // );

    // Exit animation
    screenOpacity.value = withDelay(
      60000,
      withTiming(0, { duration: 900 }, (finished) => {
        if (finished && onFinish) {
          runOnJS(onFinish)();
        }
      }),
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { translateY: logoFloat.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const bubble1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: bubble1.value }],
  }));

  const bubble2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: bubble2.value }],
  }));

  const bubble3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: bubble3.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, screenStyle]}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#ede0f0", "#5b1e8a"]} style={styles.container}>
        {/* Background Bubbles */}
        <Animated.View style={[styles.bubble, styles.b1, bubble1Style]} />
        <Animated.View style={[styles.bubble, styles.b2, bubble2Style]} />
        <Animated.View style={[styles.bubble, styles.b3, bubble3Style]} />

        <Animated.View style={logoStyle}>
          <MaterialCommunityIcons
            name="office-building"
            size={120}
            color="#fff"
          />
        </Animated.View>

        <Animated.Text style={[styles.title, titleStyle]}>
          Live Intelligently
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleStyle]}>
          Smart Property Management
        </Animated.Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#d1d5db",
  },

  bubble: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 100,
  },

  //   b1: {
  //     width: 120,
  //     height: 120,
  //     left: width * 0.1,
  //   },

  //   b2: {
  //     width: 80,
  //     height: 80,
  //     left: width * 0.6,
  //   },

  //   b3: {
  //     width: 150,
  //     height: 150,
  //     left: width * 0.35,
  //   },
});
