import * as React from 'react';

function XvideosPrimeLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 520 108"
            width={520}
            height={108}
            {...props}
        >
            {/* background */}
            <rect width="520" height="108" fill="#000000" />

            {/* Xvideos */}
            <text
                x="10"
                y="82"
                fontFamily="'Arial Black', Arial, sans-serif"
                fontWeight="900"
                fontSize="80"
                fill="#ffffff"
            >
                Xvideos
            </text>

            {/* Prime box */}
            <rect x="285" y="9" width="225" height="90" rx="12" fill="#cc0000" />

            {/* Prime text */}
            <text
                x="297"
                y="82"
                fontFamily="'Arial Black', Arial, sans-serif"
                fontWeight="900"
                fontSize="74"
                fill="#000000"
            >
                Prime
            </text>
        </svg>
    );
}

export default XvideosPrimeLogo;
