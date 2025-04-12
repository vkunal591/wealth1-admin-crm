const operations = {
  read: true, // to get data using ID
  create: true, // to create a new instance
  update: true, // to update existing instance
  delete: true, // to delete existing instance
};

export const endpoints: Record<
  string,
  {
    create: string;
    read: string;
    update: string;
    delete: string;
    fetchAll: string;
    operations?: any;
  }
> = {
  Brand: {
    create: "api/brand", // to create a brand
    delete: "api/brand/", // to delete a brand
    update: "api/brand/", // to update a brand
    read: "api/brand/", // to get a brand
    fetchAll: "api/brand", // to fetch all brands
    operations: operations,
  },
  Home: {
    create: "api/section", // to create a brand
    delete: "api/section/", // to delete a brand
    update: "api/section/", // to update a brand
    read: "api/section/", // to get a brand
    fetchAll: "api/section?slug=home", // to fetch all brands
    operations: operations,
  },
  About: {
    create: "api/section", // to create a brand
    delete: "api/section/", // to delete a brand
    update: "api/section/", // to update a brand
    read: "api/section/", // to get a brand
    fetchAll: "api/section?slug=about", // to fetch all brands
    operations: operations,
  },
  Service: {
    create: "api/section", // to create a brand
    delete: "api/section/", // to delete a brand
    update: "api/section/", // to update a brand
    read: "api/section/", // to get a brand
    fetchAll: "api/section", // to fetch all brands
    operations: operations,
  },
  Contact: {
    create: "api/contact", // to create a contact-us
    delete: "api/contact/", // to delete a contact-us
    update: "api/contact/", // to update a contact-us
    read: "api/contact/", // to get a contact-us
    fetchAll: "api/contact", // to fetch all contact-us
    operations: operations,
  },
  ContactUs:  {
    create: "api/section", // to create a brand
    delete: "api/section/", // to delete a brand
    update: "api/section/", // to update a brand
    read: "api/section/", // to get a brand
    fetchAll: "api/section?slug=contact", // to fetch all brands
    operations: operations,
  },
  Career: {
    create: "api/section", // to create a contact-us
    delete: "api/section/", // to delete a contact-us
    update: "api/section/", // to update a contact-us
    read: "api/section/", // to get a contact-us
    fetchAll: "api/section?slug=career", // to fetch all contact-us
    operations: operations,
  },
  Blog: {
    create: "api/section", // to create a contact-us
    delete: "api/section/", // to delete a contact-us
    update: "api/section/", // to update a contact-us
    read: "api/section/", // to get a contact-us
    fetchAll: "api/section?slug=blog", // to fetch all contact-us
    operations: operations,
  },
  Technology: {
    create: "api/section", // to create a brand
    delete: "api/section/", // to delete a brand
    update: "api/section/", // to update a brand
    read: "api/section/", // to get a brand
    fetchAll: "api/section?slug=technology", // to fetch all brands
    operations: operations,
  },
  News: {
    create: "api/news", // to create a brand
    delete: "api/news/", // to delete a brand
    update: "api/news/", // to update a brand
    read: "api/news/", // to get a brand
    fetchAll: "api/news", // to fetch all brands
    operations: operations,
  },
  Pages: {
    create: "api/pages", // to create a brand
    delete: "api/pages/", // to delete a brand
    update: "api/pages/", // to update a brand
    read: "api/pages/", // to get a brand
    fetchAll: "api/pages", // to fetch all brands
    operations: operations,
  },
  Application: {
    create: "api/section", // to create a brand
    delete: "api/section/", // to delete a brand
    update: "api/section/", // to update a brand
    read: "api/section/", // to get a brand
    fetchAll: "api/section?slug=application", // to fetch all brands
    operations: operations,
  },
  Products: {
    create: "api/product", // to create a brand
    delete: "api/product/", // to delete a brand
    update: "api/product/", // to update a brand
    read: "api/product/", // to get a brand
    fetchAll: "api/product", // to fetch all brands
    operations: operations,
  },
  NewsLatter: {
    create: "api/latter", // to create a brand
    delete: "api/latter/", // to delete a brand
    update: "api/latter/", // to update a brand
    read: "api/latter/", // to get a brand
    fetchAll: "api/latter", // to fetch all brands
    operations: operations,
  },
  Course: {
    create: "api/course", // to create a course
    delete: "api/course/", // to delete a course
    update: "api/course/", // to update a course
    read: "api/course/", // to get a course
    fetchAll: "api/course", // to fetch all course
    operations: operations,
  },
  CourseContent: {
    create: "api/course-content", // to create a course
    delete: "api/course-content/", // to delete a course
    update: "api/course-content/", // to update a course
    read: "api/course-content/", // to get a course
    fetchAll: "api/course-content", // to fetch all course
    operations: operations,
  },
  Transaction: {
    create: "api/transaction", // to create a transaction
    delete: "api/transaction/", // to delete a transaction
    update: "api/transaction/", // to update a transaction
    read: "api/transaction/", // to get a transaction
    fetchAll: "api/transaction", // to fetch all transaction
    operations: operations,
  },
  Order: {
    create: "api/order", // to create a transaction
    delete: "api/order/", // to delete a transaction
    update: "api/order/", // to update a transaction
    read: "api/order/", // to get a transaction
    fetchAll: "api/order", // to fetch all transaction
    operations: operations,
  },
  Employee: {
    create: "api/user/create-user", // to create a user
    delete: "api/user/", // to delete a user
    update: "api/user/", // to update a user
    read: "api/user/", // to get a user
    fetchAll: "api/user/admins", // to fetch all Users
    operations: operations,
  },
  User: {
    create: "api/user/create-user", // to create a user
    delete: "api/user/", // to delete a user
    update: "api/user/", // to update a user
    read: "api/user/", // to get a user
    fetchAll: "api/user/public-role/user", // to fetch all Users
    operations: operations,
  },
  Role: {
    create: "api/role", // to create a role
    read: "api/role/", // to get a role
    update: `api/role/`, // to update a role
    delete: "api/role/", // to delete a role
    fetchAll: "api/role", // to fetch all roles
    operations: operations,
  },
  AboutUs: {
    create: "api/about", // to create a role
    read: "api/about/", // to get a role
    update: `api/about/`, // to update a role
    delete: "api/about/", // to delete a role
    fetchAll: "api/about", // to fetch all roles
    operations: operations,
  },
  Sections: {
    create: "api/page-section", // to create a role
    read: "api/page-section/", // to get a role
    update: `api/page-section/`, // to update a role
    delete: "api/page-section/", // to delete a role
    fetchAll: "api/page-section", // to fetch all roles
    operations: operations,
  },
  Banners: {
    create: "api/banner", // to create a role
    read: "api/banner/", // to get a role
    update: `api/banner/`, // to update a role
    delete: "api/banner/", // to delete a role
    fetchAll: "api/banner", // to fetch all roles
    operations: operations,
  },
  Faqs: {
    create: "api/faq", // to create a faqs
    read: "api/faq/", // to get a faqs
    update: `api/faq/`, // to update a faqs
    delete: "api/faq/", // to delete a faqs
    fetchAll: "api/faq", // to fetch all roles
    operations: operations,
  },
  Seo: {
    create: "api/seo", // to create a seo
    read: "api/seo/", // to get a seo
    update: `api/seo/`, // to update a seo
    delete: "api/seo/", // to delete a seo
    fetchAll: "api/seo", // to fetch all seos
    operations: operations,
  },
  Review: {
    create: "api/review", // to create a review
    read: "api/review/", // to get a review
    update: `api/review/`, // to update a review
    delete: "api/review/", // to delete a review
    fetchAll: "api/review", // to fetch all reviews
    operations: operations,
  },
  Blogs: {
    create: "api/blog", // to create a blog
    read: "api/blog/", // to get a blog
    update: `api/blog/`, // to update a blog
    delete: "api/blog/", // to delete a blog
    fetchAll: "api/blog", // to fetch all blogs
    operations: operations,
  },
  BlogCategory: {
    create: "api/blog-category", // to create a blog-category
    read: "api/blog-category/", // to get a blog-category
    update: `api/blog-category/`, // to update a blog-category
    delete: "api/blog-category/", // to delete a blog-category
    fetchAll: "api/blog-category", // to fetch all blog-categorys
    operations: operations,
  },
  Testimonials: {
    create: "api/testimonial", // to create a blog-category
    read: "api/testimonial/", // to get a blog-category
    update: `api/testimonial/`, // to update a blog-category
    delete: "api/testimonial/", // to delete a blog-category
    fetchAll: "api/testimonial", // to fetch all blog-categorys
    operations: operations,
  },
};

export const DashboardEndpoint = {
  fetchSale: "admin/transactions/total-sales-duration", // to fetch all duration
  fetchGraphSale: "admin/dashboard/overview-revenue", // to fetch all graph
  fetchGraphSessions: "admin/dashboard/overview-sessions", // to fetch all graph
  fetchSaleByMonthYear: "admin/dashboard/line-chart", // to fetch all line charts
};
