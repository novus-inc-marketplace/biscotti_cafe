'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useInView } from 'react-intersection-observer';

export default function Home() {
    const { data: session } = useSession();

    const [heroRef, heroInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [servicesRef, servicesInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [portfolioRef, portfolioInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [testimonialsRef, testimonialsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [contactRef, contactInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme) {
            document.body.classList.add(currentTheme);
        }

        themeToggleBtn?.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            let theme = 'light-theme';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark-theme';
            }
            localStorage.setItem('theme', theme);
        });
    }, []);

  return (
        <>
            <header>
                <nav>
                    <div className="container">
                        <h1><a href="#">Novus Inc</a></h1>
                        <ul>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#portfolio">Portfolio</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="#testimonials">Testimonials</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                        <button id="theme-toggle" className="btn-theme-toggle">Toggle Theme</button>
                        {session ? (
                            <button onClick={() => signOut()} className="btn-theme-toggle ml-4">Sign Out</button>
                        ) : (
                            <a href="/auth/signin" className="btn-theme-toggle ml-4">Sign In</a>
                        )}
                    </div>
                </nav>
            </header>

            <section id="hero" className={`hero ${heroInView ? 'animate-fade-in-up' : ''}`} ref={heroRef}>
                <div className="container">
                    <h2>Bringing the digital world to reality.</h2>
                    <p>At Novus Inc, we don't just build websites; we craft digital experiences that resonate with your audience and drive real results. We focus on delivering exceptional value, building trust, and creating highly converting online presences that truly stand out.</p>
                    <a href="#contact" className="btn">Let's Build Something Great Together!</a>
                </div>
            </section>

            <section id="services" className={`services ${servicesInView ? 'animate-fade-in-up' : ''}`} ref={servicesRef}>
                <div className="container">
                    <h3>Our Services</h3>
                    <div className="service-grid">
                        <div className="service-item">
                            <h4>Web Development</h4>
                            <p>From stunning front-end designs to robust back-end systems, we build dynamic, scalable, and secure web solutions tailored to your unique business needs. We specialize in modern frameworks to ensure top-tier performance and user experience.</p>
                        </div>
                        <div className="service-item">
                            <h4>SEO Optimization</h4>
                            <p>Unlock your online potential with our expert SEO strategies. We optimize your website to rank higher in search results, attract more organic traffic, and connect you with clients actively searching for your services.</p>
                        </div>
                        <div className="service-item">
                            <h4>UI/UX Design</h4>
                            <p>Crafting intuitive, engaging, and beautiful user interfaces is at the heart of what we do. Our UI/UX designs focus on creating seamless user journeys that delight your visitors and convert them into loyal customers.</p>
                        </div>
                        <div className="service-item">
                            <h4>Digital Marketing</h4>
                            <p>Beyond development, we empower your business with comprehensive digital marketing strategies. From social media campaigns to content marketing, we help you reach your target audience, build your brand, and drive significant growth.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="portfolio" className={`portfolio ${portfolioInView ? 'animate-fade-in-up' : ''}`} ref={portfolioRef}>
                <div className="container">
                    <h3>Our Portfolio</h3>
                    <div className="portfolio-grid">
                        <div className="portfolio-item">
                            <img src="https://via.placeholder.com/300x200?text=Gym+Template" alt="Gym Template Project" />
                            <h4>Gym Template Website</h4>
                            <p>A comprehensive web solution for gyms, enabling easy sign-ups, class scheduling, and member management. Built with a focus on user experience and efficient booking workflows.</p>
                            <a href="https://novus-inc-marketplace.github.io/gymtemplate1" target="_blank" rel="noopener noreferrer" className="btn mt-4">View Live Project</a>
                        </div>
                        <div className="portfolio-item">
                            <img src="https://via.placeholder.com/300x200?text=Project+2" alt="Project 2" />
                            <h4>E-commerce Store Redesign</h4>
                            <p>Revamped an existing online store to improve user navigation, optimize product display, and integrate secure payment gateways, resulting in a 25% increase in conversion rates.</p>
                        </div>
                        <div className="portfolio-item">
                            <img src="https://via.placeholder.com/300x200?text=Project+3" alt="Project 3" />
                            <h4>SaaS Product Landing Page</h4>
                            <p>Designed and developed a high-converting landing page for a new SaaS product, featuring engaging animations, clear calls-to-action, and lead capture forms that boosted sign-ups by 40%.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="testimonials" className={`testimonials ${testimonialsInView ? 'animate-fade-in-up' : ''}`} ref={testimonialsRef}>
                <div className="container">
                    <h3>What Our Clients Say</h3>
                    <div className="testimonial-item">
                        <p>"Working with Novus Inc was a game-changer for our business. Their web development expertise is unparalleled, and their approachable team made the entire process seamless. Highly recommended!"</p>
                        <span>- Sarah L., CEO of Tech Innovations</span>
                    </div>
                    <div className="testimonial-item">
                        <p>"Novus Inc transformed our online presence! Their digital marketing strategies brought us a significant increase in leads, and their friendly communication made it a pleasure to collaborate."</p>
                        <span>- Mark T., Small Business Owner</span>
                    </div>
                    <div className="testimonial-item">
                        <p>"The UI/UX design Novus Inc delivered for our platform exceeded all expectations. It's not just beautiful; it's incredibly intuitive, leading to fantastic user engagement."</p>
                        <span>- Emily R., Product Manager at Creative Solutions</span>
                    </div>
                </div>
            </section>

            <section id="contact" className={`contact ${contactInView ? 'animate-fade-in-up' : ''}`} ref={contactRef}>
                <div className="container">
                    <h3>Get in Touch</h3>
                    <p>Ready to bring your digital vision to reality? Contact us for a free consultation. We're always available except for Sundays!</p>
                    <form>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Your Message" rows={5}></textarea>
                        <button type="submit" className="btn">Send Message</button>
                    </form>
                    <div className="contact-info mt-8 text-center">
                        <p>Email: <a href="mailto:novusincmarketplace@gmail.com" className="text-primary-color hover:underline">novusincmarketplace@gmail.com</a></p>
                        <p>Phone: <a href="tel:+254798808105" className="text-primary-color hover:underline">+254 798 808105</a></p>
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <p>&copy; 2024 Novus Inc. All rights reserved.</p>
        </div>
      </footer>
        </>
  );
}
