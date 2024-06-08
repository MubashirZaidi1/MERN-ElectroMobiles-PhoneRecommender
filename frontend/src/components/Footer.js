import React from 'react';
import './css/Footer.css'; 

const Footer = () => {
  return (
    <footer id="footer">
      {/* Top Footer */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-xs-6">
              <div className="footer">
                <h3 className="footer-title">About Me</h3>
                <p>
                 Project MERN For Web Programming
                </p>
                <ul className="footer-links">
                  <li><a href="#"><i className="fa fa-map-marker"></i>Muhammad Mubashir Hassan</a></li>
                  <li><a href="#"><i className="fa fa-envelope-o"></i>mobizaidi123@gmail.com</a></li>
                </ul>
              </div>
            </div>
            <div className="clearfix visible-xs"></div>
          </div>
        </div>
      </div>
      {/* /Top Footer */}


    </footer>
  );
};

export default Footer;
