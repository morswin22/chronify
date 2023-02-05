"use client";

import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, Heading, Text, useColorModeValue, FormErrorMessage } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SinginCredentials, SigninResponse } from '@/pages/api/signin';
import Link from '@/components/link';
import { useUser } from '@/components/usercsr';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { revalidateUser } = useUser();

  const formik = useFormik<SinginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup.string().email('Invalid email address').required('Email is required'),
      password: yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      const request = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const response = await request.json() as SigninResponse;
      if (request.status == 200) {
        revalidateUser();
        router.push('/dashboard');
      } else
        setError(response.message);
    },
  });

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in to your account</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link href="/about" color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4} as="form" onSubmit={formik.handleSubmit}>
            <FormControl id="email" isInvalid={formik.errors.email ?? error}>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email" 
                value={formik.values.email}
                onChange={e => { setError(null); formik.handleChange(e); }}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isInvalid={formik.errors.password ?? error}>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password"
                value={formik.values.password}
                onChange={e => { setError(null); formik.handleChange(e); }}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.password ?? error}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'} href="/forgot-password">Forgot password?</Link>
              </Stack>
              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                loadingText="Signing in"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}