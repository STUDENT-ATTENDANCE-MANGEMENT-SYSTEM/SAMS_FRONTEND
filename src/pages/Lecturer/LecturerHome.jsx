import {
  Text,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  GridItem,
  Flex,
  SimpleGrid,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Icon,
  Center,
  Spinner,
  Heading,
  Divider,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Show,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useClipboard, useToast } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { color } from "framer-motion";
import { useGetAttendanceTabQuery } from "../../features/attendanceTab/lecturerAttendanceTabApiSlice";
import { useToggleOpenAttendanceTabMutation } from "../../features/attendanceTab/lecturerAttendanceTabApiSlice";
import { useAddNewAttendanceMutation } from "../../features/attendance/lecturerAttendanceApiSlice";
import { useDeleteAttendanceTabMutation } from "../../features/attendanceTab/lecturerAttendanceTabApiSlice";
import {
  MdContentCopy,
  MdMoreVert,
  MdLockOutline,
  MdEdit,
  MdCalculate,
  MdLockOpen,
  MdOutlineAddCircleOutline,
  MdViewList,
  MdDelete,
  MdNavigateNext,
  MdNavigateBefore,
} from "react-icons/md";
import copy from "copy-to-clipboard";

export default function LecturerHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { lecturerId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    data: attendanceTabs,
    isLoading,
    isError,
  } = useGetAttendanceTabQuery(lecturerId, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [deleteAttendanceTab, { isSuccess: isDeleteSuccess }] =
    useDeleteAttendanceTabMutation();

  const [toggleOpenAttendanceTab, { isSuccess: isToggleSuccess }] =
    useToggleOpenAttendanceTabMutation();
  const [
    addNewAttendance,
    { isLoading: isLoadingAttendance, isSuccess: isSuccessAttendance },
  ] = useAddNewAttendanceMutation();
  useEffect(() => {
    if (!isLoading && (!attendanceTabs || attendanceTabs.ids.length === 0)) {
      navigate(`/lecturer/${lecturerId}/new`);
    }
  }, [isLoading, attendanceTabs, navigate, lecturerId]);
  useEffect(() => {
    document.body.classList.add("bg-color");
  }, []);

  const handleCardClick = async (course) => {
    console.log(course.id);
    try {
      await toggleOpenAttendanceTab({ id: course.id });
      if (course.Open) {
        toast({
          position: "top-right",
          title: "Course Closed",
          description: `${course.courseCode} is closed.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          position: "top-right",
          title: "Course Open",
          description: `${course.courseCode} is open.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (id) => {
    navigate(`/lecturer/${lecturerId}/create-attendance/${id}`);
  };

  const handleDeleteAttendanceTab = async (id) => {
    // Request confirmation before proceeding with deletion
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this attendance tab?"
    );
    if (isConfirmed) {
      try {
        await deleteAttendanceTab({ id });
        // Optionally, add code here to update the UI or state after successful deletion
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCalculateAttendance = async (id) => {
    // Request confirmation before proceeding with deletion
    const isConfirmed = window.confirm(
      "Are you sure you want to calculate attendance in this attendance tab?"
    );
    if (isConfirmed) {
      navigate(`/lecturer/${lecturerId}/calculate-attendance/${id}`);
    }
  };

  const viewAttendance = (id) => {
    navigate(`/lecturer/${lecturerId}/attendance/${id}`);
  };

  const currentItems =
    attendanceTabs &&
    attendanceTabs.ids.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalItems = attendanceTabs ? attendanceTabs.length : 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isNextDisabled = currentPage >= totalPages;

  const isPrevDisabled = currentPage <= 1;
  const handlePrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
};

const handleNextPage = () => {
        paginate(currentPage + 1);
};
  return (
    <div >
      {isLoading ? (
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <div>
          <SimpleGrid
            columns={{ base: "1", lg: "3", xl: "3" }}
            mb={"2rem"}
            mx={"20px"}
            mt={"30px"}
            overflow={"hidden"}
            pos={"relative"}
            gap={3}
          >
            {currentItems &&
              currentItems.map((id, index) => {
                const course = attendanceTabs.entities[id];

                return (
                  <div key={index}>
                    <Card variant={"outline"} mt={{base:'5em', lg:'0', xl:'0'}} boxShadow={'lg'} >
                      <CardHeader>
                        <Flex>
                          <Heading fontSize={{base:"1.5rem",md:"2rem",lg:"2rem",xl:"2rem"}} pl={"10px"} mt={"15px"}>
                            {course.courseCode}
                          </Heading>
                          <Spacer />
                          <Menu>
                            <MenuButton>
                              {" "}
                              <IconButton
                                variant={"ghost"}
                                size={"lg"}
                                icon={<MdMoreVert />}
                              />
                            </MenuButton>
                            <MenuList ml={"-160px"} mt={"-10px"}>
                              <MenuItem
                                icon={<MdOutlineAddCircleOutline />}
                                onClick={() => handleClick(id)}
                              >
                                Create Attendance
                              </MenuItem>
                              <MenuItem
                                icon={<MdViewList />}
                                onClick={() => viewAttendance(id)}
                              >
                                View Attendance
                              </MenuItem>
                              <MenuItem
                                icon={<MdCalculate />}
                                onClick={() => handleCalculateAttendance(id)}
                              >
                                Calculate Attendance
                              </MenuItem>
                              <MenuItem
                                icon={<MdDelete />}
                                onClick={() => handleDeleteAttendanceTab(id)}
                              >
                                Delete Attendance
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </CardHeader>
                      <CardBody fontSize={{base:"1rem",md:"1.2rem",lg:"1.2rem",xl:"1.2rem"}}>
                        {course.courseName}
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <Spacer />
                        <HStack>
                          <IconButton
                            onClick={() => handleCardClick(course)}
                            variant={"ghost"}
                            icon={
                              course.Open ? (
                                <MdLockOpen color="green" />
                              ) : (
                                <MdLockOutline />
                              )
                            }
                            size={"lg"}
                          />

                          <IconButton
                            onClick={() => {
                              copy(course.attendanceCode);
                              toast({
                                position: "top-right",
                                title: "Attendance Code Copied",
                                description: `The attendance code ${course.attendanceCode} has been copied to your clipboard. Do well to send it to your students.`,
                                status: "success",
                                duration: 10000,
                                isClosable: true,
                              });
                            }}
                            variant={"ghost"}
                            size={"lg"}
                            icon={<MdContentCopy />}
                          />
                        </HStack>
                      </CardFooter>
                    </Card>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Created an Attendance</ModalHeader>
                        <ModalCloseButton />

                        <ModalBody>
                          <Text fontWeight={"bold"}>
                            An atttendance has be created. Please don't forget
                            to open the attendance tab so your student would
                            have access to submit their attendance.
                          </Text>
                        </ModalBody>

                        <ModalFooter>
                          <Button variant="ghost" onClick={onClose}>
                            Ok, thanks
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </div>
                );
              })}
          </SimpleGrid>
          <Show above="lg">
          <Flex
            m={4}
            pos={"absolute"}// Changed from "absolute" to "fixed"
            bottom={"0px"}
            right={"0px"}
            flexDir={"row"}
            justify={"flex-end"}
            w={'25%'}
            gap={4}
            
            
          >
            <Button
              onClick={handlePrevPage}
              isDisabled={isPrevDisabled}
              leftIcon={<MdNavigateBefore />}
              flex={"1"}
            >
              Previous
            </Button>
            <Button
              onClick={ 
                handleNextPage
              }
              isDisabled={isNextDisabled}
              rightIcon={<MdNavigateNext />}
              flex={"1"}
            >
              Next
            </Button>
          </Flex>
          </Show>
        </div>
      )}
    </div>
  );
}
