import React from "react";
import "../style/Footer.css";

const Footer = () => (
  <footer className="footer">
    © {new Date().getFullYear()} Clinic Admin. All rights reserved.
  </footer>
);

export default Footer;
