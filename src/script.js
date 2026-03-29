document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Dummy credentials
    const DUMMY_CPF = '123.456.789-00';
    const DUMMY_PASSWORD = 'password123';

    // Pre-fill dummy credentials for demonstration
    emailInput.value = DUMMY_CPF;
    passwordInput.value = DUMMY_PASSWORD;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const cpf = emailInput.value;
        const password = passwordInput.value;

        // Simple validation feedback
        if (cpf === DUMMY_CPF && password === DUMMY_PASSWORD) {
            alert('Sucesso! Bem-vindo à Care Plus.');
            // Here you could redirect the user or update the UI
            // window.location.href = 'dashboard.html';
        } else {
            alert('Erro! CPF ou senha incorretos.');
            // Clear password field on failure
            passwordInput.value = '';
        }
    });

    // Handle mask for CPF (optional but nice)
    emailInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        
        let maskedValue = value
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2");
            
        e.target.value = maskedValue;
    });

    // Optional: Add toggle password visibility logic
    // (Could be added if needed, following the design system)
});
