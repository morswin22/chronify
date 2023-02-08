"use client";

import {
  Box,
  Container,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import CategoriesCard, { Category } from './categories';

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <CategoriesCard onCategoryChange={setSelectedCategory} />
        <Text>{selectedCategory?.name}</Text>
      </Stack>
    </Container>
  );
}