import React from "react";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import student from "../images/student.png";
import lecturer from "../images/tutor.png";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect } from "react";
import "@fontsource/merriweather/400.css";

export default function Signin() {
  useEffect(() => {
    document.body.classList.add("bg-color");
  }, []);

  return (
    <div>
      <Text
        textAlign={"center"}
        my={"2em"}
        fontSize={{ base: "1.6rem", md: "1.8rem", lg: "2.3rem", xl: "2.4rem" }}
        fontFamily={"body"}
        color={"#213655"}
        px={".7em"}
      >
        Register based on your role
      </Text>
      <Flex
        justify={"center"}
        flexDir={{ base: "column", lg: "row", xl: "row" }}
        gap={5}
        mb={"3em"}
      >
        <NavLink to={"student"}>
          <Flex align={"center"} flexDir={"column"}>
            <Box
              w={{ base: "75%", lg: "50%", xl: "50%" }}
              pb={{ base: ".7em", md: ".9em", lg: "1em", xl: "1em" }}
            >
              <img src={student} alt="student" />
            </Box>
            <Text
              variant={"ghost"}
              color={"#213655"}
              fontSize={{ base: "1rem", md: "1.2rem", lg: "2rem", xl: "2rem" }}
              fontFamily={"body"}
            >
              STUDENT
            </Text>
          </Flex>
        </NavLink>

        <NavLink to={"lecturer"}>
          <Flex align={"center"} flexDir={"column"}>
            <Box
              w={{ base: "75%", lg: "50%", xl: "50%" }}
              pb={{ base: ".7em", md: ".9em", lg: "1em", xl: "1em" }}
            >
              <img src={lecturer} alt="student" />
            </Box>
            <Text
              variant={"ghost"}
              fontSize={{ base: "1rem", md: "1.2rem", lg: "2rem", xl: "2rem" }}
              color={"#213655"}
              fontFamily={"body"}
            >
              LECTURER
            </Text>
          </Flex>
        </NavLink>
      </Flex>
    </div>
  );
}
