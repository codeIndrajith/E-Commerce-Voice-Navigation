import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Image,
  SimpleGrid,
  Text,
  Divider,
  Button,
  IconButton,
  useDisclosure,
  useToast,
  background,
} from '@chakra-ui/react';
import { Favorite, FavoriteBorder, Info } from '@mui/icons-material';
import StarRatings from 'react-star-ratings';

import Comment from '../components/Comment';
import ReviewModal from '../components/ReviewModal';
import { useCartContext } from '../contexts/CartContext';
import { useUserContext } from '../contexts/UserContext';
import useGetFavoriteStatus from '../hooks/useGetFavoriteStatus';
import { getProductById } from '../services/ProductServices';
import { addFavorite, deleteFavorite } from '../services/UserServices';
import { getCommentByProductId } from '../services/CommentServices';
import { getRatingByProductId } from '../services/RatingServices';
import { getRatingByOwnerId } from '../services/RatingServices';
import useGetUserHaveThis from '../hooks/useGetUserHaveThis';
import { getOrdersByUserId } from '../services/OrderServices';
import Voice from '../components/Voice';

const Product = () => {
  const toast = useToast();
  const location = useLocation();
  const { cart, setCart, refresh, setRefresh } = useCartContext();
  const { currentUser } = useUserContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [status] = useGetFavoriteStatus(currentUser, location.state.productId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [product, setProduct] = useState('');
  const [shipingLocations, setShipingLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [inCart, setInCart] = useState(false);
  const [amount, setAmount] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies(['cart']);
  const [have] = useGetUserHaveThis(currentUser, location.state.productId);

  useEffect(() => {
    setIsFavorite(status);
    setSelectedLocation('Sri Lanka');

    getProductById(location.state.productId)
      .then((result) => {
        setProduct(result.product);
        setShipingLocations(result.product.shipingLocations);
      })
      .catch((err) => console.log(err));

    getRatingByProductId(location.state.productId)
      .then((result) => {
        var star = 0;
        result.ratings.forEach((r) => {
          star += r.rating;
        });
        setRatings(star / result.ratings.length || 0);
        setRatingCount(result.ratings.length);
      })
      .catch((err) => console.log(err));

    getCommentByProductId(location.state.productId)
      .then((result) => {
        setComments(result.comment);
      })
      .catch((err) => console.log(err));

    cart.forEach((item) => {
      if (item.id === location.state.productId) {
        setInCart(true);
        setAmount(item.amount);
      }
    });
  }, [location.state.productId, status, cart]);

  const onClickFavorite = () => {
    if (isFavorite) {
      deleteFavorite(currentUser, location.state.productId);
      setIsFavorite(false);
    } else {
      addFavorite(currentUser, location.state.productId);
      setIsFavorite(true);
    }
  };

  const onClickAddCart = () => {
    if (selectedLocation !== '') {
      const currentIndex = cart.findIndex(
        (item) => item.id === location.state.productId
      );
      if (currentIndex >= 0) {
        setCart((prevCart) => {
          const updatedCart = [...prevCart];
          updatedCart[currentIndex].amount += 1;
          updatedCart[currentIndex].price =
            product.price * updatedCart[currentIndex].amount;
          return updatedCart;
        });
        setAmount(amount + 1);
        setCookie('cart', cart, { path: '/' });
      } else {
        setCart((prevCart) => [
          ...prevCart,
          {
            id: location.state.productId,
            amount: 1,
            price: product.price,
          },
        ]);
        setCookie('cart', cart, { path: '/' });
      }
      setRefresh(!refresh);
    } else {
      toast({
        title: 'Error!',
        description: 'You must choose a shipping location.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const onClickRemoveCart = () => {
    const currentIndex = cart.findIndex(
      (item) => item.id === location.state.productId
    );
    if (currentIndex >= 0) {
      setCart((prevCart) => {
        const updatedCart = [...prevCart];
        if (updatedCart[currentIndex].amount === 1) {
          updatedCart.splice(currentIndex, 1);
        } else {
          updatedCart[currentIndex].price -=
            product.price / updatedCart[currentIndex].amount;
          updatedCart[currentIndex].amount -= 1;
        }
        return updatedCart;
      });
      setAmount(amount - 1);
      setCookie('cart', cart, { path: '/' });
    }
  };

  const onClickWrite = () => {
    if (have) {
      onOpen();
    } else {
      toast({
        title: 'Error!',
        description: 'You need to purchase this to write a review.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box p={{ base: 3, md: 10 }}>
        <Box display="flex" justifyContent="center">
          <SimpleGrid width={1200} columns={{ base: 1, md: 2 }}>
            <Image src={product.imageUrl} />
            <Box p={3} maxWidth={600}>
              <Text fontWeight={200}>
                Product Id: {location.state.productId}
              </Text>
              <Text fontSize={30}>{product.name}</Text>
              <Box display="flex" alignItems="center" mt={2}>
                <StarRatings
                  starDimension={'20'}
                  starSpacing={'2'}
                  rating={ratings}
                  starRatedColor="#FFD700"
                  numberOfStars={5}
                  name="rating"
                />
                <Text fontSize={16} fontWeight={500}>
                  {' '}
                  | {ratingCount} reviews
                </Text>
              </Box>
              <Text
                mt={5}
                mb={3}
                fontSize={28}
                fontWeight={400}
                color="facebook.500"
              >
                Price : <b> {product.price}$ </b>{' '}
              </Text>
              <Divider />
              {/* <Text mt={3} fontSize={20} fontWeight={500}>
                Shiping Locations
              </Text>
              <Box mt={3} display="flex">
                {shipingLocations.map((location, index) => {
                  return (
                    <Button
                      key={index}
                      onClick={() => setSelectedLocation(location)}
                      me={3}
                      colorScheme="facebook"
                      variant={
                        selectedLocation === location ? "solid" : "outline"
                      }
                      width={{ base: "60px", sm: "70px", lg: "85px" }}
                      height={{ base: "30px", sm: "40px", lg: "50px" }}
                    >
                      {location}
                    </Button>
                  );
                })}
              </Box> */}
              <Box mt={3}>
                <Text fontSize={24} fontWeight={500}>
                  Description
                </Text>
                <Box mt={3}>{product.description}</Box>
              </Box>
              <Divider />
              <Box
                mt={10}
                mb={5}
                display="flex"
                flexDirection={{ base: 'column', sm: 'row' }}
              >
                {inCart ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    width={{ base: '100%', sm: '40%' }}
                  >
                    <Button
                      onClick={onClickRemoveCart}
                      disabled={amount === 0}
                      colorScheme="facebook"
                    >
                      -
                    </Button>
                    <Text
                      fontSize={25}
                      px={2}
                      width={{ base: '100%', sm: '60%' }}
                      textAlign="center"
                    >
                      {amount}
                    </Text>
                    <Button onClick={onClickAddCart} colorScheme="facebook">
                      +
                    </Button>
                  </Box>
                ) : (
                  <Button
                    onClick={onClickAddCart}
                    my={1}
                    me={{ base: 0, md: 2 }}
                    maxWidth={530}
                    colorScheme="facebook"
                    height={10}
                    width="100%"
                  >
                    ADD TO CART
                  </Button>
                )}
                <IconButton
                  icon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                  onClick={onClickFavorite}
                  ml={1}
                  my={1}
                  colorScheme="facebook"
                  variant="outline"
                  height={10}
                  width="50px"
                  textAlign="center"
                  display={{ base: 'none', sm: 'block' }}
                />
                <Button
                  my={1}
                  colorScheme="facebook"
                  variant="outline"
                  display={{ base: 'block', sm: 'none' }}
                  height={10}
                  width="100%"
                >
                  {' '}
                  ADD TO FAVORITE
                </Button>
              </Box>
              <Divider />
            </Box>
          </SimpleGrid>
        </Box>
        <Box
          maxWidth={1200}
          flexDirection="column"
          p={{ base: 3, md: 0 }}
          marginX="auto"
        >
          <Text mt={10} mb={3} fontSize={40} fontWeight={300}>
            User Reviews
          </Text>
          <Box
            width="100%"
            display="flex"
            justifyContent="space-between"
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="center"
            backgroundColor="whitesmoke"
            borderRadius="4px"
            px={2}
            py={5}
            mb={10}
          >
            <Box>
              <Box display="flex">
                <StarRatings
                  starDimension={'20'}
                  starSpacing={'2'}
                  rating={ratings}
                  starRatedColor="#FFD700"
                  numberOfStars={5}
                  name="rating"
                />
                <Text fontSize={16} fontWeight={500}>
                  {' '}
                  | {ratingCount} reviews
                </Text>
              </Box>
              <Text my={3} display="flex" alignItems="center">
                <Info sx={{ fontSize: '16px', mr: 1 }} /> You must have
                purchased the product for write a review.{' '}
              </Text>
            </Box>
            <Button
              ml={2}
              mr={{ base: 0, md: 5 }}
              height={50}
              colorScheme="facebook"
              onClick={onClickWrite}
            >
              Write a Review
            </Button>
          </Box>
          <h1
            style={{
              background: 'linear-gradient(135deg, #3498db, #8e44ad)',
              fontSize: '1.6rem',
              color: 'white',
              padding: '20px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            Feedbacks
          </h1>
          <div
            style={{
              padding: '30px',
              marginTop: '20px',
            }}
          >
            {comments.map((comment) => {
              return (
                <Comment
                  key={comment._id}
                  authorId={comment.author}
                  commentText={comment.comment}
                  createdAt={comment.createdAt}
                />
              );
            })}
          </div>
        </Box>
      </Box>
      <ReviewModal
        isOpen={isOpen}
        onClose={onClose}
        productId={location.state.productId}
      />
      <Voice prodId={location.state.productId} ratingCount={ratingCount} />
    </>
  );
};

export default Product;
