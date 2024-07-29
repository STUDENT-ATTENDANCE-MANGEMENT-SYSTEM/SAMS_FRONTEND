import { Card, CardBody, CardFooter, CardHeader, Divider, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'

export default function InsightInfo() {
  return (
    <div>
        <SimpleGrid
            columns={{ base: "1", lg: "3", xl: "3" }}
            //mb={"2rem"}
            mx={"20px"}
            gap={"3"}
            mt={"30px"}
          >
            <Card mt={'6em'} >
                
                <CardBody>
                <Text>Number of Attendance</Text>
                <Text>11</Text>
                </CardBody>
                <Divider/>
                <CardFooter></CardFooter>
            </Card>
            <Card mt={'6em'} >
                
                <CardBody>
                <Text>Number of Attendance</Text>
                <Text>11</Text>
                </CardBody>
                <Divider/>
                <CardFooter></CardFooter>
            </Card>
          </SimpleGrid>
    </div>
  )
}
