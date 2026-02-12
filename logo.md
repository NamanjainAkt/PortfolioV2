Here's the complete code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Naman Jain - Futuristic Logo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: #000;
            color: #fff;
            overflow-x: hidden;
        }

        /* Navbar */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled {
            background: rgba(0, 0, 0, 0.95);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .navbar-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.5rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: padding 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled .navbar-container {
            padding: 1rem 2rem;
        }

        /* Logo Container */
        .logo-container {
            cursor: pointer;
            text-decoration: none;
            position: relative;
        }

        /* Futuristic NJ Logo */
        .futuristic-logo {
            position: relative;
            width: 120px;
            height: 60px;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled .futuristic-logo {
            width: 180px;
            height: 40px;
        }

        /* Hexagon Container */
        .hex-container {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100%;
            height: 100%;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 1;
        }

        .navbar.scrolled .hex-container {
            opacity: 0;
            transform: translateY(-50%) scale(0.5);
            pointer-events: none;
        }

        /* Hexagonal Frame */
        .hexagon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 55px;
            height: 55px;
        }

        .hex-shape {
            position: absolute;
            width: 100%;
            height: 100%;
            clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
            background: transparent;
            border: 2px solid #fff;
            animation: hexRotate 8s linear infinite;
        }

        @keyframes hexRotate {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        /* Inner Hexagon */
        .hex-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 45px;
            height: 45px;
            clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.3);
            animation: hexRotate 6s linear infinite reverse;
        }

        /* NJ Letters Inside Hexagon */
        .nj-letters {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            font-weight: 900;
            color: #fff;
            font-family: 'Arial Black', sans-serif;
            letter-spacing: -2px;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                         0 0 20px rgba(255, 255, 255, 0.3);
            animation: textGlow 2s ease-in-out infinite;
        }

        @keyframes textGlow {
            0%, 100% {
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                             0 0 20px rgba(255, 255, 255, 0.3);
            }
            50% {
                text-shadow: 0 0 20px rgba(255, 255, 255, 0.8),
                             0 0 30px rgba(255, 255, 255, 0.5),
                             0 0 40px rgba(255, 255, 255, 0.3);
            }
        }

        /* Corner Accents */
        .corner-accent {
            position: absolute;
            width: 12px;
            height: 12px;
            border: 2px solid #fff;
        }

        .corner-accent.tl {
            top: -5px;
            left: 15px;
            border-right: none;
            border-bottom: none;
            animation: cornerPulse 2s ease-in-out infinite;
        }

        .corner-accent.tr {
            top: -5px;
            right: 15px;
            border-left: none;
            border-bottom: none;
            animation: cornerPulse 2s ease-in-out infinite 0.5s;
        }

        .corner-accent.bl {
            bottom: -5px;
            left: 15px;
            border-right: none;
            border-top: none;
            animation: cornerPulse 2s ease-in-out infinite 1s;
        }

        .corner-accent.br {
            bottom: -5px;
            right: 15px;
            border-left: none;
            border-top: none;
            animation: cornerPulse 2s ease-in-out infinite 1.5s;
        }

        @keyframes cornerPulse {
            0%, 100% {
                opacity: 0.5;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.2);
            }
        }

        /* Scanning Line */
        .scan-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                #fff 50%, 
                transparent 100%);
            opacity: 0.6;
            animation: scan 3s ease-in-out infinite;
        }

        @keyframes scan {
            0%, 100% {
                transform: translateY(0);
                opacity: 0;
            }
            10% {
                opacity: 0.6;
            }
            50% {
                transform: translateY(55px);
                opacity: 0.6;
            }
            90% {
                opacity: 0.6;
            }
            100% {
                transform: translateY(0);
                opacity: 0;
            }
        }

        /* Particle Effects */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
            opacity: 0;
            animation: particleFloat 4s ease-in-out infinite;
        }

        .particle:nth-child(1) {
            left: 20%;
            animation-delay: 0s;
        }

        .particle:nth-child(2) {
            left: 40%;
            animation-delay: 0.8s;
        }

        .particle:nth-child(3) {
            left: 60%;
            animation-delay: 1.6s;
        }

        .particle:nth-child(4) {
            left: 80%;
            animation-delay: 2.4s;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(60px);
                opacity: 0;
            }
            20%, 80% {
                opacity: 1;
            }
            100% {
                transform: translateY(-10px);
                opacity: 0;
            }
        }

        /* Full Name Text (appears on scroll) */
        .full-name {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            font-size: 24px;
            font-weight: 700;
            color: #fff;
            letter-spacing: 2px;
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            text-transform: uppercase;
        }

        .navbar.scrolled .full-name {
            opacity: 1;
            letter-spacing: 4px;
        }

        /* Letter Animation */
        .full-name span {
            display: inline-block;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar.scrolled .full-name span {
            opacity: 1;
            transform: translateY(0);
        }

        .navbar.scrolled .full-name span:nth-child(1) { transition-delay: 0.1s; }
        .navbar.scrolled .full-name span:nth-child(2) { transition-delay: 0.15s; }
        .navbar.scrolled .full-name span:nth-child(3) { transition-delay: 0.2s; }
        .navbar.scrolled .full-name span:nth-child(4) { transition-delay: 0.25s; }
        .navbar.scrolled .full-name span:nth-child(5) { transition-delay: 0.3s; }
        .navbar.scrolled .full-name span:nth-child(6) { transition-delay: 0.35s; }
        .navbar.scrolled .full-name span:nth-child(7) { transition-delay: 0.4s; }
        .navbar.scrolled .full-name span:nth-child(8) { transition-delay: 0.45s; }
        .navbar.scrolled .full-name span:nth-child(9) { transition-delay: 0.5s; }
        .navbar.scrolled .full-name span:nth-child(10) { transition-delay: 0.55s; }

        /* Underline Effect */
        .full-name::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: #fff;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
        }

        .navbar.scrolled .full-name::after {
            width: 100%;
        }

        /* Navigation Links */
        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }

        .nav-links a {
            color: #888;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
            padding: 0.5rem 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.85rem;
        }

        .nav-links a::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #fff;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .nav-links a:hover {
            color: #fff;
        }

        .nav-links a:hover::before {
            width: 100%;
        }

        /* Scroll Progress */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: #fff;
            z-index: 1001;
            transition: width 0.1s linear;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                        0 0 20px rgba(255, 255, 255, 0.3);
        }

        /* Content */
        .content {
            padding-top: 100px;
            min-height: 250vh;
        }

        .hero {
            padding: 8rem 2rem;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
        }

        .hero h1 {
            font-size: 5rem;
            font-weight: 900;
            margin-bottom: 1.5rem;
            letter-spacing: -0.03em;
            line-height: 1.1;
            text-transform: uppercase;
        }

        .hero p {
            font-size: 1.3rem;
            color: #888;
            line-height: 1.6;
            letter-spacing: 0.5px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hero h1 {
                font-size: 3rem;
            }

            .futuristic-logo {
                width: 100px;
                height: 50px;
            }

            .navbar.scrolled .futuristic-logo {
                width: 160px;
                height: 35px;
            }

            .full-name {
                font-size: 18px;
            }

            .nj-letters {
                font-size: 24px;
            }
        }

        /* Hover Effect on Logo */
        .logo-container:hover .hex-shape {
            animation: hexRotate 2s linear infinite;
            border-color: #fff;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .logo-container:hover .nj-letters {
            animation: textGlow 0.5s ease-in-out;
        }
    </style>
</head>
<body>
    <!-- Scroll Progress -->
    <div class="scroll-progress" id="scrollProgress"></div>

    <!-- Navbar -->
    <nav class="navbar" id="navbar">
        <div class="navbar-container">
            <a href="#" class="logo-container">
                <div class="futuristic-logo">
                    <!-- Hexagon Container -->
                    <div class="hex-container">
                        <div class="hexagon">
                            <div class="hex-shape"></div>
                            <div class="hex-inner"></div>
                            <div class="nj-letters">NJ</div>
                            <div class="scan-line"></div>
                        </div>
                        
                        <!-- Corner Accents -->
                        <div class="corner-accent tl"></div>
                        <div class="corner-accent tr"></div>
                        <div class="corner-accent bl"></div>
                        <div class="corner-accent br"></div>
                        
                        <!-- Particles -->
                        <div class="particles">
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                        </div>
                    </div>
                    
                    <!-- Full Name (appears on scroll) -->
                    <div class="full-name">
                        <span>N</span><span>a</span><span>m</span><span>a</span><span>n</span>
                        <span> </span>
                        <span>J</span><span>a</span><span>i</span><span>n</span>
                    </div>
                </div>
            </a>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#work">Work</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <!-- Content -->
    <div class="content">
        <div class="hero">
            <h1>Futuristic Interface</h1>
            <p>Scroll down to witness the transformation from a sci-fi hexagonal NJ logo into the full name "NAMAN JAIN".</p>
        </div>
    </div>

    <script>
        const navbar = document.getElementById('navbar');
        const scrollProgress = document.getElementById('scrollProgress');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;

            // Update progress bar
            scrollProgress.style.width = progress + '%';

            // Add/remove scrolled class
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    </script>
</body>
</html>
```

Just copy and paste this code - it's ready to use!