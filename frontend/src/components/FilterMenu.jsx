import React, { useEffect } from 'react';
import {
  Box,
  Text,
  Image,
  Button,
  Divider,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RadioGroup,
  Radio,
  Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';

import {
  getProductByColor,
  getProductByCondition,
  getProductByPrice,
  getProductsByQueries,
} from '../services/ProductServices';
import { useSearchContext } from '../contexts/SearchContext';
import groceryImage from '../assets/Grocery.png';

const FilterMenu = ({ openFilter, setProducts, setSortBy }) => {
  const { canSearch, setCanSearch } = useSearchContext();

  const [minPrice, setMinPrice] = useState(30);
  const [maxPrice, setMaxPrice] = useState(250);
  const [condition, setCondition] = useState('all');
  const [color, setColor] = useState('all');

  useEffect(() => {
    setColor('all');
    setCondition('all');
    setMinPrice(30);
    setMaxPrice(250);
  }, [canSearch]);

  const onChangePriceRange = (val) => {
    setCanSearch(false);
    setMinPrice(val[0]);
    setMaxPrice(val[1]);
  };

  const onChangeColor = () => {
    setCanSearch(false);
  };

  const onChangeCondition = (e) => {
    setCanSearch(false);
    setCondition(e.target.value);
  };

  const onClickSearch = () => {
    setSortBy('recommended');
    if (condition !== 'all' && color !== 'all') {
      getProductsByQueries(minPrice, maxPrice, condition, color).then(
        (result) => {
          setProducts(result.products);
        }
      );
    } else if (condition !== 'all' && color === 'all') {
      getProductByCondition(condition, minPrice, maxPrice).then((result) => {
        setProducts(result.products);
      });
    } else if (color !== 'all' && condition === 'all') {
      getProductByColor(color, minPrice, maxPrice).then((result) => {
        setProducts(result.products);
      });
    } else {
      getProductByPrice(minPrice, maxPrice).then((result) => {
        setProducts(result.products);
      });
    }
  };

  return (
    <Box
      display={openFilter ? 'block' : 'none'}
      minHeight={{ base: 500, sm: 700, md: 500 }}
      maxHeight={{ base: 1000, sm: 1200, md: 1000, lg: 750 }}
      p={3}
      backgroundColor="#ccd8db"
    >
      <Box display="flex" flexDirection={{ base: 'column', lg: 'row' }}>
        <Box
          width={{ sm: '100%', md: '100%', lg: '50%' }}
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          // backgroundColor="yellow"
        >
          <Text
            fontSize="40px"
            marginTop={5}
            fontWeight="800"
            fontFamily="initial"
          >
            Find Your Product
          </Text>
          <Image
            width={{ sm: '80%', md: '40%', lg: '80%' }}
            // marginTop="-150px"
            // backgroundColor="yellow"
            src={groceryImage}
          />
        </Box>
        <Box width={{ sm: '100%', md: '100%', lg: '50%' }}>
          <Box px={2}>
            <Text fontSize={20} my={3} fontWeight={500}>
              Price Range
            </Text>
            <RangeSlider
              onChangeEnd={onChangePriceRange}
              defaultValue={[minPrice, maxPrice]}
              max={250}
              min={30}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack bg="facebook.500" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0}>
                <Box color="facebook.500" fontWeight={800}>
                  $
                </Box>
              </RangeSliderThumb>
              <RangeSliderThumb index={1}>
                <Box color="facebook.500" fontWeight={800}>
                  $
                </Box>
              </RangeSliderThumb>
            </RangeSlider>
            <Box
              display="flex"
              my={3}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize={16} fontWeight={600}>
                {minPrice} $ - {maxPrice} $
              </Text>
            </Box>
            <Divider mb={3} />
          </Box>
          <Box mt={3}>
            <Text fontSize={20} mb={3} fontWeight={500}>
              Condition
            </Text>
            <RadioGroup
              display="flex"
              justifyContent="space-around"
              flexDirection={{ base: 'column', md: 'row' }}
              onChange={setCondition}
              onClick={onChangeCondition}
              value={condition}
            >
              <Radio colorScheme="facebook" value="all" fontWeight={600}>
                All
              </Radio>
              <Radio colorScheme="facebook" value="new" fontWeight={600}>
                New
              </Radio>
              <Radio colorScheme="facebook" value="used" fontWeight={600}>
                Used
              </Radio>
            </RadioGroup>
            <Divider my={3} />
          </Box>
          <Box display="flex" flexDirection="column">
            <Text fontSize={20} mb={3} fontWeight={500}>
              Shiping Location
            </Text>
            <Checkbox
              colorScheme="facebook"
              value="Sri_Lanka"
              defaultChecked
              fontWeight={600}
            >
              Sri Lanka
            </Checkbox>
            <Checkbox colorScheme="facebook" value="China" fontWeight={600}>
              China
            </Checkbox>
            <Checkbox colorScheme="facebook" value="UK" fontWeight={600}>
              UK
            </Checkbox>
            <Checkbox colorScheme="facebook" value="USA" fontWeight={600}>
              USA
            </Checkbox>
            <Divider my={3} />
          </Box>
          <Box display="flex" flexDirection="column" pb={3}>
            {/* <Text fontSize={20} mb={3} fontWeight={500}>
              Color
            </Text>
            <RadioGroup
              display="flex"
              flexDirection="column"
              onChange={setColor}
              onClick={onChangeColor}
              value={color}
            >
              <Radio mb={2} colorScheme="facebook" value="all" fontWeight={600}>
                All
              </Radio>
              <Radio mb={2} colorScheme="facebook" value="blue" fontWeight={600}>
                Blue
              </Radio>
              <Radio mb={2} colorScheme="blackAlpha" value="white" fontWeight={600}>
                White
              </Radio>
              <Radio mb={2} colorScheme="green" value="green" fontWeight={600}>
                Green
              </Radio>
              <Radio mb={2} colorScheme="gray" value="black" fontWeight={600}>
                Black
              </Radio>
              <Radio mb={2} colorScheme="red" value="red" fontWeight={600}>
                Red
              </Radio>
            </RadioGroup> */}
            <Button mt={5} colorScheme="facebook" onClick={onClickSearch}>
              Search
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterMenu;
