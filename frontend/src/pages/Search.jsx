import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  Button,
  Select,
  Text,
  Icon,
  Heading,
} from '@chakra-ui/react';

import ProductsCard from '../components/ProductsCard';
import FilterMenu from '../components/FilterMenu';
import {
  getProductByCategoryId,
  getProductBySearch,
} from '../services/ProductServices';
import { useSearchContext } from '../contexts/SearchContext';
import { SearchOff } from '@mui/icons-material';
import Voice from '../components/Voice';

const Search = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { search, canSearch } = useSearchContext();
  const [openFilter, setOpenFilter] = useState(true);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    if (state !== null) {
      getProductByCategoryId(state.categoryId).then((result) => {
        setProducts(result.products);
      });
      setSortBy('recommended');
    }
    if (
      search !== '' &&
      search !== ' ' &&
      search !== null &&
      search !== undefined &&
      canSearch
    ) {
      getProductBySearch(search).then((result) => {
        setProducts(result.products);
      });
      setSortBy('recommended');
    }
  }, [state, search, canSearch]);

  const handleChange = (e) => {
    setSortBy(e.target.value);
    if (e.target.value === 'lowest') {
      sortByPriceAsc();
    } else if (e.target.value === 'highest') {
      sortByPriceDesc();
    }
  };

  const sortByPriceAsc = () => {
    setProducts(products.sort((a, b) => a.price - b.price));
  };

  const sortByPriceDesc = () => {
    setProducts(products.sort((a, b) => b.price - a.price));
  };

  return (
    <Box px={{ base: 2, sm: 3, md: 5 }} my={3} py={3} backgroundColor="white">
      <Box
        width="100%"
        height="auto"
        display="flex"
        justifyContent="space-between"
        py={5}
      >
        <Button
          colorScheme="facebook"
          variant="outline"
          backgroundColor="#fff"
          onClick={() => setOpenFilter(!openFilter)}
        >
          {openFilter ? 'Hide' : 'Show'} Filter
        </Button>
        <Select
          colorScheme="facebook"
          onChange={handleChange}
          value={sortBy}
          backgroundColor="#fff"
          width="170px"
        >
          <option value="recommended">Best Sellers</option>
          <option value="lowest">Lowest Price</option>
          <option value="highest">Highest Price</option>
        </Select>
      </Box>
      <Box
        display="flex"
        flexDirection={{ base: 'column' }}
        gap={2}
        width="100%"
      >
        <Box width="100%" marginBottom={{ base: 6, md: 20, lg: 6 }}>
          <FilterMenu
            openFilter={openFilter}
            columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }}
            setProducts={setProducts}
            setSortBy={setSortBy}
            width="100%"
          />
        </Box>
        <Box width="100%">
          <SimpleGrid minChildWidth={280} gap={3} spacingX={5}>
            {products &&
              products.map((product, index) => {
                return <ProductsCard key={index} productId={product._id} />;
              })}
            {products.length === 0 && (
              <Box display="flex" justifyContent="start">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  mt={10}
                  p={3}
                >
                  <Icon color="#314E89" fontSize={100} as={SearchOff} />
                  <Heading textAlign="center" fontSize={30} mt={8}>
                    Sorry, we couldn't find what you are looking for.
                  </Heading>
                  <Text
                    textAlign="center"
                    fontSize={24}
                    mt={2}
                    fontWeight={300}
                  >
                    But don’t give up! Check out our bestsellers and find
                    something for you!
                  </Text>
                  <Button
                    variant="solid"
                    fontSize={20}
                    px={10}
                    mt={10}
                    colorScheme="facebook"
                    onClick={() => navigate('/')}
                  >
                    Start Shopping
                  </Button>
                </Box>
              </Box>
            )}
          </SimpleGrid>
        </Box>
      </Box>
      <Voice />
    </Box>
  );
};

export default Search;
