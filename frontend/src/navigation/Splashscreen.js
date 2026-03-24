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
  const logoRotateY = useSharedValue(0);

  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);

  const screenOpacity = useSharedValue(1);

  useEffect(() => {

    // Logo intro
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 6, stiffness: 120 });

    // Floating animation
    logoFloat.value = withDelay(
      1200,
      withRepeat(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    // 3D rotation animation
    logoRotateY.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1
    );

    // Text animation
    titleOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    subtitleOpacity.value = withDelay(1400, withTiming(1, { duration: 800 }));

    // Exit animation
    screenOpacity.value = withDelay(
      4000,
      withTiming(0, { duration: 900 }, (finished) => {
        if (finished && onFinish) {
          runOnJS(onFinish)();
        }
      })
    );

  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { perspective: 1000 },
      { scale: logoScale.value },
      { translateY: logoFloat.value },
      { rotateY: `${logoRotateY.value}deg` },
    ],
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

  return (
    <Animated.View style={[styles.wrapper, screenStyle]}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
       colors={["#4A00E0", "#8E2DE2", "#6A5ACD"]}
        style={styles.container}
      >

        <Animated.View style={logoStyle}>
          <MaterialCommunityIcons
            name="office-building"
            size={120}
            color="#fff"
            style={styles.logoShadow}
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
  },

  logoShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
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

});