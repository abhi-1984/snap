import React from "react";
import {
  FlatList,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Font, Icon, Camera, Permissions, ImageManipulator } from "expo";
import styles from "./styles";
import posed, { Transition } from "react-native-pose";

const UNSPLASH_API_KEY =
  "bbd9a8b273051e131270739a60032859d43abf7d44b4865cefae2d2c586487a0";

const Clarifai = require("clarifai");

const clarifai = new Clarifai.App({
  apiKey: "26a6ae51b70f4f01b171e5024d850e13"
});
process.nextTick = setImmediate;

const PopupOverlay = posed.View({
  enter: {
    opacity: 1,
    y: 0,
    delayChildren: 200,
    transition: { duration: 300, ease: "easeIn" }
  },
  exit: {
    opacity: 0,
    y: 800,
    transition: { duration: 300, ease: "easeOut" }
  }
});

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

export default class App extends React.Component {
  state = {
    fontLoaded: false,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    activeModelName: "Basic",
    predictions: [],
    isPredictionsViewVisible: false,
    randomColor: {},
    isLoading: false,
    randomPhoto: {},
    capturedPhoto: null,
    showRandomPhoto: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted"
    });
  }

  fetchDataFrom(url) {
    fetch(url)
      .then(response => response.json())
      .then(response => {
        this.setState({
          randomPhoto: response[0],
          showRandomPhoto: true
        });
      })
      .catch(e => console.log(e));
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
    } else {
      let predictions = await clarifai.models.predict(
        "eeed0b6733a644cea07cf4c60f87ebb7",
        image
      );
      return predictions;
    }
  };

  objectDetection = async modelName => {
    if (this.state.isPredictionsViewVisible == false) {
      this.setState({
        isLoading: true
      });
    }

    let photo = await this.capturePhoto();

    this.setState({
      capturedPhoto: photo
    });

    let resized = await this.resize(photo);
    let predictions = await this.predict(resized, modelName);

    this.setState({
      predictions:
        modelName == "Basic"
          ? predictions.outputs[0].data.concepts
          : modelName === "Face"
          ? predictions.outputs[0].data.regions
          : predictions.outputs[0].data.colors,
      isPredictionsViewVisible: true,
      isLoading: false,
      randomColor: iconColors[Math.floor(Math.random() * iconColors.length)]
    });
  };

  showDataFor = async (imageURL, modelName) => {
    if (this.state.isPredictionsViewVisible == false) {
      this.setState({
        isLoading: true
      });
    }
    let predictions = await this.predict(imageURL, modelName);

    this.setState({
      predictions:
        modelName == "Basic"
          ? predictions.outputs[0].data.concepts
          : modelName === "Face"
          ? predictions.outputs[0].data.regions
          : predictions.outputs[0].data.colors,
      isPredictionsViewVisible: true,
      isLoading: false,
      randomColor: iconColors[Math.floor(Math.random() * iconColors.length)]
    });
  };

  closeDialog() {
    this.setState({
      isPredictionsViewVisible: false,
      predictions: [],
      capturedPhoto: null
    });
  }

  onRandomPhotoPress() {
    this.fetchDataFrom(
      `https://api.unsplash.com/photos/random?count=1&client_id=${UNSPLASH_API_KEY}`
    );
  }

  showCameraView() {
    this.setState({
      showRandomPhoto: false
    });
  }

  render() {
    const {
      hasCameraPermission,
      activeModelName,
      predictions,
      isPredictionsViewVisible,
      randomColor,
      showRandomPhoto,
      randomPhoto,
      capturedPhoto
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
                {!showRandomPhoto ? (
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
                ) : (
                  <TouchableOpacity
                    style={styles.switchCameraViewBG}
                    onPress={() => this.showCameraView()}
                  >
                    <Icon.Ionicons name="ios-camera" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.cameraViewWrapper}>
                <View style={styles.cameraBorderView}>
                  {showRandomPhoto ? (
                    <Image
                      style={styles.cameraView}
                      source={{ uri: randomPhoto.urls.regular }}
                    />
                  ) : capturedPhoto ? (
                    <Image
                      style={styles.cameraView}
                      source={{ uri: capturedPhoto }}
                    />
                  ) : (
                    <Camera
                      style={styles.cameraView}
                      ref={ref => {
                        this.camera = ref;
                      }}
                      type={this.state.type}
                    />
                  )}
                </View>
                <Text style={styles.helperText}>Snap your photo</Text>
                <Text style={styles.subtitle}>
                  Understanding the world around you was never been easier.
                  <Text
                    style={styles.highlightLink}
                    onPress={() => this.onRandomPhotoPress()}
                  >
                    {" " + "Try Random Photo"}
                  </Text>
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
                onPress={() =>
                  showRandomPhoto
                    ? this.showDataFor(
                        randomPhoto.urls.regular,
                        activeModelName
                      )
                    : this.objectDetection(activeModelName)
                }
              >
                {this.state.isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#000"
                    animating={true}
                  />
                ) : (
                  <Text style={styles.discoverButtonTextView}>Discover</Text>
                )}
              </TouchableOpacity>
            </View>
            <Transition>
              {isPredictionsViewVisible && (
                <PopupOverlay key="a" style={styles.overlay}>
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
                      {activeModelName === "Face" &&
                        (predictions && predictions[0].data ? (
                          <View style={styles.faceDetectionBody}>
                            <View style={styles.detection}>
                              <View style={styles.faceDetectionBG}>
                                <Text style={styles.predictionName}>
                                  {
                                    predictions[0].data.face.age_appearance
                                      .concepts[0].name
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
                                  {predictions[0].data.face.gender_appearance
                                    .concepts[0].name === "masculine"
                                    ? "👨"
                                    : "👩"}
                                </Text>
                              </View>
                              <Text style={styles.captionTextView}>
                                Possible Gender
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.noDataWrapper}>
                            <View style={styles.noDataIcon}>
                              <Text>🤔</Text>
                            </View>
                            <Text style={styles.captionTextView}>
                              No Face Found
                            </Text>
                          </View>
                        ))}
                      {activeModelName === "Color" && (
                        <FlatList
                          data={predictions.slice(0, 5).map(prediction => ({
                            key: `${prediction.raw_hex}`,
                            colorCode: prediction.raw_hex,
                            colorPercentage:
                              (Math.round(prediction.value * 100) / 100) * 100,
                            colorName: prediction.w3c.name
                          }))}
                          renderItem={({ item }) => (
                            <View style={styles.listItemView}>
                              <View
                                style={[
                                  styles.iconBG,
                                  {
                                    backgroundColor: `${item.colorCode}`
                                  }
                                ]}
                              />
                              <View style={styles.data}>
                                <Text style={styles.predictionName}>
                                  {item.colorName}
                                </Text>
                                <Text style={styles.predictionPercentage}>
                                  {item.colorPercentage}%
                                </Text>
                              </View>
                            </View>
                          )}
                        />
                      )}
                    </View>
                  </View>
                </PopupOverlay>
              )}
            </Transition>
          </View>
        )
      );
    }
  }
}
