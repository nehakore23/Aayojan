import React from 'react';
import './home.css';

const previousWorkshops = [
    {
        img: require('../assets/images/1st.jpg'),
        title: 'Web Development Bootcamp 2024',
        desc: 'Hands-on HTML, CSS, JS & React workshop for beginners.'
    },
    {
        img: require('../assets/images/2nd.jpg'),
        title: 'AI & ML Introduction',
        desc: 'Interactive session on Artificial Intelligence and Machine Learning.'
    },
    {
        img: require('../assets/images/3rd.jpg'),
        title: 'UI/UX Design Sprint',
        desc: 'Design thinking and rapid prototyping for modern apps.'
    }
];

const Workshops = () => (
    <section className="events-section" style={{ minHeight: '100vh', paddingBottom: 0, background: '#fff' }}>
        <h1
            className="events-title"
            style={{
                textAlign: 'center',
                marginBottom: 10,
                color: 'black'
            }}
        >
            Workshops
        </h1>

        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 20, color: '#333', marginBottom: 32, marginTop: 10, fontWeight: 500 }}>
                Welcome to our Workshops page! Here you can find information about upcoming and previous workshops organized by <span style={{ color: '#7f4dff', fontWeight: 700 }}>Aayojan</span>.<br />
                Our workshops are designed to empower students and professionals with practical skills and real-world knowledge. Explore our latest sessions and relive the highlights below!
            </p>
            <div style={{ margin: '32px 0 56px 0' }}>
                <h2 style={{ fontWeight: 700, fontSize: 26, margin: '0 0 24px', color: '#111', letterSpacing: 1 }}>Workshop Highlights</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 20,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        maxWidth: '100%',
                        margin: '0 auto',
                        padding: '0 8px'
                    }}
                >
                    {[

                        'dG4Q9chCyyQ',
                        'b3B24wl3gCQ',
                        'iDuV-BCvtaY',
                        'E4mOS3kFsr0',
                        '802SUkEZZs0',
                        't9ZZymyrXKQ',
                        '9P5X_HLLjk8',
                        'K1gQ6rEiq48'
                    ].map((id, idx) => {

                        const isShort = id === 'dG4Q9chCyyQ';
                        const embedUrl = isShort
                            ? `https://www.youtube.com/embed/${id}?feature=share`
                            : `https://www.youtube.com/embed/${id}`;
                        return (
                            <div
                                key={id}
                                className="video-highlight-animated-border"
                                style={{
                                    width: '100%',
                                    minWidth: 0,
                                    maxWidth: 400,
                                    background: '#fff',
                                    borderRadius: 14,
                                    boxShadow: '0 2px 12px rgba(127,77,255,0.08)',
                                    padding: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxSizing: 'border-box',
                                    position: 'relative',
                                    zIndex: 0
                                }}
                            >
                                <iframe
                                    width="100%"
                                    height="180"
                                    src={embedUrl}
                                    title={`YouTube video player ${idx + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    style={{
                                        borderRadius: 12,
                                        boxShadow: '0 4px 24px rgba(127,77,255,0.10)',
                                        marginBottom: 8,
                                        width: '100%'
                                    }}
                                ></iframe>
                                <div style={{ fontSize: 15, color: '#666', textAlign: 'center', fontWeight: 500 }}>
                                    <em>Workshop Video {idx + 1}</em>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ textAlign: 'center', margin: '40px 0 16px 0', padding: '0 8px' }}>
                <h2 className="ezy__travel3-heading mb-3" style={{ color: '#7f4dff', fontWeight: 700, fontSize: 32, marginBottom: 10 }}>Previous Workshops Gallery</h2>
                <p className="ezy__travel3-sub-heading mb-0" style={{ fontSize: 17, color: '#555', maxWidth: 700, margin: '0 auto' }}>
                    Explore some of our most popular and impactful workshops from the past. Each session brought together passionate learners and industry experts for hands-on learning and collaboration.
                </p>
            </div>
            <section className="ezy__travel3" style={{ marginTop: 0, padding: 0, background: 'transparent' }}>
                <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 8px' }}>
                    <div className="row" style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-8px', marginRight: '-8px' }}>

                        <div className="col-md-6 col-lg-3" style={{ flex: '1 1 220px', maxWidth: '100%', padding: '8px', minWidth: 0 }}>
                            <div className="card ezy__travel3-item border-0 rounded-0 mt-4" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div className="position-relative">
                                    <img src="https://www.hire4event.com/blogs/wp-content/uploads/2019/02/COLLEGE-EVENT.jpg" alt="College Fest" className="img-fluid w-100" style={{ borderRadius: 12, height: 160, objectFit: 'cover', width: '100%' }} />
                                </div>
                                <div className="card-body p-4 text-center" style={{ padding: 16 }}>
                                    <h5 className="mb-1">Annual Tech Fest</h5>
                                    <p className="mb-1">Aayojan College</p>
                                    <p className="mb-0" style={{ color: '#7f4dff', fontWeight: 600, fontSize: 15 }}>12 March 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3" style={{ flex: '1 1 220px', maxWidth: '100%', padding: '8px', minWidth: 0 }}>
                            <div className="card ezy__travel3-item border-0 rounded-0 mt-4" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div className="position-relative">
                                    <img src="https://png.pngtree.com/thumb_back/fh260/background/20231221/pngtree-folk-culture-night-fish-lantern-square-dance-photography-with-pictures-photo-image_15553055.png" alt="Cultural Night" className="img-fluid w-100" style={{ borderRadius: 12, height: 160, objectFit: 'cover', width: '100%' }} />
                                </div>
                                <div className="card-body p-4 text-center" style={{ padding: 16 }}>
                                    <h5 className="mb-1">Cultural Night</h5>
                                    <p className="mb-1">IGDTUW</p>
                                    <p className="mb-0" style={{ color: '#7f4dff', fontWeight: 600, fontSize: 15 }}>28 Feb 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3" style={{ flex: '1 1 220px', maxWidth: '100%', padding: '8px', minWidth: 0 }}>
                            <div className="card ezy__travel3-item border-0 rounded-0 mt-4" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div className="position-relative">
                                    <img src="https://media.assettype.com/freepressjournal/2025-01-30/ke63852i/DSC0323.JPG" alt="Sports Meet" className="img-fluid w-100" style={{ borderRadius: 12, height: 160, objectFit: 'cover', width: '100%' }} />
                                </div>
                                <div className="card-body p-4 text-center" style={{ padding: 16 }}>
                                    <h5 className="mb-1">Inter-College Sports Meet</h5>
                                    <p className="mb-1">Delhi University</p>
                                    <p className="mb-0" style={{ color: '#7f4dff', fontWeight: 600, fontSize: 15 }}>5 Jan 2024</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3" style={{ flex: '1 1 220px', maxWidth: '100%', padding: '8px', minWidth: 0 }}>
                            <div className="card ezy__travel3-item border-0 rounded-0 mt-4" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div className="position-relative">
                                    <img src="https://nitkkr.ac.in/wp-content/uploads/2024/08/IMG20230825135404-scaled.jpg" alt="Seminar" className="img-fluid w-100" style={{ borderRadius: 12, height: 160, objectFit: 'cover', width: '100%' }} />
                                </div>
                                <div className="card-body p-4 text-center" style={{ padding: 16 }}>
                                    <h5 className="mb-1">National Seminar</h5>
                                    <p className="mb-1">BITS Pilani</p>
                                    <p className="mb-0" style={{ color: '#7f4dff', fontWeight: 600, fontSize: 15 }}>18 Dec 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>
);

export default Workshops;