# Issue 18 — Shop Page with Filters

**Suggested Branch:** `[YOUR-INITIALS]-issue-18-shop-page-with`

> ⚠️ **Updated:** All database queries now use raw SQL via the `pg` driver. Prisma has been removed from the project. Schema is at `src/db/schema.sql`.

> **User Story:** As a user, I want to search for items using keywords so that I can find specific products quickly without manual browsing.
> **Acceptance Criteria:** The search bar must return relevant items based on titles or descriptions; if no items are found, a "no results" message should appear.

> **User Story:** As a budget-conscious shopper, I want to filter items by a specific price range so that I only see products I can afford.
> **Acceptance Criteria:** A range slider or input field must filter the product grid to show only items within those numerical bounds.

> **User Story:** As a shopper, I want to filter products by category (e.g., jewelry, woodwork) so that I can quickly find the specific types of crafts I am looking for.
> **Acceptance Criteria:** Users can select a category from a menu and see the results update immediately without a full page reload.

**Labels:** `feature`, `frontend` | **Priority:** 🟡 High | **Depends on:** Issues 08, 10, 16

## Checklist
- [ ] **Prerequisite:** Ensure Issues 08, 10, 16 are completed.
- [ ] Create `src/app/shop/page.tsx`

## File to Create

### `src/app/shop/page.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

Key implementation details:
- **Server component** — Fetches data using raw SQL via `pool.query` from `@/lib/db`
- `export const dynamic = 'force-dynamic'`
- **Search params:** `page`, `category`, `search`, `sort`, `minPrice`, `maxPrice`, `minRating`
- **Data fetching:** 3 parallel queries — products (paginated), total count, categories (for sidebar). Use dynamic WHERE clause building with parameterized queries.
- **Layout:** Two-column — sidebar filters + main content
- **Sidebar:** Category links, price range inputs, RatingSlider wrapped in Suspense
- **Main content:** SearchBar + SortDropdown + ProductCard grid (3 columns on xl) + Pagination
- **Empty state:** Shows EmptyState with "Clear Filters" action when no products match
- Product prices converted from Decimal to Number via `Number(product.price)`
