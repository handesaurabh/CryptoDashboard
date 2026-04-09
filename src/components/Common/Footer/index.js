import React from 'react'
import { Link } from 'react-router-dom'
import './footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='footer'>
            <div className='footer-content'>
                <Link to="/" className='footer-brand-wrap'>
                    <h2 className='footer-logo'>CryptoTracker<span style={{ color: "var(--blue)" }}>.</span></h2>
                </Link>
                <p className='footer-copy'>Copyright (c) {currentYear} CryptoTracker. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
