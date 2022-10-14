# tailwindcss-calendar

## Installation
### CDN Requirement

Styling
```html
<!-- Calendar Styling -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss-calendar/dist/css/calendar.css">
<!-- Icon Required -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss-calendar/dist/css/nintrea@icons.css">
```
Caledar Declare
```html
<div id="evoCalendar" class="evoCalendar border w-full dark"></div>
```

Script
```html
<!-- Requried Jquery -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tailwindcss-calendar/dist/js/evo-calendar.js"></script>
```
Calendar Option
```js
$("#evoCalendar").evoCalendar(
{
    language                : 'en', // km
    sidebarDisplayDefault   : true, // false
    calendarEvents: [
        {
            id          : '1',              // Event's ID (required)
            name        : "New Year",       // Event name (required)
            date        : "October/1/2022", // Event date (required)
            type        : "holiday",        // Event type (required)
            everyYear   : true,             // Same event every year (optional)
            color       : "pink"            // optional
        },
        {
            id          : '2',
            name        : "Event Name Event Name Event Name",
            date        : ["October/13/2022", "October/15/2022"], // Date range
            description : "Description",
            badge       : "3Days",
            type        : "event",
            color       : "red"
        },
        {
            id          : '2',
            name        : "បុណ្យគម្រប់ខួបកំណើត ​នាយកធុច",
            date        : ["October/15/2022", "October/16/2022"],
            description : "កម្មវិធីនៅគេហដ្ឋានខាងស្រី",
            badge       : "២ថ្ងៃ",
            type        : "event",
            color       : "pink"
        },
    ]
});
```
### Install via NPM
```ruby
npm install -D tailwindcss-calendar
```
if you want to use existing demo go to
```
node_modules/tailwindcss-calendar/{source_code_here}
```


