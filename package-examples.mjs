// Example package with different expense categories
const examplePackages = [
  {
    packageName: 'Premium React Course',
    price: 1200,
    expenses: {
      infrastructure: 100,
      teacher: 600,
      marketing: 200,
      // You can add ANY categories you want:
      support: 50,
      materials: 30,
      certification: 20,
    },
  },
  {
    packageName: 'AI/ML Bootcamp',
    price: 2500,
    expenses: {
      infrastructure: 200,
      teacher: 1000,
      marketing: 300,
      // Different categories for different courses:
      gpu_rental: 150,
      datasets: 100,
      cloud_compute: 80,
      certification: 50,
      support: 70,
    },
  },
  {
    packageName: 'Design Course',
    price: 800,
    expenses: {
      infrastructure: 60,
      teacher: 400,
      marketing: 120,
      // Design-specific expenses:
      software_licenses: 80,
      stock_photos: 40,
      tools: 30,
      portfolio_review: 20,
    },
  },
  {
    packageName: 'Business Course',
    price: 1500,
    expenses: {
      infrastructure: 100,
      teacher: 750,
      marketing: 200,
      // Business-specific expenses:
      guest_speakers: 100,
      case_studies: 50,
      networking_events: 80,
      certificates: 30,
      materials: 40,
    },
  },
];

// You can create packages with ANY expense structure you want!
console.log('Examples of dynamic expense categories:');
examplePackages.forEach((pkg) => {
  console.log(`\n${pkg.packageName}:`);
  console.log('Expense categories:', Object.keys(pkg.expenses));
});
