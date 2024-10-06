import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  SimpleGrid,
  Text,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FaUserCheck, FaUsers, FaChartLine } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function InsightInfo() {
  const { lecturerId, id } = useParams();
  const [noOfAttendance, setNoOfAttendance] = useState(null);
  const [averageStudent, setAverageStudent] = useState(null);
  const [student, setStudent] = useState(null);
  const [data, setData] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [errorData, setErrorData] = useState(null);
  const [errorStudent, setErrorStudent] = useState(null);
  const [errorAttendance, setErrorAttendance] = useState(null);
  const [attendanceTabId, setAttendanceTabId] = useState(id);

  useEffect(() => {
    const fetchNoOfAttendance = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3500/attendanceTab/${lecturerId}/insight/getNoOfAttendance`,
          { attendanceTabId }
        );
        setNoOfAttendance(response.data.noOfAttendance);
        console.log(response);
      } catch (err) {
        setErrorAttendance(
          err.response ? err.response.data.message : err.message
        );
      } finally {
        setLoadingAttendance(false);
      }
    };

    fetchNoOfAttendance();
  }, [lecturerId, attendanceTabId]);

  useEffect(() => {
    const fetchAverageStudent = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3500/attendanceTab/${lecturerId}/insight/getAverageNumberOfStudents`,
          { attendanceTabId }
        );
        setAverageStudent(response.data.averageNumberOfStudents);
        console.log(response);
      } catch (err) {
        setErrorStudent(err.response ? err.response.data.message : err.message);
      } finally {
        setLoadingStudent(false);
      }
    };

    fetchAverageStudent();
  }, [lecturerId, attendanceTabId]);

  useEffect(() => {
    const fetchTotalStudent = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3500/attendanceTab/${lecturerId}/insight/getStudentsArray`,
          { attendanceTabId }
        );
        setStudent(response.data.studentsArrayLength);
        console.log(response);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalStudent();
  }, [lecturerId, attendanceTabId]);

  useEffect(() => {
    const fetchStudentArray = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3500/attendanceTab/${lecturerId}/insight/getStudentsArrayLength`,
          { attendanceTabId }
        );
        setData(response.data.studentsArrayLengths);
        console.log(response);
      } catch (err) {
        setErrorData(err.response ? err.response.data.message : err.message);
      } finally {
        setLoadingData(false);
      }
    };

    fetchStudentArray();
  }, [lecturerId, attendanceTabId]);

  if (loading) return <div>Loading...</div>;
  //if (error) return <div>Error: {error}</div>;

  const chartData = {
    labels: data.map((ib, index) => `Label ${index + 1}`), // Replace with actual labels if available
    datasets: [
      {
        label: "Student Data",
        data: data,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Student Data Over Time",
      },
    },
  };

  return (
    <div>
      <SimpleGrid
        columns={{ base: "1", lg: "3", xl: "3" }}
        mx={"20px"}
        gap={"3"}
        mt={{ base: "5em", lg: "7em", xl: "7em" }}
      >
        <Card variant={"outline"} boxShadow={"lg"}>
          <CardHeader>
            <Box display="flex" alignItems="center">
              <Icon as={FaUserCheck} w={6} h={6} mr={2} />
              <Text fontSize="xl" fontWeight="bold">
                Number of Attendance
              </Text>
            </Box>
          </CardHeader>
          <Divider />
          <CardBody>
            <Text fontSize="2xl">{noOfAttendance}</Text>
          </CardBody>
        </Card>

        <Card variant={"outline"} boxShadow={"lg"}>
          <CardHeader>
            <Box display="flex" alignItems="center">
              <Icon as={FaUsers} w={6} h={6} mr={2} />
              <Text fontSize="xl" fontWeight="bold">
                Number of Students
              </Text>
            </Box>
          </CardHeader>
          <Divider />
          <CardBody>
            <Text fontSize="2xl">{student}</Text>
          </CardBody>
        </Card>

        <Card variant={"outline"} boxShadow={"lg"}>
          <CardHeader>
            <Box display="flex" alignItems="center">
              <Icon as={FaChartLine} w={6} h={6} mr={2} />
              <Text fontSize="xl" fontWeight="bold">
                Average Student
              </Text>
            </Box>
          </CardHeader>
          <Divider />
          <CardBody>
            <Text fontSize="2xl">{averageStudent}</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card
        variant={"outline"}
        boxShadow={"lg"}
        mt={"3em"}
        mx={'2em'}
        borderRadius="md"
       
      >
        <CardBody>
          <Box w={'100%'} h={{ base: "300px", md: "400px", lg: "500px",xl:'700px' }}>
            <Line data={chartData} options={chartOptions} />
          </Box>
        </CardBody>
      </Card>
    </div>
  );
}
