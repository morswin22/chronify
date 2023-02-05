"use client";

import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useUser } from './usercsr';
import Link from './link';
import { useRouter } from 'next/navigation';

type Route = {
  name: string;
  path: string;
};

const Links: Route[] = [{ name: 'Dashboard', path: '/dashboard' }];

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, revalidateUser } = useUser();
  const router = useRouter();

  const signOut = () => {
    fetch('/api/signout', { credentials: 'include', cache: 'no-cache' })
      .then(res => {
        if (res.status === 200) {
          revalidateUser();
          router.push('/signin');
        } // TODO: handle error
      });
  };

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Link href="/">
              <HStack>
                <Image 
                  h="30px"
                  src="/favicon.ico" />
                <Image 
                  h="30px"
                  src="/logo.svg" />
              </HStack>
            </Link>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map(({ name, path }) => (
                <Link
                  key={name}
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                  href={path}>
                  {name}
                </Link>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {user ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    name={`${user.firstName} ${user.lastName}`}
                    src={undefined}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Data</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={signOut}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Link href="/signin">
                <Avatar
                  size={'sm'}
                />
              </Link>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map(({ name, path }) => (
                <Link
                  key={name}
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                  href={path}>
                  {name}
                </Link>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}