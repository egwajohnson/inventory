import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Egwaj. All rights reserved.</p>
        <p>
          Contact us: <a href="mailto:info@egwaj.com">info@egwaj.com,   </a>
        </p>    
        <p>
          Follow us:{" "}
          <a
            href="https://twitter.com/egwaj"
            target="_blank"
            rel="noreferrer"
          >
            @egwaj
          </a>
        </p>
      </footer>
    </>
  );
}

export default Footer;
