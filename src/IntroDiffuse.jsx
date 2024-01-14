// DiffusingPixels.js

import React, { useEffect } from 'react';
import './Styles/IntroDiffuse.css';

const DiffusingPixels = () => {
  useEffect(() => {
    const container = document.getElementById('diffusing-container');
    
    const createPixel = () => {
      const pixel = document.createElement('div');
      pixel.className = 'diffusing-pixel';
      
      const size = Math.floor(Math.random() * 7) + 1; // Random size between 1px and 10px
      const posX = Math.random() * 2000 - 1000; // Random X position within a range
      const posY = Math.random() * 2000 - 1000; // Random Y position within a range
      
      pixel.style.width = `${size}px`;
      pixel.style.height = `${size}px`;
      pixel.style.transform = `translate(${posX}px, ${posY}px)`;
      
      container.appendChild(pixel);
      
      // Apply animation
      pixel.animate(
        [
          { transform: 'translate(0, 0)', opacity: 1 },
          { transform: `translate(${Math.random() * 2000 - 1000}px, ${Math.random() * 2000 - 1000}px)`, opacity: 0 }
        ],
        {
          duration: Math.random()*10000 , // Adjust the duration as needed
          easing: 'ease-out',
          fill: 'forwards'
        }
      ).onfinish = () => {
        container.removeChild(pixel);
      };
    };

    // Create a specified number of pixels
    const numberOfPixels = 500;
    for (let i = 0; i < numberOfPixels; i++) {
      createPixel();
    }
  }, []);

  return (
    <div id="diffusing-container">
    </div>
  );
};

export default DiffusingPixels;
