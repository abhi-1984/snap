import { StyleSheet, Dimensions } from "react-native";

let deviceWidth = Dimensions.get("window").width;
let deviceHeight = Dimensions.get("window").height;

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative"
  },
  homeView: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "space-between"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 40
  },
  appName: {
    fontFamily: "maison-neue-demi",
    fontSize: 20,
    color: "#fff"
  },
  muted: {
    color: "#999"
  },
  switchCameraViewBG: {
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20
  },
  cameraViewWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  cameraBorderView: {
    borderWidth: 2,
    borderStyle: "dotted",
    borderColor: "#fff",
    width: 250,
    height: 250,
    borderRadius: 125
  },
  cameraView: {
    width: "100%",
    height: "100%",
    borderRadius: 125,
    overflow: "hidden"
  },
  helperText: {
    fontFamily: "maison-neue-demi",
    color: "#fff",
    fontSize: 24,
    marginTop: 20
  },
  subtitle: {
    fontFamily: "maison-neue-demi",
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10
  },
  discoverButtonView: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  discoverButtonTextView: {
    fontFamily: "maison-neue-bold",
    color: "#000",
    fontSize: 18
  },
  modelBarView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative"
  },
  modelButtonView: {
    width: 88,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },

  modelIconBG: {
    backgroundColor: "#BFBFBF",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center"
  },
  modelNameWrapperView: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -6,
    borderRadius: 12
  },
  modelNameView: {
    fontFamily: "maison-neue-bold",
    color: "#000",
    fontSize: 12
  },
  activeModelView: {
    backgroundColor: "#FF9C00"
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  popupView: {
    width: deviceWidth,
    height: deviceHeight - 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#fff"
  },
  popupHeaderView: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6"
  },
  popupTitle: {
    fontFamily: "maison-neue-bold",
    fontSize: 20
  },
  closeDialogTextView: {
    fontFamily: "maison-neue-demi",
    fontSize: 14,
    color: "#999"
  },
  popupBodyView: { width: "100%", paddingBottom: 80 },
  listItemView: {
    width: "100%",
    height: 100,
    justifyContent: "flex-start",
    paddingHorizontal: 32,
    alignItems: "center",
    flexDirection: "row"
  },
  data: {
    height: "100%",
    justifyContent: "center",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6"
  },
  predictionName: {
    fontFamily: "maison-neue-bold",
    fontSize: 20
  },
  predictionPercentage: {
    fontFamily: "maison-neue-demi",
    marginTop: 6,
    color: "#666"
  },
  iconBG: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16
  },
  highlightLink: {
    color: "#FF9C00"
  },
  faceDetectionBody: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  detection: {
    alignItems: "center",
    marginVertical: 20
  },
  faceDetectionBG: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 40,
    backgroundColor: "#e6e6e6"
  },
  seperator: {
    width: deviceWidth - 40,
    height: 1,
    backgroundColor: "#e6e6e6",
    marginVertical: 32
  },
  captionTextView: {
    fontSize: 14,
    color: "#666",
    fontFamily: "maison-neue-demi"
  }
});
