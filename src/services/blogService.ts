export interface BlogPostItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  author?: string;
}

export const initialBlogPosts: BlogPostItem[] = [
  {
    id: 1,
    title: "Understanding Your CBC Report: A Complete Guide",
    excerpt: "Learn how to read and interpret your Complete Blood Count test results and what each parameter means for your health.",
    content: `A Complete Blood Count (CBC) is one of the most common lab tests performed today. It gives healthcare providers a detailed look at your overall health status and can detect a wide range of conditions, including anemia, infection, and leukemia.

### Key Components of a CBC Report:

1. **Red Blood Cells (RBC)**: Carry oxygen from your lungs to the rest of your body.
2. **Hemoglobin (Hb)**: The oxygen-carrying protein in red blood cells. Normal ranges are typically 13.8 - 17.2 g/dL for men and 12.1 - 15.1 g/dL for women.
3. **White Blood Cells (WBC)**: Protect your body against infection. Elevated counts may indicate bacterial or viral infections.
4. **Platelets**: Essential for blood clotting and wound healing.

Regular CBC monitoring helps in early diagnosis and proactive health management. Consult your doctor if any parameter falls outside standard reference ranges.`,
    category: "Test Insights",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    date: "2024-01-20",
    readTime: "5 min read",
    author: "Dr. Sarah Sharma, Pathologist",
  },
  {
    id: 2,
    title: "10 Signs Your Thyroid May Need Attention",
    excerpt: "Discover the common symptoms of thyroid disorders and when you should get your thyroid function tested.",
    content: `The thyroid gland plays a crucial role in regulating your metabolism, energy levels, and body temperature. Small changes in thyroid hormone levels (TSH, T3, T4) can significantly affect how you feel every day.

### Common Signs of Thyroid Dysfunction:
- Unexplained weight gain or difficulty losing weight
- Persistent fatigue and muscle weakness
- Excessive sensitivity to cold or heat
- Mood swings, anxiety, or depression
- Changes in heart rate or blood pressure
- Thinning hair or dry skin

A simple **Thyroid Function Test (Total or Free Profile)** can determine if your thyroid is functioning normally.`,
    category: "Health Awareness",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    date: "2024-01-18",
    readTime: "7 min read",
    author: "Dr. Rajesh Verma, Endocrinologist",
  },
  {
    id: 3,
    title: "Managing Diabetes: Essential Tests You Need",
    excerpt: "A comprehensive guide to diabetes monitoring including HbA1c, fasting glucose, and other critical tests.",
    content: `Diabetes management requires consistent monitoring of blood sugar levels and key metabolic indicators to prevent long-term complications.

### Recommended Routine Diabetes Screening Tests:
1. **Fasting Blood Glucose**: Measures blood sugar after an 8-hour overnight fast.
2. **HbA1c Test**: Indicates average blood glucose control over the last 2-3 months. Target for most diabetics is under 7.0%.
3. **Lipid Profile**: Diabetics are at higher risk for cardiovascular diseases; monitoring cholesterol is vital.
4. **Kidney Function Test (Microalbuminuria)**: Detects early signs of diabetic nephropathy.`,
    category: "Diabetes Care",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
    date: "2024-01-15",
    readTime: "6 min read",
    author: "Dr. Ananya Roy, Diabetologist",
  },
  {
    id: 4,
    title: "Heart Health: Know Your Lipid Profile Numbers",
    excerpt: "Understanding cholesterol levels, triglycerides, and what they mean for your cardiovascular health.",
    content: `Cardiovascular health relies heavily on maintaining healthy cholesterol levels. A Lipid Profile test measures total cholesterol, HDL (good cholesterol), LDL (bad cholesterol), and triglycerides.

### Target Reference Levels:
- **Total Cholesterol**: Less than 200 mg/dL
- **LDL Cholesterol**: Less than 100 mg/dL
- **HDL Cholesterol**: Greater than 50 mg/dL (women) / 40 mg/dL (men)
- **Triglycerides**: Less than 150 mg/dL

A balanced diet, regular exercise, and annual screening reduce the risk of heart attack and stroke.`,
    category: "Heart Health",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80",
    date: "2024-01-12",
    readTime: "5 min read",
    author: "Dr. Vikram Patil, Cardiologist",
  },
  {
    id: 5,
    title: "Women's Health: Essential Screening Tests by Age",
    excerpt: "Age-specific health screening recommendations for women to maintain optimal wellness throughout life.",
    content: `Women undergo significant hormonal and physiological changes across different life stages. Proactive diagnostic testing helps prevent illness and maintain vitality.

### Recommended Screenings by Age Group:
- **20s & 30s**: Annual CBC, Thyroid Profile, Lipid Profile, Vitamin D & B12 screening.
- **40s & 50s**: Mammograms, Pap smear, HbA1c, Bone Mineral Density (DEXA) scan, and Mammogram.
- **60s+**: Comprehensive geriatric profile, cardiac risk markers, and kidney function tests.`,
    category: "Women's Health",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    date: "2024-01-10",
    readTime: "8 min read",
    author: "Dr. Sunita Mehta, Gynecologist",
  },
  {
    id: 6,
    title: "Vitamin D Deficiency: The Silent Epidemic",
    excerpt: "Learn about the importance of vitamin D, signs of deficiency, and how to maintain healthy levels.",
    content: `Vitamin D deficiency affects up to 70-80% of urban populations due to indoor lifestyles and limited sun exposure. It regulates calcium absorption, bone health, and immune system function.

### Signs of Vitamin D Deficiency:
- Bone pain and lower back ache
- Frequent infections and slow wound healing
- Chronic muscle fatigue and weakness
- Hair loss and depression

Getting tested for **Vitamin D 25-OH** ensures accurate diagnosis and appropriate supplementation.`,
    category: "Nutritional Health",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
    date: "2024-01-08",
    readTime: "6 min read",
    author: "Dr. Rahul Deshmukh, Nutrition Specialist",
  },
];

const STORAGE_KEY_BLOGS = "biogenex_custom_blog_posts";

type Listener = () => void;
const listeners: Set<Listener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("biogenex-blog-updated"));
  }
};

const getStoredPosts = (): BlogPostItem[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BLOGS);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load blog posts from storage", e);
    return null;
  }
};

export const blogService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getPosts(): BlogPostItem[] {
    const stored = getStoredPosts();
    if (!stored) {
      // Save initial posts to localStorage on first load
      localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(initialBlogPosts));
      return initialBlogPosts;
    }
    return stored;
  },

  getPostById(id: number | string): BlogPostItem | undefined {
    const posts = this.getPosts();
    return posts.find((p) => String(p.id) === String(id));
  },

  addOrUpdatePost(postData: Omit<BlogPostItem, "id"> & { id?: number }): BlogPostItem {
    const posts = this.getPosts();
    let updatedPosts: BlogPostItem[];
    let savedPost: BlogPostItem;

    if (postData.id) {
      // Edit existing post
      savedPost = {
        ...postData,
        id: Number(postData.id),
      } as BlogPostItem;

      updatedPosts = posts.map((p) => (p.id === savedPost.id ? savedPost : p));
    } else {
      // Create new post
      const maxId = posts.reduce((max, p) => (p.id > max ? p.id : max), 0);
      savedPost = {
        ...postData,
        id: maxId + 1,
        date: postData.date || new Date().toISOString().split("T")[0],
        readTime: postData.readTime || "5 min read",
      } as BlogPostItem;

      updatedPosts = [savedPost, ...posts];
    }

    localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(updatedPosts));
    notifyListeners();
    return savedPost;
  },

  deletePost(id: number): void {
    const posts = this.getPosts();
    const filtered = posts.filter((p) => p.id !== Number(id));
    localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(filtered));
    notifyListeners();
  },

  resetPosts(): void {
    localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(initialBlogPosts));
    notifyListeners();
  },
};
