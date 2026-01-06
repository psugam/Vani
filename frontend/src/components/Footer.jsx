import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-[10vh] bg-gray-100 text-center text-xl p-4 border-t border-black">
      <p>© {currentYear} Vāṇī. All rights reserved.</p>
    </div>
  );
};

export default Footer;