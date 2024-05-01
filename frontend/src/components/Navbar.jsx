import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { BiSolidCategory } from 'react-icons/bi';
import {
  Box,
  Text,
  Icon,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  MenuGroup,
  Divider,
} from '@chakra-ui/react';
import {
  Person,
  Favorite,
  ShoppingCart,
  ExitToApp,
  ShoppingBag,
  Report,
  MapsHomeWork,
  Inventory,
  Group,
  Edit,
  Reviews,
} from '@mui/icons-material';

import { getAllGenres } from '../services/GenreServices';
import { useUserContext } from '../contexts/UserContext';
import { useCartContext } from '../contexts/CartContext';
import Hamburger from './Hamburger';
import Dropdown from './Dropdown';
import Searchbar from './Searchbar';
import useGetUserRole from '../hooks/useGetUserRole';
import Wecart from '../assets/wecart.png';

const Navbar = () => {
  const [genres, setGenres] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [isFalse, setIsFalse] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUserContext();
  const { setCart, cart, refresh, setRefresh } = useCartContext();
  const [cookies, removeCookie] = useCookies(['currentUser', 'cart']);
  const [admin] = useGetUserRole(currentUser);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      event.target !== buttonRef.current
    ) {
      setOpen(false);
      setIsFalse(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!currentUser && !cart) {
      navigate('/login');
    }
    getAllGenres().then((result) => {
      setGenres(result.allGenres);
    });
    var count = 0;
    if (cart.length) {
      cart.forEach((item) => {
        if (item.amount) {
          count += item.amount;
        }
      });
    }
    setItemCount(count);
  }, [refresh, cart, cookies.cart, admin, currentUser]);

  const Logout = () => {
    removeCookie('currentUser', { path: '/' });
    removeCookie('cart', { path: '/' });
    setCurrentUser('');
    setCart([]);
    setRefresh(!refresh);
  };

  const handleFavorites = () => {
    if (currentUser) {
      navigate('/favorites');
    } else {
      navigate('/login');
    }
  };

  const handleCategory = () => {
    setIsFalse(!isFalse);
  };

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      // boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
      position="sticky"
      top="0px"
      backgroundColor="#DED7CF"
      py={{ base: 0.5, md: 0.5 }}
      zIndex={500}
    >
      <Box
        display={'flex'}
        flexDirection={{ base: 'column', sm: 'row' }}
        justifyContent="space-between"
        py={{ base: 1, md: 1 }}
        px={{ base: 1, md: 14 }}
        width="100%"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ base: 'space-between', sm: 'start' }}
        >
          <Box className="navbar-logo">
            <img
              src={Wecart}
              onClick={() => navigate('/')}
              alt="wecart"
              className="logo-image"
            />
          </Box>
          <Hamburger base="flex" sm="none" md="none" />
        </Box>
        <Searchbar />
        <Box display={{ base: 'none', md: 'flex' }} alignItems="center" px={2}>
          <Box
            color="facebook.500"
            display="flex"
            flexDirection="column"
            cursor="pointer"
            alignItems="center"
            transition={0.5}
            ref={menuRef}
            _hover={{ color: 'facebook.700' }}
            onClick={() => {
              toggleMenu();
              if (!currentUser) {
                navigate('/login');
              }
            }}
          >
            {currentUser && !admin && (
              <Menu isOpen={open}>
                <Icon fontSize={30} color="inherit" as={Person} />
                <Text color="inherit" fontWeight={500} ref={menuRef}>
                  Account
                </Text>
                <MenuButton />
                <MenuList>
                  <MenuGroup title="Account">
                    <MenuItem onClick={() => navigate('/infos')}>
                      <Person sx={{ marginRight: 2 }} /> My Informations
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/orders')}>
                      <ShoppingBag sx={{ marginRight: 2 }} /> Orders
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/reviews')}>
                      <Reviews sx={{ marginRight: 2 }} /> My Reviews
                    </MenuItem>
                  </MenuGroup>
                  <Divider />
                  <MenuItem onClick={Logout}>
                    <ExitToApp sx={{ marginRight: 2 }} /> Log out
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
            {!currentUser && (
              <>
                <Icon fontSize={30} color="inherit" as={Person} />
                <Text color="inherit" fontWeight={500}>
                  Login
                </Text>
              </>
            )}
            {admin && currentUser && (
              <Menu isOpen={open}>
                <Icon fontSize={30} color="inherit" as={Person} />
                <Text color="inherit" fontWeight={500} ref={menuRef}>
                  Admin
                </Text>
                <MenuButton />
                <MenuList>
                  <MenuGroup title="Admin">
                    <MenuItem onClick={() => navigate('/admin/products')}>
                      <Inventory sx={{ marginRight: 2 }} />
                      Products
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/admin/users')}>
                      <Group sx={{ marginRight: 2 }} />
                      Users
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/admin/categories')}>
                      <Edit sx={{ marginRight: 2 }} />
                      Genres and Categories
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/admin/images')}>
                      <MapsHomeWork sx={{ marginRight: 2 }} />
                      Home Page Images
                    </MenuItem>

                    <MenuItem onClick={() => navigate('/admin/user-reports')}>
                      <Report sx={{ marginRight: 2 }} />
                      User Reports
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/admin/order-reports')}>
                      <Report sx={{ marginRight: 2 }} />
                      Order Reports
                    </MenuItem>

                    <MenuItem onClick={() => navigate('/admin/orders')}>
                      <ShoppingBag sx={{ marginRight: 2 }} />
                      Orders
                    </MenuItem>
                  </MenuGroup>
                  <Divider />
                  <MenuItem onClick={Logout}>
                    <ExitToApp sx={{ marginRight: 2 }} /> Log out
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Box>
          <Box
            color="facebook.500"
            display="flex"
            flexDirection="column"
            cursor="pointer"
            mx="5"
            alignItems="center"
            transition={0.5}
            _hover={{ color: 'facebook.700' }}
            onClick={handleFavorites}
          >
            <Icon fontSize={30} color="inherit" as={Favorite} />
            <Text color="inherit" fontWeight={500}>
              Favorites
            </Text>
          </Box>
          <Box
            color="facebook.500"
            display="flex"
            flexDirection="column"
            cursor="pointer"
            alignItems="center"
            transition={0.5}
            _hover={{ color: 'facebook.700' }}
            onClick={() => navigate('/cart')}
          >
            <Icon fontSize={30} color="inherit" as={ShoppingCart} />
            <Text color="inherit" fontWeight={500}>
              {itemCount > 0 ? `Cart (${itemCount})` : 'Cart'}
            </Text>
          </Box>
        </Box>
        <Hamburger base="none" sm="flex" md="none" />
      </Box>
      <Box
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        py={{ base: 1, md: 1 }}
        ps={5}
        width="100%"
        ref={menuRef}
      >
        <Menu>
          <MenuButton
            as={Box}
            onClick={handleCategory}
            width="180px"
            alignItems="center"
            marginLeft="40px"
            cursor="pointer"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black',
                color: 'white',
                padding: '15px',
                width: '180px',
              }}
            >
              <Box style={{ width: '170px' }} fontSize="17px" fontWeight="700">
                CATEGORIES
              </Box>
              <Box>
                <BiSolidCategory />
              </Box>
            </div>
          </MenuButton>
          <MenuList
            width="100vw"
            height="30vh"
            ml="-55px"
            mt="-5px"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            color="black"
            background="rgb(196,226,191) linear-gradient(90deg, rgba(196,226,191,1) 0%, rgba(244,244,244,1) 35%, rgba(119,151,157,1) 61%, rgba(241,217,130,1) 100%)"
          >
            {isFalse && (
              <MenuGroup>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '80px',
                  }}
                >
                  {genres.map((genre) => {
                    return (
                      genre.status && (
                        <div key={genre.name} style={{ margin: '5px' }}>
                          <Dropdown title={genre.name} genreId={genre._id} />
                        </div>
                      )
                    );
                  })}
                </div>
              </MenuGroup>
            )}
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
