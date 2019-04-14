import React from "react";
import {
  FlatList,
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
    predictions: [],
    isPredictionsViewVisible: false,
    randomColor: {},
    faceDetection: []
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

  predict = async (image, modelName) => {
    if (modelName == "Basic") {
      let predictions = await clarifai.models.predict(
        Clarifai.GENERAL_MODEL,
        image
      );
      return predictions;
    } else if (modelName == "Face") {
      let predictions = await clarifai.models.predict(
        "c0c0ac362b03416da06ab3fa36fb58e3",
        image
      );
      return predictions;
    }
  };

  objectDetection = async modelName => {
    let photo = await this.capturePhoto();
    let resized = await this.resize(photo);
    let predictions = await this.predict(resized, modelName);
    let iconColors = [
      {
        bgColor: "#CAEEF9",
        foreGroundColor: "#39AFD5"
      },
      {
        bgColor: "#DDD5F0",
        foreGroundColor: "#7B64C0"
      },
      {
        bgColor: "#FBCCD2",
        foreGroundColor: "#F35369"
      },
      {
        bgColor: "#FBCCEB",
        foreGroundColor: "#FF4DC2"
      },
      {
        bgColor: "#BDDDFF",
        foreGroundColor: "#0052CC"
      }
    ];

    this.setState({
      predictions:
        modelName == "Basic"
          ? predictions.outputs[0].data.concepts
          : predictions.outputs[0].data.regions[0],
      isPredictionsViewVisible: true,
      randomColor: iconColors[Math.floor(Math.random() * iconColors.length)]
    });
    console.log("Predcitions are>>>>>", this.state.predictions);
  };

  closeDialog() {
    this.setState({
      isPredictionsViewVisible: false
    });
  }

  render() {
    const {
      hasCameraPermission,
      activeModelName,
      predictions,
      isPredictionsViewVisible,
      randomColor
    } = this.state;

    if (hasCameraPermission === null) {
      return <View style={{ backgroundColor: "#fff" }} />;
    } else if (hasCameraPermission === false) {
      return <Text style={{ color: "#fff" }}>No access to camera</Text>;
    } else {
      return (
        this.state.fontLoaded && (
          <View style={styles.wrapper}>
            <StatusBar hidden={true} />
            <View style={styles.homeView}>
              <View style={styles.header}>
                <Text style={styles.appName}>
                  snap
                  <Text style={styles.muted}>.ai</Text>
                </Text>
                <TouchableOpacity
                  style={styles.switchCameraViewBG}
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
                <Text style={styles.subtitle}>
                  Understanding the world around you was never been easier. Try
                  Random Photo
                </Text>
              </View>

              <View style={styles.modelBarView}>
                <TouchableOpacity
                  style={[styles.modelButtonView]}
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
                  style={[styles.modelButtonView]}
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
                onPress={() => this.objectDetection(activeModelName)}
              >
                <Text style={styles.discoverButtonTextView}>Discover</Text>
              </TouchableOpacity>
            </View>
            {isPredictionsViewVisible && (
              <View style={styles.overlay}>
                <View style={styles.popupView}>
                  <View style={styles.popupHeaderView}>
                    <Text style={styles.popupTitle}>We've got 🙈</Text>
                    <TouchableOpacity
                      style={styles.closeDialog}
                      onPress={() => this.closeDialog()}
                    >
                      <Text style={styles.closeDialogTextView}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.popupBodyView}>
                    {activeModelName === "Basic" && (
                      <FlatList
                        data={predictions.slice(0, 10).map(prediction => ({
                          key: `${prediction.name} ${prediction.value}`,
                          name: prediction.name,
                          confidence:
                            (Math.round(prediction.value * 100) / 100) * 100
                        }))}
                        renderItem={({ item }) => (
                          <View style={styles.listItemView}>
                            <View
                              style={[
                                styles.iconBG,
                                {
                                  backgroundColor: `${randomColor.bgColor}`
                                }
                              ]}
                            >
                              <Icon.Ionicons
                                name="ios-image"
                                size={28}
                                color={`${randomColor.foreGroundColor}`}
                              />
                            </View>
                            <View style={styles.data}>
                              <Text style={styles.predictionName}>
                                {item.name}
                              </Text>
                              <Text style={styles.predictionPercentage}>
                                {item.confidence}%
                              </Text>
                            </View>
                          </View>
                        )}
                      />
                    )}
                    {activeModelName === "Face" && (
                      <View style={styles.faceDetectionBody}>
                        <View style={styles.detection}>
                          <View style={styles.faceDetectionBG}>
                            <Text style={styles.predictionName}>
                              {
                                predictions.data.face.age_appearance.concepts[0]
                                  .name
                              }
                            </Text>
                          </View>
                          <Text style={styles.captionTextView}>
                            Possible Age
                          </Text>
                        </View>
                        <View style={styles.seperator} />
                        <View style={styles.detection}>
                          <View style={styles.faceDetectionBG}>
                            <Text style={styles.predictionName}>
                              {predictions.data.face.age_appearance.concepts[0]
                                .name === "masculine"
                                ? "👨"
                                : "👩"}
                            </Text>
                          </View>
                          <Text style={styles.captionTextView}>
                            Possible Gender
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        )
      );
    }
  }
}
