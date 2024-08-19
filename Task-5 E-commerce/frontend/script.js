// Initialize Stripe with your public key
const stripe = Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Replace with your Stripe public key

// Create an instance of Elements
const elements = stripe.elements();
const cardElement = elements.create('card'); // Create an instance of the card Element

// Add the card Element to the page
cardElement.mount('#card-element');

// Add event listener to the form
document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the amount from your cart summary (e.g., $10.00)
    const amount = parseInt(document.getElementById('total-price').textContent.replace('$', '').replace('.', ''), 10) * 100; // Convert to cents

    try {
        // Create a payment intent on your server
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: amount }),
        });

        const { clientSecret } = await response.json();

        // Confirm the payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    // Optional: Add billing details if needed
                },
            },
        });

        if (error) {
            // Display error.message in your UI
            document.getElementById('card-errors').textContent = error.message;
        } else if (paymentIntent.status === 'succeeded') {
            // Payment succeeded
            console.log('Payment succeeded!');
            // Optionally redirect to a success page or show a success message
            window.location.href = '/success.html'; // Redirect to a success page
        }
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        document.getElementById('card-errors').textContent = 'An unexpected error occurred. Please try again later.';
    }
});
