// Lists the available subjects for each tuition class level.
export const tuitionSubjectsByClassLevel = {
  Kindergarten: [
    "Bangla",
    "English",
    "Mathematics",
    "General Knowledge",
    "Drawing",
  ],
  Primary: [
    "Bangla",
    "English",
    "Mathematics",
    "Science",
    "Bangladesh & Global Studies",
    "ICT",
  ],
  SSC: [
    "Bangla",
    "English",
    "General Mathematics",
    "Higher Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Accounting",
    "Finance & Banking",
    "Business Entrepreneurship",
    "ICT",
  ],
  HSC: [
    "Bangla",
    "English",
    "ICT",
    "Higher Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Accounting",
    "Finance",
    "Business Organization & Management",
    "Economics",
  ],
  University: [
    "C Programming",
    "C++",
    "Java",
    "Python",
    "Data Structures & Algorithms",
    "Calculus",
    "Linear Algebra",
    "Statistics",
    "Physics",
    "Chemistry",
    "Economics",
    "Accounting",
    "BBA",
    "English",
  ],
  Professional: [
    "IELTS",
    "Spoken English",
    "Graphic Design",
    "Web Development",
    "Digital Marketing",
    "MS Office",
    "Accounting & Finance",
    "Freelancing",
  ],
  Admission: [
    "University Admission",
    "Medical Admission",
    "Engineering Admission",
    "English",
    "General Knowledge",
  ],
} as const

// Provides the class levels as an array for form and filter options.
export const classLevels = Object.keys(tuitionSubjectsByClassLevel) as Array<
  keyof typeof tuitionSubjectsByClassLevel
>

// Defines the class levels supported by the subject list.
export type ClassLevel = keyof typeof tuitionSubjectsByClassLevel
