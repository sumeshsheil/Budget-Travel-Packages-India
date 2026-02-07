import React from "react";

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      width="6"
      height="11"
      viewBox="0 0 6 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.5218 6.18794H3.91036V11.0008H1.76178V6.18794H-5.55851e-05V4.21125H1.76178V2.68575C1.76178 0.966888 2.7931 2.63453e-05 4.36156 2.63453e-05C5.11357 2.63453e-05 5.90854 0.150427 5.90854 0.150427V1.84781H5.02763C4.16819 1.84781 3.91036 2.36347 3.91036 2.9221V4.21125H5.8226L5.5218 6.18794Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FacebookIcon;
