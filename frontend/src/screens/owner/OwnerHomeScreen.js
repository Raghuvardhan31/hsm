// import { Ionicons } from "@expo/vector-icons";
// import * as DocumentPicker from "expo-document-picker";
// import * as FileSystem from "expo-file-system";


// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Linking,
//   Modal,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { PinchGestureHandler, State } from "react-native-gesture-handler";
// import { WebView } from "react-native-webview";

// const CARD_HEIGHT = 560;

// export default function BuildingScreen({ route }) {

// const [response_data, setResponseData] = useState(null);  
// // const propertyStayType = response_data?.stay_type || "hostel";
// const ownerName = response_data?.owner?.name;
// const ownerEmail = response_data?.owner?.email;
// const floorsData = response_data?.building_layout;
// // const roomsData = response_data?.building_layout?.flatMap(floor => floor.rooms);
// const roomsData =
//   response_data?.building_layout?.flatMap(floor => floor.rooms || []) || [];
// // const bedsData = response_data?.building_layout?.flatMap(floor =>
// //   floor.rooms.map(room => room.beds)
// // );
// const bedsData =
//   response_data?.building_layout?.flatMap(floor =>
//     (floor.rooms || []).flatMap(room => room.beds || [])
//   ) || [];
//   // const [ownerData, setOwnerData] = useState(null);
//   // const { email } = useLocalSearchParams();
//   const width = Dimensions.get("window").width;
//   const SIDEBAR_WIDTH = 64;
//   const CONTENT_GAP = 12;
//   const CONTAINER_PADDING = 16;
//   const availableWidth = Math.max(
//     320,
//     Math.round(width - SIDEBAR_WIDTH - CONTENT_GAP - CONTAINER_PADDING * 2),
//   );
//   const baseCardWidth = availableWidth;
//   const [sliderWidth, setSliderWidth] = useState(0);
//   const SPACING = 12;
//   const cardWidth = (sliderWidth || baseCardWidth) - SPACING;
//   const sliderRef = useRef(null);
//   const sidebarRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [filterMode, setFilterMode] = useState(null);
//   const [bedCounts, setBedCounts] = useState({});
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedFloor, setSelectedFloor] = useState(null);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [tenantName, setTenantName] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [tenantEmail, setTenantEmail] = useState("");
//   const [bedNumber, setBedNumber] = useState(1);
//   const [monthlyRent, setMonthlyRent] = useState("");
//   const [checkIn, setCheckIn] = useState("");
//   const [checkOut, setCheckOut] = useState("");
//   const [tenants, setTenants] = useState({});
//   const [idProofFile, setIdProofFile] = useState("");
//   const [idProofUri, setIdProofUri] = useState("");
//   const [idPreviewVisible, setIdPreviewVisible] = useState(false);
//   const [idPreviewHtml, setIdPreviewHtml] = useState("");
//   const [idOpenUri, setIdOpenUri] = useState("");
//   const [previewUri, setPreviewUri] = useState("");
//   const [showBottomViewId, setShowBottomViewId] = useState(false);
//   const [previewScale, setPreviewScale] = useState(1);
//   const [editAll] = useState(false);
//   const [editValues, setEditValues] = useState({});
//   const [rowEditIndex, setRowEditIndex] = useState(null);
//   const [rowEditValues, setRowEditValues] = useState({});
//   const [tenantsExpanded, setTenantsExpanded] = useState(true);
//   const onPinchStateChange = (e) => {
//     if (e.nativeEvent.state === State.END) {
//       setPreviewScale((prev) => Math.min(3, Math.max(1, prev)));
//     }
//   };
//   const floorPulse = useRef(new Animated.Value(0.8)).current;
//   const floorScale = floorPulse.interpolate({
//     inputRange: [0.8, 1],
//     outputRange: [0.99, 1.01],
//   });
//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(floorPulse, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(floorPulse, {
//           toValue: 0.8,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//       ]),
//     ).start();
//   }, [floorPulse]);

//   const [touchedName, setTouchedName] = useState(false);
//   const [touchedPhone, setTouchedPhone] = useState(false);
//   const [touchedEmail, setTouchedEmail] = useState(false);
//   const [touchedRent, setTouchedRent] = useState(false);
//   const [dashboardData, setDashboardData] = useState(null);
//   // useEffect(() => {
//   //   response_data();
//   // }, []);

//   // const loadOwnerData = async () => {
//   //   try {
//   //     const data = await AsyncStorage.getItem("ownerData");

//   //     if (data) {
//   //       const parsed = JSON.parse(data);
//   //       console.log("Local Registration Data:", parsed);
//   //       setOwnerData(parsed);
//   //     }
//   //   } catch (err) {
//   //     console.log("AsyncStorage Error:", err);
//   //   }
//   // };

//   useEffect(() => {
//   if (!email) return;

//   fetch(`http://192.168.1.37:8000/api/details/${encodeURIComponent(email)}/`)
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("API Response:", data);
//       setResponseData(data);
//     })
//     .catch((err) => console.log("Fetch Error:", err));
// }, [email]);

//   useEffect(() => {
//     if (!modalVisible) {
//       setIdProofFile("");
//       setIdProofUri("");
//       setIdPreviewHtml("");
//       setIdPreviewVisible(false);
//     }
//   }, [modalVisible]);
//   const makeRooms = (n) =>
//     Array.from(
//       { length: n === 1 ? 15 : 4 },
//       (_, i) => `${n}${String(i + 1).padStart(2, "0")}`,
//     );
//   const floors = Array.from({ length: 15 }, (_, i) => {
//     const floorNumber = i + 1;
//     return { floor: `Floor ${floorNumber}`, rooms: makeRooms(floorNumber) };
//   });

//   // const dynamicFloors =
//   // response_data?.building_layout?.map((f) => ({
//   //   floor: `Floor ${f.floorNo}`,
//   //   rooms: f.rooms.map(
//   //     (r) => `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`
//   //   ),
//   // })) || floors;
//   // const dynamicFloors = response_data?.building_layout
//   // ? response_data.building_layout.map((f) => ({
//   //     floor: `Floor ${f.floorNo}`,
//   //     rooms: f.rooms.map((r) => ({
//   //       roomLabel: `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`,
//   //       beds: r.beds,
//   //     })),
//   //   }))
//   // : [];
//   // const stayType = response_data?.stay_type || "hostel";
// const stayType = response_data?.property_type || "hostel";
// const getUnits = (floor) => {
//   if (stayType === "hostel") return floor.rooms || [];
//   if (stayType === "apartment") return floor.flats || [];
//   if (stayType === "commercial") return [floor];
//   return [];
// };
// // const dynamicFloors = response_data?.building_layout
// //   ? response_data.building_layout.map((f) => {

// //       if (stayType === "hostel") {
// //         return {
// //           floor: `Floor ${f.floorNo}`,
// //           rooms: f.rooms.map((r) => ({
// //             roomLabel: `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`,
// //             beds: r.beds,
// //           })),
// //         };
// //       }

// //       if (stayType === "apartment") {
// //         return {
// //           floor: `Floor ${f.floorNo}`,
// //           flats: f.flats.map((fl, idx) => ({
// //             flatNo: `${f.floorNo}${String(idx + 1).padStart(2, "0")}`,
// //             bhk: fl.type || "1BHK",
// //           })),
// //         };
// //       }

// //       if (stayType === "commercial") {
// //         return {
// //           floor: `Floor ${f.floorNo}`,
// //           area: f.area,
// //         };
// //       }

// //       return {};
// //     })
// //   : [];
// const dynamicFloors = response_data?.building_layout
//   ? response_data.building_layout.map((f) => {
//       if (stayType === "hostel") {
//         return {
//           floor: `Floor ${f.floorNo}`,
//           units: (f.rooms || []).map((r) => ({
//             label: `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`,
//             beds: r.beds,
//           })),
//         };
//       }

//       if (stayType === "apartment") {
//         return {
//           floor: `Floor ${f.floorNo}`,
//           units: (f.flats || []).map((fl, idx) => ({
//             label: `${f.floorNo}${String(idx + 1).padStart(2, "0")}`,
//             type: fl.type || "1BHK",
//           })),
//         };
//       }

//       if (stayType === "commercial") {
//         return {
//           floor: `Floor ${f.floorNo}`,
//           units: (f.sections || []).map((s, idx) => ({
//             label: s.area ? `${s.area} sq.ft` : `Section ${s.sectionNo}`,
//             sectionNo: s.sectionNo
//           })),
//         };
//       }

//       return { floor: `Floor ${f.floorNo}`, units: [] };
//     })
//   : [];

//   // const isOccupied = (floorLabel, room) => {
//   //   const key = `${floorLabel}-${room}`;
//   //   const count = bedCounts[key] ?? 0;
//   //   return count > 0;
//   // };
//   // const isOccupied = (floorLabel, unit) => {
//   // const key = `${floorLabel}-${unit}`;
//   // const count = bedCounts[key] ?? 0;
//   const isOccupied = (floorLabel, unitLabel) => {
//   const key = `${floorLabel}-${unitLabel}`;
//   const count = bedCounts[key] ?? 0;

//   if (stayType === "commercial") {
//     return count > 0;
//   }

//   return count > 0;
// };

//   const getCount = (floorLabel, room) =>
//     bedCounts[`${floorLabel}-${room}`] ?? 0;
//   const getTileColor = (floorLabel, room) => {
//     const c = getCount(floorLabel, room);
//     if (filterMode === "occupied") return c >= 4 ? "#2ECC71" : "#F1C40F";
//     if (filterMode === "empty" && c === 0) return "#E74C3C";
//     if (filterMode === null && c === 0) return "#C9A0DC";
//     if (c === 0) return "#E74C3C";
//     if (c >= 4) return "#2ECC71";
//     return "#F1C40F";
//   };
//   const snap = cardWidth + SPACING;
//   const handleSelectFloor = (idx) => {
//     setActiveIndex(idx);
//     sliderRef.current?.scrollTo({
//       x: idx * (cardWidth + SPACING),
//       animated: true,
//     });
//   };
//   useEffect(() => {
//     const SIDE_BUTTON_HEIGHT = 40;
//     const SIDE_BUTTON_GAP = 8;
//     const offset = Math.max(
//       0,
//       idxToOffset(activeIndex, SIDE_BUTTON_HEIGHT, SIDE_BUTTON_GAP) - 60,
//     );
//     sidebarRef.current?.scrollTo({ y: offset, animated: true });
//   }, [activeIndex]);
//   const idxToOffset = (idx, h, g) => idx * (h + g);

//   // const totalRooms = dynamicFloors.reduce((sum, f) => sum + f.rooms.length, 0);
// // const totalRooms = dynamicFloors.reduce((sum, f) => {

// //   if (stayType === "hostel") {
// //     return sum + (f.rooms?.length || 0);
// //   }

// //   if (stayType === "apartment") {
// //     return sum + (f.flats?.length || 0);
// //   }

// //   if (stayType === "commercial") {
// //     return sum + 1;
// //   }

// //   return sum;

// // }, 0);

//   // const occupiedRooms = dynamicFloors.reduce(
//   //   (sum, f) => sum + f.rooms.filter((r) => isOccupied(f.floor, r)).length,
//   //   0,
//   // );
//   // const emptyRooms = totalRooms - occupiedRooms;
//   const totalRooms = dynamicFloors.reduce(
//   (sum, f) => sum + (f.units?.length || 0),
//   0
// );

// const occupiedRooms = dynamicFloors.reduce(
//   (sum, f) =>
//     sum +
//     (f.units || []).filter((u) =>
//       isOccupied(f.floor, u.label)
//     ).length,
//   0
// );

// const emptyRooms = totalRooms - occupiedRooms;
//   const openTenantModal = (floorLabel, room) => {
//     setSelectedFloor(floorLabel);
//     setSelectedRoom(room);
//     const current = getCount(floorLabel, room);
//     setBedNumber(Math.min(4, current + 1));
//     setTenantName("");
//     setContactNumber("");
//     setTenantEmail("");
//     setMonthlyRent("");
//     setCheckIn("");
//     setCheckOut("");
//     setIdProofFile("");
//     setIdProofUri("");
//     setIdPreviewHtml("");
//     setIdPreviewVisible(false);
//     setTouchedName(false);
//     setTouchedPhone(false);
//     setTouchedEmail(false);
//     setTouchedRent(false);
//     setModalVisible(true);
//   };
//   const isValidName = (name) => /^[A-Za-z\s]+$/.test(name.trim());
//   const isValidPhone = (phone) => /^\d{10,11}$/.test(phone.trim());
//   const isValidEmail = (mail) =>
//     mail.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim());
//   const isFormValid = () => {
//     return (
//       isValidName(tenantName) &&
//       isValidPhone(contactNumber) &&
//       monthlyRent.trim().length > 0 &&
//       (idProofUri || idOpenUri) &&
//       isValidEmail(tenantEmail) &&
//       bedNumber >= 1 &&
//       bedNumber <= 4
//     );
//   };
//   const addTenant = () => {
//     console.log("ADDING TENANT", {
//     tenantName,
//     contactNumber,
//     tenantEmail,
//     monthlyRent,
//     idProofUri,
//   });
//     if (!selectedFloor || !selectedRoom) {
//       setModalVisible(false);
//       return;
//     }
//     if (!isFormValid()) {
//       return;
//     }
//     const key = `${selectedFloor}-${selectedRoom}`;
//     setTenants((prev) => {
//       const list = prev[key] ?? [];
//       const nextList = [
//         ...list,
//         {
//           name: tenantName.trim(),
//           phone: contactNumber.trim(),
//           email: tenantEmail.trim(),
//           bed: bedNumber,
//           rent: monthlyRent.trim(),
//           checkIn: checkIn.trim(),
//           checkOut: checkOut.trim(),
//           idUri: idOpenUri || idProofUri,
//         },
//       ];
//       return { ...prev, [key]: nextList };
//     });
//     setBedCounts((prev) => {
//       const next = Math.min(4, (prev[key] ?? 0) + 1);
//       return { ...prev, [key]: next };
//     });
//     setIdProofFile("");
//     setIdProofUri("");
//     setIdOpenUri("");
//     setIdPreviewVisible(false);
//     setShowBottomViewId(false);
//     setModalVisible(false);
//   };
//   const removeTenant = (floorLabel, room, index) => {
//     const key = `${floorLabel}-${room}`;
//     setTenants((prev) => {
//       const list = prev[key] ?? [];
//       const nextList = list.filter((_, i) => i !== index);
//       return { ...prev, [key]: nextList };
//     });
//     setBedCounts((prev) => {
//       const next = Math.max(0, (prev[key] ?? 0) - 1);
//       return { ...prev, [key]: next };
//     });
//   };const getTotalBeds = (floorLabel, roomLabel) => {
//   const floor = dynamicFloors.find((f) => f.floor === floorLabel);
//   const unit = floor?.units.find((u) => u.label === roomLabel);
//   return unit?.beds ?? 0;
// };
// //   const getTotalBeds = (floorLabel, roomLabel) => {
// //   const floor = dynamicFloors.find((f) => f.floor === floorLabel);
// //   const room = floor?.rooms.find((r) => r.roomLabel === roomLabel);
// //   return room?.beds ?? 0;
// // };

// const saveTenant = async () => {
//   try {
//     const formData = new FormData();

//     formData.append("name", tenantName);
//     formData.append("phone", contactNumber);
//     formData.append("email", tenantEmail);
//     formData.append("bed", bedNumber);
//     formData.append("rent", monthlyRent);
//     formData.append("checkIn", checkIn);
//     formData.append("checkOut", checkOut);

//     if (idProofUri) {
//       formData.append("idUri", {
//         uri: idProofUri,
//         name: "idproof.jpg",
//         type: "image/jpeg",
//       });
//     }

//     const response = await fetch(
//       "http://192.168.1.37:8000/api/tenentbeds/",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         body: formData,
//       }
//     );

//     const data = await response.json();
//     console.log("Tenant saved:", data);

//   } catch (error) {
//     console.log("Error saving tenant:", error);
//   }
// };
//   return (
//     <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
//       {/* Header */}
//       <Text style={styles.welcome}>Hello, {ownerName}</Text>
// {/* <Text style={{ color: "#666", marginBottom: 8 }}>{ownerEmail}</Text> */}

//       {/* <Text style={styles.header}>{dashboardData?.name}</Text> */}
// {/* <Text style={styles.header}>{ownerName}</Text>
// <Text>{ownerEmail}</Text> */}
//       {/* <Text>{dashboardData?.email}</Text> */}
//       {/* <Text style={styles.welcome}>Hello {ownerName}</Text> */}
//       {/* Stats Section */}
//       <View style={styles.statsContainer}>
//         <TouchableOpacity
//           style={[
//             styles.statBox,
//             { backgroundColor: "#C5EBD2" },
//             filterMode === "occupied" && styles.statBoxSelected,
//           ]}
//           activeOpacity={0.8}
//           onPress={() => setFilterMode("occupied")}
//         >
//           <Text style={styles.statNumber}>{occupiedRooms}</Text>
//           <Text style={styles.statLabel}>Occupied</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.statBox,
//             { backgroundColor: "#FFCECE" },
//             filterMode === "empty" && styles.statBoxSelected,
//           ]}
//           activeOpacity={0.8}
//           onPress={() => setFilterMode("empty")}
//         >
//           <Text style={styles.statNumber}>{emptyRooms}</Text>
//           <Text style={styles.statLabel}>Empty</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.statBox,
//             { backgroundColor: "#E0D4FF" },
//             filterMode === null && styles.statBoxSelected,
//           ]}
//           activeOpacity={0.8}
//           onPress={() => setFilterMode(null)}
//         >
//           <Text style={styles.statNumber}>{totalRooms}</Text>
//           <Text style={styles.statLabel}>Total</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>Building View</Text>
//         <View style={[styles.legendRow, { marginTop: 0 }]}>
//           <View style={[styles.legendDot, { backgroundColor: "#2ECC71" }]} />
//           <Text style={styles.legendText}>Full</Text>
//           <View style={[styles.legendDot, { backgroundColor: "#F1C40F" }]} />
//           <Text style={styles.legendText}>Partial</Text>
//           <View style={[styles.legendDot, { backgroundColor: "#E74C3C" }]} />
//           <Text style={styles.legendText}>Empty</Text>
//         </View>
//       </View>

//       <View style={styles.contentRow}>
//         <View style={styles.sidebar}>
//           <ScrollView
//             ref={sidebarRef}
//             style={styles.sidebarScroll}
//             contentContainerStyle={styles.sidebarScrollContent}
//             showsVerticalScrollIndicator
//           >
//             {dynamicFloors.map((f, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 style={[
//                   styles.sideButton,
//                   activeIndex === idx && styles.sideButtonActive,
//                 ]}
//                 onPress={() => handleSelectFloor(idx)}
//                 activeOpacity={0.8}
//               >
//                 <Text
//                   style={[
//                     styles.sideButtonText,
//                     activeIndex === idx && styles.sideButtonTextActive,
//                   ]}
//                 >
//                   {idx + 1}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         <ScrollView
//           ref={sliderRef}
//           horizontal
//           snapToInterval={snap}
//           decelerationRate="fast"
//           scrollEventThrottle={8}
//           keyboardShouldPersistTaps="always"
//           onScroll={(e) => {
//             const x = e.nativeEvent.contentOffset.x;
//             const idx = Math.max(
//               0,
//               Math.min(
//                 dynamicFloors.length - 1,
//                 Math.round(x / (cardWidth + SPACING)),
//               ),
//             );
//             setActiveIndex(idx);
//           }}
//           showsHorizontalScrollIndicator={false}
//           style={styles.slider}
//           contentContainerStyle={{ paddingLeft: SPACING, paddingRight: 6 }}
//           onMomentumScrollEnd={(e) => {
//             const x = e.nativeEvent.contentOffset.x;
//             const idx = Math.max(
//               0,
//               Math.min(
//                 dynamicFloors.length - 1,
//                 Math.round((x - SPACING) / (cardWidth + SPACING)),
//               ),
//             );
//             setActiveIndex(idx);
//           }}
//         >
//           {dynamicFloors.map((item, index) => (
//             <View
//               style={[
//                 styles.card,
//                 {
//                   width: cardWidth,
//                   marginRight: index === dynamicFloors.length - 1 ? 0 : SPACING,
//                   height: CARD_HEIGHT,
//                 },
//               ]}
//               key={index}
//               onLayout={(e) => {
//                 if (!sliderWidth) {
//                   setSliderWidth(e.nativeEvent.layout.width);
//                 }
//               }}
//             >
//               <Animated.Text
//                 style={[
//                   styles.floorTitle,
//                   { opacity: floorPulse, transform: [{ scale: floorScale }] },
//                   activeIndex === index && {
//                     color: "#0a7ea4",
//                     backgroundColor: "#E6F7ED",
//                     borderWidth: 1,
//                     borderColor: "#0a7ea4",
//                     paddingHorizontal: 10,
//                     paddingVertical: 4,
//                     borderRadius: 10,
//                     alignSelf: "center",
//                   },
//                 ]}
//               >
//                 {item.floor}
//               </Animated.Text>
//         <ScrollView style={styles.cardScroll} nestedScrollEnabled showsVerticalScrollIndicator scrollEventThrottle={8} >
//          {/* <View style={styles.roomGrid}>

// {stayType === "hostel" &&
//   (filterMode === "occupied"
//     ? item.rooms.filter((r) => isOccupied(item.floor, r.roomLabel))
//     : filterMode === "empty"
//       ? item.rooms.filter((r) => getCount(item.floor, r.roomLabel) < 4)
//       : item.rooms
//   ).map((room, i) => (
//     <TouchableOpacity
//       key={room.roomLabel}
//       style={[
//         styles.roomBox,
//         { backgroundColor: getTileColor(item.floor, room.roomLabel) },
//       ]}
//       onPress={() => openTenantModal(item.floor, room.roomLabel)}
//     >
//       <Text style={styles.roomNumber}>{room.roomLabel}</Text>
//     </TouchableOpacity>
// ))}

// {stayType === "apartment" &&
//   item.flats.map((flat, i) => (
//     <TouchableOpacity
//       key={flat.flatNo}
//       style={[
//         styles.roomBox,
//         { backgroundColor: getTileColor(item.floor, flat.flatNo) },
//       ]}
//       onPress={() => openTenantModal(item.floor, flat.flatNo)}
//     >
//       <Text style={styles.roomNumber}>{flat.flatNo}</Text>
//       <Text style={styles.roomText}>{flat.bhk}</Text>
//     </TouchableOpacity>
// ))}

// {stayType === "commercial" && (
//   <TouchableOpacity
//     style={[
//       styles.roomBox,
//       { backgroundColor: getTileColor(item.floor) },
//     ]}
//     onPress={() => openTenantModal(item.floor, item.area)}
//   >
//     <Text style={styles.roomNumber}>{item.area} sq yd</Text>
//   </TouchableOpacity>
// )}

// </View>
// <View style={styles.roomGrid}>
//   {(item.units || []).map((unit, i) => (
//     <TouchableOpacity
//       key={unit.label}
//       style={[
//         styles.roomBox,
//         { backgroundColor: getTileColor(item.floor, unit.label) },
//       ]}
//       onPress={() => openTenantModal(item.floor, unit.label)}
//     >
//       <Text style={styles.roomNumber}>{unit.label}</Text>

//       {stayType === "apartment" && (
//         <Text style={styles.roomText}>{unit.type}</Text>
//       )}
//     </TouchableOpacity>
//   ))}
// </View> */}
// <View style={styles.roomGrid}>
//   {(item.units || []).map((unit, i) => (
//     <TouchableOpacity
//       key={unit.label || i}
//       style={[
//         styles.roomBox,
//         { backgroundColor: getTileColor(item.floor, unit.label) },
//       ]}
//       onPress={() => openTenantModal(item.floor, unit.label)}
//     >
//       {stayType === "hostel" && (
//   <>
//     <Text style={styles.roomNumber}>{unit.label}</Text>
//     <Text style={styles.roomText}>
//       {getCount(item.floor, unit.label)}/{unit.beds} beds
//     </Text>
//   </>
// )}

// {stayType === "apartment" && (
//   <>
//     <Text style={styles.roomNumber}>{unit.label}</Text>
//     <Text style={styles.roomText}>{unit.type}</Text>
//   </>
// )}

// {stayType === "commercial" && (
//   <Text style={styles.roomNumber}>{unit.label}</Text>
// )}

//       <View style={styles.controlsRow}>
//         <TouchableOpacity
//           style={styles.controlBtn}
//           onPress={() => openTenantModal(item.floor, unit.label)}
//         >
//           <Text style={styles.controlText}>+</Text>
//         </TouchableOpacity>
//       </View>
//     </TouchableOpacity>
//   ))}
// </View>
//          {/* <View style={styles.roomGrid}>
//                   {(filterMode === "occupied"
//   ? item.rooms.filter((r) => isOccupied(item.floor, r.roomLabel))
//   : filterMode === "empty"
//     ? item.rooms.filter((r) => getCount(item.floor, r.roomLabel) < 4)
//     : item.rooms
// ).map((room, i) => (
//   <TouchableOpacity
//     key={room.roomLabel}
//     style={[
//       styles.roomBox,
//       {
//         backgroundColor: getTileColor(item.floor, room.roomLabel),
//       },
//     ]}
//     onPress={() => openTenantModal(item.floor, room.roomLabel)}
//   >  */}
//                   {/* {(filterMode === "occupied"
//                     ? item.rooms.filter((r) => isOccupied(item.floor, r))
//                     : filterMode === "empty"
//                       ? item.rooms.filter((r) => getCount(item.floor, r) < 4)
//                       : item.rooms
//                   ).map((room, i) => (
//                     <TouchableOpacity
//                       key={i}
//                       style={[
//                         styles.roomBox,
//                         {
//                           backgroundColor: getTileColor(item.floor, room),
//                         },
//                       ]}
//                       onPress={() => openTenantModal(item.floor, room)}
//                     > */}
//                       {/* {(() => {
//                         const tileColor = getTileColor(item.floor, room);
//                         const tColor =
//                           tileColor === "#2ECC71" || tileColor === "#E74C3C"
//                             ? "#FFFFFF"
//                             : "#1F2937";
//                        return (
//   <>
//     <Text style={[styles.roomNumber, { color: tColor }]}>
//   {room.roomLabel}
// </Text>

// <Text style={[styles.roomText, { color: tColor }]}>
//   {getCount(item.floor, room.roomLabel)}/{room.beds} beds
// </Text>
//   </>
// );
// })()}

// <View style={styles.controlsRow}>
//   <TouchableOpacity
//     style={styles.controlBtn}
//     onPress={() => openTenantModal(item.floor, room.roomLabel)}
//   >
//     // <Text style={styles.controlText}>+</Text>
//   </TouchableOpacity>
// </View>
//                     </TouchableOpacity>
//                   ))}
//                 </View> */}
//               </ScrollView>
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//       <Modal transparent visible={modalVisible} animationType="fade">
//         <View style={styles.modalOverlay}>
//           <KeyboardAvoidingView behavior="padding" style={{ width: "100%" }}>
//             <View style={styles.modalCard}>
//               <ScrollView
//                 style={styles.modalContentScroll}
//                 contentContainerStyle={{ paddingBottom: 24 }}
//                 nestedScrollEnabled
//                 stickyHeaderIndices={[0]}
//                 keyboardShouldPersistTaps="always"
//               >
//                 <View
//                   style={[
//                     styles.modalHeaderRow,
//                     { backgroundColor: "#FFFFFF", position: "relative" },
//                   ]}
//                 >
//                   <Text style={styles.modalTitle}>
// {
//   stayType === "hostel" && `Room ${selectedRoom}`
// }
// {
//   stayType === "apartment" && `Flat ${selectedRoom}`
// }
// {
//   stayType === "commercial" && `Section ${selectedRoom}`
// }                  </Text>
//                   <TouchableOpacity
//                     style={styles.modalCloseBtn}
//                     onPress={() => setModalVisible(false)}
//                   >
//                     <Text style={styles.modalClose}>×</Text>
//                   </TouchableOpacity>
//                 </View>
//                   <View style={styles.modalStatsRow}>
//   <View style={styles.modalStatBlock}>
//     <Text style={styles.modalStatLabel}>Occupancy</Text>
//     <Text style={styles.modalStatValue}>
//       {getCount(selectedFloor ?? "", selectedRoom ?? "") > 0
//         ? "Occupied"
//         : "Vacant"}
//     </Text>
//   </View>

//   <View style={styles.modalStatBlock}>
//     <Text style={styles.modalStatLabel}>Available</Text>

//     {stayType === "apartment" ? (
//       <Text style={[styles.modalStatValue, { color: "#0a7ea4" }]}>
//         {
//           dynamicFloors
//             .find(f => f.floor === selectedFloor)
//             ?.units.find(u => u.label === selectedRoom)?.type
//         }
//       </Text>
//     ) : stayType === "commercial" ? (
//       <Text style={[styles.modalStatValue, { color: "#0a7ea4" }]}>
//         Section {selectedRoom}
//       </Text>
//     ) : (
//       <Text style={[styles.modalStatValue, { color: "#2ECC71" }]}>
//         {Math.max(
//           0,
//           getTotalBeds(selectedFloor ?? "", selectedRoom ?? "") -
//           getCount(selectedFloor ?? "", selectedRoom ?? "")
//         )} beds
//       </Text>
//     )}
//   </View>
// </View>
//                 <View style={styles.modalSectionHeader}>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Text style={styles.modalSectionTitle}>
//                       Current Tenants
//                     </Text>
//                     <TouchableOpacity
//                       onPress={() => setTenantsExpanded((v) => !v)}
//                       style={{ padding: 6 }}
//                     >
//                       <Ionicons
//                         name={
//                           tenantsExpanded
//                             ? "chevron-up-outline"
//                             : "chevron-down-outline"
//                         }
//                         size={20}
//                         color="#111"
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//                 {tenantsExpanded && (
//                   <View style={styles.currentTenantsBox}>
//                     {(tenants[`${selectedFloor}-${selectedRoom}`] ?? []).map(
//                       (t, idx) => (
//                         <View key={idx} style={styles.tenantCard}>
//                           <View style={{ flex: 1 }}>
//                             {!(editAll || rowEditIndex === idx) ? (
//                               <Text style={styles.tenantName}>{t.name}</Text>
//                             ) : (
//                               <TextInput
//                                 value={
//                                   editAll
//                                     ? (editValues[idx]?.name ?? t.name)
//                                     : (rowEditValues[idx]?.name ?? t.name)
//                                 }
//                                 onChangeText={(val) => {
//                                   const sanitized = val.replace(
//                                     /[^A-Za-z\s]/g,
//                                     "",
//                                   );
//                                   if (editAll) {
//                                     setEditValues((prev) => ({
//                                       ...prev,
//                                       [idx]: {
//                                         ...(prev[idx] || {}),
//                                         name: sanitized,
//                                       },
//                                     }));
//                                   } else {
//                                     setRowEditValues((prev) => ({
//                                       ...prev,
//                                       [idx]: {
//                                         ...(prev[idx] || {}),
//                                         name: sanitized,
//                                       },
//                                     }));
//                                   }
//                                 }}
//                                 placeholder="Name"
//                                 style={[styles.input, { marginBottom: 6 }]}
//                                 autoCapitalize="words"
//                                 autoCorrect={false}
//                               />
//                             )}
//                             <View
//                               style={{
//                                 flexDirection: "row",
//                                 alignItems: "center",
//                               }}
//                             >
//                               {!(editAll || rowEditIndex === idx) ? (
//                                 <>
//                                   <Text style={styles.tenantMeta}>
//                                     Bed {t.bed} ·{" "}
//                                   </Text>
//                                   <TouchableOpacity
//                                     onPress={() => {
//                                       const tel = `tel:${t.phone}`;
//                                       Linking.openURL(tel).catch(() => {});
//                                     }}
//                                     style={{
//                                       flexDirection: "row",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <Ionicons
//                                       name="call-outline"
//                                       size={14}
//                                       color="#2ECC71"
//                                     />
//                                     <Text
//                                       style={[
//                                         styles.tenantMeta,
//                                         { marginLeft: 4 },
//                                       ]}
//                                     >
//                                       {t.phone}
//                                     </Text>
//                                   </TouchableOpacity>
//                                   {!!t.rent && (
//                                     <>
//                                       <Text style={styles.tenantMeta}> · </Text>
//                                       <Text
//                                         style={[
//                                           styles.tenantMeta,
//                                           { color: "#0a7ea4" },
//                                         ]}
//                                       >
//                                         ₹
//                                       </Text>
//                                       <Text
//                                         style={[
//                                           styles.tenantMeta,
//                                           { marginLeft: 4 },
//                                         ]}
//                                       >
//                                         {t.rent}
//                                       </Text>
//                                     </>
//                                   )}
//                                 </>
//                               ) : (
//                                 <View style={{ flex: 1 }}>
//                                   <View
//                                     style={{
//                                       flexDirection: "row",
//                                       alignItems: "center",
//                                       gap: 8,
//                                     }}
//                                   >
//                                     <Text style={styles.tenantMeta}>Bed</Text>
//                                     {(() => {
//                                       const key = `${selectedFloor}-${selectedRoom}`;
//                                       const list = tenants[key] ?? [];
//                                       const chosen = editAll
//                                         ? new Set(
//                                             list
//                                               .map((p, i) =>
//                                                 i === idx
//                                                   ? null
//                                                   : (editValues[i]?.bed ??
//                                                     p.bed),
//                                               )
//                                               .filter((x) => !!x),
//                                           )
//                                         : new Set(
//                                             list
//                                               .map((p, i) =>
//                                                 i === idx ? null : p.bed,
//                                               )
//                                               .filter((x) => !!x),
//                                           );
//                                       return [1, 2, 3, 4].map((b) => {
//                                         const active = editAll
//                                           ? (editValues[idx]?.bed ?? t.bed) ===
//                                             b
//                                           : (rowEditValues[idx]?.bed ??
//                                               t.bed) === b;
//                                         const disabled = chosen.has(b);
//                                         return (
//                                           <TouchableOpacity
//                                             key={b}
//                                             style={[
//                                               styles.bedBtn,
//                                               active && styles.bedBtnActive,
//                                               disabled && styles.bedBtnOccupied,
//                                             ]}
//                                             onPress={() => {
//                                               if (editAll) {
//                                                 setEditValues((prev) => ({
//                                                   ...prev,
//                                                   [idx]: {
//                                                     ...(prev[idx] || {}),
//                                                     bed: b,
//                                                   },
//                                                 }));
//                                               } else {
//                                                 setRowEditValues((prev) => ({
//                                                   ...prev,
//                                                   [idx]: {
//                                                     ...(prev[idx] || {}),
//                                                     bed: b,
//                                                   },
//                                                 }));
//                                               }
//                                             }}
//                                             disabled={disabled}
//                                           >
//                                             <Text
//                                               style={[
//                                                 styles.bedBtnText,
//                                                 active &&
//                                                   styles.bedBtnTextActive,
//                                                 disabled &&
//                                                   styles.bedBtnTextOccupied,
//                                               ]}
//                                             >
//                                               {disabled ? "✓" : b}
//                                             </Text>
//                                           </TouchableOpacity>
//                                         );
//                                       });
//                                     })()}
//                                   </View>
//                                   <View style={{ marginTop: 6 }}>
//                                     <TextInput
//                                       value={
//                                         editAll
//                                           ? (editValues[idx]?.phone ?? t.phone)
//                                           : (rowEditValues[idx]?.phone ??
//                                             t.phone)
//                                       }
//                                       onChangeText={(val) => {
//                                         const digits = val
//                                           .replace(/[^0-9]/g, "")
//                                           .slice(0, 11);
//                                         if (editAll) {
//                                           setEditValues((prev) => ({
//                                             ...prev,
//                                             [idx]: {
//                                               ...(prev[idx] || {}),
//                                               phone: digits,
//                                             },
//                                           }));
//                                         } else {
//                                           setRowEditValues((prev) => ({
//                                             ...prev,
//                                             [idx]: {
//                                               ...(prev[idx] || {}),
//                                               phone: digits,
//                                             },
//                                           }));
//                                         }
//                                       }}
//                                       placeholder="Phone"
//                                       style={[
//                                         styles.input,
//                                         { marginBottom: 6 },
//                                       ]}
//                                       keyboardType="phone-pad"
//                                       maxLength={11}
//                                       autoCorrect={false}
//                                     />
//                                     <TextInput
//                                       value={
//                                         editAll
//                                           ? (editValues[idx]?.email ??
//                                             t.email ??
//                                             "")
//                                           : (rowEditValues[idx]?.email ??
//                                             t.email ??
//                                             "")
//                                       }
//                                       onChangeText={(val) => {
//                                         const v = val.trim();
//                                         if (editAll) {
//                                           setEditValues((prev) => ({
//                                             ...prev,
//                                             [idx]: {
//                                               ...(prev[idx] || {}),
//                                               email: v,
//                                             },
//                                           }));
//                                         } else {
//                                           setRowEditValues((prev) => ({
//                                             ...prev,
//                                             [idx]: {
//                                               ...(prev[idx] || {}),
//                                               email: v,
//                                             },
//                                           }));
//                                         }
//                                       }}
//                                       placeholder="Email (optional)"
//                                       style={[
//                                         styles.input,
//                                         { marginBottom: 6 },
//                                       ]}
//                                       keyboardType="email-address"
//                                       autoCapitalize="none"
//                                       autoCorrect={false}
//                                     />
//                                     <TextInput
//                                       value={
//                                         editAll
//                                           ? (editValues[idx]?.rent ??
//                                             t.rent ??
//                                             "")
//                                           : (rowEditValues[idx]?.rent ??
//                                             t.rent ??
//                                             "")
//                                       }
//                                       onChangeText={(val) => {
//                                         const digits = val.replace(
//                                           /[^0-9]/g,
//                                           "",
//                                         );
//                                         if (editAll) {
//                                           setEditValues((prev) => ({
//                                             ...prev,
//                                             [idx]: {
//                                               ...(prev[idx] || {}),
//                                               rent: digits,
//                                             },
//                                           }));
//                                         } else {
//                                           setRowEditValues((prev) => ({
//                                             ...prev,
//                                             [idx]: {
//                                               ...(prev[idx] || {}),
//                                               rent: digits,
//                                             },
//                                           }));
//                                         }
//                                       }}
//                                       placeholder="Monthly Rent"
//                                       style={[styles.input]}
//                                       keyboardType="numeric"
//                                       autoCorrect={false}
//                                     />
//                                   </View>
//                                 </View>
//                               )}
//                             </View>
//                             {!(editAll || rowEditIndex === idx) &&
//                               (t.checkIn || t.checkOut) && (
//                                 <View
//                                   style={{
//                                     flexDirection: "row",
//                                     alignItems: "center",
//                                     flexWrap: "wrap",
//                                     marginTop: 2,
//                                   }}
//                                 >
//                                   {!!t.checkIn && (
//                                     <View
//                                       style={{
//                                         flexDirection: "row",
//                                         alignItems: "center",
//                                       }}
//                                     >
//                                       <Ionicons
//                                         name="calendar-outline"
//                                         size={14}
//                                         color="#555"
//                                       />
//                                       <Text
//                                         style={[
//                                           styles.tenantMeta,
//                                           { marginLeft: 4 },
//                                         ]}
//                                       >
//                                         In {t.checkIn}
//                                       </Text>
//                                     </View>
//                                   )}
//                                   {!!t.checkOut && (
//                                     <View
//                                       style={{
//                                         flexDirection: "row",
//                                         alignItems: "center",
//                                         marginLeft: 8,
//                                       }}
//                                     >
//                                       <Ionicons
//                                         name="calendar-outline"
//                                         size={14}
//                                         color="#555"
//                                       />
//                                       <Text
//                                         style={[
//                                           styles.tenantMeta,
//                                           { marginLeft: 4 },
//                                         ]}
//                                       >
//                                         Out {t.checkOut}
//                                       </Text>
//                                     </View>
//                                   )}
//                                 </View>
//                               )}

//                             {(editAll || rowEditIndex === idx) && (
//                               <View
//                                 style={{
//                                   flexDirection: "row",
//                                   alignItems: "center",
//                                   gap: 8,
//                                   marginTop: 6,
//                                   flexWrap: "wrap",
//                                 }}
//                               >
//                                 <TextInput
//                                   value={
//                                     editAll
//                                       ? (editValues[idx]?.in ?? t.checkIn ?? "")
//                                       : (rowEditValues[idx]?.in ??
//                                         t.checkIn ??
//                                         "")
//                                   }
//                                   onChangeText={(val) => {
//                                     const sanitized = val.replace(
//                                       /[^A-Za-z0-9\s/.\-:]/g,
//                                       "",
//                                     );
//                                     if (editAll) {
//                                       setEditValues((prev) => ({
//                                         ...prev,
//                                         [idx]: {
//                                           ...(prev[idx] || {}),
//                                           in: sanitized,
//                                         },
//                                       }));
//                                     } else {
//                                       setRowEditValues((prev) => ({
//                                         ...prev,
//                                         [idx]: {
//                                           ...(prev[idx] || {}),
//                                           in: sanitized,
//                                         },
//                                       }));
//                                     }
//                                   }}
//                                   placeholder="Check-in (DD/MM/YY or DD-MM-YY)"
//                                   style={[
//                                     styles.input,
//                                     { flexBasis: "48%", flexGrow: 1 },
//                                   ]}
//                                   keyboardType="default"
//                                   autoCorrect={false}
//                                   autoComplete="off"
//                                   textContentType="none"
//                                   importantForAutofill="no"
//                                 />
//                                 <TextInput
//                                   value={
//                                     editAll
//                                       ? (editValues[idx]?.out ??
//                                         t.checkOut ??
//                                         "")
//                                       : (rowEditValues[idx]?.out ??
//                                         t.checkOut ??
//                                         "")
//                                   }
//                                   onChangeText={(val) => {
//                                     const sanitized = val.replace(
//                                       /[^A-Za-z0-9\s/.\-:]/g,
//                                       "",
//                                     );
//                                     if (editAll) {
//                                       setEditValues((prev) => ({
//                                         ...prev,
//                                         [idx]: {
//                                           ...(prev[idx] || {}),
//                                           out: sanitized,
//                                         },
//                                       }));
//                                     } else {
//                                       setRowEditValues((prev) => ({
//                                         ...prev,
//                                         [idx]: {
//                                           ...(prev[idx] || {}),
//                                           out: sanitized,
//                                         },
//                                       }));
//                                     }
//                                   }}
//                                   placeholder="Check-out (DD/MM/YY or DD-MM-YY)"
//                                   style={[
//                                     styles.input,
//                                     { flexBasis: "48%", flexGrow: 1 },
//                                   ]}
//                                   keyboardType="default"
//                                   autoCorrect={false}
//                                   autoComplete="off"
//                                   textContentType="none"
//                                   importantForAutofill="no"
//                                 />
//                               </View>
//                             )}
//                             {rowEditIndex === idx && (
//                               <View style={{ width: "100%", marginTop: 8 }}>
//                                 <View
//                                   style={{
//                                     flexDirection: "row",
//                                     alignItems: "center",
//                                     gap: 8,
//                                     marginBottom: 8,
//                                   }}
//                                 >
//                                   <TouchableOpacity
//                                     style={[
//                                       styles.viewBtn,
//                                       {
//                                         width: 60,
//                                         paddingVertical: 6,
//                                         paddingHorizontal: 8,
//                                       },
//                                     ]}
//                                     onPress={async () => {
//                                       const uri =
//                                         rowEditValues[idx]?.idUri ?? t.idUri;
//                                       if (uri) {
//                                         setIdPreviewVisible(true);
//                                         setPreviewUri(uri);
//                                         setShowBottomViewId(false);
//                                       }
//                                     }}
//                                   >
//                                     <Text style={styles.viewBtnText}>ID</Text>
//                                   </TouchableOpacity>
//                                   <TouchableOpacity
//                                     style={[styles.smallBtn]}
//                                     onPress={async () => {
//                                       try {
//                                         const result =
//                                           await DocumentPicker.getDocumentAsync(
//                                             {
//                                               type: [
//                                                 "image/*",
//                                                 "application/pdf",
//                                               ],
//                                               multiple: false,
//                                               copyToCacheDirectory: true,
//                                             },
//                                           );
//                                         let uri = null;
//                                         if (
//                                           result?.assets &&
//                                           result.assets.length > 0
//                                         ) {
//                                           uri = result.assets[0].uri || null;
//                                         } else if (result?.uri) {
//                                           uri = result.uri;
//                                         }
//                                         if (uri) {
//                                           setRowEditValues((prev) => ({
//                                             ...prev,
//                                             [idx]: {
//                                               ...(prev[idx] || {}),
//                                               idUri: uri,
//                                             },
//                                           }));
//                                         }
//                                       } catch (_) {}
//                                     }}
//                                   >
//                                     <Text style={styles.smallBtnText}>
//                                       Change ID
//                                     </Text>
//                                   </TouchableOpacity>
//                                 </View>
//                                 {(() => {
//                                   const key = `${selectedFloor}-${selectedRoom}`;
//                                   const list = tenants[key] ?? [];
//                                   const v = rowEditValues[idx] || {};
//                                   const nm = v.name ?? t.name;
//                                   const ph = v.phone ?? t.phone;
//                                   const em = v.email ?? t.email ?? "";
//                                   const bd = v.bed ?? t.bed;
//                                   const used = new Set(
//                                     list
//                                       .map((p, i) => (i === idx ? null : p.bed))
//                                       .filter((x) => !!x),
//                                   );
//                                   const valid =
//                                     /^[A-Za-z\s]+$/.test((nm || "").trim()) &&
//                                     /^\d{10,11}$/.test((ph || "").trim()) &&
//                                     ((em || "").trim().length === 0 ||
//                                       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//                                         (em || "").trim(),
//                                       )) &&
//                                     bd >= 1 &&
//                                     bd <= 4 &&
//                                     !used.has(bd);
//                                   return (
//                                     <View
//                                       style={{ flexDirection: "row", gap: 8 }}
//                                     >
//                                       <TouchableOpacity
//                                         style={[
//                                           styles.smallBtn,
//                                           !valid && { opacity: 0.5 },
//                                           { flex: 1 },
//                                         ]}
//                                         disabled={!valid}
//                                         onPress={() => {
//                                           const updated = list.map((p, i) => {
//                                             if (i !== idx) return p;
//                                             const vv = rowEditValues[idx] || {};
//                                             return {
//                                               ...p,
//                                               name: (vv.name ?? p.name).trim(),
//                                               phone: (
//                                                 vv.phone ?? p.phone
//                                               ).trim(),
//                                               email: (
//                                                 vv.email ??
//                                                 p.email ??
//                                                 ""
//                                               ).trim(),
//                                               bed: vv.bed ?? p.bed,
//                                               rent: (
//                                                 vv.rent ??
//                                                 p.rent ??
//                                                 ""
//                                               ).trim(),
//                                               checkIn: (
//                                                 vv.in ??
//                                                 p.checkIn ??
//                                                 ""
//                                               ).trim(),
//                                               checkOut: (
//                                                 vv.out ??
//                                                 p.checkOut ??
//                                                 ""
//                                               ).trim(),
//                                               idUri: vv.idUri ?? p.idUri,
//                                             };
//                                           });
//                                           setTenants((prev) => ({
//                                             ...prev,
//                                             [key]: updated,
//                                           }));
//                                           setRowEditIndex(null);
//                                           setRowEditValues({});
//                                         }}
//                                       >
//                                         <Text style={styles.smallBtnText}>
//                                           Save
//                                         </Text>
//                                       </TouchableOpacity>
//                                       <TouchableOpacity
//                                         style={[
//                                           styles.smallBtn,
//                                           {
//                                             backgroundColor: "#E5E7EB",
//                                             borderColor: "#E5E7EB",
//                                             flex: 1,
//                                           },
//                                         ]}
//                                         onPress={() => {
//                                           setRowEditIndex(null);
//                                           setRowEditValues({});
//                                         }}
//                                       >
//                                         <Text
//                                           style={[
//                                             styles.smallBtnText,
//                                             { color: "#374151" },
//                                           ]}
//                                         >
//                                           Cancel
//                                         </Text>
//                                       </TouchableOpacity>
//                                       <TouchableOpacity
//                                         onPress={() =>
//                                           removeTenant(
//                                             selectedFloor,
//                                             selectedRoom,
//                                             idx,
//                                           )
//                                         }
//                                         style={{
//                                           marginLeft: 8,
//                                           alignItems: "center",
//                                           justifyContent: "center",
//                                         }}
//                                       >
//                                         <Ionicons
//                                           name="trash-outline"
//                                           size={20}
//                                           color="#E74C3C"
//                                         />
//                                       </TouchableOpacity>
//                                     </View>
//                                   );
//                                 })()}
//                               </View>
//                             )}
//                           </View>
//                           <View style={styles.actionCol}>
//                             {rowEditIndex !== idx ? (
//                               <>
//                                 <TouchableOpacity
//                                   style={[
//                                     styles.smallBtn,
//                                     { height: 28, alignSelf: "stretch" },
//                                   ]}
//                                   onPress={() => {
//                                     setRowEditIndex(idx);
//                                     setRowEditValues((prev) => ({
//                                       ...prev,
//                                       [idx]: {
//                                         name: t.name || "",
//                                         phone: t.phone || "",
//                                         email: t.email || "",
//                                         bed: t.bed,
//                                         rent: t.rent || "",
//                                         in: t.checkIn || "",
//                                         out: t.checkOut || "",
//                                         idUri: t.idUri || "",
//                                       },
//                                     }));
//                                   }}
//                                 >
//                                   <Text style={styles.smallBtnText}>Edit</Text>
//                                 </TouchableOpacity>
//                                 <View style={{ flex: 1 }} />
//                                 <TouchableOpacity
//                                   onPress={() =>
//                                     removeTenant(
//                                       selectedFloor,
//                                       selectedRoom,
//                                       idx,
//                                     )
//                                   }
//                                   style={{
//                                     alignSelf: "center",
//                                     marginTop: 8,
//                                     marginBottom: 10,
//                                   }}
//                                 >
//                                   <Ionicons
//                                     name="trash-outline"
//                                     size={22}
//                                     color="#E74C3C"
//                                   />
//                                 </TouchableOpacity>
//                               </>
//                             ) : (
//                               <></>
//                             )}
//                           </View>
//                         </View>
//                       ),
//                     )}
//                     {(tenants[`${selectedFloor}-${selectedRoom}`] ?? [])
//                       .length === 0 && (
//                       <Text style={styles.emptyTenants}>No tenants</Text>
//                     )}
//                   </View>
//                 )}
//                 <View style={styles.modalSectionHeader}>
//                   <Text style={styles.modalSectionTitle}>Add New Tenant</Text>
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>Tenant Name</Text>
//                   <TextInput
//                     value={tenantName}
//                     onChangeText={(t) => {
//                       if (/^[A-Za-z\s]*$/.test(t)) {
//                         setTenantName(t);
//                       }
//                     }}
//                     onBlur={() => setTouchedName(!isValidName(tenantName))}
//                     style={[
//                       styles.input,
//                       touchedName &&
//                         (tenantName.trim().length === 0 ||
//                           !/^[A-Za-z\s]+$/.test(tenantName.trim())) &&
//                         styles.inputError,
//                     ]}
//                     placeholder="Tenant Name"
//                     autoCapitalize="words"
//                     autoCorrect={false}
//                   />
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>Contact Number</Text>
//                   <TextInput
//                     value={contactNumber}
//                     onChangeText={(t) =>
//                       setContactNumber(t.replace(/[^0-9]/g, "").slice(0, 11))
//                     }
//                     onBlur={() => setTouchedPhone(!isValidPhone(contactNumber))}
//                     style={[
//                       styles.input,
//                       touchedPhone &&
//                         !/^\d{10,11}$/.test(contactNumber.trim()) &&
//                         styles.inputError,
//                     ]}
//                     placeholder="Contact Number"
//                     keyboardType="phone-pad"
//                     maxLength={11}
//                     textContentType="telephoneNumber"
//                     autoComplete="tel"
//                     autoCorrect={false}
//                   />
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>Email</Text>
//                   <TextInput
//                     value={tenantEmail}
//                     onChangeText={(t) => setTenantEmail(t.trim())}
//                     onBlur={() => setTouchedEmail(!isValidEmail(tenantEmail))}
//                     style={[
//                       styles.input,
//                       touchedEmail &&
//                         tenantEmail.trim().length > 0 &&
// !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenantEmail.trim()) &&
//                         styles.inputError,
//                     ]}
//                     placeholder="Email (optional)"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoComplete="email"
//                     textContentType="emailAddress"
//                     autoCorrect={false}
//                   />
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>
//                     Upload ID (Aadhaar / PAN)
//                   </Text>
//                   <TouchableOpacity
//                     style={styles.uploadBtn}
//                     onPress={async () => {
//                       const result = await DocumentPicker.getDocumentAsync({
//                         type: ["image/*", "application/pdf"],
//                         multiple: false,
//                         copyToCacheDirectory: true,
//                       });
//                       if (result?.assets && result.assets.length > 0) {
//                         const file = result.assets[0];
//                         setIdProofFile(file.name || "selected-file");
//                         setIdProofUri(file.uri || "");
//                         setShowBottomViewId(true);
//                         if (
//                           (file.mimeType || file.name || "")
//                             .toLowerCase()
//                             .includes("pdf")
//                         ) {
//                           try {
//                             const contentUri =
//                               await FileSystem.getContentUriAsync(file.uri);
//                             setIdOpenUri(contentUri);
//                           } catch {
//                             setIdOpenUri(file.uri || "");
//                           }
//                         } else {
//                           setIdOpenUri(file.uri || "");
//                         }
//                         const lower = (
//                           file.mimeType ||
//                           file.name ||
//                           ""
//                         ).toLowerCase();
//                         if (
//                           lower.includes("pdf") ||
//                           (file.uri || "").toLowerCase().endsWith(".pdf")
//                         ) {
//                           try {
//                             const base64 = await FileSystem.readAsStringAsync(
//                               file.uri,
//                               { encoding: "base64" },
//                             );
//                             const html = `
//                           <!DOCTYPE html>
//                           <html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
//                           <body style="margin:0;padding:0;background:#F9FAFB;">
//                             <embed src="data:application/pdf;base64,${base64}" type="application/pdf" style="width:100%;height:100vh;" />
//                           </body></html>`;
//                             setIdPreviewHtml(html);
//                           } catch (_) {
//                             setIdPreviewHtml("");
//                           }
//                         } else {
//                           setIdPreviewHtml("");
//                         }
//                       } else if (result?.name) {
//                         setIdProofFile(result.name);
//                         if (result?.uri) setIdProofUri(result.uri);
//                         setShowBottomViewId(true);
//                         if (
//                           (result.name || "").toLowerCase().endsWith(".pdf") &&
//                           result.uri
//                         ) {
//                           try {
//                             const contentUri =
//                               await FileSystem.getContentUriAsync(result.uri);
//                             setIdOpenUri(contentUri);
//                           } catch {
//                             setIdOpenUri(result.uri);
//                           }
//                         } else {
//                           setIdOpenUri(result.uri || "");
//                         }
//                         const lower = (result.name || "").toLowerCase();
//                         if (lower.endsWith(".pdf") && result.uri) {
//                           try {
//                             const base64 = await FileSystem.readAsStringAsync(
//                               result.uri,
//                               { encoding: "base64" },
//                             );
//                             const html = `
//                           <!DOCTYPE html>
//                           <html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
//                           <body style="margin:0;padding:0;background:#F9FAFB;">
//                             <embed src="data:application/pdf;base64,${base64}" type="application/pdf" style="width:100%;height:100vh;" />
//                           </body></html>`;
//                             setIdPreviewHtml(html);
//                           } catch (_) {
//                             setIdPreviewHtml("");
//                           }
//                         } else {
//                           setIdPreviewHtml("");
//                         }
//                       }
//                     }}
//                   >
//                     <Text style={styles.uploadBtnText}>
//                       {idProofFile ? idProofFile : "Choose file"}
//                     </Text>
//                   </TouchableOpacity>
//                   {!!idProofUri && showBottomViewId && (
//                     <TouchableOpacity
//                       style={styles.viewBtn}
//                       onPress={async () => {
//                         const targetUri = idOpenUri || idProofUri;
//                         const lower = (targetUri || "").toLowerCase();
//                         if (
//                           lower.endsWith(".pdf") ||
//                           targetUri.startsWith("content://")
//                         ) {
//                           try {
//                             await Linking.openURL(targetUri);
//                           } catch (_) {
//                             setIdPreviewVisible(true);
//                             setPreviewUri(targetUri);
//                           }
//                         } else {
//                           setIdPreviewVisible(true);
//                           setPreviewUri(targetUri);
//                         }
//                       }}
//                     >
//                       <Text style={styles.viewBtnText}>View ID</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>Select Bed</Text>
// <View style={styles.bedPickerRow}>
//   {(() => {
//     const occ = (
//       tenants[`${selectedFloor}-${selectedRoom}`] ?? []
//     ).map((x) => x.bed);

//     const totalBeds = getTotalBeds(selectedFloor, selectedRoom);

//     return Array.from({ length: totalBeds }, (_, i) => i + 1).map((b) => {
//       const isOcc = occ.includes(b);

//       return (
//         <TouchableOpacity
//           key={b}
//           style={[
//             styles.bedBtn,
//             bedNumber === b && styles.bedBtnActive,
//             isOcc && styles.bedBtnOccupied,
//           ]}
//           onPress={() => setBedNumber(b)}
//           disabled={isOcc}
//         >
//           <Text
//             style={[
//               styles.bedBtnText,
//               bedNumber === b && styles.bedBtnTextActive,
//               isOcc && styles.bedBtnTextOccupied,
//             ]}
//           >
//             {isOcc ? "✓" : b}
//           </Text>
//         </TouchableOpacity>
//       );
//     });
//   })()}
// </View>
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>Monthly Rent</Text>
//                   <TextInput
//                     value={monthlyRent}
//                     onChangeText={(t) =>
//                       setMonthlyRent(t.replace(/[^0-9]/g, ""))
//                     }
//                     onBlur={() =>
//                       setTouchedRent(monthlyRent.trim().length === 0)
//                     }
//                     style={[
//                       styles.input,
//                       touchedRent &&
//                         monthlyRent.trim().length === 0 &&
//                         styles.inputError,
//                     ]}
//                     placeholder="Monthly Rent"
//                     keyboardType="numeric"
//                     autoCorrect={false}
//                     autoComplete="off"
//                     textContentType="none"
//                     importantForAutofill="no"
//                   />
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>Check-in Date</Text>
//                   <TextInput
//                     value={checkIn}
//                     onChangeText={(t) => setCheckIn(t.replace(/[^\d/-]/g, ""))}
//                     style={styles.input}
//                     placeholder="yyyy-mm-dd "
//                     keyboardType="default"
//                     autoCorrect={false}
//                     autoComplete="off"
//                     textContentType="none"
//                     importantForAutofill="no"
//                   />
//                 </View>
//                 <View style={styles.modalRow}>
//                   <Text style={styles.modalLabel}>Check-out Date</Text>
//                   <TextInput
//                     value={checkOut}
//                     onChangeText={(t) => setCheckOut(t.replace(/[^\d/-]/g, ""))}
//                     style={styles.input}
//                     placeholder="DD/MM/YY "
//                     keyboardType="default"
//                     autoCorrect={false}
//                     autoComplete="off"
//                     textContentType="none"
//                     importantForAutofill="no"
//                   />
//                 </View>
//                 {/* <TouchableOpacity
//                   style={[styles.addBtn, !isFormValid() && { opacity: 0.5 }]}
//                   onPressIn={addTenant}
//                   disabled={!isFormValid()}
//                 >
//                   <Text style={styles.addBtnText}>Add Tenant</Text>
//                 </TouchableOpacity> */}
//                 {/* <TouchableOpacity
//                 style={[styles.addBtn, !isFormValid() && { opacity: 0.5 }]}
//                    onPress={saveTenant}
//                    >
//                 <Text>Add Tenant</Text>
//                </TouchableOpacity> */}
//                <TouchableOpacity
//   style={[styles.addBtn, !isFormValid() && { opacity: 0.5 }]}
//   onPress={() => {
//     addTenant();     // updates UI
//     saveTenant();    // sends to backend
//   }}
//   disabled={!isFormValid()}
// >
//   <Text style={styles.addBtnText}>Add Tenant</Text>
// </TouchableOpacity>
//               </ScrollView>
//             </View>
//           </KeyboardAvoidingView>
//         </View>
//       </Modal>
//       <Modal transparent visible={idPreviewVisible} animationType="fade">
//         <View style={styles.previewOverlay}>
//           <View style={styles.previewCard}>
//             <View style={styles.modalHeaderRow}>
//               <Text style={styles.modalTitle}>ID Preview</Text>
//               <View style={styles.headerActions}>
//                 <TouchableOpacity
//                   style={[styles.zoomBtn, { marginRight: 6 }]}
//                   onPress={() => {
//                     const next = Math.min(
//                       3,
//                       Math.round((previewScale + 0.2) * 10) / 10,
//                     );
//                     setPreviewScale(next);
//                   }}
//                 >
//                   <Text style={styles.zoomBtnText}>+</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.zoomBtn, { marginRight: 10 }]}
//                   onPress={() => {
//                     const next = Math.max(
//                       1,
//                       Math.round((previewScale - 0.2) * 10) / 10,
//                     );
//                     setPreviewScale(next);
//                   }}
//                 >
//                   <Text style={styles.zoomBtnText}>-</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setIdPreviewVisible(false)}>
//                   <Text style={styles.modalClose}>×</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <PinchGestureHandler
//               onGestureEvent={(e) => {
//                 const scale = e.nativeEvent.scale ?? 1;
//                 setPreviewScale((prev) =>
//                   Math.min(3, Math.max(1, prev * scale)),
//                 );
//               }}
//               onHandlerStateChange={onPinchStateChange}
//             >
//               <ScrollView
//                 style={styles.previewContentClip}
//                 contentContainerStyle={{ alignItems: "stretch" }}
//               >
//                 {previewUri ? (
//                   previewUri.toLowerCase().endsWith(".pdf") ? (
//                     Platform.OS === "android" ? (
//                       /^https?:/i.test(previewUri) ? (
//                         <WebView
//                           source={{
//                             uri:
//                               "https://docs.google.com/gview?embedded=true&url=" +
//                               encodeURIComponent(previewUri),
//                           }}
//                           style={{
//                             width: "100%",
//                             height: Math.round(360 * previewScale),
//                           }}
//                           originWhitelist={["*"]}
//                         />
//                       ) : (
//                         <View
//                           style={{ alignItems: "center", paddingVertical: 12 }}
//                         >
//                           <Text style={styles.tenantMeta}>
//                             PDF preview not supported here on Android
//                           </Text>
//                           <TouchableOpacity
//                             style={[
//                               styles.viewBtn,
//                               { marginTop: 8, width: 160 },
//                             ]}
//                             onPress={async () => {
//                               try {
//                                 await Linking.openURL(previewUri);
//                               } catch (_) {}
//                             }}
//                           >
//                             <Text style={styles.viewBtnText}>
//                               Open Externally
//                             </Text>
//                           </TouchableOpacity>
//                         </View>
//                       )
//                     ) : idPreviewHtml ? (
//                       <WebView
//                         source={{ html: idPreviewHtml }}
//                         style={{
//                           width: "100%",
//                           height: Math.round(360 * previewScale),
//                         }}
//                         originWhitelist={["*"]}
//                       />
//                     ) : (
//                       <WebView
//                         source={{ uri: previewUri }}
//                         style={{
//                           width: "100%",
//                           height: Math.round(360 * previewScale),
//                         }}
//                         originWhitelist={["*"]}
//                       />
//                     )
//                   ) : (
//                     <Image
//                       source={{ uri: previewUri }}
//                       style={{
//                         width: "100%",
//                         height: Math.round(360 * previewScale),
//                         borderRadius: 12,
//                         backgroundColor: "#F9FAFB",
//                       }}
//                       resizeMode="contain"
//                     />
//                   )
//                 ) : (
//                   <Text style={styles.tenantMeta}>No preview available</Text>
//                 )}
//               </ScrollView>
//             </PinchGestureHandler>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f7eeee",
//     padding: 10,
//     // fontSize: 62,
//     // fontWeight: 600,
//   },
//   welcome: {
//     fontSize:28,
//     fontWeight: 600,
//         marginTop: 0,

//   },
//   contentRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 16,
//   },
//   sidebar: {
//     width: 64,
//     height: CARD_HEIGHT,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#eee",
//     backgroundColor: "#fff",
//     padding: 8,
//     alignItems: "center",
//     gap: 8,
//   },
//   sidebarScroll: {
//     width: "100%",
//   },
//   sidebarScrollContent: {
//     alignItems: "center",
//     gap: 8,
//   },
//   sideButton: {
//     width: "100%",
//     paddingVertical: 10,
//     borderRadius: 8,
//     backgroundColor: "#f2f2f2",
//     alignItems: "center",
//   },
//   sideButtonActive: {
//     backgroundColor: "#0a7ea4",
//   },
//   sideButtonText: {
//     fontSize: 14,
//     color: "#333",
//     fontWeight: "600",
//   },
//   sideButtonTextActive: {
//     color: "#fff",
//   },
//   sideBarProgress: {
//     width: "100%",
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#E5E7EB",
//     marginTop: 6,
//     overflow: "hidden",
//   },
//   sideBarProgressFill: {
//     height: "100%",
//     borderRadius: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   slider: {
//     flex: 1,
//   },
//   card: {
//     padding: 16,
//     borderRadius: 16,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#eee",
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   cardScroll: {
//     flex: 1,
//   },

//   // header: {
//   //   fontSize: 62,
//   //   fontWeight: 600,
//   // },

//   subHeader: {
//     fontSize: 62,
//     color: "gray",
//     marginBottom: 20,

//   },

//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },

//   statBox: {
//     width: "30%",
//     padding: 15,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   statBoxSelected: {
//     borderWidth: 2,
//     borderColor: "#0a7ea4",
//   },

//   statNumber: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },

//   statLabel: {
//     fontSize: 12,
//     color: "gray",
//   },

//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 0,
//   },

//   floorTitle: {
//     marginTop: 0,
//     marginBottom: 8,
//     fontWeight: "700",
//     color: "#222",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   legendRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 12,
//   },
//   legendDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   legendText: {
//     fontSize: 12,
//     color: "#666",
//     marginRight: 12,
//   },

//   roomGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//   },

//   roomBox: {
//     width: "28%",
//     padding: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   roomNumber: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 15,
//   },

//   roomText: {
//     color: "#fff",
//     fontSize: 11,
//   },

//   plus: {
//     color: "#fff",
//     fontSize: 16,
//     marginTop: 5,
//   },
//   controlsRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 8,
//   },
//   controlBtn: {
//     backgroundColor: "#ffffff",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   controlText: {
//     color: "#333",
//     fontWeight: "700",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-start",
//     alignItems: "stretch",
//     padding: 0,
//   },
//   modalCard: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 0,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   modalContentScroll: {
//     flex: 1,
//   },
//   previewCard: {
//     width: "100%",
//     maxWidth: 420,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     position: "relative",
//   },
//   previewOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   previewImage: {
//     width: "100%",
//     height: 360,
//     borderRadius: 12,
//     backgroundColor: "#F9FAFB",
//   },
//   previewWebView: {
//     width: "100%",
//     height: 360,
//     borderRadius: 12,
//     backgroundColor: "#F9FAFB",
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   previewContentClip: {
//     height: 360,
//     overflow: "hidden",
//     borderRadius: 12,
//     backgroundColor: "#F9FAFB",
//   },
//   previewZoom: {},
//   modalHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//     paddingTop: 8,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//   },
//   modalClose: {
//     fontSize: 24,
//   },
//   modalCloseBtn: {
//     position: "absolute",
//     right: 8,
//     top: -8,
//     padding: 4,
//   },
//   modalRow: {
//     marginBottom: 10,
//   },
//   modalLabel: {
//     fontSize: 12,
//     color: "#555",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: "#F9FAFB",
//   },
//   inputError: {
//     borderColor: "#E74C3C",
//   },
//   uploadBtn: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     backgroundColor: "#F9FAFB",
//     alignItems: "flex-start",
//   },
//   uploadBtnText: {
//     color: "#333",
//     fontSize: 14,
//   },
//   viewBtn: {
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: "#0a7ea4",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: "#E6F7ED",
//     alignItems: "center",
//     width: 120,
//   },
//   viewBtnText: {
//     color: "#0a7ea4",
//     fontWeight: "700",
//   },
//   bedPickerRow: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   bedBtn: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: "#fff",
//   },
//   bedBtnActive: {
//     backgroundColor: "#0a7ea4",
//     borderColor: "#0a7ea4",
//   },
//   bedBtnOccupied: {
//     backgroundColor: "#E6F0F7",
//     borderColor: "#9BBBD6",
//   },
//   bedBtnText: {
//     color: "#333",
//     fontWeight: "600",
//   },
//   bedBtnTextActive: {
//     color: "#fff",
//   },
//   bedBtnTextOccupied: {
//     color: "#0a7ea4",
//     fontWeight: "700",
//   },
//   addBtn: {
//     marginTop: 12,
//     backgroundColor: "#0a7ea4",
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: "center",
//   },
//   addBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//   },
//   smallBtn: {
//     height: 30,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#0a7ea4",
//     backgroundColor: "#0a7ea4",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   smallBtnText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "700",
//   },
//   zoomOverlay: {
//     position: "absolute",
//     right: 8,
//     top: 8,
//     flexDirection: "row",
//     gap: 8,
//     zIndex: 1000,
//   },
//   zoomBtn: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     width: 36,
//     height: 36,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   zoomBtnText: {
//     color: "#333",
//     fontSize: 18,
//     fontWeight: "700",
//     lineHeight: 20,
//   },
//   modalStatsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   modalStatBlock: {
//     gap: 4,
//   },
//   modalStatLabel: {
//     fontSize: 12,
//     color: "#555",
//   },
//   modalStatValue: {
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   modalSectionHeader: {
//     marginBottom: 8,
//     marginTop: 4,
//   },
//   modalSectionTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#111",
//   },
//   currentTenantsBox: {
//     borderWidth: 0,
//     padding: 0,
//     backgroundColor: "#F9FAFB",
//     marginBottom: 12,
//     gap: 8,
//   },
//   tenantCard: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     padding: 10,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#eee",
//     borderRadius: 10,
//     marginHorizontal: 6,
//     shadowColor: "#000",
//     shadowOpacity: 0.03,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   tenantRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     padding: 10,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#eee",
//     borderRadius: 10,
//     marginHorizontal: 6,
//     marginBottom: 0,
//     shadowColor: "#000",
//     shadowOpacity: 0.03,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   actionCol: {
//     marginLeft: 6,
//     alignItems: "stretch",
//     justifyContent: "flex-start",
//     width: 80,
//   },
//   tenantName: {
//     fontWeight: "600",
//     color: "#111",
//   },
//   tenantMeta: {
//     fontSize: 12,
//     color: "#555",
//   },
//   tenantDelete: {
//     fontSize: 16,
//     color: "#E74C3C",
//     paddingHorizontal: 8,
//   },
//   emptyTenants: {
//     color: "#777",
//     fontSize: 12,
//   },
// });





import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useContext } from "react";
import { BookingContext } from "@/src/context/BookingContext";
import { useNavigation } from "@react-navigation/native";

import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import { WebView } from "react-native-webview";

const CARD_HEIGHT = 560;

export default function BuildingScreen({ route }) {
const email = route?.params?.email;
const navigation = useNavigation();
  const [response_data, setResponseData] = useState(null);
  const { pendingCount } = useContext(BookingContext);
  // const propertyStayType = response_data?.stay_type || "hostel";
  const ownerName = response_data?.owner?.name;
  const ownerEmail = response_data?.owner?.email;
  const floorsData = response_data?.building_layout;
  // const roomsData = response_data?.building_layout?.flatMap(floor => floor.rooms);
  const roomsData =
    response_data?.building_layout?.flatMap(floor => floor.rooms || []) || [];
  // const bedsData = response_data?.building_layout?.flatMap(floor =>
  //   floor.rooms.map(room => room.beds)
  // );
  const bedsData =
    response_data?.building_layout?.flatMap(floor =>
      (floor.rooms || []).flatMap(room => room.beds || [])
    ) || [];
  // const [ownerData, setOwnerData] = useState(null);
  // const { email } = useLocalSearchParams();
  const width = Dimensions.get("window").width;
  const SIDEBAR_WIDTH = 64;
  const CONTENT_GAP = 12;
  const CONTAINER_PADDING = 16;
  const availableWidth = Math.max(
    320,
    Math.round(width - SIDEBAR_WIDTH - CONTENT_GAP - CONTAINER_PADDING * 2),
  );
  const baseCardWidth = availableWidth;
  const [sliderWidth, setSliderWidth] = useState(0);
  const SPACING = 12;
  const cardWidth = (sliderWidth || baseCardWidth) - SPACING;
  const sliderRef = useRef(null);
  const sidebarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterMode, setFilterMode] = useState(null);
  const [bedCounts, setBedCounts] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tenantName, setTenantName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [tenantEmail, setTenantEmail] = useState("");
  const [bedNumber, setBedNumber] = useState(1);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [tenants, setTenants] = useState({});
  const [idProofFile, setIdProofFile] = useState("");
  const [idProofUri, setIdProofUri] = useState("");
  const [idPreviewVisible, setIdPreviewVisible] = useState(false);
  const [idPreviewHtml, setIdPreviewHtml] = useState("");
  const [idOpenUri, setIdOpenUri] = useState("");
  const [previewUri, setPreviewUri] = useState("");
  const [showBottomViewId, setShowBottomViewId] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [editAll] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [rowEditIndex, setRowEditIndex] = useState(null);
  const [rowEditValues, setRowEditValues] = useState({});
  const [tenantsExpanded, setTenantsExpanded] = useState(true);
  const onPinchStateChange = (e) => {
    if (e.nativeEvent.state === State.END) {
      setPreviewScale((prev) => Math.min(3, Math.max(1, prev)));
    }
  };
  const floorPulse = useRef(new Animated.Value(0.8)).current;
  const floorScale = floorPulse.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0.99, 1.01],
  });
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floorPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(floorPulse, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floorPulse]);

  const [touchedName, setTouchedName] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedRent, setTouchedRent] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  // useEffect(() => {
  //   response_data();
  // }, []);

  // const loadOwnerData = async () => {
  //   try {
  //     const data = await AsyncStorage.getItem("ownerData");

  //     if (data) {
  //       const parsed = JSON.parse(data);
  //       console.log("Local Registration Data:", parsed);
  //       setOwnerData(parsed);
  //     }
  //   } catch (err) {
  //     console.log("AsyncStorage Error:", err);
  //   }
  // };

  useEffect(() => {
    if (!email) return;

    fetch(`http://192.168.1.45:8000/api/details/${encodeURIComponent(email)}/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setResponseData(data);
      })
      .catch((err) => console.log("Fetch Error:", err));
  }, [email]);

  useEffect(() => {
    if (!modalVisible) {
      setIdProofFile("");
      setIdProofUri("");
      setIdPreviewHtml("");
      setIdPreviewVisible(false);
    }
  }, [modalVisible]);
  const makeRooms = (n) =>
    Array.from(
      { length: n === 1 ? 15 : 4 },
      (_, i) => `${n}${String(i + 1).padStart(2, "0")}`,
    );
  const floors = Array.from({ length: 15 }, (_, i) => {
    const floorNumber = i + 1;
    return { floor: `Floor ${floorNumber}`, rooms: makeRooms(floorNumber) };
  });

  // const dynamicFloors =
  // response_data?.building_layout?.map((f) => ({
  //   floor: `Floor ${f.floorNo}`,
  //   rooms: f.rooms.map(
  //     (r) => `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`
  //   ),
  // })) || floors;
  // const dynamicFloors = response_data?.building_layout
  // ? response_data.building_layout.map((f) => ({
  //     floor: `Floor ${f.floorNo}`,
  //     rooms: f.rooms.map((r) => ({
  //       roomLabel: `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`,
  //       beds: r.beds,
  //     })),
  //   }))
  // : [];
  // const stayType = response_data?.stay_type || "hostel";
  const stayType = response_data?.property_type || "hostel";
  const getUnits = (floor) => {
    if (stayType === "hostel") return floor.rooms || [];
    if (stayType === "apartment") return floor.flats || [];
    if (stayType === "commercial") return [floor];
    return [];
  };
  // const dynamicFloors = response_data?.building_layout
  //   ? response_data.building_layout.map((f) => {

  //       if (stayType === "hostel") {
  //         return {
  //           floor: `Floor ${f.floorNo}`,
  //           rooms: f.rooms.map((r) => ({
  //             roomLabel: `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`,
  //             beds: r.beds,
  //           })),
  //         };
  //       }

  //       if (stayType === "apartment") {
  //         return {
  //           floor: `Floor ${f.floorNo}`,
  //           flats: f.flats.map((fl, idx) => ({
  //             flatNo: `${f.floorNo}${String(idx + 1).padStart(2, "0")}`,
  //             bhk: fl.type || "1BHK",
  //           })),
  //         };
  //       }

  //       if (stayType === "commercial") {
  //         return {
  //           floor: `Floor ${f.floorNo}`,
  //           area: f.area,
  //         };
  //       }

  //       return {};
  //     })
  //   : [];
  const dynamicFloors = response_data?.building_layout
    ? response_data.building_layout.map((f) => {
      if (stayType === "hostel") {
        return {
          floor: `Floor ${f.floorNo}`,
          units: (f.rooms || []).map((r) => ({
            label: `${f.floorNo}${String(r.roomNo).padStart(2, "0")}`,
            beds: r.beds,
          })),
        };
      }

      if (stayType === "apartment") {
        return {
          floor: `Floor ${f.floorNo}`,
          units: (f.flats || []).map((fl, idx) => ({
            label: `${f.floorNo}${String(idx + 1).padStart(2, "0")}`,
            type: fl.type || "1BHK",
          })),
        };
      }

      if (stayType === "commercial") {
        return {
          floor: `Floor ${f.floorNo}`,
          units: (f.sections || []).map((s, idx) => ({
            label: s.area ? `${s.area} sq.ft` : `Section ${s.sectionNo}`,
            sectionNo: s.sectionNo
          })),
        };
      }

      return { floor: `Floor ${f.floorNo}`, units: [] };
    })
    : [];

  // const isOccupied = (floorLabel, room) => {
  //   const key = `${floorLabel}-${room}`;
  //   const count = bedCounts[key] ?? 0;
  //   return count > 0;
  // };
  // const isOccupied = (floorLabel, unit) => {
  // const key = `${floorLabel}-${unit}`;
  // const count = bedCounts[key] ?? 0;
  const isOccupied = (floorLabel, unitLabel) => {
    const key = `${floorLabel}-${unitLabel}`;
    const count = bedCounts[key] ?? 0;

    if (stayType === "commercial") {
      return count > 0;
    }

    return count > 0;
  };

  const getCount = (floorLabel, room) =>
    bedCounts[`${floorLabel}-${room}`] ?? 0;
  const getTileColor = (floorLabel, room) => {
    const c = getCount(floorLabel, room);
    if (filterMode === "occupied") return c >= 4 ? "#2ECC71" : "#F1C40F";
    if (filterMode === "empty" && c === 0) return "#E74C3C";
    if (filterMode === null && c === 0) return "#C9A0DC";
    if (c === 0) return "#E74C3C";
    if (c >= 4) return "#2ECC71";
    return "#F1C40F";
  };
  const snap = cardWidth + SPACING;
  const handleSelectFloor = (idx) => {
    setActiveIndex(idx);
    sliderRef.current?.scrollTo({
      x: idx * (cardWidth + SPACING),
      animated: true,
    });
  };
  useEffect(() => {
    const SIDE_BUTTON_HEIGHT = 40;
    const SIDE_BUTTON_GAP = 8;
    const offset = Math.max(
      0,
      idxToOffset(activeIndex, SIDE_BUTTON_HEIGHT, SIDE_BUTTON_GAP) - 60,
    );
    sidebarRef.current?.scrollTo({ y: offset, animated: true });
  }, [activeIndex]);
  const idxToOffset = (idx, h, g) => idx * (h + g);

  // const totalRooms = dynamicFloors.reduce((sum, f) => sum + f.rooms.length, 0);
  // const totalRooms = dynamicFloors.reduce((sum, f) => {

  //   if (stayType === "hostel") {
  //     return sum + (f.rooms?.length || 0);
  //   }

  //   if (stayType === "apartment") {
  //     return sum + (f.flats?.length || 0);
  //   }

  //   if (stayType === "commercial") {
  //     return sum + 1;
  //   }

  //   return sum;

  // }, 0);

  // const occupiedRooms = dynamicFloors.reduce(
  //   (sum, f) => sum + f.rooms.filter((r) => isOccupied(f.floor, r)).length,
  //   0,
  // );
  // const emptyRooms = totalRooms - occupiedRooms;
  const totalRooms = dynamicFloors.reduce(
    (sum, f) => sum + (f.units?.length || 0),
    0
  );

  const occupiedRooms = dynamicFloors.reduce(
    (sum, f) =>
      sum +
      (f.units || []).filter((u) =>
        isOccupied(f.floor, u.label)
      ).length,
    0
  );

  const emptyRooms = totalRooms - occupiedRooms;
  const autoFormatDate = (text) => {
    // Remove non-digits
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    // YYYY-MM-DD
    let formatted = "";
    if (cleaned.length > 0) {
      formatted += cleaned.slice(0, 4);
    }
    if (cleaned.length > 4) {
      formatted += "-" + cleaned.slice(4, 6);
    }
    if (cleaned.length > 6) {
      formatted += "-" + cleaned.slice(6, 8);
    }
    return formatted;
  };

  const openTenantModal = (floorLabel, room) => {
    setSelectedFloor(floorLabel);
    setSelectedRoom(room);
    const current = getCount(floorLabel, room);
    setBedNumber(Math.min(4, current + 1));
    setTenantName("");
    setContactNumber("");
    setTenantEmail("");
    setMonthlyRent("");
    setCheckIn("");
    setCheckOut("");
    setIdProofFile("");
    setIdProofUri("");
    setIdPreviewHtml("");
    setIdPreviewVisible(false);
    setTouchedName(false);
    setTouchedPhone(false);
    setTouchedEmail(false);
    setTouchedRent(false);
    setModalVisible(true);
  };
  const isValidName = (name) => /^[A-Za-z\s]+$/.test(name.trim());
  const isValidPhone = (phone) => /^\d{10,11}$/.test(phone.trim());
  const isValidEmail = (mail) =>
    mail.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim());
  const isFormValid = () => {
    return (
      isValidName(tenantName) &&
      isValidPhone(contactNumber) &&
      monthlyRent.trim().length > 0 &&
      (idProofUri || idOpenUri) &&
      isValidEmail(tenantEmail) &&
      bedNumber >= 1 &&
      bedNumber <= 4 &&
      checkIn.length === 10 // YYYY-MM-DD
    );
  };
  const addTenant = () => {
    console.log("ADDING TENANT", {
      tenantName,
      contactNumber,
      tenantEmail,
      monthlyRent,
      idProofUri,
    });
    if (!selectedFloor || !selectedRoom) {
      setModalVisible(false);
      return;
    }
    if (!isFormValid()) {
      return;
    }
    const key = `${selectedFloor}-${selectedRoom}`;
    setTenants((prev) => {
      const list = prev[key] ?? [];
      const nextList = [
        ...list,
        {
          name: tenantName.trim(),
          phone: contactNumber.trim(),
          email: tenantEmail.trim(),
          bed: bedNumber,
          rent: monthlyRent.trim(),
          checkIn: checkIn.trim(),
          checkOut: checkOut.trim(),
          idUri: idOpenUri || idProofUri,
        },
      ];
      return { ...prev, [key]: nextList };
    });
    setBedCounts((prev) => {
      const next = Math.min(4, (prev[key] ?? 0) + 1);
      return { ...prev, [key]: next };
    });
    setIdProofFile("");
    setIdProofUri("");
    setIdOpenUri("");
    setIdPreviewVisible(false);
    setShowBottomViewId(false);
    setModalVisible(false);
  };
  const removeTenant = (floorLabel, room, index) => {
    const key = `${floorLabel}-${room}`;
    setTenants((prev) => {
      const list = prev[key] ?? [];
      const nextList = list.filter((_, i) => i !== index);
      return { ...prev, [key]: nextList };
    });
    setBedCounts((prev) => {
      const next = Math.max(0, (prev[key] ?? 0) - 1);
      return { ...prev, [key]: next };
    });
  }; const getTotalBeds = (floorLabel, roomLabel) => {
    const floor = dynamicFloors.find((f) => f.floor === floorLabel);
    const unit = floor?.units.find((u) => u.label === roomLabel);
    return unit?.beds ?? 0;
  };
  //   const getTotalBeds = (floorLabel, roomLabel) => {
  //   const floor = dynamicFloors.find((f) => f.floor === floorLabel);
  //   const room = floor?.rooms.find((r) => r.roomLabel === roomLabel);
  //   return room?.beds ?? 0;
  // };

  const saveTenant = async () => {
    try {
      const formData = new FormData();

      formData.append("name", tenantName);
      formData.append("phone", contactNumber);
      formData.append("email", tenantEmail);
      formData.append("bed", bedNumber);
      formData.append("rent", monthlyRent);
      formData.append("checkIn", checkIn);
      formData.append("checkOut", checkOut);

      if (idProofUri) {
        formData.append("idUri", {
          uri: idProofUri,
          name: "idproof.jpg",
          type: "image/jpeg",
        });
      }

      const response = await fetch(
        "http://192.168.1.45:8000/api/tenentbeds/",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Tenant saved:", data);

    } catch (error) {
      console.log("Error saving tenant:", error);
    }
  };
  const fetchRequests = async () => {
  if (!email || email.trim() === "") return;

  try {
    const response = await fetch(
      `http://192.168.1.45:8000/api/tenantdetails/${encodeURIComponent(email)}/`
    );

    const text = await response.text();
    let data = JSON.parse(text);

    const formatted = data.map((item) => ({
      ...item,
      seen: false,
    }));

    setRequests(formatted);

  } catch (error) {
    console.error("Error fetching tenant requests:", error);
  }
};

useEffect(() => {
  fetchRequests();
}, [email]);
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      {/* Header */}
 <Text style={styles.header}>{dashboardData?.name}</Text>

      <Text>{dashboardData?.email}</Text>
  <View style={styles.headerRow}>

  <View>
    <Text style={styles.welcome}>Hello {ownerName}</Text>
  </View>
<TouchableOpacity
  onPress={() => navigation.navigate("OwnerNotificationScreen")}
>
  <Ionicons name="notifications-outline" size={28} color="#333" />

  {pendingCount > 0 && (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{pendingCount}</Text>
    </View>
  )}
</TouchableOpacity>
</View>
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={[
            styles.statBox,
            { backgroundColor: "#C5EBD2" },
            filterMode === "occupied" && styles.statBoxSelected,
          ]}
          activeOpacity={0.8}
          onPress={() => setFilterMode("occupied")}
        >
          <Text style={styles.statNumber}>{occupiedRooms}</Text>
          <Text style={styles.statLabel}>Occupied</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statBox,
            { backgroundColor: "#FFCECE" },
            filterMode === "empty" && styles.statBoxSelected,
          ]}
          activeOpacity={0.8}
          onPress={() => setFilterMode("empty")}
        >
          <Text style={styles.statNumber}>{emptyRooms}</Text>
          <Text style={styles.statLabel}>Empty</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statBox,
            { backgroundColor: "#E0D4FF" },
            filterMode === null && styles.statBoxSelected,
          ]}
          activeOpacity={0.8}
          onPress={() => setFilterMode(null)}
        >
          <Text style={styles.statNumber}>{totalRooms}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Building View</Text>
        <View style={[styles.legendRow, { marginTop: 0 }]}>
          <View style={[styles.legendDot, { backgroundColor: "#2ECC71" }]} />
          <Text style={styles.legendText}>Full</Text>
          <View style={[styles.legendDot, { backgroundColor: "#F1C40F" }]} />
          <Text style={styles.legendText}>Partial</Text>
          <View style={[styles.legendDot, { backgroundColor: "#E74C3C" }]} />
          <Text style={styles.legendText}>Empty</Text>
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.sidebar}>
          <ScrollView
            ref={sidebarRef}
            style={styles.sidebarScroll}
            contentContainerStyle={styles.sidebarScrollContent}
            showsVerticalScrollIndicator
          >
            {dynamicFloors.map((f, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.sideButton,
                  activeIndex === idx && styles.sideButtonActive,
                ]}
                onPress={() => handleSelectFloor(idx)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.sideButtonText,
                    activeIndex === idx && styles.sideButtonTextActive,
                  ]}
                >
                  {idx + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          ref={sliderRef}
          horizontal
          snapToInterval={snap}
          decelerationRate="fast"
          scrollEventThrottle={8}
          keyboardShouldPersistTaps="always"
          onScroll={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            const idx = Math.max(
              0,
              Math.min(
                dynamicFloors.length - 1,
                Math.round(x / (cardWidth + SPACING)),
              ),
            );
            setActiveIndex(idx);
          }}
          showsHorizontalScrollIndicator={false}
          style={styles.slider}
          contentContainerStyle={{ paddingLeft: SPACING, paddingRight: 6 }}
          onMomentumScrollEnd={(e) => {
            const x = e.nativeEvent.contentOffset.x;
            const idx = Math.max(
              0,
              Math.min(
                dynamicFloors.length - 1,
                Math.round((x - SPACING) / (cardWidth + SPACING)),
              ),
            );
            setActiveIndex(idx);
          }}
        >
          {dynamicFloors.map((item, index) => (
            <View
              style={[
                styles.card,
                {
                  width: cardWidth,
                  marginRight: index === dynamicFloors.length - 1 ? 0 : SPACING,
                  height: CARD_HEIGHT,
                },
              ]}
              key={index}
              onLayout={(e) => {
                if (!sliderWidth) {
                  setSliderWidth(e.nativeEvent.layout.width);
                }
              }}
            >
              <Animated.Text
                style={[
                  styles.floorTitle,
                  { opacity: floorPulse, transform: [{ scale: floorScale }] },
                  activeIndex === index && {
                    color: "#0a7ea4",
                    backgroundColor: "#E6F7ED",
                    borderWidth: 1,
                    borderColor: "#0a7ea4",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 10,
                    alignSelf: "center",
                  },
                ]}
              >
                {item.floor}
              </Animated.Text>
              <ScrollView style={styles.cardScroll} nestedScrollEnabled showsVerticalScrollIndicator scrollEventThrottle={8} >
                {/* <View style={styles.roomGrid}>

{stayType === "hostel" &&
  (filterMode === "occupied"
    ? item.rooms.filter((r) => isOccupied(item.floor, r.roomLabel))
    : filterMode === "empty"
      ? item.rooms.filter((r) => getCount(item.floor, r.roomLabel) < 4)
      : item.rooms
  ).map((room, i) => (
    <TouchableOpacity
      key={room.roomLabel}
      style={[
        styles.roomBox,
        { backgroundColor: getTileColor(item.floor, room.roomLabel) },
      ]}
      onPress={() => openTenantModal(item.floor, room.roomLabel)}
    >
      <Text style={styles.roomNumber}>{room.roomLabel}</Text>
    </TouchableOpacity>
))}

{stayType === "apartment" &&
  item.flats.map((flat, i) => (
    <TouchableOpacity
      key={flat.flatNo}
      style={[
        styles.roomBox,
        { backgroundColor: getTileColor(item.floor, flat.flatNo) },
      ]}
      onPress={() => openTenantModal(item.floor, flat.flatNo)}
    >
      <Text style={styles.roomNumber}>{flat.flatNo}</Text>
      <Text style={styles.roomText}>{flat.bhk}</Text>
    </TouchableOpacity>
))}

{stayType === "commercial" && (
  <TouchableOpacity
    style={[
      styles.roomBox,
      { backgroundColor: getTileColor(item.floor) },
    ]}
    onPress={() => openTenantModal(item.floor, item.area)}
  >
    <Text style={styles.roomNumber}>{item.area} sq yd</Text>
  </TouchableOpacity>
)}

</View>
<View style={styles.roomGrid}>
  {(item.units || []).map((unit, i) => (
    <TouchableOpacity
      key={unit.label}
      style={[
        styles.roomBox,
        { backgroundColor: getTileColor(item.floor, unit.label) },
      ]}
      onPress={() => openTenantModal(item.floor, unit.label)}
    >
      <Text style={styles.roomNumber}>{unit.label}</Text>

      {stayType === "apartment" && (
        <Text style={styles.roomText}>{unit.type}</Text>
      )}
    </TouchableOpacity>
  ))}
</View> */}
                <View style={styles.roomGrid}>
                  {(item.units || []).map((unit, i) => (
                    <TouchableOpacity
                      key={unit.label || i}
                      style={[
                        styles.roomBox,
                        { backgroundColor: getTileColor(item.floor, unit.label) },
                      ]}
                      onPress={() => openTenantModal(item.floor, unit.label)}
                    >
                      {stayType === "hostel" && (
                        <>
                          <Text style={styles.roomNumber}>{unit.label}</Text>
                          <Text style={styles.roomText}>
                            {getCount(item.floor, unit.label)}/{unit.beds} beds
                          </Text>
                        </>
                      )}

                      {stayType === "apartment" && (
                        <>
                          <Text style={styles.roomNumber}>{unit.label}</Text>
                          <Text style={styles.roomText}>{unit.type}</Text>
                        </>
                      )}

                      {stayType === "commercial" && (
                        <Text style={styles.roomNumber}>{unit.label}</Text>
                      )}

                      <View style={styles.controlsRow}>
                        <TouchableOpacity
                          style={styles.controlBtn}
                          onPress={() => openTenantModal(item.floor, unit.label)}
                        >
                          <Text style={styles.controlText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* <View style={styles.roomGrid}>
                  {(filterMode === "occupied"
  ? item.rooms.filter((r) => isOccupied(item.floor, r.roomLabel))
  : filterMode === "empty"
    ? item.rooms.filter((r) => getCount(item.floor, r.roomLabel) < 4)
    : item.rooms
).map((room, i) => (
  <TouchableOpacity
    key={room.roomLabel}
    style={[
      styles.roomBox,
      {
        backgroundColor: getTileColor(item.floor, room.roomLabel),
      },
    ]}
    onPress={() => openTenantModal(item.floor, room.roomLabel)}
  >  */}
                {/* {(filterMode === "occupied"
                    ? item.rooms.filter((r) => isOccupied(item.floor, r))
                    : filterMode === "empty"
                      ? item.rooms.filter((r) => getCount(item.floor, r) < 4)
                      : item.rooms
                  ).map((room, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.roomBox,
                        {
                          backgroundColor: getTileColor(item.floor, room),
                        },
                      ]}
                      onPress={() => openTenantModal(item.floor, room)}
                    > */}
                {/* {(() => {
                        const tileColor = getTileColor(item.floor, room);
                        const tColor =
                          tileColor === "#2ECC71" || tileColor === "#E74C3C"
                            ? "#FFFFFF"
                            : "#1F2937";
                       return (
  <>
    <Text style={[styles.roomNumber, { color: tColor }]}>
  {room.roomLabel}
</Text>

<Text style={[styles.roomText, { color: tColor }]}>
  {getCount(item.floor, room.roomLabel)}/{room.beds} beds
</Text>
  </>
);
})()}

<View style={styles.controlsRow}>
  <TouchableOpacity
    style={styles.controlBtn}
    onPress={() => openTenantModal(item.floor, room.roomLabel)}
  >
    // <Text style={styles.controlText}>+</Text>
  </TouchableOpacity>
</View>
                    </TouchableOpacity>
                  ))}
                </View> */}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </View>
      <Modal transparent={false} visible={modalVisible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.fullScreenModal}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <View style={styles.modalCard}>
              <ScrollView
                style={styles.modalContentScroll}
                contentContainerStyle={{ paddingBottom: 24 }}
                nestedScrollEnabled
                stickyHeaderIndices={[0]}
                keyboardShouldPersistTaps="always"
              >
                <View
                  style={styles.fullPageHeader}
                >
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color="#111" />
                  </TouchableOpacity>
                  <Text style={styles.fullPageTitle}>
                    {
                      stayType === "hostel" && `Add Tenant - Room ${selectedRoom}`
                    }
                    {
                      stayType === "apartment" && `Add Tenant - Flat ${selectedRoom}`
                    }
                    {
                      stayType === "commercial" && `Add Tenant - Section ${selectedRoom}`
                    }                  </Text>
                  <View style={{ width: 24 }} />
                </View>
                <View style={styles.modalStatsRow}>
                  <View style={styles.modalStatBlock}>
                    <Text style={styles.modalStatLabel}>Occupancy</Text>
                    <Text style={styles.modalStatValue}>
                      {getCount(selectedFloor ?? "", selectedRoom ?? "") > 0
                        ? "Occupied"
                        : "Vacant"}
                    </Text>
                  </View>

                  <View style={styles.modalStatBlock}>
                    <Text style={styles.modalStatLabel}>Available</Text>

                    {stayType === "apartment" ? (
                      <Text style={[styles.modalStatValue, { color: "#0a7ea4" }]}>
                        {
                          dynamicFloors
                            .find(f => f.floor === selectedFloor)
                            ?.units.find(u => u.label === selectedRoom)?.type
                        }
                      </Text>
                    ) : stayType === "commercial" ? (
                      <Text style={[styles.modalStatValue, { color: "#0a7ea4" }]}>
                        Section {selectedRoom}
                      </Text>
                    ) : (
                      <Text style={[styles.modalStatValue, { color: "#2ECC71" }]}>
                        {Math.max(
                          0,
                          getTotalBeds(selectedFloor ?? "", selectedRoom ?? "") -
                          getCount(selectedFloor ?? "", selectedRoom ?? "")
                        )} beds
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.modalSectionHeader}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.modalSectionTitle}>
                      Current Tenants
                    </Text>
                    <TouchableOpacity
                      onPress={() => setTenantsExpanded((v) => !v)}
                      style={{ padding: 6 }}
                    >
                      <Ionicons
                        name={
                          tenantsExpanded
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                        }
                        size={20}
                        color="#111"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {tenantsExpanded && (
                  <View style={styles.currentTenantsBox}>
                    {(tenants[`${selectedFloor}-${selectedRoom}`] ?? []).map(
                      (t, idx) => (
                        <View key={idx} style={styles.tenantCard}>
                          <View style={{ flex: 1 }}>
                            {!(editAll || rowEditIndex === idx) ? (
                              <Text style={styles.tenantName}>{t.name}</Text>
                            ) : (
                              <TextInput
                                value={
                                  editAll
                                    ? (editValues[idx]?.name ?? t.name)
                                    : (rowEditValues[idx]?.name ?? t.name)
                                }
                                onChangeText={(val) => {
                                  const sanitized = val.replace(
                                    /[^A-Za-z\s]/g,
                                    "",
                                  );
                                  if (editAll) {
                                    setEditValues((prev) => ({
                                      ...prev,
                                      [idx]: {
                                        ...(prev[idx] || {}),
                                        name: sanitized,
                                      },
                                    }));
                                  } else {
                                    setRowEditValues((prev) => ({
                                      ...prev,
                                      [idx]: {
                                        ...(prev[idx] || {}),
                                        name: sanitized,
                                      },
                                    }));
                                  }
                                }}
                                placeholder="Name"
                                style={[styles.input, { marginBottom: 6 }]}
                                autoCapitalize="words"
                                autoCorrect={false}
                              />
                            )}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              {!(editAll || rowEditIndex === idx) ? (
                                <>
                                  <Text style={styles.tenantMeta}>
                                    Bed {t.bed} ·{" "}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => {
                                      const tel = `tel:${t.phone}`;
                                      Linking.openURL(tel).catch(() => { });
                                    }}
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Ionicons
                                      name="call-outline"
                                      size={14}
                                      color="#2ECC71"
                                    />
                                    <Text
                                      style={[
                                        styles.tenantMeta,
                                        { marginLeft: 4 },
                                      ]}
                                    >
                                      {t.phone}
                                    </Text>
                                  </TouchableOpacity>
                                  {!!t.rent && (
                                    <>
                                      <Text style={styles.tenantMeta}> · </Text>
                                      <Text
                                        style={[
                                          styles.tenantMeta,
                                          { color: "#0a7ea4" },
                                        ]}
                                      >
                                        ₹
                                      </Text>
                                      <Text
                                        style={[
                                          styles.tenantMeta,
                                          { marginLeft: 4 },
                                        ]}
                                      >
                                        {t.rent}
                                      </Text>
                                    </>
                                  )}
                                </>
                              ) : (
                                <View style={{ flex: 1 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      gap: 8,
                                    }}
                                  >
                                    <Text style={styles.tenantMeta}>Bed</Text>
                                    {(() => {
                                      const key = `${selectedFloor}-${selectedRoom}`;
                                      const list = tenants[key] ?? [];
                                      const chosen = editAll
                                        ? new Set(
                                          list
                                            .map((p, i) =>
                                              i === idx
                                                ? null
                                                : (editValues[i]?.bed ??
                                                  p.bed),
                                            )
                                            .filter((x) => !!x),
                                        )
                                        : new Set(
                                          list
                                            .map((p, i) =>
                                              i === idx ? null : p.bed,
                                            )
                                            .filter((x) => !!x),
                                        );
                                      return [1, 2, 3, 4].map((b) => {
                                        const active = editAll
                                          ? (editValues[idx]?.bed ?? t.bed) ===
                                          b
                                          : (rowEditValues[idx]?.bed ??
                                            t.bed) === b;
                                        const disabled = chosen.has(b);
                                        return (
                                          <TouchableOpacity
                                            key={b}
                                            style={[
                                              styles.bedBtn,
                                              active && styles.bedBtnActive,
                                              disabled && styles.bedBtnOccupied,
                                            ]}
                                            onPress={() => {
                                              if (editAll) {
                                                setEditValues((prev) => ({
                                                  ...prev,
                                                  [idx]: {
                                                    ...(prev[idx] || {}),
                                                    bed: b,
                                                  },
                                                }));
                                              } else {
                                                setRowEditValues((prev) => ({
                                                  ...prev,
                                                  [idx]: {
                                                    ...(prev[idx] || {}),
                                                    bed: b,
                                                  },
                                                }));
                                              }
                                            }}
                                            disabled={disabled}
                                          >
                                            <Text
                                              style={[
                                                styles.bedBtnText,
                                                active &&
                                                styles.bedBtnTextActive,
                                                disabled &&
                                                styles.bedBtnTextOccupied,
                                              ]}
                                            >
                                              {disabled ? "✓" : b}
                                            </Text>
                                          </TouchableOpacity>
                                        );
                                      });
                                    })()}
                                  </View>
                                  <View style={{ marginTop: 6 }}>
                                    <TextInput
                                      value={
                                        editAll
                                          ? (editValues[idx]?.phone ?? t.phone)
                                          : (rowEditValues[idx]?.phone ??
                                            t.phone)
                                      }
                                      onChangeText={(val) => {
                                        const digits = val
                                          .replace(/[^0-9]/g, "")
                                          .slice(0, 11);
                                        if (editAll) {
                                          setEditValues((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              ...(prev[idx] || {}),
                                              phone: digits,
                                            },
                                          }));
                                        } else {
                                          setRowEditValues((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              ...(prev[idx] || {}),
                                              phone: digits,
                                            },
                                          }));
                                        }
                                      }}
                                      placeholder="Phone"
                                      style={[
                                        styles.input,
                                        { marginBottom: 6 },
                                      ]}
                                      keyboardType="phone-pad"
                                      maxLength={11}
                                      autoCorrect={false}
                                    />
                                    <TextInput
                                      value={
                                        editAll
                                          ? (editValues[idx]?.email ??
                                            t.email ??
                                            "")
                                          : (rowEditValues[idx]?.email ??
                                            t.email ??
                                            "")
                                      }
                                      onChangeText={(val) => {
                                        const v = val.trim();
                                        if (editAll) {
                                          setEditValues((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              ...(prev[idx] || {}),
                                              email: v,
                                            },
                                          }));
                                        } else {
                                          setRowEditValues((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              ...(prev[idx] || {}),
                                              email: v,
                                            },
                                          }));
                                        }
                                      }}
                                      placeholder="Email (optional)"
                                      style={[
                                        styles.input,
                                        { marginBottom: 6 },
                                      ]}
                                      keyboardType="email-address"
                                      autoCapitalize="none"
                                      autoCorrect={false}
                                    />
                                    <TextInput
                                      value={
                                        editAll
                                          ? (editValues[idx]?.rent ??
                                            t.rent ??
                                            "")
                                          : (rowEditValues[idx]?.rent ??
                                            t.rent ??
                                            "")
                                      }
                                      onChangeText={(val) => {
                                        const digits = val.replace(
                                          /[^0-9]/g,
                                          "",
                                        );
                                        if (editAll) {
                                          setEditValues((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              ...(prev[idx] || {}),
                                              rent: digits,
                                            },
                                          }));
                                        } else {
                                          setRowEditValues((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              ...(prev[idx] || {}),
                                              rent: digits,
                                            },
                                          }));
                                        }
                                      }}
                                      placeholder="Monthly Rent"
                                      style={[styles.input]}
                                      keyboardType="numeric"
                                      autoCorrect={false}
                                    />
                                  </View>
                                </View>
                              )}
                            </View>
                            {!(editAll || rowEditIndex === idx) &&
                              (t.checkIn || t.checkOut) && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    marginTop: 2,
                                  }}
                                >
                                  {!!t.checkIn && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Ionicons
                                        name="calendar-outline"
                                        size={14}
                                        color="#555"
                                      />
                                      <Text
                                        style={[
                                          styles.tenantMeta,
                                          { marginLeft: 4 },
                                        ]}
                                      >
                                        In {t.checkIn}
                                      </Text>
                                    </View>
                                  )}
                                  {!!t.checkOut && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginLeft: 8,
                                      }}
                                    >
                                      <Ionicons
                                        name="calendar-outline"
                                        size={14}
                                        color="#555"
                                      />
                                      <Text
                                        style={[
                                          styles.tenantMeta,
                                          { marginLeft: 4 },
                                        ]}
                                      >
                                        Out {t.checkOut}
                                      </Text>
                                    </View>
                                  )}
                                </View>
                              )}

                            {(editAll || rowEditIndex === idx) && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 8,
                                  marginTop: 6,
                                  flexWrap: "wrap",
                                }}
                              >
                                <TextInput
                                  value={
                                    editAll
                                      ? (editValues[idx]?.in ?? t.checkIn ?? "")
                                      : (rowEditValues[idx]?.in ??
                                        t.checkIn ??
                                        "")
                                  }
                                  onChangeText={(val) => {
                                    const sanitized = val.replace(
                                      /[^A-Za-z0-9\s/.\-:]/g,
                                      "",
                                    );
                                    if (editAll) {
                                      setEditValues((prev) => ({
                                        ...prev,
                                        [idx]: {
                                          ...(prev[idx] || {}),
                                          in: sanitized,
                                        },
                                      }));
                                    } else {
                                      setRowEditValues((prev) => ({
                                        ...prev,
                                        [idx]: {
                                          ...(prev[idx] || {}),
                                          in: sanitized,
                                        },
                                      }));
                                    }
                                  }}
                                  placeholder="Check-in (DD/MM/YY or DD-MM-YY)"
                                  style={[
                                    styles.input,
                                    { flexBasis: "48%", flexGrow: 1 },
                                  ]}
                                  keyboardType="default"
                                  autoCorrect={false}
                                  autoComplete="off"
                                  textContentType="none"
                                  importantForAutofill="no"
                                />
                                <TextInput
                                  value={
                                    editAll
                                      ? (editValues[idx]?.out ??
                                        t.checkOut ??
                                        "")
                                      : (rowEditValues[idx]?.out ??
                                        t.checkOut ??
                                        "")
                                  }
                                  onChangeText={(val) => {
                                    const sanitized = val.replace(
                                      /[^A-Za-z0-9\s/.\-:]/g,
                                      "",
                                    );
                                    if (editAll) {
                                      setEditValues((prev) => ({
                                        ...prev,
                                        [idx]: {
                                          ...(prev[idx] || {}),
                                          out: sanitized,
                                        },
                                      }));
                                    } else {
                                      setRowEditValues((prev) => ({
                                        ...prev,
                                        [idx]: {
                                          ...(prev[idx] || {}),
                                          out: sanitized,
                                        },
                                      }));
                                    }
                                  }}
                                  placeholder="Check-out (DD/MM/YY or DD-MM-YY)"
                                  style={[
                                    styles.input,
                                    { flexBasis: "48%", flexGrow: 1 },
                                  ]}
                                  keyboardType="default"
                                  autoCorrect={false}
                                  autoComplete="off"
                                  textContentType="none"
                                  importantForAutofill="no"
                                />
                              </View>
                            )}
                            {rowEditIndex === idx && (
                              <View style={{ width: "100%", marginTop: 8 }}>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 8,
                                  }}
                                >
                                  <TouchableOpacity
                                    style={[
                                      styles.viewBtn,
                                      {
                                        width: 60,
                                        paddingVertical: 6,
                                        paddingHorizontal: 8,
                                      },
                                    ]}
                                    onPress={async () => {
                                      const uri =
                                        rowEditValues[idx]?.idUri ?? t.idUri;
                                      if (uri) {
                                        setIdPreviewVisible(true);
                                        setPreviewUri(uri);
                                        setShowBottomViewId(false);
                                      }
                                    }}
                                  >
                                    <Text style={styles.viewBtnText}>ID</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[styles.smallBtn]}
                                    onPress={async () => {
                                      try {
                                        const result =
                                          await DocumentPicker.getDocumentAsync(
                                            {
                                              type: [
                                                "image/*",
                                                "application/pdf",
                                              ],
                                              multiple: false,
                                              copyToCacheDirectory: true,
                                            },
                                          );
                                        let uri = null;
                                        if (
                                          result?.assets &&
                                          result.assets.length > 0
                                        ) {
                                          uri = result.assets[0].uri || null;
                                        } else if (result?.uri) {
                                          uri = result.uri;
                                        }
                                        if (uri) {
                                          setRowEditValues((prev) => ({
                                            ...prev,
                                            [idx]: {
                                              ...(prev[idx] || {}),
                                              idUri: uri,
                                            },
                                          }));
                                        }
                                      } catch (_) { }
                                    }}
                                  >
                                    <Text style={styles.smallBtnText}>
                                      Change ID
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                {(() => {
                                  const key = `${selectedFloor}-${selectedRoom}`;
                                  const list = tenants[key] ?? [];
                                  const v = rowEditValues[idx] || {};
                                  const nm = v.name ?? t.name;
                                  const ph = v.phone ?? t.phone;
                                  const em = v.email ?? t.email ?? "";
                                  const bd = v.bed ?? t.bed;
                                  const used = new Set(
                                    list
                                      .map((p, i) => (i === idx ? null : p.bed))
                                      .filter((x) => !!x),
                                  );
                                  const valid =
                                    /^[A-Za-z\s]+$/.test((nm || "").trim()) &&
                                    /^\d{10,11}$/.test((ph || "").trim()) &&
                                    ((em || "").trim().length === 0 ||
                                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                        (em || "").trim(),
                                      )) &&
                                    bd >= 1 &&
                                    bd <= 4 &&
                                    !used.has(bd);
                                  return (
                                    <View
                                      style={{ flexDirection: "row", gap: 8 }}
                                    >
                                      <TouchableOpacity
                                        style={[
                                          styles.smallBtn,
                                          !valid && { opacity: 0.5 },
                                          { flex: 1 },
                                        ]}
                                        disabled={!valid}
                                        onPress={() => {
                                          const updated = list.map((p, i) => {
                                            if (i !== idx) return p;
                                            const vv = rowEditValues[idx] || {};
                                            return {
                                              ...p,
                                              name: (vv.name ?? p.name).trim(),
                                              phone: (
                                                vv.phone ?? p.phone
                                              ).trim(),
                                              email: (
                                                vv.email ??
                                                p.email ??
                                                ""
                                              ).trim(),
                                              bed: vv.bed ?? p.bed,
                                              rent: (
                                                vv.rent ??
                                                p.rent ??
                                                ""
                                              ).trim(),
                                              checkIn: (
                                                vv.in ??
                                                p.checkIn ??
                                                ""
                                              ).trim(),
                                              checkOut: (
                                                vv.out ??
                                                p.checkOut ??
                                                ""
                                              ).trim(),
                                              idUri: vv.idUri ?? p.idUri,
                                            };
                                          });
                                          setTenants((prev) => ({
                                            ...prev,
                                            [key]: updated,
                                          }));
                                          setRowEditIndex(null);
                                          setRowEditValues({});
                                        }}
                                      >
                                        <Text style={styles.smallBtnText}>
                                          Save
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        style={[
                                          styles.smallBtn,
                                          {
                                            backgroundColor: "#E5E7EB",
                                            borderColor: "#E5E7EB",
                                            flex: 1,
                                          },
                                        ]}
                                        onPress={() => {
                                          setRowEditIndex(null);
                                          setRowEditValues({});
                                        }}
                                      >
                                        <Text
                                          style={[
                                            styles.smallBtnText,
                                            { color: "#374151" },
                                          ]}
                                        >
                                          Cancel
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() =>
                                          removeTenant(
                                            selectedFloor,
                                            selectedRoom,
                                            idx,
                                          )
                                        }
                                        style={{
                                          marginLeft: 8,
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <Ionicons
                                          name="trash-outline"
                                          size={20}
                                          color="#E74C3C"
                                        />
                                      </TouchableOpacity>
                                    </View>
                                  );
                                })()}
                              </View>
                            )}
                          </View>
                          <View style={styles.actionCol}>
                            {rowEditIndex !== idx ? (
                              <>
                                <TouchableOpacity
                                  style={[
                                    styles.smallBtn,
                                    { height: 28, alignSelf: "stretch" },
                                  ]}
                                  onPress={() => {
                                    setRowEditIndex(idx);
                                    setRowEditValues((prev) => ({
                                      ...prev,
                                      [idx]: {
                                        name: t.name || "",
                                        phone: t.phone || "",
                                        email: t.email || "",
                                        bed: t.bed,
                                        rent: t.rent || "",
                                        in: t.checkIn || "",
                                        out: t.checkOut || "",
                                        idUri: t.idUri || "",
                                      },
                                    }));
                                  }}
                                >
                                  <Text style={styles.smallBtnText}>Edit</Text>
                                </TouchableOpacity>
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity
                                  onPress={() =>
                                    removeTenant(
                                      selectedFloor,
                                      selectedRoom,
                                      idx,
                                    )
                                  }
                                  style={{
                                    alignSelf: "center",
                                    marginTop: 8,
                                    marginBottom: 10,
                                  }}
                                >
                                  <Ionicons
                                    name="trash-outline"
                                    size={22}
                                    color="#E74C3C"
                                  />
                                </TouchableOpacity>
                              </>
                            ) : (
                              <></>
                            )}
                          </View>
                        </View>
                      ),
                    )}
                    {(tenants[`${selectedFloor}-${selectedRoom}`] ?? [])
                      .length === 0 && (
                        <Text style={styles.emptyTenants}>No tenants</Text>
                      )}
                  </View>
                )}
                <View style={styles.modalSectionHeader}>
                  <Text style={styles.modalSectionTitle}>Add New Tenant</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Tenant Name</Text>
                  <TextInput
                    value={tenantName}
                    onChangeText={(t) => {
                      if (/^[A-Za-z\s]*$/.test(t)) {
                        setTenantName(t);
                      }
                    }}
                    onBlur={() => setTouchedName(!isValidName(tenantName))}
                    style={[
                      styles.input,
                      touchedName && !isValidName(tenantName) && styles.inputError,
                    ]}
                    placeholder="Tenant Name"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  {touchedName && !isValidName(tenantName) && (
                    <Text style={styles.errorText}>Only letters and spaces allowed</Text>
                  )}
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Contact Number</Text>
                  <TextInput
                    value={contactNumber}
                    onChangeText={(t) =>
                      setContactNumber(t.replace(/[^0-9]/g, "").slice(0, 11))
                    }
                    onBlur={() => setTouchedPhone(!isValidPhone(contactNumber))}
                    style={[
                      styles.input,
                      touchedPhone && !isValidPhone(contactNumber) && styles.inputError,
                    ]}
                    placeholder="Contact Number"
                    keyboardType="phone-pad"
                    maxLength={11}
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    autoCorrect={false}
                  />
                  {touchedPhone && !isValidPhone(contactNumber) && (
                    <Text style={styles.errorText}>Invalid contact number (10-11 digits)</Text>
                  )}
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Email</Text>
                  <TextInput
                    value={tenantEmail}
                    onChangeText={(t) => setTenantEmail(t.trim())}
                    onBlur={() => setTouchedEmail(!isValidEmail(tenantEmail))}
                    style={[
                      styles.input,
                      touchedEmail && !isValidEmail(tenantEmail) && styles.inputError,
                    ]}
                    placeholder="Email (optional)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    autoCorrect={false}
                  />
                  {touchedEmail && !isValidEmail(tenantEmail) && (
                    <Text style={styles.errorText}>Invalid email format</Text>
                  )}
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>
                    Upload ID (Aadhaar / PAN)
                  </Text>
                  <TouchableOpacity
                    style={styles.uploadBtn}
                    onPress={async () => {
                      const result = await DocumentPicker.getDocumentAsync({
                        type: ["image/*", "application/pdf"],
                        multiple: false,
                        copyToCacheDirectory: true,
                      });
                      if (result?.assets && result.assets.length > 0) {
                        const file = result.assets[0];
                        setIdProofFile(file.name || "selected-file");
                        setIdProofUri(file.uri || "");
                        setShowBottomViewId(true);
                        if (
                          (file.mimeType || file.name || "")
                            .toLowerCase()
                            .includes("pdf")
                        ) {
                          try {
                            const contentUri =
                              await FileSystem.getContentUriAsync(file.uri);
                            setIdOpenUri(contentUri);
                          } catch {
                            setIdOpenUri(file.uri || "");
                          }
                        } else {
                          setIdOpenUri(file.uri || "");
                        }
                        const lower = (
                          file.mimeType ||
                          file.name ||
                          ""
                        ).toLowerCase();
                        if (
                          lower.includes("pdf") ||
                          (file.uri || "").toLowerCase().endsWith(".pdf")
                        ) {
                          try {
                            const base64 = await FileSystem.readAsStringAsync(
                              file.uri,
                              { encoding: "base64" },
                            );
                            const html = `
                          <!DOCTYPE html>
                          <html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
                          <body style="margin:0;padding:0;background:#F9FAFB;">
                            <embed src="data:application/pdf;base64,${base64}" type="application/pdf" style="width:100%;height:100vh;" />
                          </body></html>`;
                            setIdPreviewHtml(html);
                          } catch (_) {
                            setIdPreviewHtml("");
                          }
                        } else {
                          setIdPreviewHtml("");
                        }
                      } else if (result?.name) {
                        setIdProofFile(result.name);
                        if (result?.uri) setIdProofUri(result.uri);
                        setShowBottomViewId(true);
                        if (
                          (result.name || "").toLowerCase().endsWith(".pdf") &&
                          result.uri
                        ) {
                          try {
                            const contentUri =
                              await FileSystem.getContentUriAsync(result.uri);
                            setIdOpenUri(contentUri);
                          } catch {
                            setIdOpenUri(result.uri);
                          }
                        } else {
                          setIdOpenUri(result.uri || "");
                        }
                        const lower = (result.name || "").toLowerCase();
                        if (lower.endsWith(".pdf") && result.uri) {
                          try {
                            const base64 = await FileSystem.readAsStringAsync(
                              result.uri,
                              { encoding: "base64" },
                            );
                            const html = `
                          <!DOCTYPE html>
                          <html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
                          <body style="margin:0;padding:0;background:#F9FAFB;">
                            <embed src="data:application/pdf;base64,${base64}" type="application/pdf" style="width:100%;height:100vh;" />
                          </body></html>`;
                            setIdPreviewHtml(html);
                          } catch (_) {
                            setIdPreviewHtml("");
                          }
                        } else {
                          setIdPreviewHtml("");
                        }
                      }
                    }}
                  >
                    <Text style={styles.uploadBtnText}>
                      {idProofFile ? idProofFile : "Choose file"}
                    </Text>
                  </TouchableOpacity>
                  {!!idProofUri && showBottomViewId && (
                    <TouchableOpacity
                      style={styles.viewBtn}
                      onPress={async () => {
                        const targetUri = idOpenUri || idProofUri;
                        const lower = (targetUri || "").toLowerCase();
                        if (
                          lower.endsWith(".pdf") ||
                          targetUri.startsWith("content://")
                        ) {
                          try {
                            await Linking.openURL(targetUri);
                          } catch (_) {
                            setIdPreviewVisible(true);
                            setPreviewUri(targetUri);
                          }
                        } else {
                          setIdPreviewVisible(true);
                          setPreviewUri(targetUri);
                        }
                      }}
                    >
                      <Text style={styles.viewBtnText}>View ID</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Select Bed</Text>
                  <View style={styles.bedPickerRow}>
                    {(() => {
                      const occ = (
                        tenants[`${selectedFloor}-${selectedRoom}`] ?? []
                      ).map((x) => x.bed);

                      const totalBeds = getTotalBeds(selectedFloor, selectedRoom);

                      return Array.from({ length: totalBeds }, (_, i) => i + 1).map((b) => {
                        const isOcc = occ.includes(b);

                        return (
                          <TouchableOpacity
                            key={b}
                            style={[
                              styles.bedBtn,
                              bedNumber === b && styles.bedBtnActive,
                              isOcc && styles.bedBtnOccupied,
                            ]}
                            onPress={() => setBedNumber(b)}
                            disabled={isOcc}
                          >
                            <Text
                              style={[
                                styles.bedBtnText,
                                bedNumber === b && styles.bedBtnTextActive,
                                isOcc && styles.bedBtnTextOccupied,
                              ]}
                            >
                              {isOcc ? "✓" : b}
                            </Text>
                          </TouchableOpacity>
                        );
                      });
                    })()}
                  </View>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Monthly Rent</Text>
                  <TextInput
                    value={monthlyRent}
                    onChangeText={(t) =>
                      setMonthlyRent(t.replace(/[^0-9]/g, ""))
                    }
                    onBlur={() =>
                      setTouchedRent(monthlyRent.trim().length === 0)
                    }
                    style={[
                      styles.input,
                      touchedRent &&
                      monthlyRent.trim().length === 0 &&
                      styles.inputError,
                    ]}
                    placeholder="Monthly Rent"
                    keyboardType="numeric"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                  />
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Check-in Date</Text>
                  <TextInput
                    value={checkIn}
                    onChangeText={(t) => setCheckIn(autoFormatDate(t))}
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    keyboardType="numeric"
                    maxLength={10}
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                  />
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Check-out Date</Text>
                  <TextInput
                    value={checkOut}
                    onChangeText={(t) => setCheckOut(autoFormatDate(t))}
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    keyboardType="numeric"
                    maxLength={10}
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                  />
                </View>
                {/* <TouchableOpacity
                  style={[styles.addBtn, !isFormValid() && { opacity: 0.5 }]}
                  onPressIn={addTenant}
                  disabled={!isFormValid()}
                >
                  <Text style={styles.addBtnText}>Add Tenant</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity
                style={[styles.addBtn, !isFormValid() && { opacity: 0.5 }]}
                   onPress={saveTenant}
                   >
                <Text>Add Tenant</Text>
               </TouchableOpacity> */}
                <TouchableOpacity
                  style={[styles.addBtn, !isFormValid() && { opacity: 0.5 }]}
                  onPress={() => {
                    addTenant();     // updates UI
                    saveTenant();    // sends to backend
                  }}
                  disabled={!isFormValid()}
                >
                  <Text style={styles.addBtnText}>Add Tenant</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
      <Modal transparent visible={idPreviewVisible} animationType="fade">
        <View style={styles.previewOverlay}>
          <View style={styles.previewCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>ID Preview</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={[styles.zoomBtn, { marginRight: 6 }]}
                  onPress={() => {
                    const next = Math.min(
                      3,
                      Math.round((previewScale + 0.2) * 10) / 10,
                    );
                    setPreviewScale(next);
                  }}
                >
                  <Text style={styles.zoomBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.zoomBtn, { marginRight: 10 }]}
                  onPress={() => {
                    const next = Math.max(
                      1,
                      Math.round((previewScale - 0.2) * 10) / 10,
                    );
                    setPreviewScale(next);
                  }}
                >
                  <Text style={styles.zoomBtnText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIdPreviewVisible(false)}>
                  <Text style={styles.modalClose}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
            <PinchGestureHandler
              onGestureEvent={(e) => {
                const scale = e.nativeEvent.scale ?? 1;
                setPreviewScale((prev) =>
                  Math.min(3, Math.max(1, prev * scale)),
                );
              }}
              onHandlerStateChange={onPinchStateChange}
            >
              <ScrollView
                style={styles.previewContentClip}
                contentContainerStyle={{ alignItems: "stretch" }}
              >
                {previewUri ? (
                  previewUri.toLowerCase().endsWith(".pdf") ? (
                    Platform.OS === "android" ? (
                      /^https?:/i.test(previewUri) ? (
                        <WebView
                          source={{
                            uri:
                              "https://docs.google.com/gview?embedded=true&url=" +
                              encodeURIComponent(previewUri),
                          }}
                          style={{
                            width: "100%",
                            height: Math.round(360 * previewScale),
                          }}
                          originWhitelist={["*"]}
                        />
                      ) : (
                        <View
                          style={{ alignItems: "center", paddingVertical: 12 }}
                        >
                          <Text style={styles.tenantMeta}>
                            PDF preview not supported here on Android
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.viewBtn,
                              { marginTop: 8, width: 160 },
                            ]}
                            onPress={async () => {
                              try {
                                await Linking.openURL(previewUri);
                              } catch (_) { }
                            }}
                          >
                            <Text style={styles.viewBtnText}>
                              Open Externally
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )
                    ) : idPreviewHtml ? (
                      <WebView
                        source={{ html: idPreviewHtml }}
                        style={{
                          width: "100%",
                          height: Math.round(360 * previewScale),
                        }}
                        originWhitelist={["*"]}
                      />
                    ) : (
                      <WebView
                        source={{ uri: previewUri }}
                        style={{
                          width: "100%",
                          height: Math.round(360 * previewScale),
                        }}
                        originWhitelist={["*"]}
                      />
                    )
                  ) : (
                    <Image
                      source={{ uri: previewUri }}
                      style={{
                        width: "100%",
                        height: Math.round(360 * previewScale),
                        borderRadius: 12,
                        backgroundColor: "#F9FAFB",
                      }}
                      resizeMode="contain"
                    />
                  )
                ) : (
                  <Text style={styles.tenantMeta}>No preview available</Text>
                )}
              </ScrollView>
            </PinchGestureHandler>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7eeee",
    padding: 10,
    // fontSize: 62,
    // fontWeight: 600,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 600,
    marginTop: 0,

  },
  contentRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  sidebar: {
    width: 64,
    height: CARD_HEIGHT,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    padding: 8,
    alignItems: "center",
    gap: 8,
  },
  sidebarScroll: {
    width: "100%",
  },
  sidebarScrollContent: {
    alignItems: "center",
    gap: 8,
  },
  sideButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  sideButtonActive: {
    backgroundColor: "#0a7ea4",
  },
  sideButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  sideButtonTextActive: {
    color: "#fff",
  },
  sideBarProgress: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    marginTop: 6,
    overflow: "hidden",
  },
  sideBarProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  slider: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardScroll: {
    flex: 1,
  },

  // header: {
  //   fontSize: 62,
  //   fontWeight: 600,
  // },
headerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

header: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#333",
},
  subHeader: {
    fontSize: 62,
    color: "gray",
    marginBottom: 20,

  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statBox: {
    width: "30%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  statBoxSelected: {
    borderWidth: 2,
    borderColor: "#0a7ea4",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },

  statLabel: {
    fontSize: 12,
    color: "gray",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 0,
  },

  floorTitle: {
    marginTop: 0,
    marginBottom: 8,
    fontWeight: "700",
    color: "#222",
    fontSize: 16,
    textAlign: "center",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
    marginRight: 12,
  },

  roomGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  roomBox: {
    width: "28%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  roomNumber: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  roomText: {
    color: "#fff",
    fontSize: 11,
  },

  plus: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  controlBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  controlText: {
    color: "#333",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 0,
  },
  modalCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalContentScroll: {
    flex: 1,
  },
  previewCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  previewImage: {
    width: "100%",
    height: 360,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  previewWebView: {
    width: "100%",
    height: 360,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewContentClip: {
    height: 360,
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  previewZoom: {},
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingTop: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  modalClose: {
    fontSize: 24,
  },
  modalCloseBtn: {
    position: "absolute",
    right: 8,
    top: -8,
    padding: 4,
  },
  modalRow: {
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F9FAFB",
  },
  inputError: {
    borderColor: "#E74C3C",
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    alignItems: "flex-start",
  },
  uploadBtnText: {
    color: "#333",
    fontSize: 14,
  },
  viewBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#0a7ea4",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#E6F7ED",
    alignItems: "center",
    width: 120,
  },
  viewBtnText: {
    color: "#0a7ea4",
    fontWeight: "700",
  },
  bedPickerRow: {
    flexDirection: "row",
    gap: 8,
  },
  bedBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  bedBtnActive: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  bedBtnOccupied: {
    backgroundColor: "#E6F0F7",
    borderColor: "#9BBBD6",
  },
  bedBtnText: {
    color: "#333",
    fontWeight: "600",
  },
  bedBtnTextActive: {
    color: "#fff",
  },
  bedBtnTextOccupied: {
    color: "#0a7ea4",
    fontWeight: "700",
  },
  addBtn: {
    marginTop: 12,
    backgroundColor: "#0a7ea4",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  smallBtn: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0a7ea4",
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
  },
  smallBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  zoomOverlay: {
    position: "absolute",
    right: 8,
    top: 8,
    flexDirection: "row",
    gap: 8,
    zIndex: 1000,
  },
  zoomBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  zoomBtnText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  modalStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalStatBlock: {
    gap: 4,
  },
  modalStatLabel: {
    fontSize: 12,
    color: "#555",
  },
  modalStatValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalSectionHeader: {
    marginBottom: 8,
    marginTop: 4,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  currentTenantsBox: {
    borderWidth: 0,
    padding: 0,
    backgroundColor: "#F9FAFB",
    marginBottom: 12,
    gap: 8,
  },
  tenantCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tenantRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginHorizontal: 6,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionCol: {
    marginLeft: 6,
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: 80,
  },
  tenantName: {
    fontWeight: "600",
    color: "#111",
  },
  tenantMeta: {
    fontSize: 12,
    color: "#555",
  },
  tenantDelete: {
    fontSize: 16,
    color: "#E74C3C",
    paddingHorizontal: 8,
  },
  emptyTenants: {
    color: "#777",
    fontSize: 12,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  fullPageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    padding: 5,
  },
  fullPageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
badge: {
  position: "absolute",
  right: -6,
  top: -4,
  backgroundColor: "red",
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 4,
},

badgeText: {
  color: "#fff",
  fontSize: 10,
  fontWeight: "bold",
},
});
