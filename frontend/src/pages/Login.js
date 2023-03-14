import "./Login.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  StackDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { UserState } from "../Context/UserProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const showPassword = () => {
    setShow(show ? false : true);
  };

  const { domain } = UserState();

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${domain}/api/v1/auth/login/`, {
        email,
        password,
      });
      const userData = JSON.stringify(data.user);
      localStorage.setItem("user", userData);
      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (error) {
      toast({
        title: error.message,
        description: "Recheck the fields",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/home");
  }, []);

  return (
    <div className="Login">
      <Container
        bgColor="blackAlpha.600"
        backdropFilter="blur(20px)"
        padding="20px 1.5rem"
        borderRadius="20px"
      >
        <VStack
          color="white"
          divider={<StackDivider borderStyle="revert" />}
          spacing={4}
          align="stretch"
        >
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              value={email}
              type="email"
              placeholder="Enter Your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                value={password}
                placeholder="password"
                type={show ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.85rem"
                  size="sm"
                  onClick={showPassword}
                  color={show ? "green" : "black"}
                >
                  Show
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            width="140px"
            colorScheme="green"
            alignSelf="center"
            isLoading={loading}
            spinner={<Spinner size="md" color="white" />}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </VStack>
      </Container>
    </div>
  );
};

export default Login;
