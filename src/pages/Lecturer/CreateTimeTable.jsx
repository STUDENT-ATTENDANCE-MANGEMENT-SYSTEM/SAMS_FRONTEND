import React from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Flex,
  Button,
  HStack,
  Select
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
export default function CreateTimeTableLecturer() {
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { lecturerId } = useParams();
  const navigate = useNavigate();
  const handleDayChange = (e) => setDay(e.target.value);
 

  const createTimeTable = async (timeTableData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3500/timetable/${lecturerId}/add`,
        timeTableData
      );
      console.log("Time Table Created:", response.data);
      setIsLoading(false); // Set loading to false on success
      return true;
    } catch (error) {
      console.error("Error creating time table:", error);
      setIsLoading(false); // Set loading to false on error
      return false;
    }
  };

  // Example usage
  const timeTableData = {
    subject,
    day,
    startTime,
    endTime,
    location
  };

  const createMore = async () => {
    await createTimeTable(timeTableData);
    console.log(timeTableData);
    setDay("");
    setLocation("");
    setSubject("");
    setStartTime("");
    setEndTime("");
  };

  const finishTimeTable = () => {
    navigate(`/lecturer/${lecturerId}/timetable`);
  };

  useEffect(() => {
    document.body.classList.add("bg-color");
  }, []);

  return (
    <>
      <Flex height="100vh" mt={'5em'} >
        <Container centerContent p={{ base: 4, md: 8 }}>
          <VStack
            spacing={4}
            w="full"
            maxW="md"
            bg="white"
            rounded="xl"
            boxShadow="lg"
            p={6}
          >
            <FormControl>
              <FormLabel>Course Code</FormLabel>
              <Input
                value={subject}
                placeholder="MAT 111"
                autoComplete="off"
                onChange={(e) => setSubject(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
            <Select placeholder="Select Day" value={day} onChange={handleDayChange}
        border={'1px solid grey'} color={'grey'}
        >
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          
        </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Start Time</FormLabel>
              <Input
                value={startTime}
                placeholder="e.g 10:00 am"
                autoComplete="off"
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>End Time</FormLabel>
              <Input
                value={endTime}
                placeholder="e.g 11:00 am"
                autoComplete="off"
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                placeholder="Lecture Hall"
                autoComplete="off"
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>
          </VStack>
          <HStack mt={6}>
            {isLoading ? (
              <Button isLoading></Button>
            ) : (
              <Button
                colorScheme="blue"
                onClick={createMore}
                mr={3}
                type="submit"
              >
                Create more
              </Button>
            )}
            <Button
              colorScheme="red"
              mr={3}
              onClick={finishTimeTable}
              type="submit"
            >
              Finish
            </Button>
          </HStack>
        </Container>
      </Flex>
    </>
  );
}
