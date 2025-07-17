

import banner from '../assets/mainbanner/abouttopbanner.png'
import '../assets/Css/Service.css'

const PrivacyPolicy = () => {
  return (

    <>
      <div>
        <img src={banner} width="100%" alt="banner" />
      </div>

      <div className='privacy_content_section'>


        <div className="container">

          <h2>Privacy Policy </h2>

          <p>
            Welcome to My Inner Side. Your privacy is very important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website and services.
          </p>

          <h3>1. Information We Collect</h3>

          <h5>Personal Information</h5>
          <p>
            When you book an appointment or interact with our platform, we may collect the following details:
          </p>
          <ul>
            <li>
              Name
            </li>
            <li>
              Email address
            </li>
            <li>
              Phone number
            </li>
            <li>
              Appointment details (selected time, duration, and preferences)
            </li>
            <li> Payment details (handled securely via our payment gateway)</li>
          </ul>
          <h5>
            Usage Data
          </h5>
          <p>
            We automatically collect data on how you use the platform, including:
          </p>
          <ul>
            <li>
              IP address
            </li>
            <li>
              Browser type
            </li>
            <li>
              Device information
            </li>
            <li>
              Pages visited and time spent on the site
            </li>
          </ul>

          <h3>
            2. How We Use Your Information
          </h3>
          <p>
            We use the collected information to:
          </p>
          <ul>
            <li>
              Provide and manage our services
            </li>
            <li>
              Schedule and confirm appointments
            </li>
            <li>
              Communicate with you regarding appointments and updates
            </li>
            <li>
              Improve the platform’s usability and user experience
            </li>
            <li>
              Ensure a safe and respectful environment
            </li>
            <li>Process payments securely

            </li>
          </ul>
          <h3> 3.Sharing of Information</h3>
          <p>
            We do not sell or rent your personal information. However, we may share it with:
          </p>
          <ul>
            <li>
              Trusted service providers (e.g., payment processors)
            </li>
            <li>
              Legal authorities if required by law or to protect our rights and safety
            </li>
            <li>
              Our platform team, for internal use only, to provide better services
            </li>
          </ul>
          <h3>
            4. Data Security
          </h3>
          <p>
            We take security seriously and use industry-standard encryption and security measures to protect your personal information. However, no method of online transmission is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h3>
            5. Third-Party Links
          </h3>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies separately.
          </p>

        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy