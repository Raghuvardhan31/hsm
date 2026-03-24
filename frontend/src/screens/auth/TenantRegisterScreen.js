import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import COLORS from "@/src/theme/colors";

const WHITE = COLORS.WHITE;
const NAVY = COLORS.PRIMARY;

export default function TenantRegisterScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [identityType, setIdentityType] = useState("");
  const [identityImage, setIdentityImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  /* ---------------- HELPERS & VALIDATION ---------------- */

  const removeEmojis = (text) =>
    text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");

  const validateName = (name) => {
    const regex = /^[A-Za-z ]{3,30}$/;
    return regex.test(name) && name.trim().length >= 3;
  };

  const validatePhone = (phone) => /^[6-9][0-9]{9}$/.test(phone);

  const validateEmail = (email) => {
    const regex = /^[a-z0-9._%+-]+@gmail\.com$/;
    return regex.test(email) && !email.includes("..") && !email.startsWith(".") && !/\s/.test(email);
  };

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+])[A-Za-z\d@$!%*?&#^()_+]{8,}$/.test(password);

  /* DOCUMENT PICKER */
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        const sizeKB = file.size / 1024;

        if (sizeKB > 100) {
          Alert.alert("File Too Large", "File must be less than 100KB");
          return;
        }

        setIdentityImage(file.uri);
        setErrors((prev) => ({ ...prev, identityImage: "" }));
      }
    } catch (err) {
      Alert.alert("Error", "Could not open file picker");
    }
  };

  /* SUBMIT HANDLER */
  const handleRegister = async () => {
    let e = {};
    if (!name.trim() || !validateName(name)) e.name = "Name must be 3-30 letters only";
    if (!email.trim() || !validateEmail(email)) e.email = "Enter valid gmail (ex: name@gmail.com)";
    if (!phone || !validatePhone(phone)) e.phone = "Phone must start with 6-9 and be 10 digits";
    if (!gender) e.gender = "Please select gender";
    if (!identityType) e.identityType = "Please select identity proof";
    if (!identityImage) e.identityImage = "Please upload identity proof";
    if (!validatePassword(password)) e.password = "Password must contain uppercase, lowercase, number & special character";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("gender", gender);
      formData.append("identityType", identityType);
      formData.append("password", password);

      const filename = identityImage.split("/").pop();
      const ext = filename.split(".").pop().toLowerCase();
      let type = ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : "image/jpeg";

      formData.append("identityImage", {
        uri: identityImage,
        name: filename,
        type: type,
      });

      const response = await fetch("http://192.168.1.45:8000/api/tenent/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Registration Successful!");
        navigation.navigate("TenantNavigation");
      } else {
        Alert.alert("Error", JSON.stringify(data));
      }
    } catch (error) {
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <LinearGradient colors={[WHITE, WHITE]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.outerContainer} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.title}>Create Account</Text>

            {/* NAME */}
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={NAVY} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                maxLength={30}
                value={name}
                onChangeText={(t) => {
                  const clean = removeEmojis(t).replace(/[^A-Za-z ]/g, "");
                  setName(clean);
                  setErrors((prev) => ({ ...prev, name: validateName(clean) ? "" : "Name must be 3 Chars" }));
                }}
              />
            </View>
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            {/* EMAIL */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={NAVY} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={(t) => {
                  const clean = removeEmojis(t).replace(/\s/g, "").toLowerCase();
                  setEmail(clean);
                  setErrors((prev) => ({ ...prev, email: validateEmail(clean) ? "" : "Enter valid email" }));
                }}
              />
            </View>
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {/* PHONE */}
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={NAVY} />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="numeric"
                maxLength={10}
                value={phone}
                onChangeText={(t) => {
                  const clean = t.replace(/[^0-9]/g, "");
                  setPhone(clean);
                  setErrors((prev) => ({ ...prev, phone: validatePhone(clean) ? "" : "Invalid Number" }));
                }}
              />
            </View>
            {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

            {/* GENDER PICKER */}
            <View style={styles.inputWrapper}>
              <Ionicons name="male-female-outline" size={20} color={NAVY} />
              <Picker
                style={{ flex: 1 }}
                selectedValue={gender}
                onValueChange={(val) => {
                  setGender(val);
                  setErrors((prev) => ({ ...prev, gender: val ? "" : "Select gender" }));
                }}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
            {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

            {/* ID TYPE PICKER */}
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={20} color={NAVY} />
              <Picker
                style={{ flex: 1 }}
                selectedValue={identityType}
                onValueChange={(val) => {
                  setIdentityType(val);
                  setErrors((prev) => ({ ...prev, identityType: val ? "" : "Select ID type" }));
                }}
              >
                <Picker.Item label="Select Identity Proof" value="" />
                <Picker.Item label="Aadhar Card" value="Aadhar" />
                <Picker.Item label="PAN Card" value="PAN" />
              </Picker>
            </View>
            {errors.identityType && <Text style={styles.error}>{errors.identityType}</Text>}

            {/* UPLOAD BUTTON */}
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Ionicons
                name={identityImage ? "document-attach" : "cloud-upload-outline"}
                size={20}
                color={identityImage ? "green" : NAVY}
              />
              <Text style={styles.uploadText}>
                {identityImage ? "File Selected ✓" : "Upload Identity "}
              </Text>
            </TouchableOpacity>
            {errors.identityImage && <Text style={styles.error}>{errors.identityImage}</Text>}

            {/* PASSWORD */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={NAVY} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => {
                  const clean = removeEmojis(t);
                  setPassword(clean);
                  setErrors((prev) => ({ ...prev, password: validatePassword(clean) ? "" : "Weak Password" }));
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={NAVY} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}

            {/* CONFIRM PASSWORD */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={NAVY} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(t) => {
                  const clean = removeEmojis(t);
                  setConfirmPassword(clean);
                  setErrors((prev) => ({ ...prev, confirmPassword: clean === password ? "" : "Passwords mismatch" }));
                }}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color={NAVY} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

            <TouchableOpacity onPress={handleRegister}>
              <LinearGradient colors={[NAVY, COLORS.PRIMARY_LIGHT]} style={styles.button}>
                <Text style={styles.buttonText}>Register</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: { backgroundColor: WHITE, borderRadius: 30, padding: 25, elevation: 15 },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 25, color: NAVY },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.CARD, borderRadius: 18, paddingHorizontal: 15, marginVertical: 8 },
  input: { flex: 1, padding: 12 },
  uploadButton: { flexDirection: "row", justifyContent: "center", padding: 14, borderRadius: 18, backgroundColor: COLORS.BLUE_LIGHT, marginTop: 10 },
  uploadText: { marginLeft: 10, fontWeight: "600", color: NAVY },
  button: { padding: 18, borderRadius: 22, alignItems: "center", marginTop: 25 },
  buttonText: { color: WHITE, fontSize: 17, fontWeight: "bold" },
  error: { color: "red", fontSize: 12, marginLeft: 8 },
});