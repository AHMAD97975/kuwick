/* ==================== KUWICK ADVANCED INTERACTIONS ==================== */

// ==================== ADVANCED COUNTER ANIMATIONS ====================
class AdvancedCounterAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.target =
      parseInt(element.dataset.target) ||
      parseInt(element.textContent.replace(/[^\d.]/g, ""));
    this.options = {
      duration: options.duration || 2000,
      easing: options.easing || "easeOutCubic",
      suffix: options.suffix || element.textContent.replace(/[\d.]/g, ""),
      prefix: options.prefix || "",
      decimal: options.decimal || 0,
      separator: options.separator || false,
      ...options,
    };
    this.isAnimating = false;
  }

  start() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / this.options.duration, 1);

      const easedProgress = this.applyEasing(progress);
      const currentValue = this.target * easedProgress;

      this.updateDisplay(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        this.updateDisplay(this.target);
      }
    };

    requestAnimationFrame(animate);
  }

  applyEasing(t) {
    const easings = {
      linear: (t) => t,
      easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
      easeInOutCubic: (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
      easeOutBounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (t < 1 / d1) {
          return n1 * t * t;
        } else if (t < 2 / d1) {
          return n1 * (t -= 1.5 / d1) * t + 0.75;
        } else if (t < 2.5 / d1) {
          return n1 * (t -= 2.25 / d1) * t + 0.9375;
        } else {
          return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
      },
    };

    return easings[this.options.easing]
      ? easings[this.options.easing](t)
      : easings.easeOutCubic(t);
  }

  updateDisplay(value) {
    let displayValue = value.toFixed(this.options.decimal);

    if (this.options.separator) {
      displayValue = this.addSeparators(displayValue);
    }

    this.element.textContent =
      this.options.prefix + displayValue + this.options.suffix;
  }

  addSeparators(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

// ==================== PARTICLE SYSTEM ====================
class ParticleSystem {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      particleCount: options.particleCount || 50,
      colors: options.colors || ["#FF8C00", "#00BCD4", "#1B3A56"],
      speed: options.speed || 2,
      size: options.size || 4,
      opacity: options.opacity || 0.7,
      ...options,
    };
    this.particles = [];
    this.animationId = null;

    this.init();
  }

  init() {
    this.createContainer();
    this.createParticles();
    this.animate();
  }

  createContainer() {
    this.canvas = document.createElement("div");
    this.canvas.className = "particles-container";
    this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;
    this.container.appendChild(this.canvas);
  }

  createParticles() {
    for (let i = 0; i < this.options.particleCount; i++) {
      this.createParticle();
    }
  }

  createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";

    const color =
      this.options.colors[
        Math.floor(Math.random() * this.options.colors.length)
      ];
    const size = this.options.size + Math.random() * this.options.size;
    const x = Math.random() * this.container.offsetWidth;
    const y = this.container.offsetHeight + size;

    particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: ${this.options.opacity};
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;

    const particleObj = {
      element: particle,
      x: x,
      y: y,
      speed: this.options.speed + Math.random() * this.options.speed,
      life: 1,
      decay: 0.01 + Math.random() * 0.01,
    };

    this.canvas.appendChild(particle);
    this.particles.push(particleObj);
  }

  animate() {
    this.particles.forEach((particle, index) => {
      particle.y -= particle.speed;
      particle.life -= particle.decay;

      particle.element.style.top = particle.y + "px";
      particle.element.style.opacity = particle.life * this.options.opacity;

      if (particle.y < -10 || particle.life <= 0) {
        particle.element.remove();
        this.particles.splice(index, 1);
        this.createParticle();
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.canvas.remove();
  }
}

// ==================== ADVANCED MOBILE MENU ====================
class AdvancedMobileMenu {
  constructor() {
    this.menuBtn = document.getElementById("mobile-menu-btn");
    this.navLinks = document.querySelector(".nav-links");
    this.overlay = null;
    this.isOpen = false;

    this.init();
  }

  init() {
    if (this.menuBtn && this.navLinks) {
      this.createOverlay();
      this.bindEvents();
      this.addSwipeSupport();
    }
  }

  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.className = "menu-overlay";
    this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        `;
    document.body.appendChild(this.overlay);
  }

  bindEvents() {
    this.menuBtn.addEventListener("click", () => this.toggle());
    this.overlay.addEventListener("click", () => this.close());

    // إغلاق القائمة بمفتاح ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    // إغلاق القائمة عند النقر على رابط
    this.navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => this.close());
    });
  }

  addSwipeSupport() {
    let startX = 0;
    let startY = 0;

    this.navLinks.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.navLinks.addEventListener("touchmove", (e) => {
      if (!this.isOpen) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = Math.abs(startY - currentY);

      // إغلاق القائمة بالسحب لليمين
      if (diffX > 50 && diffY < 100) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.navLinks.classList.add("active");
    this.menuBtn.classList.add("active");
    this.overlay.style.opacity = "1";
    this.overlay.style.visibility = "visible";

    // منع التمرير في الخلفية
    document.body.style.overflow = "hidden";

    this.animateMenuIcon();
  }

  close() {
    this.isOpen = false;
    this.navLinks.classList.remove("active");
    this.menuBtn.classList.remove("active");
    this.overlay.style.opacity = "0";
    this.overlay.style.visibility = "hidden";

    // السماح بالتمرير مرة أخرى
    document.body.style.overflow = "";

    this.animateMenuIcon();
  }

  animateMenuIcon() {
    const spans = this.menuBtn.querySelectorAll("span");
    spans.forEach((span, index) => {
      if (this.isOpen) {
        if (index === 0)
          span.style.transform = "rotate(45deg) translate(5px, 5px)";
        if (index === 1) span.style.opacity = "0";
        if (index === 2)
          span.style.transform = "rotate(-45deg) translate(7px, -6px)";
      } else {
        span.style.transform = "none";
        span.style.opacity = "1";
      }
    });
  }
}

// ==================== ADVANCED FORM HANDLER ====================
class AdvancedFormHandler {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.fields = {};
    this.validators = {};

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.setupFields();
    this.bindEvents();
    this.addRealTimeValidation();
  }

  setupFields() {
    this.form.querySelectorAll("input, select, textarea").forEach((field) => {
      this.fields[field.name] = field;
      this.addFieldWrapper(field);
    });
  }

  addFieldWrapper(field) {
    if (field.parentElement.classList.contains("field-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "field-wrapper";
    field.parentElement.insertBefore(wrapper, field);
    wrapper.appendChild(field);

    // إضافة عنصر للرسائل
    const messageElement = document.createElement("div");
    messageElement.className = "field-message";
    wrapper.appendChild(messageElement);
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // التحقق في الوقت الفعلي
    Object.values(this.fields).forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
      field.addEventListener("input", () => this.clearFieldError(field));
    });
  }

  addRealTimeValidation() {
    // إضافة CSS للتحقق المتقدم
    const style = document.createElement("style");
    style.textContent = `
            .field-wrapper {
                position: relative;
                margin-bottom: 1rem;
            }
            
            .field-wrapper.error input,
            .field-wrapper.error select,
            .field-wrapper.error textarea {
                border-color: #e74c3c;
                box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
            }
            
            .field-wrapper.success input,
            .field-wrapper.success select,
            .field-wrapper.success textarea {
                border-color: #27ae60;
                box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
            }
            
            .field-message {
                font-size: 0.875rem;
                margin-top: 0.5rem;
                min-height: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .field-message.error {
                color: #e74c3c;
            }
            
            .field-message.success {
                color: #27ae60;
            }
            
            .field-wrapper::after {
                content: '';
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .field-wrapper.error::after {
                content: '✕';
                color: #e74c3c;
                opacity: 1;
            }
            
            .field-wrapper.success::after {
                content: '✓';
                color: #27ae60;
                opacity: 1;
            }
        `;
    document.head.appendChild(style);
  }

  validateField(field) {
    const value = field.value.trim();
    const wrapper = field.closest(".field-wrapper");
    const messageElement = wrapper.querySelector(".field-message");

    let isValid = true;
    let message = "";

    // التحقق من الحقول المطلوبة
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      message = "هذا الحقل مطلوب";
    }

    // التحقق من البريد الإلكتروني
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = "البريد الإلكتروني غير صحيح";
      }
    }

    // التحقق من رقم الهاتف
    if (field.type === "tel" && value) {
      const phoneRegex = /^(\+965|965)?[0-9]{8}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ""))) {
        isValid = false;
        message = "رقم الهاتف غير صحيح";
      }
    }

    // التحقق من الطول الأدنى
    if (field.hasAttribute("minlength")) {
      const minLength = parseInt(field.getAttribute("minlength"));
      if (value.length < minLength) {
        isValid = false;
        message = `يجب أن يكون النص على الأقل ${minLength} أحرف`;
      }
    }

    this.updateFieldState(wrapper, messageElement, isValid, message);
    return isValid;
  }

  updateFieldState(wrapper, messageElement, isValid, message) {
    wrapper.classList.remove("error", "success");
    messageElement.classList.remove("error", "success");

    if (isValid) {
      wrapper.classList.add("success");
      messageElement.classList.add("success");
      messageElement.textContent = "";
    } else {
      wrapper.classList.add("error");
      messageElement.classList.add("error");
      messageElement.textContent = message;
    }
  }

  clearFieldError(field) {
    const wrapper = field.closest(".field-wrapper");
    const messageElement = wrapper.querySelector(".field-message");

    wrapper.classList.remove("error");
    messageElement.classList.remove("error");
    messageElement.textContent = "";
  }

  async handleSubmit(e) {
    e.preventDefault();

    // التحقق من جميع الحقول
    let isFormValid = true;
    Object.values(this.fields).forEach((field) => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showFormError("يرجى تصحيح الأخطاء أولاً");
      return;
    }

    // إرسال النموذج
    await this.submitForm();
  }

  async submitForm() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;

    try {
      // تعطيل الزر وتغيير النص
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>';

      // جمع البيانات
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // محاكاة الإرسال
      await this.simulateSubmission(data);

      // إظهار رسالة النجاح
      this.showSuccess("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      this.form.reset();
      this.clearAllFieldStates();
    } catch (error) {
      this.showFormError(
        "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
    }
  }

  async simulateSubmission(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("تم إرسال البيانات:", data);
        resolve();
      }, 2000);
    });
  }

  clearAllFieldStates() {
    Object.values(this.fields).forEach((field) => {
      const wrapper = field.closest(".field-wrapper");
      const messageElement = wrapper.querySelector(".field-message");

      wrapper.classList.remove("error", "success");
      messageElement.classList.remove("error", "success");
      messageElement.textContent = "";
    });
  }

  showFormError(message) {
    window.KuwickApp?.showNotification(message, "error");
  }

  showSuccess(message) {
    window.KuwickApp?.showNotification(message, "success");
  }
}

// ==================== SCROLL REVEAL ANIMATION ====================
class ScrollRevealAnimation {
  constructor() {
    this.elements = document.querySelectorAll("[data-reveal]");
    this.observer = null;

    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    this.setupObserver();
    this.elements.forEach((el) => this.observer.observe(el));
  }

  setupObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.revealElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  revealElement(element) {
    const revealType = element.dataset.reveal || "up";
    const delay = parseInt(element.dataset.revealDelay) || 0;

    setTimeout(() => {
      element.classList.add("revealed", `reveal-${revealType}`);
    }, delay);
  }
}

// ==================== TYPING ANIMATION ====================
class TypingAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.options = {
      speed: options.speed || 50,
      cursor: options.cursor || "|",
      loop: options.loop || false,
      ...options,
    };

    this.currentIndex = 0;
    this.isDeleting = false;

    this.init();
  }

  init() {
    this.element.textContent = "";
    this.type();
  }

  type() {
    const shouldDelete = this.isDeleting;
    const currentText = this.text.substring(0, this.currentIndex);

    this.element.textContent = currentText + this.options.cursor;

    if (!shouldDelete && this.currentIndex < this.text.length) {
      this.currentIndex++;
      setTimeout(() => this.type(), this.options.speed);
    } else if (shouldDelete && this.currentIndex > 0) {
      this.currentIndex--;
      setTimeout(() => this.type(), this.options.speed / 2);
    } else if (!shouldDelete && this.currentIndex === this.text.length) {
      if (this.options.loop) {
        setTimeout(() => {
          this.isDeleting = true;
          this.type();
        }, 1000);
      } else {
        this.element.textContent = this.text;
      }
    } else if (shouldDelete && this.currentIndex === 0) {
      this.isDeleting = false;
      this.type();
    }
  }
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
  // تشغيل العدادات المتقدمة
  document.querySelectorAll(".stat-number[data-target]").forEach((element) => {
    const counter = new AdvancedCounterAnimation(element, {
      easing: "easeOutBounce",
      duration: 2500,
    });

    // تشغيل العداد عند الوصول إليه
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counter.start();
          observer.unobserve(element);
        }
      });
    });

    observer.observe(element);
  });

  // تشغيل القائمة المتقدمة للهاتف المحمول
  new AdvancedMobileMenu();

  // تشغيل معالج النماذج المتقدم
  new AdvancedFormHandler("contact-form");

  // تشغيل حركات الإظهار
  new ScrollRevealAnimation();

  // تشغيل نظام الجسيمات في الخلفية
  const heroSection = document.querySelector(".hero");
  if (heroSection && window.innerWidth > 768) {
    new ParticleSystem(heroSection, {
      particleCount: 30,
      speed: 1.5,
      colors: ["rgba(255, 140, 0, 0.3)", "rgba(0, 188, 212, 0.3)"],
    });
  }

  // تشغيل تأثير الكتابة للعنوان الرئيسي
  const heroTitle = document.querySelector(".hero-title .gradient-text");
  if (heroTitle) {
    new TypingAnimation(heroTitle, {
      speed: 100,
      cursor: "",
    });
  }
});

// ==================== PERFORMANCE MONITOR ====================
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.monitorFPS();
    this.monitorMemory();
    this.logPerformanceMetrics();
  }

  monitorFPS() {
    let frames = 0;
    let lastTime = performance.now();

    const countFPS = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = frames;
        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(countFPS);
    };

    requestAnimationFrame(countFPS);
  }

  monitorMemory() {
    if ("memory" in performance) {
      setInterval(() => {
        this.metrics.memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576),
          total: Math.round(performance.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
        };
      }, 5000);
    }
  }

  logPerformanceMetrics() {
    setInterval(() => {
      console.log("Kuwick Performance Metrics:", this.metrics);
    }, 10000);
  }
}

// تشغيل مراقب الأداء في وضع التطوير
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  new PerformanceMonitor();
}

// ==================== EXPORT CLASSES FOR EXTERNAL USE ====================
window.KuwickInteractions = {
  AdvancedCounterAnimation,
  ParticleSystem,
  AdvancedMobileMenu,
  AdvancedFormHandler,
  ScrollRevealAnimation,
  TypingAnimation,
  PerformanceMonitor,
};
