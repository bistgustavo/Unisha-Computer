import { sendOrderConfirmationEmail } from './src/utils/emailService.js';

// Test order data
const testOrderData = {
  order: {
    order_id: 'TEST-ORDER-12345',
    createdAt: new Date(),
    status: 'pending',
    total_amount: 299.97
  },
  user: {
    user_id: 'test-user-123',
    first_name: 'Gaurav',
    last_name: 'Bist',
    email: 'bistgaurav024@gmail.com', // Replace with your test email
    username: 'bist_gaurav'
  },
  items: [
    {
      product: {
        product_id: 'prod-1',
        name: 'Wireless Bluetooth Headphones',
        image_url1: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        category: { name: 'Electronics' },
        sku: 'WBH-001'
      },
      quantity: 1,
      price_at_purchase: 199.99
    },
    {
      product: {
        product_id: 'prod-2',
        name: 'Smartphone Case',
        image_url1: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300',
        category: { name: 'Accessories' },
        sku: 'SPC-002'
      },
      quantity: 2,
      price_at_purchase: 49.99
    }
  ],
  address: {
    address_id: 'addr-123',
    full_name: 'John Doe',
    address_line_1: '123 Main Street',
    address_line_2: 'Apartment 4B',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567'
  }
};

console.log('🧪 Testing email functionality...');
console.log('📧 Sending test order confirmation email...');

sendOrderConfirmationEmail(testOrderData)
  .then(result => {
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📨 Message ID:', result.messageId);
      console.log('💡 Check your inbox for the test email');
    } else {
      console.log('❌ Email failed to send:', result.message);
      if (result.error) {
        console.log('🔍 Error details:', result.error);
      }
    }
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
  });

console.log('');
console.log('📝 Note: Make sure to configure your email settings in .env file:');
console.log('   - EMAIL_HOST (e.g., smtp.gmail.com)');
console.log('   - EMAIL_PORT (e.g., 587)');  
console.log('   - EMAIL_USER (your email address)');
console.log('   - EMAIL_PASSWORD (your app password)');
console.log('   - COMPANY_EMAIL (your company email)');
console.log('   - COMPANY_NAME (your company name)');
