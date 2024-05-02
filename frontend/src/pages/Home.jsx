import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Container,
  SimpleGrid,
  Image,
  CircularProgress,
  Button,
} from "@chakra-ui/react";

import Carousel from "../components/Carousel";
import { useSearchContext } from "../contexts/SearchContext";
import { getAllMiniImages } from "../services/ImageServices";
import searchItemIcon from "../assets/searchItem.png";
import saveMoneyIcon from "../assets/saveMoney.png";
import saveTimeIcon from "../assets/saveTime.png";

import Voice from "../components/Voice";
import recommend from "@algolia/recommend";
import { useTrendingItems } from "@algolia/recommend-react";
import ProductsCard from "../components/ProductsCard";

const recommendClient = recommend(
  "XXBHHDNRWO",
  "aabbdcbe856c4e7297a648a06abb42f9"
);

const indexName = "vcart";

const Home = () => {
  useEffect(() => {
    getAllMiniImages().then((result) => {
      setMiniImages(result.miniImages);
    });
  }, []);
  const navigate = useNavigate();
  const { setSearch } = useSearchContext();
  const [miniImages, setMiniImages] = useState([]);

  const { recommendations } = useTrendingItems({
    recommendClient,
    indexName,
  });

  const onClickImage = () => {
    setSearch("a");
    navigate("/search");
  };

  return (
    <Box>
      <Flex justifyContent="center" mb={8}>
        <Carousel className="carousel" />
      </Flex>

      <Flex justifyContent="center" mb={8}>
        <Voice />
      </Flex>

      <Text
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight="bold"
        mb={4}
        color="green.800"
        fontFamily="sans-serif"
        textAlign="center"
        textTransform="uppercase"
        borderColor="green.500"
        pb={2}
      >
        How does Vcart work ?
      </Text>
      <Box bg="blue.100" py={8} textAlign="center">
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "column", lg: "row" }}
          justifyContent="center"
          alignItems="center"
          gap={{ sm: "15px", md: "30px", lg: "80px" }}
          ml="30px"
        >
          <Box
            width="360px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <img style={{ width: "40%" }} src={searchItemIcon} alt="" />
            <h4 style={{ fontSize: "30px", fontWeight: "800" }}>
              Search for items
            </h4>
            <p>
              Discover where you can find specific items and compare prices
              effortlessly.
            </p>
          </Box>
          <Box
            width="360px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <img style={{ width: "40%" }} src={saveMoneyIcon} alt="" />
            <h4 style={{ fontSize: "30px", fontWeight: "800" }}>
              Find out the best prices
            </h4>
            <p>
              Explore and compare prices from various sources to ensure you get
              the best deals
            </p>
          </Box>
          <Box
            width="360px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <img style={{ width: "40%" }} src={saveTimeIcon} alt="" />
            <h4 style={{ fontSize: "30px", fontWeight: "800" }}>
              Save time for money
            </h4>
            <p>
              Optimize your shopping experience by saving time and money through
              efficient price comparisons
            </p>
          </Box>
        </Box>
      </Box>

      <Box textAlign="center" mt="50px">
        <Text
          fontSize={{ base: "3xl", md: "4xl" }}
          fontWeight="bold"
          mb={4}
          color="green.800"
          fontFamily="sans-serif"
          textAlign="center"
          textTransform="uppercase"
          borderColor="green.500"
          pb={2}
        >
          Trending Items
        </Text>
        <Box p={{ base: 3, md: 10 }}>
          {recommendations && (
            <SimpleGrid minChildWidth={280} gap={3} spacingX={5}>
              {recommendations &&
                recommendations.map((product, index) => {
                  return (
                    <ProductsCard key={index} productId={product.objectID} />
                  );
                })}
            </SimpleGrid>
          )}
          {recommendations.length === 0 && (
            <>
              <Box my={20} display="flex" justifyContent="center" width="100%">
                <CircularProgress isIndeterminate color="facebook.500" />
              </Box>
              <Box my={20} display="flex" justifyContent="center" width="100%">
                <CircularProgress isIndeterminate color="facebook.500" />
              </Box>
            </>
          )}
          <Button padding="20px" backgroundColor="skyblue">
            <Link to="/search">Show More</Link>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
