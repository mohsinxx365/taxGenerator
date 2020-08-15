import Head from "next/head";
import "../styles/index.scss";

export default function MyApp(props) {
  const { Component, pageProps } = props;
  return (
    <React.Fragment>
      <Head>
        <title>Tax Generator</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  );
}
