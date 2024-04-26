import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {
  Box,
  Image,
  Text,
  Icon,
  Button,
  useDisclosure,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { Favorite, RateReview, ShoppingCart } from '@mui/icons-material';

import { useCartContext } from '../contexts/CartContext';
import { useUserContext } from '../contexts/UserContext';
import { getProductById } from '../services/ProductServices';
import { addFavorite, deleteFavorite } from '../services/UserServices';
import useGetFavoriteStatus from '../hooks/useGetFavoriteStatus';
import ReviewModal from './ReviewModal';

const ProductsCard = ({ productId, isDelivered }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies, setCookie, removeCookie] = useCookies(['cart']);
  const { cart, setCart, refresh, setRefresh } = useCartContext();
  // const [cart, setCart] = useState([]);
  const { currentUser } = useUserContext();
  const [status] = useGetFavoriteStatus(currentUser, productId);
  const navigate = useNavigate();
  const toast = useToast();

  const [product, setProduct] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (productId && cart) {
      setIsFavorite(status);
      getProductById(productId).then((result) => {
        setProduct(result.product);
      });
      const foundItem = cart.find((item) => item.id === productId);
      if (foundItem) {
        setInCart(true);
        setAmount(foundItem.amount);
      }
    }
  }, [productId, status, cart]);

  const onClickFavorite = () => {
    if (!isFavorite) {
      addFavorite(currentUser, productId)
        .then(() => setIsFavorite(true))
        .catch((error) => {
          console.log(error);
          toast({
            title: 'Error Add Favorites',
            description: 'You must be logged in',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        });
    } else {
      deleteFavorite(currentUser, productId)
        .then(() => setIsFavorite(false))
        .catch((error) => console.log('Error deleting favorite:', error));
    }
  };

  const onClickAddCart = () => {
    const currentIndex = cart.findIndex((item) => item.id === productId);
    if (currentIndex >= 0) {
      cart[currentIndex].amount += 1;
      cart[currentIndex].price = product.price * cart[currentIndex].amount;
      setAmount(amount + 1);
      setCookie('cart', cart, { path: '/' });
    } else {
      setCart([
        ...cart,
        {
          id: productId,
          amount: 1,
          price: product.price,
        },
      ]);
      setCookie('cart', cart, { path: '/' });
    }
    setRefresh(!refresh);
  };

  const onClickRemoveCart = () => {
    const currentIndex = cart.findIndex((item) => item.id === productId);
    if (currentIndex >= 0) {
      if (cart[currentIndex].amount === 1) {
        const newCart = [];
        cart.forEach((item, index) => {
          index !== currentIndex && newCart.push(item);
        });
        if (cart.length === 1) {
          removeCookie('cart', { path: '/' });
        } else {
          setCookie('cart', newCart, { path: '/' });
        }
        setInCart(false);
        setCart(newCart);
        setAmount(amount - 1);
      } else {
        cart[currentIndex].price -=
          cart[currentIndex].price / cart[currentIndex].amount;
        cart[currentIndex].amount -= 1;
        setAmount(amount - 1);
        setCookie('cart', cart, { path: '/' });
      }
    }
    setRefresh(!refresh);
  };

  return (
    <>
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        position="relative"
        border="1px solid #e2e8f0"
        borderRadius="md"
        overflow="hidden"
        transition="0.3s"
        _hover={{
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          borderColor: 'gray.300',
        }}
      >
        <Tooltip
          label={
            <Box>
              <Text
                fontWeight={500}
                fontSize={20}
                mb={2}
                color="#0c14e3"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {product.name}
              </Text>
              <Text fontSize={14} mb={3}>
                {product.description}
              </Text>
              <Text
                fontWeight={500}
                fontSize={18}
                backgroundColor="#eeae22"
                display="flex"
                justifyContent="center"
                borderRadius="20px"
                alignItems="center"
                padding={2}
              >
                {product.price} $
              </Text>
            </Box>
          }
          aria-label="product-info"
          bg="#d2d9d7"
          color="black"
          placement="bottom-start"
          padding={4}
          borderRadius={3}
        >
          <Image
            width="100%"
            height="auto"
            objectFit="cover"
            src={product.imageUrl}
            cursor="pointer"
            onClick={() =>
              navigate(`/product/${product._id}`, {
                state: { productId: product._id },
              })
            }
          />
        </Tooltip>
        <Box
          px={4}
          py={3}
          borderTop="1px solid #e2e8f0"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tooltip
            label="Add to Favorites"
            aria-label="add-to-favorites"
            bg="white"
            color="black"
            placement="top"
          >
            <Icon
              as={Favorite}
              fontSize={24}
              color={!isFavorite ? 'blackAlpha.400' : 'facebook.500'}
              _hover={{ color: 'facebook.500' }}
              cursor="pointer"
              onClick={onClickFavorite}
            />
          </Tooltip>
          <Tooltip
            label="Add to Cart"
            aria-label="add-to-cart"
            bg="white"
            color="black"
            placement="top"
          >
            <Icon
              as={ShoppingCart}
              fontSize={24}
              color="blackAlpha.400"
              _hover={{ color: 'facebook.500' }}
              cursor="pointer"
              onClick={onClickAddCart}
            />
          </Tooltip>
        </Box>
        {isDelivered && (
          <Tooltip
            label="Write a Review"
            aria-label="write-a-review"
            bg="white"
            color="black"
            placement="top"
          >
            <Icon
              as={RateReview}
              fontSize={24}
              color="blackAlpha.400"
              _hover={{ color: 'facebook.500' }}
              cursor="pointer"
              onClick={onOpen}
            />
          </Tooltip>
        )}
      </Box>
      <ReviewModal isOpen={isOpen} onClose={onClose} productId={productId} />
    </>
  );
};

export default ProductsCard;
