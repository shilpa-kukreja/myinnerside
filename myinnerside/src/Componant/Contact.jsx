import banner from '../assets/mainbanner/banner.jpeg';
import '../assets/Css/Contact.css';
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      number: e.target.number.value,
      message: e.target.message.value
    };

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (res.ok) {
        alert("Message sent!");
        e.target.reset(); // reset the form after successful submission
      } else {
        alert(result.error || "Failed to send");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className='contact_section'>
      <img src={banner} width='100%' alt="Contact Banner" />

      <div className="container">
        <div className="contact_details">
          <div className="contact_information">
            <h2>Contact Us</h2>

            <div className="add_social">
              <ul>
                {/* Optional Address Info */}
                {/* <h4>Address Info:</h4>
                <li>
                  <FaMapMarkerAlt size={20} className='icon' />
                  <p>Address details here...</p>
                </li> */}

                <h4>Email Us:</h4>
                <li>
                  <MdOutlineMailOutline className='icon' />
                  <a href="mailto:info@email.com">info@email.com</a>
                </li>

                <h4>Contact Us:</h4>
                <li>
                  <FaPhoneAlt className='icon' />
                  <a href="tel:+9100000000">+91 00000000</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="contact_form">
            <h2 className='contact_title'>Get In Touch With Us</h2>
            <p className='contact_subtitle'>
              We'd love to hear from you! Whether you have a question, feedback, or need support, our team is here to help.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form_group w-50">
                <input
                  type="text"
                  name="firstName"
                  className='form_control'
                  placeholder='First Name*'
                  required
                />
              </div>
              <div className="form_group w-50">
                <input
                  type="text"
                  name="lastName"
                  className='form_control'
                  placeholder='Last Name*'
                  required
                />
              </div>
              <div className="form_group w-100">
                <input
                  type="email"
                  name="email"
                  className='form_control'
                  placeholder='Enter Email*'
                  required
                />
              </div>
              <div className="form_group w-100">
                <input
                  type="tel"
                  name="number"
                  className='form_control'
                  placeholder='Phone Number*'
                  required
                />
              </div>
              <div className="form_group w-100">
                <textarea
                  name="message"
                  rows={6}
                  className='form_control'
                  placeholder='Message'
                  required
                ></textarea>
              </div>
              <div>
                <button className='form_btn' type="submit">Contact Now</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
