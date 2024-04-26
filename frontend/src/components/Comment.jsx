import React, { useEffect, useState } from 'react';
import { Divider, Box, Text } from '@chakra-ui/react';
import moment from 'moment';

import useGetNameById from '../hooks/useGetNameById';
import StarRatings from 'react-star-ratings';
import { getRatingByOwnerId } from '../services/RatingServices';

const Comment = ({ authorId, commentText, createdAt }) => {
  const [name] = useGetNameById(authorId);
  const [author, setAuthor] = useState('');
  const [ratingsByAuthor, setRatingByAuthor] = useState(0);

  useEffect(() => {
    setAuthor(name);
    getRatingByOwnerId(authorId)
      .then((result) => {
        setRatingByAuthor(result.ratings[0].rating || 0);
      })
      .catch((err) => console.log(err));
  }, [name, authorId]);

  return (
    <Box>
      <Divider />
      <Box display="flex" mt={{ base: 5, md: 10 }} fontSize={20}>
        <Text mr={2} fontWeight={600}>
          {author}{' '}
        </Text>
        |
        <Text ml={2} fontWeight={300}>
          {moment(createdAt).format('DD MMMM YYYY')}
        </Text>
      </Box>
      <Text mt={5} mb={{ base: 5, md: 10 }}>
        <StarRatings
          starDimension={'20'}
          starSpacing={'2'}
          rating={parseFloat(ratingsByAuthor)}
          starRatedColor="#FFD700"
          numberOfStars={5}
          name="rating"
        />
        {commentText}
      </Text>
      <Divider />
    </Box>
  );
};

export default Comment;
