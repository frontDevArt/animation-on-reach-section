import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function useInView(threshold = 0.5) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!hasAnimated && entry.isIntersecting) {
          setHasAnimated(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated, threshold]);

  return [ref, isInView, hasAnimated];
}

function useSectionsInView(sectionsData) {
  return sectionsData.map(({ threshold = 0.5, ...sectionData }) => {
    const [ref, inView, hasAnimated] = useInView(threshold);
    return { ...sectionData, ref, inView, hasAnimated };
  });
}



function App() {
  const [activeSection, setActiveSection] = useState('home');
  const nav = useRef(null);

  const handleNavClick = (section) => {
    setActiveSection(section);
    const sectionElement = section.current;
    const navbarHeight = nav.current.offsetHeight;
    const sectionTop = sectionElement.offsetTop - navbarHeight;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });
  };

  const sectionsData = [
    {
      id: 'home',
      title: 'Home section',
      description: 'Simple text for the home section.',
    },
    {
      id: 'about',
      title: 'About section',
      description: 'Simple text for the about section.',
    },
    {
      id: 'contacts',
      title: 'Contacts section',
      description: 'Simple text for the contacts section.',
    },
  ];

  const sections = useSectionsInView(sectionsData);

  useEffect(() => {
    const activeSection = sections.find((section) => section.inView)?.id;
    if (activeSection) {
      setActiveSection(activeSection);
    }
  }, [sections]);

  return (
    <div className="App">
      <nav ref={nav} className="sticky">
        <ul>
          {sections.map((section) => (
            <li className={activeSection === section.id ? 'active' : ''} key={section.id}>
              <button onClick={() => handleNavClick(section.ref)}>{section.title}</button>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        {sections.map(({ id, title, description, ref, hasAnimated }) => (
          <section
            key={id}
            id={id}
            ref={ref}
            className={`${activeSection === id ? 'active' : ''} ${hasAnimated ? 'fadeIn' : ''}`}
          >
            <div className={`h1 ${hasAnimated ? 'fadeIn' : ''}`}>{title}</div>
            <div className={`p ${hasAnimated ? 'fadeIn' : ''}`}>{description}</div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;
