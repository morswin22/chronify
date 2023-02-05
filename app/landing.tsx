"use client";

import Link from '@/components/link';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react';

export default function LandingPage() {
  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          A better clock for <br />
          <Text as={'span'} color={'green.400'}>
            a better day
          </Text>
        </Heading>
        <Text color={'gray.500'}>
          Start your day whenever you want. Set your own schedule and
          accomplish your goals. It's time to take control of your life.
          This clock will help you do it by adapting to your needs.
        </Text>
        <Stack
          direction={'column'}
          spacing={3}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}>
          <Button
            as={Link} href="/signup"
            colorScheme={'green'}
            bg={'green.400'}
            rounded={'full'}
            px={6}
            _hover={{
              bg: 'green.500',
            }}>
            Get Started
          </Button>
          <Button as={Link} variant={'link'} colorScheme={'blue'} size={'sm'} href="/about">
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}