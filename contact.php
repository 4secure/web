<?php
/**
* Contact Form Handler for Four Secure
* Processes contact form submissions and sends emails
*/

// Enable CORS for AJAX requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Your receiving email address - CHANGE THIS TO YOUR ACTUAL EMAIL
$receiving_email_address = 'info@4secu.com';

// Check if this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Direct access not allowed']);
    exit;
}

// Validate required fields
$required_fields = ['first-name', 'last-name', 'email', 'company', 'subject', 'message'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Required fields are missing: ' . implode(', ', $missing_fields)
    ]);
    exit;
}

// Validate email
$email = $_POST['email'];
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

// Validate phone if provided (optional field)
$phone = $_POST['phone'] ?? '';
if (!empty($phone) && !preg_match('/^[0-9+\s\-\(\)]{7,20}$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid phone number']);
    exit;
}

// Sanitize inputs
$first_name = htmlspecialchars($_POST['first-name'], ENT_QUOTES, 'UTF-8');
$last_name = htmlspecialchars($_POST['last-name'], ENT_QUOTES, 'UTF-8');
$company = htmlspecialchars($_POST['company'], ENT_QUOTES, 'UTF-8');
$service = isset($_POST['service']) ? htmlspecialchars($_POST['service'], ENT_QUOTES, 'UTF-8') : 'Not specified';
$subject = htmlspecialchars($_POST['subject'], ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($_POST['message'], ENT_QUOTES, 'UTF-8');

$full_name = $first_name . ' ' . $last_name;

// Prepare email content
$email_subject = "Contact Form: $subject - $full_name";

$email_body = "<html><body>";
$email_body .= "<h2>New Contact Form Submission</h2>";
$email_body .= "<p><strong>Name:</strong> $full_name</p>";
$email_body .= "<p><strong>Email:</strong> $email</p>";
$email_body .= "<p><strong>Phone:</strong> " . (!empty($phone) ? $phone : 'Not provided') . "</p>";
$email_body .= "<p><strong>Company:</strong> $company</p>";
$email_body .= "<p><strong>Service Interest:</strong> " . ucfirst(str_replace('-', ' ', $service)) . "</p>";
$email_body .= "<p><strong>Subject:</strong> $subject</p>";
$email_body .= "<p><strong>Message:</strong></p>";
$email_body .= "<p>" . nl2br($message) . "</p>";
$email_body .= "<hr>";
$email_body .= "<p><em>This message was sent from the Four Secure contact form.</em></p>";
$email_body .= "</body></html>";

// Email headers for HTML email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: $full_name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_sent = mail($receiving_email_address, $email_subject, $email_body, $headers);

if ($mail_sent) {
    // Optional: Send auto-reply to user
    $auto_reply_subject = "Thank you for contacting Four Secure";
    $auto_reply_body = "<html><body>";
    $auto_reply_body .= "<h2>Thank You for Contacting Four Secure</h2>";
    $auto_reply_body .= "<p>Dear $full_name,</p>";
    $auto_reply_body .= "<p>Thank you for reaching out to us. We have received your inquiry and will get back to you within 24-48 hours.</p>";
    $auto_reply_body .= "<p><strong>Your message:</strong><br>" . nl2br($message) . "</p>";
    $auto_reply_body .= "<p>If you have an urgent security concern, please call our emergency hotline.</p>";
    $auto_reply_body .= "<p>Best regards,<br>Four Secure Team</p>";
    $auto_reply_body .= "</body></html>";
    
    $auto_reply_headers = "MIME-Version: 1.0\r\n";
    $auto_reply_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $auto_reply_headers .= "From: Four Secure <info@4secu.com>\r\n";
    
    mail($email, $auto_reply_subject, $auto_reply_body, $auto_reply_headers);
    
    echo json_encode(['success' => true, 'message' => 'OK']);
} else {
    echo json_encode(['success' => false, 'message' => 'Unable to send email. Please try again later.']);
}
?>