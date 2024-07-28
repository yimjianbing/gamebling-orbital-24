import React, { useState } from 'react';
import slide1 from '../../assets/slides/slide1.png';
import slide2 from '../../assets/slides/slide2.png';
import slide3 from '../../assets/slides/slide3.png';
import slide4 from '../../assets/slides/slide4.png';
import slide5 from '../../assets/slides/slide5.jpg';
import Exit from './Exit';
import { useNavigate } from "react-router-dom";


import './Rules.css';

const Rules = () => {
    const navigate = useNavigate();

    const images = [
        slide1,
        slide2,
        slide3,
        slide4,
        slide5
      ];

    const [currentIndex, setCurrentIndex] = useState(0);
  
    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      if (currentIndex === 4) {
        navigate('/mainmenu');
      }
    };
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
  
    return (
        <div className="slideshow">
          <div className="slide" style={{ backgroundImage: `url(${images[currentIndex]})` }}>
            <div className="overlay">
              <Exit />
              <h6>Page {currentIndex + 1}</h6>
            </div>
          </div>
          <button className="prev" onClick={handlePrev}>❮</button>
          <button className="next" onClick={handleNext}>❯</button>
        </div>
      );
  };
  
  export default Rules;