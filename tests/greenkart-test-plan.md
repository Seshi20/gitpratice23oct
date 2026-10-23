# GreenKart Storefront Test Plan

## Application Overview

Functional test plan for the GreenKart grocery storefront at https://rahulshettyacademy.com/seleniumPractise/#/. Coverage includes the fresh catalog, product search and quantity selection, cart and checkout, country/terms consent, successful order placement, and the Top Deals table. Each test assumes a fresh browser context with no cart contents and can be executed independently. During exploration, the catalog exposed 31 products; the product search returned a no-results message for unmatched input; quantity decrement stopped at 1; cart and checkout totals reflected selected quantities; Top Deals provided search, sorting, pagination (page sizes 5, 10, and 20), and a delivery-date control; and a completed order displayed a success message then returned to the catalog. The invalid promo-code check remained in an Applying state during the exploratory session, so promo response completion is specifically called out for verification.

## Test Scenarios

### 1. Catalog and Cart

**Seed:** `tests/seed.spec.ts`

#### 1.1. Loads the product catalog in a fresh session

**File:** `tests/catalog/initial-catalog.spec.ts`

**Steps:**
  1. Open the storefront URL in a fresh browser context.
    - expect: The GreenKart storefront loads at the catalog route.
    - expect: The catalog displays 31 product cards with a name, unit price, quantity control, and ADD TO CART button for each product.
  2. Inspect the header cart summary before interacting with products.
    - expect: The header shows Items: 0 and Price: 0.
  3. Scroll to the end of the product list.
    - expect: The remaining products and GreenKart footer are reachable without a broken or duplicated product card.

#### 1.2. Searches the catalog and handles unmatched queries

**File:** `tests/catalog/search-products.spec.ts`

**Steps:**
  1. Enter "apple" in the catalog search field.
    - expect: The catalog filters to the matching Apple product (Apple - 1 Kg), ignoring query letter case.
  2. Replace the query with a string that matches no product, such as "zzzz-no-match".
    - expect: A clear no-products-matched message is shown and no product cards are offered for adding to cart.
  3. Clear the search field.
    - expect: The full catalog is restored and the cart remains empty.

#### 1.3. Selects quantities and adds products to the cart

**File:** `tests/catalog/quantity-and-cart.spec.ts`

**Steps:**
  1. On the first product, click the decrement control while its quantity is at the default value of 1.
    - expect: The quantity does not fall below 1 and the cart summary remains at zero.
  2. Increase Brocolli quantity to 2 and click its ADD TO CART button.
    - expect: The cart summary shows one distinct item and a total price of ₹240 (2 × ₹120).
  3. Add one Cauliflower at its default quantity of 1.
    - expect: The cart contains two distinct product lines and the total is ₹300 (₹240 + ₹60).
  4. Open the cart preview from the cart icon.
    - expect: The preview shows both product names, quantities, line totals, and a checkout action consistent with the header total.

#### 1.4. Removes cart products and prevents checkout with an empty cart

**File:** `tests/cart/cart-removal-and-empty-state.spec.ts`

**Steps:**
  1. Add two different products, then open the cart preview.
    - expect: Each added product appears once with its selected quantity and correct line total.
  2. Use the remove (×) control for one line item.
    - expect: Only the selected product is removed and the header and preview totals recalculate for the remaining item.
  3. Remove the final line item.
    - expect: The cart shows an empty-cart message and zero item/price totals; checkout cannot advance with no items.

#### 1.5. Validates promo-code feedback without corrupting checkout totals

**File:** `tests/checkout/checkout-promo-and-totals.spec.ts`

**Steps:**
  1. Add one product and open Proceed to Checkout.
    - expect: The checkout table lists the selected product, quantity, unit price, and matching line total; item count and total amount agree with the cart.
  2. Apply an invalid promo code such as "NOT-A-VALID-CODE" and wait for the application response.
    - expect: The application ends its loading/applying state and provides clear invalid-code feedback.
    - expect: Discount and total after discount remain unchanged; the promo attempt does not alter products or quantities.
  3. If a valid promotional code is supplied by the test environment, apply it and then reapply the invalid code.
    - expect: A valid code produces the documented discount once, with the adjusted total shown accurately.
    - expect: An invalid code does not leave a prior discount in an ambiguous or inconsistent state.

#### 1.6. Places an order after selecting a country and accepting terms

**File:** `tests/checkout/place-order.spec.ts`

**Steps:**
  1. Add a product, open the cart, proceed to checkout, and click Place Order.
    - expect: The Choose Country step is displayed with a country selector, terms checkbox, Terms & Conditions link, and Proceed button.
  2. Select a valid country such as India, leave the consent checkbox unchecked, and click Proceed.
    - expect: Order submission is blocked and the user is told that Terms & Conditions acceptance is required.
  3. Check the consent checkbox and click Proceed.
    - expect: A successful-order confirmation is displayed.
    - expect: The app returns to the catalog/cart flow and the completed cart is cleared.

#### 1.7. Opens and returns from the terms and conditions link

**File:** `tests/checkout/terms-link.spec.ts`

**Steps:**
  1. From the Choose Country step, activate Terms & Conditions.
    - expect: The terms/policy content opens and is readable in the opened page or tab.
    - expect: The original checkout remains available with the selected country and consent state unchanged when returning to it.

### 2. Top Deals

**Seed:** `tests/seed.spec.ts`

#### 2.1. Filters and paginates Top Deals

**File:** `tests/offers/deals-search-pagination.spec.ts`

**Steps:**
  1. Open Top Deals from the storefront navigation.
    - expect: The deals table shows product name, price, and discount price columns, plus a search field, page-size selector, pagination, and delivery-date control.
  2. Search for "Tomato".
    - expect: Only matching deal rows remain visible.
  3. Search for a term that matches no deal, then clear the search.
    - expect: An empty result state is handled clearly, and clearing the query restores the unfiltered rows.
  4. Set page size to 10 and use Next, Previous, First, and Last where available.
    - expect: The selected page contains no more than 10 rows; pagination moves to the correct page and disables boundary actions as appropriate.
  5. Set page size to 20.
    - expect: The table displays up to 20 rows on the current page and pagination reflects the smaller number of pages.

#### 2.2. Sorts Top Deals by each displayed column

**File:** `tests/offers/deals-sorting.spec.ts`

**Steps:**
  1. Click the Veg/fruit name column heading twice.
    - expect: Rows sort by name ascending, then descending, and the direction is communicated accessibly.
  2. Click Price, then Discount price headings twice each.
    - expect: Each column sorts numerically in ascending and descending order; sort direction indicators match the displayed order.

#### 2.3. Uses the delivery-date control

**File:** `tests/offers/delivery-date.spec.ts`

**Steps:**
  1. Open Top Deals and inspect the Delivery Date control.
    - expect: The date control is populated with the current date and can be focused and changed using the date picker or keyboard.
  2. Choose a different valid date and then attempt to enter an invalid or out-of-range date if the control permits it.
    - expect: A valid date is represented consistently in the control; invalid input is rejected or normalized by the browser without breaking the deals table.
