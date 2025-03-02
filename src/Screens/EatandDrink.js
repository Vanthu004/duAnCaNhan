import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Text } from 'react-native-svg';

const Gauge = () => {
  const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;


  const radius = 100;
  const centerX = 150;
  const centerY = 150;
  const startAngle = 180;
  const segmentAngle = 60; 
  const segments = [
    { start: 0, end: segmentAngle, color: 'lightgreen', label: 'Thiếu cân' }, // Thiếu cân
    { start: segmentAngle, end: 2 * segmentAngle, color: 'lightblue', label: 'Bình thường' }, // Bình thường
    { start: 2 * segmentAngle, end: 3 * segmentAngle, color: 'lightcoral', label: 'Béo phì' } // Béo phì
  ];

  const createPath = (startAngle, endAngle, color) => {
    const startRad = degreesToRadians(startAngle - segmentAngle);
    const endRad = degreesToRadians(endAngle - segmentAngle);

    const largeArcFlag = endRad - startRad > Math.PI ? 1 : 0;

    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY - radius * Math.sin(startRad);
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY - radius * Math.sin(endRad);

    return `
      M ${centerX} ${centerY}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
  };

  const calculateLabelPosition = (startAngle, endAngle) => {
    const angle = degreesToRadians((startAngle + endAngle) / 2 - segmentAngle);
    const labelX = centerX + (radius / 1.5) * Math.cos(angle);
    const labelY = centerY - (radius / 1.5) * Math.sin(angle);
    return { x: labelX, y: labelY };
  };

  return (
    <View style={styles.container}>
      <Svg width="300" height="300">
        <G>
          {segments.map((segment, index) => (
            <React.Fragment key={index}>
              <Path
                d={createPath(segment.start, segment.end, segment.color)}
                fill={segment.color}
              />
              <Text
                x={calculateLabelPosition(segment.start, segment.end).x}
                y={calculateLabelPosition(segment.start, segment.end).y}
                fontSize="14"
                textAnchor="middle"
                fill="#000"
              >
                {segment.label}
              </Text>
            </React.Fragment>
          ))}
        </G>
        <Text
          x={centerX}
          y={centerY - radius - 10}
          fontSize="16"
          textAnchor="middle"
          fill="#000"
        >
          BMI Gauge
        </Text>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default Gauge;
