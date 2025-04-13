document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const copyButton = document.getElementById('copyButton');

    async function generatePassword() {
        try {
            const response = await fetch('/generate');
            const data = await response.json();
            passwordOutput.value = data.password;
        } catch (error) {
            console.error('Error generating password:', error);
            passwordOutput.value = 'Error generating password';
        }
    }

    generateButton.addEventListener('click', generatePassword);

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