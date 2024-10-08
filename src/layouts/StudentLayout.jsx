import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import Hamburger from "hamburger-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  MdAnalytics,
  MdBook,
  MdContactSupport,
  MdGridOn,
  MdHome,
  MdSettings,
} from "react-icons/md";
import { useEffect, useState, useContext } from "react";
import logo from "../images/logo-revamp.svg";
import { useSendLogoutMutation } from "../features/studentAuth/studentAuthApiSlice";
import { useUpdateAttendanceTabMutation } from "../features/attendanceTab/studentAttendanceTabApiSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AddIcon, BellIcon, SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
export default function StudentLayout() {
  const [updateAttendanceTab, {isLoading:isLoadingAttendanceTab, isSuccess:isSuccessAttendanceTab}] = useUpdateAttendanceTabMutation();
  const [attendanceCode, setAttendanceCode] = useState("");
  const { id } = useParams();
  const location = useLocation()
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  const fetchStudentById = async (id) => {
    try {
      const response = await axios.get(
        `https://localhost:3500/students/student/${id}`
      );
      //https://sams-backend-1.onrender.com
      console.log(response.data); // This will log the student's details
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student:", error.response.data);
      return null;
    }
  };
  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
  }, [id]);
  const [sendLogout, { isSuccess, isError, error }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);
  const handleSubmit = async (e) => {
    console.log("submitted", attendanceCode, id);
    if (attendanceCode && id) {
      try {
        await updateAttendanceTab({ id, attendanceCode });
        onClose()
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    if(isSuccessAttendanceTab){
      navigate(`/student/${id}`)
      setAttendanceCode('')
    };
  }, [navigate, isSuccessAttendanceTab]);
  useEffect(() => {
    document.body.classList.add("bg-color");
  }, []);
  const [display, setDisplay] = useState("none");

  const timeTable = () =>{
    navigate(`/student/${id}/timetable`)
    setDisplay("none")
  }

  const home = () =>{
    navigate(`/student/${id}`)
    setDisplay("none")
  }

  return (
    <div>
      <Grid templateColumns={"repeat(6, 1fr)"}>
        <Box display={{ base: "none", lg: "grid", xl: "grid" }}>
          <GridItem
            as={"aside"}
            colSpan={{ base: "0", lg: "2", xl: "1" }}
            minHeight={"100vh"}
            borderRight={"2px solid black"}
          >
            <Flex mt={"60px"} ml={"10px"}>
              <Text fontWeight={"extrabold"} fontSize={"2xl"}>
                Hello! {student?.lastname}
              </Text>
            </Flex>
            <Flex justify={"center"}>
              <List spacing={10} mt={"70px"} cursor={"pointer"}>
                <ListItem fontWeight={"bold"} cursor={"pointer"} onClick={home} pl={2} color={location.pathname === `/student/${id}` ? "red" : "initial"}>
                  <ListIcon as={MdHome} boxSize={5} />
                  Home
                </ListItem>
                        <ListItem fontWeight={"bold"} onClick={timeTable} color={location.pathname === `/student/${id}/timetable` ? "red" : "initial"} cursor={"pointer"} pl={2}>
                          <ListIcon as={MdGridOn} boxSize={5} />
                          Time Table
                        </ListItem>
                      
                <ListItem fontWeight={"bold"} cursor={"pointer"} pl={2}>
                  <ListIcon as={MdSettings} boxSize={5} />
                  Setting
                </ListItem>
                <ListItem fontWeight={"bold"} cursor={"pointer"} pl={2}>
                  <ListIcon as={MdContactSupport} boxSize={5} />
                  Support and Help
                </ListItem>
                <ListItem>
                  <Button colorScheme="red" p={"10px"} w={"75%"}>
                    Logout
                  </Button>
                </ListItem>
              </List>
            </Flex>
          </GridItem>
        </Box>
        <Box
          display={display}
          pos={"fixed"}
          zIndex={10}
          bgColor={"white"}
          w={"250px"}
          mt={"70px"}
        >
          <GridItem
            as={"aside"}
            colSpan={{ base: "0", lg: "2", xl: "1" }}
            minHeight={"100vh"}
            borderRight={"2px solid black"}
          >
           
            <Flex justify={"center"}>
              <List spacing={10} mt={"70px"} cursor={"pointer"}>
                <ListItem fontWeight={"bold"} cursor={"pointer"} pl={2} onClick={home} color={location.pathname === `/student/${id}` ? "red" : "initial"}>
                  <ListIcon as={MdHome} boxSize={5} />
                  Home
                  
                </ListItem>
                
                
                <ListItem fontWeight={"bold"} cursor={"pointer"} pl={2} onClick={timeTable} color={location.pathname === `/student/${id}/timetable` ? "red" : "initial"}>
                    <ListIcon as={MdGridOn} boxSize={5} />
                          Time Table
                 </ListItem>
                
                <ListItem fontWeight={"bold"} cursor={"pointer"} pl={2}>
                  <ListIcon as={MdSettings} boxSize={5} />
                  Setting
                </ListItem>
                <ListItem fontWeight={"bold"} cursor={"pointer"} pl={2}>
                  <ListIcon as={MdContactSupport} boxSize={5} />
                  Support and Help
                </ListItem>
                <ListItem>
                  <Button
                    colorScheme="red"
                    p={"10px"}
                    w={"75%"}
                    onClick={sendLogout}
                  >
                    Logout
                  </Button>
                </ListItem>
              </List>
            </Flex>
          </GridItem>
        </Box>
        <GridItem as={"main"} colSpan={{ base: "6", lg: "5", xl: "5" }}>
          <Flex borderBottom={"1px solid grey"} p={"10px"} align={"center"} backgroundColor={'white'} pos={{base:"fixed", lg:'relative',xl:'relative'}} zIndex={5} width="100%" >
            <Box
              display={{ base: "flex", md: "flex", lg: "none", xl: "none" }}
              mr={"0px"}
              zIndex={2000}
            >
              <Hamburger
                rounded
                direction="right"
                duration={0.5}
                onToggle={(toggled) => {
                  if (toggled) {
                    setDisplay("grid");
                  } else {
                    setDisplay("none");
                  }
                }}
                size={20}
              />
            </Box>

            <Box ml={{ base: "10px", lg: "20px", xl: "25px" }} w={{base:'10%', xl:'5%'}}>
              <img src={logo} alt="logo" />
            </Box>
            <Spacer />
            <Flex
              align={"center"}
              gap={4}
              mr={{ base: "10px", md: "50px", lg: "130px", xl: "150px" }}
            >
              
              <Tooltip
                hasArrow
                label="Join attendance"
                bg={"white"}
                color={"black"}
                p={"10px"}
              >
                <IconButton
                  variant={"ghost"}
                  colorScheme="white"
                  icon={<AddIcon />}
                  onClick={onOpen}
                />
              </Tooltip>

              <Wrap>
                <WrapItem>
                  <Avatar
                    name={`${student?.firstname} ${student?.lastname}`}
                    src={`https://yoursams.pipeops.app/${student?.pic}`}
                  />
                </WrapItem>
              </Wrap>
            </Flex>
          </Flex>
          <Outlet />
        </GridItem>
      </Grid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join an attendance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={"10px"}>
              Ask your lecturer for the course attendance tab, then enter it
              below:
            </Text>
            <Input
              mb={"10px"}
              placeholder="attendance code"
              value={attendanceCode}
              onChange={(e) => setAttendanceCode(e.target.value)}
            />
            <Text>
              If you have an issue joining the attendance, go to the{" "}
              <Link to="/about" style={{ color: "blue" }}>
                Help guide
              </Link>
            </Text>
          </ModalBody>

          <ModalFooter>
            {!isLoadingAttendanceTab?<Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>:
            <Button colorScheme="blue" mr={3} isLoading>
              loading
            </Button>
            }
            
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
