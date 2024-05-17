import React from "react";
import "./ContactUs.css";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";


const ContactUs = () => {
    return (
      <div className="contactus">
        <h1>Contact Us</h1>
        <p className="title">
            Have any questions/feedback or wish to contact us?
        </p>
        <p>
            Here are our contacts!
        </p>
        <p className="contact">
            <u>Yim Jian Bing </u>
            <p>
                <FaInstagram className="icons" onClick={() => window.open('https://instagram.com/yim_jian_bing')}/>
                <FaGithub className="icons" onClick={() => window.open('https://github.com/yimjianbing')}/>
                <FaLinkedin className="icons" onClick={() => window.open('https://linkedin.com/in/yim-jian-bing-3b8a5a266')}/>
            </p>
            <p>Email: yeahitsyjb@gmail.com</p>
        </p>
        <br />
        <p className="contact">
            <u>He Minhao</u>
            <p>
                <FaInstagram className="icons" onClick={() => window.open('https://www.instagram.com/min.ha0')}/>
                <FaGithub className="icons" onClick={() => window.open('https://github.com/minhao23')}/>
                <FaLinkedin className="icons" onClick={() => window.open('')}/>
            </p>
            <p>Email: </p>
        </p>
      </div>
    );
  };
  
  export default ContactUs;
  