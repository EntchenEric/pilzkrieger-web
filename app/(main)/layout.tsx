"use client"

import '@mantine/core/styles.css';
import React, { useEffect } from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../../theme';
import { getCookie } from 'cookies-next';


export default function RootLayout({ children }: { children: any }) {

  useEffect(() => {
    const verifyed = getCookie("verified")
    if (verifyed == "Ja, der typ ist Verifiziert 🍄") {
      console.log("verified")
    } else {
      console.log("not verified")
      window.location.href = "/PilzkriegerWeb/authentificate"
    }
  }, [])

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
