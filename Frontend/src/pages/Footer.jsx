import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function Footer() {
  return (
    <MDBFooter style={{ backgroundColor: '#e0f7fa' }} className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Connect with us on social media:</span>
        </div>
        <div>
          <a href='#' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='facebook-f' />
          </a>
          <a href='#' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='twitter' />
          </a>
          <a href='#' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='instagram' />
          </a>
          <a href='#' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='linkedin' />
          </a>
        </div>
      </section>

      <section>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='4' lg='5' xl='5' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon color='secondary' icon='calendar-alt' className='me-3' />
                Aayojan
              </h6>
              <p>
                Aayojan is your all-in-one college event management platform.
                From planning and promotion to execution, it simplifies the process for organizers and participants alike.
              </p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful Links</h6>
              <p><a href="/home" className='text-reset'>Events</a></p>
              <p><a href="/workshops" className='text-reset'>Workshops</a></p>
              <p><a href="/seminars" className='text-reset'>Seminars</a></p>
              <p><a href="/about-us" className='text-reset'>About Us</a></p>
            </MDBCol>

            <MDBCol md='4' lg='4' xl='4' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p><MDBIcon color='secondary' icon='map-marker-alt' className='me-2' />
                Pune, Maharashtra, India
              </p>
              <p><MDBIcon color='secondary' icon='envelope' className='me-3' />
                support@aayojan.com
              </p>
              <p><MDBIcon color='secondary' icon='phone' className='me-3' /> +91 98765 43210</p>
              <p><MDBIcon color='secondary' icon='clock' className='me-3' /> Mon - Sat: 9am - 6pm</p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: '#b2ebf2' }}>
        © {new Date().getFullYear()} Copyright:
        <a className='text-reset fw-bold' href='#'> Aayojan.com</a>
      </div>
    </MDBFooter>
  );
}
