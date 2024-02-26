import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Text, VStack, HStack, RadioGroup, Radio, Progress, useToast } from "@chakra-ui/react";

const Index = () => {
  const [timeLimit, setTimeLimit] = useState(15); // default time limit is 15 seconds
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [clicks, setClicks] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const intervalRef = useRef(null);
  const toast = useToast();

  const startTest = () => {
    if (!isCounting) {
      setIsCounting(true);
      setClicks(0);
      setTimeLeft(timeLimit);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(intervalRef.current);
            setIsCounting(false);
            toast({
              title: "Time's up!",
              description: `You clicked ${clicks} times in ${timeLimit} seconds.`,
              status: "info",
              duration: 5000,
              isClosable: true,
            });
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleClick = () => {
    if (isCounting) {
      setClicks((prevClicks) => prevClicks + 1);
    }
  };

  const handleTimeLimitChange = (value) => {
    setTimeLimit(Number(value));
    setTimeLeft(Number(value));
    setIsCounting(false);
    setClicks(0);
    clearInterval(intervalRef.current);
  };

  return (
    <VStack spacing={8} align="center" justify="center" h="100vh">
      <Text fontSize="4xl" fontWeight="bold">
        Clicks per Second Test
      </Text>
      <RadioGroup onChange={handleTimeLimitChange} value={timeLimit.toString()}>
        <HStack spacing={4}>
          <Radio value="15">15s</Radio>
          <Radio value="30">30s</Radio>
          <Radio value="60">60s</Radio>
        </HStack>
      </RadioGroup>
      <Box position="relative" w="100%" p={4}>
        <Progress hasStripe value={((timeLimit - timeLeft) / timeLimit) * 100} />
        <Text fontSize="xl" position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)">
          {timeLeft}s left
        </Text>
      </Box>
      <Button size="lg" colorScheme="blue" onClick={handleClick} disabled={!isCounting}>
        Click Me!
      </Button>
      <Text fontSize="2xl">{clicks} Clicks</Text>
      <Button colorScheme="green" onClick={startTest} disabled={isCounting}>
        Start Test
      </Button>
    </VStack>
  );
};

export default Index;
