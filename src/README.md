## OVERVIEW

## How long I spent on the assignment:

This project represents 2 days of work. I completed a working read-only view of this calendar in about 4.5 hours, and spent the rest of the time improving my code design, and adding zoom.

## What I like about my implementation:

I like that the overall design of my implementation (timeline holds rows, rows hold events) is fairly intuitive. I also like that I'm able to find the least number of rows to hold all my events without overlap.

## Changes I would make:

If I were to make this project again, I would want to use function components instead of class components so I can make use of hooks. Also, the current implementation uses absolute positioning to place the events in the row objects; I would look into a better positioning method, possibly with grid layout. As it stands, the absolute positioning of the events means the event objects are removed from the flow of the document, meaning that the rows holding said events must be re-sized to the correct height and width. The asynchronous nature of state also means that I have to use forceUpdate to update the row height, which is not efficient and breaks the react lifecycle in order to update the row height.

## Inspiration/Design:

I looked up images of how airtable displays timelines for inspiration. I came to my design decisions in an object-oriented fashion; the timeline holds rows, and each row holds events. I'd also spend more time styling the timeline.

## Testing:

Things I would test in my implementation:
* Do my rows only hold non-overlapping events?
* Will events that share a row not overlap each other? will rows not overlap each other? 
* Will my implementation lag if too many items are passed in, or if too many resizes occur?

Since these tests mainly depend on rendering the page, I would create end-to-end tests and mock the app using Jest. I'm not too familiar with Jest, but on a high level, using a variety of different timelineItems, I would verify that the page loads in a timely manner and that event divs do not overlap each other, and that on zooming, the height of the row is the height of its max child.
