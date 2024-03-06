import { Box, ChakraProvider, useColorMode } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import FrontPage from "./components/FrontPage.tsx";
import theme from "./components/theme.tsx";

import { PersistGate } from "redux-persist/integration/react";
import BackgroundDark from "./assets/background_dark.jpg";
import BackgroundLight from "./assets/background_light.jpg";
import ExpandedUi from "./components/ExpandedUi.tsx";
import QamState from "./components/QamState.tsx";
import { useInitialLogin, useRelayEffect } from "./model/hooks.tsx";
import hhdSlice, {
  selectAppType,
  selectIsLoading,
  selectIsLoggedIn,
  selectUiType,
} from "./model/slice.tsx";
import * as electronUtils from "./model/electron.tsx";
import { persistor, store } from "./model/store.tsx";
import { setupGamepadEventListener } from "./model/controller.tsx";

declare global {
  interface Window {
    electronUtils: any;
    electronUtilsRender: any;
  }
}

// Inject electron utils
window.electronUtils = electronUtils;

// Setup gamepad listener
setupGamepadEventListener();

function Wrapper() {
  const { colorMode, toggleColorMode: _ } = useColorMode();
  const uiType = useSelector(selectUiType);
  const appType = useSelector(selectAppType);
  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const loggedIn = useSelector(selectIsLoggedIn);

  let background;
  if (appType === "web" || appType === "app") {
    background = "100%";
  } else if (uiType === "expanded") {
    background = "90%";
  } else {
    background = "0%";
  }

  useRelayEffect();
  useInitialLogin();

  let body = <FrontPage />;

  if (loading) {
    // TODO: Implement spinner
  }

  if (loggedIn)
    body = (
      <>
        <QamState />
        <ExpandedUi />
      </>
    );

  return (
    <>
      <Box
        bgImage={colorMode == "dark" ? BackgroundDark : BackgroundLight}
        h="100vh"
        w="100vw"
        backgroundAttachment="fixed"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundColor="black"
        position="absolute"
        zIndex="-1"
        transition="0.2s ease-in-out"
        opacity={background}
      ></Box>
      <Box
        h="100vh"
        w="100vw"
        overflow="hidden"
        onClick={(e) => {
          if (e.currentTarget != e.target) return;
          dispatch(hhdSlice.actions.setUiType("closed"));
        }}
        css={colorMode == "dark" ? { scrollbarColor: "#333e52 #1a202c" } : {}}
      >
        <PersistGate loading={null} persistor={persistor}>
          {body}
        </PersistGate>
      </Box>
    </>
  );
}

function Main() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Wrapper />
        </ChakraProvider>
      </Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
