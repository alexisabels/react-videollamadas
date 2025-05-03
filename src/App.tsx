import { useEffect, useState } from "react";
import {
  Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
  User,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./style.css";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const token = import.meta.env.VITE_STREAM_TOKEN;
const userId = import.meta.env.VITE_STREAM_USER_ID;
const userName = import.meta.env.VITE_STREAM_USER_NAME;

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_svg/?id=${userId}&name=${userName}`,
};

// inicializa el cliente
const client = new StreamVideoClient({ apiKey, user, token });

export default function App() {
  const [call, setCall] = useState<Call>();

  // Extraer el callId desde la URL: /?call=myroom123
  const urlParams = new URLSearchParams(window.location.search);
  const callId = urlParams.get("call") || "default-room";

  useEffect(() => {
    const myCall = client.call("default", callId);
    myCall.join({ create: true }).catch((err) => {
      console.error("Error al unirse a la llamada:", err);
    });

    setCall(myCall);

    return () => {
      setCall(undefined);
      myCall.leave().catch((err) => {
        console.error("Error al salir de la llamada:", err);
      });
    };
  }, [callId]);

  if (!call) return <div>Loading...</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <UILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const UILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Entrando a la llamada...</div>;
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};
