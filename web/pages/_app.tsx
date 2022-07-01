import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";
import Box from "../components/box";
import Meta from "../components/meta";
import useDebouncedValue from "../components/useDebouncedValue";

const Loader: React.FC = () => {
  const router = useRouter();

  const [isNavigating, setIsNavigating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Only show loading indicator if the navigation takes a while.
  // This prevents indicator from flashing during faster navigation.
  const isVisible = useDebouncedValue(isNavigating, 300);

  React.useEffect(() => {
    const onRouteChangeStart = () => {
      setIsNavigating(true);
      setProgress(0);
    };

    const onRouteChangeComplete = () => {
      setIsNavigating(false);
      setProgress(1);
    };

    router.events.on("routeChangeStart", onRouteChangeStart);
    router.events.on("routeChangeComplete", onRouteChangeComplete);
    router.events.on("routeChangeError", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
      router.events.off("routeChangeComplete", onRouteChangeComplete);
      router.events.off("routeChangeError", onRouteChangeComplete);
    };
  }, [router]);

  React.useEffect(() => {
    if (!isNavigating) {
      return;
    }

    const interval = setInterval(() => {
      // Progress is not representative of anything, it's just used
      // to give a sense that something is happening.
      // The value is increased inverse-hyperbolically, so that it
      // slows down and never actually reaches 100%.
      setProgress((progress) => progress + 0.1 * (0.95 - progress) ** 2);
    }, 100);

    return () => clearInterval(interval);
  }, [isNavigating]);

  return (
    <Box
      classes={[
        "h-1",
        {
          "bg-blue-500": isVisible,
          "bg-transparent": !isVisible,
        },
      ]}
      style={{
        width: `${progress * 100}%`,
        transitionProperty: "width",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "150ms",
      }}
    />
  );
};

const Main: React.FC<PropsWithChildren> = ({ children }) => {
  return <Box type="main">{children}</Box>;
};

const Scripts: React.FC = () => {
  return <></>;
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Meta />

      <Box classes={["flex", "flex-col", "min-h-screen", "bg-neutral-50"]}>
        <Loader />

        <Main>
          <Component {...pageProps} />
        </Main>
      </Box>

      <Scripts />
    </>
  );
};

export default App;
