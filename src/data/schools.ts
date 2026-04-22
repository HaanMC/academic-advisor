export interface SuggestedSchool {
  id: string;
  name: string;
  location: string;
  admitRate: string;
  tags: string[];
}

export const SUGGESTED_SCHOOLS: SuggestedSchool[] = [
  { id: 'harvard', name: 'Harvard University', location: 'Cambridge, MA, USA', admitRate: '3.4%', tags: ['humanities', 'bio', 'gov'] },
  { id: 'stanford', name: 'Stanford University', location: 'Stanford, CA, USA', admitRate: '3.9%', tags: ['cs', 'engineering', 'entrepreneurship'] },
  { id: 'mit', name: 'MIT', location: 'Cambridge, MA, USA', admitRate: '4.5%', tags: ['cs', 'engineering', 'math'] },
  { id: 'uchicago', name: 'University of Chicago', location: 'Chicago, IL, USA', admitRate: '5.4%', tags: ['economics', 'math', 'humanities'] },
  { id: 'columbia', name: 'Columbia University', location: 'New York, NY, USA', admitRate: '3.9%', tags: ['core', 'humanities', 'finance'] },
  { id: 'penn', name: 'University of Pennsylvania', location: 'Philadelphia, PA, USA', admitRate: '5.9%', tags: ['business', 'nursing'] },
  { id: 'brown', name: 'Brown University', location: 'Providence, RI, USA', admitRate: '5.1%', tags: ['open curriculum'] },
  { id: 'nyu', name: 'New York University', location: 'New York, NY, USA', admitRate: '8.0%', tags: ['film', 'business', 'global'] },
  { id: 'ucla', name: 'University of California, Los Angeles', location: 'Los Angeles, CA, USA', admitRate: '8.8%', tags: ['public', 'arts'] },
  { id: 'berkeley', name: 'University of California, Berkeley', location: 'Berkeley, CA, USA', admitRate: '11.4%', tags: ['cs', 'public'] },
  { id: 'michigan', name: 'University of Michigan', location: 'Ann Arbor, MI, USA', admitRate: '17.7%', tags: ['engineering', 'business'] },
  { id: 'oxford', name: 'University of Oxford', location: 'Oxford, UK', admitRate: '17.5%', tags: ['humanities', 'ppe'] },
  { id: 'cambridge', name: 'University of Cambridge', location: 'Cambridge, UK', admitRate: '18.0%', tags: ['math', 'natural sciences'] },
  { id: 'imperial', name: 'Imperial College London', location: 'London, UK', admitRate: '14.3%', tags: ['stem', 'medicine'] },
  { id: 'lse', name: 'London School of Economics', location: 'London, UK', admitRate: '8.9%', tags: ['economics', 'social science'] },
  { id: 'ucl', name: 'University College London', location: 'London, UK', admitRate: '24.0%', tags: ['broad', 'medicine'] },
  { id: 'toronto', name: 'University of Toronto', location: 'Toronto, Canada', admitRate: '43%', tags: ['research', 'stem'] },
  { id: 'mcgill', name: 'McGill University', location: 'Montreal, Canada', admitRate: '46%', tags: ['life sciences', 'arts'] },
  { id: 'nus', name: 'National University of Singapore', location: 'Singapore', admitRate: '5%', tags: ['engineering', 'business', 'cs'] },
  { id: 'ntu', name: 'Nanyang Technological University', location: 'Singapore', admitRate: '36%', tags: ['engineering', 'cs'] },
  { id: 'hku', name: 'The University of Hong Kong', location: 'Hong Kong', admitRate: '10%', tags: ['law', 'medicine'] },
  { id: 'fulbright', name: 'Fulbright University Vietnam', location: 'Ho Chi Minh City, Vietnam', admitRate: '15%', tags: ['liberal arts', 'bilingual'] },
  { id: 'vinuni', name: 'VinUniversity', location: 'Hanoi, Vietnam', admitRate: '20%', tags: ['business', 'engineering'] },
];
