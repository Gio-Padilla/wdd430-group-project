# Handcrafted Haven

Handcrafted Haven is a beautiful, community-driven marketplace connecting independent artisans with customers who value high-quality, handmade, and sustainable products. Built on a modern tech stack, it features a seamless shopping experience for buyers and a powerful management dashboard for sellers.

## Features

### For Buyers
- **Explore & Discover:** Search for products with a powerful debounced search, or filter by category, price, and rating.
- **Cart & Checkout:** Add products to your cart and proceed through a simulated smooth checkout process.
- **Reviews:** Leave reviews and ratings on products you've purchased.
- **Account Management:** Track your recent orders, manage your profile, and upgrade to a seller account at any time.

### For Sellers
- **Dedicated Dashboard:** A native app-like dashboard experience designed for efficiency on both desktop and mobile.
- **Product Management:** Add, edit, and delete products. Includes rich integration with Cloudinary for seamless drag-and-drop image uploads.
- **Order Tracking:** View and manage incoming orders from buyers.
- **Community Engagement:** Reply directly to customer reviews on your products.

---

## Tech Stack

- **Framework:** [Next.js 16+](https://nextjs.org/) (App Router, Server Actions)
- **Styling:** Vanilla CSS, Tailwind CSS, and [Framer Motion](https://www.framer.com/motion/) for animations
- **Database:** PostgreSQL via [pg](https://node-postgres.com/) (Raw SQL queries, no ORM)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/) (Credentials strategy + bcryptjs)
- **Image Hosting:** [Cloudinary](https://cloudinary.com)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- `pnpm` package manager
- A PostgreSQL database (`DATABASE_URL`)
- NextAuth Secret (`AUTH_SECRET`)
- Cloudinary Credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

### Run Locally
```bash
pnpm install
pnpm db:init
pnpm run seed  # (Optional) Seed the database with initial dummy data
pnpm dev
```

---

## 🎨 Design System

**Color Schema:**
- Primary: `#2F4F4F`
- Background: `#DCDCDC`
- Highlights: `#F26419`
- Outlines: `#000000`
- Accent: `#2176FF` (Add to different things to make them stand out)
*Reference:* [Coolors Palette](https://coolors.co/2f4f4f-dcdcdc-f26419-000000-2176ff)

**Typography:**
- **Titles:** [Aladin](https://fonts.google.com/specimen/Aladin?preview.script=Latn) (All caps)
- **Body:** [Quicksand](https://fonts.google.com/specimen/Quicksand?preview.script=Latn) (General text)
- **Small Text:** [Roboto](https://fonts.google.com/specimen/Roboto) (For easy reading)

**Assets:**
- General layout: Added as a photo to the repository called `wireframe`
- Graphical elements: Added a logo idea to the repository as a graphical element

---

## Project Overview

### Purpose
The purpose of Handcrafted Haven is to provide a digital marketplace that connects artisans and crafters with customers who appreciate unique, handmade goods. It aims to foster community engagement, support local creators, and promote sustainable consumption through a curated e-commerce experience.

### Requirements
- **User Roles:** Dedicated authenticated profiles for sellers and general browsing capabilities for users.
- **Functional Features:** Product listings (descriptions, pricing, images), catalog filtering (category, price), and a review/rating system.
- **Technical Stack:** Next.js (Front-End), Node.js (Back-End), and PostgreSQL database.
- **Standards:** Compliance with WCAG 2.1 Level AA accessibility, responsive design for all devices, and SEO best practices.
- **Management:** Use of GitHub Boards for project tracking and Vercel for deployment.

### Limitations
- **Technology Constraint:** Development is restricted to the specific Next.js/Node.js stack provided in the specifications.
- **Compliance:** Must strictly adhere to high accessibility standards (Level AA), which may limit certain complex UI animations or color choices.
- **Timeline:** Tasks must be broken down into items that can be completed every week.

---

##  Work Items Brainstorming: 10 User Stories
*These stories follow the INVEST model and utilize the "Role, Goal, Benefit" structure.*

1. **Seller Profile Setup:** As an authenticated seller, I want to create a dedicated profile page so that I can share my brand story and craftsmanship with potential buyers. *(Acceptance: Bio, profile image upload, display area for listed items)*
2. **Product Listing Management:** As an artisan, I want to upload product details (price, description, images) so that my items are visible in the marketplace catalog. *(Acceptance: Save listing, display in gallery, purchase trigger)*
3. **Category-Based Browsing:** As a shopper, I want to filter products by category so that I can quickly find the specific types of crafts I am looking for. *(Acceptance: Category menu updates without reload)*
4. **Price Range Selection:** As a budget-conscious shopper, I want to filter items by a specific price range so that I only see products I can afford. *(Acceptance: Range slider/input updates product grid)*
5. **Product Quality Feedback:** As a customer, I want to leave a rating and a written review for a purchased item so that I can share my experience and help other buyers. *(Acceptance: 1-5 star rating, text area, visible on product page)*
6. **Accessible Navigation:** As a user with visual impairments, I want the site navigation to be accessible via screen reader so that I can browse the marketplace independently. *(Acceptance: ARIA labels, WCAG 2.1 Level AA hierarchy)*
7. **Responsive Mobile Shopping:** As a mobile user, I want the website layout to adjust to my screen size so that I can browse and shop comfortably on my phone. *(Acceptance: Hamburger menu, reflowing product grids)*
8. **Seller Discovery:** As a community member, I want to view a list of all active sellers so that I can discover new local artisans to support. *(Acceptance: "Sellers" directory page linking to individual shop pages)*
9. **Secure Authentication:** As a seller, I want to log in securely to my account so that I can manage my inventory and personal details. *(Acceptance: PostgreSQL validation, secure session)*
10. **Item Search:** As a user, I want to search for items using keywords so that I can find specific products quickly without manual browsing. *(Acceptance: Search bar matches titles/descriptions, "no results" message)*



## Gitflow Strategy

Before starting **any** issue:

```bash
git checkout main
git pull origin main
git checkout -b [YOUR-INITIALS]-issue-[NUMBER]-short-name
```

**Example** (Pedro Moura working on issue 03):
```bash
git checkout main ; git pull origin main
git checkout -b PM-issue-03-prisma-schema
```

After finishing:
```bash
git add .
git commit -m "feat: setup prisma schema"
git push -u origin PM-issue-03-prisma-schema
```
Then open a **Pull Request** on GitHub → teammate reviews → merge into `main`.

---

## 📁 Issue Files

- [Issue 01 — Initialize Next.js & Clean Boilerplate](docs/issues/issue-01.md)
- [Issue 02 — Install Dependencies & Configure Build](docs/issues/issue-02.md)
- [Issue 03 — Prisma ORM & Database Schema](docs/issues/issue-03.md)
- [Issue 04 — Core Libraries & Types (prisma.ts, auth.ts, utils.ts, proxy.ts)](docs/issues/issue-04.md)
- [Issue 05 — Design System (globals.css)](docs/issues/issue-05.md)
- [Issue 06 — Context Providers (Auth, Toast, Cart)](docs/issues/issue-06.md)
- [Issue 07 — Core UI Components](docs/issues/issue-07.md)
- [Issue 08 — ProductCard, StarRating & Carousel Components](docs/issues/issue-08.md)
- [Issue 09 — Header, MobileMenu & Footer](docs/issues/issue-09.md)
- [Issue 10 — Shop Filter Components](docs/issues/issue-10.md)
- [Issue 11 — Root Layout, Error & 404 Pages](docs/issues/issue-11.md)
- [Issue 12 — Auth Server Actions](docs/issues/issue-12.md)
- [Issue 13 — Login & Register Pages](docs/issues/issue-13.md)
- [Issue 14 — Product & Review Server Actions](docs/issues/issue-14.md)
- [Issue 15 — Cart & Order Server Actions](docs/issues/issue-15.md)
- [Issue 16 — API Routes (Products, Categories, Sellers)](docs/issues/issue-16.md)
- [Issue 17 — Homepage](docs/issues/issue-17.md)
- [Issue 18 — Shop Page with Filters](docs/issues/issue-18.md)
- [Issue 19 — Product Detail Page](docs/issues/issue-19.md)
- [Issue 20 — Categories, Sellers Directory, Seller & About Pages](docs/issues/issue-20.md)
- [Issue 21 — Cart & Checkout Pages](docs/issues/issue-21.md)
- [Issue 22 — Account Page](docs/issues/issue-22.md)
- [Issue 23 — Dashboard Layout & Overview](docs/issues/issue-23.md)
- [Issue 24 — Dashboard Product Management](docs/issues/issue-24.md)
- [Issue 25 — Dashboard Profile & Sell Pages](docs/issues/issue-25.md)

---

## 👥 Team members
| Name | Github |
|---|---|
| Imelda Lucia Robles Fuentes | [imeldaty](https://github.com/imeldaty) |
| Travis Abuton | [sundazekiks](https://github.com/sundazekiks) |
| Pedro Alves de Moura | [pdmoura](https://github.com/pdmoura) |
| Giovaughni Padilla | [Gio-Padilla](https://github.com/Gio-Padilla) |
| Emmanuel Ohene Kwadwo Jnr Kwakye | [oheneemmanuel](https://github.com/oheneemmanuel) |
