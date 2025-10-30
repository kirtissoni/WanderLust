const nodemailer = require("nodemailer");

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send booking confirmation email to user
const sendBookingConfirmation = async (bookingDetails) => {
  const {
    userEmail,
    userName,
    listingTitle,
    listingLocation,
    checkIn,
    checkOut,
    numberOfGuests,
    totalPrice,
    nights,
    bookingId,
    fullName,
    contact,
  } = bookingDetails;

  const transporter = createTransporter();

  const checkInDate = new Date(checkIn).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const checkOutDate = new Date(checkOut).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `🎉 Booking Confirmed - ${listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .value {
            color: #333;
          }
          .total-price {
            background: #667eea;
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Your adventure awaits at ${listingTitle}</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName}! 👋</h2>
          <p>Great news! Your booking has been confirmed. Here are your booking details:</p>
          
          <div class="booking-details">
            <h3 style="color: #667eea; margin-top: 0;">📋 Booking Information</h3>
            
            <div class="detail-row">
              <span class="label">Booking ID:</span>
              <span class="value">#${bookingId}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Property:</span>
              <span class="value">${listingTitle}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Location:</span>
              <span class="value">${listingLocation}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Guest Name:</span>
              <span class="value">${fullName || userName}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Contact:</span>
              <span class="value">${contact || "N/A"}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Check-in:</span>
              <span class="value">${checkInDate}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Check-out:</span>
              <span class="value">${checkOutDate}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Number of Guests:</span>
              <span class="value">${numberOfGuests}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Number of Nights:</span>
              <span class="value">${nights}</span>
            </div>
          </div>
          
          <div class="total-price">
            💰 Total Amount: ₹${totalPrice.toLocaleString("en-IN")}
          </div>
          
          <p><strong>What's Next?</strong></p>
          <ul>
            <li>Save this email for your records</li>
            <li>Arrive at the property on your check-in date</li>
            <li>Contact the host if you have any questions</li>
            <li>Have a wonderful stay! ✨</li>
          </ul>
          
          <center>
            <a href="http://localhost:5173/bookings/my-bookings" class="button">View My Bookings</a>
          </center>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing WanderLust! 🏡</p>
          <p style="font-size: 12px; margin-top: 10px;">
            Need help? Reply to this email or contact our support team.
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    console.log("🚀 Sending email to:", userEmail);
    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending booking email:", error.message);
    console.error("Full error:", error);
    throw error; // Re-throw to see in controller
  }
};

// Send booking cancellation email
const sendBookingCancellation = async (cancellationDetails) => {
  const {
    userEmail,
    userName,
    listingTitle,
    bookingId,
    checkIn,
    checkOut,
  } = cancellationDetails;

  const transporter = createTransporter();

  const checkInDate = new Date(checkIn).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const checkOutDate = new Date(checkOut).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Booking Cancelled - ${listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #dc3545;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 0 0 10px 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Cancelled</h1>
        </div>
        
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Your booking has been successfully cancelled.</p>
          
          <p><strong>Booking Details:</strong></p>
          <ul>
            <li>Booking ID: #${bookingId}</li>
            <li>Property: ${listingTitle}</li>
            <li>Check-in: ${checkInDate}</li>
            <li>Check-out: ${checkOutDate}</li>
          </ul>
          
          <p>We hope to see you again soon! 🌟</p>
          
          <p>Best regards,<br>WanderLust Team</p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending cancellation email:", error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingCancellation,
};
