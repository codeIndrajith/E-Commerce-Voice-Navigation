import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  TableContainer,
  Button,
  Image,
  useToast,
  Text,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import { Edit } from '@mui/icons-material';
import { useUserContext } from '../contexts/UserContext';
import ReviewModal from '../components/ReviewModal';
import { getUserData } from '../services/RatingServices';
// import { deleteComment } from '../services/CommentServices';
import StarRatings from 'react-star-ratings';

const Reviews = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ratings, setRatings] = useState([]);
  const [prodID, setProdID] = useState('');
  const { currentUser } = useUserContext();
  const toast = useToast();

  useEffect(() => {
    getUserData(currentUser)
      .then((result) => {
        setRatings(result.ratings);
      })
      .catch((err) => console.log(err));
  }, [currentUser]);

  // const onClickDelete = (id) => {
  //   deleteRating(id).then((result) => {
  //     if (result.status) {
  //       toast({
  //         title: 'Error!',
  //         description: 'Somethings went wrong.',
  //         status: 'error',
  //         duration: 2000,
  //         isClosable: true,
  //       });
  //     } else {
  //       deleteComment(id).then((result) => {
  //         if (result.status) {
  //           toast({
  //             title: 'Error!',
  //             description: 'Somethings went wrong.',
  //             status: 'error',
  //             duration: 2000,
  //             isClosable: true,
  //           });
  //         } else {
  //           toast({
  //             title: 'Success!',
  //             description: 'Your review was deleted.',
  //             status: 'success',
  //             duration: 2000,
  //             isClosable: true,
  //           });
  //           onClose(true);
  //         }
  //       });
  //     }
  //   });
  // };

  const onClickEdit = (id) => {
    setProdID(id);
    onOpen(true);
  };

  if (ratings.length > 0) {
    return (
      <Box>
        <TableContainer p={3}>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Image</Th>
                <Th>Review ID</Th>
                <Th>Product ID</Th>
                <Th>PRoduct Name</Th>
                <Th>Description</Th>
                <Th>Rating</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ratings.map((rating, index) => (
                <Tr key={index}>
                  <Td>
                    <Image width={70} height={100} src={rating.for.imageUrl} />
                  </Td>
                  <Td>{rating._id}</Td>
                  <Td>{rating.for._id}</Td>
                  <Td>{rating.for.name}</Td>
                  <Td>{rating.for.description}</Td>
                  <Td>
                    <StarRatings
                      starDimension={'20'}
                      starSpacing={'2'}
                      rating={rating.rating}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      name="rating"
                    />
                  </Td>
                  <Td>
                    <Button
                      onClick={() => onClickEdit(rating.for._id)}
                      colorScheme="facebook"
                    >
                      <Edit />
                    </Button>
                    {/* <Button
                      onClick={() => onClickDelete(rating._id)}
                      colorScheme="red"
                    >
                      <Delete />
                    </Button> */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <ReviewModal isOpen={isOpen} onClose={onClose} productId={prodID} />
      </Box>
    );
  } else {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        my={10}
        p={5}
      >
        <Heading textAlign="center" fontSize={30} mt={8}>
          You have not Added any Reviews!!
        </Heading>
        <Text textAlign="center" fontSize={24} mt={3} fontWeight={300}>
          You haven't added any reviews to products. Add reviews to products you
          brought to so others can see.
        </Text>
      </Box>
    );
  }
};

export default Reviews;
