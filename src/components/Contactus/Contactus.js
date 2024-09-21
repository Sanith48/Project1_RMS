import React, { useState } from 'react';
import "./Contactus.css";
import { Link } from "react-router-dom";

const Contactus = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [responseMessage, setResponseMessage] = useState("");

    // Handle form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const url="http://localhost:5000/api/Contact"
        
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        
        .then((res) => res.json())
        .then((data) => {
            setResponseMessage(data.message);
            // Clear form after submission
            setFormData({
                name: "",
                email: "",
                phone: "",
                message: ""
            });
        })
        .catch((err) => {
            console.error("Error submitting the form", err);
            setResponseMessage("There was an error. Please try again later.");
        });
    };

    return (
        <div className='contact'>
            <Link className="btn btn-light mx-1" to="/Home" role="button">
                Back
            </Link>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h2 className="section-heading">Contact Us</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Your Name *" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            placeholder="Your Email *" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input 
                                            type="telephone" 
                                            className="form-control" 
                                            placeholder="Your Phone *" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <textarea 
                                            className="form-control" 
                                            placeholder="Your Message" 
                                            name="message" 
                                            value={formData.message} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                                <div className="col-lg-12 text-center">
                                    <button type="submit" className="button">Send Message</button>
                                    <p className="response-message">{responseMessage}</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contactus;
