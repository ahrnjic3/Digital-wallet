// // QRCodeGenerator.js
// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
// import QRCode from 'qrcode';

// const QRCodeGenerator = ({ value }) => {
//   const [pathData, setPathData] = useState('');

//   useEffect(() => {
//     QRCode.toString(value, { type: 'svg' }, (err, svg) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       // Extract the path data from the generated SVG
//       const match = svg.match(/d="([^"]*)"/);
//       if (match && match[1]) {
//         setPathData(match[1]);
//       }
//     });
//   }, [value]);

//   return (
//     <View style={styles.container}>
//       <Svg width="200" height="200" viewBox="0 0 256 256">
//         <Path d={pathData} fill="black" />
//       </Svg>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
// });

// export default QRCodeGenerator;


