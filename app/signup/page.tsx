"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { SingupCredentials, SignupResponse } from '@/pages/api/signup';
import { useRouter } from 'next/navigation';

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formik = useFormik<SingupCredentials>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      firstName: yup.string().required('First name is required'),
      lastName: yup.string(),
      email: yup.string().email('Invalid email address').required('Email is required'),
      password: yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      const request = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const response = await request.json() as SignupResponse;
      if (request.status == 200)
        router.push('/signin');
      else
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
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
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
            <HStack alignItems={"begin"}>
              <Box>
                <FormControl id="firstName" isRequired isInvalid={formik.errors.firstName}>
                  <FormLabel>First Name</FormLabel>
                  <Input 
                    type="text"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isInvalid={formik.errors.lastName}>
                  <FormLabel>Last Name</FormLabel>
                  <Input 
                    type="text"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired isInvalid={formik.errors.email ?? error}>
              <FormLabel>Email address</FormLabel>
              <Input 
                type="email"
                value={formik.values.email}
                onChange={e => { setError(null); formik.handleChange(e); }}
                onBlur={formik.handleBlur}
              />
              <FormErrorMessage>{formik.errors.email ?? error}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isRequired isInvalid={formik.errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                loadingText="Signing up"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} href="/signin">Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}