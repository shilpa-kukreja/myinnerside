
import React, { useState, useRef } from 'react'
import CommonHeading from './CommonHeading'
import '../assets/Css/Service.css'
import { FaPlus, FaMinus } from 'react-icons/fa';

const Faq = () => {

  const [activeIndex, setActiveindex] = useState('')
  const faqRefs = useRef([]);
  const toggleFaq = (id) => {
    setActiveindex(prevIndex => prevIndex === id ? '' : id)

  }




  const faqData = [
    {
      question: ' What is My Inner Side session consulting service? ',
      answer: '  My Inner Side offers private, one-on-one sessions with certified listeners who provide emotional support, helping you share thoughts and experiences without fear, pressure, or judgment.'
    },
    {
      question: 'Who will I be talking to during the session?',
      answer: '  You’ll be connected with a certified, trained professional who is compassionate, non-judgmental, and experienced in providing emotional support through active, empathetic listening.'
    },
    {
      question: 'Is everything I say kept completely confidential?',
      answer: ' Yes, all conversations are 100% private and secure. We prioritize your confidentiality and emotional safety, ensuring your personal experiences remain protected and respected.'
    },
    {
      question: 'Can I choose the time for my session?',
      answer: '  Absolutely. You can select a convenient time that fits your schedule, making it easy and stress-free to talk when you feel ready.'
    },
    {
      question: ' Will I receive advice or emotional support?',
      answer: ' Our professionals mainly offer emotional support and natural consultation. While not therapy, you’ll receive heartfelt understanding, guidance, and a safe space to express yourself.'
    },
  ]



  return (
    <div className='faqs_section' id='faq'>
      <div className="container">
        <CommonHeading title="Frequently Asked Questions" subtitle=' Find answers to common questions about our services.' />

        <div className="faqs_content">
          <div className="col-half  faqs_title ">

            <h2>Any Questions?</h2>
            <h3>We Got You.</h3>
            <p>
             At My Inner Side, we understand that reaching out can feel overwhelming, especially when you're already feeling alone. Our FAQ section is here to help you feel more confident and informed about the support we offer. Whether you’re wondering how our service works, who you'll be speaking to, or how your privacy is protected, we’ve answered the most common questions with clarity and care. Our goal is to make your experience simple, safe, and comforting from the very first step. If you still have questions, feel free to contact us anytime—we're always here to listen.
            </p>
          </div>
          <div className="col-half">

            {
              faqData.map((item, id) => (
                <div key={id} className='faq_box' >
                  <div className='faq_question' onClick={() => toggleFaq(id)}>
                    <h3 className='title'> {item.question} </h3>
                    <span>
                      {activeIndex === id ? <FaMinus /> : <FaPlus />}
                    </span>
                  </div>


                  <div
                    ref={el => (faqRefs.current[id] = el)}
                    className={`faq_answer ${activeIndex === id ? 'open' : ''}`}
                  >
                    <div >{item.answer}</div>
                  </div>

                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default Faq