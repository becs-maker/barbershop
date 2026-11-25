export const DEMO_SERVICES = [
  {
    id: 'classic-cut',
    category: 'haircut',
    duration: 35,
    price: 250,
    name: {
      en: 'Classic Gentleman’s Cut',
      am: 'ክላሲክ የወንዶች ፀጉር መቁረጥ',
      om: 'Muraa Rifeensa Aadaa',
      ti: 'ክላሲክ ምቁራጽ ጸጉሪ'
    },
    description: {
      en: 'Precision scissor & clipper cut tailored to head shape, finished with a clean neck shave and warm towel.',
      am: 'በመቀስና በማሽን በጥንቃቄ የሚሰራ ዘመናዊና ክላሲክ ፀጉር መቁረጥ ከሙቅ ፎጣ ጋር።',
      om: 'Muraa qulqulluu maashinii fi maqasiin hojjetamu.',
      ti: 'ብጥንቃቐ ዝስራሕ ክላሲክ ምቁራጽ ጸጉሪ ምስ ውዑይ ፎጣ።'
    }
  },
  {
    id: 'skin-fade',
    category: 'haircut',
    duration: 40,
    price: 300,
    name: {
      en: 'Signature Skin Fade & Line-Up',
      am: 'ዘመናዊ ፌድ እና መስመር ማስተካከል',
      om: 'Feedii Ammayyaa fi Sarara',
      ti: 'ዘመናዊ ፌድን መስመርን'
    },
    description: {
      en: 'Seamless taper or skin fade with razor-sharp hairline detailing — ideal for teens and young adults.',
      am: 'ለወጣቶች ተመራጭ የሆነ ንጹህ ፌድ እና የመስመር ማስተካከያ።',
      om: 'Feedii qulqulluu dargaggootaaf mijatu.',
      ti: 'ንመንእሰያት ዝምችእ ጽሩይ ፌድን መስመርን።'
    }
  },
  {
    id: 'junior-cut',
    category: 'haircut',
    duration: 25,
    price: 180,
    name: {
      en: 'Junior & Kids Cut (Under 14)',
      am: 'የልጆች ፀጉር መቁረጥ',
      om: 'Muraa Rifeensa Daa’immanii',
      ti: 'ምቁራጽ ጸጉሪ ቆልዑ'
    },
    description: {
      en: 'Patient, friendly styling for kids and teens — neat school cuts or fresh weekend styles.',
      am: 'ለልጆች እና ለታዳጊዎች በትዕግስትና በጥንቃቄ የሚሰራ ፀጉር መቁረጥ።',
      om: 'Muraa rifeensaa obsaan daa’immaniif kennamu.',
      ti: 'ንቆልዑ ብትዕግስቲ ዝስራሕ ምቁራጽ ጸጉሪ።'
    }
  },
  {
    id: 'hot-towel-shave',
    category: 'shave',
    duration: 30,
    price: 200,
    name: {
      en: 'Hot Towel Straight-Razor Shave',
      am: 'በሙቅ ፎጣ የጢም መላጨት',
      om: 'Haada Areedaa Huccuu Ho’aan',
      ti: 'ምልጻይ ጭሕሚ ብውዑይ ፎጣ'
    },
    description: {
      en: 'Eucalyptus steam towels, rich lather, straight-razor shave, and soothing cooling balm.',
      am: 'በሙቅ ፎጣ፣ ለስላሳ አረፋ እና ማቀዝቀዣ ክሬም የሚሰጥ ክላሲክ የጢም አገልግሎት።',
      om: 'Tajaajila haada areedaa qulqulluu fi boqonnaa kennu.',
      ti: 'ብውዑይ ፎጣን ልስሉስ ክሬምን ዝውሃብ ምልጻይ ጭሕሚ።'
    }
  },
  {
    id: 'beard-sculpt',
    category: 'styling',
    duration: 25,
    price: 180,
    name: {
      en: 'Beard Trim & Sculpting',
      am: 'የጢም ማስተካከልና ቅርጽ መስጠት',
      om: 'Sirreessaa fi Bareechuu Areedaa',
      ti: 'ምምዕርራይ ጭሕሚ'
    },
    description: {
      en: 'Crisp cheek and neckline shaping, balanced length fading, and conditioning beard oil finish.',
      am: 'የጢም ቅርጽ ማስተካከል ከተፈጥሮ ዘይት እንክብካቤ ጋር።',
      om: 'Areeda sirreessuu fi dibata uumamaatiin kunuunsuu.',
      ti: 'ቅርጺ ጭሕሚ ምስ ዘይቲ ክንክን።'
    }
  },
  {
    id: 'executive-package',
    category: 'package',
    duration: 65,
    price: 450,
    name: {
      en: 'The Executive Full Service',
      am: 'ሙሉ የክብር አገልግሎት ፓኬጅ',
      om: 'Tajaajila Guutuu Addaa',
      ti: 'ምሉእ ፍሉይ ኣገልግሎት'
    },
    description: {
      en: 'Signature haircut, beard trim or hot-towel shave, invigorating scalp massage, and wash.',
      am: 'ፀጉር መቁረጥ፣ የጢም እንክብካቤ፣ የጭንቅላት ማሳጅ እና እጥበት በአንድ ላይ።',
      om: 'Muraa rifeensaa, areedaa, fi dhiqannaa mataa waliin.',
      ti: 'ምቁራጽ ጸጉሪ፣ ክንክን ጭሕሚ፣ ማሳጅን ምሕጻብን።'
    }
  }
];

export const DEMO_BARBERS = [
  {
    id: 'dawit-bekele',
    experience: 11,
    ratingAverage: 4.9,
    ratingCount: 148,
    initials: 'DB',
    bio: 'Master barber specializing in classic scissor work, executive tapers, and traditional hot-towel shaves.',
    specialties: ['Classic Scissor Cuts', 'Hot Towel Shave', 'Executive Taper'],
    user: { name: 'Dawit Bekele' }
  },
  {
    id: 'yohannes-tadesse',
    experience: 7,
    ratingAverage: 4.9,
    ratingCount: 112,
    initials: 'YT',
    bio: 'Precision fade specialist known for clean skin fades, razor line-ups, and modern textured crops.',
    specialties: ['Skin Fades', 'Beard Sculpting', 'Sharp Line-Ups'],
    user: { name: 'Yohannes Tadesse' }
  },
  {
    id: 'abel-girma',
    experience: 9,
    ratingAverage: 4.8,
    ratingCount: 96,
    initials: 'AG',
    bio: 'All-ages family stylist great with kids, teens, and gentlemen looking for effortless everyday cuts.',
    specialties: ['Junior & Kids Cuts', 'Afro & Taper', 'Scalp Care'],
    user: { name: 'Abel Girma' }
  }
];

export const DEMO_SLOTS = ['09:00', '10:00', '11:30', '13:30', '15:00', '16:30', '18:00'];
