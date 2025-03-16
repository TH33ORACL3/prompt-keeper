export const promptRecommendations = [
  {
    id: "rec1",
    title: "For Creative Writing",
    description: "These prompts help you craft engaging stories, poems, and creative content.",
    prompts: ["1", "10"],
    icon: "✍️",
  },
  {
    id: "rec2",
    title: "For Developers",
    description: "Enhance your coding workflow with these technical prompts.",
    prompts: ["2", "5", "9"],
    icon: "💻",
  },
  {
    id: "rec3",
    title: "For Business Professionals",
    description: "Streamline your business communications and marketing efforts.",
    prompts: ["3", "4", "11", "12"],
    icon: "📊",
  },
  {
    id: "rec4",
    title: "For Personal Growth",
    description: "Develop skills and achieve personal goals with these prompts.",
    prompts: ["7"],
    icon: "🌱",
  },
  {
    id: "rec5",
    title: "For Academics",
    description: "Research, write papers, and organize your academic work.",
    prompts: ["6", "9"],
    icon: "🎓",
  },
  {
    id: "rec6",
    title: "For Designers",
    description: "Improve your design process and get better feedback.",
    prompts: ["8"],
    icon: "🎨",
  },
];

export const categoryRecommendations = {
  writing: {
    title: "Writing Prompts",
    description: "Enhance your writing with these specialized prompts",
    relatedCategories: ["creative", "academic"],
    featuredPrompts: ["1", "6"],
  },
  technical: {
    title: "Technical Prompts",
    description: "Solve coding problems and improve your technical skills",
    relatedCategories: ["coding"],
    featuredPrompts: ["2", "5", "9"],
  },
  business: {
    title: "Business Prompts",
    description: "Optimize your business communications and strategies",
    relatedCategories: ["marketing", "sales"],
    featuredPrompts: ["3", "4", "11", "12"],
  },
  creative: {
    title: "Creative Prompts",
    description: "Spark your imagination and create compelling content",
    relatedCategories: ["writing", "design"],
    featuredPrompts: ["1", "10"],
  },
  academic: {
    title: "Academic Prompts",
    description: "Research, write papers, and organize your academic work",
    relatedCategories: ["writing", "research"],
    featuredPrompts: ["6", "9"],
  },
  personal: {
    title: "Personal Development Prompts",
    description: "Grow your skills and achieve your personal goals",
    relatedCategories: ["productivity", "learning"],
    featuredPrompts: ["7"],
  },
};

export const promptTips = [
  {
    id: "tip1",
    title: "Be Specific",
    description: "The more specific your prompt, the better the results. Include details about tone, format, and audience.",
    example: "Instead of 'Write a blog post', try 'Write a 1000-word blog post about sustainable gardening for beginners, using a conversational tone and including 5 actionable tips.'",
  },
  {
    id: "tip2",
    title: "Use Placeholders",
    description: "Add placeholders in square brackets for variables you want to customize each time you use the prompt.",
    example: "Write a product description for [PRODUCT], highlighting its [FEATURE 1], [FEATURE 2], and [FEATURE 3].",
  },
  {
    id: "tip3",
    title: "Structure with Sections",
    description: "Break down complex prompts into clear sections to get more organized responses.",
    example: "Analyze this code:\n\n```[CODE]```\n\nProvide feedback on:\n1. Code quality\n2. Performance\n3. Security\n4. Suggested improvements",
  },
  {
    id: "tip4",
    title: "Specify Output Format",
    description: "Tell the AI exactly how you want the information formatted.",
    example: "Create a weekly meal plan. Format as a table with columns for Day, Breakfast, Lunch, Dinner, and Snacks.",
  },
  {
    id: "tip5",
    title: "Chain Prompts",
    description: "For complex tasks, use a series of prompts that build on each other.",
    example: "First prompt: 'Outline a blog post about climate change.'\nSecond prompt: 'Expand on section 2 of the outline with more detail and data.'",
  },
]; 