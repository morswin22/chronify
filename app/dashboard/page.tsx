"use client";

import {
  Box,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';

export default function DashboardPage() {
  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Text color={'gray.500'}>
          This is the dashboard page.
        </Text>
      </Stack>
    </Container>
  );
}