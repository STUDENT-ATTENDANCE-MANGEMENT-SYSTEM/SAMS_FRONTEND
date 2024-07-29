import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  useBreakpointValue,
  Icon,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import { MdArrowForward, MdLocationPin } from "react-icons/md";
import "@fontsource/lato/400.css";
import "@fontsource/prompt/900.css";
import "@fontsource/raleway/500.css";
import "@fontsource/roboto/300.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentTimeTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [timeTable, setIsTimeTable] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(id)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getStudentTimeTableById();
        console.log("Data:", data);
        if (!data || data.length === 0) {
          // Assuming no data is represented by null, undefined, or an empty array
          navigate(`/student/${studentId}/notimetable`);
        } else {
          setIsTimeTable(data);
          console.log(timeTable);
          // Store the fetched data in state
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const getStudentTimeTableById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3500/timetable/${studentId}`
      );
      console.log("Timetable retrieved successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error retrieving timetable:", error.response.data);
      throw error;
    }
  };

  const fontSize = useBreakpointValue({ base: "md", md: "lg", lg: "xl" });
  const colors = [
    "gray.200",
    "blue.100",
    "purple.100",
    "green.100",
    "pink.100",
    "teal.100",
    "cyan.100",
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  // Generate a random color for the box
  const boxBgColor = getRandomColor();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDayOfWeekString = daysOfWeek[new Date().getDay()];

  const classesForToday =
    timeTable &&
    timeTable.classes.filter(
      (classItem) => classItem.day === currentDayOfWeekString
    );

  return (
    <SimpleGrid
      columns={{ base: "1", lg: "3", xl: "3" }}
      mb={"2rem"}
      mx={"20px"}
      mt={"30px"}
      overflow={"hidden"}
      pos={"relative"}
    >
      {!isLoading && timeTable && classesForToday.length > 0 ? (
        classesForToday.map((classItem) => (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}
            boxShadow="lg"
            m={4}
            bg={boxBgColor}
            mt={{ base: "5em", lg: "0", xl: "0" }}
          >
            <Flex direction="column" align="start">
              <Text fontSize={fontSize} fontWeight="bold" pb={2}>
                {classItem.subject}
              </Text>
              <Flex align={"center"} fontFamily={"lato"} pb={2}>
                <Text fontSize={fontSize}>{classItem.startTime}</Text>
                <Icon as={MdArrowForward} />
                <Text fontSize={fontSize}>{classItem.endTime}</Text>
              </Flex>
              <Flex align={"center"} fontFamily={"lato"} pb={2}>
                <Text fontSize={fontSize}>{classItem.location}</Text>
                <Icon as={MdLocationPin} />
                </Flex>
            </Flex>
          </Box>
        ))
      ) : (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={5}
          boxShadow="lg"
          m={4}
          bg={boxBgColor}
          mt={{ base: "5em", lg: "0", xl: "0" }}
        >
          <Text textAlign={'center'}>No classes scheduled for today.</Text>
        </Box>
      )}
    </SimpleGrid>
  );
}
