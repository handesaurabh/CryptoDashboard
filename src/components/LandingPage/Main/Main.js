import React from 'react'
import './Main.css'
import Button from '../../Common/Button/Button'
import iphone from '../../../assets/iphone.png'
import gradient from '../../../assets/gradient.png'
// Frmaer motion for adding animations
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
const Main = () => {
    return (
        <div className='flex-info'>
            <div className='left'>
                <motion.h1 className='real-time' initial={{ opacity: 0, y: 1000 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2 }}>Real Time</motion.h1>
                <motion.h1 className='track-heading'
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 2, delay: 1 }}>CRYPTO Tracker</motion.h1>
                <p className='info-text'>Track live crypto prices and stay updated with the latest market movements.</p>
                <div className="btn-text">
                    <Link to="/dashboard"><Button text={"Dashboard"} /></Link>
                    <Button text={"Share"} outlined={true} />
                </div>
            </div>
            <div className='phone-container'>
                <motion.img src={iphone} className='iphone' initial={{ y: -10 }}
                    animate={{ y: 10 }}
                    transition={{
                        type: "smooth",
                        repeatType: "mirror",
                        duration: 2,
                        repeat: Infinity,
                    }}
                />
                <img src={gradient} className='gradient' />
            </div>
        </div>
    )
}

export default Main