import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';


const { width, height } = Dimensions.get('window');

interface Point {
  x: number;
  y: number;
}

interface PathData {
  path: string;
  color: string;
  width: number;
}

export default function Index() {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [currentWidth, setCurrentWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const pathRef = useRef<string>('');


  useEffect(() => {
    console.log('paths changed →', paths);
  }, [paths]);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];
  const widths = [1, 3, 5, 8, 12];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const newPath = `M${locationX},${locationY}`;
      pathRef.current = newPath;
      setCurrentPath(newPath);
      setIsDrawing(true);
    },

    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      if (isDrawing) {
        const newPath = `${pathRef.current} L${locationX},${locationY}`;
        pathRef.current = newPath;
        setCurrentPath(newPath);
      }
    },

    onPanResponderRelease: () => {
      if (isDrawing && pathRef.current.length > 0) {
        let a = pathRef.current
        setPaths(prev => [...prev, {
          path: a,
          color: currentColor,
          width: currentWidth
        }]);
  
        setCurrentPath('');
        pathRef.current = '';
        setIsDrawing(false);
      }
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
    pathRef.current = '';
    setIsDrawing(false);
  };

  const undoLastPath = () => {
    setPaths(prev => prev.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>お絵描きアプリ</Text>
      </View>

      {/* 描画エリア */}
      <View style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg height={height * 0.6} width={width} style={styles.canvas}>
          {/* 保存されたパス */}
          {paths.map((pathData, index) => (
            <Path
              key={index}
              d={pathData.path}
              stroke={pathData.color}
              strokeWidth={pathData.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {/* 現在描画中のパス */}
          {currentPath && (
            <Path
              d={currentPath}
              stroke={currentColor}
              strokeWidth={currentWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </Svg>
      </View>

      {/* 色選択 */}
      <View style={styles.colorContainer}>
        <Text style={styles.sectionTitle}>色を選択:</Text>
        <View style={styles.colorRow}>
          {colors.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                currentColor === color && styles.selectedColor
              ]}
              onPress={() => setCurrentColor(color)}
            />
          ))}
        </View>
      </View>

      {/* 線の太さ選択 */}
      <View style={styles.widthContainer}>
        <Text style={styles.sectionTitle}>線の太さ:</Text>
        <View style={styles.widthRow}>
          {widths.map(width => (
            <TouchableOpacity
              key={width}
              style={[
                styles.widthButton,
                currentWidth === width && styles.selectedWidth
              ]}
              onPress={() => setCurrentWidth(width)}
            >
              <View style={[styles.widthPreview, { width: width * 2, height: width * 2 }]} />
              <Text style={styles.widthText}>{width}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 操作ボタン */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={undoLastPath}>
          <Text style={styles.buttonText}>戻る</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearCanvas}>
          <Text style={styles.buttonText}>クリア</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  canvasContainer: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  canvas: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  colorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#333',
    borderWidth: 3,
  },
  widthContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  widthRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  widthButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  selectedWidth: {
    borderColor: '#6366f1',
    backgroundColor: '#e0e7ff',
  },
  widthPreview: {
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 5,
  },
  widthText: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});