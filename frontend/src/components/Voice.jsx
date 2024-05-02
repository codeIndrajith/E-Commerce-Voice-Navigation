import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardVoice } from "react-icons/md";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useCartContext } from "../contexts/CartContext";
import { getProductById } from "../services/ProductServices";
import { useEffect } from "react";

const Voice = (props) => {
  const { cart } = useCartContext();
  const [product, setProduct] = useState("");

  useEffect(() => {
    getProductById(props.prodId)
      .then((result) => {
        setProduct(result.product);
      })
      .catch((err) => console.log(err));
  }, []);

  const readDetails = () => {
    const currentPage = window.location.pathname.substring(1);
    console.log(currentPage);
    switch (currentPage) {
      case "search":
        speak("This is the search page.");
        break;
      case "cart":
        if (cart.length <= 0) {
          speak(
            "This is the cart page. But you have nothing in your cart. You have not added a product to your cart. All you have to do is click on the cart icon."
          );
        } else if (props.totalAmount === 1) {
          speak(
            `You have ${props.totalAmount} product and your price is ${props.totalPrice} doller`
          );
        } else {
          speak(
            `You have ${props.totalAmount} products and your price is ${props.totalPrice} doller`
          );
        }
        break;
      case "favorites":
        speak("This is the favorites page.");
        break;
      case `product/${props.prodId}`:
        speak(
          `Congratulations! You've chosen ${product.name}, priced at ${
            product.price
          } dollar. Let me give you a sneak peek: ${product.description}. ${
            props.ratingCount === 0
              ? "Unfortunately, this product has not been rated yet."
              : `You'll be pleased to know it's already earned ${props.ratingCount} ratings.`
          }`
        );

        break;
      case "login":
        speak("This is the login page.");
        break;
      default:
        speak("This is the Home page");
    }
  };

  const commands = [
    {
      command: ["Open *"],
      callback: (redirectPage) => setRedirectUrl(redirectPage),
    },
    {
      command: ["Read"],
      callback: readDetails,
    },
  ];

  const navigate = useNavigate();
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [redirectUrl, setRedirectUrl] = useState("");
  const pages = ["home", "search", "cart", "favorites", "login"];
  const urls = {
    home: "/",
    search: "/search",
    cart: "/cart",
    favorites: "/favorites",
    login: "/login",
  };

  const handleVoiceCommand = () => {
    SpeechRecognition.startListening();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (redirectUrl) {
    if (pages.includes(redirectUrl)) {
      navigate(urls[redirectUrl]);
    } else {
      console.log("Error");
    }
  }
  return (
    <div className="voiceBtn">
      <MdKeyboardVoice onClick={handleVoiceCommand} />
    </div>
  );
};

export default Voice;
