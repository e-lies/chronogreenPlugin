async function getCameraTracks() {
  const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;
  let cameraTracks = [];
  if (SUPPORTS_MEDIA_DEVICES) {
    //Get the environment camera (usually the second one)
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    if (cameras.length === 0) {
      throw "No camera found on this device.";
    }

    // Create stream and get video track
    cameraTracks = cameras.map(async (camera) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: camera.deviceId,
          facingMode: ["environment"],
          height: { ideal: 1080 },
          width: { ideal: 1920 },
        },
      });
      const tracks = await Promise.all(
        stream.getVideoTracks().map(async (track) => {
          //Create image capture object and get camera capabilities
          const imageCapture = new ImageCapture(track);
          const capabilities = await imageCapture.getPhotoCapabilities();
          return { track, capabilities };
        })
      );
      return tracks;
    });
  }
  return (await Promise.all(cameraTracks)).reduce(
    (acc, cur) => [...acc, ...cur],
    []
  );
}

export async function torchOn() {
  const tracks = await getCameraTracks();
  tracks.forEach(({ track, capabilities }) => {
    if (
      (capabilities.fillLightMode &&
        capabilities.fillLightMode.includes("flash")) ||
      capabilities.torch
    ) {
      track.applyConstraints({
        advanced: [{ torch: true }],
      });
    }
  });
}
export async function torchOff() {
  const tracks = await getCameraTracks();
  tracks.forEach(({ track, capabilities }) => {
    if (
      (capabilities.fillLightMode &&
        capabilities.fillLightMode.includes("flash")) ||
      capabilities.torch
    ) {
      track.applyConstraints({
        advanced: [{ torch: false }],
      });
    }
  });
}
