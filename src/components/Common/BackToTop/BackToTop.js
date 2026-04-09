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
        <button
            type="button"
            className={`back-to-top ${isVisible ? "back-to-top-visible" : ""}`}
            id='myBtn'
            onClick={() => topFunction()}
            aria-label="Back to top"
            aria-hidden={!isVisible}
            tabIndex={isVisible ? 0 : -1}
        >
            <span className="back-to-top-core">
                <KeyboardDoubleArrowUpSharpIcon className="back-to-top-icon" />
            </span>
        </button>
    )
}

export default BackToTop
