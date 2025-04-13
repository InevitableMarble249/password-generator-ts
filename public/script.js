document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Check for saved theme preference or use system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Toggle dark mode
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    async function generatePassword() {
        try {
            // Show loading spinner
            loadingSpinner.style.display = 'block';
            generateButton.disabled = true;
            passwordOutput.value = '';
            
            const response = await fetch('/generate');
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            const data = await response.json();
            passwordOutput.value = data.password;
        } catch (error) {
            console.error('Error generating password:', error);
            passwordOutput.value = 'Error generating password. Please try again.';
        } finally {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
            generateButton.disabled = false;
        }
    }

    generateButton.addEventListener('click', () => generatePassword());

    copyButton.addEventListener('click', () => {
        passwordOutput.select();
        document.execCommand('copy');
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 1500);
    });

    // Generate a password when the page loads
    generatePassword();
}); 