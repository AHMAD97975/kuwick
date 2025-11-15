/* ==================== KUWICK MAIN JAVASCRIPT ==================== */

// ==================== LOADING SCREEN ====================
document.addEventListener("DOMContentLoaded", function () {
  // إخفاء شاشة التحميل بعد تحميل الصفحة
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
      // إزالة العنصر من DOM بعد انتهاء الانتقال
      setTimeout(() => {
        loadingScreen.remove();
      }, 800);
    }
  }, 3000); // ثلاث ثوانِ
});

// ==================== SMOOTH SCROLLING ====================
function initSmoothScrolling() {
  // التمرير السلس للروابط الداخلية
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("#header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // إغلاق القائمة المحمولة إذا كانت مفتوحة
        const mobileNav = document.querySelector(".nav-links");
        if (mobileNav && mobileNav.classList.contains("active")) {
          mobileNav.classList.remove("active");
          document.querySelector(".mobile-menu-btn").classList.remove("active");
        }
      }
    });
  });
}

// ==================== NAVBAR SCROLL EFFECTS ====================
function initNavbarScrollEffects() {
  const header = document.getElementById("header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // إضافة class عند التمرير
    if (scrollTop > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // إخفاء/إظهار الـ navbar عند التمرير
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      // التمرير لأسفل - إخفاء الـ navbar
      header.style.transform = "translateY(-100%)";
    } else {
      // التمرير لأعلى - إظهار الـ navbar
      header.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });
}

// ==================== ACTIVE NAVIGATION LINKS ====================
function initActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveLink() {
    let current = "";
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink(); // تشغيل عند التحميل
}

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;

        // إضافة class للعناصر المرئية
        element.classList.add("revealed");

        // تشغيل حركات مخصصة حسب نوع العنصر
        if (element.classList.contains("feature-card")) {
          element.style.animationPlayState = "running";
        }

        if (element.classList.contains("stat-number")) {
          animateCounter(element);
        }

        // إيقاف المراقبة بعد الظهور
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // مراقبة العناصر
  const elementsToObserve = document.querySelectorAll(
    ".feature-card, .step, .testimonial-card, .stat-item, .reveal-up, .reveal-left, .reveal-right, .reveal-scale"
  );

  elementsToObserve.forEach((el) => {
    observer.observe(el);
  });
}

// ==================== COUNTER ANIMATION ====================
function animateCounter(element) {
  const target =
    parseInt(element.dataset.target) ||
    parseInt(element.textContent.replace(/[^\d.]/g, ""));
  const suffix = element.textContent.replace(/[\d.]/g, "");
  const duration = 2000; // مدة الحركة بالميلي ثانية
  const step = target / (duration / 16); // 60 FPS
  let current = 0;

  const timer = setInterval(() => {
    current += step;

    if (current >= target) {
      element.textContent = formatNumber(target) + suffix;
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current)) + suffix;
    }
  }, 16);
}

// تنسيق الأرقام
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 !== 0 ? 1 : 0) + "K";
  }
  return num.toString();
}

// ==================== SCROLL PROGRESS INDICATOR ====================
function initScrollProgress() {
  // إنشاء شريط التقدم
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    progressBar.style.width = `${scrollPercent}%`;
  });
}

// ==================== BACK TO TOP BUTTON ====================
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// ==================== LAZY LOADING FOR IMAGES ====================
function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;

          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add("loaded");
            imageObserver.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");

      // تحديث أيقونة الهامبرغر
      const spans = mobileMenuBtn.querySelectorAll("span");
      spans.forEach((span, index) => {
        if (mobileMenuBtn.classList.contains("active")) {
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
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener("click", (e) => {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        mobileMenuBtn.classList.remove("active");

        // إعادة تعيين أيقونة الهامبرغر
        const spans = mobileMenuBtn.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "none";
          span.style.opacity = "1";
        });
      }
    });
  }
}

// ==================== FORM VALIDATION AND SUBMISSION ====================
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // جمع بيانات النموذج
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // التحقق من البيانات
      if (validateForm(data)) {
        try {
          // محاكاة إرسال النموذج
          const submitBtn = contactForm.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;

          // تغيير النص أثناء الإرسال
          submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>';
          submitBtn.disabled = true;

          // محاكاة تأخير الشبكة
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // إظهار رسالة النجاح
          showNotification(
            "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.",
            "success"
          );
          contactForm.reset();

          // إعادة تعيين الزر
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        } catch (error) {
          console.error("خطأ في إرسال النموذج:", error);
          showNotification(
            "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
            "error"
          );
        }
      }
    });
  }
}

// التحقق من صحة النموذج
function validateForm(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("الاسم مطلوب ويجب أن يكون على الأقل حرفين");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("البريد الإلكتروني غير صحيح");
  }

  if (!data.subject) {
    errors.push("يرجى اختيار موضوع الرسالة");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("الرسالة مطلوبة ويجب أن تكون على الأقل 10 أحرف");
  }

  if (errors.length > 0) {
    showNotification(errors.join("<br>"), "error");
    return false;
  }

  return true;
}

// التحقق من البريد الإلكتروني
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = "info") {
  // إنشاء عنصر الإشعار
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // إضافة الأنماط المطلوبة
  addNotificationStyles();

  // إضافة للصفحة
  document.body.appendChild(notification);

  // إظهار الإشعار
  setTimeout(() => notification.classList.add("show"), 100);

  // إزالة الإشعار تلقائياً
  const autoRemove = setTimeout(() => {
    removeNotification(notification);
  }, 5000);

  // إزالة عند النقر على زر الإغلاق
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      clearTimeout(autoRemove);
      removeNotification(notification);
    });
}

function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  };
  return icons[type] || icons.info;
}

function removeNotification(notification) {
  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function addNotificationStyles() {
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #27ae60;
            }
            
            .notification-error {
                border-left-color: #e74c3c;
            }
            
            .notification-warning {
                border-left-color: #f39c12;
            }
            
            .notification-info {
                border-left-color: #00bcd4;
            }
            
            .notification-content {
                padding: 15px 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-content i:first-child {
                font-size: 18px;
                flex-shrink: 0;
            }
            
            .notification-success i:first-child { color: #27ae60; }
            .notification-error i:first-child { color: #e74c3c; }
            .notification-warning i:first-child { color: #f39c12; }
            .notification-info i:first-child { color: #00bcd4; }
            
            .notification-content span {
                flex: 1;
                color: #333;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: #f0f0f0;
                color: #666;
            }
        `;
    document.head.appendChild(styles);
  }
}

// ==================== PERFORMANCE OPTIMIZATIONS ====================
function initPerformanceOptimizations() {
  // تأخير تحميل الخطوط غير الضرورية
  if ("fonts" in document) {
    document.fonts.ready.then(() => {
      console.log("جميع الخطوط محملة");
    });
  }

  // تحسين الصور للشبكات البطيئة
  if ("connection" in navigator) {
    const connection = navigator.connection;
    if (
      connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g"
    ) {
      // تقليل جودة الصور للشبكات البطيئة
      document.querySelectorAll("img").forEach((img) => {
        if (img.src && !img.dataset.optimized) {
          // يمكن إضافة معالجة للصور هنا
          img.dataset.optimized = "true";
        }
      });
    }
  }
}

// ==================== ACCESSIBILITY ENHANCEMENTS ====================
function initAccessibility() {
  // إضافة دعم لوحة المفاتيح للعناصر التفاعلية
  document
    .querySelectorAll(".btn, .feature-card, .testimonial-card")
    .forEach((element) => {
      if (!element.hasAttribute("tabindex")) {
        element.setAttribute("tabindex", "0");
      }

      element.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          element.click();
        }
      });
    });

  // إضافة نص بديل للصور التي تفتقر إليه
  document.querySelectorAll("img:not([alt])").forEach((img) => {
    img.setAttribute("alt", "صورة Kuwick");
  });

  // إضافة تسميات للروابط
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (!link.getAttribute("aria-label") && link.textContent.trim() === "") {
      link.setAttribute("aria-label", "رابط داخلي");
    }
  });
}

// ==================== ERROR HANDLING ====================
window.addEventListener("error", (e) => {
  console.error("خطأ JavaScript:", e.error);
  // يمكن إضافة تتبع الأخطاء هنا
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("وعد مرفوض:", e.reason);
  // يمكن إضافة تتبع الأخطاء هنا
});

// ==================== INITIALIZATION ====================
function initializeApp() {
  // تشغيل جميع الوظائف عند تحميل DOM
  initSmoothScrolling();
  initNavbarScrollEffects();
  initActiveNavigation();
  initScrollAnimations();
  initScrollProgress();
  initBackToTop();
  initLazyLoading();
  initMobileMenu();
  initContactForm();
  initPerformanceOptimizations();
  initAccessibility();

  console.log("تم تشغيل تطبيق Kuwick بنجاح!");
}

// بدء التطبيق
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// ==================== UTILITY FUNCTIONS ====================

// دالة لتشغيل دالة عند التمرير مع تحسين الأداء
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// دالة لتأخير تشغيل دالة
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// دالة للتحقق من رؤية العنصر
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// دالة لتحويل البيانات إلى JSON بأمان
function safeStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error("خطأ في تحويل البيانات:", error);
    return "{}";
  }
}

// دالة لتحليل JSON بأمان
function safeParse(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("خطأ في تحليل البيانات:", error);
    return null;
  }
}

// ==================== EXPORT FOR EXTERNAL USE ====================
window.KuwickApp = {
  showNotification,
  animateCounter,
  throttle,
  debounce,
  isElementInViewport,
  safeStringify,
  safeParse,
};
