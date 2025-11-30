// ===== GSAP SETUP =====
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== MOBILE MENU TOGGLE WITH GSAP =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
    if (!isExpanded) {
      // Open menu
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      if (!prefersReducedMotion) {
        // Animate menu panel
        gsap.to(mobileMenu, {
          x: 0,
          opacity: 1,
          duration: 0.36,
          ease: "power2.out"
        });
        
        // Stagger animate menu links
        gsap.to(mobileMenuLinks, {
          x: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.1
        });
      }
    } else {
      // Close menu
      if (!prefersReducedMotion) {
        gsap.to(mobileMenu, {
          x: '-100%',
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      } else {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
  
  // Close mobile menu when clicking on a link
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      
      if (!prefersReducedMotion) {
        gsap.to(mobileMenu, {
          x: '-100%',
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      } else {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close mobile menu when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      hamburger.setAttribute('aria-expanded', 'false');
      
      if (!prefersReducedMotion) {
        gsap.to(mobileMenu, {
          x: '-100%',
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      } else {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}

// ===== HEADER ENTRANCE & SCROLL BEHAVIOR =====
const header = document.querySelector('.header');

if (header && !prefersReducedMotion) {
  // Initial entrance
  gsap.to(header, {
    opacity: 1,
    y: 0,
    duration: 0.2,
    ease: "power2.out",
    delay: 0.1
  });
  
  // Scroll behavior - compact header
  ScrollTrigger.create({
    start: 80,
    onUpdate: (self) => {
      if (self.direction === 1) {
        header.classList.add('scrolled');
      } else if (self.scroll() < 80) {
        header.classList.remove('scrolled');
      }
    }
  });
} else if (header) {
  gsap.set(header, { opacity: 1 });
}

// ===== HERO SECTION ANIMATION =====
const heroTitle = document.querySelector('.hero__title');
const heroSubtitle = document.querySelector('.hero__subtitle');
const heroCtaGroup = document.querySelector('.hero__cta-group');
const heroTrustBadges = document.querySelector('.hero__trust-badges');

if (!prefersReducedMotion) {
  const heroTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });
  
  heroTimeline
    .to(heroTitle, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: 0.3
    })
    .to(heroSubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.36
    }, "-=0.4")
    .to(heroCtaGroup, {
      opacity: 1,
      y: 0,
      duration: 0.3
    }, "-=0.2")
    .to(heroTrustBadges, {
      opacity: 1,
      y: 0,
      duration: 0.3
    }, "-=0.1");
    
  // Hero image subtle scale
  const heroImages = document.querySelectorAll('.hero__bg-image');
  heroImages.forEach(img => {
    gsap.to(img, {
      scale: 1.05,
      duration: 1,
      ease: "power2.out",
      paused: true
    });
  });
} else {
  gsap.set([heroTitle, heroSubtitle, heroCtaGroup, heroTrustBadges], { opacity: 1 });
}

// ===== IMAGE SLIDER LOGIC WITH GSAP =====
const images = document.querySelectorAll('.hero__bg-image');
const indicators = document.querySelectorAll('.hero__indicator');
let currentSlide = 0;
let isTransitioning = false;

function changeSlide(nextSlide) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  const currentImage = images[currentSlide];
  const nextImage = images[nextSlide];
  
  if (!prefersReducedMotion) {
    // Animate out current image
    gsap.to(currentImage, {
      x: '-100%',
      duration: 1,
      ease: "power2.in"
    });
    
    // Animate in next image
    gsap.fromTo(nextImage, 
      { x: '100%' },
      {
        x: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          currentImage.classList.remove('active');
          gsap.set(currentImage, { x: '100%' });
          isTransitioning = false;
        }
      }
    );
  } else {
    currentImage.classList.remove('active');
    nextImage.classList.add('active');
    isTransitioning = false;
  }
  
  nextImage.classList.add('active');
  indicators[currentSlide].classList.remove('active');
  indicators[nextSlide].classList.add('active');
  currentSlide = nextSlide;
}

function nextSlide() {
  const next = (currentSlide + 1) % images.length;
  changeSlide(next);
}

let slideInterval = setInterval(nextSlide, 13000);

indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', () => {
    if (index !== currentSlide && !isTransitioning) {
      clearInterval(slideInterval);
      changeSlide(index);
      slideInterval = setInterval(nextSlide, 13000);
    }
  });
});

// ===== SCROLL-TRIGGERED ANIMATIONS =====

// Service Cards
const serviceCards = document.querySelectorAll('.service-card');
if (!prefersReducedMotion) {
  serviceCards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.36,
      delay: index * 0.08,
      ease: "power2.out"
    });
  });
} else {
  gsap.set(serviceCards, { opacity: 1 });
}

// Problem Cards
const problemCards = document.querySelectorAll('.problem-card');
if (!prefersReducedMotion) {
  problemCards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.36,
      delay: index * 0.08,
      ease: "power2.out"
    });
  });
} else {
  gsap.set(problemCards, { opacity: 1 });
}

// Step Cards (How We Work)
const stepCards = document.querySelectorAll('.step-card');
if (!prefersReducedMotion) {
  stepCards.forEach((card, index) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.36,
      delay: index * 0.08,
      ease: "power2.out"
    });
  });
} else {
  gsap.set(stepCards, { opacity: 1 });
}

// Gallery Items
const galleryItems = document.querySelectorAll('.item-wrapper');
if (!prefersReducedMotion) {
  galleryItems.forEach((item, index) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: index * 0.1,
      ease: "power2.out"
    });
  });
} else {
  gsap.set(galleryItems, { opacity: 1 });
}

// FAQ Items
const faqItems = document.querySelectorAll('.faq-item');
if (!prefersReducedMotion) {
  faqItems.forEach((item, index) => {
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.36,
      delay: index * 0.08,
      ease: "power2.out"
    });
  });
} else {
  gsap.set(faqItems, { opacity: 1 });
}

// ===== GALLERY NAVIGATION =====
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    window.open('/gallery.html', '_self');
  });
});

// ===== HERO PARALLAX (SUBTLE) =====
if (!prefersReducedMotion) {
  const heroSection = document.querySelector('.hero');
  const activeHeroImage = document.querySelector('.hero__bg-image.active');
  
  if (heroSection && activeHeroImage) {
    gsap.to(activeHeroImage, {
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.5
      },
      yPercent: 15,
      ease: "none"
    });
  }
}

// ===== BUTTON MICRO-INTERACTIONS =====
const allButtons = document.querySelectorAll('.btn, .btn-cta, .btn-primary, .btn-secondary');

allButtons.forEach(button => {
  if (!prefersReducedMotion) {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        y: -2,
        duration: 0.12,
        ease: "power2.out"
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        y: 0,
        duration: 0.12,
        ease: "power2.out"
      });
    });
  }
});

// ===== WHATSAPP FLOAT ENTRANCE =====
const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat && !prefersReducedMotion) {
  gsap.from(whatsappFloat, {
    scale: 0.6,
    opacity: 0,
    duration: 0.36,
    ease: "back.out(1.7)",
    delay: 1.5
  });
}

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});