import { useEffect } from "react";

import './dust.css'

const Dust = () => {
    useEffect(() => {
        const container = document.getElementById('dust-container');

        const createDustMote = () => {
            const mote = document.createElement('div');
            mote.className = 'dust-mote';
            mote.style.left = `${Math.random() * 100}vw`;
            mote.style.animationDuration = `${Math.random() * 4 + 10}s`;
            container.appendChild(mote)

            mote.addEventListener('animationend', () => {
                container.removeChild(mote)
            })
                ;
        }

        const intId = setInterval(createDustMote, 400);
        return () => {
            clearInterval(intId);
        }
    }, []);
    return <div id='dust-container'></div>
}

export default Dust;