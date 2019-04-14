import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity
} from "react-native";
import { Font, Icon, Camera, Permissions, ImageManipulator } from "expo";
import styles from "./styles";

const Clarifai = require("clarifai");

const clarifai = new Clarifai.App({
  apiKey: "26a6ae51b70f4f01b171e5024d850e13"
});
process.nextTick = setImmediate;

export default class App extends React.Component {
  state = {
    fontLoaded: false,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    activeModelName: "Basic",
    predictions: []
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }

  async componentDidMount() {
    await Font.loadAsync({
      "maison-neue-bold": require("./assets/fonts/MaisonNeue-Bold.ttf"),
      "maison-neue-book": require("./assets/fonts/MaisonNeue-Book.ttf"),
      "maison-neue-demi": require("./assets/fonts/MaisonNeue-Demi.ttf")
    });
    this.setState({
      fontLoaded: true
    });
  }

  capturePhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      return photo.uri;
    }
  };

  modelButtonPressed(modelName) {
    this.setState({
      activeModelName: modelName
    });
  }

  resize = async photo => {
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: 300, width: 300 } }],
      { base64: true }
    );
    return manipulatedImage.base64;
  };

  predict = async image => {
    let predictions = await clarifai.models.predict(
      Clarifai.GENERAL_MODEL,
      image
    );
    return predictions;
  };

  objectDetection = async () => {
    let photo = await this.capturePhoto();
    let resized = await this.resize(photo);
    let predictions = await this.predict(resized);
    this.setState({
      predictions: predictions.outputs[0].data.concepts
    });
    console.log("predictions are -> ", this.state.predictions);
  };

  render() {
    const { hasCameraPermission, activeModelName, predictions } = this.state;
    if (hasCameraPermission === null) {
      return <View style={{ backgroundColor: "#fff" }} />;
    } else if (hasCameraPermission === false) {
      return <Text style={{ color: "#fff" }}>No access to camera</Text>;
    } else {
      return (
        this.state.fontLoaded && (
          <View style={styles.wrapper}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
              <Text style={styles.appName}>
                snap
                <Text style={styles.muted}>.ai</Text>
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Icon.Ionicons name="ios-repeat" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.cameraViewWrapper}>
              <View style={styles.cameraBorderView}>
                <Camera
                  style={styles.cameraView}
                  ref={ref => {
                    this.camera = ref;
                  }}
                  type={this.state.type}
                />
              </View>
              <Text style={styles.helperText}>Snap your photo</Text>
            </View>
            {console.log("activeModelName ->", activeModelName)}

            <View style={styles.modelBarView}>
              <TouchableOpacity
                style={[styles.modelButtonView, styles.shiftedButtonView]}
                onPress={() => this.modelButtonPressed("Basic")}
              >
                <View
                  style={
                    activeModelName == "Basic"
                      ? [styles.modelIconBG, styles.activeModelView]
                      : styles.modelIconBG
                  }
                >
                  <Icon.Ionicons name="ios-apps" size={28} color="#000" />
                </View>
                <View style={styles.modelNameWrapperView}>
                  <Text style={styles.modelNameView}>Normal</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modelButtonView}
                onPress={() => this.modelButtonPressed("Face")}
              >
                <View
                  style={
                    activeModelName == "Face"
                      ? [styles.modelIconBG, styles.activeModelView]
                      : styles.modelIconBG
                  }
                >
                  <Icon.Ionicons name="ios-happy" size={28} color="#000" />
                </View>
                <View style={styles.modelNameWrapperView}>
                  <Text style={styles.modelNameView}>Face</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modelButtonView, styles.shiftedButtonView]}
                onPress={() => this.modelButtonPressed("Color")}
              >
                <View
                  style={
                    activeModelName == "Color"
                      ? [styles.modelIconBG, styles.activeModelView]
                      : styles.modelIconBG
                  }
                >
                  <Icon.Ionicons
                    name="ios-color-palette"
                    size={28}
                    color="#000"
                  />
                </View>
                <View style={styles.modelNameWrapperView}>
                  <Text style={styles.modelNameView}>Color</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.discoverButtonView}
              onPress={this.objectDetection}
            >
              <Text style={styles.discoverButtonTextView}>Discover</Text>
            </TouchableOpacity>
          </View>
        )
      );
    }
  }
}
