"use client";

import { UserContext } from "@/components/usercsr";
import { User } from "@/lib/user";
import { ChakraProvider, extendTheme, localStorageManager, ThemeConfig } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react";

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(() => {
    fetch("/api/user", { credentials: "include", cache: "no-cache" })
      .then(res => res.json())
      .then(setUser);
  }, []);

  useEffect(fetchUser, []);

  return (
    <html lang="en">
      <head />
      <body>
        <UserContext.Provider value={{ user, revalidateUser: fetchUser }}>
          <ChakraProvider colorModeManager={localStorageManager} theme={theme}>
            {children}
          </ChakraProvider>
        </UserContext.Provider>
      </body>
    </html>
  )
}