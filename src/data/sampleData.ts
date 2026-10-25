import { Transaction } from '../types';

/**
 * Generates rich, realistic sample financial transactions spanning the past 4 months.
 * All amounts are stored as integer paise.
 * Dates are calculated relative to the current month to ensure realistic dashboard stats.
 */
export function generateSampleTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();

  // Helper to format date YYYY-MM-DD
  const formatISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // We generate data for month 0 (current), month -1, month -2, month -3
  for (let offset = 3; offset >= 0; offset--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    // 1. Monthly Salary (1st of each month)
    transactions.push({
      id: `demo-sal-${year}-${month}`,
      type: 'income',
      amount: 9500000, // ₹95,000.00
      category: 'Salary',
      description: 'Monthly Salary Credit — Tech Corp',
      date: formatISO(new Date(year, month, 1)),
      createdAt: new Date(year, month, 1, 9, 30).getTime(),
      isDemo: true,
    });

    // 2. House Rent & Maintenance (3rd of month)
    transactions.push({
      id: `demo-rent-${year}-${month}`,
      type: 'expense',
      amount: 2800000, // ₹28,000.00
      category: 'Bills',
      description: 'Apartment Rent & Maintenance',
      date: formatISO(new Date(year, month, 3)),
      createdAt: new Date(year, month, 3, 10, 15).getTime(),
      isDemo: true,
    });

    // 3. Electricity & High-speed Wifi Bills (5th of month)
    transactions.push({
      id: `demo-bills-${year}-${month}`,
      type: 'expense',
      amount: 345000, // ₹3,450.00
      category: 'Bills',
      description: 'Electricity & Fiber Broadband Bill',
      date: formatISO(new Date(year, month, 5)),
      createdAt: new Date(year, month, 5, 14, 0).getTime(),
      isDemo: true,
    });

    // 4. Grocery Stockup (7th of month)
    transactions.push({
      id: `demo-groc-1-${year}-${month}`,
      type: 'expense',
      amount: 542000, // ₹5,420.00
      category: 'Food',
      description: 'Monthly Grocery — Nature Basket',
      date: formatISO(new Date(year, month, 7)),
      createdAt: new Date(year, month, 7, 18, 45).getTime(),
      isDemo: true,
    });

    // 5. Fuel / Metro Pass (10th of month)
    transactions.push({
      id: `demo-trans-1-${year}-${month}`,
      type: 'expense',
      amount: 220000, // ₹2,200.00
      category: 'Transport',
      description: 'Fuel & Metro Smart Card Recharge',
      date: formatISO(new Date(year, month, 10)),
      createdAt: new Date(year, month, 10, 8, 30).getTime(),
      isDemo: true,
    });

    // 6. Streaming & Entertainment Subscriptions (12th of month)
    transactions.push({
      id: `demo-ent-1-${year}-${month}`,
      type: 'expense',
      amount: 119900, // ₹1,199.00
      category: 'Entertainment',
      description: 'Netflix UHD & Spotify Family',
      date: formatISO(new Date(year, month, 12)),
      createdAt: new Date(year, month, 12, 11, 20).getTime(),
      isDemo: true,
    });

    // 7. Weekend Dining Out (15th of month)
    transactions.push({
      id: `demo-food-2-${year}-${month}`,
      type: 'expense',
      amount: 265000, // ₹2,650.00
      category: 'Food',
      description: 'Weekend Dinner with Friends — Smoke House Deli',
      date: formatISO(new Date(year, month, 15)),
      createdAt: new Date(year, month, 15, 21, 10).getTime(),
      isDemo: true,
    });

    // Freelance Income (in month 1 and 3)
    if (offset === 1 || offset === 3) {
      transactions.push({
        id: `demo-free-${year}-${month}`,
        type: 'income',
        amount: 3200000, // ₹32,000.00
        category: 'Freelancing',
        description: 'Design Consultation & UI Audit — Fintech Client',
        date: formatISO(new Date(year, month, 17)),
        createdAt: new Date(year, month, 17, 16, 0).getTime(),
        isDemo: true,
      });
    }

    // 8. Health & Wellness (18th of month)
    transactions.push({
      id: `demo-health-${year}-${month}`,
      type: 'expense',
      amount: 185000, // ₹1,850.00
      category: 'Health',
      description: 'Pharmacy & Wellness Supplements',
      date: formatISO(new Date(year, month, 18)),
      createdAt: new Date(year, month, 18, 12, 30).getTime(),
      isDemo: true,
    });

    // 9. Shopping / Electronics (21st of month)
    transactions.push({
      id: `demo-shop-${year}-${month}`,
      type: 'expense',
      amount: 489000, // ₹4,890.00
      category: 'Shopping',
      description: 'Apparel & Home Essentials — Myntra',
      date: formatISO(new Date(year, month, 21)),
      createdAt: new Date(year, month, 21, 17, 40).getTime(),
      isDemo: true,
    });

    // 10. Education / Books / Courses (23rd of month)
    transactions.push({
      id: `demo-edu-${year}-${month}`,
      type: 'expense',
      amount: 199900, // ₹1,999.00
      category: 'Education',
      description: 'Frontend Master Course Subscription',
      date: formatISO(new Date(year, month, 23)),
      createdAt: new Date(year, month, 23, 19, 15).getTime(),
      isDemo: true,
    });

    // 11. Mid-month Cabs & City Commutes (25th of month)
    transactions.push({
      id: `demo-trans-2-${year}-${month}`,
      type: 'expense',
      amount: 145000, // ₹1,450.00
      category: 'Transport',
      description: 'Uber Rides for Client Meetings',
      date: formatISO(new Date(year, month, 25)),
      createdAt: new Date(year, month, 25, 20, 0).getTime(),
      isDemo: true,
    });

    // Gift Income (in month 0 and 2)
    if (offset === 0 || offset === 2) {
      transactions.push({
        id: `demo-gift-${year}-${month}`,
        type: 'income',
        amount: 500000, // ₹5,000.00
        category: 'Gifts',
        description: 'Festival Cash Gift from Family',
        date: formatISO(new Date(year, month, 26)),
        createdAt: new Date(year, month, 26, 13, 0).getTime(),
        isDemo: true,
      });
    }

    // 12. Weekend Movie & Outing (28th of month)
    transactions.push({
      id: `demo-ent-2-${year}-${month}`,
      type: 'expense',
      amount: 140000, // ₹1,400.00
      category: 'Entertainment',
      description: 'IMAX Cinema Tickets & Popcorn',
      date: formatISO(new Date(year, month, 28)),
      createdAt: new Date(year, month, 28, 18, 30).getTime(),
      isDemo: true,
    });
  }

  // Sort newest first
  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}
