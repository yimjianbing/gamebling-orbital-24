import React from "react";
import "./ContactUs.css";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";


const ContactUs = () => {
    return (
      <div className="contactus" data-testid="contactus">
        <h1>Contact Us</h1>
        <p>
            Have any questions/feedback or wish to contact us?
        </p>
        <p>
            Here are our contacts!
        </p>
        <div className="contact">
            <u>Yim Jian Bing </u>
            <div>
                <FaInstagram className="icons" onClick={() => window.open('https://instagram.com/yim_jian_bing')}/>
                <FaGithub className="icons" onClick={() => window.open('https://github.com/yimjianbing')}/>
                <FaLinkedin className="icons" onClick={() => window.open('https://linkedin.com/in/yim-jian-bing-3b8a5a266')}/>
            </div>
            <div>Email: yeahitsyjb@gmail.com</div>
        </div>
        <br />
        <div className="contact">
            <u>He Minhao</u>
            <div>
                <FaInstagram className="icons" onClick={() => window.open('https://www.instagram.com/min.ha0')}/>
                <FaGithub className="icons" onClick={() => window.open('https://github.com/minhao23')}/>
                <FaLinkedin className="icons" onClick={() => window.open('https://www.linkedin.com/in/minhaohe/')}/>
            </div>
            <div>Email: heminhao120@gmail.com</div>
        </div>
      </div>
    );
  };
  
  export default ContactUs;
  