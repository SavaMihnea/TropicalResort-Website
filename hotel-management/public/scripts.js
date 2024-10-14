document.addEventListener('DOMContentLoaded', function() {
    // Event listener for registration form submission
    document.getElementById('registerForm')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Incorrect password.');
            return;
        }

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, age, email, username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Your account has been successfully created!');
                    window.location.href = 'login.html';
                } else {
                    alert('Error creating account. Please try again.');
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // Event listener for login form submission
    document.getElementById('loginForm')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const loginMessage = document.getElementById('loginMessage');

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.setItem('username', username); // Save username in storage
                    if (username === 'sava.mihnea') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'user.html';
                    }
                } else {
                    loginMessage.textContent = 'The account is invalid. Retry or create a new account if you are not registered.';
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // Event listener for booking form submission
    document.getElementById('bookingForm')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
        const numberOfPeople = document.getElementById('people').value;
        const singleRooms = document.getElementById('singleRooms').value;
        const doubleRooms = document.getElementById('doubleRooms').value;
        const tripleRooms = document.getElementById('tripleRooms').value;
        const apartmentRooms = document.getElementById('apartmentRooms').value;
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;

        fetch('/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, age, numberOfPeople, checkin, checkout, singleRooms, doubleRooms, tripleRooms, apartmentRooms })
        })
            .then(response => response.text())
            .then(data => {
                alert('Booking successfully made!');
                // Optionally redirect or reset the form here
            })
            .catch(error => console.error('Error:', error));
    });

    // Function to format date (YYYY-MM-DD)
    function formatDate(dateString) {
        return dateString.split('T')[0];
    }

    // Function to fetch bookings from the server
    function fetchBookings() {
        fetch('/getBookings')
            .then(response => response.json())
            .then(data => {
                const bookingsBody = document.getElementById('bookingsBody');
                bookingsBody.innerHTML = ''; // Clear existing rows

                data.forEach(booking => {
                    const bookingContainer = document.createElement('div');
                    bookingContainer.classList.add('booking-container');

                    bookingContainer.innerHTML = `
                        <p class="contact-text"><strong>Name:</strong> ${booking.Name}</p>
                        <p class="contact-text"><strong>Email:</strong> ${booking.Email}</p>
                        <p class="contact-text"><strong>Age:</strong> ${booking.Age}</p>
                        <p class="contact-text"><strong>Number of People:</strong> ${booking.NumberOfPeople}</p>
                        <p class="contact-text"><strong>Single Rooms:</strong> ${booking.SingleRooms}</p>
                        <p class="contact-text"><strong>Double Rooms:</strong> ${booking.DoubleRooms}</p>
                        <p class="contact-text"><strong>Triple Rooms:</strong> ${booking.TripleRooms}</p>
                        <p class="contact-text"><strong>Apartment Rooms:</strong> ${booking.ApartmentRooms}</p>
                        <p class="contact-text"><strong>Check-In Date:</strong> ${formatDate(booking.CheckInDate)}</p>
                        <p class="contact-text"><strong>Check-Out Date:</strong> ${formatDate(booking.CheckOutDate)}</p>
                        <button class="delete-button" onclick="deleteBooking(${booking.Id})">Delete</button>
                        <button class="modify-button" onclick="openModifyModal(${booking.Id})">Modify</button>
                    `;

                    bookingsBody.appendChild(bookingContainer);
                });
            })
            .catch(error => console.error('Error fetching bookings:', error));
    }

    // Fetch bookings when the admin page loads
    if (window.location.pathname === '/admin.html') {
        fetchBookings();
    }

    // Function to fetch user bookings from the server
    function fetchUserBookings() {
        fetch('/getUserBookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: sessionStorage.getItem('username') })
        })
            .then(response => response.json())
            .then(data => {
                const userBookingsBody = document.getElementById('userBookingsBody');
                userBookingsBody.innerHTML = ''; // Clear existing rows

                if (data.length > 0) {
                    data.forEach(booking => {
                        const bookingContainer = document.createElement('div');
                        bookingContainer.classList.add('booking-container');

                        bookingContainer.innerHTML = `
                        <p class="contact-text"><strong>Name:</strong> ${booking.Name}</p>
                        <p class="contact-text"><strong>Email:</strong> ${booking.Email}</p>
                        <p class="contact-text"><strong>Age:</strong> ${booking.Age}</p>
                        <p class="contact-text"><strong>Number of People:</strong> ${booking.NumberOfPeople}</p>
                        <p class="contact-text"><strong>Single Rooms:</strong> ${booking.SingleRooms}</p>
                        <p class="contact-text"><strong>Double Rooms:</strong> ${booking.DoubleRooms}</p>
                        <p class="contact-text"><strong>Triple Rooms:</strong> ${booking.TripleRooms}</p>
                        <p class="contact-text"><strong>Apartment Rooms:</strong> ${booking.ApartmentRooms}</p>
                        <p class="contact-text"><strong>Check-In Date:</strong> ${formatDate(booking.CheckInDate)}</p>
                        <p class="contact-text"><strong>Check-Out Date:</strong> ${formatDate(booking.CheckOutDate)}</p>
                        <button class="delete-button" onclick="deleteBooking(${booking.Id})">Delete</button>
                    `;

                        userBookingsBody.appendChild(bookingContainer);
                    });
                } else {
                    userBookingsBody.innerHTML = '<p>There are no bookings made.</p>';
                }
            })
            .catch(error => console.error('Error fetching user bookings:', error));
    }

    // Fetch user bookings when the user page loads
    if (window.location.pathname === '/user.html') {
        fetchUserBookings();
    }

    // Function to delete a booking
    window.deleteBooking = function(id) {
        fetch('/deleteBooking', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        })
            .then(response => response.text())
            .then(data => {
                alert('Booking deleted');
                if (window.location.pathname === '/admin.html') {
                    fetchBookings(); // Refresh the bookings list
                } else if (window.location.pathname === '/user.html') {
                    fetchUserBookings(); // Refresh the user bookings list
                }
            })
            .catch(error => console.error('Error deleting booking:', error));
    }

    // Function to open the modify modal and populate it with booking details
    window.openModifyModal = function(id) {
        fetch(`/getBookingById/${id}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('modifyName').value = data.Name;
                document.getElementById('modifyEmail').value = data.Email;
                document.getElementById('modifyAge').value = data.Age;
                document.getElementById('modifyPeople').value = data.NumberOfPeople;
                document.getElementById('modifySingleRooms').value = data.SingleRooms;
                document.getElementById('modifyDoubleRooms').value = data.DoubleRooms;
                document.getElementById('modifyTripleRooms').value = data.TripleRooms;
                document.getElementById('modifyApartmentRooms').value = data.ApartmentRooms;
                document.getElementById('modifyCheckin').value = formatDate(data.CheckInDate);
                document.getElementById('modifyCheckout').value = formatDate(data.CheckOutDate);
                document.getElementById('modifyBookingId').value = id;

                document.getElementById('modifyModal').style.display = 'block';
            })
            .catch(error => console.error('Error fetching booking details:', error));
    }

    // Function to close the modify modal
    window.closeModifyModal = function() {
        document.getElementById('modifyModal').style.display = 'none';
    }

    // Event listener for modify form submission
    document.getElementById('modifyForm')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = document.getElementById('modifyBookingId').value;
        const name = document.getElementById('modifyName').value;
        const email = document.getElementById('modifyEmail').value;
        const age = document.getElementById('modifyAge').value;
        const numberOfPeople = document.getElementById('modifyPeople').value;
        const singleRooms = document.getElementById('modifySingleRooms').value;
        const doubleRooms = document.getElementById('modifyDoubleRooms').value;
        const tripleRooms = document.getElementById('modifyTripleRooms').value;
        const apartmentRooms = document.getElementById('modifyApartmentRooms').value;
        const checkin = document.getElementById('modifyCheckin').value;
        const checkout = document.getElementById('modifyCheckout').value;

        fetch('/modifyBooking', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, name, email, age, numberOfPeople, checkin, checkout, singleRooms, doubleRooms, tripleRooms, apartmentRooms })
        })
            .then(response => response.text())
            .then(data => {
                alert('Booking modified successfully!');
                closeModifyModal();
                fetchBookings(); // Refresh the bookings list
            })
            .catch(error => console.error('Error modifying booking:', error));
    });
});
