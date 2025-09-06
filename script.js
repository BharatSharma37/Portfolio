
    // Loading Screen
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
      }, 1000);
    });

    // Neural Network Canvas Animation
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let animationId;
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    function createParticles() {
      particles = [];
      const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 1,
          connections: []
        });
      }
    }
    
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.x -= dx * force * 0.01;
          particle.y -= dy * force * 0.01;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(108, 92, 231, 0.7)';
        ctx.fill();
        
        // Reset connections
        particle.connections = [];
        
        // Check connections with other particles
        particles.slice(i + 1).forEach((otherParticle, j) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            particle.connections.push({ particle: otherParticle, distance });
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(108, 92, 231, ${0.3 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animateParticles);
    }
    
    // Initialize
    resizeCanvas();
    createParticles();
    animateParticles();
    
    // Event listeners
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    // Performance optimization for mobile
    window.addEventListener('deviceorientation', () => {
      if (window.innerWidth < 768) {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.opacity = '0.3';
      }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
      const header = document.getElementById('header');
      const backToTop = document.getElementById('backToTop');
      
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
        backToTop.classList.add('visible');
      } else {
        header.classList.remove('scrolled');
        backToTop.classList.remove('visible');
      }
    });

    // Mobile menu functionality
    function toggleMobileMenu() {
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    function closeMobileMenu() {
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Theme toggle
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update particles color for light theme
      if (newTheme === 'light') {
        canvas.style.opacity = '0.4';
      } else {
        canvas.style.opacity = '0.8';
      }
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Scroll reveal animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Animate counters
          if (entry.target.classList.contains('stat-number')) {
            animateCounter(entry.target);
          }
        }
      });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal, .slide-in-left, .slide-in-right').forEach(el => {
      observer.observe(el);
    });
    
    // Observe stat numbers
    document.querySelectorAll('.stat-number').forEach(el => {
      observer.observe(el);
    });

    // Counter animation
    function animateCounter(element) {
      const target = parseFloat(element.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current * 10) / 10;
        }
      }, 16);
    }

    // Smooth scrolling
    function scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Navigation active state
    window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');
      
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });

    // Form submission
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const form = e.target;
      const submitBtn = form.querySelector('.form-submit');
      const message = document.getElementById('formMessage');
      
      // Show loading state
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      try {
        // Replace this with actual form submission logic
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        message.textContent = 'Thank you! Your message has been sent successfully.';
        message.className = 'form-message success';
        message.style.display = 'block';
        
        // Reset form
        form.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
          message.style.display = 'none';
        }, 5000);
        
      } catch (error) {
        // Show error message
        message.textContent = 'Sorry, there was an error sending your message. Please try again.';
        message.className = 'form-message error';
        message.style.display = 'block';
      } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Preload critical images
    const preloadImages = () => {
      const imageUrls = [
        // Add your actual image URLs here when you have them
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    // Call preload function
    preloadImages();

    // Service Worker registration for PWA features
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Error handling
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });

    // Performance monitoring
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
      }
    });

    // Accessibility improvements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    });
    
    function handleGesture() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - could implement navigation to next section
          console.log('Swipe left detected');
        } else {
          // Swipe right - could implement navigation to previous section
          console.log('Swipe right detected');
        }
      }
    }

    console.log('🚀 Portfolio loaded successfully!');
    console.log('💻 Built with passion by Bharat Sharma');
    console.log('📧 Contact: hello@bharatsharma.dev');
