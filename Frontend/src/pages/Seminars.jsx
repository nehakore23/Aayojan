import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const faqList = [
    {
        isActive: true,
        question: "What is a seminar?",
        answer:
            "A seminar is an educational event where a group of people discuss a specific topic, often led by an expert or guest speaker. Seminars encourage interaction, learning, and sharing of ideas.",
    },
    {
        isActive: false,
        question: "How can I register for a seminar?",
        answer:
            "You can register for a seminar by visiting the event page and clicking on the 'Register' button. Fill in your details and submit the form to secure your spot.",
    },
    {
        isActive: false,
        question: "Are seminars open to everyone?",
        answer:
            "Most seminars are open to all students and faculty, but some may have specific eligibility criteria. Please check the seminar details for any restrictions.",
    },
    {
        isActive: false,
        question: "Will I get a certificate for attending a seminar?",
        answer:
            "Yes, participants who attend the full seminar and complete any required activities will receive a certificate of participation.",
    },
    {
        isActive: false,
        question: "Can I suggest a topic or speaker for future seminars?",
        answer:
            "Absolutely! We welcome suggestions for seminar topics and speakers. Please contact the organizing team or use the feedback form to share your ideas.",
    },
    {
        isActive: false,
        question: "Are seminar recordings available after the event?",
        answer:
            "Recordings and presentation materials are usually shared with registered participants after the seminar. Check your email or the event page for updates.",
    },
    {
        isActive: false,
        question: "How do I become a seminar speaker?",
        answer:
            "If you are interested in speaking at a seminar, please reach out to the seminar coordinators with your topic and credentials. We are always looking for passionate speakers!",
    },
];

const FaqItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(faq.isActive || false);
    const toggleFaq = () => setIsOpen(!isOpen);
    return (
        <div className="ezy__faq4-item mt-4">
            <Button
                variant=""
                className="p-3 p-lg-4 w-100 text-start d-flex justify-content-between align-items-center ezy__faq4-btn-collapse"
                type="button"
                onClick={toggleFaq}
                aria-expanded={isOpen}
            >
                <span>{faq.question}</span>
                <FontAwesomeIcon icon={faChevronDown} />
            </Button>
            <Collapse in={isOpen}>
                <div>
                    <div className="ezy__faq4-content p-3 p-lg-4">
                        <p className="opacity-50 mb-0">{faq.answer}</p>
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

FaqItem.propTypes = {
    faq: PropTypes.object.isRequired,
};

const Faq4 = () => {
    return (
        <section className="ezy__faq4">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        {faqList.slice(0, 5).map((faq, i) => (
                            <FaqItem faq={faq} key={i} />
                        ))}
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

const blogs = [
    {
        title: "AI in Education Seminar",
        description:
            "Explore how artificial intelligence is transforming the education sector.",
        speaker: "Dr. Neha Sharma",
        image: "https://cdn.easyfrontend.com/pictures/blog/blog_3.jpg",
        date: "12",
        month: "Jun",
        year: "2025",
    },
    {
        title: "Modern Web Development",
        description:
            "A seminar on the latest trends and tools in web development.",
        speaker: "Mr. Rahul Verma",
        image: "https://cdn.easyfrontend.com/pictures/blog/blog_13_1.jpg",
        date: "18",
        month: "Jul",
        year: "2025",
    },
    {
        title: "Data Science for Everyone",
        description:
            "Learn the basics of data science and its real-world applications.",
        speaker: "Ms. Priya Singh",
        image: "https://cdn.easyfrontend.com/pictures/blog/blog_9.jpg",
        date: "25",
        month: "Aug",
        year: "2025",
    },
];

const BlogItem = ({ blog }) => {
    return (
        <article className="ezy__blog7-post">
            <div className="position-relative">
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="img-fluid w-100 ezy-blog7-banner"
                />
                <div className="px-4 py-3 ezy__blog7-calendar" style={{ fontWeight: 'bold' }}>
                    {blog.date} {blog.month}, {blog.year}
                </div>
            </div>
            <div className="p-3 p-md-4">
                <h4 className="mt-3 ezy__blog7-title fs-4">{blog.title}</h4>
                <p className="ezy__blog7-description mt-3 mb-2">{blog.description}</p>
                <p className="ezy__blog7-author mb-2">
                    <strong>Speaker:</strong> {blog.speaker}
                </p>
            </div>
        </article>
    );
};

BlogItem.propTypes = {
    blog: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        speaker: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        month: PropTypes.string.isRequired,
        year: PropTypes.string.isRequired,
    }).isRequired,
};

const Seminars = () => {
    return (
        <section className="ezy__blog7" style={{ background: '#fff' }}>
            {/* Removed top header spacing to make image touch navbar */}
            <img
                src="https://images.unsplash.com/photo-1558008258-3256797b43f3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VtaW5hcnxlbnwwfHwwfHx8MA%3D%3D"
                alt=""
                className="img-fluid w-100"
                style={{ display: 'block', marginTop: 0, marginBottom: 0 }}
            />
            <div className="ezy__blog7-header text-center py-4" style={{ background: '#fff', marginBottom: '16px' }}>
                <h2 className="ezy__blog7-heading mb-3 mt-0" style={{ margin: '0 auto', textAlign: 'center', fontSize: '2.4rem', fontWeight: 700 }}>
                    Let's Now make an impression.
                </h2>
                <p className="ezy__blog7-sub-heading mb-4" style={{ maxWidth: 700, margin: '1em auto 0 auto', fontSize: '1.35rem', textAlign: 'center' }}>
                    Let’s now make an impression. From the wild rhythm of ideas to the calm of perfection — we shape every moment like a masterpiece.
                </p>
            </div>
            <div className="ezy__blog7-wrapper" style={{ paddingTop: '0', marginTop: '0' }}>
                <Container>
                    <Row className="mt-1" style={{ rowGap: '12px' }}>
                        {blogs.map((blog, i) => (
                            <Col xs={12} md={6} lg={4} className="mb-2" key={i}>
                                <BlogItem blog={blog} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
            {/* FAQ Section Below Cards */}
            <div className="faq-heading-section" style={{ textAlign: 'center', margin: '32px 0 8px 0' }}>
                <h2 className="ezy__faq4-heading mb-3" style={{ fontSize: '2.1rem', fontWeight: 700 }}>
                    Frequently Asked Questions
                </h2>
                <p className="ezy__faq4-sub-heading mb-2" style={{ maxWidth: 700, margin: '0 auto', fontSize: '1.15rem' }}>
                    It’s easier to reach your savings goals when you have the right savings account. Take a look and find the right one for you!
                </p>
            </div>
            <Faq4 />
        </section>
    );
};

export default Seminars;