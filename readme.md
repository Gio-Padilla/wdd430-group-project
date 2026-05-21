Pedro Alves de Moura

Emmanuel Ohene Kwadwo Jnr Kwakye

Travis Abuton

Imelda Lucia Robles Fuentel

Giovaughni Padilla

Run the following to view the page locally

pnpm dev
```

Website name: Handcrafted Haven

Color schema:
https://coolors.co/2f4f4f-dcdcdc-f26419-000000-2176ff
#2F4F4F: Primary
#DCDCDC: Background
#F26419: Highlights
#000000: Outlines
#2176FF: Add to differnt things to make them stand out

Typography:
Aladin: Titles (All caps)
https://fonts.google.com/specimen/Aladin?preview.script=Latn
Quicksand: General text or body
https://fonts.google.com/specimen/Quicksand?preview.script=Latn
Roboto: For small and easy to read text
https://fonts.google.com/specimen/Roboto

General layout:
Added as a photo to the repository called wireframe

Graphical elements of the project:
Added a logo idea to the repository as a graphical element

# **Project Overview**



### **Purpose**

##### The purpose of Handcrafted Haven is to provide a digital marketplace that connects artisans and crafters with customers who appreciate unique, handmade goods. It aims to foster community engagement, support local creators, and promote sustainable consumption through a curated e-commerce experience.



### **Requirements**

* ##### **User Roles:** Dedicated authenticated profiles for sellers and general browsing capabilities for users.
* ##### **Functional Features:** Product listings (descriptions, pricing, images), catalog filtering (category, price), and a review/rating system.
* ##### **Technical Stack:** Next.js (Front-End), Node.js (Back-End), and we chose a PostgreSQL database.
* ##### **Standards:** Compliance with WCAG 2.1 Level AA accessibility, responsive design for all devices, and SEO best practices.
* ##### **Management:** Use of GitHub Boards for project tracking and Vercel for deployment.





### **Limitations**

* ##### **Technology Constraint:** Development is restricted to the specific Next.js/Node.js stack provided in the specifications.
* ##### **Compliance:** Must strictly adhere to high accessibility standards (Level AA), which may limit certain complex UI animations or color choices.
* ##### **Timeline:** Tasks must be broken down into items that can be completed every week.





### **Work Item Brainstorming: 10 User Stories**



##### These stories follow the INVEST model and utilize the "Role, Goal, Benefit" structure.



#### **1. Seller Profile Setup**

* ###### **Title:** Create Artisan Profile
* ###### **Description:** As an authenticated seller, I want to create a dedicated profile page so that I can share my brand story and craftsmanship with potential buyers.  
* ###### **Acceptance Criteria:** The profile must include a bio section, a profile image upload, and a display area for listed items.  



#### **2. Product Listing Management**

* ###### **Title:** List New Handcrafted Item
* ###### **Description:** As an artisan, I want to upload product details (price, description, images) so that my items are visible in the marketplace catalog.  
* ###### **Acceptance Criteria:** Sellers can save a listing; the listing must display correctly in the public gallery with a "Purchase" or "Contact" trigger.  



#### **3. Category-Based Browsing**

* ###### **Title:** Filter by Craft Category
* ###### **Description:** As a shopper, I want to filter products by category (e.g., jewelry, woodwork) so that I can quickly find the specific types of crafts I am looking for. 
* ###### **Acceptance Criteria:** Users can select a category from a menu and see the results update immediately without a full page reload. 



#### **4. Price Range Selection**

* ###### **Title:** Filter by Price Range
* ###### **Description**: As a budget-conscious shopper, I want to filter items by a specific price range so that I only see products I can afford.  
* ###### **Acceptance Criteria:** A range slider or input field must filter the product grid to show only items within those numerical bounds.



#### **5. Product Quality Feedback**

* ###### **Title:** Submit Product Review
* ###### **Description:** As a customer, I want to leave a rating and a written review for a purchased item so that I can share my experience and help other buyers.  
* ###### **Acceptance Criteria:** Review forms must include a star rating (1-5) and a text area; reviews must be visible on the specific product page.  



#### **6. Accessible Navigation**

* ###### **Title:** Screen Reader Compatibility
* ###### **Description:** As a user with visual impairments, I want the site navigation to be accessible via screen reader so that I can browse the marketplace independently.  
* ###### **Acceptance Criteria:** All interactive elements must have proper ARIA labels and follow WCAG 2.1 Level AA hierarchy.



#### **7. Responsive Mobile Shopping**

* ###### **Title:** Mobile-Optimized Layout
* ###### **Description:** As a mobile user, I want the website layout to adjust to my screen size so that I can browse and shop comfortably on my phone.  
* ###### **Acceptance Criteria:** Navigation menus must collapse into a "hamburger" style on small screens, and product grids must reflow without horizontal scrolling. 



#### **8. Seller Discovery**

* ###### **Title:** Browse All Artisan Collections
* ###### **Description:** As a community member, I want to view a list of all active sellers so that I can discover new local artisans to support.  
* ###### **Acceptance Criteria:** A "Sellers" directory page must list all authenticated artisan profiles with a link to their individual shop pages. 



#### **9. Secure Authentication**

* ###### **Title:** Seller Account Login
* ###### **Description:** As a seller, I want to log in securely to my account so that I can manage my inventory and personal details.  
* ###### **Acceptance Criteria:** The system must validate credentials against the PostgreSQL database and maintain a secure session.



#### **10. Item Search**



* ###### **Title:** Keyword Search for Products
* ###### **Description:** As a user, I want to search for items using keywords so that I can find specific products quickly without manual browsing.  
* ###### **Acceptance Criteria:** The search bar must return relevant items based on titles or descriptions; if no items are found, a "no results" message should appear.
