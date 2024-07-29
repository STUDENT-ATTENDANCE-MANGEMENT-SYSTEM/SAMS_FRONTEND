import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import nodata from "../../images/no-data.png";
import { color } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios'
export default function NoTimeTable() {
  const navigate = useNavigate();
  const { lecturerId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const createTimeTable = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3500/timetable/${lecturerId}`
      );
      console.log("Time Table Created:", response.data);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Error creating time table:", error);
      setIsLoading(false); // Set loading to false on error
      return false; // Reject the promise on error
    }
  };

  const onCreate = async () => {
    const created = await createTimeTable();
    if (created) {
      navigate(`/lecturer/${lecturerId}/timetable/new`);
    }
  };

  return (
    <div>
      <Container mt={{base:"40px", xl:'45px', lg:"45px"}}>
        <Flex justify={"center"}>
          <Box w={"500px"}>
            <img src={nodata} alt="no-data" />
          </Box>
        </Flex>
        <Text textAlign={"center"} fontWeight={"semibold"} mt={"-80px"}>
          You are yet to create a time-table
        </Text>
        <Flex justify={"center"} mt={"20px"} gap={"5"}>
          {isLoading ? (
            <Button isLoading></Button>
          ) : (
            <Button onClick={onCreate} colorScheme="red">Create Timetable</Button>
          )}
        </Flex>
      </Container>
    </div>
  );
}
