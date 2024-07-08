import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Spinner,
  Center,
  Button,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Flex,
  Box,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useUpdateAttendanceMutation } from "../../features/attendance/lecturerAttendanceApiSlice";
import { useDeleteAttendanceMutation } from "../../features/attendance/lecturerAttendanceApiSlice";

export default function AttendanceInfo() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  function getItemsPerPage() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) { // Example breakpoint for mobile devices
      return 12;
    } else if (screenWidth < 1024) { // Example breakpoint for tablets
      return 8;
    } else {
      return 8; // Default value for desktop
    }
  }

  useEffect(() => {
    function handleResize() {
      setItemsPerPage(getItemsPerPage());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [updateAttendance, { isLoading, isSuccess }] =
    useUpdateAttendanceMutation();
  const [deleteAttendance, { isSuccess: isDelSuccess }] =
    useDeleteAttendanceMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [attendance, setAttendance] = useState(null);
  const { lecturerId, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const fetchAttendanceById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3500/attendance/${id}`
      );
      setAttendance(response.data);
    } catch (error) {
      console.error("Error fetching student:", error.response.data);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAttendanceById(id);
    }
  }, [id]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      fetchAttendanceById(id);
    }
  }, [id, isSuccess, isDelSuccess]);

  if (!attendance) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const currentItems = attendance.students
    .sort((a, b) => a.department.localeCompare(b.department))
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(attendance.students.length / itemsPerPage);

  const handleDelete = async (student_id) => {
    try {
      await deleteAttendance({ attendanceId: id, studentId: student_id });
    } catch (error) {
      console.log("Error deleting student", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await updateAttendance({
        attendanceId: id,
        lecturerId,
        name,
        matricNumber,
        department,
      });
      onClose();
      console.log({ name, matricNumber, department });
    } catch (error) {
      console.log("Error updating student", error);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <TableContainer>
        <Table variant="striped" colorScheme="grey">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Matric Number</Th>
              <Th>Department</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody textAlign={"center"}>
            {currentItems.map((student) => (
              <Tr key={student._id}>
                <Td>{student.name}</Td>
                <Td>{student.matricNumber}</Td>
                <Td>{student.department}</Td>
                <Td>
                  <Button
                    onClick={() => handleDelete(student._id)}
                    size="sm"
                    colorScheme="red"
                  >
                    <Icon as={MdDelete} />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex
        m={4}
        pos={"absolute"}
        bottom={"0px"}
        right={"0px"}
        flexDir={"row"}
        justify={"flex-end"}
        align={"center"}
        width="100%" // Ensure it spans the full width if needed
        maxWidth={{ base: "400px", lg: "1080px" }} // Adjust based on your layout's max width
        left="50%"
        transform="translateX(-50%)"
      >
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          colorScheme="red"
          m="0 5px"
        >
          Previous
        </Button>
        <Box>
          Page {currentPage} of {totalPages}
        </Box>
        <Button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          colorScheme="red"
          m="0 5px"
        >
          Next
        </Button>
      </Flex>

      <Button
        colorScheme="green"
        m="1rem"
        onClick={onOpen}
        pos={"absolute"}
        bottom={"0"}
      >
        <Icon as={MdEdit} />
        Add
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Information</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  placeholder="e.g John Doe"
                  autoComplete="off"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Matric Number</FormLabel>
                <Input
                  value={matricNumber}
                  placeholder="e.g 00000"
                  autoComplete="off"
                  onChange={(e) => setMatricNumber(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel>Department</FormLabel>
                <Input
                  value={department}
                  placeholder="e.g Your Department"
                  autoComplete="off"
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Submit
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
}
