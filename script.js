document.addEventListener("DOMContentLoaded", function() {
  // Auto-detect system theme preference and set initial theme
  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme;
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = systemPrefersDark ? 'dark' : 'light';
    }
    
    setTheme(initialTheme);
  }

  // Set theme function
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }

  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Initialize theme on page load
  initializeTheme();

  // Modal functionality with faster animations
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      // Force reflow to ensure display change is applied
      modal.offsetHeight;
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 200); // Matches the CSS transition duration
    }
  };

  // Close modal when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      const modalId = e.target.id;
      closeModal(modalId);
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });

  // Dropdown functionality with faster animations
  window.toggleDropdown = function(header) {
    const dropdown = header.parentElement;
    const content = dropdown.querySelector('.dropdown-content');
    const arrow = header.querySelector('.dropdown-arrow');
    
    dropdown.classList.toggle('active');
    
    if (dropdown.classList.contains('active')) {
      // Calculate the actual height needed
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      content.style.maxHeight = '0px';
    }
  };

  // Smooth scrolling for any internal links (if added later)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading states for external links
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
      // Add a subtle loading indicator
      const originalText = this.innerHTML;
      this.style.opacity = '0.7';
      setTimeout(() => {
        this.style.opacity = '1';
      }, 300);
    });
  });

  // Optimize animations for better performance
  function optimizeAnimations() {
    // Reduce animations on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                          navigator.deviceMemory <= 2 ||
                          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isLowEndDevice) {
      document.documentElement.style.setProperty('--transition', 'all 0.1s ease');
      document.documentElement.style.setProperty('--transition-fast', 'all 0.05s ease');
      document.documentElement.style.setProperty('--modal-transition', 'all 0.15s ease');
    }
  }

  // Initialize animation optimizations
  optimizeAnimations();

  // Preload critical resources
  function preloadResources() {
    // Preload Font Awesome icons that might be used
    const iconPreload = document.createElement('link');
    iconPreload.rel = 'preload';
    iconPreload.as = 'style';
    iconPreload.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(iconPreload);
  }

  // Initialize preloading
  preloadResources();

  // Add intersection observer for performance optimization
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe all islands for potential future animations
    document.querySelectorAll('.island').forEach(island => {
      observer.observe(island);
    });
  }

  // Performance monitoring
  function logPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
      });
    }
  }

  // Initialize performance monitoring in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
  }
});

