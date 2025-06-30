import React,{useEffect} from 'react'
import { styles } from './styles';
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "./utils/motion";
import {
  Details,
  Teams,
  
} from "./components";
const DetailsPage = () => {
   useEffect(() => {
     window.scrollTo(0, 0);
   }, []);
  return (
    <div className="relative z-0 bg-primary">
      <Details />
    </div>
  );
}

export default DetailsPage;