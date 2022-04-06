// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { nextFrame } from "@tensorflow/tfjs";
// 2. TODO - Import drawing utility here
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var net = null;

  const detectImage = async () => {
    console.log("Detecting...");
    await detect(net);
    console.log("Done!")
  }

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    console.log("Loading Model...");
    // net = await tf.loadGraphModel('https://livelong.s3.au-syd.cloud-object-storage.appdomain.cloud/model.json')
    net = await tf.loadGraphModel('https://raw.githubusercontent.com/junyongxlee/GenerateTFRecord-FYP-Usage/d2aede4cc53d76d92d0917e177096c0f4ebd9490/model/model.json')
    console.log("Done!");
    // detect(net);
    // Loop and detect hands
    // setInterval(() => {
    //   console.log("Detecting now");
    //   detect(net);
    //   // }, 16.7);
    // }, 20000);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      ctx.drawImage(
        video,
        0,
        0
      );

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [800, 600])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)
      console.log({obj});

      console.log({
        '1': await obj[1].array(),
        '2': await obj[2].array(),
        '3': await obj[3].array(),
        '4': await obj[4].array(),
        '5': await obj[5].array(),
        '6': await obj[6].array(),
        '7': await obj[7].array(),
      });

      const boxes = await obj[2].array()
      const classes = await obj[3].array()
      const scores = await obj[7].array()

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      requestAnimationFrame(() => { drawRect(boxes[0], classes[0], scores[0], 0.5, videoWidth, videoHeight, ctx) });

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

    }
  };

  useEffect(() => { runCoco() }, []);

  return (
    <div className="App">
      <button onClick={detectImage}>
        Detect
      </button>
      <header className="App-header">

        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 800,
            height: 600,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 800,
            height: 600,
          }}
        />
      </header>
    </div>
  );
}

export default App;
