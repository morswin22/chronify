import { Button, Heading, SkeletonText, Spinner, Stack, Text, useBoolean } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import moment from "moment-timezone";

export type Day = {
  id: number,
  userId: number,
  startDate: string,
  endDate: string | null,
};

export const utcToUserTimezone = (utcTime: string) => {
  return moment.utc(utcTime).tz(moment.tz.guess());
};

const StartDayButton = ({ onDayChange }: { onDayChange: (day: Day | null) => void }) => {
  const [loading, setLoading] = useBoolean();

  return <Button
    mt="10"
    w={'sm'}
    colorScheme={'blue'}
    isLoading={loading}
    onClick={async () => {
      setLoading.on();
      const response = await fetch('/api/day/start');
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }
      const day = await response.json() as Day;
      onDayChange(day);
      setLoading.off();
    }}
  >
    Start the day!
  </Button>;
};

const EndDayButton = ({ onDayChange }: { onDayChange: (day: Day | null) => void }) => {
  const [loading, setLoading] = useBoolean();

  return <Button
    mt="10"
    w={'sm'}
    colorScheme={'blue'}
    variant={'ghost'}
    isLoading={loading}
    onClick={async () => {
      setLoading.on();
      const response = await fetch('/api/day/end');
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }
      onDayChange(null);
      setLoading.off();
    }}
  >
    End the day!
  </Button>;
};

const RealTimeClock = ({ day }: {day: Day}) => {
  const [time, setTime] = useState(moment.utc().diff(moment.utc(day.startDate)));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment.utc().diff(moment.utc(day.startDate)));
    }, 1/3);
    return () => clearInterval(interval);
  }, []);

  return <Text fontSize="6xl">{moment.utc(time).format("HH:mm:ss")}</Text>;
};

export default function DayCard({ onDayChange }: { onDayChange: (day: Day | null) => void}) {
  const [currentDay, setCurrentDay] = useState<Day | null>(null);
  const [loading, setLoading] = useBoolean(true);

  useEffect(() => {
    const fetchDay = async () => {
      const response = await fetch('/api/day');
      if (!response.ok) {
        if (response.status === 400) {
          setCurrentDay(null);
          setLoading.off();
          return;
        }
        const { message } = await response.json();
        throw new Error(message);
      }
      const day = await response.json() as Day;
      setCurrentDay(day);
      setLoading.off();
    };
    fetchDay();
  }, []);

  useEffect(() => {
    onDayChange(currentDay);
  }, [currentDay]);

  return <Stack alignItems={'center'}>
    <Heading>{moment().format("dddd")}</Heading>
    <Text>{moment().format("MMMM do, YYYY")}</Text>
    {loading ? <Spinner /> : currentDay ? <>
      <Text>Started at {utcToUserTimezone(currentDay.startDate).format("HH:mm")}</Text>
      <RealTimeClock day={currentDay} />
      <EndDayButton onDayChange={setCurrentDay} />
    </> : <StartDayButton onDayChange={setCurrentDay} />}
  </Stack>;
}