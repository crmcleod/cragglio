import { useEffect } from "react";

import './Styles/dust.css'

const Dust = () => {
    useEffect(() => {
        const container = document.getElementById('dust-container');

        const createDustMote = () => {
            const mote = document.createElement('div');
            mote.className = 'dust-mote';
            mote.style.left = `${Math.random() * 100}vw`;
            mote.style.width = `${Math.random() * 5}px`
            mote.style.height = `${Math.random() * 5}px`
             mote.style.transformOrigin= `${Math.random() * 2000}% ${Math.random() * 2000}%`

            mote.style.animationDuration = `${Math.random() * 4 + 10}s`;
            container.appendChild(mote)

            mote.addEventListener('animationend', () => {
                container.removeChild(mote)
            })
                ;
        }

        const intId = setInterval(createDustMote, (Math.random()*50)+50);
        return () => {
            clearInterval(intId);
        }
    }, []);
    return <div id='dust-container' className="w100 h100"></div>
}

export default Dust;