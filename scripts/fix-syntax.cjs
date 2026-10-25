const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../artifacts/sabbagh-kuwait/src/data/blog-posts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the cut-off at article 10
const targetCutoff = `        calloutBox: {
          title: 'استشارة ومعاينة مجانية:',
          text: 'معلمو الصباغة المعتمدون في منصة "صباغ الكويت" يوفرون عينات دهان تجريبية م
  // ========================================================`;

const replacementCutoff = `        calloutBox: {
          title: 'استشارة ومعاينة مجانية:',
          text: 'معلمو الصباغة المعتمدون في منصة "صباغ الكويت" يوفرون عينات دهان تجريبية مجانية على جدران بيتك أثناء المعاينة الفنية لمساعدتك على اتخاذ القرار الأنسب.',
          type: 'info',
        },
      },
    ],
  },
  // ========================================================`;

if (content.includes(targetCutoff)) {
  content = content.replace(targetCutoff, replacementCutoff);
  console.log('Fixed cut-off at line 932!');
} else {
  console.log('Warning: targetCutoff not matched directly, checking normalized...');
}

// 2. Fix the dangling tail after ARTICLE-30
const targetTail = `      }
],
  },
جانية على جدران بيتك أثناء المعاينة الفنية لمساعدتك على اتخاذ القرار الأنسب.',
          type: 'info',
        },
      },
    ],
  },
];`;

const replacementTail = `      }
    ],
  },
];`;

if (content.includes(targetTail)) {
  content = content.replace(targetTail, replacementTail);
  console.log('Fixed dangling tail at line 7000!');
} else {
  console.log('Warning: targetTail not matched directly, checking normalized...');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated blog-posts.ts syntax!');
