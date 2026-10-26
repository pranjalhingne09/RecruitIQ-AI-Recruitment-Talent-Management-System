/**
 * Currency & Salary formatting utilities for RecruitIQ (Indian Tech Market)
 */

export const formatRupees = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatSalaryRange = (min, max, options = { showLPA: true }) => {
  if (!min && !max) return 'Competitive';
  
  const minNum = Number(min) || 0;
  const maxNum = Number(max) || 0;

  const minFormatted = `₹${minNum.toLocaleString('en-IN')}`;
  const maxFormatted = `₹${maxNum.toLocaleString('en-IN')}`;

  if (options.showLPA && (minNum >= 100000 || maxNum >= 100000)) {
    const minLPA = (minNum / 100000).toFixed(minNum % 100000 === 0 ? 0 : 1);
    const maxLPA = (maxNum / 100000).toFixed(maxNum % 100000 === 0 ? 0 : 1);
    
    if (minNum && maxNum) {
      return `₹${minLPA} - ₹${maxLPA} LPA (${minFormatted} - ${maxFormatted})`;
    } else {
      const lpa = minNum ? minLPA : maxLPA;
      return `₹${lpa} LPA`;
    }
  }

  if (minNum && maxNum) {
    return `${minFormatted} - ${maxFormatted} / yr`;
  }
  return `${minNum ? minFormatted : maxFormatted} / yr`;
};

export const formatCompactSalary = (min, max) => {
  if (!min && !max) return 'Competitive';
  const minNum = Number(min) || 0;
  const maxNum = Number(max) || 0;

  if (minNum >= 100000 || maxNum >= 100000) {
    const minLPA = (minNum / 100000).toFixed(minNum % 100000 === 0 ? 0 : 1);
    const maxLPA = (maxNum / 100000).toFixed(maxNum % 100000 === 0 ? 0 : 1);
    return `₹${minLPA} - ₹${maxLPA} LPA`;
  }

  return `₹${minNum.toLocaleString('en-IN')} - ₹${maxNum.toLocaleString('en-IN')}`;
};
