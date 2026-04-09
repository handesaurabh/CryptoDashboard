import React, { useEffect, useState } from 'react'
import KeyboardDoubleArrowUpSharpIcon from '@mui/icons-material/KeyboardDoubleArrowUpSharp';
import "./styles.css"

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollFunction = () => {
            const shouldBeVisible =
                document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;

            setIsVisible((currentVisibility) =>
                currentVisibility === shouldBeVisible ? currentVisibility : shouldBeVisible
            );
        };

        window.addEventListener("scroll", scrollFunction, { passive: true });

        return () => window.removeEventListener("scroll", scrollFunction);
    }, []);

    function topFunction() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <div
            className='back-to-top'
            id='myBtn'
            onClick={() => topFunction()}
            style={{ display: isVisible ? "flex" : "none" }}
        >
            <KeyboardDoubleArrowUpSharpIcon style={{ color: "cyan", fontSize: "2.5rem" }} />
        </div>
    )
}

export default BackToTop
