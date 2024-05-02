import * as React from "react";
import {
  Container,
  Box,
  SimpleGrid,
  Stack,
  Text,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/react";

// Import icons
import {
  FaGithub,
  FaDev,
  FaLinkedin,
  FaQuora,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <Container maxW="w-full" p={{ base: 5, md: 10 }}>
      <SimpleGrid
        flexDirection="column-reverse"
        gridTemplateColumns={["1fr", "1fr", "1fr 1fr", "1fr 1fr"]}
        borderTopWidth={2}
        mt="30px"
        borderTopColor="gray.900"
        pt="20px"
      >
        <Box>
          <SimpleGrid columns={[1, 1, 3, 3, 3, 3]}>
            <Stack mb={["10px", "10px", 0, 0]}>
              <span style={{ color: "gray" }}>Contact us</span>
              <span style={{ color: "gray" }}>Contribute</span>
              <span style={{ color: "gray" }}>Open source projects</span>
            </Stack>
            <Stack>
              <span>
                <Popover placement="top">
                  <PopoverTrigger>
                    <span
                      _focus={{ outline: "none", boxShadow: "none" }}
                      fontWeight={500}
                      color="gray.500"
                      cursor="pointer"
                      _hover={{ color: "gray.600", textDecoration: "none" }}
                      style={{ color: "gray" }}
                    >
                      Social Accounts
                    </span>
                  </PopoverTrigger>
                  <Portal>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <Stack
                          as="footer"
                          isInline
                          spacing={[1, 2]}
                          justifyContent="center"
                          alignItems="center"
                          cursor="pointer"
                        >
                          <span>
                            <FaGithub />
                            Github Account
                          </span>
                          <span>
                            <FaDev />
                            Dev Account
                          </span>
                          <span>
                            <FaLinkedin />
                            LinkedIn Account
                          </span>
                          <span>
                            <FaTwitter />
                            Twitter Account
                          </span>
                          <span>
                            <FaQuora />
                            Quora Account
                          </span>
                        </Stack>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover>
              </span>

              <span style={{ color: "gray" }}>Sponsor</span>
              <span style={{ color: "gray" }}>FAQs</span>
            </Stack>
            <Stack>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="email"
                  placeholder="Enter Email.."
                  style={{
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    marginRight: "10px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "#007bff",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Subscribe
                </button>
              </div>
            </Stack>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Footer;
