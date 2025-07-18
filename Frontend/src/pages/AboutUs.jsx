import React, { useState } from 'react';
import './AboutUs.css'; // Import the dedicated CSS for this component
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    MDBContainer,
    MDBCol,
    MDBRow
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { faSlidersH, faLightbulb, faTh, faCog } from '@fortawesome/free-solid-svg-icons'; // Import your icons

const features = [
    {
        icon: faSlidersH,
        title: "Event Promotion & Marketing",
        desc: "Promote your events across campus with digital posters, social media integration, and scheduled notifications to maximize participation and engagement.",
    },
    {
        icon: faLightbulb,
        title: "Event Planning & Scheduling",
        desc: "Easily create, plan, and schedule events. Assign venues, set timelines, and coordinate with team members for seamless event execution.",
    },
    {
        icon: faTh,
        title: "Registration & Feedback",
        desc: "Allow participants to register online, track attendance, and collect real-time feedback to improve future events and measure success.",
    },
    {
        icon: faCog,
        title: "Resource & Volunteer Management",
        desc: "Manage resources, inventory, and volunteers efficiently. Assign roles, track equipment, and ensure every event runs smoothly.",
    },
];

const FeaturedItem = ({ feature }) => {
    return (
        <Card className="ezy__featured48-card p-3 mt-4">
            <Card.Body className="py-4 p-lg-4">
                <div className="ezy__featured48-icon mb-3">
                    <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h4 className="ezy__featured48-title mb-3">{feature.title}</h4>
                <p className="ezy__featured48-content mb-0">{feature.desc}</p>
            </Card.Body>
        </Card>
    );
};

FeaturedItem.propTypes = {
    feature: PropTypes.object.isRequired,
};

const Feature48 = () => {
    return (
        <section className="ezy__featured48">
            <div className="text-center mb-4">
                <h1 className="ezy__featured48-heading mb-3">Features List</h1>
                <p className="ezy__featured48-sub-heading mb-4">
                    From idea to execution, our platform streamlines every step of your college event planning journey with powerful tools and seamless coordination.
                </p>
            </div>
            <Container>
                <Row className="ezy__featured48-list justify-content-center">
                    {features.map((feature, i) => (
                        <Col md={6} lg={3} key={i}>
                            <FeaturedItem feature={feature} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

const AboutUs = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <>
            <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-img-margin"
                        src={require('../assets/images/1st.jpg')}
                        alt="First slide"
                        style={{ height: '800px', objectFit: 'cover' }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={require('../assets/images/2nd.jpg')}
                        alt="Second slide"
                        style={{ height: '800px', objectFit: 'cover' }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={require('../assets/images/3rd.jpg')}
                        alt="Third slide"
                        style={{ height: '800px', objectFit: 'cover' }}
                    />
                </Carousel.Item>
            </Carousel>

            <section className="ezy__about13" id="ezy__about13">
                <Container>
                    <Row className="justify-content-center align-items-center">
                        <Col xs={12} lg={5} className="mb-5 mb-lg-0">
                            <div>
                                <h1 className="ezy__about13-heading">ABOUT US</h1>
                                <hr className="ezy__about13-divider my-4" />
                                <p className="ezy__about13-sub-heading mb-2">
                                    At our core, we are passionate about turning college events
                                    into unforgettable experiences. We specialize in end-to-end
                                    event management, making it easier for students and organizers to plan, promote, and execute college functions seamlessly. From technical fests and cultural shows to seminars and workshops, we bring structure to creativity. Our team understands the dynamic nature of student-led events and offers tools that simplify coordination and enhance collaboration. We empower colleges to showcase talent, celebrate achievements, and build community spirit through well-organized events. With our user-friendly interface, event creation, registration, scheduling, and feedback collection become effortless. We prioritize punctuality, transparency, and team synergy in every event we manage. Our goal is to reduce manual workload, minimize errors, and let organizers focus on the experience. Backed by innovation and driven by passion, we’re committed to creating impactful memories. Every event is a chance to inspire, and we help colleges seize that opportunity with excellence. We also promote sustainability by going digital – no paper, no confusion.
                                </p>
                                <p className="ezy__about13-sub-heading mb-0">
                                    Our platform supports customization, so each event feels personal and aligned with the college’s identity. We offer live updates, reminders, and performance analytics to keep stakeholders informed. Security, scalability, and simplicity form the backbone of our system. Whether it's a last-minute contest or a year-long celebration, we have you covered. We bridge the gap between planning and perfection. Our journey began with one college fest, and today, we serve institutions across the region. We value student leadership, creativity, and the energy of youth culture. That’s why we’re more than just event managers – we’re experience creators. Join us and make every college event a milestone worth remembering.
                                </p>
                            </div>
                        </Col>
                        <Col xs={12} lg={6}>
                            <div className="ezy__about13-bg-holder" />
                            <div className="position-relative">
                                <img
                                    src="https://www.campustimespune.com/wp-content/uploads/2016/02/sinhgad-karandak-events-pune-sinhgad-college-of-engineering.jpg"
                                    alt=""
                                    className="img-fluid"
                                />
                                <img
                                    src="https://www.hire4event.com/blogs/wp-content/uploads/2019/02/COLLEGE-EVENT.jpg"
                                    alt=""
                                    className="img-fluid ezy__about13-img2"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>


            {/* Feature Cards Section */}
            <Feature48 />

            {/* About Us Gallery Section */}
            <div className="white-background text-center py-2">
                <h2 className="display-5 fw-bold text-uppercase">Gallery</h2>
                <p className="text-muted">Glimpses of our vibrant events</p>
            </div>

            <MDBContainer className="my-4">
                <MDBRow>
                    <MDBCol lg={4} md={12} className='mb-4 mb-lg-0'>
                        <img
                            src='https://www.toppersnotes.com/wp-content/uploads/2016/08/IMG_8393.jpg'
                            className='w-100 shadow-1-strong rounded mb-4'
                            alt='Boat on Calm Water'
                        />
                        <img
                            src='https://www.mylaporetimes.com/wp-content/uploads/2022/04/MT-COLLEGE-1-scaled.jpg'
                            className='w-100 shadow-1-strong rounded mb-4'
                            alt='Wintry Mountain Landscape'
                        />
                    </MDBCol>

                    <MDBCol lg={4} className='mb-4 mb-lg-0'>
                        <img
                            src='https://www.andcollege.du.ac.in/assets/front/images/annualfest/3.jpg'
                            className='w-100 shadow-1-strong rounded mb-4'
                            alt='Mountains in the Clouds'
                        />
                        <img
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr8Z3deRV7buOE9bKbcbLGBJZpUhmJtY2AGQ&s'
                            className='w-100 shadow-1-strong rounded mb-4'
                            alt='Boat on Calm Water'
                        />
                    </MDBCol>

                    <MDBCol lg={4} className='mb-4 mb-lg-0'>
                        <img
                            src='https://bathspa.ac.ae/wp-content/uploads/2023/03/BSU-New-Website-Events-Thumbnails.jpg'
                            className='w-100 shadow-1-strong rounded mb-4'
                            alt='Waves at Sea'
                        />
                        <img
                            src='https://images.unsplash.com/photo-1485400031595-976c74cf4e25?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29sbGVnZSUyMHNwb3J0fGVufDB8fDB8fHww'
                            className='w-100 shadow-1-strong rounded mb-4'
                            alt='Yosemite National Park'
                        />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

            {/* Team Section */}
            <div className="text-center py-2">
                <h2 className="display-4 fw-bold text-uppercase">OUR TEAM</h2>
                <p className="lead text-muted">Meet the talented people behind our success</p>
            </div>
            <Container className="my-3">
                <Row className="g-4 justify-content-center">
                    <Col xs={12} sm={6} md={4}>
                        <Card className="h-100 shadow-sm team-card">
                            <Card.Img
                                variant="top"
                                src={require('../assets/images/Neha1.jpg')}
                                className="team-member-img"
                            />
                            <Card.Body className="text-center">
                                <Card.Title>Neha Kore</Card.Title>
                                <Card.Subtitle className="mb-3 text-muted">Software Developer</Card.Subtitle>
                                <div className="social-links">
                                    <a href="https://www.linkedin.com/in/neha-kore23/" target="_blank" rel="noopener noreferrer" className="me-3">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Card className="h-100 shadow-sm team-card">
                            <Card.Img
                                variant="top"
                                src={require('../assets/images/Pooja.jpg')}
                                className="team-member-img"
                            />
                            <Card.Body className="text-center">
                                <Card.Title>Pooja Shingare</Card.Title>
                                <Card.Subtitle className="mb-3 text-muted">Backend Developer</Card.Subtitle>
                                <div className="social-links">
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Card className="h-100 shadow-sm team-card">
                            <Card.Img
                                variant="top"
                                src={require('../assets/images/3rd.jpg')}
                                className="team-member-img"
                            />
                            <Card.Body className="text-center">
                                <Card.Title>Kaustubh Joshi</Card.Title>
                                <Card.Subtitle className="mb-3 text-muted">Software Developer</Card.Subtitle>
                                <div className="social-links">
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="me-3">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>


            {/* Customer Reviews Section */}
            <div className="text-center py-2" style={{ marginTop: '2rem' }}>
                <h2 className="display-5 fw-bold text-uppercase">Faculty Reviews</h2>
                <p className="text-muted">What our users say about Aayojan</p>
            </div>
            <Container className="my-3">
                <Carousel indicators={false} controls={false} interval={3000} pause={false}>
                    {[
                        {
                            name: 'Aarav Patel',
                            role: 'Student',
                            img: require('../assets/images/aarav.jpg'),
                            review: 'Aayojan made event registration so easy and fun! The interface is clean and the reminders are super helpful.'
                        },
                        {
                            name: 'Priya Sharma',
                            role: 'Faculty',
                            img: require('../assets/images/priya.jpg'),
                            review: 'Managing workshops and seminars has never been smoother. The analytics and feedback tools are top-notch.'
                        },
                        {
                            name: 'Rahul Mehta',
                            role: 'Event Coordinator',
                            img: require('../assets/images/rahul.jpg'),
                            review: 'I love the seamless communication features. Coordinating with team members is now effortless.'
                        },
                        {
                            name: 'Sneha Desai',
                            role: 'Faculty',
                            img: require('../assets/images/sneha.jpg'),
                            review: 'The event gallery and updates keep me engaged. I never miss out on any campus happenings!'
                        },
                        {
                            name: 'Vikram Singh',
                            role: 'Faculty',
                            img: require('../assets/images/2nd.jpg'),
                            review: "Aayojan's support team is responsive and helpful. The platform is reliable and secure."
                        },
                        {
                            name: 'Meera Joshi',
                            role: 'Faculty',
                            img: require('../assets/images/meera.jpeg'),
                            review: 'The modern design and animations make using Aayojan a joy. Highly recommended for all students!'
                        }
                    ].map((review, idx) => (
                        <Carousel.Item key={idx}>
                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 350 }}>
                                <div className="review-card shadow-lg p-4 bg-white rounded-4 d-flex flex-column align-items-center">
                                    <img
                                        src={review.img}
                                        alt={review.name}
                                        className="rounded-circle mb-3 shadow-sm"
                                        style={{ width: 80, height: 80, objectFit: 'cover', border: '4px solid #f0f0f0' }}
                                    />
                                    <h5 className="fw-bold mb-1">{review.name}</h5>
                                    <span className="text-muted mb-2" style={{ fontSize: 14 }}>{review.role}</span>
                                    <p className="text-center mb-0" style={{ fontSize: 16, color: '#444' }}>
                                        <i className="fas fa-quote-left me-2 text-primary"></i>
                                        {review.review}
                                        <i className="fas fa-quote-right ms-2 text-primary"></i>
                                    </p>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
        </>
    );
};

export default AboutUs;