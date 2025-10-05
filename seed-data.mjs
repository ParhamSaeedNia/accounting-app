const BASE_URL = 'http://localhost:3000';

// Sample data
const teachers = [
  { name: 'John Smith', email: 'john.smith@example.com', hourlyRate: 50 },
  { name: 'Sarah Johnson', email: 'sarah.johnson@example.com', hourlyRate: 45 },
  { name: 'Mike Wilson', email: 'mike.wilson@example.com', hourlyRate: 55 },
  { name: 'Emily Davis', email: 'emily.davis@example.com', hourlyRate: 48 },
];

const packages = [
  {
    packageName: 'Premium React Course',
    price: 1200,
    expenses: { infrastructure: 100, teacher: 600, marketing: 200 },
  },
  {
    packageName: 'Advanced JavaScript',
    price: 800,
    expenses: { infrastructure: 80, teacher: 400, marketing: 150 },
  },
  {
    packageName: 'Node.js Backend',
    price: 1000,
    expenses: { infrastructure: 90, teacher: 500, marketing: 180 },
  },
  {
    packageName: 'Full Stack Bootcamp',
    price: 2000,
    expenses: { infrastructure: 200, teacher: 1000, marketing: 300 },
  },
];

const sessions = [
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-15T10:00:00.000Z',
    duration: 2,
    title: 'React Fundamentals',
    isConfirmed: true,
  },
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-16T14:00:00.000Z',
    duration: 1.5,
    title: 'JavaScript ES6+',
    isConfirmed: true,
  },
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-17T09:00:00.000Z',
    duration: 3,
    title: 'Node.js Basics',
    isConfirmed: true,
  },
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-18T11:00:00.000Z',
    duration: 2.5,
    title: 'Database Design',
    isConfirmed: true,
  },
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-19T15:00:00.000Z',
    duration: 2,
    title: 'API Development',
    isConfirmed: true,
  },
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-20T10:30:00.000Z',
    duration: 1.5,
    title: 'React Hooks',
    isConfirmed: true,
  },
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-21T13:00:00.000Z',
    duration: 2,
    title: 'Express.js',
    isConfirmed: true,
  },
  {
    teacherId: '',
    packageId: '',
    sessionDate: '2024-01-22T16:00:00.000Z',
    duration: 1,
    title: 'Testing Basics',
    isConfirmed: true,
  },
];

const transactions = [
  {
    name: 'Student Payment - Alice Brown',
    amount: 1200,
    type: 'income',
    tags: ['student-payment', 'premium-package'],
    transactionDate: '2024-01-15T10:00:00.000Z',
    taxRate: 0.1,
  },
  {
    name: 'Student Payment - Bob Green',
    amount: 800,
    type: 'income',
    tags: ['student-payment', 'javascript-course'],
    transactionDate: '2024-01-16T14:00:00.000Z',
    taxRate: 0.1,
  },
  {
    name: 'Student Payment - Carol White',
    amount: 1000,
    type: 'income',
    tags: ['student-payment', 'nodejs-course'],
    transactionDate: '2024-01-17T09:00:00.000Z',
    taxRate: 0.1,
  },
  {
    name: 'Student Payment - David Black',
    amount: 2000,
    type: 'income',
    tags: ['student-payment', 'bootcamp'],
    transactionDate: '2024-01-18T11:00:00.000Z',
    taxRate: 0.1,
  },
  {
    name: 'AWS Hosting',
    amount: 150,
    type: 'expense',
    tags: ['infrastructure', 'hosting'],
    transactionDate: '2024-01-15T08:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'GitHub Pro',
    amount: 50,
    type: 'expense',
    tags: ['tools', 'development'],
    transactionDate: '2024-01-16T09:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'Figma Professional',
    amount: 30,
    type: 'expense',
    tags: ['tools', 'design'],
    transactionDate: '2024-01-17T10:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'Google Ads Campaign',
    amount: 200,
    type: 'expense',
    tags: ['marketing', 'advertising'],
    transactionDate: '2024-01-18T12:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'Slack Premium',
    amount: 80,
    type: 'expense',
    tags: ['tools', 'communication'],
    transactionDate: '2024-01-19T11:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'Teacher Salary - John Smith',
    amount: 100,
    type: 'expense',
    tags: ['teacher-salary', 'john-smith'],
    transactionDate: '2024-01-20T17:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'Teacher Salary - Sarah Johnson',
    amount: 90,
    type: 'expense',
    tags: ['teacher-salary', 'sarah-johnson'],
    transactionDate: '2024-01-20T17:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'Teacher Salary - Mike Wilson',
    amount: 110,
    type: 'expense',
    tags: ['teacher-salary', 'mike-wilson'],
    transactionDate: '2024-01-20T17:00:00.000Z',
    taxRate: 0,
  },
  {
    name: 'Teacher Salary - Emily Davis',
    amount: 96,
    type: 'expense',
    tags: ['teacher-salary', 'emily-davis'],
    transactionDate: '2024-01-20T17:00:00.000Z',
    taxRate: 0,
  },
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...\n');

    // Create teachers
    console.log('👨‍🏫 Creating teachers...');
    const createdTeachers = [];
    for (const teacher of teachers) {
      const response = await fetch(`${BASE_URL}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacher),
      });
      const data = await response.json();
      createdTeachers.push(data);
      console.log(`✅ Created teacher: ${teacher.name}`);
    }

    // Create packages
    console.log('\n📦 Creating packages...');
    const createdPackages = [];
    for (const pkg of packages) {
      const response = await fetch(`${BASE_URL}/packages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg),
      });
      const data = await response.json();
      createdPackages.push(data);
      console.log(`✅ Created package: ${pkg.packageName}`);
    }

    // Create sessions
    console.log('\n📚 Creating sessions...');
    for (let i = 0; i < sessions.length; i++) {
      const session = {
        ...sessions[i],
        teacherId: createdTeachers[i % createdTeachers.length]._id,
        packageId: createdPackages[i % createdPackages.length]._id,
      };
      const response = await fetch(`${BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
      console.log(`✅ Created session: ${session.title}`);
    }

    // Create transactions
    console.log('\n💰 Creating transactions...');
    for (const transaction of transactions) {
      const response = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      console.log(`✅ Created transaction: ${transaction.name}`);
    }

    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdTeachers.length} teachers created`);
    console.log(`- ${createdPackages.length} packages created`);
    console.log(`- ${sessions.length} sessions created`);
    console.log(`- ${transactions.length} transactions created`);
    console.log(
      '\n🔗 You can now view the dashboard at: http://localhost:3000/dashboard',
    );
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
}

seedData();
