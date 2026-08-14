# sept-cascades-guide
my 7 cascade guide service enquiry and booking platform


dir and files
--------------
 - index.html contains the webpage.

- css/ contains the design files.

- js/ contains JavaScript files.

- images/ contains your photos.

- docs/ contains project notes.

=====================================

Step 8 - Build the Header

The header is the visible part of the website
It will contain:
- Business name.
- Naviguation.
- English/French switch
- Booking button

We will build the *HTML Structure first.* ..we will style it later with CSS

summ = 
    <header> contains the top aread
    <nav> contains naviguation links
    <a> creates a link
    <button> creates a button
    *class* gives CSS name for the element
    *id* gives a section a unique name

    =========================================

    The next step — the Hero
This is the first thing visitors see. It must answer four questions fast:
- Where: Sept Cascades, Mauritius.
- Who: a local guide.
- Why: 15+ years of experience.
- What: 3, 4 or 7 waterfall hikes.
The hero holds the single <h1> of the page. This is important for SEO.
Where to add it
Open index.html. Add the hero after </header> (line 30) and before the Why Hike With Me section (line 34).

===========================

Here is the plan for the next section.
Next step — Choose Your Hike
Goal: Three cards on the homepage. Each card shows one hike, its duration, its prices, and a "Book This Hike" button.
Note on placement: Your planned page order is: Hero → Choose Your Hike → Why Hike With Me. Currently Why Hike With Me comes right after the Hero. So we insert the new section between the Hero (line 40) and Why Hike With Me (line 42). Why Hike With Me moves down below it. This matches your structure.
File: index.html