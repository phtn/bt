// 'use client'

// import {useWebcam, VIDEO_CONSTRAINTS} from '@/hooks/use-webcam'
// import Webcam from 'react-webcam'

// export default function WebcamComponent() {
//   const {
//     webcamRef,
//     captureScreenshot,
//     startRecording,
//     stopRecording,
//     isRecording,
//     downloadRecording,
//     error,
//     hasPermission,
//     onUserMedia,
//     onUserMediaError,
//   } = useWebcam({
//     videoConstraints: VIDEO_CONSTRAINTS.HD,
//     screenshotFormat: 'image/jpeg',
//   })

//   const handleCapture = () => {
//     const screenshot = captureScreenshot()
//     if (screenshot) {
//       // Do something with the screenshot (base64 string)
//       console.log(screenshot)
//     }
//   }

//   if (error) {
//     return (
//       <div>
//         <div>Error: {error}</div>
//         <button onClick={() => window.location.reload()}>Retry</button>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <Webcam
//         ref={webcamRef}
//         videoConstraints={VIDEO_CONSTRAINTS.HD}
//         onUserMedia={onUserMedia}
//         onUserMediaError={onUserMediaError}
//         audio={false}
//       />
//       {!hasPermission && (
//         <div>Requesting camera permission...</div>
//       )}
//       {hasPermission && (
//         <>
//           <button onClick={handleCapture}>Capture</button>
//           <button onClick={isRecording ? stopRecording : startRecording}>
//             {isRecording ? 'Stop' : 'Start'} Recording
//           </button>
//           <button onClick={() => downloadRecording()}>Download</button>
//         </>
//       )}
//     </div>
//   )
// }
