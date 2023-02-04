"use client";

import { UserContext } from "@/components/usercsr";
import { User } from "@/lib/db";
import { ChakraProvider } from "@chakra-ui/react"
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/user", { credentials: "include", cache: "no-cache" })
      .then(res => res.json())
      .then(setUser);
  }, []);

  return (
    <html lang="en">
      <head />
      <body>
        <UserContext.Provider value={user}>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </UserContext.Provider>
      </body>
    </html>
  )
}