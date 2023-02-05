"use client";

import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";

export type LinkProps = NextLinkProps & ChakraLinkProps;

export default function Link({ href, ...props }: LinkProps) {
  return (
    <ChakraLink
      as={NextLink}
      href={href}
      {...props}
    />
  );
}