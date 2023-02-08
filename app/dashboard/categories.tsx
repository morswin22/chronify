"use client";

import { useUser } from '@/components/usercsr';
import {
  Box,
  Container,
  Text,
  Button,
  Stack,
  Select,
  useColorModeValue,
  useDisclosure,
  Skeleton,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  useBoolean,
  useOutsideClick,
  useFocusEffect,
} from '@chakra-ui/react';
import { AsyncCreatableSelect } from 'chakra-react-select';
import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Category = {
  id: number;
  userId: number;
  name: string;
};

const EditCategory = ({ selectedCategory, onEdited }: {selectedCategory: Category, onEdited: (edited: Category) => void}) => {
  const [isOpen, setIsOpen] = useBoolean();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick({
    ref: formRef,
    handler: setIsOpen.off
  });

  useFocusEffect(inputRef, {
    shouldFocus: isOpen,
  });

  const formik = useFormik({
    initialValues: {
      name: selectedCategory.name
    },
    onSubmit: async (values) => {
      const res = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      } else {
        const category = await res.json() as Category;
        setIsOpen.off();
        onEdited(category);
      }
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', selectedCategory.name);
  }, [selectedCategory]);

  return <>
    {isOpen ? (
      <form onSubmit={formik.handleSubmit} ref={formRef}>
        <InputGroup>
          <Input
            ref={inputRef}
            type="text"
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <InputRightElement>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={formik.isSubmitting}
              loadingText="Editing"
            >
              Edit
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
    ) : (
      <Button
        colorScheme="blue"
        onClick={setIsOpen.on}
      >
        Edit
      </Button>
    )}
  </>;
};

export default function CategoriesCard({ onCategoryChange }: { onCategoryChange: (categoryId: Category | null) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useUser();
  const [ cacheState, setCacheState ] = useState<number>(1);

  const updateCache = useCallback(() => {
    setCacheState(cacheState + 1);
  }, [cacheState]);

  useEffect(() => {
    onCategoryChange(selectedCategory);
  }, [selectedCategory]);

  if (!user)
    return <Skeleton height={'140px'} rounded={'md'} p={6} minW={'300px'} />;

  return <>
    <Box
      bg={useColorModeValue('gray.100', 'gray.900')}
      rounded={'md'}
      p={6}
      minW={'300px'}
    >
      <Stack spacing={4} align={'center'}>
        <Text
          textAlign={'center'}
          fontSize={'2xl'}
          fontWeight={500}
        >
          Categories
        </Text>
        <Box w="full">
          <AsyncCreatableSelect
            isClearable
            isSearchable
            isLoading={isLoading}
            onChange={(e) => {
              setSelectedCategory(e ? { id: e.value, userId: user.id, name: e.label } : null);
            }}
            onCreateOption={async (e) => {
              setIsLoading(true);
              const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: e })
              });
              if (res.status == 200) {
                const category = await res.json() as Category;
                setSelectedCategory(category);
                updateCache();
              } else {
                const { message } = await res.json();
                throw new Error(message);
              }
              setIsLoading(false);
            }}
            cacheOptions={cacheState} // invalidate cache 
            key={cacheState} // re-render component is bad
            defaultOptions
            loadOptions={async (inputValue: string) => {
              setIsLoading(true);
              const res = await fetch(`/api/categories/${inputValue}`);
              if (!res.ok)
                throw new Error('Failed to fetch categories');
              const categories = await res.json() as Category[];
              setIsLoading(false);
              return categories.map((category) => ({
                value: category.id,
                label: category.name
              }));
            }}
            value={selectedCategory ? { value: selectedCategory.id, label: selectedCategory.name } : null}
          />
        </Box>
        {selectedCategory && (
          <HStack>
            <Button
              colorScheme="red"
              onClick={async () => {
                setIsLoading(true);
                const res = await fetch(`/api/categories/${selectedCategory.id}`, {
                  method: 'DELETE'
                });
                if (!res.ok) {
                  const { message } = await res.json();
                  throw new Error(message);
                }
                setSelectedCategory(null);
                setIsLoading(false);
                updateCache();
              }}
            >
              Delete
            </Button>
            <EditCategory 
              selectedCategory={selectedCategory}
              onEdited={(edited) => {
                setSelectedCategory(edited);
                updateCache();
              }}
            />
          </HStack>
        )}
      </Stack>
    </Box>
  </>;
}
