"use client";

import {
  Box,
  Container,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import CategoriesCard, { Category } from './categories';
import DayCard, { Day, utcToUserTimezone } from './day';

export default function DashboardPage() {
  const [currentDay, setCurrentDay] = useState<Day | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <DayCard onDayChange={setCurrentDay} />
        {currentDay && <>
          <CategoriesCard onCategoryChange={setSelectedCategory} />
          <Text>{utcToUserTimezone(currentDay.startDate).format("MMMM do, YYYY [at] HH:mm:ss")}</Text>
          <Text>{selectedCategory?.name}</Text>
        </>}
      </Stack>
    </Container>
  );
}