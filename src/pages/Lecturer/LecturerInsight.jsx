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
    
    Button,
    Show,
  } from "@chakra-ui/react";
  import { v4 as uuidv4 } from "uuid";
  import { useEffect, useState } from "react";
  import {  useToast } from "@chakra-ui/react";
  import { useParams, useNavigate } from "react-router-dom";
  import { color } from "framer-motion";
  import { useGetAttendanceTabQuery } from "../../features/attendanceTab/lecturerAttendanceTabApiSlice";
  
  import {
    MdNavigateNext,
    MdNavigateBefore,
    MdOutlineEqualizer,
  } from "react-icons/md";
  import copy from "copy-to-clipboard";
  
  export default function LecturerInsight() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
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

  const handleClick = async (id) => {
    navigate(`/lecturer/${lecturerId}/insight-info/${id}`);
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
                      <Card variant={"outline"} mt={'5em'}  boxShadow={'lg'} onClick={() => handleClick(id)}>
                        <CardHeader>
                          <Flex>
                            <Heading fontSize={{base:"1.5rem",md:"2rem",lg:"2rem",xl:"2rem"}} pl={"10px"} mt={"15px"}>
                              {course.courseCode}
                            </Heading>
                            <Spacer />
                            
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
                              onClick={() => {
                                
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
                              icon={<MdOutlineEqualizer />}
                            />
                          </HStack>
                        </CardFooter>
                      </Card>
                    
  
                          
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
  