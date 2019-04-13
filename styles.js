import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 32
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
  cameraViewWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },
  cameraBorderView: {
    borderWidth: 2,
    borderStyle: "dotted",
    borderColor: "#fff",
    width: 240,
    height: 240,
    borderRadius: 120
  },
  cameraView: {
    width: "100%",
    height: "100%",
    borderRadius: 120,
    overflow: "hidden"
  },
  helperText: {
    fontFamily: "maison-neue-demi",
    color: "#fff",
    fontSize: 24,
    marginVertical: 24
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
  shiftedButtonView: {
    marginBottom: 64
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
    backgroundColor: "#F8AE23"
  }
});
