import React, { useState } from 'react'
import "./CoinInfo.css"

const CoinInfo = ({ heading, desc }) => {
    const [showFullDesc, setShowFullDesc] = useState(false);
    const safeDesc = desc || "";
    const shortDesc = safeDesc.slice(0, 200);
    const longDesc = safeDesc;
    const shouldTrim = safeDesc.length > 200;

    return (
        <div className='coin-info'>
            <h2>{heading}</h2>
            <p>{showFullDesc || !shouldTrim ? longDesc : `${shortDesc}...`}</p>
            {shouldTrim && (
                <button
                    className='read-more-btn'
                    onClick={() => setShowFullDesc((prev) => !prev)}
                >
                    {showFullDesc ? "Read Less" : "Read More"}
                </button>
            )}
        </div>
    )
}

export default CoinInfo
